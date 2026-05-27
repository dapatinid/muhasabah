<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3'
import { ref, watch } from 'vue'
import debounce from 'lodash/debounce'
import { Search, CalendarDays } from 'lucide-vue-next'
import AppLayoutPublic from '@/layouts/AppLayoutPublic.vue'

const props = defineProps<{
  acaras: {
    data: Array<{
      id: number
      judul: string
      slug: string
      thumbnail: string | null
      body: string
      kategori: string
      subkategori: string
      lokasi: string

      // Modul Tiket
      accept_tiket: boolean | number
      harga_tiket: number
      kuota_tiket: number
      tiket_terjual: number       // ✅ Kolom nyata di DB, di-increment saat storePayment

      // Modul Donasi
      accept_donasi: boolean | number
      target_donasi: number
      donasi_masuk_sum_nominal?: number  // ✅ Dari withSum di controller

      panduan_acara: string | null

      // Batas Waktu
      tgl_mulai: string
      tgl_selesai: string
      batas_registrasi: string
      created_at: string
    }>
    links: Array<{ url: string | null; label: string; active: boolean }>
  }
  filters: { search?: string; kategori?: string }
}>()

const search        = ref(props.filters?.search   ?? '')
const aktifKategori = ref(props.filters?.kategori ?? 'Semua')

const kategoriList = ['Semua', 'kajian', 'workshop', 'sosial', 'musyawarah', 'hari-besar']

watch(search, debounce((val) => {
  router.get('/acara', {
    search:   val || undefined,
    kategori: aktifKategori.value === 'Semua' ? undefined : aktifKategori.value,
  }, { preserveState: true, preserveScroll: true, replace: true })
}, 600))

function formatRupiah(nominal: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(nominal)
}

function filterKategori(kat: string) {
  aktifKategori.value = kat
  router.get('/acara', {
    search:   search.value || undefined,
    kategori: kat === 'Semua' ? undefined : kat,
  }, { preserveState: true, preserveScroll: true, replace: true })
}

function goToPage(url: string | null) {
  if (!url) return
  router.get(url, {}, { preserveState: true, preserveScroll: true })
}

function getStatusRegistrasi(batas_registrasi: string | null): { teks: string; tutup: boolean } {
  if (!batas_registrasi) return { teks: 'Buka', tutup: false }

  const batas    = new Date(batas_registrasi)
  const sekarang = new Date()

  if (sekarang > batas) return { teks: 'Ditutup', tutup: true }

  const selisihWaktu = batas.getTime() - sekarang.getTime()
  const sisaHari     = Math.ceil(selisihWaktu / (1000 * 60 * 60 * 24))

  return sisaHari > 1
    ? { teks: `${sisaHari} hari lagi`, tutup: false }
    : { teks: 'Hari ini', tutup: false }
}

function getTglMulai(tgl: string): string {
  return new Date(tgl).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

// ✅ Sisa tiket = kuota - tiket_terjual (kolom DB yang di-increment saat booking)
function getSisaTiket(acara: { kuota_tiket: number; tiket_terjual: number }): number {
  return Math.max(0, acara.kuota_tiket - (acara.tiket_terjual ?? 0))
}

function getProgressDonasi(acara: { donasi_masuk_sum_nominal?: number; target_donasi: number }): number {
  if (!acara.target_donasi || acara.target_donasi <= 0) return 0
  const percent = ((acara.donasi_masuk_sum_nominal ?? 0) / acara.target_donasi) * 100
  return Math.min(100, Math.round(percent))
}
</script>

<template>
  <Head title="Agenda Kegiatan & Acara" />
  <AppLayoutPublic subtitle="Informasi Kegiatan Masjid" title="Agenda Acara" :show-back="true">

    <div class="px-5 py-6 space-y-6 pb-50">

      <!-- Search -->
      <div class="relative group">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 group-focus-within:text-amber-400 transition-colors">
          <Search class="size-4" />
        </span>
        <input
          v-model="search"
          type="search"
          placeholder="Cari agenda kegiatan masjid..."
          class="w-full bg-stone-900 border border-stone-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-stone-200 placeholder-stone-600 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/40 transition-all outline-none"
        >
      </div>

      <!-- Filter Kategori -->
      <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          v-for="kat in kategoriList"
          :key="kat"
          @click="filterKategori(kat)"
          :class="[
            'shrink-0 px-5 py-2 rounded-full text-xs font-bold border transition-all uppercase tracking-wider',
            aktifKategori === kat
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
              : 'bg-stone-900 border-stone-800 text-stone-500 hover:border-amber-500/30 hover:text-amber-400'
          ]"
        >
          {{ kat }}
        </button>
      </div>

      <!-- Kosong -->
      <div
        v-if="acaras.data.length === 0"
        class="text-center py-20 text-stone-600 text-sm border border-dashed border-stone-800 rounded-2xl"
      >
        <p class="text-3xl mb-3">📅</p>
        <p>Belum ada agenda acara terdekat</p>
      </div>

      <!-- List Acara — desain poster IMDB: 1/3 gambar + 2/3 konten -->
      <div v-else class="grid grid-cols-1 gap-4">
        <Link
          v-for="acara in acaras.data"
          :key="acara.id"
          :href="`/acara/${acara.slug}`"
          class="block backdrop-blur-xs bg-stone-900/40 border border-stone-800/80 overflow-hidden hover:border-stone-700 hover:bg-stone-900/60 transition-all group"
        >
          <div class="flex h-44 sm:h-48">

            <!-- Kolom Kiri: Poster / Thumbnail -->
            <div class="w-1/3 relative bg-stone-950 border-r border-stone-800/60 shrink-0 overflow-hidden">

              <img
                v-if="acara.thumbnail"
                :src="acara.thumbnail.startsWith('http') ? acara.thumbnail : `/storage/${acara.thumbnail}`"
                :alt="acara.judul"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
                loading="lazy"
              />

              <div
                v-else
                class="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-stone-900 to-stone-950 select-none group-hover:scale-105 transition-transform duration-500"
              >
                <span class="text-2xl mb-1 filter drop-shadow">
                  {{ acara.kategori === 'kajian' ? '📖' : acara.kategori === 'workshop' ? '💻' : acara.kategori === 'sosial' ? '🤝' : '🕌' }}
                </span>
                <span class="text-[9px] text-stone-500 uppercase tracking-widest font-black truncate max-w-full">
                  {{ acara.kategori }}
                </span>
              </div>

              <!-- Badge Harga / Tipe -->
              <div class="absolute top-2 left-2 z-10">
                <span
                  class="px-2 py-0.5 rounded bg-stone-950/80 backdrop-blur-xs text-[9px] font-mono font-bold border border-stone-800/60 tracking-wide"
                  :class="Boolean(acara.accept_tiket) && Number(acara.harga_tiket) === 0 ? 'text-emerald-400' : 'text-amber-400'"
                >
                  {{ Boolean(acara.accept_tiket) ? (Number(acara.harga_tiket) === 0 ? 'FREE' : formatRupiah(acara.harga_tiket)) : 'DONASI' }}
                </span>
              </div>

              <!-- Badge Tanggal Pelaksanaan -->
              <div class="absolute bottom-2 left-2 right-2 z-10">
                <span class="flex items-center gap-1 px-2 py-0.5 rounded bg-stone-950/80 backdrop-blur-xs text-[9px] font-bold text-stone-300 border border-stone-800/60 truncate">
                  <CalendarDays class="size-2.5 shrink-0 text-amber-400" />
                  {{ getTglMulai(acara.tgl_mulai) }}
                </span>
              </div>
            </div>

            <!-- Kolom Kanan: Konten -->
            <div class="w-2/3 p-4 flex flex-col justify-between min-w-0">

              <!-- Header: subkategori + status registrasi -->
              <div class="space-y-1">
                <div class="flex items-center gap-2 text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                  <span class="text-stone-400 truncate max-w-[120px]">{{ acara.subkategori }}</span>
                  <span>•</span>
                  <span :class="getStatusRegistrasi(acara.batas_registrasi).tutup ? 'text-red-400' : 'text-amber-400 font-extrabold'">
                    {{ getStatusRegistrasi(acara.batas_registrasi).teks }}
                  </span>
                </div>
                <h2 class="text-sm font-bold text-stone-100 line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors">
                  {{ acara.judul }}
                </h2>
              </div>

              <!-- Tengah: Info Tiket atau Progress Donasi -->
              <div class="space-y-2 my-auto">

                <!-- Tiket: kuota + sisa (✅ pakai tiket_terjual dari kolom DB) -->
                <div v-if="Boolean(acara.accept_tiket)" class="flex items-center gap-4 text-xs">
                  <div class="flex flex-col">
                    <span class="text-[9px] text-stone-500 uppercase font-bold tracking-tight">Total Kuota</span>
                    <span class="font-bold text-stone-300 font-mono text-[11px]">
                      {{ acara.kuota_tiket }} <span class="text-[10px] text-stone-500 font-sans">Kursi</span>
                    </span>
                  </div>
                  <div class="h-6 w-[1px] bg-stone-800"></div>
                  <div class="flex flex-col">
                    <span class="text-[9px] text-stone-500 uppercase font-bold tracking-tight">Sisa Tiket</span>
                    <span
                      class="font-mono text-[11px] font-black"
                      :class="getSisaTiket(acara) === 0 ? 'text-red-400' : 'text-emerald-400'"
                    >
                      {{ getSisaTiket(acara) }}
                    </span>
                  </div>
                </div>

                <!-- Donasi Acara: progress bar + nominal (✅ pakai donasi_masuk_sum_nominal) -->
                <div v-else-if="Boolean(acara.accept_donasi)" class="space-y-1.5">
                  <div class="flex justify-between items-end text-[10px]">
                    <span class="text-stone-500 uppercase text-[9px] font-bold">Dana Terkumpul</span>
                    <span class="text-amber-400 font-bold font-mono">{{ getProgressDonasi(acara) }}%</span>
                  </div>
                  <div class="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-1000"
                      :style="{ width: getProgressDonasi(acara) + '%' }"
                    ></div>
                  </div>
                  <div class="text-[10px] text-stone-500 font-mono">
                    {{ formatRupiah(acara.donasi_masuk_sum_nominal ?? 0) }}
                    <span class="text-stone-600"> / {{ formatRupiah(acara.target_donasi) }}</span>
                  </div>
                </div>

              </div>

              <!-- Footer: lokasi + CTA -->
              <div class="pt-2 border-t border-stone-800/60 flex items-center justify-between text-[11px] text-stone-500 gap-2">
                <div class="flex items-center gap-1 truncate">
                  <span class="shrink-0 text-stone-600">📍</span>
                  <span class="truncate text-stone-400 font-medium">{{ acara.lokasi }}</span>
                </div>
                <div class="shrink-0 text-[10px] font-bold text-amber-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 select-none">
                  Detail <span>→</span>
                </div>
              </div>

            </div>
          </div>
        </Link>
      </div>

      <!-- Pagination -->
      <div v-if="acaras.links.length > 3" class="flex justify-center gap-1.5 pt-6 flex-wrap">
        <button
          v-for="(link, i) in acaras.links"
          :key="i"
          @click="goToPage(link.url)"
          v-html="link.label"
          :disabled="!link.url"
          :class="[
            'px-4 py-2 rounded-2xl text-xs font-bold border transition-all',
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