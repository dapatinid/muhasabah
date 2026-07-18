<script setup lang="ts">
import { Head, Link, useForm, usePage } from '@inertiajs/vue3'
import { computed, ref, onMounted } from 'vue'
import { CalendarDays, Share2, Tag, User, SendHorizontal, MessageSquare, MoreHorizontal, AlertTriangle, X, Reply, CornerDownRight } from 'lucide-vue-next'
import AppLayoutPublic from '@/layouts/AppLayoutPublic.vue'
import { toast } from 'vue-sonner'
import Separator from '@/components/ui/separator/Separator.vue'

const props = defineProps<{
  meta?: {
    title: string
    description: string
    image: string
    url: string
  }
  kalam: {
    id: number
    judul: string
    slug: string
    body: string
    kategori: string
    is_anonymous: boolean
    created_at: string
    user: { id: number; name: string } | null
    users?: Array<{
          id: number
          user_id: number
          name?: string
          user?: { id: number; name: string }
        }>    
    komentars: Array<{
      id: number
      parent_id: number
      body: string
      nama_publik?: string
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

const formattedAuthors = computed(() => {
  // Jika kalam diset anonim, langsung kembalikan Hamba Allah (sembunyikan semua nama)
  if (props.kalam.is_anonymous) {
    return 'Hamba Allah';
  }

  // Ambil nama pembuat utama
  const mainUser = props.kalam.user?.name || 'Hamba Allah';
  const relatedUsers = props.kalam.users || [];

  if (relatedUsers.length == 0) {
    return mainUser;
  }

  // Ekstrak semua nama ke dalam satu array
  const names = [mainUser, ...relatedUsers.map(u => u.name || u.user?.name).filter(Boolean)];

  // Hapus duplikasi barangkali nama user utama ikut terbawa di dalam relasi
  const uniqueNames = [...new Set(names)];

  // Logika format text
  if (uniqueNames.length == 1) return uniqueNames[0];
  if (uniqueNames.length == 2) return `${uniqueNames[0]} dan ${uniqueNames[1]}`;
  if (uniqueNames.length <= 3) {
    return `${uniqueNames.slice(0, -1).join(', ')} dan ${uniqueNames[uniqueNames.length - 1]}`;
  }

  // Jika lebih dari 3 orang
  const displayedNames = uniqueNames.slice(0, 3).join(', ');
  const remainingCount = uniqueNames.length - 3;
  
  return `${displayedNames} dan ${remainingCount} orang lainnya`;
});

const komentarUtama = computed(() => {
  if (!props.kalam.komentars) return []
  
  // Ambil komentar induk (parent_id null)
  const parents = props.kalam.komentars.filter(k => !k.parent_id)
  
  // Sisipkan balasan (replies) ke masing-masing induk
  return parents.map(parent => ({
    ...parent,
    replies: props.kalam.komentars.filter(k => k.parent_id == parent.id)
  }))
})

// --- STATE MANAGEMENT ---
const isSubmittingComment = ref(false)
const isSubmittingReaction = ref(false)
const storageKey = `kalam_reaksi_${props.kalam.slug}`
const selectedReaksi = ref<string | null>(localStorage.getItem(storageKey))
const showReplyModal = ref(false) // ✔️ Samakan menjadi showReplyModal
const selectedComment = ref<any>(null)

// --- INERTIA PAGE PROPS (untuk deteksi status login) ---
// Di dalam <script setup>, $page tidak tersedia secara otomatis seperti di template,
// jadi kita wajib memanggil usePage() secara eksplisit.
const page = usePage()
const isUserLoggedIn = computed(() => !!(page.props.auth as any)?.user)

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

  commentForm.captcha_answer = userCaptchaAnswer.value
  isSubmittingComment.value = true

  commentForm.post(`/kalam/${props.kalam.slug}/komentar`, {
    preserveScroll: true,
    onSuccess: () => {
      commentForm.reset('body', 'nama_publik')
      generateCaptcha()
      // toast.success('Komentar berhasil dikirim!')
    },
    onFinish: () => {
      isSubmittingComment.value = false
    }
  })
}

const toggleReaksi = (type: string) => {
  if (isSubmittingReaction.value) return
  isSubmittingReaction.value = true

  useForm({ type }).post(`/kalam/${props.kalam.slug}/reaksi`, {
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
const penulis = computed(() =>
  props.kalam.is_anonymous ? 'Hamba Allah' : (props.kalam.user?.name ?? 'Anonim')
)

const tanggal = computed(() =>
  new Date(props.kalam.created_at).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }).replace('pukul', '|')
)

const kategoriLabel: Record<string, string> = {
  hikmah: 'Hikmah', doa: 'Doa', kisah: 'Kisah', tips: 'Tips & Trik', berita: 'Berita',
}

const reaksiList = [
  { type: 'barakallah',  emoji: '🤲', label: 'Barakallah' },
  { type: 'masya_allah', emoji: '✨', label: "Masyaa Allah" },
  { type: 'subhanallah', emoji: '❤️', label: 'Subhanallah' },
  { type: 'aamiin',      emoji: '🙏', label: 'Aamiin' },
]

const reaksiCount = computed(() => {
  const counts: Record<string, number> = {}
  props.kalam.reaksis?.forEach(r => {
    counts[r.type] = (counts[r.type] ?? 0) + 1
  })
  return counts
})

// --- FUNGSI SHARE KALAM ---
const handleShare = async () => {
  const shareUrl = `${window.location.origin}/kalam/${props.kalam.slug}`
  const shareTitle = props.kalam.judul
  const shareText = `Baca tulisan menarik: "${props.kalam.judul}"`

  if (navigator.share) {
    try {
      await navigator.share({ title: shareTitle, text: shareText, url: shareUrl })
    } catch (err) {
      // Tangkap error jika user membatalkan dialog share, biarkan kosong agar tidak muncul error di console
    }
  } else {
    // Fallback untuk browser desktop lama atau in-app browser tertentu
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Link tulisan berhasil disalin!', {
        description: 'Silakan bagikan hikmah dan ilmu ini ke kerabat Anda.',
        duration: 3000,
      })
    } catch (err) {
      toast.error('Gagal menyalin tautan.')
      console.error(err)
    }
  }
}

// SCROLL HANDLER
function scrollToRespon() {
  const el = document.getElementById('respon')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}


// --- Helper Link WhatsApp Laporan ---
const baseUrl = ref('')
const activeDropdownId = ref<number | null>(null)

onMounted(() => {
  baseUrl.value = window.location.origin
  window.addEventListener('click', closeDropdowns)

  // AMAN UNTUK PRODUCTION: Deteksi parameter query '?scroll=respon'
  const urlParams = new URLSearchParams(window.location.search)
  
  if (urlParams.get('scroll') === 'respon') {
    // Lakukan pemeriksaan berkala (maksimal 2 detik) untuk memastikan elemen sudah dirender oleh Vue
    let checkExist = setInterval(() => {
      const element = document.getElementById('respon')
      
      if (element) {
        // Jika elemen ditemukan, langsung gulirkan layar ke target
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        
        // Hapus interval agar tidak berjalan terus-menerus
        clearInterval(checkExist)
        
        // Opsional: Bersihkan parameter '?scroll=respon' dari URL browser agar rapi jika halaman di-refresh
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }, 100) // Cek setiap 100ms

    // Pengaman: Matikan interval setelah 2.5 detik jika elemen memang tidak ditemukan (mencegah memory leak)
    setTimeout(() => clearInterval(checkExist), 2500)
  }
})

function getWhatsAppReportLink(slug: string) {
  const fullUrl = `${baseUrl.value}/kalam/${slug}`
  const text = `Izin melaporkan konten ${fullUrl}`
  return `https://wa.me/6285950540055?text=${encodeURIComponent(text)}`
}

function toggleDropdown(id: number) {
  activeDropdownId.value = activeDropdownId.value == id ? null : id
}

function closeDropdowns() {
  activeDropdownId.value = null
}

// State untuk mengontrol visibilitas dropdown
const showAuthorDropdown = ref(false);

// Mengumpulkan semua data penulis (utama & relasi) untuk dropdown
const authorList = computed(() => {
  if (props.kalam.is_anonymous) return [];

  const list = [];
  
  // 1. Masukkan penulis utama
  if (props.kalam.user) {
    list.push(props.kalam.user);
  }

  // 2. Masukkan penulis tambahan dari relasi
  if (props.kalam.users && props.kalam.users.length > 0) {
    props.kalam.users.forEach(item => {
      // Cerdas mendeteksi: Jika 'item' memiliki 'name', berarti itu langsung objek user. 
      // Jika tidak, kita coba cari di dalam 'item.user'
      const authorData = item.name ? item : item.user;
      
      if (authorData && authorData.id) {
        // Mencegah duplikasi jika penulis utama terdaftar juga di relasi
        if (!list.find(u => u.id == authorData.id)) {
          list.push(authorData);
        }
      }
    });
  }
  
  return list;
});

// Form Inertia untuk Balasan
const replyForm = useForm({
  parent_id: null as number | null,
  nama_publik: '',
  body: '',
  captcha_challenge: computed(() => `${captchaNum1.value}+${captchaNum2.value}`),
  captcha_answer: ''
})

// Fungsi Buka Modal Balas
const openReplyModal = (komentar: any) => {
  selectedComment.value = komentar
  replyForm.reset()
  replyForm.parent_id = komentar.id
  
  if (!isUserLoggedIn.value) {
    generateCaptcha() // ✔️ Panggil captcha di sini
  }
  showReplyModal.value = true
}

// ✔️ Ganti nama fungsinya menjadi closeReplyModal
const closeReplyModal = () => {
  showReplyModal.value = false
  selectedComment.value = null
  replyForm.reset()
}

// Helper Nama Penulis Komentar (Prioritas: nama_publik -> relasi user -> Hamba Allah)
const getAuthorName = (item: any) => {
  if (item.nama_publik) return item.nama_publik
  if (item.user?.name) return item.user.name
  return 'Hamba Allah'
}

// Fungsi Kirim Balasan
const submitReply = () => {
  // Validasi Captcha jika Guest
  if (!isUserLoggedIn.value) {
    const expected = captchaNum1.value + captchaNum2.value
    if (parseInt(userCaptchaAnswer.value) !== expected) {
      toast.error('Jawaban perhitungan hitungan salah, silakan coba lagi.')
      generateCaptcha()
      return
    }
  }

  // ✔️ Sinkronkan jawaban captcha ke form sebelum dikirim (tadinya tidak pernah terkirim ke server)
  replyForm.captcha_answer = userCaptchaAnswer.value

  replyForm.post(`/kalam/${props.kalam.slug}/komentar`, {
    preserveScroll: true,
    onSuccess: () => {
      toast.success('Balasan komentar berhasil dikirim!')
      closeReplyModal()
    },
    onError: () => {
      toast.error('Gagal mengirim balasan, periksa isian Anda.')
      if (!isUserLoggedIn.value) generateCaptcha()
    }
  })
}



const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // 1. Logika untuk "barusan" (di bawah 60 detik)
    if (seconds < 60) return 'barusan';

    // 2. Logika untuk "xx menit lalu" (di bawah 60 menit)
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} menit lalu`;

    // 3. Selain kondisi di atas, format tanggal absolut (contoh: "2026 Juli 3, 10:23")
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    
    // Ambil nama bulan dalam bahasa Indonesia secara manual
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const monthName = months[date.getMonth()];
    const day = date.getDate();

    // Jika tahun berbeda dengan tahun sekarang, tampilkan tahun di depan
    if (date.getFullYear() !== now.getFullYear()) {
        return `${date.getFullYear()} ${monthName} ${day}, ${hour}:${minute}`;
    }

    // Jika tahun sama, tahun disembunyikan
    return `${monthName} ${day}, ${hour}:${minute}`;
};
</script>

<template>
  <Head>
    <title>{{ kalam.judul }}</title>
    <meta v-if="meta" name="description" :content="meta.description" />
    <meta v-if="meta" property="og:title" :content="meta.title" />
    <meta v-if="meta" property="og:description" :content="meta.description" />
    <meta v-if="meta" property="og:image" :content="meta.image" />
    <meta v-if="meta" property="og:url" :content="meta.url" />
    <meta property="og:type" content="article" />
  </Head>

  <AppLayoutPublic :subtitle="kalam.kategori" :title="kalam.judul" :show-back="true" back-href="/kalam">  

    <main class="px-5 py-8 space-y-8 pb-32">

      <div class="space-y-4">
          <div class="flex justify-between items-center"> 
            <span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              <Tag class="w-3 h-3" />
               {{ kategoriLabel[kalam.kategori] ?? kalam.kategori }}
            </span>
            
            <span class="relative">
              <button @click.stop="toggleDropdown(kalam.id)" class="text-amber-400 p-1 rounded-full">
                <MoreHorizontal class="size-5" />
              </button>
              
              <div v-if="activeDropdownId == kalam.id" 
                class="absolute right-0 mt-1 w-48 bg-stone-900 border border-stone-800 rounded-xl shadow-xl py-1 z-30 animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <a :href="getWhatsAppReportLink(kalam.slug)"
                    target="_blank"
                    class="flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:bg-stone-800/60 transition-colors font-medium"
                >
                  <AlertTriangle class="size-3.5 text-red-500" />
                  Laporkan konten
                </a>
              </div>
            </span>  
          </div>

        <h1 class="text-2xl md:text-3xl font-bold leading-snug text-amber-100" style="font-family: 'Amiri', serif;">
          {{ kalam.judul }}
        </h1>

        <div class="flex flex-wrap gap-4 text-xs text-stone-500">
          <span class="flex items-center gap-1.5">
            <User class="size-3.5 shrink-0" />
            <div class="relative flex items-center">
              <button
                type="button"
                @click="showAuthorDropdown = !showAuthorDropdown"
                @blur="setTimeout(() => showAuthorDropdown = false, 200)"
                :disabled="kalam.is_anonymous"
                class="text-left font-medium text-emerald-500 hover:text-emerald-400 transition-colors focus:outline-none"
                :class="{ 'text-stone-400 hover:text-stone-400 cursor-default': kalam.is_anonymous }"
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
                  v-if="showAuthorDropdown && !kalam.is_anonymous"
                  class="absolute left-0 top-full mt-2 w-48 bg-stone-900 border border-stone-700 rounded-lg shadow-xl z-50 overflow-hidden"
                >
                  <div class="py-1">
                    <button 
                      @click="showAuthorDropdown = false" 
                      type="button"
                      title="Tutup menu"
                      class="w-full flex px-4 py-2 text-sm text-emerald-500 hover:text-emerald-400"
                    >
                      <span>Authors</span><span class="ms-auto"><X class="text-red-500 hover:text-red-300 w-4 h-4 stroke-[2.5]" /></span>
                    </button>
                    <Separator class="w-full h-px bg-stone-800 my-1" /> 
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
            </div>
          </span>
          <span class="flex items-center gap-1.5">
            <CalendarDays class="size-3.5" />
            {{ tanggal }}
          </span>
        </div>

        <div class="flex items-center gap-3 pt-1">
          <div class="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          <span class="text-amber-500/40 text-lg">✦</span>
          <div class="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        </div>
      </div>

      <div
        class="prose prose-invert prose-stone max-w-none
               prose-p:text-stone-300 prose-p:leading-relaxed prose-p:text-[15px]
               prose-headings:font-bold prose-headings:text-amber-100
               prose-strong:text-amber-200
               prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline
               prose-blockquote:border-l-amber-500 prose-blockquote:text-stone-400 prose-blockquote:bg-stone-900/50 prose-blockquote:rounded-r-xl prose-blockquote:py-1
               prose-ul:text-stone-300 prose-ol:text-stone-300
               prose-img:rounded-2xl prose-img:border prose-img:border-stone-800
               prose-iframe:w-full prose-iframe:aspect-video prose-iframe:rounded-xl"
        v-html="kalam.body"
      />

      <div class="flex items-center gap-3">
        <div class="h-px flex-1 bg-stone-800" />
        <span class="text-stone-700 text-xs">•</span>
        <div class="h-px flex-1 bg-stone-800" />
      </div>

      <section id="respon" class="space-y-8 pt-8">
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="r in reaksiList"
              :key="r.type"
              type="button"
              @click="toggleReaksi(r.type)"
              :disabled="isSubmittingReaction"
              class="flex items-center justify-center gap-2 px-4 py-2.5 w-full rounded-2xl border text-xs font-bold transition-all bg-stone-900 active:scale-95 disabled:opacity-50"
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

        <form @submit.prevent="submitKomentar" class="bg-stone-900 border border-stone-800/80 rounded-3xl p-5 space-y-4">
          <p class="text-[10px] font-bold uppercase tracking-widest text-amber-400">Kirim Pertanyaan / Tanggapan Publik</p>
          
          <div class="space-y-3">
            <input v-if="!$page.props.auth.user"
              v-model="commentForm.nama_publik" 
              type="text" 
              placeholder="Nama Anda (Wajib isi)" 
              class="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
            <textarea 
              v-model="commentForm.body" 
              required
              rows="3"
              placeholder="Tulis diskusi, tanggapan, atau apresiasi Anda di sini..." 
              class="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
            ></textarea>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div v-if="!$page.props.auth.user" class="flex items-center gap-2 bg-stone-950 px-3 py-2 rounded-xl border border-stone-800">
              <span class="text-xs font-mono text-stone-400 font-bold select-none tracking-wider">Jawab: {{ captchaNum1 }} + {{ captchaNum2 }} = </span>
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
              class="ms-auto flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-800 disabled:text-stone-600 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all active:scale-95 shadow-md"
            >
              <SendHorizontal class="w-3.5 h-3.5" />
              <!-- {{ isSubmittingComment ? 'Mengirim...' : 'Komentar' }} -->
            </button>
          </div>
        </form>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <p class="text-[10px] font-bold uppercase tracking-widest text-stone-500">
              Diskusi Publik 
              <span class="text-amber-400 font-mono ml-1">({{ kalam.komentars?.length || 0 }})</span>
            </p>
          </div>

          <div v-if="!kalam.komentars || kalam.komentars.length == 0"
               class="text-center py-5 rounded-xl border-2 border-dashed border-stone-700 bg-stone-900/10 text-stone-600 text-sm">
            Belum ada diskusi atau tanggapan publik.
          </div>

          <div v-else class="space-y-6">
              <div 
                v-for="komentar in komentarUtama" 
                :key="komentar.id"
                class="bg-stone-900/60 border border-stone-800/80 rounded-2xl p-5 space-y-4 transition-colors hover:border-stone-700/60"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-400 font-bold text-sm shadow-inner">
                      {{ getAuthorName(komentar).charAt(0).toUpperCase() }}
                    </div>
                    <div class="block -space-y-2">
                      <h4 class="text-sm font-bold text-stone-200">{{ getAuthorName(komentar) }}</h4>
                      <span class="text-[11px] text-stone-500">{{ formatRelativeTime(komentar.created_at) }}</span>
                    </div>
                  </div>

                  <button 
                    @click="openReplyModal(komentar)"
                    type="button"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800/80 hover:bg-amber-500/10 text-stone-400 hover:text-amber-400 border border-stone-700/60 hover:border-amber-500/30 text-xs font-medium transition-all active:scale-95 cursor-pointer"
                  >
                    <Reply class="w-3.5 h-3.5" />
                    <span>Balas</span>
                  </button>
                </div>

                <p class="text-sm text-stone-300 leading-relaxed pl-12 whitespace-pre-line">
                  {{ komentar.body }}
                </p>

                <div 
                  v-if="komentar.replies && komentar.replies.length > 0" 
                  class="mt-4 pt-4 pl-4 md:pl-8 border-l-2 border-amber-500/20 ml-4 md:ml-6 space-y-4"
                >
                  <div 
                    v-for="balasan in komentar.replies" 
                    :key="balasan.id"
                    class="bg-stone-950/50 border border-stone-800/60 rounded-xl p-4 space-y-2"
                  >
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2">
                        <CornerDownRight class="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span class="text-xs font-bold text-amber-400/90">{{ getAuthorName(balasan) }}</span>
                        <span class="text-[10px] text-stone-600">•</span>
                        <span class="text-[10px] text-stone-500">{{ formatRelativeTime(balasan.created_at) }}</span>
                      </div>
                    </div>

                    <p class="text-xs text-stone-300 leading-relaxed pl-5 whitespace-pre-line">
                      {{ balasan.body }}
                    </p>
                  </div>
                </div>
                </div>
            </div>
        </div>
      </section>
      </main>

  

    <div class="fixed bottom-46 max-w-xl mx-auto inset-x-0 z-50 pointer-events-none">
      <div class="absolute left-5 pointer-events-auto flex flex-col gap-3">
        <button 
          @click="scrollToRespon"
          type="button" 
          title="Ke bagian komentar"
          class="w-10 h-10 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-amber-400 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <MessageSquare class="w-4 h-4 stroke-[2.5]" />
        </button>

        <button 
          @click="handleShare"
          type="button" 
          title="Bagikan tulisan"
          class="w-10 h-10 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <Share2 class="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>   
    

  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div 
      v-if="showReplyModal" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
    >
      <div class="absolute inset-0" @click="closeReplyModal"></div>

      <div class="relative w-full max-w-lg bg-stone-950 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden z-10">
        
        <div class="flex items-center justify-between px-6 py-4 border-b border-stone-800/80 bg-stone-900/50">
          <div class="flex items-center gap-2.5">
            <Reply class="w-4 h-4 text-amber-500" />
            <h3 class="text-sm font-bold text-stone-200">Balas Komentar</h3>
          </div>
          <button 
            @click="closeReplyModal" 
            type="button"
            class="text-stone-500 hover:text-stone-300 transition-colors p-1 rounded-lg hover:bg-stone-800"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div v-if="selectedComment" class="mx-6 mt-5 p-3.5 bg-stone-900/80 border-l-4 border-amber-500 rounded-r-xl">
          <p class="text-xs font-semibold text-amber-400 mb-1">
            Membalas {{ getAuthorName(selectedComment) }}:
          </p>
          <p class="text-xs text-stone-400 italic line-clamp-2">
            "{{ selectedComment.body }}"
          </p>
        </div>

        <form @submit.prevent="submitReply" class="p-6 space-y-4">
          
          <div v-if="!isUserLoggedIn" class="space-y-1.5">
            <label class="block text-xs font-medium text-stone-400">
              Nama Anda <span class="text-stone-600">(Opsional, kosongkan untuk Hamba Allah)</span>
            </label>
            <input
              v-model="replyForm.nama_publik"
              type="text"
              placeholder="Tulis nama atau inisial..."
              class="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 placeholder-stone-600 outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-medium text-stone-400">
              Isi Balasan <span class="text-amber-500">*</span>
            </label>
            <textarea
              v-model="replyForm.body"
              required
              rows="4"
              placeholder="Tulis balasan Anda dengan santun dan bermanfaat..."
              class="w-full bg-stone-900 border border-stone-800 rounded-xl p-3.5 text-xs text-stone-200 placeholder-stone-600 outline-none focus:border-amber-500/50 transition-colors resize-none"
            ></textarea>
          </div>

          <div v-if="!isUserLoggedIn" class="p-3 bg-stone-900/50 border border-stone-800/80 rounded-xl flex items-center justify-between gap-3">
            <span class="text-xs font-medium text-stone-300 tracking-wider">
              Berapakah: <strong class="text-amber-400">{{ captchaNum1 }} + {{ captchaNum2 }}</strong> ?
            </span>
            <input
              v-model="userCaptchaAnswer"
              type="number"
              required
              placeholder="Hasil"
              class="w-20 bg-stone-950 border border-stone-800 rounded-lg py-1.5 px-2 text-center text-xs text-stone-200 outline-none focus:border-amber-500/50"
            />
          </div>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              @click="closeReplyModal"
              class="px-4 py-2.5 rounded-xl border border-stone-800 hover:bg-stone-800 text-stone-400 text-xs font-semibold transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              :disabled="replyForm.processing || !replyForm.body || (!isUserLoggedIn && !userCaptchaAnswer)"
              class="px-5 py-2.5 bg-amber-500 disabled:bg-amber-500/20 text-stone-950 disabled:text-stone-600 font-bold text-xs rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
            >
              <SendHorizontal class="w-3.5 h-3.5" />
              <span>{{ replyForm.processing ? 'Mengirim...' : 'Kirim Balasan' }}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  </Transition>        

  </AppLayoutPublic>
</template>

<style scoped>
.prose :deep(blockquote) {
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Mengunci rasio video YouTube di dalam v-html */
.prose :deep(iframe) {
  width: 100% !important;
  aspect-ratio: 16 / 9 !important; /* Mengunci rasio 16:9 */
  height: auto !important;         /* Memaksa height mengikuti aspect-ratio */
  border-radius: 0.75rem;          /* Sesuai dengan rounded-xl */
  border: 1px solid #292524;       /* Sesuai dengan border-stone-800 */
}
</style>