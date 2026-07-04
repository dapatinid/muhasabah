<script setup lang="ts">
import { ref } from 'vue'
import { Head, Link, router } from '@inertiajs/vue3'
import { 
    ArrowLeft, Settings, ChevronDown, HeartHandshake, 
    MessageSquare, ArrowDownCircle, ArrowUpCircle, 
    MessageCircleOff, Eye, Landmark, MessageSquareText, 
    SquarePen, Newspaper, Ticket
} from 'lucide-vue-next'

const props = defineProps<{
    acara: { id: number; judul: string; slug: string };
    paymentsNotes: { data: Array<any>; links: Array<any> }; // Sesuai dari AcaraController
    komentarsPublik: { data: Array<any>; links: Array<any> }; // Sesuai dari AcaraController
    currentTab: string;
}>()

const dropdownOpen = ref(false)
const activeTab = ref(props.currentTab || 'doa_transaksi')

// Helper navigasi paginasi khusus tanpa merusak state tab aktif
const switchTab = (tabName: string) => {
    activeTab.value = tabName
    router.get(`/admin/acara/${props.acara.slug}/komentar`, 
        { tab: tabName }, 
        { preserveState: true, preserveScroll: true }
    )
}

const goToPagination = (url: string | null) => {
    if (!url) return
    router.get(url, {}, { preserveState: true, preserveScroll: true })
}
</script>

<template>
    <Head :title="`Komentar & Catatan: ${acara.judul}`" />
    
    <div class="py-10 px-4 w-full mx-auto space-y-6 max-w-5xl">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
                <div>
                    <h1 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Feedback Pengunjung</h1>
                    <p class="text-sm text-zinc-500">Tinjau kumpulan doa, testimoni publik, dan catatan khusus dari slip transaksi masuk.</p>
                </div>
            </div>

            <div class="relative flex">
                <button type="button" @click="dropdownOpen = !dropdownOpen" @blur="setTimeout(() => dropdownOpen = false, 200)" class="ms-auto h-11 px-5 inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-200 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all">
                    <Settings class="size-4 text-zinc-400" />
                    <span>Kelola Acara</span>
                    <ChevronDown class="size-4 text-zinc-400" :class="{ 'rotate-180': dropdownOpen }" />
                </button>
                <div v-if="dropdownOpen" class="absolute right-0 mt-12 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 py-2">
                    <div class="px-2"><Link :href="`/admin/acara/${acara.slug}/edit`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><SquarePen class="size-4 text-zinc-400" />Edit Konten</Link></div>
                    <div class="px-2"><Link :href="`/acara/${acara.slug}`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><Eye class="size-4 text-zinc-400" />Preview Publik</Link></div>
                    <div class="px-2"><Link :href="`/admin/acara/${acara.slug}/progress`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><Newspaper class="size-4 text-zinc-400" />Progress / Berita</Link></div>
                    <div class="px-2"><Link :href="`/admin/acara/${acara.slug}/reaksi`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><HeartHandshake class="size-4 text-zinc-400" />Reaksi / Emoticon</Link></div>
                    <div class="px-2"><span class="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl"><MessageSquare class="size-4" />Komentar & Doa</span></div>
                    <div class="px-2"><Link :href="`/admin/acara/${acara.slug}/keuangan`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><Ticket class="size-4 text-indigo-500" />Buku Kas Keuangan</Link></div>
                </div>
            </div>
        </div>

        <div class="flex border-b border-zinc-200 dark:border-zinc-800">
            <button 
                @click="switchTab('doa_transaksi')"
                class="flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-sm transition-all"
                :class="[activeTab === 'doa_transaksi' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-zinc-400 hover:text-zinc-600']"
            >
                <Landmark class="size-4" />
                Catatan Lembar Transaksi
            </button>
            <button 
                @click="switchTab('komentar_publik')"
                class="flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-sm transition-all"
                :class="[activeTab === 'komentar_publik' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-zinc-400 hover:text-zinc-600']"
            >
                <MessageSquareText class="size-4" />
                Komentar Umum Publik
            </button>
        </div>

        <div v-if="activeTab === 'doa_transaksi'" class="space-y-4">
            <div v-if="paymentsNotes.data.length > 0" class="space-y-4">
                <div v-for="item in paymentsNotes.data" :key="item.id" class="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-2">
                    <div class="flex items-center justify-between">
                        <div class="flex flex-col">
                            <span class="text-sm font-bold text-zinc-800 dark:text-zinc-200">{{ item.sapaan || 'Sdr/i' }} {{ item.atas_nama }}</span>
                            <span class="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase font-mono mt-0.5">
                                Jenis Mutasi: {{ item.mutation_type.replace('_', ' ') }} — Rp {{ new Intl.NumberFormat('id-ID').format(item.nominal) }}
                            </span>
                        </div>
                        <span class="text-[11px] text-zinc-400">{{ new Date(item.date).toLocaleDateString('id-ID') }}</span>
                    </div>
                    <p class="text-sm text-zinc-600 dark:text-zinc-400 italic bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                        "{{ item.notes }}"
                    </p>
                </div>

                <div v-if="paymentsNotes.links.length > 3" class="flex justify-center gap-1 pt-4">
                    <button v-for="(link, idx) in paymentsNotes.links" :key="idx" @click="goToPagination(link.url)" v-html="link.label" class="px-3 py-1.5 rounded-lg text-xs" :class="[link.active ? 'bg-indigo-600 text-white font-bold' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400', !link.url ? 'opacity-40 cursor-not-allowed' : '']" />
                </div>
            </div>

            <div v-else class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center text-zinc-500">
                <MessageCircleOff class="size-8 mx-auto mb-3 opacity-40" />
                Belum ada catatan lembar rincian transaksi yang masuk.
            </div>
        </div>

        <div v-if="activeTab === 'komentar_publik'" class="space-y-4">
            <div v-if="komentarsPublik.data.length > 0" class="space-y-4">
                <div v-for="item in komentarsPublik.data" :key="item.id" class="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-2">
                    <div class="flex items-center justify-between">
                        <div>
                            <span class="text-sm font-bold text-zinc-800 dark:text-zinc-200">{{ item.user ? item.user.name : item.nama_publik || 'Anonim' }}</span>
                        </div>
                        <span class="text-[11px] text-zinc-400">{{ new Date(item.created_at).toLocaleDateString('id-ID') }}</span>
                    </div>
                    <p class="text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                        {{ item.body }}
                    </p>
                </div>

                <div v-if="komentarsPublik.links.length > 3" class="flex justify-center gap-1 pt-4">
                    <button v-for="(link, idx) in komentarsPublik.links" :key="idx" @click="goToPagination(link.url)" v-html="link.label" class="px-3 py-1.5 rounded-lg text-xs" :class="[link.active ? 'bg-indigo-600 text-white font-bold' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400', !link.url ? 'opacity-40 cursor-not-allowed' : '']" />
                </div>
            </div>

            <div v-else class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center text-zinc-500">
                <MessageCircleOff class="size-8 mx-auto mb-3 opacity-40" />
                Belum ada komentar murni yang ditulis publik di halaman luar acara ini.
            </div>
        </div>
    </div>
</template>