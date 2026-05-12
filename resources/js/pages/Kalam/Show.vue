<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { computed, ref } from 'vue'
import { ArrowLeft, CalendarDays, Tag, User } from 'lucide-vue-next'

const props = defineProps<{
  kalam: {
    id: number
    judul: string
    slug: string
    body: string
    kategori: string
    is_anonymous: boolean
    created_at: string
    user: { id: number; name: string } | null
    komentars: Array<{
      id: number
      body: string
      created_at: string
      user: { id: number; name: string }
    }>
    reaksis: Array<{
      id: number
      type: string
      user_id: number
    }>
  }
}>()

const penulis = computed(() =>
  props.kalam.is_anonymous ? 'Hamba Allah' : (props.kalam.user?.name ?? 'Anonim')
)

const tanggal = computed(() =>
  new Date(props.kalam.created_at).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
)

const kategoriLabel: Record<string, string> = {
  hikmah: 'Hikmah', doa: 'Doa', kisah: 'Kisah', tips: 'Tips & Trik', berita: 'Berita',
}

const reaksiList = [
  { type: 'barakallah',  emoji: '🤲', label: 'Barakallah' },
  { type: 'masya_allah', emoji: '✨', label: "Masyaa Allah" },
  { type: 'subhanallah', emoji: '💚', label: 'Subhanallah' },
  { type: 'aamiin',      emoji: '🙏', label: 'Aamiin' },
]

const reaksiCount = computed(() => {
  const counts: Record<string, number> = {}
  props.kalam.reaksis.forEach(r => {
    counts[r.type] = (counts[r.type] ?? 0) + 1
  })
  return counts
})

// Aktif reaksi user (untuk demo — nanti bisa disambung ke auth)
const activeReaksi = ref<string | null>(null)
</script>

<template>
  <Head :title="kalam.judul" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
  <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

  <div class="min-h-screen bg-stone-950 relative overflow-x-hidden"
       style="font-family: 'Plus Jakarta Sans', sans-serif;">

    <!-- Pola latar geometric -->
    <div class="fixed inset-0 z-0 opacity-10 pointer-events-none"
         :style="{
           backgroundImage: `url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22 viewBox=%220 0 80 80%22><path d=%22M40 0 L50 30 L80 40 L50 50 L40 80 L30 50 L0 40 L30 30 Z%22 fill=%22none%22 stroke=%22%23d4a017%22 stroke-width=%221%22/></svg>')`,
           backgroundSize: '100px 100px'
         }" />

    <!-- Radial glow -->
    <div class="fixed inset-0 z-0 pointer-events-none"
         style="background: radial-gradient(ellipse at 20% 0%, rgba(120,90,40,0.15) 0%, transparent 55%)" />

    <div class="relative z-10 max-w-xl mx-auto sm:border-x sm:border-stone-800 min-h-screen">

      <!-- Navbar -->
      <nav class="sticky top-0 z-50 bg-stone-950/80 backdrop-blur-md border-b border-stone-800/50 px-5 py-4 flex items-center gap-3">
        <Link href="/kalam"
              class="w-9 h-9 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-500/50 transition-all">
          <ArrowLeft class="size-4" />
        </Link>
        <span class="text-base text-stone-500 tracking-wide">Kalam</span>
      </nav>

      <main class="px-5 py-8 space-y-8 pb-20">

        <!-- Header artikel -->
        <div class="space-y-4">

          <!-- Kategori badge -->
          <div>
            <span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              <Tag class="size-3" />
              {{ kategoriLabel[kalam.kategori] ?? kalam.kategori }}
            </span>
          </div>

          <!-- Judul -->
          <h1 class="text-2xl md:text-3xl font-bold leading-snug text-amber-100"
              style="font-family: 'Amiri', serif;">
            {{ kalam.judul }}
          </h1>

          <!-- Meta -->
          <div class="flex flex-wrap gap-4 text-xs text-stone-500">
            <span class="flex items-center gap-1.5">
              <User class="size-3.5" />
              {{ penulis }}
            </span>
            <span class="flex items-center gap-1.5">
              <CalendarDays class="size-3.5" />
              {{ tanggal }}
            </span>
          </div>

          <!-- Divider ornamental -->
          <div class="flex items-center gap-3 pt-1">
            <div class="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
            <span class="text-amber-500/40 text-lg">✦</span>
            <div class="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          </div>
        </div>

        <!-- Isi konten -->
        <div
          class="prose prose-invert prose-stone max-w-none
                 prose-p:text-stone-300 prose-p:leading-relaxed prose-p:text-[15px]
                 prose-headings:font-bold prose-headings:text-amber-100
                 prose-strong:text-amber-200
                 prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline
                 prose-blockquote:border-l-amber-500 prose-blockquote:text-stone-400 prose-blockquote:bg-stone-900/50 prose-blockquote:rounded-r-xl prose-blockquote:py-1
                 prose-ul:text-stone-300 prose-ol:text-stone-300
                 prose-img:rounded-2xl prose-img:border prose-img:border-stone-800"
          v-html="kalam.body"
        />

        <!-- Divider -->
        <div class="flex items-center gap-3">
          <div class="h-px flex-1 bg-stone-800" />
          <span class="text-stone-700 text-xs">•</span>
          <div class="h-px flex-1 bg-stone-800" />
        </div>

        <!-- Reaksi -->
        <div class="space-y-3">
          <p class="text-[10px] font-bold uppercase tracking-widest text-stone-500">Reaksi</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="r in reaksiList"
              :key="r.type"
              @click="activeReaksi = activeReaksi === r.type ? null : r.type"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all duration-200',
                activeReaksi === r.type
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 scale-105'
                  : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:border-amber-500/30 hover:text-amber-400'
              ]"
            >
              <span class="text-base">{{ r.emoji }}</span>
              <span>{{ r.label }}</span>
              <span
                v-if="reaksiCount[r.type]"
                class="ml-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              >
                {{ reaksiCount[r.type] }}
              </span>
            </button>
          </div>
        </div>

        <!-- Komentar -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <p class="text-[10px] font-bold uppercase tracking-widest text-stone-500">
              Komentar
              <span class="text-amber-500 ml-1">{{ kalam.komentars.length }}</span>
            </p>
          </div>

          <!-- Kosong -->
          <div v-if="kalam.komentars.length === 0"
               class="text-center py-10 rounded-2xl border border-dashed border-stone-800 text-stone-600 text-sm">
            Belum ada komentar
          </div>

          <!-- List -->
          <div v-else class="space-y-3">
            <div
              v-for="komentar in kalam.komentars"
              :key="komentar.id"
              class="bg-stone-900/50 border border-stone-800/60 rounded-2xl p-4 space-y-2 hover:border-amber-500/20 transition-colors"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-amber-200">
                  {{ komentar.user?.name ?? 'Anonim' }}
                </span>
                <span class="text-[10px] text-stone-600">
                  {{ new Date(komentar.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }}
                </span>
              </div>
              <p class="text-sm text-stone-400 leading-relaxed">{{ komentar.body }}</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  </div>
</template>

<style scoped>
.prose :deep(blockquote) {
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>