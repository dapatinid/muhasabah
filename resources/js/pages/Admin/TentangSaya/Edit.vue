<script setup lang="ts">
import { Head, useForm, Link, router } from '@inertiajs/vue3'
import TiptapEditor from '@/components/TiptapEditor.vue'
import { ArrowLeft, Save, UserCheck, FileText, RefreshCw } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { ref } from 'vue'

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Tentang Saya', href: '/admin/tentang-saya' },
        ],
    },
});

// Definisikan props untuk menerima data user dan tentangSaya yang sudah ada dari controller
const props = defineProps<{
    auth: {
        user: {
            id: number;
            name: string;
            // Jika relasi tentangSaya ikut di-load dari backend
            tentang_saya?: {
                autobiografi: string | null;
            } | null;
        }
    },
    // Atau jika Anda mengirimkannya sebagai prop terpisah dari controller
    tentangSaya?: {
        autobiografi: string | null;
    } | null;
}>();

// Menentukan nilai awal autobiografi (cek dari prop terpisah atau dari objek auth.user)
const initialAutobiografi = props.tentangSaya?.autobiografi 
    || props.auth.user.tentang_saya?.autobiografi 
    || '';

// Inisialisasi useForm Inertia
const form = useForm({
    autobiografi: initialAutobiografi,
})

function submit() {
    form.post('/admin/tentang-saya', { // Sesuaikan dengan URL di web.php
        preserveScroll: true,
        onSuccess: () => {
            // Logika sukses
        },
    })
}
</script>

<template>
    <Head title="Tentang Saya - Autobiografi" />

    <div class="px-4 py-8 space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
            <div class="flex items-center gap-3">
                <div class="p-3 bg-amber-500/10 text-amber-600 rounded-2xl">
                    <UserCheck class="size-6" />
                </div>
                <div>
                    <h1 class="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Pengaturan Profil</h1>
                    <p class="text-xs text-zinc-500 dark:text-zinc-400">Kelola informasi riwayat hidup dan autobiografi Anda</p>
                </div>
            </div>

        </div>

        <form @submit.prevent="submit" class="bg-white dark:bg-zinc-900 space-y-6">
            
            <div class="flex gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <FileText class="size-5 text-amber-600 shrink-0 mt-0.5" />
                <div class="space-y-1">
                    <h4 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">Format Rich Editor</h4>
                    <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        Tuliskan riwayat hidup atau autobiografi Anda secara lengkap. Anda dapat menyisipkan format teks, tautan, maupun gambar melalui editor di bawah ini. Informasi ini akan ditampilkan di halaman profil publik Anda.
                    </p>
                </div>
            </div>

            <div class="space-y-2">
                <label class="text-sm font-bold tracking-tight text-zinc-800 dark:text-zinc-200">
                    Autobiografi / Riwayat Hidup
                </label>
                
                <TiptapEditor 
                        v-model="form.autobiografi" 
                        upload-url="/admin/tentang-saya/upload-image" 
                    />
                
                <div v-if="form.errors.autobiografi" class="text-red-500 text-xs mt-1 font-medium">
                    {{ form.errors.autobiografi }}
                </div>
            </div>

            <div class="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-zinc-100 dark:border-zinc-800 gap-4">
                <p class="text-xs text-zinc-400 italic">
                    Terakhir diperbarui: {{ props.tentangSaya ? 'Sudah dikonfigurasi' : 'Belum ada data' }}
                </p>
                
                <div class="flex gap-3 w-full md:w-auto">
                    <Link 
                        href="/admin/dashboard" 
                        class="flex-1 md:flex-none text-center px-6 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors dark:text-zinc-300"
                    >
                        Batal
                    </Link>
                    
                    <Button 
                        type="submit" 
                        class="flex-1 md:flex-none bg-amber-600 hover:bg-amber-700 text-white px-8 h-11 rounded-xl font-bold gap-2 shadow-lg shadow-amber-500/20 transition-all"
                        :disabled="form.processing"
                    >
                        <RefreshCw v-if="form.processing" class="size-4 animate-spin" />
                        <Save v-else class="size-4" />
                        {{ form.processing ? 'Menyimpan...' : 'Simpan Perubahan' }}
                    </Button>
                </div>
            </div>

        </form>
    </div>
</template>