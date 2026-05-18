<script setup lang="ts">
import { Head, router, usePage, Link } from '@inertiajs/vue3'
import { ref, computed, watch } from 'vue'
import debounce from 'lodash/debounce'
import { 
    Search, Plus, Pencil, Trash2, 
    HandHeart, Wallet, Target, BarChart3, CalendarDays
} from 'lucide-vue-next'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Donasi',
                href: '/admin/donasi',
            },
        ],
    },
});

const page = usePage()

/* =======================
   DATA DARI BACKEND
======================= */
const donasis = computed(() => page.props.donasis)

/* =======================
   FILTER & SEARCH STATE
======================= */
const search = ref(page.props.filters?.search ?? '')

watch(
  search,
  debounce((val) => {
    router.get(
      '/admin/donasi',
      { search: val || undefined },
      { preserveState: true, preserveScroll: true, replace: true }
    )
  }, 1000)
)

/* =======================
   PAGINATION NAVIGATION
======================= */
function goToPage(url: string | null) {
  if (!url) return
  router.get(url, {}, { preserveState: true, preserveScroll: true })
}

/* =======================
   DELETE LOGIC
======================= */
const showDeleteDialog = ref(false)
const selectedDonasi = ref<any>(null)

function confirmDelete(donasi: any) {
  selectedDonasi.value = donasi
  showDeleteDialog.value = true
}

function deleteDonasi() {
  if (!selectedDonasi.value) return

  router.delete(`/admin/donasi/${selectedDonasi.value.slug}`, {
    preserveScroll: true,
    onSuccess: () => {
      showDeleteDialog.value = false
      selectedDonasi.value = null
    },
  })
}

/* =======================
   HELPERS & CALCULATION LOGIC
======================= */
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const formatRupiah = (value: any) => {
  return formatCurrency(Number(value) || 0)
}

const getTotalTasyaruf = (donasi: any) => {
  return Number(donasi?.total_tasyaruf) || 0
}

const getTotalDonasiMasuk = (donasi: any) => {
  return Number(donasi?.total_donasi_masuk) || 0
}

// OPSI B: Hitung Progress berdasarkan Total Donasi Masuk vs Target Dana
const calculateProgressTarget = (donasi: any) => {
  const masuk = getTotalDonasiMasuk(donasi)
  const target = Number(donasi?.target_dana) || 0
  if (target <= 0) return 0
  const percent = (masuk / target) * 100
  return Math.min(Math.round(percent), 100)
}

// OPSI A: Hitung Progress penyaluran Program Rutin (Tasyaruf vs Total Donasi Masuk)
const calculateProgressRutin = (donasi: any) => {
  const masuk = getTotalDonasiMasuk(donasi)
  const keluar = getTotalTasyaruf(donasi)
  if (masuk <= 0) return 0
  const percent = (keluar / masuk) * 100
  return Math.min(Math.round(percent), 100)
}

// Sisa Hari Konten Terkini
const getSisaHari = (tglSelesai: string | null, createdAt: string) => {
  if (!tglSelesai) return 'Berlanjut'
  
  const sekarang = new Date()
  const selesai = new Date(tglSelesai)
  
  const selisihWaktu = selesai.getTime() - sekarang.getTime()
  const selisihHari = Math.ceil(selisihWaktu / (1000 * 3600 * 24))
  
  if (selisihHari < 0) return 'Selesai'
  if (selisihHari === 0) return 'Hari Ini'
  return `${selisihHari} Hari Lagi`
}
</script>

<template>
  <Head title="Manajemen Donasi" />

    <div class="py-6 px-4 w-full mx-auto space-y-6">
      
      <!-- HEADER SECTION -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Program Donasi</h1>
          <p class="text-zinc-500 dark:text-zinc-400 mt-1">Kelola penggalangan dana dan transparansi saldo donasi.</p>
        </div>
        
        <Link 
          href="/admin/donasi/create" 
          class="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all"
        >
          <Plus class="size-5" /> Donasi
        </Link>
      </div>

      <!-- SEARCH BOX -->
      <div class="relative max-w-md">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-zinc-400 pointer-events-none" />
        <input 
          v-model="search"
          type="text" 
          placeholder="Cari program donasi..." 
          class="w-full pl-11 pr-4 py-3 rounded-2xl border-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
        />
      </div>

      <!-- GRID LIST DONASI -->
      <div v-if="donasis.data.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div 
          v-for="donasi in donasis.data" 
          :key="donasi.id" 
          class="group relative flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 hover:shadow-xl transition-all overflow-hidden"
        >
          <!-- Status & Actions -->
          <div class="flex justify-between items-start mb-4">
            <span class="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
              {{ donasi.kategori }}
            </span>
            
            <div class="flex gap-2">
              <Link :href="`/admin/donasi/${donasi.slug}/edit`" class="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-indigo-600 transition">
                <Pencil class="size-4" />
              </Link>
              <button @click="confirmDelete(donasi)" class="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-red-600 transition cursor-pointer">
                <Trash2 class="size-4" />
              </button>
            </div>
          </div>

          <!-- Thumbnail -->
          <div v-if="donasi.thumbnail" class="relative w-full h-40 mb-4 rounded-2xl overflow-hidden">
            <img :src="donasi.thumbnail" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div v-if="!donasi.is_published" class="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span class="text-white text-xs font-bold uppercase tracking-widest bg-zinc-800 px-3 py-1 rounded">Draft</span>
            </div>
          </div>

          <!-- Info Donasi -->
          <div class="flex-1 flex flex-col justify-between">
            <div>
              <h2 class="text-lg font-bold text-zinc-800 dark:text-zinc-100 leading-tight mb-4 line-clamp-2">
                {{ donasi.judul }}
              </h2>
            </div>

            <!-- OPSI A: DESAIN CARD DONASI RUTIN (TARGET DANA = 0) -->
            <!-- Membandingkan Dana Masuk vs Dana Tasyaruf -->
            <div v-if="Number(donasi.target_dana) === 0" class="space-y-3 mb-4">
              <div class="grid grid-cols-2 gap-2 text-[11px]">
                 <div class="flex flex-col">
                   <span class="text-zinc-400 uppercase text-[9px] font-bold">Telah Disalurkan</span>
                   <span class="text-emerald-600 dark:text-emerald-400 font-bold font-mono text-sm">
                     {{ formatRupiah(getTotalTasyaruf(donasi)) }}
                   </span>
                 </div>
                 <div class="flex flex-col text-right">
                   <span class="text-zinc-400 uppercase text-[9px] font-bold">Total Terkumpul</span>
                   <span class="text-amber-600 dark:text-amber-500 font-bold font-mono text-sm">
                     {{ formatRupiah(getTotalDonasiMasuk(donasi)) }}
                   </span>
                 </div>
              </div>
              
              <!-- Progress Bar Penyaluran -->
              <div class="h-2 w-full bg-gradient-to-r from-amber-800 to-amber-600 dark:from-amber-950 dark:to-amber-800 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(52,211,153,0.3)]"
                  :style="{ width: calculateProgressRutin(donasi) + '%' }"
                ></div>
              </div>

              <div class="flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400 pt-1">
                <span class="text-amber-600 dark:text-amber-500 font-bold uppercase tracking-wider text-[9px]">Program Rutin</span>
                <span class="font-bold text-zinc-600 dark:text-zinc-300">{{ calculateProgressRutin(donasi) }}% Terdistribusi</span>
              </div>
            </div>

            <!-- OPSI B: DESAIN CARD DONASI TARGET / PROGRAM (TARGET DANA > 0) -->
            <!-- Sesuai Prinsip Baru: Menggunakan Dana Masuk (bukan saldo) vs Dana Target -->
            <div v-else class="space-y-3 mb-4">
              <div class="flex justify-between items-end text-[11px]">
                 <div class="flex flex-col">
                   <span class="text-zinc-400 uppercase text-[9px] font-bold">Terkumpul (Dana Masuk)</span>
                   <span class="text-amber-600 dark:text-amber-500 font-bold font-mono text-sm">
                     {{ formatRupiah(getTotalDonasiMasuk(donasi)) }}
                   </span>
                 </div>
                 <div class="text-right">
                   <span class="text-zinc-800 dark:text-zinc-200 font-extrabold font-mono text-sm">
                     {{ calculateProgressTarget(donasi) }}%
                   </span>
                 </div>
              </div>
              
              <!-- Progress Bar Capaian Target -->
              <div class="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-amber-500 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                  :style="{ width: calculateProgressTarget(donasi) + '%' }"
                ></div>
              </div>

              <div class="flex items-center gap-1.5 text-[10px] text-zinc-500 dark:text-zinc-400 pt-1">
                <Target class="size-3.5 text-zinc-400" />
                <span class="font-medium">Target: {{ formatRupiah(donasi.target_dana) }}</span>
                <span class="ms-auto flex items-center gap-1 font-medium bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md text-zinc-600 dark:text-zinc-300 text-[9px]">
                  <CalendarDays class="size-3 text-zinc-400" /> 
                  {{ getSisaHari(donasi.tgl_selesai, donasi.created_at) }}
                </span>
              </div>
            </div>
          </div>          

          <!-- Footer -->
          <div class="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between mt-auto">
            <div class="flex items-center gap-2">
              <BarChart3 class="size-4 text-zinc-400" />
              <span class="text-[11px] text-zinc-500 font-medium">
                {{ donasi.payments_count ?? 0 }} Transaksi
              </span>
            </div>
            
            <Link :href="`/donasi/${donasi.slug}`" class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition">
              Detail <HandHeart class="size-4" />
            </Link>
          </div>
        </div>
      </div>

      <!-- EMPTY STATE -->
      <div v-else class="py-20 text-center">
        <div class="inline-flex items-center justify-center size-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
          <Wallet class="size-8 text-zinc-400" />
        </div>
        <p class="text-zinc-400 italic">Belum ada program donasi yang dibuat.</p>
      </div>

      <!-- PAGINATION -->
      <div v-if="donasis.links.length > 3" class="flex justify-center gap-1 mt-8 overflow-x-auto no-scrollbar py-2">
        <button
          v-for="(link, i) in donasis.links"
          :key="i"
          @click="goToPage(link.url)"
          v-html="link.label"
          class="shrink-0 px-4 py-2 rounded-xl text-sm transition-all"
          :class="[
            link.active ? 'bg-indigo-600 text-white font-bold' : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50',
            !link.url ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
          ]"
        />
      </div>
    </div>

    <!-- DELETE DIALOG -->
    <Dialog v-model:open="showDeleteDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Program Donasi?</DialogTitle>
          <DialogDescription>
            Donasi "<strong>{{ selectedDonasi?.judul }}</strong>" akan dihapus. Ini akan menyembunyikan program dari publik namun histori payment akan tetap tersimpan (Soft Delete).
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="flex gap-2 justify-end">
          <Button variant="outline" @click="showDeleteDialog = false">Batal</Button>
          <Button variant="destructive" @click="deleteDonasi">Ya, Hapus</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

</template>