<script setup lang="ts">
import { Head, useForm, Link } from '@inertiajs/vue3'
import TiptapEditor from '@/components/TiptapEditor.vue'
import { 
    ArrowLeft, Save, ChevronDown, Settings, HeartHandshake, 
    MessageSquare, ArrowDownCircle, ArrowUpCircle, Eye, SquarePen, Info, 
    Newspaper, Ticket
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ref } from 'vue'

const props = defineProps<{
    acara: {
        id: number;
        slug: string;
        judul: string;
        progress: string | null;
    }
}>();

const dropdownOpen = ref(false)
const editorKey = ref(Date.now())

const form = useForm({
    konten_progress: props.acara.progress ?? '', 
})

function submit() {
    form
      .transform((data) => ({
          progress: data.konten_progress,
      }))
      .put(`/admin/acara/${props.acara.slug}/progress`, {
          preserveScroll: true,
          onSuccess: (page) => {
              form.konten_progress = page.props.acara.progress ?? '';
              form.defaults({ konten_progress: form.konten_progress });
              editorKey.value = Date.now();
          }
      })
}
</script>

<template>
    <Head :title="`Update Progress: ${props.acara.judul}`" />
    
    <div class="py-10 px-4 w-full mx-auto max-w-5xl">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div class="flex items-center gap-4">
                <Link href="/admin/acara" class="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-indigo-600 transition-colors">
                    <ArrowLeft class="size-5" />
                </Link>
                <div>
                    <h1 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Update Progress</h1>
                    <p class="text-sm text-zinc-500">Sampaikan kabar terbaru, laporan berkala, atau perubahan jalannya agenda acara.</p>
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
                    <span>Kelola Acara</span>
                    <ChevronDown class="size-4 text-zinc-400" :class="{ 'rotate-180': dropdownOpen }" />
                </button>
                <div v-if="dropdownOpen" class="absolute right-0 mt-12 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 py-2">
                    <div class="px-2">
                        <Link :href="`/admin/acara/${acara.slug}/edit`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl">
                            <SquarePen class="size-4 text-zinc-400" />Edit Konten
                        </Link>
                    </div>
                    <div class="px-2">
                        <Link :href="`/acara/${acara.slug}`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl">
                            <Eye class="size-4 text-zinc-400" />Preview Publik
                        </Link>
                    </div>
                    <div class="px-2">
                        <span class="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl">
                            <Newspaper class="size-4" />Progress / Berita
                        </span>
                    </div>
                    <div class="px-2">
                        <Link :href="`/admin/acara/${acara.slug}/reaksi`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl">
                            <HeartHandshake class="size-4 text-zinc-400" />Reaksi / Emoticon
                        </Link>
                    </div>
                    <div class="px-2">
                        <Link :href="`/admin/acara/${acara.slug}/komentar?tab=doa_transaksi`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl">
                            <MessageSquare class="size-4 text-zinc-400" />Komentar & Doa
                        </Link>
                    </div>
                    <div class="px-2">
                        <Link :href="`/admin/acara/${acara.slug}/keuangan`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl">
                            <Ticket class="size-4 text-indigo-500" />Buku Kas Keuangan
                        </Link>
                    </div>
                </div>
            </div>             
        </div>

        <form @submit.prevent="submit" class="space-y-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm">   
            
            <div class="flex items-start gap-3 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-sm">
                <Info class="size-5 shrink-0 mt-0.5" />
                <div class="space-y-1">
                    <p class="font-bold">Informasi Tampilan Halaman Publik</p>
                    <p class="opacity-90 text-xs leading-relaxed text-indigo-700 dark:text-indigo-300">
                        Tulisan yang Anda masukkan di sini akan menggantikan kabar bawaan sistem pada tab <strong>Maklumat/Berita Terbaru</strong> di halaman detail acara publik.
                    </p>
                </div>
            </div>

            <div class="space-y-2">
                <Label>Isi Progress / Berita Acara Terbaru</Label>
                <TiptapEditor :key="editorKey" v-model="form.konten_progress" />
                
                <div v-if="form.errors.progress" class="text-red-500 text-xs mt-1">
                    {{ form.errors.progress }}
                </div>
            </div>

            <div class="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-zinc-100 dark:border-zinc-800 gap-4">
                <p class="text-xs text-zinc-400 italic">Formulir Manajemen Pembaruan Berita</p>
                
                <div class="flex gap-3 w-full md:w-auto">
                    <Link href="/admin/acara" class="flex-1 md:flex-none text-center px-6 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        Batal
                    </Link>
                    <Button 
                        type="submit" 
                        class="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-11 rounded-xl font-bold gap-2 shadow-lg shadow-indigo-500/20"
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