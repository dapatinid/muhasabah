<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { 
    ArrowLeft, ChevronDown, Settings, HeartHandshake, MessageSquare, 
    ArrowDownCircle, ArrowUpCircle, Eye, SquarePen, Newspaper, Ticket,
    Heart, ThumbsUp, Smile, Frown
} from 'lucide-vue-next'
import { ref } from 'vue'

const props = defineProps<{
    acara: {
        id: number;
        slug: string;
        judul: string;
    };
    statReaksi: {
        love: number;
        like: number;
        pray: number;
        sad: number;
    };
    reaksis: {
        data: Array<{
            id: number;
            type: string;
            ip_address: string;
            created_at: string;
            user?: { name: string } | null;
        }>;
    };
}>();

const dropdownOpen = ref(false)

const getReactionIcon = (type: string) => {
    switch(type) {
        case 'love': return Heart;
        case 'like': return ThumbsUp;
        case 'pray': return Smile;
        case 'sad': return Frown;
        default: return Smile;
    }
}

const getReactionColor = (type: string) => {
    switch(type) {
        case 'love': return 'text-red-500 bg-red-50 dark:bg-red-950/30';
        case 'like': return 'text-blue-500 bg-blue-50 dark:bg-blue-950/30';
        case 'pray': return 'text-amber-500 bg-amber-50 dark:bg-amber-950/30';
        case 'sad': return 'text-purple-500 bg-purple-50 dark:bg-purple-950/30';
        default: return 'text-zinc-500 bg-zinc-50';
    }
}
</script>

<template>
    <Head :title="`Log Reaksi: ${props.acara.judul}`" />
    
    <div class="py-10 px-4 w-full mx-auto max-w-5xl">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div class="flex items-center gap-4">
                <Link href="/admin/acara" class="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-indigo-600 transition-colors">
                    <ArrowLeft class="size-5" />
                </Link>
                <div>
                    <h1 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Impresi & Reaksi</h1>
                    <p class="text-sm text-zinc-500">Statistik interaksi emoticon pengunjung terhadap halaman informasi acara.</p>
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
                    <div class="px-2"><span class="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl"><HeartHandshake class="size-4" />Reaksi / Emoticon</span></div>
                    <div class="px-2"><Link :href="`/admin/acara/${acara.slug}/komentar?tab=doa_transaksi`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><MessageSquare class="size-4 text-zinc-400" />Komentar & Doa</Link></div>
                    <div class="px-2"><Link :href="`/admin/acara/${acara.slug}/keuangan`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><Ticket class="size-4 text-indigo-500" />Buku Kas Keuangan</Link></div>
                </div>
            </div>             
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="p-5 bg-white dark:bg-zinc-900 border rounded-2xl flex items-center gap-4">
                <div class="p-3 rounded-xl bg-red-50 text-red-500"><Heart class="size-5" /></div>
                <div><div class="text-2xl font-black">{{ statReaksi.love }}</div><div class="text-xs text-zinc-400 font-medium">Love</div></div>
            </div>
            <div class="p-5 bg-white dark:bg-zinc-900 border rounded-2xl flex items-center gap-4">
                <div class="p-3 rounded-xl bg-blue-50 text-blue-500"><ThumbsUp class="size-5" /></div>
                <div><div class="text-2xl font-black">{{ statReaksi.like }}</div><div class="text-xs text-zinc-400 font-medium">Like</div></div>
            </div>
            <div class="p-5 bg-white dark:bg-zinc-900 border rounded-2xl flex items-center gap-4">
                <div class="p-3 rounded-xl bg-amber-50 text-amber-500"><Smile class="size-5" /></div>
                <div><div class="text-2xl font-black">{{ statReaksi.pray }}</div><div class="text-xs text-zinc-400 font-medium">Pray</div></div>
            </div>
            <div class="p-5 bg-white dark:bg-zinc-900 border rounded-2xl flex items-center gap-4">
                <div class="p-3 rounded-xl bg-purple-50 text-purple-500"><Frown class="size-5" /></div>
                <div><div class="text-2xl font-black">{{ statReaksi.sad }}</div><div class="text-xs text-zinc-400 font-medium">Sad</div></div>
            </div>
        </div>

        <div class="bg-white dark:bg-zinc-900 border rounded-2xl shadow-sm overflow-hidden">
            <div class="p-5 border-b font-bold text-zinc-800 dark:text-zinc-200">Riwayat Log Klik Klik Masuk</div>
            <div v-if="reaksis.data.length === 0" class="p-8 text-center text-sm text-zinc-400 italic">Belum ada aktivitas interaksi terkini.</div>
            <div v-else class="divide-y">
                <div v-for="log in reaksis.data" :key="log.id" class="p-4 flex items-center justify-between text-sm">
                    <div class="flex items-center gap-3">
                        <div class="p-2 rounded-lg" :class="getReactionColor(log.type)">
                            <component :is="getReactionIcon(log.type)" class="size-4" />
                        </div>
                        <div>
                            <span class="font-bold">{{ log.user ? log.user.name : 'Pengunjung Umum' }}</span>
                            <span class="text-xs text-zinc-400 block font-mono">IP: {{ log.ip_address }}</span>
                        </div>
                    </div>
                    <div class="text-xs text-zinc-400 font-medium">{{ new Date(log.created_at).toLocaleString('id-ID') }}</div>
                </div>
            </div>
        </div>
    </div>
</template>