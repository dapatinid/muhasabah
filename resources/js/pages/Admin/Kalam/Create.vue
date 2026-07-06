<script setup lang="ts">
import { Head, useForm, Link } from '@inertiajs/vue3'
import TiptapEditor from '@/Components/TiptapEditor.vue'
import { ArrowLeft, Save } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Kalam',
                href: '/admin/kalam',
            },
            {
                title: 'Tulis Baru',
                href: '/admin/kalam/create',
            },
        ],
    },
});

const form = useForm({
  judul: '',
  body: '',
  kategori: 'hikmah',
  is_anonymous: false,
})

const categories = [
  { label: 'Hikmah', value: 'hikmah' },
  { label: 'Doa', value: 'doa' },
  { label: 'Kisah', value: 'kisah' },
  { label: 'Tips & Trik', value: 'tips' },
  { label: 'Berita', value: 'berita' },
]

function submit() {
  form.post('/admin/kalam', {
    onSuccess: () => form.reset(),
  })
}

const breadcrumbs = [
  { title: 'Kalam', href: '/admin/kalam' },
  { title: 'Tulis Baru', href: '/admin/kalam/create' }
]
</script>

<template>
  <Head title="Tulis Kalam Baru" />

    <div class="py-10 px-4 max-w-4xl mx-auto">
      <div class="flex items-center gap-4 mb-8">
        <h1 class="text-3xl font-bold tracking-tight">Tulis Kalam Baru</h1>
      </div>

      <form @submit.prevent="submit">
        <div class="space-y-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-8 rounded-2xl"> 
          
          <!-- Judul -->
          <div class="space-y-2">
            <Label for="judul">Judul Kalam</Label>
            <Input 
              id="judul" 
              v-model="form.judul" 
              placeholder="Masukkan judul yang menarik..." 
              class="text-lg font-semibold h-12 rounded-xl"
              required
            />
            <div v-if="form.errors.judul" class="text-red-500 text-xs">{{ form.errors.judul }}</div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Kategori -->
            <div class="space-y-2">
              <Label for="kategori">Kategori Konten</Label>
              <select 
                id="kategori"
                v-model="form.kategori"
                class="w-full h-11 px-3 rounded-xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 text-sm focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                  {{ cat.label }}
                </option>
              </select>
            </div>

            <!-- Anonim -->
            <div class="flex items-center space-x-3 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
              <input 
                type="checkbox" 
                id="is_anonymous" 
                v-model="form.is_anonymous"
                class="size-5 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
              />
              <div class="grid gap-1.5 leading-none">
                <label for="is_anonymous" class="text-sm font-medium leading-none cursor-pointer">
                  Posting sebagai Hamba Allah
                </label>
                <p class="text-xs text-zinc-500">Identitas Anda tidak akan ditampilkan ke publik.</p>
              </div>
            </div>
          </div>
        </div>  

        <!-- Rich Editor -->
        <div class="space-y-2 mt-10">
          <Label>Isi Kalam</Label>
          <TiptapEditor v-model="form.body" />
          <div v-if="form.errors.body" class="text-red-500 text-xs">{{ form.errors.body }}</div>
        </div>

        <!-- Action -->
        <div class="flex justify-end pt-4 border-t">
          <Button 
            type="submit" 
            class="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-12 rounded-xl font-bold gap-2 w-full sm:w-auto justify-center sm:justify-end"
            :disabled="form.processing"
          >
            <Save class="size-5" />
            {{ form.processing ? 'Menerbitkan...' : 'Terbitkan Kalam' }}
          </Button>
        </div>

      </form>
    </div>

</template>