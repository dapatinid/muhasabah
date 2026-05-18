<script setup lang="ts">
import { ref } from 'vue'
import { Head, Link, router } from '@inertiajs/vue3'
import { 
    ArrowLeft, Settings, ChevronDown, HeartHandshake, 
    MessageSquare, ArrowDownCircle, ArrowUpCircle, 
    Eye, Users, Clock, 
    SquarePen
} from 'lucide-vue-next'

const props = defineProps<{
    donasi: { id: number; judul: string; slug: string };
    stats: { love: number; pray: number; sad: number; like: number };
    reaksis: { data: Array<any>; links: Array<any> };
}>()

const dropdownOpen = ref(false)

// Helper pemetaan visual emoji berdasarkan tipe data di database
const renderEmoji = (type: string) => {
    switch (type) {
        case 'love': return { char: '❤️', label: 'Cinta / Peduli', bg: 'bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/50 text-rose-600' }
        case 'like': return { char: '👍', label: 'Suka / Dukung', bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50 text-emerald-600' }
        case 'pray': return { char: '🙏', label: 'Doa / Harapan', bg: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/50 text-indigo-600' }
        case 'sad': return { char: '😢', label: 'Sedih / Empati', bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/50 text-amber-600' }
        default: return { char: '✨', label: 'Reaksi', bg: 'bg-zinc-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 text-zinc-600' }
    }
}

const goToPagination = (url: string | null) => {
    if (!url) return
    router.get(url, {}, { preserveState: true, preserveScroll: true })
}
</script>

<template>
    <Head :title="`Reaksi Donasi: ${donasi.judul}`" />
    
    <div class="py-10 px-4 w-full mx-auto space-y-8">
        <!-- HEADER SECTION (Tetap sama seperti kode Anda) -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
                <Link href="/admin/donasi" class="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-indigo-600 transition-colors">
                    <ArrowLeft class="size-5" />
                </Link>
                <div>
                    <h1 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Reaksi & Emoticon</h1>
                    <p class="text-sm text-zinc-500">Daftar interaksi emotikon ringkas dari para pengunjung.</p>
                </div>
            </div>

            <!-- DROPDOWN NAVIGASI -->
            <div class="relative flex">
                <button type="button" @click="dropdownOpen = !dropdownOpen" @blur="setTimeout(() => dropdownOpen = false, 200)" class="ms-auto h-11 px-5 inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-200 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all">
                    <Settings class="size-4 text-zinc-400" />
                    <span>Kelola</span>
                    <ChevronDown class="size-4 text-zinc-400" :class="{ 'rotate-180': dropdownOpen }" />
                </button>
                <div v-if="dropdownOpen" class="absolute right-0 mt-12 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 py-2">
                    <div class="px-2"><Link :href="`/admin/donasi/${donasi.slug}/edit`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><SquarePen class="size-4 text-zinc-400" />Edit Konten</Link></div>
                    <div class="px-2"><Link :href="`/donasi/${donasi.slug}`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><Eye class="size-4 text-zinc-400" />Preview Publik</Link></div>
                    <div class="px-2"><span class="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl"><HeartHandshake class="size-4" />Reaksi / Emoticon</span></div>
                    <div class="px-2"><Link :href="`/admin/donasi/${donasi.slug}/komentar`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><MessageSquare class="size-4 text-zinc-400" />Komentar & Doa</Link></div>
                    <div class="px-2"><Link :href="`/admin/donasi/${donasi.slug}/donasi-masuk`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><ArrowDownCircle class="size-4 text-emerald-500" />Donasi Masuk</Link></div>
                    <div class="px-2"><Link :href="`/admin/donasi/${donasi.slug}/tasyaruf`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><ArrowUpCircle class="size-4 text-amber-500" />Tasyaruf Keluar</Link></div>
                </div>
            </div>
        </div>

        <!-- 1. GRID KARTU STATISTIK EKSPRESI -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="(count, type) in stats" :key="type" class="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center gap-4 shadow-sm">
                <span class="text-3xl p-3 rounded-xl border" :class="renderEmoji(type).bg">
                    {{ renderEmoji(type).char }}
                </span>
                <div>
                    <p class="text-xs text-zinc-400 font-bold uppercase tracking-wider">{{ renderEmoji(type).label }}</p>
                    <p class="text-2xl font-black text-zinc-800 dark:text-white font-mono mt-0.5">{{ count }}</p>
                </div>
            </div>
        </div>

        <!-- 2. DAFTAR RIWAYAT AKTIVITAS REAKSI -->
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden">
            <div class="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                <Clock class="size-4 text-zinc-400" />
                <h2 class="text-md font-bold text-zinc-800 dark:text-zinc-200">Log Aktivitas Terbaru</h2>
            </div>

            <div v-if="reaksis.data.length > 0" class="divide-y divide-zinc-100 dark:divide-zinc-800">
                <div v-for="log in reaksis.data" :key="log.id" class="p-4 sm:px-6 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all">
                    <div class="flex items-center gap-4">
                        <span class="text-xl w-10 h-10 rounded-full border flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 shadow-inner">
                            {{ renderEmoji(log.type).char }}
                        </span>
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                    {{ log.user ? log.user.name : 'Pengunjung Umum' }}
                                </span>
                                <span v-if="!log.user" class="text-[10px] font-mono px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-400">
                                    IP: {{ log.ip_address || 'Hidden' }}
                                </span>
                            </div>
                            <span class="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                                Memberikan ekspresi {{ renderEmoji(log.type).label.toLowerCase() }}.
                            </span>
                        </div>
                    </div>
                    <span class="text-[11px] text-zinc-400 whitespace-nowrap">
                        {{ new Date(log.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' }) }}
                    </span>
                </div>

                <!-- PAGINASI LOG -->
                <div v-if="reaksis.links.length > 3" class="p-4 flex justify-center gap-1 border-t border-zinc-100 dark:border-zinc-800">
                    <button v-for="(link, idx) in reaksis.links" :key="idx" @click="goToPagination(link.url)" v-html="link.label" class="px-3 py-1.5 rounded-lg text-xs" :class="[link.active ? 'bg-indigo-600 text-white font-bold' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400', !link.url ? 'opacity-40 cursor-not-allowed' : '']" />
                </div>
            </div>

            <!-- EMPTY STATE LOG -->
            <div v-else class="py-16 text-center text-zinc-400 text-sm">
                <Users class="size-6 mx-auto mb-2 opacity-30" />
                Belum ada interaksi ekspresi yang tercatat pada program donasi ini.
            </div>
        </div>
    </div>
</template>