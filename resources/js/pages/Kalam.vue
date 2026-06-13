<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3'
import { ref, watch, onMounted, onUnmounted } from 'vue'
import debounce from 'lodash/debounce'
import { 
  Search, BookOpen, MessageCircle, Heart, MoreHorizontal, 
  CheckCircle2, Share2, AlertTriangle 
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
</script>

<template>
  <Head title="Kalam — Feed Hikmah" />
  <AppLayoutPublic subtitle="Terkini" title="Kalam Kalam" :show-back="true">
    
    <div class="max-w-2xl mx-auto pb-32">
      <div class="sticky top-0 z-20 bg-stone-955/80 backdrop-blur-md border-b border-stone-800/50 px-5 py-4 space-y-4">
        <div class="relative">
          <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-stone-500" />
          <input v-model="search" type="search" placeholder="Cari kalam..." 
            class="w-full bg-stone-900/50 border border-stone-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-stone-200 placeholder:text-stone-500 outline-none focus:ring-1 focus:ring-amber-500/50" />
        </div>
        <div class="flex gap-2 overflow-x-auto no-scrollbar">
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
            <div class="flex items-center justify-between relative">
              <div class="flex items-center gap-3">
                <div class="size-9 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center overflow-hidden shrink-0">
                  <span v-if="kalam.is_anonymous" class="text-stone-500 text-xs font-bold">HA</span>
                  <span v-else class="text-amber-500 text-xs font-bold">{{ (kalam.user?.name ?? 'A')[0] }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <h3 class="font-bold text-[14px] text-stone-100 truncate max-w-[140px] sm:max-w-xs">
                    {{ kalam.is_anonymous ? 'Hamba.Allah' : (kalam.user?.name || 'anonim') }}
                  </h3>
                  <CheckCircle2 class="size-3.5 text-blue-500 fill-blue-500/10" v-if="!kalam.is_anonymous" />
                  <span class="text-stone-500 text-sm">·</span>
                  <span class="text-stone-500 text-xs">{{ tanggal(kalam.created_at) }}</span>
                </div>
              </div>
              
              <div class="relative">
                <button @click.stop="toggleDropdown(kalam.id)" class="text-stone-600 hover:text-stone-400 p-1 rounded-full transition-colors">
                  <MoreHorizontal class="size-5" />
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

                  <div v-else-if="media.type === 'image'"
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

          <div class="flex items-center gap-5 pt-1">
            <Link :href="`/kalam/${kalam.slug}#respon`" class="flex items-center gap-1.5 group/btn">
              <div class="p-1.5 rounded-full hover:bg-red-500/10 transition-colors">
                <Heart class="size-[19px] text-stone-400 group-hover/btn:text-red-500" />
              </div>
              <span class="text-xs text-stone-500 font-medium">{{ kalam.reaksis_count }}</span>
            </Link>

            <Link :href="`/kalam/${kalam.slug}#respon`" class="flex items-center gap-1.5 group/btn">
              <div class="p-1.5 rounded-full hover:bg-blue-500/10 transition-colors">
                <MessageCircle class="size-[19px] text-stone-400 group-hover/btn:text-blue-500" />
              </div>
              <span class="text-xs text-stone-500 font-medium">{{ kalam.komentars_count }}</span>
            </Link>
            
            <button @click="handleShare(kalam)" class="p-1.5 rounded-full hover:bg-emerald-500/10 transition-colors cursor-pointer group/btn">
              <Share2 class="size-[19px] text-stone-400 group-hover/btn:text-emerald-500" />
            </button>
          </div>

          <div class="flex items-center gap-1.5">
            <span class="text-[10px] bg-stone-900 border border-stone-800 text-stone-400 px-2.5 py-0.5 rounded-md uppercase font-extrabold tracking-wider">
              {{ kategoriEmoji[kalam.kategori] || '✨' }} {{ kalam.kategori }}
            </span>
          </div>

        </div>
      </div>

      <div v-if="kalams.links.length > 3" class="flex justify-center gap-1.5 pt-10 flex-wrap">
        <button
          v-for="(link, i) in kalams.links"
          :key="i"
          @click="goToPage(link.url)"
          v-html="link.label"
          :disabled="!link.url"
          :class="[
            'px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all',
            link.active
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
              : 'bg-stone-900 border-stone-800 text-stone-500 hover:border-amber-500/30 hover:text-stone-300',
          ]"
        />
      </div>
    </div>
  </AppLayoutPublic>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>