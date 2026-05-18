<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3'
import { computed, ref, watch } from 'vue'
import debounce from 'lodash/debounce'
import { Search, Heart, Target, CalendarDays, User } from 'lucide-vue-next'
import AppLayoutPublic from '@/layouts/AppLayoutPublic.vue'

const props = defineProps<{
  donasis: {
    data: Array<{
      id: number
      judul: string
      slug: string
      body: string
      kategori: string
      subkategori: string
      target_dana: number
      saldo: number
      thumbnail: string | null
      image: string | null
      tgl_mulai: string
      tgl_selesai: string
      created_at: string
      payments?: Array<{
        id: number
        mutation_type: string
        nominal: number
        paymentable_id: number
        paymentable_type: string
      }>
      total_tasyaruf?: number
      total_donasi_masuk?: number
      payments_count?: number
    }>
    links: Array<{ url: string | null; label: string; active: boolean }>
  }
  filters: { search?: string; kategori?: string }
}>()

// Ambil nilai default dari props filters agar sinkron saat refresh halaman
const search = ref(props.filters?.search ?? '')
const kategori = ref(props.filters?.kategori ?? '')

const kategoriList = ['Semua', 'infaq', 'program', 'zakat', 'waqaf', 'qurban']

// Inisialisasi aktifKategori disesuaikan dengan isi props.filters.kategori jika ada
const aktifKategori = ref(props.filters?.kategori ?? 'Semua')

// Gabungkan watch search menjadi SATU fungsi saja agar tidak conflict
watch(search, debounce((val) => {
  router.get('/donasi', { 
    search: val || undefined,
    kategori: aktifKategori.value === 'Semua' ? undefined : aktifKategori.value 
  }, {
    preserveState: true, 
    preserveScroll: true, 
    replace: true,
  })
}, 600))

function formatRupiah(nominal: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(nominal)
}

function stripHtml(html: string): string {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').substring(0, 80) + '...'
}

function filterKategori(kat: string) {
  aktifKategori.value = kat
  router.get('/donasi', {
    search: search.value || undefined,
    kategori: kat === 'Semua' ? undefined : kat,
  }, { preserveState: true, preserveScroll: true, replace: true })
}

function goToPage(url: string | null) {
  if (!url) return
  router.get(url, {}, { preserveState: true, preserveScroll: true })
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

  if (sisaHari > 0) {
    return `Sisa ${sisaHari} hari lagi`
  } else if (sisaHari === 0) {
    return 'Berakhir hari ini'
  } else {
    return 'Program selesai'
  }
}

// 1. Menghitung Total Tasyaruf (Pengeluaran/Penyaluran Dana) Berdasarkan Model Payment
function getTotalTasyaruf(donasi: any): number {
  if (donasi.total_tasyaruf !== undefined) return Number(donasi.total_tasyaruf)
  if (!donasi.payments) return 0
  return donasi.payments
    .filter((p: any) => p.mutation_type === 'tasyaruf')
    .reduce((sum: number, p: any) => sum + Number(p.nominal), 0)
}

// 2. Menghitung Total Dana Masuk Kumulatif Berdasarkan Model Payment (Bukan Saldo)
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

// Opsi B Progress: Pencapaian Dana Masuk vs Dana Target
function calculateProgressTarget(donasi: any): number {
  const totalDonasi = getTotalDonasiMasuk(donasi)
  const target = Number(donasi.target_dana)
  
  if (!target || target <= 0) return 0
  const percent = (totalDonasi / target) * 100
  return percent > 100 ? 100 : Math.round(percent)
}

// Menghitung jumlah donatur riil
function getJumlahDonatur(donasi: any): number {
  if (donasi.payments_count !== undefined) return donasi.payments_count
  if (!donasi.payments) return 0
  return donasi.payments.filter((p: any) => p.mutation_type === 'donasi_utama').length
}
</script>

<template>
  <Head title="Donasi — Uluran Tangan Anda" />
  <AppLayoutPublic subtitle="Program Kebaikan" title="Donasi" :show-back="true">

    <div class="px-5 py-6 space-y-6 pb-50">

        <!-- Search -->
        <div class="relative group">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 group-focus-within:text-amber-400 transition-colors">
            <Search class="size-4" />
          </span>
          <input
            v-model="search"
            type="search"
            placeholder="Cari program donasi..."
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
        <div v-if="donasis.data.length === 0"
             class="text-center py-20 text-stone-600 text-sm border border-dashed border-stone-800 rounded-2xl">
          <p class="text-3xl mb-3">🤝</p>
          <p>Belum ada program donasi aktif</p>
        </div>

        <!-- List Donasi -->
        <div v-else class="grid grid-cols-1 gap-4">
          <Link
            v-for="donasi in donasis.data"
            :key="donasi.id"
            :href="`/donasi/${donasi.slug}`"
            class="block bg-stone-900/40 border border-stone-800/60 rounded-3xl overflow-hidden hover:border-amber-500/30 transition-all group"
          >
            <!-- Thumbnail Dinamis Model -->
            <div class="aspect-video w-full bg-amber-950/30 relative overflow-hidden border-b border-stone-800">
              <img 
                v-if="donasi.thumbnail"
                :src="donasi.thumbnail" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <img 
                v-else-if="donasi.image"
                :src="donasi.image" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
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
                  {{ stripHtml(donasi.body) }}
                </p>
              </div>

              <!-- ==================== Progress Section ==================== -->
              
              <!-- OPSI A: DESAIN CARD DONASI RUTIN (TARGET DANA = 0) -> DANA MASUK VS DANA TASYARUF -->
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
                
                <!-- Progress Bar Penyaluran (Hijau Emerald) -->
                <div class="h-1.5 w-full bg-linear-to-r from-amber-700 to-amber-400 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-linear-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(52,211,153,0.3)]"
                    :style="{ width: calculateProgressRutin(donasi) + '%' }"
                  ></div>
                </div>

                <div class="flex items-center justify-between text-[10px] text-stone-500 pt-1">
                  <span class="text-amber-500/90 font-medium">Program Rutin</span>
                  <span class="font-bold text-stone-400">{{ calculateProgressRutin(donasi) }}% Terdistribusi</span>
                </div>
              </div>

              <!-- OPSI B: DESAIN CARD DONASI TARGET / PROGRAM (TARGET DANA > 0) -> DANA MASUK VS DANA TARGET -->
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
                
                <!-- Progress Bar Capaian Target (Amber) -->
                <div class="h-2 w-full bg-stone-800 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-amber-500 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                    :style="{ width: calculateProgressTarget(donasi) + '%' }"
                  ></div>
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


              <!-- ==================== Footer Section Card ==================== -->
              <div class="pt-2 flex items-center justify-between border-t border-stone-800/50">
                 <!-- Jumlah donatur -->
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

        <!-- Pagination -->
        <div v-if="donasis.links.length > 3" class="flex justify-center gap-1.5 pt-6 flex-wrap">
          <button
            v-for="(link, i) in donasis.links"
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