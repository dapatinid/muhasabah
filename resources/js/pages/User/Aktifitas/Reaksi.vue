<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import CustomPagination from '@/components/CustomPagination.vue'
import { Clock, HeartHandshake, Ticket, MessageSquare, Heart, Star, UserCheck, Calendar, Smile } from 'lucide-vue-next'

const props = defineProps<{
    currentTab: string;
    dataList: any;
}>()

// Helper mapper emoji
const renderEmoji = (type: string) => {
    switch (type) {
        case 'barakallah': return { char: '🤲', label: 'Barakallah' }
        case 'masya_allah': return { char: '✨', label: 'Masya Allah' }
        case 'subhanallah': return { char: '❤️', label: 'Subhanallah' }
        case 'aamiin': return { char: '🙏', label: 'Aamiin' }
        case 'love': return { char: '❤️', label: 'Cinta' }
        case 'like': return { char: '👍', label: 'Suka' }
        case 'pray': return { char: '🙏', label: 'Harapan' }
        case 'sad': return { char: '😢', label: 'Prihatin' }
        case 'takjub': return { char: '❤️', label: 'Takjub' }
        case 'suka': return { char: '👍', label: 'Suka' }
        case 'penuh_doa': return { char: '🤲', label: 'Penuh Doa' }
        case 'tidak_hadir': return { char: '😢', label: 'Tidak Hadir' }
        default: return { char: '📝', label: 'Interaksi' }
    }
}

</script>

<template>
    <Head title="Aktivitas Saya - Reaksi" />

    <div class="py-10 px-4 w-full max-w-4xl mx-auto font-poppins">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Smile class="size-6 text-amber-500" />
                Reaksi Saya
            </h1>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Jejak riwayat kontribusi yang pernah Anda berikan.
            </p>
        </div>
        
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden">
            <div class="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2 bg-zinc-50/50 dark:bg-zinc-900/50">
                <Clock class="size-4 text-zinc-400" />
                <h2 class="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">Riwayat Reaksi Terbaru</h2>
            </div>

            <div v-if="dataList?.data.length > 0" class="divide-y divide-zinc-100 dark:divide-zinc-800">
                <div v-for="log in dataList.data" :key="log.id" class="p-4 sm:px-6 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                    <div class="flex items-center gap-3">
                        <span class="text-lg w-10 h-10 rounded-xl border flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 shadow-inner shrink-0">
                            {{ renderEmoji(log.type).char }}
                        </span>
                        <div>
                            <div class="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                Berekspresi {{ renderEmoji(log.type).label }}
                            </div>
                            <span class="text-xs text-zinc-400 mt-0.5 block">
                                Di tulisan: <span class="font-medium text-zinc-600 dark:text-zinc-300">{{ log.reaktiable?.judul || 'Konten telah dihapus' }}</span>
                            </span>
                        </div>
                    </div>
                    <span class="text-[11px] text-zinc-400 whitespace-nowrap shrink-0">{{ new Date(log.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }) }}</span>
                </div>
                
                <CustomPagination :paginator="dataList" />
            </div>

            <div v-else class="py-20 text-center text-zinc-400 text-sm">
                <Heart class="size-6 mx-auto mb-2 opacity-30" />
                Belum ada aktivitas reaksi yang tercatat pada akun Anda.
            </div>
        </div>
    </div>
</template>

<style scoped>
.scrollbar-none::-webkit-scrollbar { display: none; }
.scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
</style>