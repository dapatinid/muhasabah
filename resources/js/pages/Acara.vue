<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3'
import { ref, watch } from 'vue'
import debounce from 'lodash/debounce'
import { Search, CalendarDays, MapPin, X, ArrowRight } from 'lucide-vue-next'
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

// State Modal Dialog
const isModalOpen   = ref(false)
const selectedAcara = ref<typeof props.acaras.data[0] | null>(null)

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

function getHargaBadgeInfo(acara: typeof props.acaras.data[0]) {
  if (Boolean(acara.accept_tiket)) {
    if (!acara.variants || acara.variants.length === 0) {
      return { teks: 'GRATIS PENDAFTARAN', isGratis: true }
    }
    const listHarga = acara.variants.map(v => Number(v.harga))
    const hargaMin = Math.min(...listHarga)
    const hargaMax = Math.max(...listHarga)

    if (hargaMax === 0) return { teks: 'GRATIS (REGISTRASI)', isGratis: true }
    if (hargaMin === hargaMax) return { teks: formatRupiah(hargaMin), isGratis: false }
    return { teks: `${formatRupiah(hargaMin)} - ${formatRupiah(hargaMax)}`, isGratis: false }
  }

  if (Boolean(acara.accept_donasi)) return { teks: 'OPEN DONASI', isGratis: false }
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

  return sisaHari > 1 ? { teks: `${sisaHari} hari lagi`, tutup: false } : { teks: 'Hari ini', tutup: false }
}

function getTglMulai(tgl: string): string {
  const hasil = new Date(tgl).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric', 
    month: 'long',   
    year: 'numeric',
  })

  // Mengganti teks "Minggu" menjadi "Ahad" jika ada
  return hasil.replace(/^Minggu/, 'Ahad')
}

function getSisaTiket(acara: typeof props.acaras.data[0]): number {
  return Math.max(0, acara.kuota_tiket - (acara.tiket_terjual ?? 0))
}

function getProgressDonasi(acara: typeof props.acaras.data[0]): number {
  if (!acara.target_donasi || acara.target_donasi <= 0) return 0
  return Math.min(100, Math.round(((acara.donasi_masuk_sum_nominal ?? 0) / acara.target_donasi) * 100))
}

// Handler klik poster untuk buka modal
function openDetail(acara: typeof props.acaras.data[0]) {
  selectedAcara.value = acara
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  selectedAcara.value = null
}
</script>

<template>
  <Head title="Agenda Kegiatan & Acara" />
  <AppLayoutPublic subtitle="Informasi Kegiatan" title="Agenda Acara" :show-back="true">

    <div class="py-3 space-y-6 pb-50">

      <div class="relative group px-2 mt-3">
        <span class="absolute left-6 top-1/2 -translate-y-1/2 text-stone-500 group-focus-within:text-amber-400 transition-colors">
          <Search class="size-4" />
        </span>
        <input
          v-model="search"
          type="search"
          placeholder="Cari agenda kegiatan..."
          class="w-full bg-stone-900 border border-stone-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-stone-200 placeholder-stone-600 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/40 transition-all outline-none"
        >
      </div>

      <div class="flex px-2 gap-2 overflow-x-auto no-scrollbar pb-1">
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
        class="text-center px-2 py-20 text-stone-600 text-sm border border-dashed border-stone-800 rounded-2xl"
      >
        <p class="text-3xl mb-3">📅</p>
        <p>Belum ada agenda acara terdekat</p>
      </div>

      <div v-else class="grid grid-cols-2 px-2 gap-2 md:gap-4">
        <div
          v-for="acara in acaras.data"
          :key="acara.id"
          @click="openDetail(acara)"
          class="block cursor-pointer bg-stone-900/40 border border-stone-800/80 overflow-hidden hover:border-stone-700 transition-all group relative aspect-21/30 shadow-sm"
        >
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
            <span class="text-4xl mb-1.5 filter drop-shadow">
              {{ acara.kategori === 'kajian' ? '📖' : acara.kategori === 'workshop' ? '💻' : acara.kategori === 'sosial' ? '🤝' : '🕌' }}
            </span>
            <span class="text-[10px] text-stone-500 uppercase tracking-widest font-black truncate max-w-full">
              {{ acara.kategori }}
            </span>
          </div>

          <div class="absolute top-2 right-2 flex gap-1">
            <span class="px-1.5 py-0.5 text-[8px] font-black rounded-sm bg-stone-950/80 text-amber-400 border border-stone-800/50 uppercase tracking-tight">
              {{ acara.kategori }}
            </span>
          </div>
        </div>
      </div>      

      <div v-if="acaras.links.length > 3" class="flex justify-center px-2 gap-1.5 pt-6 flex-wrap">
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

    <div 
      v-if="isModalOpen && selectedAcara" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md transition-all animate-in fade-in duration-200"
      @click.self="closeModal"
    >
      <div class="bg-stone-900 border border-stone-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[80vh]">
        
        <button 
          @click="closeModal" 
          class="absolute top-4 right-4 z-10 p-2 rounded-full bg-stone-950/60 border border-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
        >
          <X class="size-4" />
        </button>

        <div class="w-full aspect-3/1 bg-stone-950 relative overflow-hidden shrink-0">
          <img
            v-if="selectedAcara.thumbnail"
            :src="selectedAcara.thumbnail.startsWith('http') ? selectedAcara.thumbnail : `/storage/${selectedAcara.thumbnail}`"
            :alt="selectedAcara.judul"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-stone-950 text-4xl">
            {{ selectedAcara.kategori === 'kajian' ? '📖' : selectedAcara.kategori === 'workshop' ? '💻' : selectedAcara.kategori === 'sosial' ? '🤝' : '🕌' }}
          </div>
          <div class="absolute bottom-3 left-3 flex gap-2">
            <span class="px-2.5 py-1 rounded bg-stone-950/80 backdrop-blur-xs text-[10px] uppercase font-bold text-stone-300 border border-stone-800 tracking-wide">
              {{ selectedAcara.kategori }}
            </span>
            <span 
              class="px-2.5 py-1 rounded bg-stone-950/80 backdrop-blur-xs text-[10px] uppercase font-bold border tracking-wide"
              :class="getStatusRegistrasi(selectedAcara.batas_registrasi).tutup ? 'text-red-400 border-red-800' : 'text-emerald-400 border-emerald-800'"
            >
              {{ getStatusRegistrasi(selectedAcara.batas_registrasi).teks }}
            </span>
          </div>
        </div>

        <div class="p-6 overflow-y-auto space-y-4 text-sm text-stone-300">
          <h2 class="text-lg font-bold text-stone-100 leading-snug">
            {{ selectedAcara.judul }}
          </h2>

          <div v-if="Boolean(selectedAcara.accept_tiket)" class="bg-stone-950/50 border border-stone-800/60 p-3 rounded-xl">
            <div class="grid grid-cols-3 gap-2 text-center text-xs">
              <div class="flex flex-col">
                <span class="text-[9px] text-stone-500 uppercase font-bold tracking-tight mb-0.5">Kuota</span>
                <span class="font-bold text-stone-300">{{ selectedAcara.kuota_tiket }} <span class="text-[9px] text-stone-500 font-normal">Kursi</span></span>
              </div>
              <div class="flex flex-col border-x border-stone-800">
                <span class="text-[9px] text-stone-500 uppercase font-bold tracking-tight mb-0.5">Sisa</span>
                <span class="font-black" :class="getSisaTiket(selectedAcara) === 0 ? 'text-red-400' : 'text-emerald-400'">
                  {{ getSisaTiket(selectedAcara) }}
                </span>
              </div>
              <div class="flex flex-col">
                <span class="text-[9px] text-stone-500 uppercase font-bold tracking-tight mb-0.5">Terjual</span>
                <span class="font-bold text-stone-300">{{ selectedAcara.tiket_terjual ?? 0 }}</span>
              </div>
            </div>
          </div>

          <div v-else-if="Boolean(selectedAcara.accept_donasi)" class="space-y-1.5 bg-stone-950/30 p-3.5 border border-stone-800/40 rounded-xl">
            <div class="flex justify-between items-end text-xs">
              <span class="text-stone-500 uppercase text-[9px] font-bold">Patungan Dana</span>
              <span class="text-amber-400 font-bold font-mono">{{ getProgressDonasi(selectedAcara) }}%</span>
            </div>
            <div class="h-2 w-full bg-stone-800 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full" :style="{ width: getProgressDonasi(selectedAcara) + '%' }"></div>
            </div>
            <div class="text-[11px] text-stone-400 font-mono flex justify-between">
              <span>Terkumpul: {{ formatRupiah(selectedAcara.donasi_masuk_sum_nominal ?? 0) }}</span>
              <span class="text-stone-600">Target: {{ formatRupiah(selectedAcara.target_donasi) }}</span>
            </div>
          </div>

          <div class="space-y-2 pt-2 border-t border-stone-800 text-xs text-stone-400">
            <div class="flex items-center gap-2">
              <MapPin class="size-4 text-rose-400 shrink-0" />
              <span class="truncate">Lokasi : {{ selectedAcara.lokasi }}</span>
            </div>
            <div class="flex items-center gap-2">
              <CalendarDays class="size-4 text-indigo-400 shrink-0" />
              <span>Tanggal : {{ getTglMulai(selectedAcara.tgl_mulai) }}</span>
            </div>
          </div>

          <div class="flex pt-1">
            <span
              class="px-3 py-1 rounded text-xs font-mono font-bold border tracking-wide"
              :class="getHargaBadgeInfo(selectedAcara).isGratis ? 'text-emerald-400 border-emerald-900/50 bg-emerald-950/20' : 'text-amber-400 border-amber-900/50 bg-amber-950/20'"
            >
              Biaya : {{ getHargaBadgeInfo(selectedAcara).teks }}
            </span>
          </div>
        </div>

        <div class="p-4 bg-stone-950/40 border-t border-stone-800 flex shrink-0">
          <Link
            :href="`/acara/${selectedAcara.slug}`"
            class="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold py-3 px-4 rounded-xl text-sm transition-colors shadow-lg shadow-amber-500/10 group/btn"
          >
            <span>Selengkapnya</span>
            <ArrowRight class="size-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>


</AppLayoutPublic>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>