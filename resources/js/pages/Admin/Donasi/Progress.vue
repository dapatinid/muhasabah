<script setup lang="ts">
import { Head, useForm, Link } from '@inertiajs/vue3'
import TiptapEditor from '@/components/TiptapEditor.vue'
import { 
    ArrowLeft, Save, ChevronDown, Settings, HeartHandshake, 
    MessageSquare, ArrowDownCircle, ArrowUpCircle, Eye, SquarePen, Info, 
    Newspaper
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ref } from 'vue'

const props = defineProps<{
    donasi: {
        id: number;
        slug: string;
        judul: string;
        progress: string | null;
    }
}>();

const dropdownOpen = ref(false)

// 1. Tambahkan key unik untuk mengontrol siklus hidup Tiptap
// ... (import tetap sama)
const editorKey = ref(Date.now())

// 1. Ganti nama variabel agar tidak bentrok dengan bawaan Inertia
const form = useForm({
    konten_progress: props.donasi.progress ?? '', 
})

function submit() {
    form
      // 2. Transformasi data sebelum dikirim: ubah 'konten_progress' kembali jadi 'progress'
      .transform((data) => ({
          progress: data.konten_progress,
      }))
      .put(`/admin/donasi/${props.donasi.slug}/progress`, {
          preserveScroll: true,
          onSuccess: (page) => {
              // 3. Update kembali dengan data terbaru dari server
              form.konten_progress = page.props.donasi.progress ?? '';
              form.defaults({ konten_progress: form.konten_progress });
              
              editorKey.value = Date.now();
          }
      })
}
</script>

<template>
    <Head :title="`Update Progress: ${props.donasi.judul}`" />
    
    <div class="py-10 px-4 w-full mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div class="flex items-center gap-4">
                <div>
                    <h1 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Update Progress</h1>
                    <p class="text-sm text-zinc-500">Sampaikan kabar terbaru, laporan kegiatan, atau progres penyaluran.</p>
                </div>
            </div>

            <div class="relative flex">
                <button 
                    type="button" 
                    @click="dropdownOpen = !dropdownOpen" 
                    @blur="setTimeout(() => dropdownOpen = false, 200)" 
                    class="ms-auto h-11 px-5 inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-200 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all"
                >
                    <Settings class="size-4 text-zinc-400" />
                    <span>Kelola</span>
                    <ChevronDown class="size-4 text-zinc-400" :class="{ 'rotate-180': dropdownOpen }" />
                </button>
                <div v-if="dropdownOpen" class="absolute right-0 mt-12 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 py-2">
                    <div class="px-2">
                        <Link :href="`/admin/donasi/${donasi.slug}/edit`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl">
                            <SquarePen class="size-4 text-zinc-400" />Edit Konten
                        </Link>
                    </div>
                    <div class="px-2">
                        <Link :href="`/donasi/${donasi.slug}`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl">
                            <Eye class="size-4 text-zinc-400" />Preview Publik
                        </Link>
                    </div>
                    <div class="px-2"><span class="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 rounded-xl"><Newspaper class="size-4" />Progress / Berita</span></div>
                    <div class="px-2">
                        <Link :href="`/admin/donasi/${donasi.slug}/reaksi`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl">
                            <HeartHandshake class="size-4 text-zinc-400" />Reaksi / Emoticon
                        </Link>
                    </div>
                    <div class="px-2">
                        <Link :href="`/admin/donasi/${donasi.slug}/komentar`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl">
                            <MessageSquare class="size-4 text-zinc-400" />Komentar & Doa
                        </Link>
                    </div>
                    <div class="px-2">
                        <Link :href="`/admin/donasi/${donasi.slug}/donasi-masuk`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl">
                            <ArrowDownCircle class="size-4 text-emerald-500" />Donasi Masuk
                        </Link>
                    </div>
                    <div class="px-2">
                        <Link :href="`/admin/donasi/${donasi.slug}/tasyaruf`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl">
                            <ArrowUpCircle class="size-4 text-amber-500" />Tasyaruf Keluar
                        </Link>
                    </div>
                </div>
            </div>             
        </div>

        <form @submit.prevent="submit" class="space-y-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm">   
            
            <div class="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50 text-amber-600 dark:text-amber-400 text-sm">
                <Info class="size-5 shrink-0 mt-0.5" />
                <div class="space-y-1">
                    <p class="font-bold">Informasi Tampilan Halaman Publik</p>
                    <p class="opacity-90 text-xs leading-relaxed text-amber-700 dark:text-amber-300">
                        Tulisan yang Anda masukkan di sini akan menggantikan tampilan "Belum ada berita" pada tab <strong>Berita</strong> di halaman donasi publik.
                    </p>
                </div>
            </div>

            <div class="space-y-2">
                <Label>Isi Progress / Berita</Label>
                <TiptapEditor :key="editorKey" v-model="form.konten_progress" />
                
                <div v-if="form.errors.progress" class="text-red-500 text-xs mt-1">
                    {{ form.errors.progress }}
                </div>
            </div>

            <div class="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-zinc-100 dark:border-zinc-800 gap-4">
                <p class="text-xs text-zinc-400 italic">Formulir Manajemen Pembaruan Berita</p>
                
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
                        {{ form.processing ? 'Menyimpan...' : 'Simpan Progress' }}
                    </Button>
                </div>
            </div>

        </form>
    </div>
</template>