<script setup lang="ts">
import { Head, router, usePage, Link } from '@inertiajs/vue3'
import { ref, computed, watch } from 'vue'
import debounce from 'lodash/debounce'
import { 
    Search, Plus, Pencil, Trash2, 
    BookOpen, MessageCircle, Heart 
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
                title: 'Kalam',
                href: '/admin/kalam',
            },
        ],
    },
});

const page = usePage()

/* =======================
   DATA DARI BACKEND
======================= */
const kalams = computed(() => page.props.kalams)
const auth = computed(() => page.props.auth)

/* =======================
   FILTER & SEARCH STATE
======================= */
const search = ref(page.props.filters?.search ?? '')

// Watch search dengan debounce 1 detik agar tidak spam request
watch(
  search,
  debounce((val) => {
    router.get(
      '/admin/kalam',
      { search: val || undefined },
      { preserveState: true, preserveScroll: true, replace: true }
    )
  }, 1000)
)

/* =======================
   DELETE LOGIC
======================= */
const showDeleteDialog = ref(false)
const selectedKalam = ref<any>(null)

function confirmDelete(kalam: any) {
  selectedKalam.value = kalam
  showDeleteDialog.value = true
}

function deleteKalam() {
  if (!selectedKalam.value) return

  router.delete(`/admin/kalam/${selectedKalam.value.slug}`, {
    preserveScroll: true,
    onSuccess: () => {
      showDeleteDialog.value = false
      selectedKalam.value = null
    },
  })
}

/* =======================
   PAGINATION HELPER
======================= */
const goToPage = (url: string | null) => {
  if (!url) return
  router.get(url, { search: search.value || undefined }, {
    preserveState: true,
    preserveScroll: true,
    replace: true,
  })
}

// Fungsi untuk mengambil teks murni dan membatasi jumlah kata
const getExcerpt = (html: string, wordLimit: number) => {
  // 1. Hilangkan semua tag HTML
  const plainText = html.replace(/<[^>]*>/g, ' ');
  // 2. Pecah jadi array kata dan ambil sejumlah wordLimit
  const words = plainText.trim().split(/\s+/);
  
  if (words.length <= wordLimit) return plainText;
  
  return words.slice(0, wordLimit).join(' ') + '...';
}
</script>

<template>
  <Head title="Kalam Riyadhoh" />

    <div class="py-6 px-4 w-full mx-auto space-y-6">
      
      <!-- HEADER SECTION -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Kalam Riyadhoh</h1>
          <p class="text-zinc-500 dark:text-zinc-400 mt-1">Berbagi hikmah, doa, dan perjalanan spiritual bersama.</p>
        </div>
        
        <Link 
          href="/admin/kalam/create" 
          class="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all"
        >
          <Plus class="size-5" /> Kalam
        </Link>
      </div>

      <!-- SEARCH BOX -->
      <div class="relative max-w-md">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-zinc-400 pointer-events-none" />
        <input 
          v-model="search"
          type="text" 
          placeholder="Cari judul, konten, atau kategori..." 
          class="w-full pl-11 pr-4 py-3 rounded-2xl border-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
        />
      </div>

      <!-- GRID LIST KALAM -->
      <div v-if="kalams.data.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="kalam in kalams.data" 
          :key="kalam.id" 
          class="group relative flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 hover:shadow-xl hover:border-emerald-200 dark:hover:border-emerald-900 transition-all"
        >
          <!-- Category Tag & Action -->
          <div class="flex justify-between items-start mb-4">
            <span class="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
              {{ kalam.kategori }}
            </span>
            
            <div v-if="kalam.user_id === auth.user.id" class="flex gap-2">
              <Link :href="`/admin/kalam/${kalam.slug}/edit`" class="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-blue-600 transition">
                <Pencil class="size-4" />
              </Link>
              <button @click="confirmDelete(kalam)" class="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-red-600 transition cursor-pointer">
                <Trash2 class="size-4" />
              </button>
            </div>
          </div>

          <!-- Content Section -->
          <div class="flex-1">
            <h2 class="text-xl font-bold text-zinc-800 dark:text-zinc-100 leading-tight mb-4 line-clamp-2">
              {{ kalam.judul }}
            </h2>

            <!-- THUMBNAIL DINAMIS -->
            <div v-if="kalam.thumbnail" class="relative w-full h-44 mb-4 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
              <img 
                :src="kalam.thumbnail" 
                :alt="kalam.judul" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <!-- Cuplikan Body -->
            <div class="overflow-hidden mb-4">
              <p class="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed" :class="kalam.thumbnail ? 'line-clamp-3' : 'line-clamp-11'">
                {{ getExcerpt(kalam.body, 100) }}
              </p>
            </div>
          </div>

          <!-- Footer Metadata -->
          <div class="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between mt-auto">
            <div class="flex items-center gap-3">
              <div class="size-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-500 uppercase">
                {{ (kalam.is_anonymous ? 'H' : (kalam.user?.name || 'A')).substring(0, 1) }}
              </div>
              <div class="text-[11px]">
                <p class="font-bold text-zinc-700 dark:text-zinc-300">{{ kalam.is_anonymous ? 'Hamba Allah' : kalam.user?.name }}</p>
                <p class="text-zinc-400">{{ new Date(kalam.created_at).toLocaleDateString('id-ID') }}</p>
              </div>
            </div>
            
            <Link :href="`/kalam/${kalam.slug}`" class="p-2 rounded-full bg-zinc-50 dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-600 transition">
              <BookOpen class="size-5" />
            </Link>
          </div>
        </div>
      </div>

      <!-- EMPTY STATE -->
      <div v-else class="py-20 text-center">
        <p class="text-zinc-400 italic">Belum ada Kalam yang ditemukan.</p>
      </div>

      <!-- PAGINATION -->
      <div v-if="kalams.links.length > 3" class="flex justify-center gap-1 mt-8 overflow-x-auto no-scrollbar py-2">
        <button
          v-for="(link, i) in kalams.links"
          :key="i"
          @click="goToPage(link.url)"
          v-html="link.label"
          class="shrink-0 px-4 py-2 rounded-xl text-sm transition-all"
          :class="[
            link.active ? 'bg-emerald-600 text-white font-bold' : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50',
            !link.url ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
          ]"
        />
      </div>
    </div>

    <!-- DELETE DIALOG -->
    <Dialog v-model:open="showDeleteDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Kalam?</DialogTitle>
          <DialogDescription>
            Kalam berjudul "<strong>{{ selectedKalam?.judul }}</strong>" akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="flex gap-2 justify-end">
          <Button variant="outline" @click="showDeleteDialog = false">Batal</Button>
          <Button variant="destructive" @click="deleteKalam">Ya, Hapus</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>