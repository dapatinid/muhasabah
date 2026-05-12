<script setup lang="ts">
import { Head, Link, usePage} from '@inertiajs/vue3'
import { Beef, BookOpen, BookOpenText, CalendarDays, ChartNoAxesCombined, Coins, HandHeart, HeartHandshake, House, LayoutGrid, MapPin, Scale, Search, UserRound } from 'lucide-vue-next'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import debounce from 'lodash/debounce'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import BottomNavigation from '@/components/BottomNavigation.vue' // Import di sini

const page = usePage()
const user = computed(() => page.props.auth?.user)

const props = defineProps<{
  canRegister: boolean
  kalams: Array<{
    id: number
    judul: string
    slug: string
    body: string
    kategori: string
    is_anonymous: boolean
    created_at: string
    user: { id: number; name: string } | null
  }>
  banners: Array<{ // Terima banners dari props
    id: number
    title: string
    subtitle: string
    image: string
    link: string | null
  }>
}>()

// State Search
const isSearchOpen = ref(false)
const searchQuery = ref('')
const isSearching = ref(false)
const searchResults = ref<any[]>([])

// Debounce Search Logic
const performSearch = debounce((query: string) => {
  if (!query) {
    searchResults.value = []
    isSearching.value = false
    return
  }

  // Contoh fetch ke backend. Sesuaikan route-nya nanti.
  // Untuk sementara kita filter dari props atau buat dummy future-proof
  isSearching.value = true
  
  // Simulasi request ke backend (Ganti dengan router.get atau axios nantinya)
  searchResults.value = props.kalams.filter(k => 
    k.judul.toLowerCase().includes(query.toLowerCase())
  )
  
  isSearching.value = false
}, 500)

watch(searchQuery, (newVal: string) => { // Tambahkan : string
  isSearching.value = true
  performSearch(newVal)
})

// Strip HTML dari body untuk excerpt
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').substring(0, 100) + '...'
}

function tanggal(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

const categories = [
  { name: 'Tulis Artikel', icon: '📋', link: 'halaman-dibangun', color: 'bg-amber-500/20 text-amber-400' },
  { name: 'Buat Acara',   icon: '📅', link: 'halaman-dibangun',             color: 'bg-rose-500/30 text-rose-400' },
  { name: 'Galang Dana',  icon: '💰', link: 'halaman-dibangun',             color: 'bg-emerald-500/20 text-emerald-400' },
  { name: '+Daftar Masjid', icon: '🕌', link: 'halaman-dibangun',           color: 'bg-blue-500/20 text-blue-400' },
]

const kategoriEmoji: Record<string, string> = {
  hikmah: '💡', doa: '🤲', kisah: '📖', tips: '✨', berita: '📰',
}

const isDonationOpen = ref(false)
const toggleDonation = () => isDonationOpen.value = !isDonationOpen.value

const donationMenus = [
  { name: 'Semua', link: 'halaman-dibangun', icon: LayoutGrid },
  { name: 'Infaq', link: 'halaman-dibangun', icon: Coins },
  { name: 'Program', link: 'halaman-dibangun', icon: ChartNoAxesCombined },
  { name: 'Zakat', link: 'halaman-dibangun', icon: Scale },
  { name: 'Waqaf', link: 'halaman-dibangun', icon: HandHeart },
  { name: 'Qurban', link: 'halaman-dibangun', icon: Beef },
]

// Banner Animation Logic

const carouselRef = ref<HTMLElement | null>(null)
const currentSlide = ref(0)
let autoPlayInterval: any = null

// State untuk Drag Mouse
const isDown = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

const extendedBanners = computed(() => {
  if (props.banners.length === 0) return []
  return Array(20).fill(props.banners).flat()
})

// --- Logic Auto Play ---
const startAutoPlay = () => {
  stopAutoPlay() // Pastikan tidak double interval
  autoPlayInterval = setInterval(() => {
    if (!carouselRef.value || isDown.value) return
    
    currentSlide.value++
    const firstBanner = carouselRef.value.querySelector('div, a') as HTMLElement
    if (!firstBanner) return
    
    const scrollAmount = firstBanner.offsetWidth + 12
    carouselRef.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })

    // Reset posisi jika sudah di ujung list duplikat
    if (currentSlide.value >= extendedBanners.value.length - 5) {
        currentSlide.value = props.banners.length
        carouselRef.value.scrollTo({ left: scrollAmount * props.banners.length, behavior: 'auto' })
    }
  }, 5000)
}

const stopAutoPlay = () => {
  if (autoPlayInterval) clearInterval(autoPlayInterval)
}

// --- Logic Mouse Drag ---
const handleMouseDown = (e: MouseEvent) => {
  if (!carouselRef.value) return
  isDown.value = true
  carouselRef.value.classList.add('active-drag')
  startX.value = e.pageX - carouselRef.value.offsetLeft
  scrollLeft.value = carouselRef.value.scrollLeft
  stopAutoPlay() // Berhenti saat mulai drag
}

const handleMouseLeave = () => {
  isDown.value = false
  carouselRef.value?.classList.remove('active-drag')
  startAutoPlay() // Jalan lagi saat mouse keluar
}

const handleMouseUp = () => {
  isDown.value = false
  carouselRef.value?.classList.remove('active-drag')
  startAutoPlay() // Jalan lagi saat lepas klik
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDown.value || !carouselRef.value) return
  e.preventDefault()
  const x = e.pageX - carouselRef.value.offsetLeft
  const walk = (x - startX.value) * 2 // Kecepatan scroll
  carouselRef.value.scrollLeft = scrollLeft.value - walk
}

onMounted(() => {
  if (props.banners.length > 1) {
    startAutoPlay()
  }
})

onUnmounted(() => stopAutoPlay())
</script>

<template>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
  <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

  <Head title="Beranda Ibadah" />

  <div class="min-h-screen bg-black relative overflow-x-hidden">

    <div class="fixed inset-0 z-0 opacity-20 pointer-events-none"
         :style="{
           backgroundImage: `url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22 viewBox=%220 0 80 80%22><path d=%22M40 0 L50 30 L80 40 L50 50 L40 80 L30 50 L0 40 L30 30 Z%22 fill=%22none%22 stroke=%22%23d4a017%22 stroke-width=%221%22/></svg>')`,
           backgroundSize: '100px 100px'
         }" />

    <div class="relative z-10 min-h-screen bg-stone-950 font-sans text-stone-100 max-w-xl mx-auto sm:border-x sm:border-stone-800 sm:shadow-[0_0_50px_rgba(0,0,0,0.5)]"
         style="font-family: 'Plus Jakarta Sans', sans-serif; background-image: radial-gradient(ellipse at 20% 0%, rgba(120,90,40,0.15) 0%, transparent 50%);">
      
      <!-- Navbar -->
      <nav class="px-6 py-5 flex justify-between items-center sticky top-0 z-50 bg-stone-950/80 backdrop-blur-md border-b border-stone-800/50">
        <div>
          <p class="text-[10px] text-amber-500 tracking-[0.2em] uppercase font-bold">
            {{ user ? "Ahlan wa Sahlan," : "Assalamu'alaikum," }}
          </p>
          <h1 class="text-lg font-bold text-stone-100" style="font-family: 'Amiri', serif;">
            {{ user ? user.name : 'Hamba Allah' }}  
          </h1>
        </div>
        
        <!-- Tombol Profile/Login Dinamis -->
        <Link :href="user ? '/dashboard' : '/login'" class="w-10 h-10 rounded-full bg-stone-800 border border-amber-500/30 flex items-center justify-center text-stone-400 hover:text-amber-400 transition-colors">
          <template v-if="user?.avatar">
              <img :src="user.avatar" class="w-full h-full rounded-full object-cover" />
          </template>
          <template v-else>
              <UserRound class="size-5" />
          </template>
        </Link>
      </nav>

      <main class="space-y-8 pb-32"><!-- Search Section (Sekarang menjadi Trigger Modal) -->
        <section class="relative mt-5 px-5">
          <Dialog v-model:open="isSearchOpen">
            <DialogTrigger as-child>
              <div class="relative group cursor-pointer">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 group-hover:text-amber-400 transition-colors">
                  <Search class="size-4" />
                </span>
                <div class="w-full bg-stone-900 border border-stone-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-stone-500">
                  Cari kajian, doa, atau masjid...
                </div>
              </div>
            </DialogTrigger>

            <DialogContent class="sm:max-w-lg bg-stone-950 border-stone-800 p-0 overflow-hidden gap-0">
              <DialogHeader class="p-4 border-b border-stone-800">
                <div class="relative flex items-center">
                  <Search class="absolute left-3 size-4 text-amber-500" />
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Ketik untuk mencari..."
                    class="w-full bg-transparent pl-10 pr-4 py-2 text-stone-100 outline-none placeholder:text-stone-600"
                    autofocus
                  />
                  <Loader2 v-if="isSearching" class="size-4 animate-spin text-stone-500" />
                </div>
              </DialogHeader>

              <!-- Search Results Area -->
              <div class="max-h-[60vh] overflow-y-auto p-2 no-scrollbar">
                
                <!-- State: Kosong / Belum Ketik -->
                <div v-if="!searchQuery" class="p-8 text-center">
                  <p class="text-stone-500 text-xs">Cari hikmah, inspirasi, atau program kebaikan.</p>
                </div>

                <!-- State: Hasil Pencarian (Future-proof Sections) -->
                <div v-else-if="searchResults.length > 0" class="space-y-4 p-2">
                  
                  <!-- Section Kalam -->
                  <div>
                    <h3 class="text-[10px] font-bold text-amber-500/50 uppercase tracking-widest px-2 mb-2">Kalam & Artikel</h3>
                    <div class="space-y-1">
                      <Link 
                        v-for="item in searchResults" 
                        :key="item.id" 
                        :href="`/kalam/${item.slug}`"
                        class="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-900 transition-colors group"
                      >
                        <div class="size-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                          <BookOpen class="size-4" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-sm font-medium text-stone-200 line-clamp-1 group-hover:text-amber-400 transition-colors">{{ item.judul }}</p>
                          <p class="text-[10px] text-stone-500">{{ item.kategori }}</p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  <!-- Placeholder Future Features -->
                  <div class="opacity-30">
                    <h3 class="text-[10px] font-bold text-stone-600 uppercase tracking-widest px-2 mb-2">Donasi & Masjid (Segera)</h3>
                  </div>
                </div>

                <!-- State: Tidak Ditemukan -->
                <div v-else class="p-12 text-center">
                  <p class="text-stone-600 text-sm italic">Tidak menemukan hasil untuk "{{ searchQuery }}"</p>
                </div>
              </div>

              <div class="p-3 border-t border-stone-800 bg-stone-900/30 flex justify-between items-center">
                <span class="text-[9px] text-stone-600 tracking-tighter">Tekan ESC untuk menutup</span>
                <img src="/logo-small.png" class="h-3 opacity-20 grayscale" alt="">
              </div>
            </DialogContent>
          </Dialog>
        </section>

        <!-- Banner Carousel (Center Focus) -->
        <section class="relative group/main">
          <div 
            ref="carouselRef"
            @mousedown="handleMouseDown"
            @mouseleave="handleMouseLeave"
            @mouseup="handleMouseUp"
            @mousemove="handleMouseMove"
            @mouseenter="stopAutoPlay" 
            class="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 scroll-smooth px-10 cursor-grab active:cursor-grabbing select-none"
          >
            <component 
                :is="banner.link ? 'a' : 'div'"
                v-for="(banner, index) in extendedBanners" 
                :key="index"
                :href="banner.link"
                target="_blank"
                class="min-w-[85%] relative h-44 rounded-3xl overflow-hidden snap-center border border-stone-800 shrink-0 block transition-transform duration-500 pointer-events-none group-hover/main:pointer-events-auto"
            >
              <!-- Pointer events none di atas agar drag mouse tidak terganggu oleh link/image -->
              <img :src="banner.image" :alt="banner.title" class="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none">
              <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent pointer-events-none"></div>
              
              <div class="absolute bottom-5 left-5 right-5 pointer-events-none">
                <h3 class="text-xl font-bold text-amber-100 line-clamp-1" style="font-family: 'Amiri', serif;">
                  {{ banner.title }}
                </h3>
                <p class="text-xs text-stone-300 line-clamp-1">{{ banner.subtitle }}</p>
              </div>
            </component>
          </div>

          <!-- Dots Indikator -->
          <div class="flex justify-center gap-1.5 mt-1">
            <div 
              v-for="(_, i) in banners" :key="i"
              :class="[currentSlide % banners.length === i ? 'w-4 bg-amber-500' : 'w-1 bg-stone-800']"
              class="h-1 rounded-full transition-all duration-300"
            ></div>
          </div>
        </section>             

        <!-- Layanan -->
        <section class="px-5">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-sm font-bold uppercase tracking-wider text-amber-200/70">Layanan Utama</h2>
          </div>
          <div class="grid grid-cols-4 gap-3">
            <Link v-for="cat in categories" :key="cat.name" :href="cat.link" class="flex flex-col items-center gap-2 group">
              <div :class="[cat.color, 'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 shadow-lg']">
                {{ cat.icon }}
              </div>
              <span class="text-[10px] font-semibold text-center text-stone-400 group-hover:text-amber-400 transition-colors leading-tight">
                {{ cat.name }}
              </span>
            </Link>
          </div>
        </section>

        <!-- Kalam Pilihan — dari database -->
        <section class="px-5">
          <div class="flex justify-between items-end mb-4">
            <h2 class="text-sm font-bold uppercase tracking-wider text-amber-200/70">Kalam Pilihan</h2>
            <Link href="/kalam" class="text-xs text-amber-500 font-medium hover:text-amber-400 transition-colors">
              Lihat Semua →
            </Link>
          </div>

          <!-- Kosong -->
          <div v-if="kalams.length === 0" class="text-center py-10 text-stone-600 text-sm border border-dashed border-stone-800 rounded-2xl">
            Belum ada kalam
          </div>

          <div v-else class="space-y-3">
            <Link
              v-for="kalam in kalams"
              :key="kalam.id"
              :href="`/kalam/${kalam.slug}`"
              class="block bg-stone-900/50 border border-stone-800/60 rounded-2xl p-4 hover:border-amber-500/30 transition-all"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="flex-1 min-w-0">
                  <!-- Kategori -->
                  <span class="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-2">
                    {{ kategoriEmoji[kalam.kategori] ?? '📝' }}
                    {{ kalam.kategori }}
                  </span>
                  <!-- Judul -->
                  <h4 class="text-sm font-bold text-stone-100 line-clamp-2 leading-snug mb-1"
                      style="font-family: 'Amiri', serif;">
                    {{ kalam.judul }}
                  </h4>
                  <!-- Excerpt -->
                  <p class="text-[11px] text-stone-500 line-clamp-2">
                    {{ stripHtml(kalam.body) }}
                  </p>
                </div>
                <BookOpen class="size-4 text-amber-600 shrink-0 mt-1" />
              </div>

              <!-- Footer -->
              <div class="flex items-center justify-between mt-3 pt-3 border-t border-stone-800/50">
                <span class="text-[10px] font-semibold text-stone-500">
                  {{ kalam.is_anonymous ? 'Hamba Allah' : (kalam.user?.name ?? 'Anonim') }}
                </span>
                <span class="text-[10px] text-amber-700">{{ tanggal(kalam.created_at) }}</span>
              </div>
            </Link>
          </div>
        </section>

      </main>

      <!-- Footer nav -->
      <BottomNavigation />


    </div>
  </div>
</template>

<style scoped>
.snap-x {
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
}

/* Saat sedang di-drag dengan mouse, matikan snap agar mulus */
.active-drag {
  scroll-snap-type: none;
  scroll-behavior: auto;
}

.snap-center {
  scroll-snap-align: center;
}
</style>