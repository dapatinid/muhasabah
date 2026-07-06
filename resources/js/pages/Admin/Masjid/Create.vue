<script setup lang="ts">
import { ref } from 'vue'
import { Head, useForm, Link } from '@inertiajs/vue3'
import { ArrowLeft, Save } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import TiptapEditor from '@/components/TiptapEditor.vue' 

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Masjid', href: '/admin/masjid' },
            { title: 'Tambah Baru', href: '/admin/masjid/create' },
        ],
    },
});

const form = useForm({
  nama: '',
  jenis: 'masjid',
  kontak: '',
  alamat: '',
  deskripsi: '',
  logo: null,   // Ubah string kosong jadi null
  sampul: null, // Ubah string kosong jadi null
})

const categories = [
  { label: 'Masjid', value: 'masjid' },
  { label: 'Mushola', value: 'mushola' },
]

// State untuk menampilkan gambar (Preview)
const logoPreview = ref(null)
const sampulPreview = ref(null)

// Fungsi handle upload
function handleLogoUpload(e) {
    const file = e.target.files[0]
    form.logo = file
    logoPreview.value = URL.createObjectURL(file)
}

function handleSampulUpload(e) {
    const file = e.target.files[0]
    form.sampul = file
    sampulPreview.value = URL.createObjectURL(file)
}

function submit() {
  form.post('/admin/masjid')
}
</script>

<template>
    <Head title="Tambah Masjid Baru" />

    <div class="p-6">
        <div class="mb-6 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <Link href="/admin/masjid" class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-500 transition-colors">
                    <ArrowLeft class="size-5" />
                </Link>
                <div>
                    <h1 class="text-xl font-bold text-zinc-900 dark:text-white">Tambah Masjid</h1>
                    <p class="text-xs text-zinc-500 mt-0.5">Buat entitas masjid kemaslahatan baru.</p>
                </div>
            </div>
        </div>

        <form @submit.prevent="submit">
            <div class="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-6">

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div class="space-y-2">
                    <Label>Logo (Opsional)</Label>
                    <div class="flex items-center gap-4">
                        <div class="shrink-0 size-16 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 overflow-hidden flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/50">
                            <img v-if="logoPreview" :src="logoPreview" class="w-full h-full object-cover" />
                            <span v-else class="text-xs text-zinc-400">Logo</span>
                        </div>
                        <div class="flex-1">
                            <Input type="file" accept="image/*" @change="handleLogoUpload" class="h-10 cursor-pointer" />
                            <p class="text-[10px] text-zinc-500 mt-1">Maks 2MB. Format: JPG, PNG, WEBP.</p>
                        </div>
                    </div>
                    <div v-if="form.errors.logo" class="text-red-500 text-xs">{{ form.errors.logo }}</div>
                </div>

                <div class="space-y-2">
                    <Label>Sampul (Opsional)</Label>
                    <div class="flex items-center gap-4">
                        <div class="shrink-0 w-24 h-16 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 overflow-hidden flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/50">
                            <img v-if="sampulPreview" :src="sampulPreview" class="w-full h-full object-cover" />
                            <span v-else class="text-xs text-zinc-400">Sampul</span>
                        </div>
                        <div class="flex-1">
                            <Input type="file" accept="image/*" @change="handleSampulUpload" class="h-10 cursor-pointer" />
                        </div>
                    </div>
                    <div v-if="form.errors.sampul" class="text-red-500 text-xs">{{ form.errors.sampul }}</div>
                </div>
            </div>                

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-2">
                    <Label for="nama">Nama Masjid</Label>
                    <Input id="nama" v-model="form.nama" placeholder="Masukkan nama masjid..." required />
                    <div v-if="form.errors.nama" class="text-red-500 text-xs mt-1">{{ form.errors.nama }}</div>
                </div>

                <div class="space-y-2">
                    <Label for="jenis">Jenis Masjid</Label>
                    <select 
                        id="jenis" 
                        v-model="form.jenis"
                        class="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 text-zinc-900 dark:text-zinc-100"
                    >
                        <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                            {{ cat.label }}
                        </option>
                    </select>
                    <div v-if="form.errors.jenis" class="text-red-500 text-xs mt-1">{{ form.errors.jenis }}</div>
                </div>
            </div>

            <div class="space-y-2">
                <Label for="kontak">Kontak / No. WA PJ</Label>
                <Input id="kontak" v-model="form.kontak" placeholder="Contoh: 085950540055" />
                <div v-if="form.errors.kontak" class="text-red-500 text-xs mt-1">{{ form.errors.kontak }}</div>
            </div>

            <div class="space-y-2">
                <Label for="alamat">Alamat Lengkap</Label>
                <textarea 
                    id="alamat" 
                    v-model="form.alamat" 
                    rows="3"
                    placeholder="Tuliskan alamat sekretariat atau pusat kegiatan..."
                    class="flex w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 text-zinc-900 dark:text-zinc-100"
                ></textarea>
                <div v-if="form.errors.alamat" class="text-red-500 text-xs mt-1">{{ form.errors.alamat }}</div>
            </div>
            </div>

            <div class="space-y-2 mt-7">
                <Label>Deskripsi Masjid</Label>
                <TiptapEditor v-model="form.deskripsi" />
                <div v-if="form.errors.deskripsi" class="text-red-500 text-xs mt-1">{{ form.errors.deskripsi }}</div>
            </div>

            <div class="flex justify-end gap-3 mt-4">
                <Link href="/admin/masjid" class="px-6 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-bold hover:bg-zinc-50 transition-colors dark:text-zinc-300">
                    Batal
                </Link>
                <Button 
                    type="submit" 
                    class="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-11 rounded-xl font-bold gap-2"
                    :disabled="form.processing"
                >
                    <Save class="size-4" />
                    {{ form.processing ? 'Menyimpan...' : 'Simpan' }}
                </Button>
            </div>
        </form>
        
    </div>
</template>