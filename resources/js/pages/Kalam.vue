<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3'
import { ref, watch } from 'vue'
import debounce from 'lodash/debounce'
import { Search, BookOpen, ArrowLeft, SlidersHorizontal } from 'lucide-vue-next'
import AppLayoutPublic from '@/layouts/AppLayoutPublic.vue'

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
      thumbnail?: string | null // Tambahkan ini di interface jika ada thumbnail
    }>
    links: Array<{ url: string | null; label: string; active: boolean }>
    meta?: any
  }
  // PERBAIKAN 1: Tambahkan kategori opsional pada definisi filters props
  filters: { search?: string; kategori?: string }
}>()

const search = ref(props.filters?.search ?? '')
const kategoriList = ['Semua', 'berita', 'hikmah', 'doa', 'kisah', 'tips']

// PERBAIKAN 2: Sinkronkan state aktifKategori dengan data dari backend saat refresh
const aktifKategori = ref(props.filters?.kategori ?? 'Semua')

// PERBAIKAN 3: Sertakan data kategori di dalam watch search agar tidak hilang saat mengetik pencarian
watch(search, debounce((val) => {
  router.get('/kalam', { 
    search: val || undefined,
    kategori: aktifKategori.value === 'Semua' ? undefined : aktifKategori.value
  }, {
    preserveState: true, 
    preserveScroll: true, 
    replace: true,
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
  <AppLayoutPublic subtitle="Kalam Kalam" title="Perpustakaan" :show-back="true">

    <div class="px-5 py-6 space-y-6 pb-50">

        <!-- Search -->
        <div class="relative group">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 group-focus-within:text-amber-400 transition-colors">
            <Search class="size-4" />
          </span>
          <input
            v-model="search"
            type="search"
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
            class="block backdrop-blur-xs bg-stone-900/50 border border-stone-800/60 rounded-2xl p-4 hover:border-amber-500/30 hover:bg-stone-900/80 transition-all group"
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

    </div>
  </AppLayoutPublic>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>