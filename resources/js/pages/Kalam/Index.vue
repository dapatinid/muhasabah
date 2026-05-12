<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3'
import { ref, watch } from 'vue'
import debounce from 'lodash/debounce'
import { Search, BookOpen, ArrowLeft, SlidersHorizontal } from 'lucide-vue-next'
import BottomNavigation from '@/components/BottomNavigation.vue'

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
    }>
    links: Array<{ url: string | null; label: string; active: boolean }>
    meta?: any
  }
  filters: { search?: string }
}>()

const search = ref(props.filters?.search ?? '')

watch(search, debounce((val) => {
  router.get('/kalam', { search: val || undefined }, {
    preserveState: true, preserveScroll: true, replace: true,
  })
}, 600))

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').substring(0, 120) + '...'
}

function tanggal(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

const kategoriList = ['Semua', 'hikmah', 'doa', 'kisah', 'tips', 'berita']
const aktifKategori = ref('Semua')

const kategoriEmoji: Record<string, string> = {
  hikmah: '💡', doa: '🤲', kisah: '📖', tips: '✨', berita: '📰',
}

function filterKategori(kat: string) {
  aktifKategori.value = kat
  router.get('/kalam', {
    search: search.value || undefined,
    kategori: kat === 'Semua' ? undefined : kat,
  }, { preserveState: true, preserveScroll: true, replace: true })
}

function goToPage(url: string | null) {
  if (!url) return
  router.get(url, {}, { preserveState: true, preserveScroll: true })
}
</script>

<template>
  <Head title="Kalam — Berbagi Hikmah" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
  <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

  <div class="min-h-screen bg-stone-950 relative overflow-x-hidden"
       style="font-family: 'Plus Jakarta Sans', sans-serif;">

    <!-- Background pattern -->
    <div class="fixed inset-0 z-0 opacity-10 pointer-events-none"
         :style="{
           backgroundImage: `url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22 viewBox=%220 0 80 80%22><path d=%22M40 0 L50 30 L80 40 L50 50 L40 80 L30 50 L0 40 L30 30 Z%22 fill=%22none%22 stroke=%22%23d4a017%22 stroke-width=%221%22/></svg>')`,
           backgroundSize: '100px 100px'
         }" />
    <div class="fixed inset-0 z-0 pointer-events-none"
         style="background: radial-gradient(ellipse at 50% 0%, rgba(120,90,40,0.12) 0%, transparent 60%)" />

    <div class="relative z-10 max-w-xl mx-auto sm:border-x sm:border-stone-800 min-h-screen">

      <!-- Navbar -->
      <nav class="sticky top-0 z-50 bg-stone-950/80 backdrop-blur-md border-b border-stone-800/50 px-5 py-4 flex items-center gap-3">
        <Link href="/"
              class="w-9 h-9 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-500/40 transition-all shrink-0">
          <ArrowLeft class="size-4" />
        </Link>
        <div class="flex-1">
          <p class="text-[10px] text-amber-500 tracking-[0.2em] uppercase font-bold">Kalam Kalam</p>
          <h1 class="text-base font-bold text-stone-100 leading-tight" style="font-family: 'Amiri', serif;">
            Perpustakaan
          </h1>
        </div>
      </nav>

      <main class="px-5 py-6 space-y-6 pb-50">

        <!-- Search -->
        <div class="relative group">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 group-focus-within:text-amber-400 transition-colors">
            <Search class="size-4" />
          </span>
          <input
            v-model="search"
            type="text"
            placeholder="Cari judul atau kategori..."
            class="w-full bg-stone-900 border border-stone-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-stone-200 placeholder-stone-600 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/40 transition-all outline-none"
          >
        </div>

        <!-- Filter kategori -->
        <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            v-for="kat in kategoriList"
            :key="kat"
            @click="filterKategori(kat)"
            :class="[
              'shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all',
              aktifKategori === kat
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-stone-900 border-stone-800 text-stone-500 hover:border-amber-500/30 hover:text-amber-400'
            ]"
          >
            {{ kat === 'Semua' ? 'Semua' : `${kategoriEmoji[kat]} ${kat}` }}
          </button>
        </div>

        <!-- Kosong -->
        <div v-if="kalams.data.length === 0"
             class="text-center py-20 text-stone-600 text-sm border border-dashed border-stone-800 rounded-2xl">
          <p class="text-2xl mb-3">📭</p>
          <p>Belum ada kalam ditemukan</p>
        </div>

        <!-- List Kalam -->
        <div v-else class="space-y-3">
          <Link
            v-for="kalam in kalams.data"
            :key="kalam.id"
            :href="`/kalam/${kalam.slug}`"
            class="block bg-stone-900/50 border border-stone-800/60 rounded-2xl p-4 hover:border-amber-500/30 hover:bg-stone-900/80 transition-all group"
          >
            <!-- Kategori & Icon (Pindah ke atas atau tetap sebagai header card) -->
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-bold uppercase tracking-widest text-amber-500">
                {{ kategoriEmoji[kalam.kategori] ?? '📝' }} {{ kalam.kategori }}
              </span>
              <BookOpen class="size-3.5 text-stone-600 group-hover:text-amber-600 transition-colors" />
            </div>

            <!-- Container Utama: Teks (Kiri) & Image (Kanan) -->
            <div class="flex gap-4 items-start">
              
              <!-- Sisi Kiri: Judul & Excerpt -->
              <div class="flex-1 min-w-0">
                <h2 class="text-base font-bold text-stone-100 line-clamp-2 leading-snug mb-1.5"
                    style="font-family: 'Amiri', serif;">
                  {{ kalam.judul }}
                </h2>
                <p class="text-[12px] text-stone-500 line-clamp-2 leading-relaxed">
                  {{ stripHtml(kalam.body) }}
                </p>
              </div>

              <!-- Sisi Kanan: Thumbnail (Hanya muncul jika ada) -->
              <div v-if="kalam.thumbnail" class="shrink-0">
                <div class="w-20 h-20 rounded-xl overflow-hidden border border-stone-800 group-hover:border-amber-500/30 transition-colors">
                  <img 
                    :src="kalam.thumbnail" 
                    :alt="kalam.judul" 
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between mt-3 pt-3 border-t border-stone-800/50">
              <div class="flex items-center gap-2">
                <div class="w-5 h-5 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-[9px] font-bold text-amber-500 uppercase">
                  {{ (kalam.is_anonymous ? 'H' : (kalam.user?.name ?? 'A')).substring(0, 1) }}
                </div>
                <span class="text-[11px] text-stone-500">
                  {{ kalam.is_anonymous ? 'Hamba Allah' : (kalam.user?.name ?? 'Anonim') }}
                </span>
              </div>
              <span class="text-[10px] text-amber-800">{{ tanggal(kalam.created_at) }}</span>
            </div>
          </Link>
        </div>        

        <!-- Pagination -->
        <div v-if="kalams.links.length > 3" class="flex justify-center gap-1.5 pt-2 flex-wrap">
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
              !link.url ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
            ]"
          />
        </div>

      </main>
      
      <!-- Footer nav -->
      <BottomNavigation />

    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>