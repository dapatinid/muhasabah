<script setup lang="ts">
import { Head, router, usePage, Link } from '@inertiajs/vue3'
import { ref, computed, watch } from 'vue'
import debounce from 'lodash/debounce'
import { 
    Search, Plus, Pencil, Trash2, 
    Image as ImageIcon, Link as LinkIcon, Eye, EyeOff
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
                title: 'Banner Jumbotron',
                href: '/admin/banner',
            },
        ],
    },
});

const page = usePage()

/* =======================
   DATA DARI BACKEND
======================= */
const banners = computed(() => page.props.banners)

/* =======================
   FILTER & SEARCH STATE
======================= */
const search = ref(page.props.filters?.search ?? '')

watch(
  search,
  debounce((val) => {
    router.get(
      '/admin/banner',
      { search: val || undefined },
      { preserveState: true, preserveScroll: true, replace: true }
    )
  }, 1000)
)

/* =======================
   DELETE LOGIC
======================= */
const showDeleteDialog = ref(false)
const selectedBanner = ref<any>(null)

function confirmDelete(banner: any) {
  selectedBanner.value = banner
  showDeleteDialog.value = true
}

function deleteBanner() {
  if (!selectedBanner.value) return

  router.delete(`/admin/banner/${selectedBanner.value.id}`, {
    preserveScroll: true,
    onSuccess: () => {
      showDeleteDialog.value = false
      selectedBanner.value = null
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
</script>

<template>
  <Head title="Kelola Jumbotron" />

    <div class="py-6 px-4 w-full mx-auto space-y-6">
      
      <!-- HEADER SECTION -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Banner Jumbotron</h1>
          <p class="text-zinc-500 dark:text-zinc-400 mt-1">Atur gambar slide dan pesan utama di halaman beranda.</p>
        </div>
        
        <Link 
          href="/admin/banner/create" 
          class="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all"
        >
          <Plus class="size-5" /> Banner
        </Link>
      </div>

      <!-- SEARCH BOX -->
      <div class="relative max-w-md">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-zinc-400 pointer-events-none" />
        <input 
          v-model="search"
          type="text" 
          placeholder="Cari judul atau subtitle banner..." 
          class="w-full pl-11 pr-4 py-3 rounded-2xl border-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-sm"
        />
      </div>

      <!-- LIST BANNER -->
      <div v-if="banners.data.length > 0" class="grid grid-cols-1 gap-4">
        <div 
          v-for="banner in banners.data" 
          :key="banner.id" 
          class="group relative flex flex-col md:flex-row bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden hover:shadow-lg transition-all"
        >
          <!-- Preview Image (Kiri/Atas) -->
          <div class="relative w-full md:w-72 h-48 md:h-auto overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
            <img 
              :src="banner.image" 
              :alt="banner.title" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div class="absolute top-3 left-3">
              <span 
                :class="banner.is_active ? 'bg-emerald-500' : 'bg-zinc-500'"
                class="px-2 py-1 rounded-md text-[10px] font-bold text-white uppercase shadow-sm"
              >
                {{ banner.is_active ? 'Aktif' : 'Non-Aktif' }}
              </span>
            </div>
          </div>

          <!-- Info & Action (Kanan) -->
          <div class="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-2">
                <div class="flex items-center gap-2">
                    <span class="text-[10px] font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded uppercase tracking-wider">
                        Priority: {{ banner.priority }}
                    </span>
                </div>
                
                <div class="flex gap-2">
                  <Link :href="`/admin/banner/${banner.id}/edit`" class="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-blue-600 transition">
                    <Pencil class="size-4" />
                  </Link>
                  <button @click="confirmDelete(banner)" class="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-red-600 transition cursor-pointer">
                    <Trash2 class="size-4" />
                  </button>
                </div>
              </div>

              <h2 class="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-1">
                {{ banner.title }}
              </h2>
              <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-2">
                {{ banner.subtitle || 'Tidak ada deskripsi tambahan.' }}
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-4 pt-4 border-t border-zinc-50 dark:border-zinc-800">
               <div class="flex items-center gap-1.5 text-xs text-zinc-400">
                  <LinkIcon class="size-3.5" />
                  <span class="truncate max-w-[200px]">{{ banner.link || 'Tanpa Link' }}</span>
               </div>
               <div class="flex items-center gap-1.5 text-xs text-zinc-400 ml-auto">
                  <span>Dibuat: {{ new Date(banner.created_at).toLocaleDateString('id-ID') }}</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <!-- EMPTY STATE -->
      <div v-else class="py-20 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
        <ImageIcon class="size-12 text-zinc-200 dark:text-zinc-800 mx-auto mb-4" />
        <p class="text-zinc-400 italic">Belum ada banner yang terdaftar.</p>
        <Link href="/admin/banner/create" class="text-amber-600 font-bold text-sm mt-2 inline-block hover:underline">
            Buat Banner Pertama
        </Link>
      </div>

      <!-- PAGINATION -->
      <div v-if="banners.links.length > 3" class="flex justify-center gap-1 mt-8 overflow-x-auto no-scrollbar py-2">
        <button
          v-for="(link, i) in banners.links"
          :key="i"
          @click="goToPage(link.url)"
          v-html="link.label"
          class="shrink-0 px-4 py-2 rounded-xl text-sm transition-all"
          :class="[
            link.active ? 'bg-amber-600 text-white font-bold' : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50',
            !link.url ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
          ]"
        />
      </div>
    </div>

    <!-- DELETE DIALOG -->
    <Dialog v-model:open="showDeleteDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Banner?</DialogTitle>
          <DialogDescription>
            Banner "<strong>{{ selectedBanner?.title }}</strong>" akan dihapus. Pengunjung tidak akan melihat slide ini lagi di halaman depan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="flex gap-2 justify-end">
          <Button variant="outline" @click="showDeleteDialog = false">Batal</Button>
          <Button variant="destructive" @click="deleteBanner">Ya, Hapus</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>