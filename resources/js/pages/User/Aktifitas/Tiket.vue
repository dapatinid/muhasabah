<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import CustomPagination from '@/components/CustomPagination.vue'
import { Clock, HeartHandshake, Ticket, MessageSquare, Heart, Star, UserCheck, Calendar } from 'lucide-vue-next'

const props = defineProps<{
    currentTab: string;
    dataList: any;
}>()

const formatIDR = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)
}
</script>

<template>
    <Head title="Aktivitas Saya - Tiket" />

    <div class="py-10 px-4 w-full max-w-4xl mx-auto font-poppins">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Ticket class="size-6 text-amber-500" />
                Tiket Saya
            </h1>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Jejak riwayat kontribusi yang pernah Anda berikan.
            </p>
        </div>

        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden">
            <div class="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2 bg-zinc-50/50 dark:bg-zinc-900/50">
                <Clock class="size-4 text-zinc-400" />
                <h2 class="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                    Riwayat Tiket Terbaru
                </h2>
            </div>

            <div v-if="dataList?.data.length > 0" class="divide-y divide-zinc-100 dark:divide-zinc-800">
                <div v-for="log in dataList.data" :key="log.id" class="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
                    <div class="flex items-start gap-3">
                        <div class="size-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center font-bold shrink-0 text-sm border border-emerald-100 dark:border-emerald-900/50">Rp</div>
                        <div>
                            <div class="text-sm font-bold text-zinc-900 dark:text-zinc-100">{{ formatIDR(log.nominal) }}</div>
                            <div class="text-xs text-zinc-400 mt-0.5">
                                Bertiket ke: <span class="font-medium text-zinc-600 dark:text-zinc-300 hover:text-indigo-500"><Link :href="`/acara/${log.paymentable?.slug}`">{{ log.paymentable?.judul || 'Acara Terhapus' }}</Link></span>
                            </div>
                            <div class="mt-1"><span class="text-[10px] uppercase px-2 py-0.5 rounded font-bold" :class="log.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'">{{ log.status ?? 'PENDING' }}</span></div>
                        </div>
                    </div>
                    <span class="text-[11px] text-zinc-400 self-end sm:self-center">{{ new Date(log.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) }}</span>
                </div>
                
                <CustomPagination :paginator="dataList" />
            </div>

            <div v-else class="py-20 px-4 text-center text-zinc-400 text-sm">
                <Calendar class="size-6 mx-auto mb-2 opacity-30" />
                Belum ada aktivitas tiket yang tercatat pada akun Anda.
            </div>
        </div>
    </div>
</template>