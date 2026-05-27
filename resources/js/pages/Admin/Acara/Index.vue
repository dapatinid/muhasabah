<script setup lang="ts">
import { Head, router, usePage, Link } from '@inertiajs/vue3'
import { ref, computed, watch } from 'vue'
import debounce from 'lodash/debounce'
import { 
    Search, Plus, Pencil, Trash2, 
    Ticket, HandHeart, Wallet, Target, BarChart3, CalendarDays, MapPin
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
                title: 'Acara',
                href: '/admin/acara',
            },
        ],
    },
});

const page = usePage()

/* =======================
   DATA DARI BACKEND
======================= */
const acaras = computed(() => page.props.acaras)

/* =======================
   FILTER & SEARCH STATE
======================= */
const search = ref(page.props.filters?.search ?? '')

watch(
  search,
  debounce((val) => {
    router.get(
      '/admin/acara',
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
const selectedAcara = ref<any>(null)

function confirmDelete(acara: any) {
  selectedAcara.value = acara
  showDeleteDialog.value = true
}

function deleteAcara() {
  if (!selectedAcara.value) return

  router.delete(`/admin/acara/${selectedAcara.value.slug}`, {
    preserveScroll: true,
    onSuccess: () => {
      showDeleteDialog.value = false
      selectedAcara.value = null
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

const getTotalDonasiMasuk = (acara: any) => {
  return Number(acara?.total_donasi_masuk) || 0
}

// Menghitung persentase capaian target donasi acara
const calculateDonasiProgress = (acara: any) => {
  const masuk = getTotalDonasiMasuk(acara)
  const target = Number(acara?.target_donasi) || 0
  if (target <= 0) return 0
  const percent = (masuk / target) * 100
  return Math.min(Math.round(percent), 100)
}

// Menghitung persentase okupansi kuota tiket terjual
const calculateTiketProgress = (acara: any) => {
  const terjual = Number(acara?.tiket_terjual) || 0
  const kuota = Number(acara?.kuota_tiket) || 0
  if (kuota <= 0) return 0
  const percent = (terjual / kuota) * 100
  return Math.min(Math.round(percent), 100)
}

// Status Batas Waktu Registrasi
const getStatusWaktu = (tglMulai: string | null) => {
  if (!tglMulai) return 'Terjadwal'
  
  const sekarang = new Date()
  const mulai = new Date(tglMulai)
  
  const selisihWaktu = mulai.getTime() - sekarang.getTime()
  const selisihHari = Math.ceil(selisihWaktu / (1000 * 3600 * 24))
  
  if (selisihHari < 0) return 'Selesai'
  if (selisihHari === 0) return 'Hari Ini'
  return `${selisihHari} Hari Lagi`
}
</script>

<template>
  <Head title="Manajemen Acara" />

    <div class="py-6 px-4 w-full mx-auto space-y-6">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Manajemen Acara</h1>
          <p class="text-zinc-500 dark:text-zinc-400 mt-1">Kelola registrasi tiket peserta, sponsorship, dan pendanaan acara.</p>
        </div>
        
        <Link 
          href="/admin/acara/create" 
          class="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all"
        >
          <Plus class="size-5" /> Buat Acara
        </Link>
      </div>

      <div class="relative max-w-md">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-zinc-400 pointer-events-none" />
        <input 
          v-model="search"
          type="text" 
          placeholder="Cari nama acara atau lokasi..." 
          class="w-full pl-11 pr-4 py-3 rounded-2xl border-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
        />
      </div>

      <div v-if="acaras.data.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div 
          v-for="acara in acaras.data" 
          :key="acara.id" 
          class="group relative flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 hover:shadow-xl transition-all overflow-hidden"
        >
          <div class="flex justify-between items-start mb-4">
            <span class="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
              {{ acara.kategori }}
            </span>
            
            <div class="flex gap-2">
              <Link :href="`/admin/acara/${acara.slug}/edit`" class="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-indigo-600 transition">
                <Pencil class="size-4" />
              </Link>
              <button @click="confirmDelete(acara)" class="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-red-600 transition cursor-pointer">
                <Trash2 class="size-4" />
              </button>
            </div>
          </div>

          <div v-if="acara.thumbnail" class="relative w-full h-40 mb-4 rounded-2xl overflow-hidden">
            <img :src="acara.thumbnail" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div v-if="!acara.is_published" class="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span class="text-white text-xs font-bold uppercase tracking-widest bg-zinc-800 px-3 py-1 rounded">Draft</span>
            </div>
          </div>

          <div class="flex-1 flex flex-col justify-between">
            <div>
              <h2 class="text-lg font-bold text-zinc-800 dark:text-zinc-100 leading-tight mb-2 line-clamp-2">
                {{ acara.judul }}
              </h2>
              
              <div class="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 text-xs mb-4">
                <MapPin class="size-3.5 text-zinc-400 shrink-0" />
                <span class="truncate">{{ acara.lokasi }}</span>
              </div>
            </div>

            <div class="space-y-4 mb-4">
              
              <div v-if="acara.accept_tiket" class="space-y-1.5 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                <div class="flex justify-between items-center text-[11px]">
                  <span class="text-zinc-400 font-bold uppercase text-[9px] flex items-center gap-1">
                    <Ticket class="size-3 text-indigo-500" /> Tiket Peserta ({{ acara.harga_tiket == 0 ? 'Gratis' : formatRupiah(acara.harga_tiket) }})
                  </span>
                  <span class="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {{ acara.tiket_terjual ?? 0 }} / {{ acara.kuota_tiket }} Terjual
                  </span>
                </div>
                
                <div class="h-1.5 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                    :style="{ width: calculateTiketProgress(acara) + '%' }"
                  ></div>
                </div>
              </div>

              <div v-if="acara.accept_donasi" class="space-y-1.5 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                <div class="flex justify-between items-end text-[11px]">
                  <div class="flex flex-col">
                    <span class="text-zinc-400 uppercase text-[9px] font-bold flex items-center gap-1">
                      <HandHeart class="size-3 text-amber-500" /> Sponsorship & Donasi
                    </span>
                    <span class="text-amber-600 dark:text-amber-500 font-bold font-mono text-xs mt-0.5">
                      {{ formatRupiah(getTotalDonasiMasuk(acara)) }}
                    </span>
                  </div>
                  <div class="text-right flex flex-col items-end">
                    <span class="text-zinc-400 text-[9px]">Target: {{ formatRupiah(acara.target_donasi) }}</span>
                    <span class="text-zinc-800 dark:text-zinc-200 font-extrabold font-mono text-xs">
                      {{ calculateDonasiProgress(acara) }}%
                    </span>
                  </div>
                </div>
                
                <div class="h-1.5 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-amber-500 rounded-full transition-all duration-1000"
                    :style="{ width: calculateDonasiProgress(acara) + '%' }"
                  ></div>
                </div>
              </div>

            </div>

            <div class="flex items-center gap-1.5 text-[10px] text-zinc-500 dark:text-zinc-400 pb-3">
              <CalendarDays class="size-3.5 text-zinc-400" />
              <span class="font-medium">Pelaksanaan: {{ acara.tgl_mulai ? new Date(acara.tgl_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-' }}</span>
              <span class="ms-auto font-bold bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md text-zinc-600 dark:text-zinc-300 text-[9px]">
                {{ getStatusWaktu(acara.tgl_mulai) }}
              </span>
            </div>
          </div>          

          <div class="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between mt-auto">
            <div class="flex items-center gap-2">
              <BarChart3 class="size-4 text-zinc-400" />
              <span class="text-[11px] text-zinc-500 font-medium">
                {{ (acara.tiket_terjual ?? 0) }} Peserta Registrasi
              </span>
            </div>
            
            <Link :href="`/acara/${acara.slug}`" class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition">
              Pratinjau Publik <Ticket class="size-4" />
            </Link>
          </div>
        </div>
      </div>

      <div v-else class="py-20 text-center">
        <div class="inline-flex items-center justify-center size-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
          <Wallet class="size-8 text-zinc-400" />
        </div>
        <p class="text-zinc-400 italic">Belum ada agenda atau acara yang dibuat.</p>
      </div>

      <div v-if="acaras.links.length > 3" class="flex justify-center gap-1 mt-8 overflow-x-auto no-scrollbar py-2">
        <button
          v-for="(link, i) in acaras.links"
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

    <Dialog v-model:open="showDeleteDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Agenda Acara?</DialogTitle>
          <DialogDescription>
            Acara "<strong>{{ selectedAcara?.judul }}</strong>" akan dihapus secara soft-delete. Halaman pendaftaran publik akan ditutup namun riwayat transaksi kas masuk/tiket tetap aman di database.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="flex gap-2 justify-end">
          <Button variant="outline" @click="showDeleteDialog = false">Batal</Button>
          <Button variant="destructive" @click="deleteAcara">Ya, Hapus Acara</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

</template>