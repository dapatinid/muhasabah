<script setup lang="ts">
import { Head, Link, usePage } from '@inertiajs/vue3'
import { 
  Beef, BookOpen, CalendarDays, ChartNoAxesCombined, Coins, 
  HandHeart, HeartHandshake, LayoutGrid, Scale, Search, 
  UserRound, Target, Heart, User, Loader2, 
  ArrowRight
} from 'lucide-vue-next'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import debounce from 'lodash/debounce'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import AppLayoutPublic from '@/layouts/AppLayoutPublic.vue'

const page = usePage()
const user = computed(() => page.props.auth?.user)

// Integrasi Props sesuai dengan struktur Model Donasi & Kalam
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
  banners: Array<{
    id: number
    title: string
    subtitle: string
    image: string
    link: string | null
  }>
  donasis: Array<{
    id: number
    user_id: number | null
    judul: string
    slug: string
    panduan_donasi: string | null
    body: string
    kategori: string
    subkategori: string
    thumbnail: string | null
    image: string | null
    target_dana: number
    saldo: number
    tgl_mulai: string | null
    tgl_selesai: string | null
    is_published: number
    created_at: string
    payments?: Array<{
      id: number
      mutation_type: string // 'donasi_utama', 'tasyaruf', dll
      nominal: number
      paymentable_id: number
      paymentable_type: string
    }>
    total_tasyaruf?: number
    total_donasi_masuk?: number
    payments_count?: number
  }>
}>()

// State Search
const isSearchOpen = ref(false)
const searchQuery = ref('')
const isSearching = ref(false)

const searchResultsKalam = ref<any[]>([])
const searchResultsDonasi = ref<any[]>([])

// Debounce Search Logic
const performSearch = debounce((query: string) => {
  if (!query) {
    searchResultsKalam.value = []
    searchResultsDonasi.value = []
    isSearching.value = false
    return
  }

  isSearching.value = true
  
  searchResultsKalam.value = props.kalams.filter(k => 
    k.judul.toLowerCase().includes(query.toLowerCase())
  )
  
  searchResultsDonasi.value = props.donasis.filter(d => 
    d.judul.toLowerCase().includes(query.toLowerCase())
  )
  
  isSearching.value = false
}, 500)

watch(searchQuery, (newVal: string) => {
  isSearching.value = true
  performSearch(newVal)
})

// Helper Functions
function stripHtml(html: string, length = 100): string {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').substring(0, length) + '...'
}

function tanggal(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

function formatRupiah(nominal: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(nominal)
}

function getSisaHari(tgl_selesai: string | null, created_at: string): string {
  if (!tgl_selesai) {
    return 'Berlanjut'
  }
  const target = new Date(tgl_selesai)
  const sekarang = new Date()
  target.setHours(0, 0, 0, 0)
  sekarang.setHours(0, 0, 0, 0)

  const selisihWaktu = target.getTime() - sekarang.getTime()
  const sisaHari = Math.ceil(selisihWaktu / (1000 * 60 * 60 * 24))

  if (sisaHari > 0) return `Sisa ${sisaHari} hari lagi`
  if (sisaHari === 0) return 'Berakhir hari ini'
  return 'Program selesai'
}

// 1. Menghitung Total Tasyaruf (Pengeluaran/Penyaluran Dana) Berdasarkan Model Payment
function getTotalTasyaruf(donasi: any): number {
  if (donasi.total_tasyaruf !== undefined) return Number(donasi.total_tasyaruf)
  if (!donasi.payments) return 0
  return donasi.payments
    .filter((p: any) => p.mutation_type === 'tasyaruf')
    .reduce((sum: number, p: any) => sum + Number(p.nominal), 0)
}

// 2. Menghitung Total Dana Masuk Kumulatif Berdasarkan Model Payment
function getTotalDonasiMasuk(donasi: any): number {
  if (donasi.total_donasi_masuk !== undefined) return Number(donasi.total_donasi_masuk)
  if (!donasi.payments) return 0
  return donasi.payments
    .filter((p: any) => p.mutation_type === 'donasi_utama')
    .reduce((sum: number, p: any) => sum + Number(p.nominal), 0)
}

// Opsi A Progress: Distribusi Penyaluran Dana vs Dana Masuk
function calculateProgressRutin(donasi: any): number {
  const totalTersalurkan = getTotalTasyaruf(donasi)
  const totalDonasi = getTotalDonasiMasuk(donasi)
  if (totalDonasi === 0) return 0
  const percent = Math.round((totalTersalurkan / totalDonasi) * 100)
  return percent > 100 ? 100 : percent
}

// Opsi B Progress: Pencapaian Dana Masuk vs Target Anggaran Dana
function calculateProgressTarget(donasi: any): number {
  const totalDonasi = getTotalDonasiMasuk(donasi)
  const target = Number(donasi.target_dana)
  if (!target || target <= 0) return 0
  const percent = (totalDonasi / target) * 100
  return percent > 100 ? 100 : Math.round(percent)
}

// Menghitung Jumlah Donatur Terdaftar Berdasarkan Model Payment
function getJumlahDonatur(donasi: any): number {
  if (donasi.payments_count !== undefined) return donasi.payments_count
  if (!donasi.payments) return 0
  return donasi.payments.filter((p: any) => p.mutation_type === 'donasi_utama').length
}

const categories = [
  { name: 'Tulis Kalam', icon: '📋', link: 'halaman-dibangun', color: 'bg-amber-500/20 text-amber-400' },
  { name: 'Buat Acara',   icon: '📅', link: 'halaman-dibangun',             color: 'bg-rose-500/30 text-rose-400' },
  { name: 'Galang Dana',  icon: '💰', link: 'halaman-dibangun',             color: 'bg-emerald-500/20 text-emerald-400' },
  { name: 'Riyadhoh', icon: '🎖️', link: '/laporan-riyadhoh',           color: 'bg-blue-500/20 text-blue-400' },
]

const kategoriEmoji: Record<string, string> = {
  hikmah: '💡', doa: '🤲', kisah: '📖', tips: '✨', berita: '📰',
}

// Banner Carousel Logic
const carouselRef = ref<HTMLElement | null>(null)
const currentSlide = ref(0)
let autoPlayInterval: any = null

const isDragging = ref(false);
const startX = ref(0);
const scrollLeft = ref(0);
const isDown = ref(false);

const extendedBanners = computed(() => {
  if (props.banners.length === 0) return []
  return Array(20).fill(props.banners).flat()
})

const startAutoPlay = () => {
  stopAutoPlay()
  autoPlayInterval = setInterval(() => {
    if (!carouselRef.value || isDown.value) return
    currentSlide.value++
    const firstBanner = carouselRef.value.querySelector('div, a') as HTMLElement
    if (!firstBanner) return
    const scrollAmount = firstBanner.offsetWidth + 12
    carouselRef.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })

    if (currentSlide.value >= extendedBanners.value.length - 5) {
        currentSlide.value = props.banners.length
        carouselRef.value.scrollTo({ left: scrollAmount * props.banners.length, behavior: 'auto' })
    }
  }, 5000)
}

const stopAutoPlay = () => {
  if (autoPlayInterval) clearInterval(autoPlayInterval)
}

const handleDragStart = (e: MouseEvent | TouchEvent) => {
  if (!carouselRef.value) return;
  isDown.value = true;
  isDragging.value = false;
  const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
  startX.value = pageX - carouselRef.value.offsetLeft;
  scrollLeft.value = carouselRef.value.scrollLeft;
  carouselRef.value.classList.add('active-drag');
  stopAutoPlay();
};

const handleDragMove = (e: MouseEvent | TouchEvent) => {
  if (!isDown.value || !carouselRef.value) return;
  const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
  const x = pageX - carouselRef.value.offsetLeft;
  const dist = x - startX.value;

  if (Math.abs(dist) > 10) isDragging.value = true;
  if (e.type === 'mousemove') {
    e.preventDefault();
    carouselRef.value.scrollLeft = scrollLeft.value - dist * 1.5;
  }
};

const handleDragEnd = () => {
  isDown.value = false;
  carouselRef.value?.classList.remove('active-drag');
  startAutoPlay();
};

const handleBannerClick = (e: MouseEvent) => {
  if (isDragging.value) {
    e.preventDefault();
    e.stopPropagation();
  }
};

const handleScroll = () => {
  if (!carouselRef.value || props.banners.length === 0) return;
  const width = carouselRef.value.querySelector('div, a')?.clientWidth || 0;
  if (width > 0) {
    const index = Math.round(carouselRef.value.scrollLeft / (width + 12));
    currentSlide.value = index;
  }
};

onMounted(() => {
  if (props.banners.length > 1) startAutoPlay()
})
onUnmounted(() => stopAutoPlay())

watch(isSearchOpen, (val) => {
  if (val) {
    setTimeout(() => {
      document.body.style.overflow = 'auto'
      document.body.style.paddingRight = '0px'
    }, 0)
  }
})
</script>

<template>
  <Head title="Beranda Amal Ibadah" />
  <AppLayoutPublic> 

    <template #header>
      <div class="flex-1 pt-2.5">
        <p class="text-[10px] text-amber-500 tracking-[0.2em] uppercase font-bold">
          {{ user ? "Ahlan wa Sahlan," : "Assalamu'alaikum," }}
        </p>
        <h1 class="text-lg font-bold text-stone-100" style="font-family: 'Amiri', serif;">
          {{ user ? user.name : 'Hamba Allah' }}
        </h1>
      </div>

      <Link
        :href="user ? '/dashboard' : '/login'"
        class="my-3.5 w-10 h-10 rounded-full bg-stone-800 border border-amber-500/30 flex items-center justify-center text-stone-400 hover:text-amber-400 transition-colors"
      >
        <img v-if="user?.avatar" :src="user.avatar" class="w-full h-full rounded-full object-cover" />
        <UserRound v-else class="size-5" />
      </Link>
    </template>

    <main class="space-y-8 pb-32">
      <!-- Search Bar UI Dialog -->
      <section class="relative mt-5 px-5">
        <Dialog v-model:open="isSearchOpen">
          <DialogTrigger as-child>
            <div class="relative group cursor-pointer">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 group-hover:text-amber-400 transition-colors">
                <Search class="size-4" />
              </span>
              <div class="w-full bg-stone-900 border border-stone-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-stone-500">
                Cari sesuatu penuh manfaat...
              </div>
            </div>
          </DialogTrigger>

          <DialogContent class="sm:max-w-lg bg-stone-950 border-stone-800 p-0 overflow-hidden gap-0 [&>button]:hidden">
            <DialogHeader class="p-4 border-b border-stone-800">
              <div class="relative flex items-center">
                <Search class="absolute left-3 size-4 text-amber-500" />
                <input
                  v-model="searchQuery"
                  type="search"
                  placeholder="Ketik untuk mencari..."
                  class="w-full bg-transparent pl-10 pr-4 py-2 text-stone-100 outline-none placeholder:text-stone-600"
                  autofocus
                />
                <Loader2 v-if="isSearching" class="size-4 animate-spin text-stone-500" />
              </div>
            </DialogHeader>

            <!-- Search Results Area -->
            <div class="max-h-[60vh] overflow-y-auto p-2 no-scrollbar">
              <div v-if="!searchQuery" class="p-8 text-center">
                <p class="text-stone-500 text-xs">Cari kalam, doa, program, komunitas atau masjid.</p>
              </div>

              <div v-else-if="searchResultsKalam.length > 0 || searchResultsDonasi.length > 0" class="space-y-4 p-2">
                
                <!-- Hasil Cari Kalam -->
                <div v-if="searchResultsKalam.length > 0">
                  <h3 class="text-[10px] font-bold text-amber-500/50 uppercase tracking-widest px-2 mb-2">Kalam & Artikel</h3>
                  <div class="space-y-1">
                    <Link 
                      v-for="item in searchResultsKalam" 
                      :key="item.id" 
                      :href="`/kalam/${item.slug}`"
                      class="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-900 transition-colors group"
                    >
                      <div class="size-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <BookOpen class="size-4" />
                      </div>
                      <div class="min-w-0">
                        <p class="text-sm font-medium text-stone-200 line-clamp-1 group-hover:text-amber-400 transition-colors">{{ item.judul }}</p>
                        <p class="text-[10px] text-stone-500 uppercase">{{ item.kategori }}</p>
                      </div>
                    </Link>
                  </div>
                </div>

                <!-- Hasil Cari Donasi -->
                <div v-if="searchResultsDonasi.length > 0">
                  <h3 class="text-[10px] font-bold text-emerald-500/50 uppercase tracking-widest px-2 mb-2">Program Donasi</h3>
                  <div class="space-y-1">
                    <Link 
                      v-for="item in searchResultsDonasi" 
                      :key="item.id" 
                      :href="`/donasi/${item.slug}`"
                      class="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-900 transition-colors group"
                    >
                      <div class="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Heart class="size-4" />
                      </div>
                      <div class="min-w-0">
                        <p class="text-sm font-medium text-stone-200 line-clamp-1 group-hover:text-amber-400 transition-colors">{{ item.judul }}</p>
                        <p class="text-[10px] text-stone-500 uppercase">{{ item.subkategori }} (Masuk: {{ formatRupiah(getTotalDonasiMasuk(item)) }})</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              <div v-else class="p-12 text-center">
                <p class="text-stone-600 text-sm italic">Tidak menemukan hasil untuk "{{ searchQuery }}"</p>
              </div>
            </div>

            <div class="p-3 border-t border-stone-800 bg-stone-900/30 flex justify-between items-center">
              <span class="text-[9px] text-stone-600 tracking-tighter">Tekan ESC untuk menutup</span>
            </div>
          </DialogContent>
        </Dialog>
      </section>

      <!-- Banner Carousel -->
      <section class="relative group/main">
        <div 
          ref="carouselRef"
          @mousedown="handleDragStart" @touchstart="handleDragStart"
          @mousemove="handleDragMove" @touchmove="handleDragMove"
          @mouseup="handleDragEnd" @touchend="handleDragEnd" @mouseleave="handleDragEnd"
          @scroll="handleScroll"
          class="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 scroll-smooth px-5 cursor-grab active:cursor-grabbing select-none"
        >
          <component 
              :is="banner.link ? 'a' : 'div'"
              v-for="(banner, index) in extendedBanners" :key="index"
              :href="banner.link ?? undefined"
              class="min-w-[92%] aspect-[1702/630] relative rounded-3xl overflow-hidden snap-center border border-stone-800 shrink-0 block"
              @click="handleBannerClick"
          >
              <img :src="banner.image" :alt="banner.title" class="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none">
              <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent pointer-events-none"></div>
              <div class="absolute bottom-4 left-5 right-5 pointer-events-none">
                  <h3 class="text-lg md:text-xl font-bold text-amber-100 line-clamp-1" style="font-family: 'Amiri', serif;">
                      {{ banner.title }}
                  </h3>
                  <p class="text-[10px] md:text-xs text-stone-300 line-clamp-1">{{ banner.subtitle }}</p>
              </div>
          </component>
        </div>

        <div class="flex justify-center gap-1 mt-1">
          <div 
            v-for="(_, i) in banners" :key="i"
            :class="[currentSlide % banners.length === i ? 'w-3 bg-amber-500' : 'w-1 bg-stone-800']"
            class="h-1 rounded-full transition-all duration-300"
          ></div>
        </div>
      </section>                 

      <!-- Menu Grid Fitur -->
      <section class="px-5">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-sm font-bold uppercase tracking-wider text-amber-200/70">Amal apa hari ini?</h2>
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

      <!-- Kalam Terbaru -->
      <section class="px-5">
        <div class="flex justify-between items-end mb-4">
          <h2 class="text-sm font-bold uppercase tracking-wider text-amber-200/70">Kalam Terbaru</h2>
          <Link href="/kalam" class="text-xs text-amber-500 font-medium hover:text-amber-400 transition-colors flex items-center gap-1">
            <span>Lihat Semua</span> <ArrowRight class="size-3 -mb-0.5" />
          </Link>
        </div>

        <div v-if="kalams.length === 0" class="text-center py-10 text-stone-600 text-sm border border-dashed border-stone-800 rounded-2xl">
          Belum ada kalam
        </div>

        <div v-else class="space-y-3">
          <Link
            v-for="kalam in kalams" :key="kalam.id" :href="`/kalam/${kalam.slug}`"
            class="block bg-stone-900 border border-stone-800/60 rounded-2xl p-4 hover:border-amber-500/30 transition-all"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1 min-w-0">
                <span class="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-2">
                  {{ kategoriEmoji[kalam.kategori] ?? '📝' }} {{ kalam.kategori }}
                </span>
                <h4 class="text-sm font-bold text-stone-100 line-clamp-2 leading-snug mb-1" style="font-family: 'Amiri', serif;">
                  {{ kalam.judul }}
                </h4>
                <p class="text-[11px] text-stone-500 line-clamp-2">
                  {{ stripHtml(kalam.body, 100) }}
                </p>
              </div>
              <BookOpen class="size-4 text-amber-600 shrink-0 mt-1" />
            </div>
            <div class="flex items-center justify-between mt-3 pt-3 border-t border-stone-800/50">
              <span class="text-[10px] font-semibold text-stone-500">
                {{ kalam.is_anonymous ? 'Hamba Allah' : (kalam.user?.name ?? 'Anonim') }}
              </span>
              <span class="text-[10px] text-amber-700">{{ tanggal(kalam.created_at) }}</span>
            </div>
          </Link>
        </div>
      </section>

      <!-- Section List Donasi Pilihan -->
      <section class="px-5">
        <div class="flex justify-between items-end mb-4">
          <h2 class="text-sm font-bold uppercase tracking-wider text-amber-200/70">Donasi Pilihan</h2>
          <Link href="/donasi" class="text-xs text-amber-500 font-medium hover:text-amber-400 transition-colors flex items-center gap-1">
            <span>Lihat Semua</span> <ArrowRight class="size-3 -mb-0.5" />
          </Link>
        </div>

        <div v-if="donasis.length === 0" class="text-center py-10 text-stone-600 text-sm border border-dashed border-stone-800 rounded-2xl">
          Belum ada program donasi aktif
        </div>

        <div v-else class="grid grid-cols-1 gap-4">
          <Link
            v-for="donasi in donasis" :key="donasi.id" :href="`/donasi/${donasi.slug}`"
            class="block bg-stone-900/40 border border-stone-800/60 rounded-3xl overflow-hidden hover:border-amber-500/30 transition-all group"
          >
            <!-- Render Thumbnail Dinamis Model -->
            <div class="aspect-video w-full bg-amber-950/30 relative overflow-hidden border-b border-stone-800">
              <img v-if="donasi.thumbnail" :src="donasi.thumbnail" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <img v-else-if="donasi.image" :src="donasi.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div v-else class="w-full h-full flex items-center justify-center">
                 <Heart class="size-10 text-amber-500/20" />
              </div>
              <div class="absolute top-3 left-3">
                <span class="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-500/30 uppercase tracking-widest">
                  {{ donasi.subkategori }}
                </span>
              </div>
            </div>

            <div class="p-5 space-y-4">
              <div>
                <h2 class="text-base font-bold text-stone-100 line-clamp-2 leading-snug mb-2 group-hover:text-amber-400 transition-colors">
                  {{ donasi.judul }}
                </h2>
                <p class="text-[12px] text-stone-500 line-clamp-1 italic">
                  {{ stripHtml(donasi.body, 80) }}
                </p>
              </div>

              <!-- OPSI A: DONASI RUTIN/BERKELANJUTAN (TARGET DANA = 0) -->
              <div v-if="Number(donasi.target_dana) === 0" class="space-y-2">
                <div class="grid grid-cols-2 gap-2 text-[11px]">
                   <div class="flex flex-col">
                     <span class="text-stone-500 uppercase text-[9px] font-bold">Telah Disalurkan</span>
                     <span class="text-emerald-400 font-bold font-mono">{{ formatRupiah(getTotalTasyaruf(donasi)) }}</span>
                   </div>
                   <div class="flex flex-col text-right">
                     <span class="text-stone-500 uppercase text-[9px] font-bold">Dana Masuk</span>
                     <span class="text-amber-400 font-bold font-mono">{{ formatRupiah(getTotalDonasiMasuk(donasi)) }}</span>
                   </div>
                </div>
                <div class="h-1.5 w-full bg-linear-to-r from-amber-700 to-amber-400 rounded-full overflow-hidden">
                  <div class="h-full bg-linear-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000" :style="{ width: calculateProgressRutin(donasi) + '%' }"></div>
                </div>
                <div class="flex items-center justify-between text-[10px] text-stone-500 pt-1">
                  <span class="text-amber-500/90 font-medium">Program Rutin</span>
                  <span class="font-bold text-stone-400">{{ calculateProgressRutin(donasi) }}% Terdistribusi</span>
                </div>
              </div>

              <!-- OPSI B: DONASI TARGET TERTENTU (TARGET DANA > 0) -->
              <div v-else class="space-y-2">
                <div class="flex justify-between items-end text-[11px]">
                   <div class="flex flex-col">
                     <span class="text-stone-500 uppercase text-[9px] font-bold">Dana Masuk</span>
                     <span class="text-amber-400 font-bold font-mono">{{ formatRupiah(getTotalDonasiMasuk(donasi)) }}</span>
                   </div>
                   <div class="text-right">
                     <span class="text-stone-200 font-bold font-mono">{{ calculateProgressTarget(donasi) }}%</span>
                   </div>
                </div>
                <div class="h-2 w-full bg-stone-800 rounded-full overflow-hidden">
                  <div class="h-full bg-amber-500 rounded-full transition-all duration-1000" :style="{ width: calculateProgressTarget(donasi) + '%' }"></div>
                </div>
                <div class="flex items-center gap-1.5 text-[10px] text-stone-500 pt-1">
                  <Target class="size-3" />
                  <span>Target: {{ formatRupiah(donasi.target_dana) }}</span>
                  <span class="ms-auto flex items-center gap-1">
                    <CalendarDays class="size-3.5" /> 
                    {{ getSisaHari(donasi.tgl_selesai, donasi.created_at) }}
                  </span>
                </div>
              </div>

              <!-- Footer Card Aksi Donasi -->
              <div class="pt-2 flex items-center justify-between border-t border-stone-800/50">
                 <div class="flex items-center gap-2">
                    <div class="flex -space-x-2">
                       <User v-for="n in Math.min(getJumlahDonatur(donasi), 3)" :key="n" class="size-4 text-amber-400 border-2 border-stone-900 rounded-full bg-amber-500/20" />
                    </div>
                    <span class="text-[10px] text-stone-500">
                      {{ Number(donasi.target_dana) === 0 ? 'Donatur Berkelanjutan' : `${getJumlahDonatur(donasi)} Donatur` }}
                    </span>
                 </div>
                 <div class="px-4 py-1.5 rounded-xl bg-amber-600 text-white text-[10px] font-bold group-hover:bg-amber-400 group-hover:text-stone-950 transition-colors">
                    Donasi
                 </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

    </main>
  </AppLayoutPublic>
</template>

<style scoped>
.snap-x {
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch; 
}
.active-drag {
  scroll-snap-type: none;
  scroll-behavior: auto;
}
.snap-center {
  scroll-snap-align: center;
}
a, div {
  -webkit-tap-highlight-color: transparent;
  outline: none;
}
@supports not (aspect-ratio: 1702/630) {
  .aspect-\[1702\/630\] {
    padding-top: 37.01%;
    position: relative;
  }
}
</style>