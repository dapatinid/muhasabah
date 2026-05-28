<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Head, Link, useForm, router } from '@inertiajs/vue3'
import AppLayoutPublic from '@/layouts/AppLayoutPublic.vue'
import { toast } from 'vue-sonner'
import { 
  Tag, MapPin, HandHeart, CalendarDays, Calendar, Ticket, 
  Newspaper, Send, Heart, Users, AlertCircle, 
  ArrowDownCircle, ChevronDown, QrCode, Upload, FileText, X, Share2 
} from 'lucide-vue-next'

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
  { id: 'komentar',label: 'Tanya Jawab',      icon: Send },
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
    .filter(p => p.status === 'success')
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
  const correctAnswer = captchaNum1.value + captchaNum2.value
  if (parseInt(userCaptchaAnswer.value) !== correctAnswer) {
    alert('Jawaban kode keamanan (Captcha) salah, silakan hitung kembali.')
    generateCaptcha()
    return
  }
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
  { type: 'love',  emoji: '❤️',  label: 'Takjub'      },
  { type: 'like',  emoji: '👍',  label: 'Suka'             },
  { type: 'pray',  emoji: '🤲',  label: 'Penuh Doa' },
  { type: 'sad',   emoji: '😢',  label: 'Tidak Hadir'       },
]

const reaksiCount = computed(() => {
  const counts = { love: 0, like: 0, pray: 0, sad: 0 }
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
    bukti_acara: uploadFile.value[logId],
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

const handleShare = () => {
  if (typeof window !== 'undefined') {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success('Link berhasil disalin ke clipboard!'))
      .catch((err) => {
        toast.error('Gagal menyalin link secara otomatis.')
        console.error(err)
      })
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
          <span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            <Tag class="w-3 h-3" />
            {{ acara.kategori }} / Target: {{ acara.subkategori }}
          </span>
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
                <HandHeart class="size-3.5 text-amber-500" /> Patungan Operasional Acara
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
            class="flex items-center justify-center gap-2 w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-amber-600/20"
          >
            <Ticket class="w-5 h-5" />
            REGISTRASI / DONASI
          </Link>
          
          <div v-else class="w-full bg-stone-800 text-stone-500 font-bold py-3.5 rounded-2xl text-center text-xs uppercase tracking-wider border border-stone-700/50">
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
      <div :class="['bg-stone-950 border-b border-stone-800 transition-all duration-150 z-40', isTabsSticky ? 'fixed top-0 left-0 right-0 max-w-xl mx-auto px-5 shadow-xl pt-1' : 'relative -mx-5 px-5 mt-4']">
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
          <p class="text-[10px] font-bold uppercase tracking-widest text-stone-500 border-l-2 border-amber-500 pl-3">Deskripsi Lengkap Kegiatan</p>
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
            <input v-model="commentForm.nama_publik" type="text" placeholder="Nama Anda (Wajib isi)" class="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/50 transition-colors" />
            <textarea v-model="commentForm.body" required rows="3" placeholder="Tulis hal atau konfirmasi detail teknis yang ingin ditanyakan ke ta'mir masjid..." class="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/50 transition-colors resize-none"></textarea>
          </div>
          <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div class="flex items-center gap-2 bg-stone-950 px-3 py-2 rounded-xl border border-stone-800">
              <span class="text-xs font-mono text-stone-400 font-bold select-none tracking-wider">Jawab: {{ captchaNum1 }} + {{ captchaNum2 }} = </span>
              <input v-model="userCaptchaAnswer" type="number" required placeholder="?" class="w-20 bg-transparent text-center font-bold text-xs text-amber-400 focus:outline-none font-mono" />
            </div>
            <button type="submit" :disabled="isSubmittingComment || !commentForm.body" class="ms-auto flex items-center gap-2 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-800 disabled:text-stone-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all active:scale-95 shadow-md">
              <Send class="w-3.5 h-3.5" />
              {{ isSubmittingComment ? 'Mengirim...' : 'Kirim' }}
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
                <span class="text-xs font-bold text-amber-200">{{ komentar.user ? komentar.user.name : (komentar.nama_publik || 'Hamba Allah') }}</span>
                <span class="text-[9px] text-stone-600 font-mono">• {{ new Date(komentar.created_at).toLocaleDateString('id-ID') }}</span>
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
                    <p class="text-[11px] text-stone-500 line-clamp-1 max-w-[240px] md:max-w-md italic">
                      {{ pay.notes && pay.notes !== '-' ? `"${pay.notes}"` : 'Donasi Operasional' }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-3 shrink-0">
                  <div class="text-right space-y-0.5">
                    <span class="text-sm font-bold font-mono block text-emerald-400">
                      + {{ formatRupiah(pay.nominal) }}
                    </span>
                    <span class="block text-[10px] text-stone-600 font-medium font-mono">{{ new Date(pay.created_at).toLocaleDateString('id-ID') }}</span>
                  </div>
                  <ChevronDown class="w-4 h-4 text-stone-600 transition-transform duration-300" :class="expandedLogs.includes(pay.id) ? 'rotate-180' : ''" />
                </div>
              </div>

              <!-- ACCORDION DETAIL DONASI -->
              <div v-if="expandedLogs.includes(pay.id)" class="mt-4 pt-4 border-t border-stone-800/60 space-y-4 cursor-default" @click.stop>
                
                <div class="flex items-center justify-between text-xs bg-stone-950 p-2.5 rounded-xl border border-stone-800/50">
                  <span class="text-stone-500 font-bold uppercase tracking-widest text-[9px]">Status Validasi</span>
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
                        Tampilkan QRIS Infaq
                      </button>
                    </div>
                    
                    <div class="pt-4 border-t border-stone-800/60 space-y-3">
                      <label class="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                        <Upload class="size-3.5 text-amber-500" /> Upload Bukti Transfer Susulan
                      </label>
                      <div class="relative flex items-center justify-center w-full">
                        <label
                          class="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-2xl cursor-pointer transition-all bg-stone-900 border-stone-800 hover:border-amber-500/40"
                          :class="{ 'bg-amber-500/5 border-amber-500/30': uploadFile[pay.id] }"
                        >
                          <div class="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                            <template v-if="!uploadFile[pay.id]">
                              <Upload class="size-5 text-stone-600 mb-2" />
                              <p class="text-[11px] text-stone-400 font-medium">Klik untuk upload gambar bukti</p>
                            </template>
                            <template v-else>
                              <FileText class="size-5 text-amber-500 mb-2" />
                              <p class="text-[11px] text-amber-400 font-bold max-w-[200px] truncate">{{ uploadFile[pay.id]?.name }}</p>
                              <p class="text-[9px] text-stone-500 mt-1">Klik untuk mengganti gambar</p>
                            </template>
                          </div>
                          <input type="file" accept="image/*" class="hidden" @change="(e) => handleBuktiChange(e, pay.id)" />
                        </label>
                      </div>
                      <button
                        v-if="uploadFile[pay.id]"
                        @click="submitBukti(pay.id)"
                        class="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all active:scale-95 shadow-md"
                        :disabled="isUploading[pay.id]"
                      >
                        {{ isUploading[pay.id] ? 'MENGUPLOAD...' : 'KIRIM BUKTI VERIFIKASI' }}
                      </button>
                    </div>
                  </div>
                </template>

                <div class="space-y-1.5 px-1">
                  <div class="flex justify-between text-xs text-stone-400">
                    <span>Nominal Donasi Operasional</span>
                    <span>{{ formatRupiah(pay.nominal) }}</span>
                  </div>
                  <div v-if="getInfaqSistemUntukPeserta(pay)" class="flex justify-between text-xs text-stone-400">
                    <span>Infaq Sistem (Ditambahkan/Dipotong)</span>
                    <span class="text-amber-400">{{ formatRupiah(getInfaqSistemUntukPeserta(pay)?.nominal || 0) }}</span>
                  </div>
                  <div class="flex justify-between text-xs font-bold text-stone-300 pt-2 mt-1 border-t border-stone-800 border-dashed">
                    <span>Total Aktual Transfer</span>
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
                    <ArrowDownCircle class="w-4.5 h-4.5" />
                  </div>
                  <div class="min-w-0">
                    <h4 class="text-xs font-bold text-stone-200 truncate pr-2 uppercase">
                      {{ log.atas_nama }}
                    </h4>
                    <p class="text-[11px] text-stone-500 line-clamp-1 max-w-[240px] md:max-w-md">
                      {{ log.notes ? `"${log.notes}"` : '' }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-3 shrink-0">
                  <div class="text-right space-y-0.5">
                    <span class="text-sm font-bold font-mono block text-emerald-400">
                      + {{ Number(log.nominal) > 0 ? formatRupiah(log.nominal) : 'Gratis' }}
                    </span>
                    <span class="block text-[10px] text-stone-600 font-medium font-mono">{{ new Date(log.created_at).toLocaleDateString('id-ID') }}</span>
                  </div>
                  <ChevronDown class="w-4 h-4 text-stone-600 transition-transform duration-300" :class="expandedLogs.includes(log.id) ? 'rotate-180' : ''" />
                </div>
              </div>

              <div v-if="expandedLogs.includes(log.id)" class="mt-4 pt-4 border-t border-stone-800/60 space-y-4 cursor-default" @click.stop>
                
                <div class="flex items-center justify-between text-xs bg-stone-950 p-2.5 rounded-xl border border-stone-800/50">
                  <span class="text-stone-500 font-bold uppercase tracking-widest text-[9px]">Status Kehadiran</span>
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
                        Tampilkan QRIS Infaq
                      </button>
                    </div>
                    
                    <div class="pt-4 border-t border-stone-800/60 space-y-3">
                      <label class="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                        <Upload class="size-3.5 text-amber-500" /> Upload Bukti Transfer Susulan
                      </label>
                      <div class="relative flex items-center justify-center w-full">
                        <label
                          class="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-2xl cursor-pointer transition-all bg-stone-900 border-stone-800 hover:border-amber-500/40"
                          :class="{ 'bg-amber-500/5 border-amber-500/30': uploadFile[log.id] }"
                        >
                          <div class="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                            <template v-if="!uploadFile[log.id]">
                              <Upload class="size-5 text-stone-600 mb-2" />
                              <p class="text-[11px] text-stone-400 font-medium">Klik untuk upload gambar bukti</p>
                            </template>
                            <template v-else>
                              <FileText class="size-5 text-amber-500 mb-2" />
                              <p class="text-[11px] text-amber-400 font-bold max-w-[200px] truncate">{{ uploadFile[log.id]?.name }}</p>
                              <p class="text-[9px] text-stone-500 mt-1">Klik untuk mengganti gambar</p>
                            </template>
                          </div>
                          <input type="file" accept="image/*" class="hidden" @change="(e) => handleBuktiChange(e, log.id)" />
                        </label>
                      </div>
                      <button
                        v-if="uploadFile[log.id]"
                        @click="submitBukti(log.id)"
                        class="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all active:scale-95 shadow-md"
                        :disabled="isUploading[log.id]"
                      >
                        {{ isUploading[log.id] ? 'MENGUPLOAD...' : 'KIRIM BUKTI VERIFIKASI' }}
                      </button>
                    </div>
                  </div>
                </template>

                <div class="space-y-1.5 px-1">
                  <div class="flex justify-between text-xs text-stone-400">
                    <span>Kewajiban Investasi Acara ({{ log.jumlah_tiket ?? 1 }} Tiket)</span>
                    <span>{{ Number(log.nominal) > 0 ? formatRupiah(log.nominal) : 'Gratis' }}</span>
                  </div>
                  <div v-if="getInfaqSistemUntukPeserta(log)" class="flex justify-between text-xs text-stone-400">
                    <span>Infaq Operasional Sistem BaaS</span>
                    <span>{{ formatRupiah(getInfaqSistemUntukPeserta(log)?.nominal || 0) }}</span>
                  </div>
                  <div class="flex justify-between text-xs font-bold text-stone-300 pt-2 mt-1 border-t border-stone-800 border-dashed">
                    <span>Total Nominal Transfer</span>
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
        <button @click="handleShare" type="button" title="Bagikan link" class="w-10 h-10 bg-amber-600 hover:bg-amber-50 text-white hover:text-stone-950 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer">
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
          <div class="w-full max-w-[240px] mx-auto">
            <img src="/QRIS_MUHASABAH_ID.png" alt="QRIS Code" class="w-full h-auto object-contain shadow-md rounded-xl" />                
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
            Silakan screenshot atau scan QRIS di atas melalui aplikasi m-banking atau e-wallet Anda untuk menyelesaikan pendaftaran.
          </p>
        </div>
      </div>
    </div>   

  </AppLayoutPublic>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>