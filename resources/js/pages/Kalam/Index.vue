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
      '/kalam',
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

  router.delete(`/kalam/${selectedKalam.value.slug}`, {  // ← id → slug
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

const breadcrumbs = [{ title: 'Kalam Riyadhoh', href: '/kalam' }]
</script>

<template>
  <Head title="Kalam Riyadhoh" />

    <div class="py-6 px-4 max-w-7xl mx-auto space-y-6">
      
      <!-- HEADER SECTION -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Kalam Riyadhoh</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-1">Berbagi hikmah, doa, dan perjalanan spiritual bersama.</p>
        </div>
        
        <Link 
          href="/kalam/create" 
          class="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all"
        >
          <Plus class="size-5" /> Tulis Kalam
        </Link>
      </div>

      <!-- SEARCH BOX -->
      <div class="relative max-w-md">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400 pointer-events-none" />
        <input 
          v-model="search"
          type="text" 
          placeholder="Cari judul, konten, atau kategori..." 
          class="w-full pl-11 pr-4 py-3 rounded-2xl border-slate-200 dark:border-slate-700 dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
        />
      </div>

      <!-- GRID LIST KALAM -->
      <div v-if="kalams.data.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="kalam in kalams.data" 
          :key="kalam.id" 
          class="group relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-xl hover:border-emerald-200 dark:hover:border-emerald-900 transition-all"
        >
          <!-- Category Tag & Action -->
          <div class="flex justify-between items-start mb-4">
            <span class="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
              {{ kalam.kategori }}
            </span>
            
            <div v-if="kalam.user_id === auth.user.id" class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link :href="`/kalam/${kalam.slug}/edit`" class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-blue-600 transition">
                <Pencil class="size-4" />
              </Link>
              <button @click="confirmDelete(kalam)" class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-600 transition">
                <Trash2 class="size-4" />
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1">
            <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight mb-2 line-clamp-2">
              {{ kalam.judul }}
            </h2>
            <div class="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4" v-html="kalam.body"></div>
          </div>

          <!-- Footer Metadata -->
          <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto">
            <div class="flex items-center gap-3">
              <div class="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-500 uppercase">
                {{ (kalam.is_anonymous ? 'H' : (kalam.user?.name || 'A')).substring(0, 1) }}
              </div>
              <div class="text-[11px]">
                <p class="font-bold text-slate-700 dark:text-slate-300">{{ kalam.is_anonymous ? 'Hamba Allah' : kalam.user?.name }}</p>
                <p class="text-slate-400">{{ new Date(kalam.created_at).toLocaleDateString('id-ID') }}</p>
              </div>
            </div>
            
            <Link :href="`/kalam/${kalam.slug}`" class="p-2 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-600 transition">
              <BookOpen class="size-5" />
            </Link>
          </div>
        </div>
      </div>

      <!-- EMPTY STATE -->
      <div v-else class="py-20 text-center">
        <p class="text-slate-400 italic">Belum ada Kalam yang ditemukan.</p>
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
            link.active ? 'bg-emerald-600 text-white font-bold' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50',
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