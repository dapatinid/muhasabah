<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { Head, useForm, Link } from '@inertiajs/vue3'
import TiptapEditor from '@/Components/TiptapEditor.vue'
import { ArrowLeft, Save } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const props = defineProps<{
    kalam: {
        id: number;
        slug: string;
        judul: string;
        body: string;
        kategori: string;
        is_anonymous: boolean | number;
    }
}>();

// Inisialisasi form dengan data yang ada dari props
const form = useForm({
    judul: props.kalam.judul,
    body: props.kalam.body,
    kategori: props.kalam.kategori,
    // Kita pastikan menjadi boolean karena checkbox butuh boolean
    is_anonymous: Boolean(props.kalam.is_anonymous),
})

const categories = [
    { label: 'Hikmah', value: 'hikmah' },
    { label: 'Doa', value: 'doa' },
    { label: 'Kisah', value: 'kisah' },
    { label: 'Tips & Trik', value: 'tips' },
    { label: 'Berita', value: 'berita' },
]

function submit() {
    // Menggunakan metode PUT untuk update data
    form.put(`/kalam/${props.kalam.slug}`, {
        preserveScroll: true,
    })
}

const breadcrumbs = [
    { title: 'Kalam', href: '/kalam' },
    { title: 'Edit Kalam', href: `/kalam/${props.kalam.slug}/edit` }
]
</script>

<template>
    <Head :title="`Edit: ${props.kalam.judul}`" />
        <div class="py-10 px-4 max-w-4xl mx-auto">
            
            <div class="flex items-center gap-4 mb-8">
                <Link href="/kalam" class="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 transition-colors">
                    <ArrowLeft class="size-5" />
                </Link>
                <div>
                    <h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Edit Kalam</h1>
                    <p class="text-sm text-slate-500">Sesuaikan hikmah yang telah Anda bagikan.</p>
                </div>
            </div>

            <form @submit.prevent="submit" class="space-y-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm">
                
                <div class="space-y-2">
                    <Label for="judul">Judul Kalam</Label>
                    <Input 
                        id="judul" 
                        v-model="form.judul" 
                        placeholder="Masukkan judul..." 
                        class="text-lg font-semibold h-12 rounded-xl focus:ring-emerald-500"
                        required
                    />
                    <div v-if="form.errors.judul" class="text-red-500 text-xs mt-1">{{ form.errors.judul }}</div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <Label for="kategori">Kategori Konten</Label>
                        <select 
                            id="kategori"
                            v-model="form.kategori"
                            class="w-full h-11 rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                        >
                            <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                                {{ cat.label }}
                            </option>
                        </select>
                        <div v-if="form.errors.kategori" class="text-red-500 text-xs mt-1">{{ form.errors.kategori }}</div>
                    </div>

                    <div class="flex items-center space-x-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                        <input 
                            type="checkbox" 
                            id="is_anonymous" 
                            v-model="form.is_anonymous"
                            class="size-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <div class="grid gap-1.5 leading-none">
                            <label for="is_anonymous" class="text-sm font-medium leading-none cursor-pointer text-slate-700 dark:text-slate-300">
                                Posting sebagai Hamba Allah
                            </label>
                            <p class="text-[11px] text-slate-500">Identitas Anda akan disembunyikan jika opsi ini aktif.</p>
                        </div>
                    </div>
                </div>

                <div class="space-y-2">
                    <div class="flex justify-between items-center">
                        <Label>Isi Kalam</Label>
                        <span class="text-[10px] text-slate-400 italic">Terakhir diubah: {{ new Date().toLocaleTimeString() }}</span>
                    </div>
                    <TiptapEditor v-model="form.body" />
                    <div v-if="form.errors.body" class="text-red-500 text-xs mt-1">{{ form.errors.body }}</div>
                </div>

                <div class="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-800">
                    <p class="text-xs text-slate-400 italic">* Perubahan akan langsung diterbitkan setelah Anda menekan tombol simpan.</p>
                    
                    <div class="flex gap-3">
                        <Link href="/kalam" class="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors">
                            Batal
                        </Link>
                        <Button 
                            type="submit" 
                            class="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-11 rounded-xl font-bold gap-2 shadow-lg shadow-emerald-500/20"
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