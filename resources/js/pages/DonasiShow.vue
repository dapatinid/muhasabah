<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3'
import { computed, ref, onMounted } from 'vue'
import { 
  CalendarDays, Tag, Target, Wallet, 
  Share2, BookOpen, MessageCircle, 
  ClipboardList, ArrowDownCircle, ArrowUpCircle, AlertCircle, Send,
  RefreshCw
} from 'lucide-vue-next'
import AppLayoutPublic from '@/layouts/AppLayoutPublic.vue'

const props = defineProps<{
  donasi: {
    id: number
    judul: string
    slug: string
    body: string
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
      atas_nama: string
      sapaan?: string
      nominal: number
      notes: string | null
      is_anonymous: boolean
      mutation_type: string
      created_at: string
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

// --- STATE MANAGEMENT ---
const activeTab = ref<'cerita' | 'komentar' | 'laporan'>('cerita')
const isSubmittingComment = ref(false)
const isSubmittingReaction = ref(false)
const storageKey = `donasi_reaksi_${props.donasi.slug}`
const selectedReaksi = ref<string | null>(localStorage.getItem(storageKey))

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
  const tabParam = urlParams.get('tab')

  if (tabParam === 'komentar' || tabParam === 'laporan') {
    activeTab.value = tabParam

    const newUrl = window.location.pathname
    window.history.replaceState({}, document.title, newUrl)

    setTimeout(() => {
      const tabElement = document.querySelector('.sticky')
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

// --- SUBMIT HANDLER ---
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

// --- COMPUTED DATA ---
const formatRupiah = (nominal: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(nominal)
}

const totalTasyaruf = computed(() => {
  if (!props.donasi.payments) return 0
  return props.donasi.payments
    .filter(p => p.mutation_type === 'tasyaruf')
    .reduce((sum, p) => sum + Number(p.nominal), 0)
})

const totalDonasiMasukKumulatif = computed(() => {
  if (!props.donasi.payments) return 0
  return props.donasi.payments
    .filter(p => p.mutation_type === 'donasi_utama')
    .reduce((sum, p) => sum + Number(p.nominal), 0)
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
  if (!props.donasi.tgl_selesai) {
    return 'Berlanjut'
  }
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
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'pray', emoji: '🙏', label: 'Hope' },
  { type: 'sad',  emoji: '😢', label: 'Sad' },
]

const reaksiCount = computed(() => {
  const counts: Record<string, number> = {}
  props.donasi.reaksis?.forEach(r => {
    counts[r.type] = (counts[r.type] ?? 0) + 1
  })
  return counts
})

const doaDonatur = computed(() => {
  return props.donasi.payments?.filter(p => p.mutation_type === 'donasi_utama' && p.notes && p.notes !== '-') || []
})

const laporanArusKas = computed(() => {
  if (!props.donasi.payments) return []
  return props.donasi.payments
    .filter(p => p.mutation_type !== 'infaq_sistem') 
    .sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
})
</script>

<template>
  <Head :title="donasi.judul" />

  <AppLayoutPublic :subtitle="donasi.subkategori" :title="donasi.judul" :show-back="true" back-href="/donasi">  

    <main class="px-5 py-8 space-y-8 pb-32">

      <!-- 1. Header & Progress Widget -->
      <div class="space-y-6">
        <div class="space-y-3">
          <span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            <Tag class="w-3 h-3" />
            {{ donasi.kategori }} / {{ donasi.subkategori }}
          </span>
          <h1 class="text-2xl md:text-3xl font-bold leading-tight text-amber-100">
            {{ donasi.judul }}
          </h1>
        </div>

        <!-- Progress Card -->
        <div class="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-xl">
          
          <!-- ====== OPSI A: DESAIN DONASI RUTIN (TARGET DANA = 0) ====== -->
          <template v-if="Number(donasi.target_dana) === 0">
            <div class="grid grid-cols-2 gap-2">
              <div class="space-y-1">
                <p class="text-[10px] text-stone-500 uppercase font-bold tracking-wider">Telah Disalurkan</p>
                <p class="text-xl font-black text-emerald-400 font-mono">{{ formatRupiah(totalTasyaruf) }}</p>
              </div>
              <div class="space-y-1 text-right">
                <p class="text-[10px] text-stone-500 uppercase font-bold tracking-wider">Dana Masuk</p>
                <p class="text-xl font-black text-amber-400 font-mono">{{ formatRupiah(totalDonasiMasukKumulatif) }}</p>
              </div>
            </div>

            <!-- Progress Bar Efektivitas Penyaluran -->
            <div class="space-y-1.5">
              <div class="h-2 w-full bg-stone-800 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000"
                  :style="{ width: progressRutin + '%' }"
                ></div>
              </div>
              <div class="flex justify-between items-center text-[10px] text-stone-500">
                <span class="flex items-center gap-1"><RefreshCw class="w-3 h-3 shrink-0" /> Program Rutin</span>
                <span class="font-bold text-stone-400">{{ progressRutin }}% Dana Tersalurkan</span>
              </div>
            </div>
          </template>

          <!-- ====== OPSI B: DESAIN DONASI TARGET / PROGRAM ====== -->
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
              <div 
                class="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-1000"
                :style="{ width: progressTarget + '%' }"
              ></div>
            </div>

            <div class="flex justify-between items-center text-xs text-stone-500">
              <span class="flex items-center gap-1.5"><Target class="w-3.5 h-3.5" /> Target: {{ formatRupiah(donasi.target_dana) }}</span>
              <span class="flex items-center gap-1.5"><CalendarDays class="w-3.5 h-3.5" /> {{ tanggal }}</span>
            </div>
          </template>

          <!-- TOMBOL AKSI UTAMA -->
          <Link 
            :href="`/donasi/${donasi.slug}/payment`"
            class="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-amber-500/20"
          >
            <Wallet class="w-5 h-5" />
            DONASI SEKARANG
          </Link>
        </div>        
      </div>

      <!-- NAVIGATION TABS -->
      <div class="border-b border-stone-800 sticky top-0 bg-stone-950/80 backdrop-blur-md z-10 flex gap-2 overflow-x-auto">
        <button 
          @click="activeTab = 'cerita'"
          type="button"
          :class="[
            'flex items-center gap-2 py-3.5 px-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap',
            activeTab === 'cerita' ? 'border-amber-500 text-amber-400' : 'border-transparent text-stone-500 hover:text-stone-300'
          ]"
        >
          <BookOpen class="w-4 h-4" />
          Cerita
        </button>
        <button 
          @click="activeTab = 'komentar'"
          type="button"
          :class="[
            'flex items-center gap-2 py-3.5 px-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap',
            activeTab === 'komentar' ? 'border-amber-500 text-amber-400' : 'border-transparent text-stone-500 hover:text-stone-300'
          ]"
        >
          <MessageCircle class="w-4 h-4" />
          Komentar & Doa
          <span class="text-xs px-1.5 py-0.5 bg-stone-800 text-stone-400 rounded-md font-mono">
            {{ (donasi.komentars?.length || 0) + (doaDonatur.length) }}
          </span>
        </button>
        <button 
          @click="activeTab = 'laporan'"
          type="button"
          :class="[
            'flex items-center gap-2 py-3.5 px-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap',
            activeTab === 'laporan' ? 'border-amber-500 text-amber-400' : 'border-transparent text-stone-500 hover:text-stone-300'
          ]"
        >
          <ClipboardList class="w-4 h-4" />
          Laporan Keuangan
        </button>
      </div>

      <!-- ==================== TAB 1: CERITA ==================== -->
      <div v-if="activeTab === 'cerita'" class="space-y-8">
        <div class="space-y-4">
          <p class="text-[10px] font-bold uppercase tracking-widest text-stone-500 border-l-2 border-amber-500 pl-3">Cerita Donasi</p>
          <div
            class="prose prose-invert prose-stone max-w-none prose-p:text-stone-300 prose-p:leading-relaxed prose-p:text-[15px] prose-headings:text-amber-100 prose-strong:text-amber-200 prose-img:rounded-3xl prose-img:border-stone-800"
            v-html="donasi.body"
          />
        </div>

        <!-- Reaksi Widget -->
        <div class="pt-4 border-t border-stone-800 space-y-4">
          <p class="text-[10px] font-bold uppercase tracking-widest text-stone-500">Ekspresikan Dukungan Anda</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="r in reaksiList"
              :key="r.type"
              type="button"
              @click="toggleReaksi(r.type)"
              :disabled="isSubmittingReaction"
              class="flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all bg-stone-900 active:scale-95 disabled:opacity-50"
              :class="[
                selectedReaksi === r.type 
                  ? 'border-amber-500 text-amber-400 bg-amber-500/5' 
                  : 'border-stone-800 text-stone-400 hover:border-amber-500/40'
              ]"
            >
              <span>{{ r.emoji }}</span>
              <span>{{ r.label }}</span>
              <span v-if="reaksiCount[r.type]" class="ml-1 opacity-60 font-mono text-amber-400">
                {{ reaksiCount[r.type] }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- ==================== TAB 2: KOMENTAR & REAKSI/DOA ==================== -->
      <div v-if="activeTab === 'komentar'" class="space-y-6">

        <!-- Reaksi Widget -->
        <div class="pt-4 border-t border-stone-800 space-y-4">
          <p class="text-[10px] font-bold uppercase tracking-widest text-stone-500">Ekspresikan Dukungan Anda</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="r in reaksiList"
              :key="r.type"
              type="button"
              @click="toggleReaksi(r.type)"
              :disabled="isSubmittingReaction"
              class="flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all bg-stone-900 active:scale-95 disabled:opacity-50"
              :class="[
                selectedReaksi === r.type 
                  ? 'border-amber-500 text-amber-400 bg-amber-500/5' 
                  : 'border-stone-800 text-stone-400 hover:border-amber-500/40'
              ]"
            >
              <span>{{ r.emoji }}</span>
              <span>{{ r.label }}</span>
              <span v-if="reaksiCount[r.type]" class="ml-1 opacity-60 font-mono text-amber-400">
                {{ reaksiCount[r.type] }}
              </span>
            </button>
          </div>
        </div>
        
        <!-- FORM PEMBERIAN KOMENTAR PUBLIK -->
        <form @submit.prevent="submitKomentar" class="bg-stone-900 border border-stone-800/80 rounded-3xl p-5 space-y-4">
          <p class="text-[10px] font-bold uppercase tracking-widest text-amber-400">Kirim Pertanyaan / Dukungan Publik</p>
          
          <div class="space-y-3">
            <input 
              v-model="commentForm.nama_publik" 
              type="text" 
              placeholder="Nama Anda (Wajib isi)" 
              class="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
            <textarea 
              v-model="commentForm.body" 
              required
              rows="3"
              placeholder="Tulis dukungan, pesan, atau pertanyaan Anda di sini..." 
              class="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
            ></textarea>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div class="flex items-center gap-2 bg-stone-950 px-3 py-2 rounded-xl border border-stone-800">
              <span class="text-xs font-mono text-stone-400 font-bold select-none tracking-wider">Keamanan: {{ captchaNum1 }} + {{ captchaNum2 }} = </span>
              <input 
                v-model="userCaptchaAnswer" 
                type="number" 
                required
                placeholder="?" 
                class="w-12 bg-transparent text-center font-bold text-xs text-amber-400 focus:outline-none font-mono"
              />
            </div>

            <button 
              type="submit" 
              :disabled="isSubmittingComment || !commentForm.body"
              class="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-800 disabled:text-stone-600 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all active:scale-95 shadow-md"
            >
              <Send class="w-3.5 h-3.5" />
              {{ isSubmittingComment ? 'Mengirim...' : 'Komentar' }}
            </button>
          </div>
        </form>

        <!-- Doa dari Donatur -->
        <div class="space-y-4 pt-2">
          <div class="space-y-4 pt-4 border-t border-stone-900">
            <p class="text-[10px] font-bold uppercase tracking-widest text-stone-500">Dukungan & Pertanyaan Publik</p>
            
            <div v-if="donasi.komentars?.length === 0" class="text-center py-6 text-stone-600 text-xs border border-stone-900 border-dashed rounded-2xl">
              Belum ada diskusi atau pertanyaan publik.
            </div>
            
            <div v-else class="space-y-3">
              <div v-for="komentar in donasi.komentars" :key="komentar.id" class="bg-stone-900/20 border border-stone-800 rounded-2xl p-4">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-bold text-amber-200">
                    {{ komentar.user ? komentar.user.name : (komentar.nama_publik || 'Hamba Allah (Anonim)') }}
                  </span>
                  <span class="text-[9px] text-stone-600 font-mono">• {{ new Date(komentar.created_at).toLocaleDateString('id-ID') }}</span>
                </div>
                <p class="text-sm text-stone-400 leading-relaxed">{{ komentar.body }}</p>
              </div>
            </div>
          </div>

          <p class="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Doa & Kebaikan Donatur</p>
            
          <div v-if="doaDonatur.length === 0" class="text-sm text-stone-600 italic py-2">
            Belum ada pesan doa khusus dari transaksi donasi masuk.
          </div>
            
          <div v-else class="space-y-3">
            <div v-for="pay in doaDonatur" :key="pay.id" class="bg-stone-900/40 border border-stone-800/50 rounded-2xl p-4 flex gap-4 items-start">
              <div class="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20 text-amber-500">
                🤲
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start mb-1">
                  <h4 class="text-xs font-bold text-stone-300 uppercase truncate">
                    {{ pay.sapaan || '' }} {{ pay.is_anonymous ? 'Hamba Allah' : pay.atas_nama }}
                  </h4>
                  <div class="text-right shrink-0">
                    <span class="block text-[10px] text-stone-500 font-mono">{{ new Date(pay.created_at).toLocaleDateString('id-ID') }}</span>
                  </div>
                </div>
                <div class="flex justify-between items-start gap-3">
                  <p class="text-sm text-stone-400 italic font-medium leading-relaxed">
                    "{{ pay.notes }}"
                  </p>
                  <span class="block text-xs font-bold text-emerald-400 font-mono shrink-0">{{ formatRupiah(pay.nominal) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== TAB 3: LAPORAN ==================== -->
      <div v-if="activeTab === 'laporan'" class="space-y-6">
        
        <!-- Card Saldo Riil Terkini -->
        <div class="bg-stone-900 border border-stone-800 rounded-3xl p-5 flex items-center justify-between shadow-xl">
          <div class="space-y-1">
            <span class="text-[10px] text-stone-500 uppercase font-bold tracking-wider block">Dana Program Sekarang</span>
            <span class="text-2xl font-black text-emerald-400 font-mono">{{ formatRupiah(donasi.saldo || 0) }}</span>
          </div>
          <div class="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
            <Wallet class="w-6 h-6" />
          </div>
        </div>

        <!-- List Arus Transaksi Gabungan -->
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
              class="border rounded-2xl p-4 flex gap-4 items-center justify-between transition-colors shadow-sm"
              :class="log.mutation_type === 'tasyaruf' ? 'bg-red-500/5 border-red-500/10' : 'bg-stone-900/40 border-stone-800/60'"
            >
              <div class="flex items-center gap-3.5 min-w-0">
                <div 
                  class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                  :class="log.mutation_type === 'tasyaruf' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'"
                >
                  <ArrowUpCircle v-if="log.mutation_type === 'tasyaruf'" class="w-4.5 h-4.5" />
                  <ArrowDownCircle v-else class="w-4.5 h-4.5" />
                </div>

                <div class="min-w-0">
                  <h4 class="text-xs font-bold text-stone-200 truncate pr-2 uppercase">
                    {{ log.mutation_type === 'tasyaruf' ? 'Penyaluran (Tasyaruf)' : (log.is_anonymous ? 'Hamba Allah' : log.atas_nama) }}
                  </h4>
                  <p class="text-[11px] text-stone-500 line-clamp-3 max-w-[240px] md:max-w-md">
                    {{ log.notes || 'Donasi Masuk' }}
                  </p>
                </div>
              </div>

              <div class="text-right shrink-0 space-y-0.5">
                <span 
                  class="text-sm font-bold font-mono"
                  :class="log.mutation_type === 'tasyaruf' ? 'text-red-400' : 'text-emerald-400'"
                >
                  {{ log.mutation_type === 'tasyaruf' ? '-' : '+' }} {{ formatRupiah(log.nominal) }}
                </span>
                <span class="block text-[10px] text-stone-600 font-medium font-mono">{{ new Date(log.created_at).toLocaleDateString('id-ID') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>

    <!-- Floating Share Button -->
    <div class="fixed top-4 right-6 z-50">
      <button type="button" class="w-8 h-8 bg-amber-500 text-stone-950 rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform">
        <Share2 class="w-4 h-4" />
      </button>
    </div>

  </AppLayoutPublic>
</template>

<style scoped>
.prose :deep(img) {
  margin-left: auto;
  margin-right: auto;
}
.prose :deep(iframe) {
  width: 100% !important;
  aspect-ratio: 16 / 9 !important;
  border-radius: 1.5rem;
  border: 1px solid #292524;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>