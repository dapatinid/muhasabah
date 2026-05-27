<script setup lang="ts">
import { Head, useForm, Link } from '@inertiajs/vue3'
import TiptapEditor from '@/Components/TiptapEditor.vue'
import { ArrowLeft, Save, Target, Calendar } from 'lucide-vue-next'
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
  panduan_donasi: '',
  body: '',
  kategori: 'infaq',
  subkategori: 'infaq',
  target_dana: 0,
  tgl_mulai: '',
  tgl_selesai: '',
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

    <div class="py-10 px-4 w-full mx-auto">
      <div class="flex items-center gap-4 mb-8">
        <Link href="/admin/donasi" class="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-amber-600 transition">
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
            class="text-lg font-semibold h-12 rounded-xl focus-visible:ring-amber-500"
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
              class="w-full h-11 px-3 rounded-xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 text-sm focus:ring-amber-500 focus:border-amber-500"
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
              class="w-full h-11 px-3 rounded-xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 text-sm focus:ring-amber-500 focus:border-amber-500"
            >
              <option v-for="subcat in subcategories" :key="subcat.value" :value="subcat.value">
                {{ subcat.label }}
              </option>
            </select>
          </div>

          <!-- Tanggal Mulai -->
          <div class="space-y-2">
            <Label for="tgl_mulai">Tanggal Mulai</Label>
            <div class="relative">
              <Input 
                id="tgl_mulai" 
                type="date"
                v-model="form.tgl_mulai" 
                class="h-11 rounded-xl focus-visible:ring-amber-500"
              />
            </div>
            <div v-if="form.errors.tgl_mulai" class="text-red-500 text-xs">{{ form.errors.tgl_mulai }}</div>
          </div>

          <!-- Tanggal Selesai -->
          <div class="space-y-2">
            <Label for="tgl_selesai">Tanggal Selesai (Batas Penggalangan)</Label>
            <div class="relative">
              <Input 
                id="tgl_selesai" 
                type="date"
                v-model="form.tgl_selesai" 
                class="h-11 rounded-xl focus-visible:ring-amber-500"
                :disabled="Number(form.target_dana) === 0"
              />
            </div>
            <p v-if="Number(form.target_dana) === 0" class="text-[11px] text-zinc-400 italic">
              * Dinonaktifkan otomatis karena target dana bernilai 0 (Program Berkelanjutan).
            </p>
            <div v-if="form.errors.tgl_selesai" class="text-red-500 text-xs">{{ form.errors.tgl_selesai }}</div>
          </div>

          <!-- Target Dana -->
          <div class="space-y-2 md:col-span-2">
            <Label for="target_dana">Target Dana (Rp)</Label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">Rp</span>
              <Input 
                id="target_dana" 
                type="number"
                v-model="form.target_dana" 
                class="pl-10 h-11 rounded-xl focus-visible:ring-amber-500"
                placeholder="0"
                required
              />
            </div>
            <p class="text-[11px] leading-normal text-amber-600 dark:text-amber-400 font-medium">
              * Jika diisi <span class="font-bold font-mono">0</span>, sistem otomatis menganggap program ini sebagai <span class="font-bold underline">Donasi Rutin / Tanpa Batas Target</span>.
            </p>
            <div v-if="form.errors.target_dana" class="text-red-500 text-xs">{{ form.errors.target_dana }}</div>
          </div>
        </div>

        <!-- Panduan Donasi Singkat -->
        <div class="space-y-2">
          <Label for="panduan_donasi">Panduan / Aturan Singkat Donasi</Label>
          <Input 
            id="panduan_donasi" 
            v-model="form.panduan_donasi" 
            placeholder="Contoh: Minimal donasi paket Rp 50.000 atau kelipatannya." 
            class="h-11 rounded-xl focus-visible:ring-amber-500"
            required
          />
          <p class="text-[11px] text-zinc-400 italic">
            * Keterangan ini akan muncul di widget detail donasi untuk memandu nominal transfer donatur.
          </p>
          <div v-if="form.errors.panduan_donasi" class="text-red-500 text-xs">{{ form.errors.panduan_donasi }}</div>
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
            <Target class="size-4 text-amber-500" />
            <span class="text-xs italic">Data saldo akan otomatis terakumulasi dari histori payment.</span>
          </div>

          <Button 
            type="submit" 
            class="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white px-10 h-12 rounded-xl font-bold gap-2 shadow-lg shadow-amber-200 dark:shadow-none transition-all"
            :disabled="form.processing"
          >
            <Save class="size-5" />
            {{ form.processing ? 'Menyimpan...' : 'Terbitkan Program' }}
          </Button>
        </div>

      </form>
    </div>
</template>