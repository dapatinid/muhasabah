<script setup lang="ts">
import { Head, router, usePage, Link } from '@inertiajs/vue3'
import { ref, computed, watch } from 'vue'
import debounce from 'lodash/debounce'
import { 
    Search, Plus, Pencil, Trash2, 
    HandHeart, Wallet, Target, BarChart3 
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
const auth = computed(() => page.props.auth)

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
   HELPERS
======================= */
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const calculateProgress = (saldo: number, target: number) => {
  if (!target || target <= 0) return 0;
  const percent = (saldo / target) * 100;
  return Math.min(Math.round(percent), 100);
}

const goToPage = (url: string | null) => {
  if (!url) return
  router.get(url, { search: search.value || undefined }, {
    preserveState: true,
    preserveScroll: true,
    replace: true,
  })
}

const getExcerpt = (html: string, wordLimit: number) => {
  const plainText = html.replace(/<[^>]*>/g, ' ');
  const words = plainText.trim().split(/\s+/);
  if (words.length <= wordLimit) return plainText;
  return words.slice(0, wordLimit).join(' ') + '...';
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
          <div class="flex-1">
            <h2 class="text-lg font-bold text-zinc-800 dark:text-zinc-100 leading-tight mb-3 line-clamp-2">
              {{ donasi.judul }}
            </h2>

            <!-- Progress Bar -->
            <div class="space-y-2 mb-4">
              <div class="flex justify-between text-xs font-medium">
                <span class="text-zinc-500">Progress Dana</span>
                <span class="text-indigo-600 font-bold">{{ calculateProgress(donasi.saldo, donasi.target_dana) }}%</span>
              </div>
              <div class="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div 
                  class="bg-indigo-500 h-full transition-all duration-1000" 
                  :style="{ width: `${calculateProgress(donasi.saldo, donasi.target_dana)}%` }"
                ></div>
              </div>
            </div>

            <!-- Saldo Info -->
            <div class="grid grid-cols-2 gap-2 mb-4">
              <div class="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                <p class="text-[10px] text-zinc-400 uppercase font-bold">Saldo Saat Ini</p>
                <p class="text-sm font-bold text-emerald-600">{{ formatCurrency(donasi.saldo) }}</p>
              </div>
              <div class="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                <p class="text-[10px] text-zinc-400 uppercase font-bold">Target</p>
                <p class="text-sm font-bold text-zinc-700 dark:text-zinc-300">{{ formatCurrency(donasi.target_dana) }}</p>
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

<!-- <style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style> -->