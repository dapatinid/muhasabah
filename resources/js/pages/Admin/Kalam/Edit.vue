<script setup lang="ts">
import { Head, useForm, Link, usePage } from '@inertiajs/vue3'
import TiptapEditor from '@/components/TiptapEditor.vue'
import { ArrowLeft, Globe, Lock, Save } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const page = usePage();
const user = page.props.auth.user;

const props = defineProps<{
    kalam: {
        id: number;
        slug: string;
        judul: string;
        body: string;
        kategori: string;
        is_anonymous: boolean | number;
        is_published: boolean | number;
    },
    breadcrumbs: any,
}>();

// Inisialisasi form dengan data yang ada dari props
const form = useForm({
    judul: props.kalam.judul,
    slug: props.kalam.slug,
    body: props.kalam.body,
    kategori: props.kalam.kategori,
    // Kita pastikan menjadi boolean karena checkbox butuh boolean
    is_anonymous: Boolean(props.kalam.is_anonymous),
    is_published: Boolean(props.kalam.is_published),
})

const categories = [
    { label: 'Hikmah', value: 'hikmah' },
    { label: 'Doa', value: 'doa' },
    { label: 'Kisah', value: 'kisah' },
    { label: 'Tips & Trik', value: 'tips' },
    { label: 'Berita', value: 'berita' },
]

function submit() {
  form.put(`/admin/kalam/${props.kalam.slug}`, {
    preserveScroll: true,
  })
}

</script>

<template>
    <Head :title="`Edit: ${props.kalam.judul}`" />
        <div class="py-10 px-4 max-w-4xl mx-auto">
            
            <div class="flex items-center gap-4 mb-8">
                <Link href="/admin/kalam" class="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 transition-colors">
                    <ArrowLeft class="size-5" />
                </Link>
                <div>
                    <h1 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Edit Kalam</h1>
                    <p class="text-sm text-zinc-500">Sesuaikan hikmah yang telah Anda bagikan.</p>
                </div>
            </div>

            <form @submit.prevent="submit" class="space-y-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm">

                <!-- Status Publikasi -->
                <div v-if="user.level === 'Super Admin'" class="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
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
                                <p class="text-[11px] text-zinc-500">Tentukan visibilitas program ini bagi pembaca.</p>
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
                <div class="space-y-2">
                    <Label for="slug">Slug</Label>
                    <Input 
                        id="slug" 
                        v-model="form.slug" 
                        placeholder="Masukkan slug..." 
                        class="text-lg font-semibold h-12 rounded-xl focus:ring-emerald-500"
                        required
                    />
                    <div v-if="form.errors.slug" class="text-red-500 text-xs mt-1">{{ form.errors.slug }}</div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <div v-if="form.errors.kategori" class="text-red-500 text-xs mt-1">{{ form.errors.kategori }}</div>
                    </div>

                    <div class="flex items-center space-x-3 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                        <input 
                            type="checkbox" 
                            id="is_anonymous" 
                            v-model="form.is_anonymous"
                            class="size-5 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <div class="grid gap-1.5 leading-none">
                            <label for="is_anonymous" class="text-sm font-medium leading-none cursor-pointer text-zinc-700 dark:text-zinc-300">
                                Posting sebagai Hamba Allah
                            </label>
                            <p class="text-[11px] text-zinc-500">Identitas Anda akan disembunyikan jika opsi ini aktif.</p>
                        </div>
                    </div>
                </div>

                <div class="space-y-2">
                    <div class="flex justify-between items-center">
                        <Label>Isi Kalam</Label>
                        <span class="text-[10px] text-zinc-400 italic">Terakhir diubah: {{ new Date().toLocaleTimeString() }}</span>
                    </div>
                    <TiptapEditor v-model="form.body" />
                    <div v-if="form.errors.body" class="text-red-500 text-xs mt-1">{{ form.errors.body }}</div>
                </div>

                <div class="flex justify-between items-center pt-6 border-t border-zinc-100 dark:border-zinc-800">
                    <p class="text-xs text-zinc-400 italic">* Perubahan akan langsung diterbitkan setelah Anda menekan tombol simpan.</p>
                    
                    <div class="flex gap-3">
                        <Link href="/admin/kalam" class="px-6 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-bold hover:bg-secondary transition-colors">
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