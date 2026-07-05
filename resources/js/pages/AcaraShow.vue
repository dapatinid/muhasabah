<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Head, Link, useForm, router } from '@inertiajs/vue3'
import AppLayoutPublic from '@/layouts/AppLayoutPublic.vue'
import { toast } from 'vue-sonner'
import { 
  Tag, MapPin, HandHeart, CalendarDays, Calendar, Ticket, 
  Newspaper, SendHorizontal, Heart, Users, AlertCircle, MessageSquare,
  ArrowDownCircle, ChevronDown, QrCode, Upload, FileText, X, Share2 , Camera,
  MoreHorizontal, AlertTriangle,
  RefreshCw,
  CreditCard
} from 'lucide-vue-next'
import QrcodeVue from 'qrcode.vue'

const props = defineProps({
  acara: {
    type: Object,
    required: true
  },
  meta: {
    type: Object,
    default: null
  }
})

const formattedAuthors = computed(() => {
  // Ambil nama pembuat utama dari objek acara
  const mainUser = props.acara?.user?.name || 'Hamba Allah';
  const relatedUsers = props.acara?.users || [];

  if (relatedUsers.length === 0) {
    return mainUser;
  }

  // Ekstrak semua nama ke dalam satu array
  const names = [mainUser, ...relatedUsers.map(u => u.name || u.user?.name).filter(Boolean)];

  // Hapus duplikasi nama (mencegah nama pembuat utama terduplikasi)
  const uniqueNames = [...new Set(names)];

  // Logika format text
  if (uniqueNames.length === 1) return uniqueNames[0];
  if (uniqueNames.length === 2) return `${uniqueNames[0]} dan ${uniqueNames[1]}`;
  if (uniqueNames.length <= 3) {
    // Misal: "Yuda, Wira dan Zainal"
    return `${uniqueNames.slice(0, -1).join(', ')} dan ${uniqueNames[uniqueNames.length - 1]}`;
  }

  // Jika lebih dari 3 orang (Misal: "Yuda, Wira, Zainal dan 3 orang lainnya")
  const displayedNames = uniqueNames.slice(0, 3).join(', ');
  const remainingCount = uniqueNames.length - 3;
  
  return `${displayedNames} dan ${remainingCount} orang lainnya`;
});

// --- FORMATTING UTILITIES ---
const formatRupiah = (value) => {
  if (!value) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

// --- TAB DATA LOGIC ---
const activeTab = ref('cerita')

const tabItems = [
  { id: 'cerita',  label: 'Detail Acara',    icon: Calendar },
  { id: 'berita',  label: 'Maklumat',         icon: Newspaper },
  { id: 'komentar',label: 'Tanya Jawab',      icon: MessageSquare },
  { id: 'doa',     label: 'Donatur/Sponsor',  icon: HandHeart },
  { id: 'peserta', label: 'Peserta',          icon: Users },
]

// Carousel: selalu tampilkan 5 tab berputar dengan tab aktif di tengah
const orderedTabs = computed(() => {
  const index = tabItems.findIndex(tab => tab.id === activeTab.value)
  if (index === -1) return tabItems
  const n = tabItems.length
  return [
    tabItems[(index - 2 + n) % n],
    tabItems[(index - 1 + n) % n],
    tabItems[index],
    tabItems[(index + 1) % n],
    tabItems[(index + 2) % n],
  ]
})

const tabsContainerRef = ref(null)

const setActiveTab = (tabId) => {
  activeTab.value = tabId
  setTimeout(() => {
    const activeEl = tabsContainerRef.value?.querySelector('[data-active="true"]')
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, 50)
}

// --- COMPUTED DATA (SINKRONISASI CONTROLLER) ---
const totalDonasiMasukKepanitiaan = computed(() => {
  return Number(props.acara.total_donasi_masuk) || 0
})

const progressDonasiAcara = computed(() => {
  if (!props.acara.target_donasi || props.acara.target_donasi == 0) return 0
  const percent = (totalDonasiMasukKepanitiaan.value / props.acara.target_donasi) * 100
  return Math.min(Math.round(percent), 100)
})

// Memisahkan data Doa/Harapan (Hanya dari mutasi sponsor)
const doaParaPeserta = computed(() => {
  return props.acara.payments?.filter(p => p.mutation_type === 'sponsor') || []
})

// Memisahkan data Manifest Peserta (Hanya dari mutasi tiket)
const logDaftarPeserta = computed(() => {
  return props.acara.payments?.filter(p => p.mutation_type === 'tiket') || []
})

// Menghitung total pendaftar valid yang sukses/terverifikasi
const totalPesertaTerdaftar = computed(() => {
  return logDaftarPeserta.value
    // .filter(p => p.status === 'success')
    .reduce((sum, item) => sum + (item.jumlah_tiket ?? 1), 0)
})

// Sisa Kuota Realtime
const kuotaTersisa = computed(() => {
  const sisa = props.acara.kuota_tiket - (props.acara.tiket_terjual ?? 0)
  return sisa < 0 ? 0 : sisa
})

/**
 * LOGIKA BARU: Menghitung informasi ringkasan harga berdasarkan varian tiket
 */
const hargaInvestasiInfo = computed(() => {
  if (!props.acara.accept_tiket) {
    return { teks: 'DONASI', isGratis: false }
  }

  if (!props.acara.variants || props.acara.variants.length === 0) {
    return { teks: 'GRATIS', isGratis: true }
  }

  const listHarga = props.acara.variants.map(v => Number(v.harga))
  const hargaMin = Math.min(...listHarga)
  const hargaMax = Math.max(...listHarga)

  // Jika harga tertinggi adalah 0, maka gratis
  if (hargaMax === 0) {
    return { teks: 'GRATIS', isGratis: true }
  }

  // Jika semua varian harganya sama
  if (hargaMin === hargaMax) {
    return { teks: formatRupiah(hargaMin), isGratis: false }
  }

  // Jika ada rentang harga antar varian (misal: Rp50.000 - Rp150.000)
  return { teks: `${formatRupiah(hargaMin)} - ${formatRupiah(hargaMax)}`, isGratis: false }
})

// Status Registrasi Pendaftaran
const getStatusRegistrasiPendaftaran = computed(() => {
  if (props.acara.batas_registrasi) {
    const deadline = new Date(props.acara.batas_registrasi)
    if (new Date() > deadline) {
      return { tutup: true, teks: 'Pendaftaran Ditutup (Melewati Batas Waktu)' }
    }
  }
  if (props.acara.accept_tiket && kuotaTersisa.value <= 0) {
    return { tutup: true, teks: 'Kuota Kursi Sudah Habis' }
  }
  return { tutup: false, teks: 'Buka' }
})

// Relasi Pembantu: Mencari biaya infaq sistem yang berpasangan dengan pembayaran user
const getInfaqSistemUntukPeserta = (logPeserta) => {
  return props.acara.payments?.find(p => 
    p.mutation_type === 'infaq_sistem' && 
    p.no_wa === logPeserta.no_wa && 
    p.created_at === logPeserta.created_at
  )
}

// Status style pembayaran
const getPaymentStatus = (log) => {
  if (log.status === 'success') {
    // Bedakan teks status sukses antara peserta tiket dan donatur sponsor
    const teksSukses = log.mutation_type === 'tiket' ? 'Terverifikasi (Hadir)' : 'Terverifikasi (Donatur)'
    return { text: teksSukses, class: 'text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 text-[10px]' }
  }
  if (log.status === 'failed') {
    return { text: 'Dibatalkan', class: 'text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20 text-[10px]' }
  }
  if (!log.image) return { text: 'Menunggu Bukti Transfer', class: 'text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20 text-[10px]' }
  return { text: 'Menunggu Verifikasi', class: 'text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 text-[10px]' }
}

// --- SECURITY MATH CAPTCHA ---
const captchaNum1 = ref(0)
const captchaNum2 = ref(0)
const userCaptchaAnswer = ref('')

const generateCaptcha = () => {
  captchaNum1.value = Math.floor(Math.random() * 9) + 1
  captchaNum2.value = Math.floor(Math.random() * 9) + 1
  userCaptchaAnswer.value = ''
}

// --- INERTIA FORM KOMENTAR ---
const commentForm = useForm({
  nama_publik: '',
  body: '',
  captcha_challenge: computed(() => `${captchaNum1.value}+${captchaNum2.value}`),
  captcha_answer: ''
})

const isSubmittingComment = ref(false)

const submitKomentar = () => {

  commentForm.captcha_answer = userCaptchaAnswer.value
  isSubmittingComment.value = true
  commentForm.post(`/acara/${props.acara.slug}/komentar`, {
    preserveScroll: true,
    onSuccess: () => {
      commentForm.reset('body', 'nama_publik')
      generateCaptcha()
    },
    onFinish: () => {
      isSubmittingComment.value = false
    }
  })
}

// --- REAKSI ---
const selectedReaksi = ref(null)
const isSubmittingReaction = ref(false)
const reaksiList = [
  { type: 'takjub',  emoji: '❤️',  label: 'Takjub'      },
  { type: 'suka',  emoji: '👍',  label: 'Suka'             },
  { type: 'penuh_doa',  emoji: '🤲',  label: 'Penuh Doa' },
  { type: 'tidak_hadir',   emoji: '😢',  label: 'Tidak Hadir'       },
]

const reaksiCount = computed(() => {
  const counts = { takjub: 0, suka: 0, penuh_doa: 0, tidak_hadir: 0 }
  props.acara.reaksis?.forEach(r => { counts[r.type]++ })
  return counts
})

const toggleReaksi = (type) => {
  if (isSubmittingReaction.value) return
  isSubmittingReaction.value = true

  useForm({ type }).post(`/acara/${props.acara.slug}/reaksi`, {
    preserveScroll: true,
    onSuccess: () => {
      selectedReaksi.value = selectedReaksi.value === type ? null : type
    },
    onFinish: () => {
      isSubmittingReaction.value = false
    }
  })
}

// --- ACCORDION LOG MANIFEST ---
const expandedLogs = ref([])
const toggleLog = (id) => {
  if (expandedLogs.value.includes(id)) {
    expandedLogs.value = expandedLogs.value.filter(logId => logId !== id)
  } else {
    expandedLogs.value.push(id)
  }
}

// --- PENGELOLAAN UPLOAD SUSULAN ---
const uploadFile = ref({})
const isUploading = ref({})

const handleBuktiChange = (e, logId) => {
  const target = e.target
  if (target.files && target.files.length > 0) {
    uploadFile.value[logId] = target.files[0]
  }
}

const submitBukti = (logId) => {
  if (!uploadFile.value[logId]) return
  isUploading.value[logId] = true

  router.post(`/payment/${logId}/upload-bukti`, {
    bukti_transaksi: uploadFile.value[logId],
  }, {
    preserveScroll: true,
    onSuccess: () => {
      uploadFile.value[logId] = null
      toast.success('Bukti transfer berhasil dikirim. Menunggu verifikasi admin.')
    },
    onError: () => {
      toast.error('Gagal mengupload bukti transfer. Periksa format/ukuran file.')
    },
    onFinish: () => {
      isUploading.value[logId] = false
    }
  })
}

// --- QRIS MODAL CONTROL ---
const activeQrisModal = ref(false)
const selectedQrisLog = ref(null)

const openQrisModal = (log) => {
  selectedQrisLog.value = log
  activeQrisModal.value = true
}
const closeQrisModal = () => {
  activeQrisModal.value = false
  selectedQrisLog.value = null
}

// === TAMBAHKAN LOGIKA QRIS DINAMIS DI SINI ===
const dynamicQrisString = computed(() => {
  if (!selectedQrisLog.value) return "";

  // Hitung total bayar = Nominal Tiket/Sponsor + Nominal Infaq (jika ada)
  const amount = Number(selectedQrisLog.value.nominal) + Number(getInfaqSistemUntukPeserta(selectedQrisLog.value)?.nominal || 0);
  
  const baseQris = "00020101021126610014COM.GO-JEK.WWW01189360091438029302900210G8029302900303UMI51440014ID.CO.QRIS.WWW0215ID10265182630370303UMI5204839853033605802ID5925muhasabah id, Sosial Kema6006KENDAL61055135562070703A0163041A3A";
  
  // Kembalikan QRIS statis jika nominal tidak valid
  if (amount <= 0) return baseQris;

  // 1. Potong 4 digit CRC lama ('1A3A')
  let qris = baseQris.slice(0, -4);
  
  // 2. Ubah tipe menjadi Dinamis
  qris = qris.replace("010211", "010212");
  
  // 3. Bangun & Sisipkan Nominal Tag 54
  const amtStr = amount.toString();
  const amtLen = amtStr.length.toString().padStart(2, '0');
  const tag54 = `54${amtLen}${amtStr}`;
  qris = qris.replace("5303360", `5303360${tag54}`);
  
  // 4. Kalkulasi ulang CRC-16
  let crc = 0xFFFF;
  for (let c = 0; c < qris.length; c++) {
      crc ^= qris.charCodeAt(c) << 8;
      for (let i = 0; i < 8; i++) {
          if (crc & 0x8000) {
              crc = (crc << 1) ^ 0x1021;
          } else {
              crc = crc << 1;
          }
      }
  }
  const crcHex = (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  
  return qris + crcHex;
});

// --- UTILITIES (COPY & SHARE) ---
const handleCopyPeserta = () => {
  let textText = `REKAP MANIFEST ACARA: ${props.acara.judul}\n`
  textText += `Total Terdaftar Valid: ${totalPesertaTerdaftar.value} Jamaah\n\n`
  logDaftarPeserta.value.forEach((l, idx) => {
    textText += `${idx + 1}. ${l.atas_nama} (${l.jumlah_tiket ?? 1} Kursi) - [${l.status.toUpperCase()}]\n`
  })
  navigator.clipboard.writeText(textText)
    .then(() => toast.success('Rekap manifest peserta berhasil disalin ke clipboard.'))
    .catch(() => toast.error('Gagal menyalin rekap manifest.'))
}

// --- FUNGSI SHARE ACARA ---
const handleShare = async () => {
  const shareUrl = `${window.location.origin}/acara/${props.acara.slug}`
  const shareTitle = props.acara.judul
  const shareText = `Ikuti dan bergabunglah dalam agenda: "${props.acara.judul}"`

  if (navigator.share) {
    try {
      await navigator.share({ title: shareTitle, text: shareText, url: shareUrl })
    } catch (err) {
      // Dibatalkan oleh user
    }
  } else {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Link acara berhasil disalin ke clipboard!')
    } catch (err) {
      toast.error('Gagal menyalin link acara.')
    }
  }
}

// --- STICKY NAVIGATION STICKER ---
const isTabsSticky = ref(false)
const tabsTargetRef = ref(null)
let observer = null

onMounted(() => {
  generateCaptcha()

  observer = new IntersectionObserver(
    ([entry]) => { isTabsSticky.value = !entry.isIntersecting },
    { rootMargin: '-1px 0px 0px 0px', threshold: 0 }
  )
  if (tabsTargetRef.value) observer.observe(tabsTargetRef.value)

  setTimeout(() => {
    const activeEl = tabsContainerRef.value?.querySelector('[data-active="true"]')
    if (activeEl) activeEl.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, 400)
})

onUnmounted(() => {
  if (observer && tabsTargetRef.value) observer.unobserve(tabsTargetRef.value)
  closeCamera()
})

onMounted(() => {
  // Ambil parameter dari URL browser
  const urlParams = new URLSearchParams(window.location.search)
  const activeTabParam = urlParams.get('tab')

  // Jika parameternya adalah 'pendaftaran' atau 'peserta'
  if (activeTabParam === 'pendaftaran') {
    
    // 1. Wajib ubah activeTab terlebih dahulu agar konten dirender
    activeTab.value = 'peserta' 
    
    // 2. (Opsional) Bersihkan URL seperti di fitur Donasi agar rapi
    const newUrl = window.location.pathname
    window.history.replaceState({}, document.title, newUrl)

    // 3. Gunakan setTimeout (seperti di Donasi) untuk memastikan DOM sudah selesai dirender
    setTimeout(() => {
      const element = document.getElementById('konten-peserta') || document.querySelector('[data-active="true"]')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 300)

  } 

  else if (activeTabParam === 'donatur') {
    
    // 1. Wajib ubah activeTab terlebih dahulu agar konten dirender
    activeTab.value = 'doa' 
    
    // 2. (Opsional) Bersihkan URL seperti di fitur Donasi agar rapi
    const newUrl = window.location.pathname
    window.history.replaceState({}, document.title, newUrl)

    // 3. Gunakan setTimeout (seperti di Donasi) untuk memastikan DOM sudah selesai dirender
    setTimeout(() => {
      const element = document.getElementById('donasi-sponsor') || document.querySelector('[data-active="true"]')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 300)

  } 
  // Dukungan tambahan jika user membuka ?tab=berita atau tab lainnya
  else if (activeTabParam && tabItems.some(t => t.id === activeTabParam)) {
    activeTab.value = activeTabParam
    
    const newUrl = window.location.pathname
    window.history.replaceState({}, document.title, newUrl)
    
    setTimeout(() => {
      const element = document.querySelector('[data-active="true"]')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 300)
  }
})

// Formating helper untuk teks
function formatSingkat(teks) {
  if (!teks) return '';

  // Fungsi internal untuk mengubah satu angka (string/number) menjadi teks singkat
  const formatAngka = (nilai) => {
    // Ambil hanya angka dari string (menghapus 'Rp', titik, atau spasi jika ada)
    const angka = parseInt(nilai.toString().replace(/[^0-9]/g, ''), 10);
    
    if (isNaN(angka)) return nilai; // Kembalikan teks asli jika bukan angka

    if (angka >= 1000000) {
      const juta = angka / 1000000;
      // .replace('.', ',') digunakan jika ada desimal seperti 1,5 juta
      return `Rp ${juta.toString().replace('.', ',')}juta`;
    } else if (angka >= 1000) {
      const ribu = angka / 1000;
      return `Rp ${ribu}ribu`;
    }
    
    return `Rp ${angka}`;
  };

  // Jika inputnya adalah rentang (misal: "Rp 100.000 - Rp 2.000.000")
  if (teks.includes('-')) {
    const bagian = teks.split('-');
    return `${formatAngka(bagian[0]).trim()} - ${formatAngka(bagian[1]).trim()}`;
  }

  // Jika inputnya hanya satu angka biasa (misal: "Rp 100.000")
  return formatAngka(teks);
}

// --- STATE & FUNGSI KAMERA GLOBAL ---
const isCameraOpen = ref(false)
const cameraForLogId = ref(null)
const videoElement = ref(null)
const canvasElement = ref(null)
const cameraStream = ref(null)

const openCamera = async (logId) => {
    cameraForLogId.value = logId
    isCameraOpen.value = true
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
        })
        cameraStream.value = stream
        
        setTimeout(() => {
            if (videoElement.value) {
                videoElement.value.srcObject = stream
            }
        }, 100)
    } catch (err) {
        console.error("Akses kamera ditolak:", err)
        alert("Gagal mengakses kamera. Pastikan browser memiliki izin.")
        isCameraOpen.value = false
        cameraForLogId.value = null
    }
}

const closeCamera = () => {
    if (cameraStream.value) {
        cameraStream.value.getTracks().forEach(track => track.stop())
        cameraStream.value = null
    }
    isCameraOpen.value = false
    cameraForLogId.value = null
}

const takePhoto = () => {
    if (videoElement.value && canvasElement.value && cameraForLogId.value !== null) {
        const video = videoElement.value
        const canvas = canvasElement.value
        const logId = cameraForLogId.value
        
        // 1. Cegah error jika video (metadata kamera) belum termuat sempurna
        if (video.videoWidth === 0 || video.videoHeight === 0) {
            toast.error("Kamera sedang menyesuaikan, silakan coba jepret lagi.")
            return
        }

        // 2. AUTO-RESIZE: Tetapkan lebar maksimal agar ukuran file tidak bengkak
        const MAX_WIDTH = 800 // Maksimal lebar gambar 800 pixel
        let width = video.videoWidth
        let height = video.videoHeight

        // Hitung rasio tinggi yang baru jika lebar melebihi batas
        if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width)
            width = MAX_WIDTH
        }
        
        canvas.width = width
        canvas.height = height
        
        const context = canvas.getContext('2d')
        if (context) {
            // Gambar video ke canvas dengan ukuran yang sudah di-resize
            context.drawImage(video, 0, 0, width, height)
            
            // 3. KOMPRESI: Ubah ke blob dengan kualitas 0.7 (70%) agar sangat ringan
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], `bukti_transaksi_${logId}_${Date.now()}.jpg`, { type: 'image/jpeg' })
                    
                    // 4. Perbaikan Reaktivitas Vue: Gunakan spread operator agar UI langsung merender perubahannya
                    uploadFile.value = { 
                        ...uploadFile.value, 
                        [logId]: file 
                    }
                    
                    closeCamera()
                }
            }, 'image/jpeg', 0.7)
        }
    }
}

// --- STATE & POLLING INTEGRASI MAYAR ---
const isGeneratingMayar = ref({})
const isMayarModalOpen = ref(false)
const mayarLink = ref('')
const activeMayarPaymentId = ref(null)
let mayarPollingInterval = null

const startPolling = () => {
    // Cek status real-time pembayaran setiap 5 detik
    mayarPollingInterval = setInterval(() => {
        router.reload({ 
            only: ['acara'], 
            onSuccess: () => {
                if (activeMayarPaymentId.value) {
                    const payment = props.acara.payments?.find(
                        p => p.id === activeMayarPaymentId.value
                    )
                    if (payment?.status === 'success') {
                        toast.success('Pembayaran instan berhasil dikonfirmasi secara otomatis! 🎉')
                        closeMayarModal()
                    }
                }
            }
        })
    }, 5000)
}

const stopPolling = () => {
    if (mayarPollingInterval) {
        clearInterval(mayarPollingInterval)
        mayarPollingInterval = null
    }
}

const payWithMayar = (logId) => {
    if (isGeneratingMayar.value[logId]) return
    isGeneratingMayar.value[logId] = true

    router.post(`/payment/${logId}/mayar`, {}, {
        preserveScroll: true,
        onSuccess: (page) => {
            const link = page.props.flash?.info
            if (link) {
                mayarLink.value = link
                activeMayarPaymentId.value = logId
                isMayarModalOpen.value = true
                startPolling()
            } else if (page.props.flash?.error) {
                toast.error(page.props.flash.error)
            }
        },
        onError: () => {
            toast.error('Terjadi kesalahan jaringan sistem.')
        },
        onFinish: () => {
            isGeneratingMayar.value[logId] = false
        }
    })
}

const closeMayarModal = () => {
    stopPolling()
    isMayarModalOpen.value = false
    mayarLink.value = ''
    activeMayarPaymentId.value = null
    router.reload({ only: ['acara'] })
}

// Pastikan polling dibersihkan saat komponen di-unmount agar tidak membocorkan memori
onUnmounted(() => {
    stopPolling()
})


// --- Helper Link WhatsApp Laporan ---
const baseUrl = ref('')
const activeDropdownId = ref(null)

onMounted(() => {
  baseUrl.value = window.location.origin
  window.addEventListener('click', closeDropdowns)
})

function getWhatsAppReportLink(slug) {
  const baseUrl = window.location.origin
  const fullUrl = `${baseUrl}/acara/${slug}`
  const text = encodeURIComponent(`Izin melaporkan konten: ${fullUrl}`)
  return `https://wa.me/6285950540055?text=${text}` // Sesuaikan nomor WA tujuan laporan Anda
}

const toggleDropdown = (id) => {
  activeDropdownId.value = activeDropdownId.value === id ? null : id
}

function closeDropdowns() {
  activeDropdownId.value = null
}

// State untuk mengontrol visibilitas dropdown
const showAuthorDropdown = ref(false);

// Mengumpulkan semua data penulis (utama & relasi) untuk dropdown
const authorList = computed(() => {
  if (props.acara.is_anonymous) return [];

  const list = [];
  
  // 1. Masukkan penulis utama
  if (props.acara.user) {
    list.push(props.acara.user);
  }

  // 2. Masukkan penulis tambahan dari relasi
  if (props.acara.users && props.acara.users.length > 0) {
    props.acara.users.forEach(item => {
      // Cerdas mendeteksi: Jika 'item' memiliki 'name', berarti itu langsung objek user. 
      // Jika tidak, kita coba cari di dalam 'item.user'
      const authorData = item.name ? item : item.user;
      
      if (authorData && authorData.id) {
        // Mencegah duplikasi jika penulis utama terdaftar juga di relasi
        if (!list.find(u => u.id === authorData.id)) {
          list.push(authorData);
        }
      }
    });
  }
  
  return list;
});

</script>

<template>
  <Head>
    <title>{{ acara.judul }}</title>
    <meta v-if="meta" name="description" :content="meta.description" />
    <meta v-if="meta" property="og:title" :content="meta.title" />
    <meta v-if="meta" property="og:description" :content="meta.description" />
    <meta v-if="meta" property="og:image" :content="meta.image" />
    <meta v-if="meta" property="og:url" :content="meta.url" />
    <meta property="og:type" content="website" />
  </Head>

  <AppLayoutPublic :subtitle="acara.subkategori" :title="acara.judul" :show-back="true" back-href="/acara">  

    <main class="px-5 py-8 space-y-8 pb-32">

      <div class="space-y-6">
        <div class="space-y-3">
          <div class="flex justify-between items-center"> 
            <span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              <Tag class="w-3 h-3" />
              {{ acara.kategori }} / {{ acara.subkategori }}
            </span>
            
            <span class="relative">
              <button @click.stop="toggleDropdown(acara.id)" class="text-amber-400 p-1 rounded-full">
                <MoreHorizontal class="size-5" />
              </button>
              
              <div v-if="activeDropdownId === acara.id" 
                class="absolute right-0 mt-1 w-48 bg-stone-900 border border-stone-800 rounded-xl shadow-xl py-1 z-30 animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <a :href="getWhatsAppReportLink(acara.slug)"
                    target="_blank"
                    class="flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:bg-stone-800/60 transition-colors font-medium"
                >
                  <AlertTriangle class="size-3.5 text-red-500" />
                  Laporkan konten
                </a>
              </div>
            </span>
          </div>
          <h1 class="text-2xl md:text-3xl font-bold leading-tight text-amber-100">{{ acara.judul }}</h1>
          <p class="text-sm text-stone-400 flex items-center gap-2">
            <MapPin class="size-4 text-red-400 shrink-0" /> {{ acara.lokasi }}
          </p>
        </div>

        <div class="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-xl">
          
        <div v-if="Boolean(acara.accept_tiket)" class="flex items-center justify-between gap-4 border-b border-stone-800/60 pb-4 w-full min-w-0">
          <div class="space-y-1 min-w-0 flex-1">
            <p class="text-[10px] text-stone-500 uppercase font-bold tracking-wider">Investasi Kegiatan</p>
            <p class="md:text-xl text-sm font-black font-mono truncate" :class="hargaInvestasiInfo.isGratis ? 'text-emerald-400' : 'text-stone-100'">
              {{ formatSingkat(hargaInvestasiInfo.teks) }}
            </p>
          </div>
          
          <div class="space-y-1 text-right shrink-0">
            <p class="text-[10px] text-stone-500 uppercase font-bold tracking-wider">Sisa Kursi</p>
            <p class="md:text-xl text-lg font-black text-amber-400 font-mono">{{ kuotaTersisa }} / {{ acara.kuota_tiket }}</p>
          </div>
        </div>

          <div v-if="Boolean(acara.accept_donasi)" class="space-y-2 pt-1">
            <div class="flex justify-between items-end text-[11px]">
              <span class="text-stone-400 font-medium flex items-center gap-1">
                <HandHeart class="size-3.5 text-amber-500" /> Patungan Op. Acara
              </span>
              <span class="font-bold text-amber-400 font-mono text-right">{{ formatRupiah(totalDonasiMasukKepanitiaan) }} / {{ formatRupiah(acara.target_donasi) }}</span>
            </div>
            <div class="h-2 w-full bg-stone-800 rounded-full overflow-hidden">
              <div 
                class="h-full rounded-full transition-all duration-1000" 
                :style="{ 
                  width: progressDonasiAcara + '%',
                  background: 'linear-gradient(to right, #d97706, #fbbf24)' 
                }"
              ></div>
            </div>
            <div class="flex justify-between items-center text-[10px] text-stone-500">
              <span>Dana Kepanitiaan Terkumpul</span>
              <span class="font-bold text-stone-400 font-mono">{{ progressDonasiAcara }}% Terpenuhi</span>
            </div>
          </div>

          <div class="flex items-center justify-between text-xs text-stone-500 pt-1">
            <span class="flex items-center gap-1.5"><CalendarDays class="w-3.5 h-3.5" /> Pelaksanaan:</span>
            <span class="font-medium text-stone-300 font-mono">{{ new Date(acara.tgl_mulai).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}) }}</span>
          </div>

          <Link 
            v-if="!getStatusRegistrasiPendaftaran.tutup"
            :href="`/acara/${acara.slug}/payment`"
            class="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-400 text-white font-black py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-amber-600/20"
          >
            <Ticket class="w-5 h-5" />
            <span>
              {{ acara.accept_donasi ? 'REGISTRASI / DONASI' : 'REGISTRASI' }}
            </span>
          </Link>
          
          <div v-else class="w-full bg-stone-800 text-stone-500 font-bold px-3 py-3.5 rounded-2xl text-center text-xs uppercase tracking-wider border border-stone-700/50">
            ❌ {{ getStatusRegistrasiPendaftaran.teks }}
          </div>
        </div>   
        
        <div class="space-y-4 -mb-8">
          <div class="grid grid-cols-2 gap-2 w-full">
            <button 
              v-for="r in reaksiList" 
              :key="r.type" 
              type="button" 
              @click="toggleReaksi(r.type)" 
              :disabled="isSubmittingReaction" 
              class="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border text-xs font-bold transition-all bg-stone-900 active:scale-95 disabled:opacity-50 w-full" 
              :class="[selectedReaksi === r.type ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-stone-800 text-stone-400 hover:border-amber-500/40']"
            >
              <span>{{ r.emoji }}</span>
              <span>{{ r.label }}</span>
              <span v-if="reaksiCount[r.type]" class="ml-1 opacity-60 font-mono text-amber-400">({{ reaksiCount[r.type] }})</span>
            </button>
          </div>
        </div>        
      </div>

      <div ref="tabsTargetRef" class="w-full h-px invisible"></div>
      <div :class="['bg-stone-950 border-b border-stone-800 transition-all duration-150 z-40', isTabsSticky ? 'fixed top-0 left-0 right-0 max-w-xl mx-auto px-0 shadow-xl pt-1' : 'relative -mx-5 px-0 mt-4']">
        <div ref="tabsContainerRef" class="flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth w-full" style="-webkit-overflow-scrolling: touch; scroll-padding: 0 24px;">
          <div class="flex flex-nowrap min-w-full justify-start items-center px-4">
            <div class="w-[35%] shrink-0 snap-center"></div>
            <button
              v-for="tab in orderedTabs"
              :key="tab.id"
              @click="setActiveTab(tab.id)"
              type="button"
              :data-active="activeTab === tab.id"
              :class="['flex items-center justify-center gap-2 py-4 px-6 text-sm font-bold border-b-2 transition-all whitespace-nowrap snap-center mx-1', activeTab === tab.id ? 'border-amber-500 text-amber-400 bg-gradient-to-t from-amber-500/5 to-transparent' : 'border-transparent text-stone-500 hover:text-stone-300']"
            >
              <component :is="tab.icon" class="w-4 h-4 shrink-0" />
              <span>{{ tab.label }}</span>
              <span v-if="tab.id === 'komentar' && (acara.komentars?.length || 0) > 0" class="text-xs px-1.5 py-0.5 bg-stone-800 text-stone-400 rounded-md font-mono ml-1">{{ acara.komentars?.length || 0 }}</span>
              <span v-if="tab.id === 'doa' && doaParaPeserta.length > 0" class="text-xs px-1.5 py-0.5 bg-stone-800 text-stone-400 rounded-md font-mono ml-1">{{ doaParaPeserta.length }}</span>
              <span v-if="tab.id === 'peserta' && logDaftarPeserta.length > 0" class="text-xs px-1.5 py-0.5 bg-stone-800 text-stone-400 rounded-md font-mono ml-1">{{ logDaftarPeserta.length }}</span>
            </button>
            <div class="w-[35%] shrink-0 snap-center"></div>
          </div>
        </div>
      </div>     
      <div v-if="isTabsSticky" class="h-[53px]"></div>         

      <div v-if="activeTab === 'cerita'" class="space-y-8">
        <div class="space-y-4">
          
          <p class="text-[10px] font-bold uppercase tracking-widest text-stone-500 border-l-2 border-amber-500 pl-3 flex items-center gap-2">
            <span class="text-nowrap">Oleh : </span>
            <span class="relative flex items-center">
              <button
                type="button"
                @click="showAuthorDropdown = !showAuthorDropdown"
                @blur="setTimeout(() => showAuthorDropdown = false, 200)"
                :disabled="acara.is_anonymous"
                class="text-left font-medium text-emerald-500 hover:text-emerald-400 transition-colors focus:outline-none"
                :class="{ 'text-stone-400 hover:text-stone-400 cursor-default': acara.is_anonymous }"
              >
                {{ formattedAuthors }}
              </button>

              <transition 
                enter-active-class="transition ease-out duration-100" 
                enter-from-class="transform opacity-0 scale-95" 
                enter-to-class="transform opacity-100 scale-100" 
                leave-active-class="transition ease-in duration-75" 
                leave-from-class="transform opacity-100 scale-100" 
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-if="showAuthorDropdown && !acara.is_anonymous"
                  class="absolute left-0 top-full mt-2 w-48 bg-stone-900 border border-stone-700 rounded-lg shadow-xl z-50 overflow-hidden"
                >
                  <div class="py-1">
                    <Link
                      v-for="author in authorList"
                      :key="author.id"
                      :href="`/tokoh/${author.slug}`"
                      class="block px-4 py-2 text-sm text-stone-300 hover:bg-stone-800 hover:text-amber-400 transition-colors"
                    >
                      {{ author.name }}
                    </Link>
                  </div>
                </div>
              </transition>
            </span>
          </p>
          <div class="prose prose-invert prose-stone max-w-none prose-p:text-stone-300 prose-p:leading-relaxed prose-p:text-[15px] prose-headings:text-amber-100 prose-strong:text-amber-200 prose-img:rounded-3xl prose-img:border-stone-800" v-html="acara.body" />
        </div>
      </div>

      <div v-if="activeTab === 'berita'" class="space-y-8">
        <div class="space-y-4">
          <p class="text-[10px] font-bold uppercase tracking-widest text-stone-500 border-l-2 border-amber-500 pl-3">Informasi Terkini / Instruksi Panitia</p>
          <div v-if="acara.progress && acara.progress.trim() !== '<p></p>'" class="prose prose-invert prose-stone max-w-none prose-p:text-stone-300 prose-p:leading-relaxed prose-p:text-[15px] prose-headings:text-amber-100 prose-strong:text-amber-200 prose-img:rounded-3xl prose-img:border-stone-800" v-html="acara.progress" />
          <div v-else class="text-center py-12 text-stone-600 text-xs border border-stone-800 bg-stone-900/30 border-dashed rounded-3xl">
            <Newspaper class="w-8 h-8 mx-auto mb-3 opacity-30" />
            Belum ada maklumat atau info baru dari panitia.
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'komentar'" class="space-y-6">
        <form @submit.prevent="submitKomentar" class="bg-stone-900 border border-stone-800/80 rounded-3xl p-5 space-y-4">
          <p class="text-[10px] font-bold uppercase tracking-widest text-amber-400">Ajukan Pertanyaan Kegiatan</p>
          <div class="space-y-3">
            <input v-if="!$page.props.auth.user" v-model="commentForm.nama_publik" type="text" placeholder="Nama Anda (Wajib isi)" class="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/50 transition-colors" />
            <textarea v-model="commentForm.body" required rows="3" placeholder="Tulis hal atau konfirmasi detail teknis yang ingin ditanyakan ke panitia..." class="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/50 transition-colors resize-none"></textarea>
          </div>
          <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div v-if="!$page.props.auth.user" class="flex items-center gap-2 bg-stone-950 px-3 py-2 rounded-xl border border-stone-800">
              <span class="text-xs font-mono text-stone-400 font-bold select-none tracking-wider">Jawab: {{ captchaNum1 }} + {{ captchaNum2 }} = </span>
              <input v-model="userCaptchaAnswer" type="number" required placeholder="?" class="w-12 bg-transparent text-center font-bold text-xs text-amber-400 focus:outline-none font-mono" />
            </div>
            <button type="submit" :disabled="isSubmittingComment || !commentForm.body" class="ms-auto flex items-center gap-2 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-800 disabled:text-stone-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all active:scale-95 shadow-md">
              <SendHorizontal class="w-3.5 h-3.5" />
              <!-- {{ isSubmittingComment ? 'Mengirim...' : 'Kirim' }} -->
            </button>
          </div>
        </form>

        <div class="space-y-4 pt-2">
          <p class="text-[10px] font-bold uppercase tracking-widest text-stone-500">Ruang Diskusi & Tanya Jawab</p>
          <div v-if="acara.komentars?.length === 0" class="text-center py-8 text-stone-600 text-xs border border-stone-900 border-dashed rounded-2xl">
            Belum ada diskusi atau pertanyaan publik mengenai agenda ini.
          </div>
          <div v-else class="space-y-3">
            <div v-for="komentar in acara.komentars" :key="komentar.id" class="bg-stone-900/20 border border-stone-800 rounded-2xl p-4">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-bold text-amber-200">{{ komentar.nama_publik || komentar.user?.name || 'Hamba Allah' }}</span>
                <span class="text-[9px] text-stone-600 font-mono">• {{ new Date(komentar.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'}).replace('pukul', '|')}}</span>
              </div>
              <p class="text-sm text-stone-400 leading-relaxed">{{ komentar.body }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'doa'" id="donasi-sponsor" class="space-y-6">
        <div class="space-y-4">
          <p class="text-[10px] font-bold uppercase tracking-widest text-emerald-500 border-l-2 border-emerald-500 pl-3">
            Daftar Patungan & Harapan Donatur ({{ doaParaPeserta.length }})
          </p>
          
          <div v-if="doaParaPeserta.length === 0" class="text-center py-10 border border-dashed border-stone-900 rounded-3xl text-stone-600 text-sm">
            <Heart class="w-5 h-5 mx-auto mb-2 opacity-30" />
            Belum ada catatan khusus atau motivasi donasi yang masuk.
          </div>

          <div v-else class="space-y-3">
            <div 
              v-for="pay in doaParaPeserta" 
              :key="pay.id" 
              class="border rounded-2xl p-4 transition-all duration-200 shadow-sm select-none"
              :class="[
                !expandedLogs.includes(pay.id)
                  ? 'bg-stone-900/40 border-stone-800/60 hover:bg-stone-900/80 hover:border-stone-700 cursor-pointer' 
                  : 'bg-stone-900/90 border-amber-500 shadow-lg shadow-amber-500/5 cursor-pointer'
              ]"
              @click="toggleLog(pay.id)"
            >
              <div class="flex gap-4 items-center justify-between">
                <div class="flex items-center gap-3.5 min-w-0">
                  <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border bg-amber-500/10 border-amber-500/20 text-amber-400">
                    <HandHeart class="w-4.5 h-4.5" />
                  </div>
                  <div class="min-w-0">
                    <h4 class="text-xs font-bold text-stone-200 truncate pr-2 uppercase">
                      {{ pay.atas_nama === 'Hamba Allah' ? '' : pay.sapaan }} {{ pay.atas_nama }}
                    </h4>
                    <p class="text-[11px] text-stone-500 w-full italic" :class="expandedLogs.includes(pay.id) ? 'line-clamp-none' : 'line-clamp-2'">
                      {{ pay.notes && pay.notes !== '-' ? `"${pay.notes}"` : 'Donasi Operasional' }}
                    </p>
                  </div>
                </div>

                <div class="flex flex-col items-end space-y-0.5 shrink-0">
                  <span class="text-sm font-bold font-mono text-emerald-400">
                    + {{ formatRupiah(pay.nominal) }}
                  </span>
                  
                  <div class="flex items-center gap-1">
                    <span class="text-[10px] text-stone-600 font-medium font-mono">
                      {{ new Date(pay.created_at).toLocaleDateString('id-ID') }}
                    </span>
                    <ChevronDown class="w-4 h-4 text-stone-600 transition-transform duration-300" :class="expandedLogs.includes(pay.id) ? 'rotate-180' : ''" />
                  </div>
                </div>
              </div>

              <!-- ACCORDION DETAIL DONASI -->
              <div v-if="expandedLogs.includes(pay.id)" class="mt-4 pt-4 border-t border-stone-800/60 space-y-4 cursor-default" @click.stop>
                
                <div class="flex items-center justify-between text-xs bg-stone-950 p-2.5 rounded-xl border border-stone-800/50">
                  <span class="text-stone-500 font-bold uppercase tracking-widest text-[9px]">Status</span>
                  <span class="font-bold flex items-center gap-1.5" :class="getPaymentStatus(pay).class">
                    <span class="relative flex h-2 w-2" v-if="pay.status !== 'success'">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current"></span>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                    </span>
                    {{ getPaymentStatus(pay).text }}
                  </span>
                </div>

                <template v-if="pay.status !== 'success'">
                  <div v-if="!pay.image" class="p-4 rounded-2xl bg-stone-950 border border-stone-800/80 space-y-4">
                    <div class="flex flex-col items-center justify-center p-4 bg-stone-900/50 rounded-xl border border-stone-800 border-dashed">
                      <button 
                        type="button" 
                        @click="openQrisModal(pay)"
                        class="w-full flex items-center justify-center gap-2 bg-stone-900 border border-stone-800 hover:border-amber-500/40 text-amber-400 hover:text-amber-300 text-xs font-bold py-3 px-4 rounded-xl transition-all active:scale-98 shadow-sm"
                      >
                        <QrCode class="w-4 h-4" />
                        Tampilkan QRIS
                      </button>
                    </div>
                    
                    <div class="pt-4 border-t border-stone-800/60 space-y-3">
                      <label class="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                        <Upload class="size-3.5 text-amber-500" /> Upload Bukti Transfer Susulan
                      </label>
                      
                      <div v-if="!uploadFile[pay.id]" class="grid grid-cols-2 gap-2"> <!-- Ganti pay.id menjadi log.id khusus untuk di tab peserta -->
                        <!-- Pilih Galeri -->
                        <label class="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-2xl cursor-pointer transition-all bg-stone-900 border-stone-800 hover:border-amber-500/40">
                          <Upload class="size-5 text-stone-600 mb-2" />
                          <p class="text-[10px] text-stone-400 font-medium">Pilih Galeri</p>
                          <input type="file" accept="image/*" class="hidden" @change="(e) => handleBuktiChange(e, pay.id)" /> <!-- Ganti pay.id menjadi log.id di tab peserta -->
                        </label>
                        
                        <!-- Buka Kamera -->
                        <button type="button" @click="openCamera(pay.id)" class="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-2xl cursor-pointer transition-all bg-stone-900 border-stone-800 hover:border-amber-500/40 text-stone-400 hover:text-amber-400"> <!-- Ganti pay.id menjadi log.id di tab peserta -->
                          <Camera class="size-5 mb-2" />
                          <p class="text-[10px] font-medium">Buka Kamera</p>
                        </button>
                      </div>
                      
                      <div v-else class="relative flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-2xl transition-all bg-amber-500/5 border-amber-500/30">
                        <button type="button" @click="uploadFile[pay.id] = null" class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg z-10 transition-colors"> <!-- Ganti pay.id menjadi log.id di tab peserta -->
                            <X class="size-3" />
                        </button>
                        <FileText class="size-5 text-amber-500 mb-2" />
                        <p class="text-[11px] text-amber-400 font-bold max-w-[200px] truncate">{{ uploadFile[pay.id]?.name }}</p> <!-- Ganti pay.id menjadi log.id di tab peserta -->
                        <p class="text-[9px] text-stone-500 mt-1">Hapus untuk mengganti</p>
                      </div>

                      <button
                        v-if="uploadFile[pay.id]" 
                        @click="submitBukti(pay.id)" 
                        class="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all active:scale-95 shadow-md"
                        :disabled="isUploading[pay.id]"
                      > <!-- Ganti pay.id menjadi log.id di tab peserta -->
                        {{ isUploading[pay.id] ? 'MENGUPLOAD...' : 'KIRIM BUKTI VERIFIKASI' }}
                      </button>
                    </div>   
                    
                    <div class="relative flex items-center gap-3 my-4 opacity-50">
                          <div class="border-t border-stone-800 flex-1"></div>
                          <span class="text-[10px] text-stone-500 font-bold uppercase tracking-wider">ATAU LEBIH MUDAH</span>
                          <div class="border-t border-stone-800 flex-1"></div>
                    </div>

                    <button type="button" @click="payWithMayar(pay.id)" :disabled="isGeneratingMayar[pay.id]" class="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50">
                      <RefreshCw v-if="isGeneratingMayar[pay.id]" class="w-4 h-4 animate-spin" />
                      <CreditCard v-else class="w-5 h-5" />
                      <span class="text-xs font-bold">{{ isGeneratingMayar[pay.id] ? 'Memuat Sistem...' : 'TF & Konfirmasi Otomatis' }}</span>
                    </button>                    
                  </div>
                </template>

                <div class="space-y-1.5 px-1">
                  <div class="flex justify-between text-xs text-stone-400">
                    <span>Nominal Donasi</span>
                    <span>{{ formatRupiah(pay.nominal) }}</span>
                  </div>
                  <div v-if="getInfaqSistemUntukPeserta(pay)" class="flex justify-between text-xs text-stone-400">
                    <span>Infaq Sistem</span>
                    <span class="text-amber-400">{{ formatRupiah(getInfaqSistemUntukPeserta(pay)?.nominal || 0) }}</span>
                  </div>
                  <div class="flex justify-between text-xs font-bold text-stone-300 pt-2 mt-1 border-t border-stone-800 border-dashed">
                    <span>Total Nominal</span>
                    <span class="text-amber-400 font-mono">
                      {{ formatRupiah(Number(pay.nominal) + Number(getInfaqSistemUntukPeserta(pay)?.nominal || 0)) }}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'peserta'" id="konten-peserta" class="space-y-6">
        <div class="bg-stone-900 border border-stone-800 rounded-3xl p-5 flex items-center justify-between shadow-xl">
          <div class="space-y-1">
            <span class="text-[10px] text-stone-500 uppercase font-bold tracking-wider block">Total Terdaftar</span>
            <span class="text-2xl font-black text-emerald-400 font-mono">
              {{ totalPesertaTerdaftar }} <span class="text-xs text-stone-500 font-normal -ms-2 me-3">Pendaftar</span>
              {{ acara.tiket_terjual ? `${acara.tiket_terjual}` : '0' }}<span class="text-xs text-stone-500 font-normal"> Tiket</span>
            </span>
          </div>
          <div 
            @click="handleCopyPeserta"
            class="p-3 bg-amber-500/10 border border-amber-500/20 hover:border-amber-400/50 hover:bg-amber-500/20 rounded-2xl text-amber-400 active:scale-95 transition-all cursor-pointer select-none"
            title="Salin rekap daftar peserta ke clipboard"
          >
            <Users class="w-6 h-6" />
          </div>
        </div>

        <div class="space-y-4">
          <p class="text-[10px] font-bold uppercase tracking-widest text-stone-500">Riwayat Registrasi Masuk ({{ logDaftarPeserta.length }})</p>
          <div v-if="logDaftarPeserta.length === 0" class="text-center py-10 border border-dashed border-stone-900 rounded-3xl text-stone-600 text-sm">
            <AlertCircle class="w-5 h-5 mx-auto mb-2 opacity-30" />
            Belum ada jamaah yang terdaftar dalam manifest acara ini.
          </div>

          <div v-else class="space-y-3">
            <div 
              v-for="log in logDaftarPeserta" 
              :key="log.id" 
              class="border rounded-2xl p-4 transition-all duration-200 shadow-sm select-none"
              :class="[
                !expandedLogs.includes(log.id)
                  ? 'bg-stone-900/40 border-stone-800/60 hover:bg-stone-900/80 hover:border-stone-700 cursor-pointer' 
                  : 'bg-stone-900/90 border-amber-500 shadow-lg shadow-amber-500/5 cursor-pointer'
              ]"
              @click="toggleLog(log.id)"
            >
              <div class="flex gap-4 items-center justify-between">
                <div class="flex items-center gap-3.5 min-w-0">
                  <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border bg-amber-500/10 border-amber-500/20 text-amber-400">
                    <Ticket class="w-4.5 h-4.5" />
                  </div>
                  <div class="min-w-0">
                    <h4 class="text-xs font-bold text-stone-200 truncate pr-2 uppercase">
                      {{ log.atas_nama }}
                    </h4>
                    <p class="text-[11px] text-stone-500 max-w-60 md:max-w-md" :class="expandedLogs.includes(log.id) ? 'line-clamp-none' : 'line-clamp-2'">
                      {{ log.notes ? `"${log.notes}"` : '' }}
                    </p>
                  </div>
                </div>

                <div class="flex flex-col items-end space-y-0.5 shrink-0">
                  <span class="text-sm font-bold font-mono text-emerald-400">
                    + {{ Number(log.nominal) > 0 ? formatRupiah(log.nominal) : 'Gratis' }}
                  </span>
                  
                  <div class="flex items-center gap-1">
                    <span class="text-[10px] text-stone-600 font-medium font-mono">
                      {{ new Date(log.created_at).toLocaleDateString('id-ID') }}
                    </span>
                    <ChevronDown class="w-4 h-4 text-stone-600 transition-transform duration-300" :class="expandedLogs.includes(log.id) ? 'rotate-180' : ''" />
                  </div>
                </div>
              </div>

              <div v-if="expandedLogs.includes(log.id)" class="mt-4 pt-4 border-t border-stone-800/60 space-y-4 cursor-default" @click.stop>
                
                <div class="flex items-center justify-between text-xs bg-stone-950 p-2.5 rounded-xl border border-stone-800/50">
                  <span class="text-stone-500 font-bold uppercase tracking-widest text-[9px]">Status</span>
                  <span class="font-bold flex items-center gap-1.5" :class="getPaymentStatus(log).class">
                    <span class="relative flex h-2 w-2" v-if="Number(log.nominal) > 0 && log.status !== 'success'">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current"></span>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                    </span>
                    {{ getPaymentStatus(log).text }}
                  </span>
                </div>

                <template v-if="log.status !== 'success' && Number(log.nominal) > 0">
                  <div v-if="!log.image" class="p-4 rounded-2xl bg-stone-950 border border-stone-800/80 space-y-4">
                    <div class="flex flex-col items-center justify-center p-4 bg-stone-900/50 rounded-xl border border-stone-800 border-dashed">
                      <button 
                        type="button" 
                        @click="openQrisModal(log)"
                        class="w-full flex items-center justify-center gap-2 bg-stone-900 border border-stone-800 hover:border-amber-500/40 text-amber-400 hover:text-amber-300 text-xs font-bold py-3 px-4 rounded-xl transition-all active:scale-98 shadow-sm"
                      >
                        <QrCode class="w-4 h-4" />
                        Tampilkan QRIS
                      </button>
                    </div>
                    
                    <div class="pt-4 border-t border-stone-800/60 space-y-3">
                      <label class="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                        <Upload class="size-3.5 text-amber-500" /> Upload Bukti Transfer Susulan
                      </label>
                      
                      <div v-if="!uploadFile[log.id]" class="grid grid-cols-2 gap-2"> <!-- Ganti log.id menjadi log.id khusus untuk di tab peserta -->
                        <!-- Pilih Galeri -->
                        <label class="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-2xl cursor-pointer transition-all bg-stone-900 border-stone-800 hover:border-amber-500/40">
                          <Upload class="size-5 text-stone-600 mb-2" />
                          <p class="text-[10px] text-stone-400 font-medium">Pilih Galeri</p>
                          <input type="file" accept="image/*" class="hidden" @change="(e) => handleBuktiChange(e, log.id)" /> <!-- Ganti log.id menjadi log.id di tab peserta -->
                        </label>
                        
                        <!-- Buka Kamera -->
                        <button type="button" @click="openCamera(log.id)" class="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-2xl cursor-pointer transition-all bg-stone-900 border-stone-800 hover:border-amber-500/40 text-stone-400 hover:text-amber-400"> <!-- Ganti log.id menjadi log.id di tab peserta -->
                          <Camera class="size-5 mb-2" />
                          <p class="text-[10px] font-medium">Buka Kamera</p>
                        </button>
                      </div>
                      
                      <div v-else class="relative flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-2xl transition-all bg-amber-500/5 border-amber-500/30">
                        <button type="button" @click="uploadFile[log.id] = null" class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg z-10 transition-colors"> <!-- Ganti log.id menjadi log.id di tab peserta -->
                            <X class="size-3" />
                        </button>
                        <FileText class="size-5 text-amber-500 mb-2" />
                        <p class="text-[11px] text-amber-400 font-bold max-w-[200px] truncate">{{ uploadFile[log.id]?.name }}</p> <!-- Ganti log.id menjadi log.id di tab peserta -->
                        <p class="text-[9px] text-stone-500 mt-1">Hapus untuk mengganti</p>
                      </div>

                      <button
                        v-if="uploadFile[log.id]" 
                        @click="submitBukti(log.id)" 
                        class="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all active:scale-95 shadow-md"
                        :disabled="isUploading[log.id]"
                      > <!-- Ganti log.id menjadi log.id di tab peserta -->
                        {{ isUploading[log.id] ? 'MENGUPLOAD...' : 'KIRIM BUKTI VERIFIKASI' }}
                      </button>
                    </div>
                  </div>

                  <div class="relative flex items-center gap-3 my-4 opacity-50">
                    <div class="border-t border-stone-800 flex-1"></div>
                    <span class="text-[10px] text-stone-500 font-bold uppercase tracking-wider">ATAU LEBIH MUDAH</span>
                    <div class="border-t border-stone-800 flex-1"></div>
                  </div>

                  <button type="button" @click="payWithMayar(log.id)" :disabled="isGeneratingMayar[log.id]" class="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50">
                    <RefreshCw v-if="isGeneratingMayar[log.id]" class="w-4 h-4 animate-spin" />
                    <CreditCard v-else class="w-5 h-5" />
                    <span class="text-xs font-bold">{{ isGeneratingMayar[log.id] ? 'Memuat Sistem...' : 'TF & Konfirmasi Otomatis' }}</span>
                  </button>                  
                </template>

                <div class="space-y-1.5 px-1">
                  <div class="flex justify-between text-xs text-stone-400">
                    <span>Investasi Acara ({{ log.jumlah_tiket ?? 1 }} Tiket)</span>
                    <span>{{ Number(log.nominal) > 0 ? formatRupiah(log.nominal) : 'Gratis' }}</span>
                  </div>
                  <div v-if="getInfaqSistemUntukPeserta(log)" class="flex justify-between text-xs text-stone-400">
                    <span>Infaq Sistem</span>
                    <span>{{ formatRupiah(getInfaqSistemUntukPeserta(log)?.nominal || 0) }}</span>
                  </div>
                  <div class="flex justify-between text-xs font-bold text-stone-300 pt-2 mt-1 border-t border-stone-800 border-dashed">
                    <span>Total Nominal</span>
                    <span class="text-amber-400 font-mono">
                      {{ formatRupiah(Number(log.nominal) + Number(getInfaqSistemUntukPeserta(log)?.nominal || 0)) }}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

    </main>

    <div class="fixed bottom-30 max-w-xl mx-auto inset-x-0 z-50 pointer-events-none">
      <div class="absolute left-5 pointer-events-auto">
        <button @click="handleShare" type="button" title="Bagikan link" class="w-10 h-10 bg-amber-500 hover:bg-amber-50 text-white hover:text-stone-950 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer">
          <Share2 class="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>

    <div 
      v-if="activeQrisModal" 
      class="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-[100] grid place-items-center p-4 overflow-y-auto" 
      @click.self="closeQrisModal"
    >
      <div class="relative max-w-sm w-full bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl flex flex-col my-auto max-h-[calc(100vh-2rem)] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <div class="p-4 border-b border-stone-800 flex items-center justify-between bg-stone-900/50 shrink-0">
          <div class="flex items-center gap-2 text-stone-200">
            <QrCode class="size-4 text-amber-500" />
            <span class="text-xs font-bold uppercase tracking-wider">Metode Pembayaran QRIS</span>
          </div>
          <button @click="closeQrisModal" class="p-1.5 rounded-xl bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition-colors">
            <X class="size-4" />
          </button>
        </div>
        
        <div class="p-6 bg-stone-950 flex flex-col items-center gap-4 overflow-y-auto min-h-0">
          <p class="text-base font-bold font-mono text-white">
            MUHASABAH ID
          </p>
          <p class="text-base font-bold font-mono text-white -mt-4">
            Sosial Kemanusian
          </p>
          <div class="w-full max-w-[240px] mx-auto flex justify-center">
            <!-- Background putih agar QR Code kontras dan mudah di-scan -->
            <div class="p-3 rounded-2xl transition-all">
              <qrcode-vue 
                v-if="dynamicQrisString"
                :value="dynamicQrisString" 
                :size="200" 
                level="M" 
                render-as="svg" 
                                    foreground="#f59e0b" 
                                    background="transparent"
              />
            </div>
          </div>
          
          <div v-if="selectedQrisLog" class="w-full bg-stone-900/60 p-3 rounded-xl border border-stone-800 text-center space-y-0.5 shrink-0">
            <p class="text-[10px] text-stone-500 uppercase font-bold tracking-wider">Total Pembayaran</p>
            <p class="text-base font-bold font-mono text-amber-400">
              {{ formatRupiah(Number(selectedQrisLog.nominal) + Number(getInfaqSistemUntukPeserta(selectedQrisLog)?.nominal || 0)) }}
            </p>
          </div>
        </div>
        
        <div class="p-3 bg-stone-900/50 border-t border-stone-800 text-center shrink-0">
          <p class="text-[10px] text-stone-400 font-medium leading-normal px-2">
            Silakan screenshot atau scan QRIS di atas melalui aplikasi m-banking atau e-wallet Anda.
          </p>
        </div>
      </div>
    </div>   

    <div v-if="isCameraOpen" class="fixed inset-0 z-[150] bg-stone-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
        <div class="relative w-full max-w-sm bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-800 animate-in fade-in zoom-in-95 duration-200">
            <div class="p-4 border-b border-stone-800 flex items-center justify-between bg-stone-900/50">
                <div class="flex items-center gap-2 text-stone-200">
                    <Camera class="size-4 text-amber-500" />
                    <span class="text-xs font-bold uppercase tracking-wider">Foto Bukti Transfer</span>
                </div>
                <button @click="closeCamera" class="p-1.5 rounded-xl bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition-colors">
                    <X class="size-4" />
                </button>
            </div>
            
            <div class="relative aspect-[3/4] sm:aspect-video bg-black w-full">
                <video ref="videoElement" autoplay playsinline class="w-full h-full object-cover"></video>
            </div>
            
            <div class="p-5 bg-stone-950 flex justify-center border-t border-stone-800/80">
                <button @click="takePhoto" type="button" class="bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-full h-16 w-16 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)] active:scale-90 transition-all">
                    <Camera class="size-7" />
                </button>
            </div>
            
            <canvas ref="canvasElement" class="hidden"></canvas>
        </div>
    </div>

    <div v-if="isMayarModalOpen" class="fixed inset-0 z-[200] bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="w-full max-w-lg bg-stone-100 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[85vh] sm:h-[700px] animate-in fade-in zoom-in-95 duration-200">
            
            <div class="flex items-center justify-between p-4 border-b border-stone-200 bg-white">
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span class="font-bold text-stone-800 text-sm">Pembayaran Instan Otomatis (Mayar)</span>
                </div>
                <button @click="closeMayarModal" class="p-1.5 bg-stone-100 hover:bg-red-500 hover:text-white text-stone-500 rounded-full transition-colors focus:outline-none">
                    <X class="w-4 h-4" />
                </button>
            </div>
            
            <div class="flex-1 w-full relative bg-stone-100">
                <div class="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <RefreshCw class="w-7 h-7 text-emerald-500 animate-spin" />
                    <p class="text-[11px] text-stone-500 font-bold uppercase tracking-wider">Menyiapkan invoice pembayaran...</p>
                </div>
                <iframe :src="mayarLink" class="relative z-10 w-full h-full border-none rounded-b-3xl" allow="payment"></iframe>
            </div>

        </div>
    </div>    

  </AppLayoutPublic>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>