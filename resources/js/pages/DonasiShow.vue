<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { computed, ref } from 'vue'
import { CalendarDays, Tag, Target, Heart, Wallet, MessageSquare, Share2 } from 'lucide-vue-next'
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
      nominal: number
      notes: string | null
      is_anonymous: boolean
      created_at: string
    }>
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

const formatRupiah = (nominal: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(nominal)
}

const progress = computed(() => {
  if (!props.donasi.target_dana) return 0
  const percent = (props.donasi.saldo / props.donasi.target_dana) * 100
  return percent > 100 ? 100 : Math.round(percent)
})

const tanggal = computed(() => {
  // Jika tgl_selesai tidak ada, tampilkan tanggal dibuat sebagai fallback
  if (!props.donasi.tgl_selesai) {
    return new Date(props.donasi.created_at).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    })
  }

  const target = new Date(props.donasi.tgl_selesai)
  const sekarang = new Date()
  
  // Set jam ke 00:00:00 agar perhitungan hari akurat
  target.setHours(0, 0, 0, 0)
  sekarang.setHours(0, 0, 0, 0)

  // Hitung selisih dalam milidetik
  const selisihWaktu = target.getTime() - sekarang.getTime()
  
  // Konversi ke hari (1 hari = 24 * 60 * 60 * 1000 ms)
  const sisaHari = Math.ceil(selisihWaktu / (1000 * 60 * 60 * 24))

  if (sisaHari > 0) {
    return `Sisa ${sisaHari} hari lagi`
  } else if (sisaHari === 0) {
    return 'Berakhir hari ini'
  } else {
    return 'Program selesai'
  }
})

const reaksiList = [
  { type: 'barakallah',  emoji: '🤲', label: 'Barakallah' },
  { type: 'masya_allah', emoji: '✨', label: "Masyaa Allah" },
  { type: 'aamiin',      emoji: '🙏', label: 'Aamiin' },
  { type: 'semangat',    emoji: '💪', label: 'Semangat' },
]

const reaksiCount = computed(() => {
  const counts: Record<string, number> = {}
  props.donasi.reaksis?.forEach(r => {
    counts[r.type] = (counts[r.type] ?? 0) + 1
  })
  return counts
})

const activeReaksi = ref<string | null>(null)
</script>

<template>
  <Head :title="donasi.judul" />

  <AppLayoutPublic :subtitle="donasi.subkategori" :title="donasi.judul" :show-back="true" back-href="/donasi">  

    <main class="px-5 py-8 space-y-8 pb-32">

      <!-- 1. Header & Progress Widget -->
      <div class="space-y-6">
        <div class="space-y-3">
          <span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            <Tag class="size-3" />
            {{ donasi.kategori }} / {{ donasi.subkategori }}
          </span>
          <h1 class="text-2xl md:text-3xl font-bold leading-tight text-amber-100">
            {{ donasi.judul }}
          </h1>
        </div>

        <!-- Progress Card -->
        <div class="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div class="flex justify-between items-end">
            <div class="space-y-1">
              <p class="text-[10px] text-stone-500 uppercase font-bold tracking-wider">Terkumpul</p>
              <p class="text-2xl font-black text-amber-400">{{ formatRupiah(donasi.saldo || 0) }}</p>
            </div>
            <div class="text-right">
              <p class="text-xl font-black text-stone-200">{{ progress }}%</p>
            </div>
          </div>

          <div class="h-3 w-full bg-stone-800 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
              :style="{ width: progress + '%' }"
            ></div>
          </div>

          <div class="flex justify-between items-center text-xs text-stone-500">
            <span class="flex items-center gap-1.5"><Target class="size-3.5" /> Target: {{ formatRupiah(donasi.target_dana) }}</span>
            <span class="flex items-center gap-1.5"><CalendarDays class="size-3.5" /> {{ tanggal }}</span>
          </div>

          <Link 
            :href="`/donasi/${donasi.slug}/payment`"
            class="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-amber-500/20"
          >
            <Wallet class="size-5" />
            DONASI SEKARANG
          </Link>
        </div>
      </div>

      <!-- 2. Konten Cerita -->
      <div class="space-y-4">
        <p class="text-[10px] font-bold uppercase tracking-widest text-stone-500 border-l-2 border-amber-500 pl-3">Cerita Donasi</p>
        <div
          class="prose prose-invert prose-stone max-w-none
                 prose-p:text-stone-300 prose-p:leading-relaxed prose-p:text-[15px]
                 prose-headings:text-amber-100 prose-strong:text-amber-200
                 prose-img:rounded-3xl prose-img:border-stone-800"
          v-html="donasi.body"
        />
      </div>

      <!-- 3. Reaksi -->
      <div class="pt-4 border-t border-stone-800 space-y-4">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="r in reaksiList"
            :key="r.type"
            @click="activeReaksi = activeReaksi === r.type ? null : r.type"
            :class="[
              'flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all',
              activeReaksi === r.type
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-stone-900 border-stone-800 text-stone-400'
            ]"
          >
            <span>{{ r.emoji }}</span>
            <span>{{ r.label }}</span>
            <span v-if="reaksiCount[r.type]" class="ml-1 opacity-60">{{ reaksiCount[r.type] }}</span>
          </button>
        </div>
      </div>

      <!-- 4. Daftar Donatur (History Payment) -->
      <div class="space-y-4">
        <p class="text-[10px] font-bold uppercase tracking-widest text-stone-500">Donatur Terbaru ({{ donasi.payments?.length || 0 }})</p>
        
        <div v-if="donasi.payments?.length === 0" class="text-center py-8 border border-dashed border-stone-800 rounded-3xl text-stone-600 text-sm">
          Jadilah donatur pertama untuk program ini.
        </div>

        <div v-else class="space-y-3">
          <div v-for="pay in donasi.payments" :key="pay.id" class="bg-stone-900/40 border border-stone-800/50 rounded-2xl p-4 flex gap-4 items-start">
            <div class="size-10 rounded-full bg-stone-800 flex items-center justify-center shrink-0 border border-stone-700">
              <Heart class="size-5 text-amber-500" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start mb-1">
                <h4 class="text-sm font-bold text-stone-200 truncate pr-2 uppercase">
                  {{ pay.sapaan }} {{ pay.is_anonymous ? 'Hamba Allah' : pay.atas_nama }}
                </h4>
                <span class="text-sm text-amber-500 font-bold whitespace-nowrap">{{ formatRupiah(pay.nominal) }}</span>
              </div>
              <div class="flex flex-nowrap gap-1 items-start">
                <p v-if="pay.notes" class="text-xs text-stone-500 italic line-clamp-2">"{{ pay.notes }}"</p>
                <span class="ms-auto text-xs">{{ new Date(pay.created_at).toLocaleDateString('id-ID') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Komentar -->
      <div class="space-y-4 pb-10">
        <p class="text-[10px] font-bold uppercase tracking-widest text-stone-500">Dukungan & Pertanyaan</p>
        <div v-if="donasi.komentars?.length === 0" class="text-center py-8 text-stone-600 text-sm">
          Belum ada diskusi.
        </div>
        <div v-else class="space-y-3">
            <div v-for="komentar in donasi.komentars" :key="komentar.id" class="bg-stone-900/20 border border-stone-800 rounded-2xl p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs font-bold text-amber-200">{{ komentar.user?.name }}</span>
                <span class="text-[9px] text-stone-600">• {{ new Date(komentar.created_at).toLocaleDateString() }}</span>
              </div>
              <p class="text-sm text-stone-400">{{ komentar.body }}</p>
            </div>
        </div>
      </div>

    </main>

    <!-- Floating Share Button (Mobile) -->
    <div class="fixed bottom-6 right-6 z-50">
      <button class="size-14 bg-amber-500 text-stone-950 rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform">
        <Share2 class="size-6" />
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
</style>