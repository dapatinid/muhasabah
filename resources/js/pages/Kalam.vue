<script setup lang="ts">
import { Head, Link, router, useForm, usePage } from '@inertiajs/vue3'
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import debounce from 'lodash/debounce'
import { 
  Search, BookOpen, MessageCircle, Heart, MoreHorizontal, 
  CheckCircle2, Share2, AlertTriangle, ChevronsLeft, ChevronsRight, Ellipsis,
  X, SendHorizontal,
  ChevronsDown,
  ChevronDown
} from 'lucide-vue-next'
import AppLayoutPublic from '@/layouts/AppLayoutPublic.vue'
import { toast } from 'vue-sonner'

const props = defineProps<{
  kalams: {
    data: Array<{
      id: number
      judul: string
      slug: string
      body: string
      kategori: string
      is_anonymous: boolean
      created_at: string
      user: { id: number; name: string } | null
      komentars_count: number
      reaksis_count: number
    }>
    links: Array<{ url: string | null; label: string; active: boolean }>
    // Menambahkan ketegasan typing pagination pendukung logika matematika halaman
    current_page: number
    last_page: number
  }
  filters: { search?: string; kategori?: string }
}>()

const search = ref(props.filters?.search ?? '')
const aktifKategori = ref(props.filters?.kategori ?? 'Semua')
const kategoriList = ['Semua', 'berita', 'hikmah', 'doa', 'kisah', 'tips']

// State untuk melacak origin URL aman di client-side
const baseUrl = ref('')
const activeDropdownId = ref<number | null>(null)

// Ambil lokasi URL origin saat komponen dimuat di browser
onMounted(() => {
  baseUrl.value = window.location.origin
  window.addEventListener('click', closeDropdowns)
})

onUnmounted(() => {
  window.removeEventListener('click', closeDropdowns)
})

// --- Helper: Ekstraksi Media Sesuai Urutan di Dokumen ---
function extractOrderedMedia(html: string) {
  const mediaItems: Array<{ type: 'image' | 'video'; src: string; index: number }> = []
  if (!html) return mediaItems
  
  // 1. Cari Semua Gambar
  const imgRegex = /<img[^>]+src="([^">]+)"/g
  let imgMatch
  while ((imgMatch = imgRegex.exec(html)) !== null) {
    mediaItems.push({ type: 'image', src: imgMatch[1], index: imgMatch.index })
  }

  // 2. Cari Semua Embed Video Iframe
  const videoRegex = /<iframe[^>]+src="([^">]+)"/g
  let videoMatch
  while ((videoMatch = videoRegex.exec(html)) !== null) {
    mediaItems.push({ type: 'video', src: videoMatch[1], index: videoMatch.index })
  }

  // 3. Sortir Berdasarkan Elemen yang Muncul Lebih Dulu
  return mediaItems.sort((a, b) => a.index - b.index)
}

function stripHtml(html: string): string {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').substring(0, 250)
}

function tanggal(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Baru saja'
  if (diffInHours < 24) return `${diffInHours}j`
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

const kategoriEmoji: Record<string, string> = {
  hikmah: '💡', doa: '🤲', kisah: '📖', tips: '✨', berita: '📰',
}

const getFormattedAuthors = (kalam: any) => {
  // Jika kalam diset anonim, langsung kembalikan Hamba Allah (sembunyikan semua nama)
  if (kalam.is_anonymous) {
    return 'Hamba Allah';
  }

  // Ambil nama pembuat utama
  const mainUser = kalam.user?.name || 'Hamba Allah';
  const relatedUsers = kalam.users || [];

  if (relatedUsers.length === 0) {
    return mainUser;
  }

  // Ekstrak semua nama ke dalam satu array
  const names = [mainUser, ...relatedUsers.map((u: any) => u.name || u.user?.name).filter(Boolean)];

  // Hapus duplikasi barangkali nama user utama ikut terbawa di dalam relasi
  const uniqueNames = [...new Set(names)];

  // Logika format text
  if (uniqueNames.length === 1) return uniqueNames[0];
  if (uniqueNames.length === 2) return `${uniqueNames[0]} dan ${uniqueNames[1]}`;
  if (uniqueNames.length <= 3) {
    return `${uniqueNames.slice(0, -1).join(', ')} dan ${uniqueNames[uniqueNames.length - 1]}`;
  }

  // Jika lebih dari 3 orang
  const displayedNames = uniqueNames.slice(0, 3).join(', ');
  const remainingCount = uniqueNames.length - 3;
  
  return `${displayedNames} dan ${remainingCount} orang lainnya`;
}

// --- Fungsionalitas Share Sheet ---
const handleShare = async (kalam: any) => {
  const shareUrl = `${baseUrl.value || window.location.origin}/kalam/${kalam.slug}`
  const shareTitle = kalam.judul
  const shareText = `Baca tulisan menarik: "${kalam.judul}"`

  if (navigator.share) {
    try {
      await navigator.share({ title: shareTitle, text: shareText, url: shareUrl })
    } catch (err) {
      // Dibatalkan oleh user
    }
  } else {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Link berhasil disalin ke clipboard!')
    } catch (err) {
      toast.error('Gagal menyalin link.')
    }
  }
}

// --- Helper Link WhatsApp Laporan ---
function getWhatsAppReportLink(slug: string) {
  const fullUrl = `${baseUrl.value}/kalam/${slug}`
  const text = `Izin melaporkan konten ${fullUrl}`
  return `https://wa.me/6285950540055?text=${encodeURIComponent(text)}`
}

function toggleDropdown(id: number) {
  activeDropdownId.value = activeDropdownId.value === id ? null : id
}

function closeDropdowns() {
  activeDropdownId.value = null
}

// Logic Filter & Search
watch(search, debounce((val) => {
  router.get('/kalam', { 
    search: val || undefined, 
    kategori: aktifKategori.value === 'Semua' ? undefined : aktifKategori.value 
  }, { preserveState: true, replace: true })
}, 600))

function filterKategori(kat: string) {
  aktifKategori.value = kat
  router.get('/kalam', { 
    search: search.value || undefined, 
    kategori: kat === 'Semua' ? undefined : kat 
  }, { preserveState: true, replace: true })
}

function goToPage(url: string | null) {
  if (url) router.get(url, {}, { preserveState: true })
}

function goToPageNumber(page: number) {
  router.get('/kalam', {
    search: search.value || undefined,
    kategori: aktifKategori.value === 'Semua' ? undefined : aktifKategori.value,
    page,
  }, { preserveState: true });
}

// Menghitung halaman yang akan ditampilkan (Maksimal 3 angka di tengah)
const displayedPages = computed(() => {
  const current = props.kalams?.current_page ?? 1;
  const last = props.kalams?.last_page ?? 1;
  const delta = 1; // Diubah ke 1 agar total angka yang aktif di tengah berjumlah maksimal 3 angka
  
  let start = Math.max(1, current - delta);
  let end = Math.min(last, current + delta);

  if (current <= delta) {
      end = Math.min(last, start + (delta * 2));
  } else if (current > last - delta) {
      start = Math.max(1, last - (delta * 2));
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
      pages.push(i);
  }
  return pages;
});

// 2. Inisialisasi page instance untuk membaca shared props auth
const page = usePage()
const isUserLoggedIn = computed(() => !!page.props.auth?.user)

// --- STATE MODAL INTERAKSI DI FEED ---
const isModalOpen = ref(false)
const activeKalamModal = ref<any>(null)
const isSubmittingComment = ref(false)
const isSubmittingReaction = ref(false)

const reaksiList = [
  { type: 'barakallah',  emoji: '🤲', label: 'Barakallah' },
  { type: 'masya_allah', emoji: '✨', label: "Masyaa Allah" },
  { type: 'subhanallah', emoji: '❤️', label: 'Subhanallah' },
  { type: 'aamiin',      emoji: '🙏', label: 'Aamiin' },
]

const getLocalReaction = (slug: string) => {
  return localStorage.getItem(`kalam_reaksi_${slug}`)
}

// --- LOGIKA MATH CAPTCHA ---
const captchaNum1 = ref(0)
const captchaNum2 = ref(0)
const userCaptchaAnswer = ref('')

const generateCaptcha = () => {
  // Hanya generate captcha jika user belum login
  if (isUserLoggedIn.value) return
  
  captchaNum1.value = Math.floor(Math.random() * 9) + 1
  captchaNum2.value = Math.floor(Math.random() * 9) + 1
  userCaptchaAnswer.value = ''
}

// --- INERTIA FORM KOMENTAR ---
const commentForm = useForm({
  nama_publik: '',
  body: '',
  // Menggunakan fungsi bersyarat agar tidak mengirim challenge jika sudah login
  captcha_challenge: computed(() => isUserLoggedIn.value ? '' : `${captchaNum1.value}+${captchaNum2.value}`),
  captcha_answer: ''
})

const openInteraksiModal = (kalam: any) => {
  activeKalamModal.value = kalam
  generateCaptcha()
  isModalOpen.value = true
}

const closeInteraksiModal = () => {
  isModalOpen.value = false
  activeKalamModal.value = null
  commentForm.reset('body', 'nama_publik', 'captcha_answer')
}

// --- ACTION SUBMIT HANDLER ---
const submitKomentar = () => {
  if (!activeKalamModal.value) return
  
  // Set jawaban captcha hanya jika belum login
  if (!isUserLoggedIn.value) {
    commentForm.captcha_answer = userCaptchaAnswer.value
  } else {
    commentForm.captcha_answer = ''
    commentForm.nama_publik = '' // Kosongkan nama_publik agar backend mendeteksinya dari user login
  }
  
  isSubmittingComment.value = true

  commentForm.post(`/kalam/${activeKalamModal.value.slug}/komentar`, {
    preserveScroll: true,
    onSuccess: () => {
      commentForm.reset('body', 'nama_publik', 'captcha_answer')
      generateCaptcha()
      toast.success('Komentar berhasil ditambahkan!')
    },
    onFinish: () => {
      isSubmittingComment.value = false
    }
  })
}

const toggleReaksi = (type: string) => {
  if (isSubmittingReaction.value || !activeKalamModal.value) return
  isSubmittingReaction.value = true

  const storageKey = `kalam_reaksi_${activeKalamModal.value.slug}`

  useForm({ type }).post(`/kalam/${activeKalamModal.value.slug}/reaksi`, {
    preserveScroll: true,
    onSuccess: () => {
      const currentStored = localStorage.getItem(storageKey)
      if (currentStored === type) {
        localStorage.removeItem(storageKey)
      } else {
        localStorage.setItem(storageKey, type)
      }
      // Trigger pembaruan reaktivitas manual jika diperlukan
      toast.success('Reaksi diperbarui!')
    },
    onFinish: () => {
      isSubmittingReaction.value = false
    }
  })
}

const goToKalamRespon = () => {
  if (!activeKalamModal.value || !activeKalamModal.value.slug) return

  const targetSlug = String(activeKalamModal.value.slug)

  // 1. Tutup modal terlebih dahulu
  closeInteraksiModal()

  // 2. Beri jeda 1 detik untuk efek transisi penutupan modal murni
  setTimeout(() => {
    // Kita arahkan menggunakan query parameter '?scroll=respon'
    router.get(`/kalam/${targetSlug}`, { scroll: 'respon' }, {
      preserveState: false,
      replace: true
    })
  }, 500)
}
</script>

<template>
  <Head title="Kalam — Feed Hikmah" />
  <AppLayoutPublic subtitle="Terkini" title="Kalam Kalam" :show-back="true">
    
    <div class="max-w-2xl mx-auto pb-32">
      <div class="sticky top-0 z-20 bg-stone-955/80 backdrop-blur-md border-b border-stone-800/50 py-4 space-y-4">
        <div class="relative px-5">
          <Search class="absolute left-8.5 top-1/2 -translate-y-1/2 size-4 text-stone-500" />
          <input v-model="search" type="search" placeholder="Cari kalam..." 
            class="w-full bg-stone-900/50 border border-stone-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-stone-200 placeholder:text-stone-500 outline-none focus:ring-1 focus:ring-amber-500/50" />
        </div>
        <div class="flex px-5 gap-2 overflow-x-auto no-scrollbar">
          <button v-for="kat in kategoriList" :key="kat" @click="filterKategori(kat)"
            :class="[ aktifKategori === kat ? 'bg-white text-black' : 'bg-stone-900 text-stone-400 border border-stone-800' ]"
            class="shrink-0 px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
          >
            {{ kat }}
          </button>
        </div>
      </div>

      <div class="divide-y divide-stone-800">
        <div v-for="kalam in kalams.data" :key="kalam.id" class="p-5 flex flex-col gap-4 group relative overflow-hidden odd:bg-transparent even:bg-stone-900/70">          
          <div class="w-full space-y-3">
            <div class="flex items-center justify-between relative gap-3">
            <div class="flex items-center w-full gap-3">
                <div class="size-9 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center overflow-hidden shrink-0">
                  <span v-if="kalam.is_anonymous" class="text-stone-500 text-xs font-bold">HA</span>
                  <span v-else class="text-amber-500 text-xs font-bold">
                    {{ (getFormattedAuthors(kalam) ?? 'A')[0].toUpperCase() }}
                  </span>
                </div>
                  <span 
                    :title="getFormattedAuthors(kalam)" 
                    class="w-full font-bold text-[14px] text-stone-100 line-clamp-2"
                  >
                    {{ getFormattedAuthors(kalam) }}
                  </span>
              </div>
              
              <div class="relative">                
                <button @click.stop="toggleDropdown(kalam.id)" class="flex flex-nowrap text-stone-600 hover:text-stone-400 p-1 rounded-full transition-colors">
                  <span class="text-stone-500 text-xs text-nowrap">{{ tanggal(kalam.created_at) }}</span> <ChevronDown class="size-5 pb-0.5" />
                </button>
                
                <div v-if="activeDropdownId === kalam.id" 
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
              </div>
            </div>

            <Link :href="`/kalam/${kalam.slug}`" class="block space-y-1">
              <h4 class="font-bold text-stone-200 text-[15px]" style="font-family: 'Amiri', serif;">{{ kalam.judul }}</h4>
              <p class="text-[14px] text-stone-400 line-clamp-2 leading-relaxed">
                {{ stripHtml(kalam.body) }}
              </p>
            </Link>
          </div>

          <template v-for="mediaList in [extractOrderedMedia(kalam.body)]" :key="`media-wrap-${kalam.id}`">
            
            <div 
              v-if="mediaList.length > 0" 
              :class="[
                'relative z-1 -mx-5 py-2 items-start flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory',
                // Kondisi dinamis dari mediaList
                mediaList.some(m => m.type === 'video') ? 'h-48 sm:h-56' : 'h-72 sm:h-96'
              ]"
            >
              <div class="shrink-0 w-1"></div>
              
              <template v-for="(media, idx) in mediaList" :key="`media-${idx}`">
                  
                  <div v-if="media.type === 'video'"
                    class="snap-center shrink-0 h-full aspect-video rounded-xl overflow-hidden border border-stone-800 bg-black shadow-inner"
                  >
                    <iframe 
                      :src="media.src" 
                      class="w-full h-full" 
                      frameborder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      allowfullscreen
                    ></iframe>
                  </div>

                  <div v-if="media.type === 'image'"
                    class="snap-center shrink-0 h-full rounded-xl overflow-hidden border border-stone-800 bg-stone-900/50 flex items-center justify-center max-w-[85%] sm:max-w-[75%]"
                  >
                    <img 
                      :src="media.src" 
                      class="h-full w-auto object-cover max-w-full" 
                      loading="lazy" 
                    />
                  </div>

              </template>

              <div class="shrink-0 w-5"></div>
            </div>
          </template>               

          <div class="flex items-center gap-5 pt-1 text-stone-400">
            <button 
              @click="openInteraksiModal(kalam)" 
              class="flex items-center gap-2 hover:text-amber-400 transition-colors"
            >
              <Heart class="w-4 h-4" :class="{'fill-amber-400 text-amber-400': getLocalReaction(kalam.slug)}" />
              <span>{{ kalam.reaksis_count ?? 0 }}</span>
            </button>

            <button 
              @click="openInteraksiModal(kalam)" 
              class="flex items-center gap-2 hover:text-amber-400 transition-colors"
            >
              <MessageCircle class="w-4 h-4" />
              <span>{{ kalam.komentars_count ?? 0 }}</span>
            </button>
            
            <button @click="handleShare(kalam)" class="-ms-2 p-1.5 rounded-full hover:bg-emerald-500/10 transition-colors cursor-pointer group/btn">
              <Share2 class="size-[19px] group-hover/btn:text-emerald-500" />
            </button>

            <Link :href="`/kalam/${kalam.slug}`" class="ms-auto flex items-center gap-1.5 group/btn">
              <div class="p-1.5 rounded-full hover:bg-blue-500/10 transition-colors">
                <BookOpen class="size-[19px] group-hover/btn:text-white" />
              </div>
            </Link>
          </div>

          <div class="flex items-center gap-1.5">
            <span class="text-[10px] bg-stone-900 border border-stone-800 text-stone-400 px-2.5 py-0.5 rounded-md uppercase font-extrabold tracking-wider">
              {{ kategoriEmoji[kalam.kategori] || '✨' }} {{ kalam.kategori }}
            </span>
          </div>

        </div>
      </div>

      <div v-if="kalams && kalams.last_page > 1" class="flex justify-center gap-1.5 pt-10 flex-wrap items-center">
        
        <button
          :disabled="kalams.current_page <= 1"
          @click="goToPageNumber(1)"
          class="px-3 py-1.5 rounded-xl text-xs font-semibold border bg-stone-900 border-stone-800 text-stone-500 hover:border-amber-500/30 hover:text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronsLeft class="h-4 w-4" />
        </button>

        <button v-show="kalams.current_page > 2"
          disabled 
          class="px-1 py-1.5 rounded-xl text-xs font-semibold border bg-stone-900 border-stone-800 text-stone-500 opacity-40 transition-all"
        >
          <Ellipsis class="h-4 w-4" />
        </button>      

        <button
          v-for="page in displayedPages"
          :key="page"
          @click="goToPageNumber(page)"
          class="px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all"
          :class="page === kalams.current_page
            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
            : 'bg-stone-900 border-stone-800 text-stone-500 hover:border-amber-500/30 hover:text-stone-300'"
        >
          {{ page }}
        </button>

        <button v-show="kalams.current_page < kalams.last_page - 1"
          disabled 
          class="px-1 py-1.5 rounded-xl text-xs font-semibold border bg-stone-900 border-stone-800 text-stone-500 opacity-40 transition-all"
        >
          <Ellipsis class="h-4 w-4" />
        </button>   

        <button
          :disabled="kalams.current_page >= kalams.last_page"
          @click="goToPageNumber(kalams.last_page)"
          class="px-3 py-1.5 rounded-xl text-xs font-semibold border bg-stone-900 border-stone-800 text-stone-500 hover:border-amber-500/30 hover:text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronsRight class="h-4 w-4" />
        </button>
      </div>

    </div>


    <div v-if="isModalOpen && activeKalamModal" class="fixed inset-0 z-100 flex items-end justify-center px-1 animate-in fade-in duration-200">
      <div @click="closeInteraksiModal" class="absolute inset-0 bg-stone-950/80"></div>

      <div class="relative w-full sm:max-w-lg bg-stone-900 border-x border-t border-stone-700 rounded-t-2xl shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[75vh] z-10 animate-in slide-in-from-bottom duration-200">
        
        <div class="p-4 border-b border-stone-800/60 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-stone-200 line-clamp-1">Beri Respon</h3>
            <p class="text-[11px] text-stone-500 line-clamp-1">{{activeKalamModal.judul}}</p>
          </div>
          <button @click="closeInteraksiModal" class="p-1 rounded-xl bg-stone-800 text-stone-400 hover:text-stone-200">
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="overflow-y-auto p-4 space-y-6 no-scrollbar flex-1">
          <div class="space-y-2">
            <label class="text-[11px] font-bold uppercase tracking-wider text-stone-400">Pilih Reaksi</label>
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="reaksi in reaksiList"
                :key="reaksi.type"
                @click="toggleReaksi(reaksi.type)"
                :disabled="isSubmittingReaction"
                class="flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all active:scale-95 duration-150"
                :class="getLocalReaction(activeKalamModal.slug) === reaksi.type
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-400 scale-105'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'"
              >
                <span class="text-xl mb-1">{{ reaksi.emoji }}</span>
                <span class="text-[10px] font-semibold">{{ reaksi.label }}</span>
              </button>
            </div>
          </div>

          <form @submit.prevent="submitKomentar" class="space-y-4 pt-3 border-t border-stone-800/50">
            <label class="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">Tulis Komentar</label>
            
            <div class="space-y-3">
              <input
                v-if="!isUserLoggedIn"
                v-model="commentForm.nama_publik"
                type="text"
                placeholder="Nama Anda (Opsional / Anonim)"
                maxlength="50"
                class="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2 text-xs text-stone-200 placeholder:text-stone-600 outline-none focus:border-amber-500/50"
              />

              <textarea
                v-model="commentForm.body"
                required
                rows="3"
                placeholder="Tulis untaian komentar atau doa terbaik Anda disini..."
                maxlength="500"
                class="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-200 placeholder:text-stone-600 outline-none focus:border-amber-500/50 resize-none"
              ></textarea>
            </div>

            <div v-if="!isUserLoggedIn" class="flex items-center justify-between bg-stone-950 border border-stone-800/80 p-3 rounded-xl gap-4">
              <div class="flex flex-col">
                <span class="text-[10px] text-stone-500 font-medium">Keamanan</span>
                <span class="text-xs font-bold text-amber-400 tracking-wider">Berapakah: {{ captchaNum1 }} + {{ captchaNum2 }} ?</span>
              </div>
              <input
                v-model="userCaptchaAnswer"
                type="number"
                required
                placeholder="Hasil"
                class="w-20 bg-stone-900 border border-stone-800 rounded-lg py-1.5 px-2 text-center text-xs text-stone-200 outline-none focus:border-amber-500/50"
              />
            </div>

            <button
              type="submit"
              :disabled="isSubmittingComment || !commentForm.body || (!isUserLoggedIn && !userCaptchaAnswer)"
              class="w-full bg-amber-500 disabled:bg-amber-500/20 text-stone-950 disabled:text-stone-500 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform duration-150 mb-2"
            >
              <SendHorizontal class="w-3.5 h-3.5" />
              <span>{{ isSubmittingComment ? 'Mengirim...' : 'Kirim Komentar' }}</span>
            </button>

            <!-- <div class="text-center text-[11px] text-stone-500 font-medium">
              <button type="button" @click="goToKalamRespon" class="underline hover:text-stone-300 transition-colors">Lihat Semua Komentar</button>
            </div> -->
          </form>
        </div>

      </div>
    </div>    
  </AppLayoutPublic>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>