<script setup lang="ts">
import { Head, useForm, Link } from '@inertiajs/vue3'
import TiptapEditor from '@/components/TiptapEditor.vue'
import { ArrowLeft, Save, Globe, Lock, ChevronDown, Settings, HeartHandshake, MessageSquare, ArrowDownCircle, ArrowUpCircle, Eye, SquarePen, Newspaper } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ref, computed, watch } from 'vue'

const props = defineProps<{
    donasi: {
        id: number;
        slug: string;
        judul: string;
        panduan_donasi: string;
        body: string;
        kategori: string;
        subkategori: string;
        target_dana: number;
        tgl_mulai: string | null;
        tgl_selesai: string | null;
        is_published: boolean | number;
    }
}>();

const dropdownOpen = ref(false)

const form = useForm({
    judul: props.donasi.judul,
    slug: props.donasi.slug,
    panduan_donasi: props.donasi.panduan_donasi ?? '',
    body: props.donasi.body,
    kategori: props.donasi.kategori,
    subkategori: props.donasi.subkategori,
    target_dana: props.donasi.target_dana,
    tgl_mulai: props.donasi.tgl_mulai ?? '',
    tgl_selesai: props.donasi.tgl_selesai ?? '',
    is_published: Boolean(props.donasi.is_published),
})

const categories = [
  { label: 'Infaq', value: 'infaq' },
  { label: 'Program', value: 'program' },
  { label: 'Zakat', value: 'zakat' },
  { label: 'Waqaf', value: 'waqaf' },
  { label: 'Qurban', value: 'qurban' },
]

// 1. Buat Mapping Subkategori (Lengkap dengan tambahan data)
const subcategoryMap: Record<string, {label: string, value: string}[]> = {
  infaq: [
    { label: 'Dana Umum', value: 'dana_umum' }
  ],
  program: [
    { label: 'Dhuafa', value: 'dhuafa' },
    { label: 'Dakwah', value: 'dakwah' },
    { label: 'Pendidikan', value: 'pendidikan' },
    { label: 'Kesehatan', value: 'kesehatan' },
    { label: 'Tanggap Bencana', value: 'tanggap_bencana' },
    { label: 'Kemanusiaan', value: 'kemanusiaan' },
    { label: 'Ekonomi & UMKM', value: 'ekonomi' },
    { label: 'Yatim / Piatu', value: 'yatim' },
  ],
  zakat: [
    { label: 'Mal', value: 'mal' },
    { label: 'Fitrah', value: 'fitrah' },
    { label: 'Penghasilan / Profesi', value: 'penghasilan' },
  ],
  waqaf: [
    { label: 'Tanah', value: 'tanah' },
    { label: 'Bangunan', value: 'bangunan' },
    { label: 'Uang', value: 'uang' },
    { label: 'Sumur / Air Bersih', value: 'sumur' },
    { label: 'Al-Qur\'an', value: 'alquran' },
  ],
  qurban: [
    { label: 'Kambing', value: 'kambing' },
    { label: 'Sapi', value: 'sapi' },
    { label: 'Domba', value: 'domba' },
    { label: 'Kerbau', value: 'kerbau' },
  ]
}

// 2. Buat computed property untuk memfilter subkategori sesuai kategori yang dipilih
const availableSubcategories = computed(() => {
  return subcategoryMap[form.kategori as keyof typeof subcategoryMap] || []
})

// 3. Watcher untuk me-reset nilai form.subkategori saat form.kategori berubah
watch(() => form.kategori, (newKategori) => {
  const newSubcats = subcategoryMap[newKategori as keyof typeof subcategoryMap]
  
  if (newSubcats && newSubcats.length > 0) {
    // Cek apakah subkategori saat ini masih valid di kategori baru
    const exists = newSubcats.some(s => s.value === form.subkategori)
    if (!exists) {
      // Jika tidak valid (beda kategori), otomatis pilih opsi pertama dari list subkategori baru
      form.subkategori = newSubcats[0].value
    }
  } else {
    form.subkategori = ''
  }
})

function submit() {
    // Jika target dana diubah ke 0 di tengah jalan, bersihkan tanggal selesai otomatis
    if (Number(form.target_dana) === 0) {
        form.tgl_selesai = ''
    }

    form.put(`/admin/donasi/${props.donasi.slug}`, {
        preserveScroll: true,
    })
}
</script>

<template>
    <Head :title="`Edit Donasi: ${props.donasi.judul}`" />
    
    <div class="py-10 px-4 w-full mx-auto">
        <!-- HEADER SECTION DENGAN DROPDOWN -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div class="flex items-center gap-4">
                <Link href="/admin/donasi" class="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-amber-600 transition-colors">
                    <ArrowLeft class="size-5" />
                </Link>
                <div>
                    <h1 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Edit Program Donasi</h1>
                    <p class="text-sm text-zinc-500">Perbarui rincian, kategori, atau target penggalangan dana.</p>
                </div>
            </div>

            <!-- DROPDOWN NAVIGASI ADMIN (KANAN ATAS) -->
            <div class="relative flex">
                <button type="button" @click="dropdownOpen = !dropdownOpen" @blur="setTimeout(() => dropdownOpen = false, 200)" class="ms-auto h-11 px-5 inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-200 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all">
                    <Settings class="size-4 text-zinc-400" />
                    <span>Kelola</span>
                    <ChevronDown class="size-4 text-zinc-400" :class="{ 'rotate-180': dropdownOpen }" />
                </button>
                <div v-if="dropdownOpen" class="absolute right-0 mt-12 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 py-2">
                    <div class="px-2"><span class="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 rounded-xl"><SquarePen class="size-4" />Edit Konten</span></div>
                    <div class="px-2"><Link :href="`/donasi/${donasi.slug}`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><Eye class="size-4 text-zinc-400" />Preview Publik</Link></div>
                    <div class="px-2"><Link :href="`/admin/donasi/${donasi.slug}/progress`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><Newspaper class="size-4 text-zinc-400" />Progress / Berita</Link></div>
                    <div class="px-2"><Link :href="`/admin/donasi/${donasi.slug}/reaksi`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><HeartHandshake class="size-4 text-zinc-400" />Reaksi / Emoticon</Link></div>
                    <div class="px-2"><Link :href="`/admin/donasi/${donasi.slug}/komentar`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><MessageSquare class="size-4 text-zinc-400" />Komentar & Doa</Link></div>
                    <div class="px-2"><Link :href="`/admin/donasi/${donasi.slug}/donasi-masuk`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><ArrowDownCircle class="size-4 text-emerald-500" />Donasi Masuk</Link></div>
                    <div class="px-2"><Link :href="`/admin/donasi/${donasi.slug}/tasyaruf`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><ArrowUpCircle class="size-4 text-amber-500" />Tasyaruf Keluar</Link></div>
                </div>
            </div>             
        </div>

        <form @submit.prevent="submit" class="space-y-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm">   

            <!-- Status Publikasi -->
            <div class="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div :class="form.is_published ? 'bg-blue-100 text-blue-600' : 'bg-zinc-200 text-zinc-500'" class="p-2 rounded-lg">
                            <Globe v-if="form.is_published" class="size-5" />
                            <Lock v-else class="size-5" />
                        </div>
                        <div>
                            <label for="is_published" class="text-sm font-bold cursor-pointer block">
                                {{ form.is_published ? 'Terbit (Publik)' : 'Draft (Privat)' }}
                            </label>
                            <p class="text-[11px] text-zinc-500">Tentukan visibilitas program ini bagi donatur.</p>
                        </div>
                    </div>
                    <input 
                        type="checkbox" 
                        id="is_published" 
                        v-model="form.is_published"
                        class="size-6 rounded-lg border-zinc-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                </div>
            </div>
            
            <!-- Judul & Slug -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                    <Label for="judul">Judul Program</Label>
                    <Input 
                        id="judul" 
                        v-model="form.judul" 
                        class="h-12 rounded-xl focus:ring-amber-500 font-semibold"
                        required
                    />
                    <div v-if="form.errors.judul" class="text-red-500 text-xs mt-1">{{ form.errors.judul }}</div>
                </div>
                <div class="space-y-2">
                    <Label for="slug">URL Slug</Label>
                    <Input 
                        id="slug" 
                        v-model="form.slug" 
                        class="h-12 rounded-xl focus:ring-amber-500"
                        required
                    />
                    <div v-if="form.errors.slug" class="text-red-500 text-xs mt-1">{{ form.errors.slug }}</div>
                </div>
            </div>

            <!-- Kategori, Subkategori, Tanggal & Target -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                    <Label for="kategori">Kategori</Label>
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
                    <!-- Ubah iterasi di sini -->
                    <option v-for="subcat in availableSubcategories" :key="subcat.value" :value="subcat.value">
                        {{ subcat.label }}
                    </option>
                    </select>
                </div>

                <!-- Tanggal Mulai -->
                <div class="space-y-2">
                    <Label for="tgl_mulai">Tanggal Mulai</Label>
                    <Input 
                        id="tgl_mulai" 
                        type="date"
                        v-model="form.tgl_mulai" 
                        class="h-11 rounded-xl focus-visible:ring-amber-500"
                    />
                    <div v-if="form.errors.tgl_mulai" class="text-red-500 text-xs mt-1">{{ form.errors.tgl_mulai }}</div>
                </div>

                <!-- Tanggal Selesai -->
                <div class="space-y-2">
                    <Label for="tgl_selesai">Tanggal Selesai (Batas Penggalangan)</Label>
                    <Input 
                        id="tgl_selesai" 
                        type="date"
                        v-model="form.tgl_selesai" 
                        class="h-11 rounded-xl focus-visible:ring-amber-500"
                        :disabled="Number(form.target_dana) === 0"
                    />
                    <p v-if="Number(form.target_dana) === 0" class="text-[11px] text-zinc-400 italic mt-1">
                        * Dinonaktifkan otomatis karena target dana bernilai 0 (Program Berkelanjutan).
                    </p>
                    <div v-if="form.errors.tgl_selesai" class="text-red-500 text-xs mt-1">{{ form.errors.tgl_selesai }}</div>
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
                            class="pl-10 h-11 rounded-xl focus:ring-amber-500"
                            required
                        />
                    </div>
                    <p class="text-[11px] leading-normal text-amber-600 dark:text-amber-400 font-medium mt-1">
                        * Jika diisi <span class="font-bold font-mono">0</span>, sistem otomatis menganggap program ini sebagai <span class="font-bold underline">Donasi Rutin / Tanpa Batas Target</span>.
                    </p>
                    <div v-if="form.errors.target_dana" class="text-red-500 text-xs mt-1">{{ form.errors.target_dana }}</div>
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
                <div v-if="form.errors.panduan_donasi" class="text-red-500 text-xs mt-1">{{ form.errors.panduan_donasi }}</div>
            </div>

            <!-- Rich Editor -->
            <div class="space-y-2">
                <Label>Deskripsi Lengkap</Label>
                <TiptapEditor v-model="form.body" />
                <div v-if="form.errors.body" class="text-red-500 text-xs mt-1">{{ form.errors.body }}</div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-zinc-100 dark:border-zinc-800 gap-4">
                <p class="text-xs text-zinc-400 italic">Formulir Manajemen Pembaruan Sistem</p>
                
                <div class="flex gap-3 w-full md:w-auto">
                    <Link href="/admin/donasi" class="flex-1 md:flex-none text-center px-6 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        Batal
                    </Link>
                    <Button 
                        type="submit" 
                        class="flex-1 md:flex-none bg-amber-600 hover:bg-amber-700 text-white px-8 h-11 rounded-xl font-bold gap-2 shadow-lg shadow-amber-500/20"
                        :disabled="form.processing"
                    >
                        <Save class="size-4" />
                        {{ form.processing ? 'Menyimpan...' : 'Simpan Perubahan' }}
                    </Button>
                </div>
            </div>

        </form>
    </div>
</template>