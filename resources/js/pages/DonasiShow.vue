<script setup lang="ts">
import { Head, Link, useForm, router } from '@inertiajs/vue3'
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { 
  CalendarDays, Tag, Target, Wallet, 
  Share2, BookOpen, MessageCircle, 
  ClipboardList, ArrowDownCircle, ArrowUpCircle, AlertCircle, SendHorizontal,
  RefreshCw, Newspaper, Heart, ChevronDown, Upload, FileText,
  X, Camera,
  QrCode
} from 'lucide-vue-next'
import AppLayoutPublic from '@/layouts/AppLayoutPublic.vue'
import { toast } from 'vue-sonner'
import QrcodeVue from 'qrcode.vue'

const props = defineProps<{
  meta?: {
    title: string
    description: string
    image: string
    url: string
  }
  donasi: {
    id: number
    judul: string
    slug: string
    body: string
    progress: string | null
    kategori: string
    subkategori: string
    target_dana: number
    saldo: number
    tgl_mulai: string
    tgl_selesai: string
    created_at: string
    user: { id: number; name: string } | null
    payments: Array<{
      id: number
      link: string
      atas_nama: string
      sapaan?: string
      nominal: number
      notes: string | null
      mutation_type: string
      created_at: string
      image: string | null
      status: string | null
    }>
    komentars: Array<{
      id: number
      body: string
      nama_publik: string
      created_at: string
      user: { id: number; name: string } | null
    }>
    reaksis: Array<{
      id: number
      type: string
      ip_address?: string
    }>
  }
}>()

// --- TIPE & STATE MANAGEMENT ---
type TabType = 'cerita' | 'berita' | 'komentar' | 'doa' | 'laporan'
const activeTab = ref<TabType>('cerita')
const isSubmittingComment = ref(false)
const isSubmittingReaction = ref(false)
const storageKey = `donasi_reaksi_${props.donasi.slug}`
const selectedReaksi = ref<string | null>(localStorage.getItem(storageKey))

// State Expand Laporan
const expandedLogs = ref<number[]>([])

// State Form Susulan Bukti Transfer
const uploadFile = ref<Record<number, File | null>>({})
const isUploading = ref<Record<number, boolean>>({})

const activeQrisModal = ref<boolean>(false)
const selectedQrisLog = ref<any>(null)

const openQrisModal = (log: any) => {
  selectedQrisLog.value = log
  activeQrisModal.value = true
}

const closeQrisModal = () => {
  selectedQrisLog.value = null
  activeQrisModal.value = false
}

// === TAMBAHKAN LOGIKA QRIS DINAMIS DI SINI ===
const dynamicQrisString = computed(() => {
  if (!selectedQrisLog.value) return "";

  // Hitung total bayar = Nominal Donasi + Nominal Infaq (jika ada)
  const amount = Number(selectedQrisLog.value.nominal) + Number(getInfaqForDonasi(selectedQrisLog.value)?.nominal || 0);
  
  const baseQris = "00020101021126610014COM.GO-JEK.WWW01189360091438029302900210G8029302900303UMI51440014ID.CO.QRIS.WWW0215ID10265182630370303UMI5204839853033605802ID5925muhasabah id, Sosial Kema6006KENDAL61055135562070703A0163041A3A";
  
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

// --- SECURITY MATH CAPTCHA ---
const captchaNum1 = ref(0)
const captchaNum2 = ref(0)
const userCaptchaAnswer = ref('')
const generateCaptcha = () => {
  captchaNum1.value = Math.floor(Math.random() * 9) + 1
  captchaNum2.value = Math.floor(Math.random() * 9) + 1
  userCaptchaAnswer.value = ''
}

onMounted(() => {
  generateCaptcha()

  const urlParams = new URLSearchParams(window.location.search)
  const tabParam = urlParams.get('tab') as TabType | null

  if (tabParam && ['cerita', 'berita', 'komentar', 'doa', 'laporan'].includes(tabParam)) {
    activeTab.value = tabParam
    const newUrl = window.location.pathname
    window.history.replaceState({}, document.title, newUrl)
    setTimeout(() => {
      const tabElement = document.querySelector('.sticky') || document.querySelector('[data-active="true"]')
      if (tabElement) {
        tabElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 300)
  }
})

// --- INERTIA FORM KOMENTAR ---
const commentForm = useForm({
  nama_publik: '',
  body: '',
  captcha_challenge: computed(() => `${captchaNum1.value}+${captchaNum2.value}`),
  captcha_answer: ''
})

const submitKomentar = () => {
  const correctAnswer = captchaNum1.value + captchaNum2.value
  if (parseInt(userCaptchaAnswer.value) !== correctAnswer) {
    alert('Jawaban kode keamanan (Captcha) salah, silakan hitung kembali.')
    generateCaptcha()
    return
  }
  commentForm.captcha_answer = userCaptchaAnswer.value
  isSubmittingComment.value = true
  commentForm.post(`/donasi/${props.donasi.slug}/komentar`, {
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

const toggleReaksi = (type: string) => {
  if (isSubmittingReaction.value) return
  isSubmittingReaction.value = true
  useForm({ type }).post(`/donasi/${props.donasi.slug}/reaksi`, {
    preserveScroll: true,
    onSuccess: () => {
      if (selectedReaksi.value === type) {
        selectedReaksi.value = null
        localStorage.removeItem(storageKey)
      } else {
        selectedReaksi.value = type
        localStorage.setItem(storageKey, type)
      }
    },
    onFinish: () => {
      isSubmittingReaction.value = false
    }
  })
}

// --- FUNGSI UPLOAD BUKTI SUSULAN ---
const handleBuktiChange = (e: Event, logId: number) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    uploadFile.value[logId] = target.files[0];
  }
}

const submitBukti = (logId: number) => {
  if (!uploadFile.value[logId]) return;
  isUploading.value[logId] = true;
  
  router.post(`/payment/${logId}/upload-bukti`, {
    bukti_donasi: uploadFile.value[logId],
  }, {
    preserveScroll: true,
    onSuccess: () => {
      uploadFile.value[logId] = null;
      toast.success('Bukti transfer berhasil dikirim. Menunggu verifikasi admin.');
    },
    onError: () => {
      toast.error('Gagal mengupload bukti transfer. Periksa format/ukuran file.');
    },
    onFinish: () => {
      isUploading.value[logId] = false;
    }
  })
}

// --- LOGIKA LAPORAN KEUANGAN ---
const formatRupiah = (nominal: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(nominal)
}

const toggleLog = (id: number) => {
  if (expandedLogs.value.includes(id)) {
    expandedLogs.value = expandedLogs.value.filter(logId => logId !== id)
  } else {
    expandedLogs.value.push(id)
  }
}

const getInfaqForDonasi = (log: any) => {
  return props.donasi.payments?.find(p => 
    p.mutation_type === 'infaq_sistem' && 
    p.created_at === log.created_at &&
    p.atas_nama === log.atas_nama
  )
}

const getPaymentStatus = (log: any) => {
  if (log.status) return { text: log.status, class: 'text-emerald-400' }
  if (!log.image) return { text: 'Menunggu Bukti Transfer', class: 'text-red-400' }
  return { text: 'Sedang Diverifikasi', class: 'text-amber-400' }
}

const totalTasyaruf = computed(() => {
  if (!props.donasi.payments) return 0
  return props.donasi.payments.filter(p => p.mutation_type === 'tasyaruf').reduce((sum, p) => sum + Number(p.nominal), 0)
})

const totalDonasiMasukKumulatif = computed(() => {
  if (!props.donasi.payments) return 0
  return props.donasi.payments.filter(p => p.mutation_type === 'donasi_utama').reduce((sum, p) => sum + Number(p.nominal), 0)
})

const progressRutin = computed(() => {
  const totalTersalurkan = totalTasyaruf.value
  const totalDonasi = totalDonasiMasukKumulatif.value
  if (totalDonasi === 0) return 0
  return Math.round((totalTersalurkan / totalDonasi) * 100)
})

const progressTarget = computed(() => {
  const target = Number(props.donasi.target_dana)
  if (!target || target <= 0) return 0
  const percent = (totalDonasiMasukKumulatif.value / target) * 100
  return percent > 100 ? 100 : Math.round(percent)
})

const tanggal = computed(() => {
  if (!props.donasi.tgl_selesai) return 'Berlanjut'
  const target = new Date(props.donasi.tgl_selesai)
  const sekarang = new Date()
  target.setHours(0, 0, 0, 0)
  sekarang.setHours(0, 0, 0, 0)
  const selisihWaktu = target.getTime() - sekarang.getTime()
  const sisaHari = Math.ceil(selisihWaktu / (1000 * 60 * 60 * 24))
  if (sisaHari > 0) return `Sisa ${sisaHari} hari lagi`
  if (sisaHari === 0) return 'Berakhir hari ini'
  return 'Program selesai'
})

const reaksiList = [
  { type: 'love', emoji: '❤️', label: 'Cinta' },
  { type: 'like', emoji: '👍', label: 'Suka' },
  { type: 'pray', emoji: '🙏', label: 'Harapan' },
  { type: 'sad',  emoji: '😢', label: ' Prihatin' },
]

const reaksiCount = computed(() => {
  const counts: Record<string, number> = {}
  props.donasi.reaksis?.forEach(r => { counts[r.type] = (counts[r.type] ?? 0) + 1 })
  return counts
})

const doaDonatur = computed(() => {
  return props.donasi.payments?.filter(p => p.mutation_type === 'donasi_utama' && p.notes && p.notes !== '-') || []
})

const laporanArusKas = computed(() => {
  if (!props.donasi.payments) return []
  return props.donasi.payments.filter(p => p.mutation_type !== 'infaq_sistem').sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
})

const isTabsSticky = ref(false)
const tabsTargetRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const tabItems = [
  { id: 'cerita', label: 'Cerita', icon: BookOpen },
  { id: 'berita', label: 'Berita', icon: Newspaper },
  { id: 'komentar', label: 'Komentar', icon: MessageCircle },
  { id: 'doa', label: 'Doa Donatur', icon: Heart },
  { id: 'laporan', label: 'Laporan Keuangan', icon: ClipboardList },
]

const tabsContainerRef = ref<HTMLElement | null>(null)

const orderedTabs = computed(() => {
  const index = tabItems.findIndex(tab => tab.id === activeTab.value)
  if (index === -1) return tabItems
  const prev2Index = (index - 2 + tabItems.length) % tabItems.length
  const prev1Index = (index - 1 + tabItems.length) % tabItems.length
  const next1Index = (index + 1) % tabItems.length
  const next2Index = (index + 2) % tabItems.length
  return [tabItems[prev2Index], tabItems[prev1Index], tabItems[index], tabItems[next1Index], tabItems[next2Index]]
})

const setActiveTab = (tabId: TabType) => {
  activeTab.value = tabId
  setTimeout(() => {
    const activeEl = tabsContainerRef.value?.querySelector('[data-active="true"]')
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, 50)
}

onMounted(() => {
  observer = new IntersectionObserver(([entry]) => { isTabsSticky.value = !entry.isIntersecting }, { rootMargin: '-12px 0px 0px 0px', threshold: [0] })
  if (tabsTargetRef.value) observer.observe(tabsTargetRef.value)
  setTimeout(() => {
      const activeEl = tabsContainerRef.value?.querySelector('[data-active="true"]')
      if (activeEl) activeEl.scrollIntoView({ block: 'nearest', inline: 'center' })
    }, 400)  
})

onUnmounted(() => {
  if (observer && tabsTargetRef.value) observer.unobserve(tabsTargetRef.value)
})

// --- FUNGSI SHARE DONASI ---
const handleShare = async () => {
  // Gunakan window.location.href jika ingin menyalin URL yang sedang aktif (termasuk parameter jika ada),
  // atau konstruksi manual agar lebih bersih (tanpa query string):
  const shareUrl = `${window.location.origin}/donasi/${props.donasi.slug}`
  const shareTitle = props.donasi.judul
  const shareText = `Mari berkontribusi dalam program kebaikan: "${props.donasi.judul}"`

  if (navigator.share) {
    try {
      await navigator.share({ title: shareTitle, text: shareText, url: shareUrl })
    } catch (err) {
      // Tangkap error jika user membatalkan dialog share, biarkan kosong agar tidak muncul error di console
    }
  } else {
    // Fallback untuk browser (seperti desktop lama) yang tidak mendukung Web Share API
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Link donasi berhasil disalin ke clipboard!')
    } catch (err) {
      toast.error('Gagal menyalin link donasi.')
    }
  }
}

function handleCopyLaporan() {
  if (!laporanArusKas.value || laporanArusKas.value.length === 0) {
    toast.error('Tidak ada data laporan keuangan untuk disalin.')
    return
  }

  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
  const grouped: Record<string, string[]> = {}

  // 1. Kelompokkan data dari laporanArusKas (Urutan dibalik agar dari tanggal terlama ke terbaru)
  const mutasiKronologis = [...laporanArusKas.value].reverse()

  mutasiKronologis.forEach(log => {
    const tgl = new Date(log.created_at).toLocaleDateString('id-ID', options)
    if (!grouped[tgl]) {
      grouped[tgl] = []
    }

    const nominalTeks = new Intl.NumberFormat('id-ID').format(log.nominal)

    if (log.mutation_type === 'tasyaruf') {
      // Jika Tasyaruf / Penyaluran Keluar
      const keterangan = log.notes || 'Penyaluran Dana'
      grouped[tgl].push(`${keterangan} · - ${nominalTeks}`)
    } else {
      // Jika Donasi Masuk
      const namaTeks = log.atas_nama === 'Hamba Allah' 
        ? 'Hamba Allah' 
        : `${log.sapaan || ''} ${log.atas_nama}`.trim()
      grouped[tgl].push(`${namaTeks} · + ${nominalTeks}`)
    }
  })

  // 2. Susun Struktur Teks Clipboard
  const lines: string[] = []
  lines.push('_Laporan Keuangan_')
  lines.push('*'+props.donasi.judul.toUpperCase()+'*')
  lines.push('') // Jeda baris kosong setelah judul

  // Ambil tanggal dan pastikan berurutan dari terlama ke terbaru
  const sortedDates = Object.keys(grouped).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime()
  })

  sortedDates.forEach(tgl => {
    lines.push(tgl)
    grouped[tgl].forEach(item => lines.push(item))
    lines.push('') // Jeda baris kosong antar kelompok tanggal
  })

  // Tambahkan ringkasan saldo di akhir teks
  const saldoAkhir = formatRupiah(props.donasi.saldo || 0)
  lines.push('_SALDO_')
  lines.push('*' + saldoAkhir + '*')
  lines.push('') // Jeda baris kosong setelah judul
  lines.push(props.donasi.slug ? `Lihat detail: https://muhasabah.id/donasi/${props.donasi.slug}` : 'Lihat detail di website Muhasabah.id')

  const finalClipboardText = lines.join('\n').trim()

  // 3. Eksekusi Salin
  if (typeof window !== 'undefined') {
    navigator.clipboard.writeText(finalClipboardText)
      .then(() => toast.success('Rangkuman laporan keuangan berhasil disalin!'))
      .catch((err) => {
        toast.error('Gagal menyalin laporan.')
        console.error(err)
      })
  }
}

onMounted(() => {
    // Ambil parameter dari URL browser
    const urlParams = new URLSearchParams(window.location.search)
    const activeTabParam = urlParams.get('tab')

    // Jika tab adalah laporan, trigger scroll setelah DOM selesai merender
    if (activeTabParam === 'laporan') {
        nextTick(() => {
            const element = document.getElementById('konten-laporan')
            if (element) {
                element.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' // Bisa diganti 'start' jika ingin mepet ke atas layar
                })
            }
        })
    }
})

// --- STATE & FUNGSI KAMERA UNTUK DONASI SHOW ---
const isCameraOpen = ref(false)
const cameraForLogId = ref<number | null>(null) // Menyimpan ID transaksi mana yang sedang mau difoto
const videoElement = ref<HTMLVideoElement | null>(null)
const canvasElement = ref<HTMLCanvasElement | null>(null)
const cameraStream = ref<MediaStream | null>(null)

const openCamera = async (logId: number) => {
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
        
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        const context = canvas.getContext('2d')
        if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height)
            
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], `bukti_susulan_${logId}_${Date.now()}.jpg`, { type: 'image/jpeg' })
                    
                    // Masukkan ke state uploadFile bawaan DonasiShow
                    uploadFile.value[logId] = file
                    
                    closeCamera()
                }
            }, 'image/jpeg', 0.8)
        }
    }
}

onUnmounted(() => {
    closeCamera()
})
</script>

<template>
  <Head>
    <title>{{ donasi.judul }}</title>
    <meta v-if="meta" name="description" :content="meta.description" />
    <meta v-if="meta" property="og:title" :content="meta.title" />
    <meta v-if="meta" property="og:description" :content="meta.description" />
    <meta v-if="meta" property="og:image" :content="meta.image" />
    <meta v-if="meta" property="og:url" :content="meta.url" />
    <meta property="og:type" content="website" />
  </Head>

  <AppLayoutPublic :subtitle="donasi.subkategori" :title="donasi.judul" :show-back="true" back-href="/donasi">  

    <main class="px-5 py-8 space-y-8 pb-32">

      <div class="space-y-6">
        <div class="space-y-3">
          <span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            <Tag class="w-3 h-3" />
            {{ donasi.kategori }} / {{ donasi.subkategori }}
          </span>
          <h1 class="text-2xl md:text-3xl font-bold leading-tight text-amber-100">{{ donasi.judul }}</h1>
        </div>

        <div class="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <template v-if="Number(donasi.target_dana) === 0">
            <div class="grid grid-cols-2 gap-2">
              <div class="space-y-1">
                <p class="text-[10px] text-stone-500 uppercase font-bold tracking-wider">Telah Disalurkan</p>
                <p class="sm:text-xl text-sm font-black text-emerald-400 font-mono">{{ formatRupiah(totalTasyaruf) }}</p>
              </div>
              <div class="space-y-1 text-right">
                <p class="text-[10px] text-stone-500 uppercase font-bold tracking-wider">Dana Masuk</p>
                <p class="sm:text-xl text-sm font-black text-amber-400 font-mono">{{ formatRupiah(totalDonasiMasukKumulatif) }}</p>
              </div>
            </div>
            <div class="space-y-1.5">
              <div class="h-2 w-full bg-stone-800 rounded-full overflow-hidden">
                <div class="h-full bg-linear-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000" :style="{ width: progressRutin + '%' }"></div>
              </div>
              <div class="flex justify-between items-center text-[10px] text-stone-500">
                <span class="flex items-center gap-1"><RefreshCw class="w-3 h-3 shrink-0" /> Program Rutin</span>
                <span class="font-bold text-stone-400">{{ progressRutin }}% Dana Tersalurkan</span>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="flex justify-between items-end">
              <div class="space-y-1">
                <p class="text-[10px] text-stone-500 uppercase font-bold tracking-wider">Dana Masuk</p>
                <p class="text-2xl font-black text-amber-400 font-mono">{{ formatRupiah(totalDonasiMasukKumulatif) }}</p>
              </div>
              <div class="text-right">
                <p class="text-xl font-black text-stone-200 font-mono">{{ progressTarget }}%</p>
              </div>
            </div>
            <div class="h-3 w-full bg-stone-800 rounded-full overflow-hidden">
              <div class="h-full bg-linear-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-1000" :style="{ width: progressTarget + '%' }"></div>
            </div>
            <div class="flex justify-between items-center text-xs text-stone-500">
              <span class="flex items-center gap-1.5"><Target class="w-3.5 h-3.5" /> Target: {{ formatRupiah(donasi.target_dana) }}</span>
              <span class="flex items-center gap-1.5"><CalendarDays class="w-3.5 h-3.5" /> {{ tanggal }}</span>
            </div>
          </template>

          <Link 
            :href="`/donasi/${donasi.slug}/payment`"
            class="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-amber-500/20"
          >
            <Wallet class="w-5 h-5" />
            DONASI SEKARANG
          </Link>
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
      <div :class="['bg-stone-950 border-b border-stone-800 transition-all duration-150 z-40', isTabsSticky ? 'fixed top-0 left-0 right-0 max-w-xl mx-auto px-5 shadow-xl pt-1' : 'relative -mx-5 px-5 mt-4']">
        <div ref="tabsContainerRef" class="flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth w-full" style="-webkit-overflow-scrolling: touch; scroll-padding: 0 24px;">
          <div class="flex flex-nowrap min-w-full justify-start items-center px-4">
            <div class="w-[35%] shrink-0 snap-center"></div>
            <button v-for="tab in orderedTabs" :key="tab.id" @click="setActiveTab(tab.id as TabType)" type="button" :data-active="activeTab === tab.id" :class="['flex items-center justify-center gap-2 py-4 px-6 text-sm font-bold border-b-2 transition-all whitespace-nowrap snap-center mx-1', activeTab === tab.id ? 'border-amber-500 text-amber-400 bg-linear-to-t from-amber-500/5 to-transparent' : 'border-transparent text-stone-500 hover:text-stone-300']">
              <component :is="tab.icon" class="w-4 h-4 shrink-0" />
              <span>{{ tab.label }}</span>
              <span v-if="tab.id === 'komentar' && (donasi.komentars?.length || 0) > 0" class="text-xs px-1.5 py-0.5 bg-stone-800 text-stone-400 rounded-md font-mono ml-1">{{ donasi.komentars?.length || 0 }}</span>
              <span v-if="tab.id === 'doa' && doaDonatur.length > 0" class="text-xs px-1.5 py-0.5 bg-stone-800 text-stone-400 rounded-md font-mono ml-1">{{ doaDonatur.length }}</span>
            </button>
            <div class="w-[35%] shrink-0 snap-center"></div>
          </div>
        </div>
      </div>     
      <div v-if="isTabsSticky" class="h-[53px]"></div>         

      <div v-if="activeTab === 'cerita'" class="space-y-8">
        <div class="space-y-4">
          <p class="text-[10px] font-bold uppercase tracking-widest text-stone-500 border-l-2 border-amber-500 pl-3">Cerita Donasi</p>
          <div class="prose prose-invert prose-stone max-w-none prose-p:text-stone-300 prose-p:leading-relaxed prose-p:text-[15px] prose-headings:text-amber-100 prose-strong:text-amber-200 prose-img:rounded-3xl prose-img:border-stone-800" v-html="donasi.body" />
        </div>
      </div>

      <div v-if="activeTab === 'berita'" class="space-y-8">
        <div class="space-y-4">
          <p class="text-[10px] font-bold uppercase tracking-widest text-stone-500 border-l-2 border-amber-500 pl-3">Berita & Progress</p>
          <div v-if="donasi.progress && donasi.progress.trim() !== '<p></p>'" class="prose prose-invert prose-stone max-w-none prose-p:text-stone-300 prose-p:leading-relaxed prose-p:text-[15px] prose-headings:text-amber-100 prose-strong:text-amber-200 prose-img:rounded-3xl prose-img:border-stone-800" v-html="donasi.progress" />
          <div v-else class="text-center py-12 text-stone-600 text-xs border border-stone-800 bg-stone-900/30 border-dashed rounded-3xl">
            <Newspaper class="w-8 h-8 mx-auto mb-3 opacity-30" />
            Belum ada berita atau update progres terkini.
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'komentar'" class="space-y-6">
        
        <form @submit.prevent="submitKomentar" class="bg-stone-900 border border-stone-800/80 rounded-3xl p-5 space-y-4">
          <p class="text-[10px] font-bold uppercase tracking-widest text-amber-400">Kirim Pertanyaan / Dukungan Publik</p>
          <div class="space-y-3">
            <input v-model="commentForm.nama_publik" type="text" placeholder="Nama Anda (Wajib isi)" class="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/50 transition-colors" />
            <textarea v-model="commentForm.body" required rows="3" placeholder="Tulis dukungan, pesan, atau pertanyaan Anda di sini..." class="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/50 transition-colors resize-none"></textarea>
          </div>
          <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div class="flex items-center gap-2 bg-stone-950 px-3 py-2 rounded-xl border border-stone-800">
              <span class="text-xs font-mono text-stone-400 font-bold select-none tracking-wider">Jawab: {{ captchaNum1 }} + {{ captchaNum2 }} = </span>
              <input v-model="userCaptchaAnswer" type="number" required placeholder="?" class="w-20 bg-transparent text-center font-bold text-xs text-amber-400 focus:outline-none font-mono" />
            </div>
            <button type="submit" :disabled="isSubmittingComment || !commentForm.body" class="ms-auto flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-800 disabled:text-stone-600 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all active:scale-95 shadow-md">
              <SendHorizontal class="w-3.5 h-3.5" />
              <!-- {{ isSubmittingComment ? 'Mengirim...' : 'Komentar' }} -->
            </button>
          </div>
        </form>

        <div class="space-y-4 pt-2">
          <p class="text-[10px] font-bold uppercase tracking-widest text-stone-500">Dukungan & Pertanyaan Publik</p>
          <div v-if="donasi.komentars?.length === 0" class="text-center py-8 text-stone-600 text-xs border border-stone-900 border-dashed rounded-2xl">
            Belum ada diskusi atau pertanyaan publik.
          </div>
          <div v-else class="space-y-3">
            <div v-for="komentar in donasi.komentars" :key="komentar.id" class="bg-stone-900/20 border border-stone-800 rounded-2xl p-4">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-bold text-amber-200">{{ komentar.user ? komentar.user.name : (komentar.nama_publik || 'Hamba Allah (Anonim)') }}</span>
                <span class="text-[9px] text-stone-600 font-mono">• {{ new Date(komentar.created_at).toLocaleDateString('id-ID') }}</span>
              </div>
              <p class="text-sm text-stone-400 leading-relaxed">{{ komentar.body }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'doa'" class="space-y-6">
        <div class="space-y-4">
          <p class="text-[10px] font-bold uppercase tracking-widest text-emerald-500 border-l-2 border-emerald-500 pl-3">Doa & Kebaikan Donatur</p>
          <div v-if="doaDonatur.length === 0" class="text-center py-12 text-stone-600 text-xs border border-stone-800 bg-stone-900/30 border-dashed rounded-3xl">
            <Heart class="w-8 h-8 mx-auto mb-3 opacity-30" />
            Belum ada pesan doa khusus dari transaksi donasi masuk.
          </div>
          <div v-else class="space-y-3">
            <div v-for="pay in doaDonatur" :key="pay.id" class="bg-stone-900/40 border border-stone-800/50 rounded-2xl p-4 flex gap-4 items-start">
              <div class="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20 text-amber-500">🤲</div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start mb-1">
                  <h4 class="text-xs font-bold text-stone-300 uppercase truncate">
                    {{ pay.atas_nama === 'Hamba Allah' ? '' : pay.sapaan }} {{ pay.atas_nama === 'Hamba Allah' ? 'Hamba Allah' : pay.atas_nama }}
                  </h4>
                  <div class="text-right shrink-0">
                    <span class="block text-[10px] text-stone-500 font-mono">{{ new Date(pay.created_at).toLocaleDateString('id-ID') }}</span>
                  </div>
                </div>
                <div class="flex justify-start items-start gap-3">
                  <p class="text-sm text-stone-400 italic font-medium leading-relaxed">{{ formatRupiah(pay.nominal) }} "{{ pay.notes }}"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'laporan'" id="konten-laporan" class="space-y-6">
        <div class="bg-stone-900 border border-stone-800 rounded-3xl p-5 flex items-center justify-between shadow-xl">
          <div class="space-y-1">
            <span class="text-[10px] text-stone-500 uppercase font-bold tracking-wider block">Dana Program Sekarang</span>
            <span class="text-2xl font-black text-emerald-400 font-mono">{{ formatRupiah(donasi.saldo || 0) }}</span>
          </div>
          <div 
            @click="handleCopyLaporan"
            class="p-3 bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-400/50 hover:bg-emerald-500/20 rounded-2xl text-emerald-400 active:scale-95 transition-all cursor-pointer select-none"
            title="Klik untuk menyalin semua rekapan mutasi laporan"
          >
            <Wallet class="w-6 h-6" />
          </div>
        </div>

        <div class="space-y-4">
          <p class="text-[10px] font-bold uppercase tracking-widest text-stone-500">Riwayat Perubahan Saldo ({{ laporanArusKas.length }})</p>
          <div v-if="laporanArusKas.length === 0" class="text-center py-10 border border-dashed border-stone-900 rounded-3xl text-stone-600 text-sm">
            <AlertCircle class="w-5 h-5 mx-auto mb-2 opacity-30" />
            Belum ada rekam jejak mutasi keuangan terbit di program ini.
          </div>

          <div v-else class="space-y-3">
            <div 
              v-for="log in laporanArusKas" 
              :key="log.id" 
              class="border rounded-2xl p-4 transition-all duration-200 shadow-sm select-none"
              :class="[
                // 1. Kondisi khusus untuk Tasyaruf (Penyaluran Keluar)
                log.mutation_type === 'tasyaruf' 
                  ? 'bg-red-500/20 border-red-500/10' 
                  : '',

                // 2. Kondisi untuk Donasi Masuk saat POSISI TERTUTUP (Tidak Expanded)
                log.mutation_type !== 'tasyaruf' && !expandedLogs.includes(log.id)
                  ? 'bg-stone-900/40 border-stone-800/60 hover:bg-stone-900/80 hover:border-stone-700 cursor-pointer' 
                  : '',

                // 3. Kondisi untuk Donasi Masuk saat POSISI TERBUKA (Expanded) -> Jalur Aman Amber
                log.mutation_type !== 'tasyaruf' && expandedLogs.includes(log.id)
                  ? 'bg-stone-900/90 border-amber-500 shadow-lg shadow-amber-500/5 cursor-pointer' 
                  : ''
              ]"
              @click="log.mutation_type !== 'tasyaruf' && toggleLog(log.id)"
            >
              <div class="flex gap-4 items-center justify-between">
                <div class="flex items-center gap-3.5 min-w-0">
                  <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border" :class="log.mutation_type === 'tasyaruf' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'">
                    <ArrowUpCircle v-if="log.mutation_type === 'tasyaruf'" class="w-4.5 h-4.5" />
                    <ArrowDownCircle v-else class="w-4.5 h-4.5" />
                  </div>
                  <div class="min-w-0">
                    <h4 class="text-xs font-bold text-stone-200 truncate pr-2 uppercase">
                      {{ log.mutation_type === 'tasyaruf' ? 'Tasyaruf' : (log.atas_nama) }}
                    </h4>

                    <p class="text-[11px] text-stone-500 max-w-[240px] md:max-w-md" :class="log.mutation_type === 'tasyaruf' ? 'line-clamp-none' : expandedLogs.includes(log.id) ? 'line-clamp-none' : 'line-clamp-1'">{{ log.notes || 'Donasi Masuk' }}</p>
                    <p v-if="log.link" class="text-[11px] text-foreground line-clamp-1 max-w-[240px] md:max-w-md">Link Terkait: <a :href="log.link" target="_blank" class="text-blue-500 hover:underline">klik di sini</a></p>
                  </div>
                </div>

                <div class="flex items-center gap-1 shrink-0">
                  <div class="text-right space-y-0.5">
                    <span class="text-sm font-bold font-mono block" :class="log.mutation_type === 'tasyaruf' ? 'text-red-400' : 'text-emerald-400'">
                      {{ log.mutation_type === 'tasyaruf' ? '-' : '+' }} {{ formatRupiah(log.nominal) }}
                    </span>
                    <span class="block text-[10px] text-stone-600 font-medium font-mono">{{ new Date(log.created_at).toLocaleDateString('id-ID') }}</span>
                  </div>
                  <ChevronDown v-if="log.mutation_type !== 'tasyaruf'" class="w-4 h-4 text-stone-600 transition-transform duration-300" :class="expandedLogs.includes(log.id) ? 'rotate-180' : ''" />
                </div>
              </div>

              <div v-if="log.mutation_type !== 'tasyaruf' && expandedLogs.includes(log.id)" class="mt-4 pt-4 border-t border-stone-800/60 space-y-4 cursor-default" @click.stop>
                
                <div class="flex items-center justify-between text-xs bg-stone-950 p-2.5 rounded-xl border border-stone-800/50">
                  <span class="text-stone-500 font-bold uppercase tracking-widest text-[9px]">Status</span>
                  <span class="font-bold flex items-center gap-1.5" :class="getPaymentStatus(log).class">
                    <span class="relative flex h-2 w-2" v-if="!log.status">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current"></span>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                    </span>
                    {{ getPaymentStatus(log).text }}
                  </span>
                </div>

                <template v-if="log.status !== 'success'">
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
                    <p class="text-[10px] text-stone-500 font-bold tracking-widest uppercase text-center mt-3">
                      Klik tombol untuk melihat kode QRIS pembayaran
                    </p>
                  </div>
                  <div class="pt-4 border-t border-stone-800/60 space-y-3">
                      <label class="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                          <Upload class="size-3.5 text-amber-500" /> Upload Bukti Transfer
                      </label>
                      
                      <!-- TAMPILAN JIKA BELUM ADA FILE -->
                      <div v-if="!uploadFile[log.id]" class="grid grid-cols-2 gap-2">
                          <!-- Tombol Pilih File Galeri -->
                          <label class="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-2xl cursor-pointer transition-all bg-stone-900 border-stone-800 hover:border-amber-500/40">
                              <Upload class="size-5 text-stone-600 mb-2" />
                              <p class="text-[10px] text-stone-400 font-medium text-center">Pilih Galeri</p>
                              <input type="file" accept="image/*" class="hidden" @change="(e) => handleBuktiChange(e, log.id)" />
                          </label>
                          
                          <!-- Tombol Kamera -->
                          <button type="button" @click="openCamera(log.id)" class="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-2xl cursor-pointer transition-all bg-stone-900 border-stone-800 hover:border-amber-500/40 text-stone-400 hover:text-amber-400">
                              <Camera class="size-5 mb-2" />
                              <p class="text-[10px] font-medium text-center">Buka Kamera</p>
                          </button>
                      </div>
                      
                      <!-- TAMPILAN JIKA SUDAH ADA FILE (Dari Galeri atau Kamera) -->
                      <div v-else class="relative flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-2xl transition-all bg-amber-500/5 border-amber-500/30">
                          <button type="button" @click="uploadFile[log.id] = null" class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg z-10 transition-colors">
                              <X class="size-3" />
                          </button>
                          <FileText class="size-5 text-amber-500 mb-2" />
                          <p class="text-[11px] text-amber-400 font-bold max-w-[200px] truncate">{{ uploadFile[log.id]?.name }}</p>
                          <p class="text-[9px] text-stone-500 mt-1">Hapus untuk mengganti</p>
                      </div>

                      <button v-if="uploadFile[log.id]" @click="submitBukti(log.id)" class="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 rounded-xl text-xs transition-all active:scale-95 shadow-md" :disabled="isUploading[log.id]">
                          {{ isUploading[log.id] ? 'MENGUPLOAD...' : 'KIRIM BUKTI TRANSFER' }}
                      </button>
                  </div>                 
                </div>
                </template>

                <div class="space-y-1.5 px-1">
                  <div class="flex justify-between text-xs text-stone-400">
                    <span>Nominal Donasi</span>
                    <span>{{ formatRupiah(log.nominal) }}</span>
                  </div>
                  <div v-if="getInfaqForDonasi(log)" class="flex justify-between text-xs text-stone-400">
                    <span>Infaq Sistem</span>
                    <span>{{ formatRupiah(getInfaqForDonasi(log)?.nominal || 0) }}</span>
                  </div>
                  <div class="flex justify-between text-xs font-bold text-stone-300 pt-2 mt-1 border-t border-stone-800 border-dashed">
                    <span>Total Nominal</span>
                    <span class="text-amber-400 font-mono">
                      {{ formatRupiah(Number(log.nominal) + Number(getInfaqForDonasi(log)?.nominal || 0)) }}
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
        <button @click="handleShare" type="button" title="Bagikan link" class="w-10 h-10 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer">
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
                    <Wallet class="size-4 text-amber-500" />
                    <span class="text-xs font-bold uppercase tracking-wider">Bayar via QRIS</span>
                </div>
                <button @click="closeQrisModal" class="p-1.5 rounded-xl bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition-colors">
                    <X class="size-4" />
                </button>
            </div>
            
            <div class="p-6 bg-stone-950 flex flex-col items-center gap-4 overflow-y-auto min-h-0 custom-scrollbar">
                <p class="text-base font-bold font-mono text-white">
                  MUHASABAH ID
                </p>
                <p class="text-base font-bold font-mono text-white -mt-4">
                  Sosial Kemanusian
                </p>
                <div class="w-full max-w-[240px] xs:max-w-full mx-auto flex justify-center">
                    <!-- Background putih agar mudah di-scan -->
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
                        {{ formatRupiah(Number(selectedQrisLog.nominal) + Number(getInfaqForDonasi(selectedQrisLog)?.nominal || 0)) }}
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

    <!-- MODAL KAMERA GLOBAL -->
    <div v-if="isCameraOpen" class="fixed inset-0 z-[150] bg-stone-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
        <div class="relative w-full max-w-sm bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-800 animate-in fade-in zoom-in-95 duration-200">
            <!-- Header Modal -->
            <div class="p-4 border-b border-stone-800 flex items-center justify-between bg-stone-900/50">
                <div class="flex items-center gap-2 text-stone-200">
                    <Camera class="size-4 text-amber-500" />
                    <span class="text-xs font-bold uppercase tracking-wider">Foto Bukti Transfer</span>
                </div>
                <button @click="closeCamera" class="p-1.5 rounded-xl bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition-colors">
                    <X class="size-4" />
                </button>
            </div>
            
            <!-- Video Stream -->
            <div class="relative aspect-[3/4] sm:aspect-video bg-black w-full">
                <video ref="videoElement" autoplay playsinline class="w-full h-full object-cover"></video>
            </div>
            
            <!-- Tombol Jepret -->
            <div class="p-5 bg-stone-950 flex justify-center border-t border-stone-800/80">
                <button @click="takePhoto" type="button" class="bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-full h-16 w-16 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)] active:scale-90 transition-all">
                    <Camera class="size-7" />
                </button>
            </div>
            
            <canvas ref="canvasElement" class="hidden"></canvas>
        </div>
    </div>    

  </AppLayoutPublic>
</template>

<style scoped>
.prose :deep(img) { margin-left: auto; margin-right: auto; }
.prose :deep(iframe) { width: 100% !important; aspect-ratio: 16 / 9 !important; border-radius: 1.5rem; border: 1px solid #292524; }
</style>