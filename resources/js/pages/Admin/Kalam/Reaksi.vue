<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3'
import { ref } from 'vue'
import { ArrowLeft, 
    Clock, 
    Users, 
    Settings, 
    ChevronDown, 
    SquarePen, 
    HeartHandshake, 
    MessageSquare,
 } from 'lucide-vue-next'

const props = defineProps<{
    kalam: { id: number; judul: string; slug: string };
    stats: { barakallah: number; masya_allah: number; subhanallah: number; aamiin: number };
    reaksis: { data: Array<any>; links: Array<any> };
}>()

const dropdownOpen = ref(false)

// Pemetaan visual emoji berdasarkan tipe data dari controller Kalam
const renderEmoji = (type: string) => {
    switch (type) {
        case 'barakallah': return { char: '🤲', label: 'Barakallah', bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50 text-emerald-600' }
        case 'masya_allah': return { char: '✨', label: 'Masya Allah', bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/50 text-blue-600' }
        case 'subhanallah': return { char: '❤️', label: 'Subhanallah', bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/50 text-amber-600' }
        case 'aamiin': return { char: '🙏', label: 'Aamiin', bg: 'bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/50 text-rose-600' }
        default: return { char: '👍', label: 'Reaksi', bg: 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600' }
    }
}

const goToPagination = (url: string | null) => {
    if (!url) return
    router.get(url, {}, { preserveState: true, preserveScroll: true })
}
</script>

<template>
    <Head :title="`Reaksi Kalam: ${kalam.judul}`" />
    
    <div class="py-10 px-4 w-full max-w-5xl mx-auto font-poppins">
        <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
                <div>
                    <Link href="/admin/kalam" class="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-2 transition-colors">
                        <ArrowLeft class="size-4" />
                        Kembali ke Manajemen Kalam
                    </Link>
                    <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        Reaksi / Emoticon
                    </h1>
                    <p class="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                        Statistik dan log interaksi reaksi pengguna pada kalam ini.
                    </p>
                </div>

                <div class="relative z-50">
                    <button 
                        type="button"
                        @click="dropdownOpen = !dropdownOpen"
                        class="w-full md:w-auto inline-flex items-center justify-between gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
                    >
                        <span class="flex items-center gap-2">
                            <Settings class="size-4 text-zinc-400" />
                            Opsi Navigasi
                        </span>
                        <ChevronDown class="size-4 text-zinc-400 transition-transform duration-200" :class="{ 'rotate-180': dropdownOpen }" />
                    </button>

                    <div v-if="dropdownOpen" class="fixed inset-0 z-40" @click="dropdownOpen = false"></div>

                    <div 
                        v-if="dropdownOpen"
                        class="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl py-1.5 z-50 origin-top-right divide-y divide-zinc-100 dark:divide-zinc-800"
                    >
                        <div class="px-1 py-1">
                            <Link 
                                :href="`/admin/kalam/${kalam.slug}/edit`"
                                @click="dropdownOpen = false"
                                class="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors w-full text-left text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20"
                            >
                                <SquarePen class="size-4 shrink-0" />
                                Edit Konten Kalam
                            </Link>
                        </div>

                        <div class="px-1 py-1">
                            <Link 
                                :href="`/admin/kalam/${kalam.slug}/reaksi`"
                                @click="dropdownOpen = false"
                                class="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors w-full text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                            >
                                <HeartHandshake class="size-4 text-zinc-400 shrink-0" />
                                Manajemen Reaksi
                            </Link>
                            
                            <Link 
                                :href="`/admin/kalam/${kalam.slug}/komentar`"
                                @click="dropdownOpen = false"
                                class="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors w-full text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                            >
                                <MessageSquare class="size-4 text-zinc-400 shrink-0" />
                                Komentar Publik
                            </Link>
                        </div>
                    </div>
                </div>
            </div>        

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div v-for="(count, key) in stats" :key="key" 
                 class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                <div class="size-12 rounded-full flex items-center justify-center text-2xl mb-2" :class="renderEmoji(key).bg">
                    {{ renderEmoji(key).char }}
                </div>
                <span class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{{ count }}</span>
                <span class="text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider mt-1">
                    {{ renderEmoji(key).label }}
                </span>
            </div>
        </div>

        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
            <div class="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                <h3 class="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                    <Clock class="size-4 text-emerald-500" />
                    Log Reaksi Terbaru
                </h3>
            </div>

            <div v-if="reaksis.data.length > 0" class="divide-y divide-zinc-100 dark:divide-zinc-800">
                <div v-for="log in reaksis.data" :key="log.id" class="p-4 flex items-start justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div class="flex items-start gap-3">
                        <div class="size-10 rounded-full flex items-center justify-center text-lg shrink-0 border" :class="renderEmoji(log.type).bg">
                            {{ renderEmoji(log.type).char }}
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                    {{ log.user?.name || 'Hamba Allah' }}
                                </span>
                            </div>
                            <span class="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                                Memberikan reaksi {{ renderEmoji(log.type).label }}.
                            </span>
                        </div>
                    </div>
                    <span class="text-[11px] text-zinc-400 whitespace-nowrap">
                        {{ new Date(log.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
                    </span>
                </div>

                <div v-if="reaksis.links.length > 3" class="p-4 flex justify-center gap-1 border-t border-zinc-100 dark:border-zinc-800">
                    <button v-for="(link, idx) in reaksis.links" :key="idx" 
                            @click="goToPagination(link.url)" 
                            v-html="link.label" 
                            class="px-3 py-1.5 rounded-lg text-xs transition-colors" 
                            :class="[link.active ? 'bg-emerald-600 text-white font-bold' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700', !link.url ? 'opacity-40 cursor-not-allowed' : '']" 
                            :disabled="!link.url" />
                </div>
            </div>

            <div v-else class="py-16 text-center text-zinc-400 text-sm">
                <Users class="size-6 mx-auto mb-2 opacity-50" />
                Belum ada pengguna yang memberikan reaksi.
            </div>
        </div>
    </div>
</template>