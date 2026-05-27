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
      kuota_tiket: number
      tiket_terjual: number

      // Relasi Varian Tiket Baru
      variants: Array<{
        id: number
        nama_varian: string
        harga: number
        jumlah_kursi: number
      }>

      // Modul Donasi
      accept_donasi: boolean | number
      target_donasi: number
      donasi_masuk_sum_nominal?: number

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

/**
 * 🛠️ LOGIKA UPDATE: Menghitung representasi teks harga dengan fallback 
 * yang presisi berdasarkan modul yang aktif (Tiket vs Donasi vs Terbuka)
 */
function getHargaBadgeInfo(acara: typeof props.acaras.data[0]) {
  // 1. Jika menggunakan modul registrasi kursi/tiket
  if (Boolean(acara.accept_tiket)) {
    if (!acara.variants || acara.variants.length === 0) {
      return { teks: 'GRATIS PADAFTARAN', isGratis: true }
    }

    const listHarga = acara.variants.map(v => Number(v.harga))
    const hargaMin = Math.min(...listHarga)
    const hargaMax = Math.max(...listHarga)

    // Jika varian dengan harga tertinggi pun adalah 0, berarti gratis dengan memesan kursi
    if (hargaMax === 0) {
      return { teks: 'GRATIS (REGISTRASI)', isGratis: true }
    }

    // Jika flat satu harga di semua varian
    if (hargaMin === hargaMax) {
      return { teks: formatRupiah(hargaMin), isGratis: false }
    }

    // Rentang harga tiket terendah sampai tertinggi
    return { teks: `${formatRupiah(hargaMin)} - ${formatRupiah(hargaMax)}`, isGratis: false }
  }

  // 2. Jika modul tiket mati, tapi modul penggalangan dana/patungan operasional aktif
  if (Boolean(acara.accept_donasi)) {
    return { teks: 'OPEN DONASI', isGratis: false }
  }

  // 3. Jika kedua modul mati (Acara bertipe Kajian Umum / Bebas Hadir tanpa batas)
  return { teks: 'GRATIS / UMUM', isGratis: true }
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
  <AppLayoutPublic subtitle="Informasi Kegiatan" title="Agenda Acara" :show-back="true">

    <div class="px-5 py-6 space-y-6 pb-50">

      <div class="relative group">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 group-focus-within:text-amber-400 transition-colors">
          <Search class="size-4" />
        </span>
        <input
          v-model="search"
          type="search"
          placeholder="Cari agenda kegiatan..."
          class="w-full bg-stone-900 border border-stone-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-stone-200 placeholder-stone-600 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/40 transition-all outline-none"
        >
      </div>

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

      <div
        v-if="acaras.data.length === 0"
        class="text-center py-20 text-stone-600 text-sm border border-dashed border-stone-800 rounded-2xl"
      >
        <p class="text-3xl mb-3">📅</p>
        <p>Belum ada agenda acara terdekat</p>
      </div>

      <div v-else class="grid grid-cols-1 gap-6">
        <Link
          v-for="acara in acaras.data"
          :key="acara.id"
          :href="`/acara/${acara.slug}`"
          class="block backdrop-blur-xs bg-stone-900/40 border border-stone-800/80 overflow-hidden hover:border-stone-700 hover:bg-stone-900/60 transition-all group shadow-sm"
        >
          <div class="flex">
            <div class="w-1/3 aspect-[1/1.41] bg-stone-950 border-r border-stone-800 shrink-0 overflow-hidden relative">
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
                <span class="text-3xl mb-1.5 filter drop-shadow">
                  {{ acara.kategori === 'kajian' ? '📖' : acara.kategori === 'workshop' ? '💻' : acara.kategori === 'sosial' ? '🤝' : '🕌' }}
                </span>
                <span class="text-[10px] text-stone-500 uppercase tracking-widest font-black truncate max-w-full">
                  {{ acara.kategori }}
                </span>
              </div>
            </div>

            <div class="w-2/3 p-6 flex flex-col min-w-0">
              <div class="flex flex-wrap items-center gap-2 mb-3">
                <span class="px-3 py-1 rounded bg-stone-950/80 backdrop-blur-xs text-[10px] uppercase font-bold text-stone-300 border border-stone-800 tracking-wide">
                  {{ acara.kategori }}
                </span>

                <span 
                  class="px-3 py-1 rounded bg-stone-950/80 backdrop-blur-xs text-[10px] uppercase font-bold border tracking-wide"
                  :class="getStatusRegistrasi(acara.batas_registrasi).tutup ? 'text-red-400 border-red-800' : 'text-emerald-400 border-emerald-800'"
                >
                  {{ getStatusRegistrasi(acara.batas_registrasi).teks }}
                </span>
              </div>

              <h2 class="text-lg font-bold text-stone-100 leading-tight group-hover:text-amber-400 transition-colors mb-5 line-clamp-2">
                {{ acara.judul }}
              </h2>

              <div v-if="Boolean(acara.accept_tiket)" class="space-y-2 mb-6">
                <div class="flex flex-col sm:flex-row sm:items-center gap-4 text-xs">
                  <div class="flex flex-col">
                    <span class="text-[10px] text-stone-500 uppercase font-bold tracking-tight">Total Kuota</span>
                    <span class="font-bold text-stone-300 font-sans text-xs">
                      {{ acara.kuota_tiket }} <span class="text-[11px] text-stone-500 font-normal">Kursi</span>
                    </span>
                  </div>
                  <div class="h-8 w-[1px] bg-stone-800 hidden sm:block"></div>
                  <div class="flex flex-col">
                    <span class="text-[10px] text-stone-500 uppercase font-bold tracking-tight">Sisa Tiket</span>
                    <span
                      class="text-xs font-black"
                      :class="getSisaTiket(acara) === 0 ? 'text-red-400' : 'text-emerald-400'"
                    >
                      {{ getSisaTiket(acara) }}
                    </span>
                  </div>
                  <div class="h-8 w-[1px] bg-stone-800 hidden sm:block"></div>
                  <div class="flex flex-col">
                    <span class="text-[10px] text-stone-500 uppercase font-bold tracking-tight">Terjual</span>
                    <span class="font-bold text-stone-300 text-xs">
                      {{ acara.tiket_terjual ?? 0 }}
                    </span>
                  </div>
                </div>
              </div>

              <div v-else-if="Boolean(acara.accept_donasi)" class="space-y-2 mb-6">
                <div class="flex justify-between items-end text-[11px]">
                  <span class="text-stone-500 uppercase text-[10px] font-bold">Dana Terkumpul</span>
                  <span class="text-amber-400 font-bold font-mono">{{ getProgressDonasi(acara) }}%</span>
                </div>
                <div class="h-2 w-full bg-stone-800 rounded-full overflow-hidden border border-stone-800">
                  <div
                    class="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-1000"
                    :style="{ width: getProgressDonasi(acara) + '%' }"
                  ></div>
                </div>
                <div class="text-[11px] text-stone-500 font-mono">
                  {{ formatRupiah(acara.donasi_masuk_sum_nominal ?? 0) }}
                  <span class="text-stone-600"> / {{ formatRupiah(acara.target_donasi) }}</span>
                </div>
              </div>

              <div>                 
                <span
                  class="px-3 py-1 rounded bg-stone-950/80 backdrop-blur-xs text-[10px] font-mono font-bold border border-stone-800 tracking-wide"
                  :class="getHargaBadgeInfo(acara).isGratis ? 'text-emerald-400 border-emerald-900/50 bg-emerald-950/20' : 'text-amber-400 border-amber-900/50 bg-amber-950/20'"
                >
                  {{ getHargaBadgeInfo(acara).teks }}
                </span>
              </div>              

              <div class="pt-4 border-t border-stone-800/60 mt-auto grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-500">
                <div class="flex items-center gap-2 truncate">
                  <span class="shrink-0 text-stone-600">📍</span>
                  <span class="truncate text-stone-300 font-medium">{{ acara.lokasi }}</span>
                </div>
                <div class="flex items-center gap-2 truncate sm:justify-end">
                  <CalendarDays class="size-3.5 shrink-0 text-indigo-400" />
                  <span class="text-stone-300 font-medium">{{ getTglMulai(acara.tgl_mulai) }}</span>
                </div>
              </div>

            </div>
          </div>
        </Link>
      </div>     

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