<script setup lang="ts">
import { Head, useForm, Link, router } from '@inertiajs/vue3'
import { ref } from 'vue'
import { ArrowLeft, Save, ImagePlus, Loader2, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const props = defineProps<{
    banner: {
        id: number;
        title: string;
        subtitle: string;
        image: string;
        link: string;
        priority: number;
        is_active: boolean | number;
    },
    breadcrumbs: any,
}>();

const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)

// Inisialisasi form dengan data yang ada dari props
const form = useForm({
    title: props.banner.title,
    subtitle: props.banner.subtitle || '',
    image: props.banner.image,
    link: props.banner.link || '',
    priority: props.banner.priority,
    is_active: Boolean(props.banner.is_active),
})

// Trigger input file
function triggerFile() {
    fileInput.value?.click()
}

// Handle Re-upload Gambar
function handleUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return

    isUploading.value = true
    
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
    form.put(`/admin/banner/${props.banner.id}`, {
        preserveScroll: true,
    })
}
</script>

<template>
    <Head :title="`Edit Banner: ${props.banner.title}`" />

    <div class="py-10 px-4 max-w-4xl mx-auto">
        
        <!-- HEADER -->
        <div class="flex items-center gap-4 mb-8">
            <Link href="/admin/banner" class="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-amber-600 transition-colors">
                <ArrowLeft class="size-5" />
            </Link>
            <div>
                <h1 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Edit Banner</h1>
                <p class="text-sm text-zinc-500">Perbarui visual atau pesan jumbotron Anda.</p>
            </div>
        </div>

        <form @submit.prevent="submit" class="space-y-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm">
            
            <!-- UPLOAD AREA (PREVIEW & EDIT) -->
            <div class="space-y-3">
                <Label>Gambar Banner</Label>
                
                <div class="relative group rounded-3xl overflow-hidden h-64 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/50">
                    <img :src="form.image" class="w-full h-full object-cover" />
                    
                    <!-- Overlay saat di-hover -->
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                        <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleUpload" />
                        
                        <div v-if="isUploading" class="flex flex-col items-center gap-2">
                            <Loader2 class="size-8 text-white animate-spin" />
                            <p class="text-xs text-white">Sedang mengunggah...</p>
                        </div>
                        
                        <div v-else class="flex gap-2">
                            <button type="button" @click="triggerFile" class="bg-white text-black px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg">
                                <ImagePlus class="size-4" /> Ganti Gambar
                            </button>
                        </div>
                    </div>
                </div>
                <div v-if="form.errors.image" class="text-red-500 text-xs mt-1">{{ form.errors.image }}</div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Kolom Kiri -->
                <div class="space-y-6">
                    <div class="space-y-2">
                        <Label for="title">Judul Utama (Headline)</Label>
                        <Input id="title" v-model="form.title" placeholder="Masukkan judul..." class="rounded-xl h-11 focus:ring-amber-500" required />
                        <div v-if="form.errors.title" class="text-red-500 text-xs">{{ form.errors.title }}</div>
                    </div>

                    <div class="space-y-2">
                        <Label for="subtitle">Sub Judul (Keterangan)</Label>
                        <Input id="subtitle" v-model="form.subtitle" placeholder="Penjelasan singkat..." class="rounded-xl h-11 focus:ring-amber-500" />
                        <div v-if="form.errors.subtitle" class="text-red-500 text-xs">{{ form.errors.subtitle }}</div>
                    </div>
                </div>

                <!-- Kolom Kanan -->
                <div class="space-y-6">
                    <div class="space-y-2">
                        <Label for="link">Link Tujuan (Opsional)</Label>
                        <Input id="link" v-model="form.link" placeholder="https://..." class="rounded-xl h-11 focus:ring-amber-500" />
                        <div v-if="form.errors.link" class="text-red-500 text-xs">{{ form.errors.link }}</div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label for="priority">Urutan (Priority)</Label>
                            <Input id="priority" type="number" v-model="form.priority" class="rounded-xl h-11 focus:ring-amber-500" />
                            <div v-if="form.errors.priority" class="text-red-500 text-xs">{{ form.errors.priority }}</div>
                        </div>
                        
                        <div class="space-y-2">
                            <Label>Status Tampil</Label>
                            <div class="flex items-center gap-3 h-11 px-1">
                                <input 
                                    type="checkbox" 
                                    v-model="form.is_active" 
                                    class="size-5 rounded border-zinc-300 text-amber-600 focus:ring-amber-500 cursor-pointer" 
                                />
                                <span class="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                                    {{ form.is_active ? 'Aktif' : 'Non-Aktif' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ACTION -->
            <div class="flex justify-between items-center pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <p class="text-xs text-zinc-400 italic">* Perubahan akan langsung tampil di halaman beranda.</p>
                
                <div class="flex gap-3">
                    <Link href="/admin/banner" class="px-6 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                        Batal
                    </Link>
                    <Button 
                        type="submit" 
                        class="bg-amber-600 hover:bg-amber-700 text-white px-8 h-11 rounded-xl font-bold gap-2 shadow-lg shadow-amber-500/20"
                        :disabled="form.processing || isUploading"
                    >
                        <Save class="size-4" />
                        {{ form.processing ? 'Menyimpan...' : 'Simpan Perubahan' }}
                    </Button>
                </div>
            </div>

        </form>
    </div>
</template>