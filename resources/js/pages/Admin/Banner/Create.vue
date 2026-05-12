<script setup lang="ts">
import { Head, useForm, Link, router, usePage } from '@inertiajs/vue3'
import { ref, watch } from 'vue'
import { ArrowLeft, Save, ImagePlus, Loader2, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch' // Asumsi Anda memiliki komponen Switch, jika tidak bisa pakai checkbox biasa

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Banner', href: '/admin/banner' },
            { title: 'Tambah Baru', href: '/admin/banner/create' },
        ],
    },
});

const page = usePage()
const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)

const form = useForm({
  title: '',
  subtitle: '',
  image: '',
  link: '',
  priority: 0,
  is_active: true,
})

// Trigger input file
function triggerFile() {
  fileInput.value?.click()
}

// Handle Upload Gambar
function handleUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  isUploading.value = true
  
  // Menggunakan rute upload yang sudah kita buat di Controller
  router.post('/admin/banner/upload', { image: file }, {
    forceFormData: true,
    onSuccess: (page) => {
      const url = (page.props as any).flash?.uploaded_image_url
      if (url) form.image = url
    },
    onFinish: () => {
      isUploading.value = false
      if (fileInput.value) fileInput.value.value = ''
    }
  })
}

function submit() {
  form.post('/admin/banner', {
    onSuccess: () => form.reset(),
  })
}
</script>

<template>
  <Head title="Tambah Banner Jumbotron" />

    <div class="py-10 px-4 max-w-4xl mx-auto">
      
      <!-- HEADER -->
      <div class="flex items-center gap-4 mb-8">
        <Link href="/admin/banner" class="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-amber-600 transition-colors">
          <ArrowLeft class="size-5" />
        </Link>
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Tambah Banner</h1>
          <p class="text-sm text-zinc-500">Buat visual utama untuk menyambut jamaah di halaman depan.</p>
        </div>
      </div>

      <form @submit.prevent="submit" class="space-y-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm">
        
        <!-- UPLOAD AREA -->
        <div class="space-y-3">
          <Label>Gambar Banner (Rekomendasi 1920x1080)</Label>
          
          <div v-if="!form.image" 
               @click="triggerFile"
               class="relative group border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/50 hover:bg-amber-50/5 transition-all">
            
            <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleUpload" />
            
            <div v-if="isUploading" class="flex flex-col items-center gap-2">
              <Loader2 class="size-10 text-amber-500 animate-spin" />
              <p class="text-sm text-zinc-500">Mengunggah gambar...</p>
            </div>
            
            <div v-else class="flex flex-col items-center gap-2">
              <div class="p-4 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600">
                <ImagePlus class="size-8" />
              </div>
              <p class="text-sm font-medium text-zinc-600 dark:text-zinc-400">Klik untuk upload gambar banner</p>
              <p class="text-xs text-zinc-400">PNG, JPG atau WEBP (Maks. 3MB)</p>
            </div>
          </div>

          <!-- Preview Gambar jika sudah diupload -->
          <div v-else class="relative group rounded-3xl overflow-hidden h-64 border border-zinc-200 dark:border-zinc-800">
            <img :src="form.image" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button type="button" @click="triggerFile" class="bg-white text-black px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                <ImagePlus class="size-4" /> Ganti Gambar
              </button>
              <button type="button" @click="form.image = ''" class="bg-red-500 text-white p-2 rounded-xl">
                <X class="size-5" />
              </button>
            </div>
          </div>
          <div v-if="form.errors.image" class="text-red-500 text-xs mt-1">{{ form.errors.image }}</div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Kolom Kiri -->
          <div class="space-y-6">
            <div class="space-y-2">
              <Label for="title">Judul Utama (Headline)</Label>
              <Input id="title" v-model="form.title" placeholder="Contoh: Selamat Datang..." class="rounded-xl h-11" required />
              <div v-if="form.errors.title" class="text-red-500 text-xs">{{ form.errors.title }}</div>
            </div>

            <div class="space-y-2">
              <Label for="subtitle">Sub Judul (Keterangan)</Label>
              <Input id="subtitle" v-model="form.subtitle" placeholder="Penjelasan singkat banner..." class="rounded-xl h-11" />
            </div>
          </div>

          <!-- Kolom Kanan -->
          <div class="space-y-6">
            <div class="space-y-2">
              <Label for="link">Link Tujuan (Opsional)</Label>
              <Input id="link" v-model="form.link" placeholder="https://..." class="rounded-xl h-11" />
              <p class="text-[10px] text-zinc-400 italic">* Jika diisi, banner akan bisa diklik.</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="priority">Urutan (Priority)</Label>
                <Input id="priority" type="number" v-model="form.priority" class="rounded-xl h-11" />
              </div>
              
              <div class="space-y-2">
                <Label>Status Tampil</Label>
                <div class="flex items-center gap-3 h-11 px-1">
                  <input type="checkbox" v-model="form.is_active" class="size-5 rounded border-zinc-300 text-amber-600 focus:ring-amber-500" />
                  <span class="text-sm font-medium text-zinc-600">{{ form.is_active ? 'Aktif' : 'Draft' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ACTION -->
        <div class="flex justify-between items-center pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <p class="text-xs text-zinc-400 italic max-w-xs">Pastikan gambar memiliki aspek rasio lebar untuk tampilan jumbotron yang optimal.</p>
          
          <div class="flex gap-3">
            <Link href="/admin/banner" class="px-6 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-bold hover:bg-zinc-50 transition-colors">
              Batal
            </Link>
            <Button 
              type="submit" 
              class="bg-amber-600 hover:bg-amber-700 text-white px-8 h-11 rounded-xl font-bold gap-2 shadow-lg shadow-amber-500/20"
              :disabled="form.processing || isUploading"
            >
              <Save class="size-4" />
              {{ form.processing ? 'Menyimpan...' : 'Simpan Banner' }}
            </Button>
          </div>
        </div>

      </form>
    </div>
</template>