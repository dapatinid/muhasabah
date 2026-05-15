<script setup lang="ts">
import { Head, useForm, Link } from '@inertiajs/vue3'
import TiptapEditor from '@/Components/TiptapEditor.vue'
import { ArrowLeft, Save, Target } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Donasi',
                href: '/admin/donasi',
            },
            {
                title: 'Buat Program Baru',
                href: '/admin/donasi/create',
            },
        ],
    },
});

const form = useForm({
  judul: '',
  body: '',
  kategori: 'infaq',
  subkategori: 'infaq',
  target_dana: 0,
})

const categories = [
  { label: 'Infaq', value: 'infaq' },
  { label: 'Program', value: 'program' },
  { label: 'Zakat', value: 'zakat' },
  { label: 'Waqaf', value: 'waqaf' },
  { label: 'Qurban', value: 'qurban' },
]
const subcategories = [
  { label: 'Infaq', value: 'infaq' },
  { label: 'Program', value: 'program' },
  { label: 'Zakat', value: 'zakat' },
  { label: 'Waqaf', value: 'waqaf' },
  { label: 'Qurban', value: 'qurban' },
]

function submit() {
  form.post('/admin/donasi', {
    onSuccess: () => form.reset(),
  })
}
</script>

<template>
  <Head title="Buat Program Donasi Baru" />

    <div class="py-10 px-4 max-w-4xl mx-auto">
      <div class="flex items-center gap-4 mb-8">
        <Link href="/admin/donasi" class="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-indigo-600 transition">
          <ArrowLeft class="size-5" />
        </Link>
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Buat Program Donasi</h1>
          <p class="text-zinc-500 text-sm">Mulai penggalangan dana baru dengan rincian yang transparan.</p>
        </div>
      </div>

      <form @submit.prevent="submit" class="space-y-8 bg-white dark:bg-zinc-900 border p-8 rounded-3xl shadow-sm">
        
        <!-- Judul -->
        <div class="space-y-2">
          <Label for="judul">Judul Program Donasi</Label>
          <Input 
            id="judul" 
            v-model="form.judul" 
            placeholder="Contoh: Renovasi Atap Masjid Al-Ikhlas" 
            class="text-lg font-semibold h-12 rounded-xl focus-visible:ring-indigo-500"
            required
          />
          <div v-if="form.errors.judul" class="text-red-500 text-xs">{{ form.errors.judul }}</div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Kategori -->
          <div class="space-y-2">
            <Label for="kategori">Kategori Donasi</Label>
            <select 
              id="kategori"
              v-model="form.kategori"
              class="w-full h-11 px-3 rounded-xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                {{ cat.label }}
              </option>
            </select>
          </div>
          <!-- Subkategori -->
          <div class="space-y-2">
            <Label for="subkategori">Subkategori Donasi</Label>
            <select 
              id="subkategori"
              v-model="form.subkategori"
              class="w-full h-11 px-3 rounded-xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option v-for="subcat in subcategories" :key="subcat.value" :value="subcat.value">
                {{ subcat.label }}
              </option>
            </select>
          </div>

          <!-- Target Dana -->
          <div class="space-y-2">
            <Label for="target_dana">Target Dana (Rp)</Label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">Rp</span>
              <Input 
                id="target_dana" 
                type="number"
                v-model="form.target_dana" 
                class="pl-10 h-11 rounded-xl focus-visible:ring-indigo-500"
                placeholder="0"
                required
              />
            </div>
            <div v-if="form.errors.target_dana" class="text-red-500 text-xs">{{ form.errors.target_dana }}</div>
          </div>
        </div>

        <!-- Rich Editor -->
        <div class="space-y-2">
          <div class="flex items-center justify-between mb-1">
            <Label>Deskripsi Lengkap & Cerita Donasi</Label>
            <span class="text-[10px] text-zinc-400 italic">Gunakan gambar di dalam editor untuk thumbnail otomatis</span>
          </div>
          <TiptapEditor v-model="form.body" />
          <div v-if="form.errors.body" class="text-red-500 text-xs">{{ form.errors.body }}</div>
        </div>

        <!-- Action -->
        <div class="flex flex-col md:flex-row gap-4 items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <div class="flex items-center gap-2 text-zinc-500">
            <Target class="size-4 text-indigo-500" />
            <span class="text-xs italic">Data saldo akan otomatis terakumulasi dari histori payment.</span>
          </div>

          <Button 
            type="submit" 
            class="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-10 h-12 rounded-xl font-bold gap-2 shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
            :disabled="form.processing"
          >
            <Save class="size-5" />
            {{ form.processing ? 'Menyimpan...' : 'Terbitkan Program' }}
          </Button>
        </div>

      </form>
    </div>

</template>