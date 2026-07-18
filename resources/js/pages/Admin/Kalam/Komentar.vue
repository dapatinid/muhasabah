<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3'
import { ref } from 'vue'
import { ArrowLeft, 
    MessageSquareText, 
    MessageCircleOff,
    Clock, 
    Users, 
    Settings, 
    ChevronDown, 
    SquarePen, 
    HeartHandshake, 
    MessageSquare,
    Eye,
    CornerDownRight,
 } from 'lucide-vue-next'

const props = defineProps<{
    kalam: { id: number; judul: string; slug: string };
    komentarsPublik: { data: Array<any>; links: Array<any> };
}>()

const dropdownOpen = ref(false)

const goToPagination = (url: string | null) => {
    if (!url) return
    router.get(url, {}, { preserveState: true, preserveScroll: true })
}

// ✔️ Nama tampilan: nama_publik atau nama relasi user, fallback "Hamba Allah" jika keduanya kosong
const getDisplayName = (item: any) => {
    return item.user?.name?.trim() || item.nama_publik?.trim() || 'Hamba Allah'
}

// ✔️ Singkatan 2 huruf dari nama (inisial kata pertama & kedua, bukan sekadar 2 karakter pertama)
const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/).filter(Boolean)
    if (words.length === 0) return 'HA'
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
    return (words[0][0] + words[1][0]).toUpperCase()
}
</script>

<template>
    <Head :title="`Komentar Kalam: ${kalam.judul}`" />
    
    <div class="py-10 px-4 w-full max-w-5xl mx-auto font-poppins">

        <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
                <div>
                    <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                       Komentar Publik
                    </h1>
                    <p class="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                        Daftar komentar dan tanggapan dari publik pada artikel kalam ini.
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
                                :href="`/kalam/${kalam.slug}`"
                                @click="dropdownOpen = false"
                                class="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors w-full text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                            >
                                <Eye class="size-4 text-zinc-400 shrink-0" />
                                Lihat di Publik
                            </Link>

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

        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
            <div class="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                <h3 class="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                    <MessageSquareText class="size-4 text-emerald-500" />
                    Daftar Komentar
                </h3>
            </div>

            <div v-if="komentarsPublik.data.length > 0" class="divide-y divide-zinc-100 dark:divide-zinc-800">
                <div v-for="item in komentarsPublik.data" :key="item.id" class="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                            <!-- ✔️ Avatar: 2 huruf inisial dari nama tampilan (nama_publik / user.name / "Hamba Allah") -->
                            <div class="size-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                {{ getInitials(getDisplayName(item)) }}
                            </div>
                            <div class="flex items-center gap-1.5 flex-wrap">
                                <span class="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                    {{ getDisplayName(item) }}
                                </span>
                                <!-- ✔️ Badge pembeda: tampil hanya jika komentar ini adalah balasan -->
                                <span v-if="item.parent_id" class="font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-md text-[10px] flex items-center gap-1">
                                    <CornerDownRight class="size-3" /> Balasan
                                </span>
                            </div>
                        </div>
                        <span class="text-[11px] text-zinc-400 shrink-0">
                            {{ new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
                        </span>
                    </div>

                    <!-- ✔️ Konteks sub komentar: kutipan komentar induk yang dibalas -->
                    <div v-if="item.parent_id" class="text-xs text-zinc-500 dark:text-zinc-400 border-l-2 border-zinc-200 dark:border-zinc-700 pl-3 mb-2 ml-10 line-clamp-2">
                        Membalas <span class="font-semibold text-zinc-600 dark:text-zinc-300">{{ getDisplayName(item.parent ?? {}) }}</span>:
                        <span class="italic">"{{ item.parent?.body ?? item.parent?.isi_komentar ?? 'Komentar telah dihapus' }}"</span>
                    </div>
                    
                    <p class="text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800" :class="{ 'ml-10': item.parent_id }">
                        {{ item.isi_komentar || item.body || item.comment }}
                    </p>
                </div>

                <div v-if="komentarsPublik.links.length > 3" class="p-4 flex justify-center gap-1 border-t border-zinc-100 dark:border-zinc-800">
                    <button v-for="(link, idx) in komentarsPublik.links" :key="idx" 
                            @click="goToPagination(link.url)" 
                            v-html="link.label" 
                            class="px-3 py-1.5 rounded-lg text-xs transition-colors" 
                            :class="[link.active ? 'bg-emerald-600 text-white font-bold' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700', !link.url ? 'opacity-40 cursor-not-allowed' : '']" 
                            :disabled="!link.url" />
                </div>
            </div>

            <div v-else class="py-16 text-center text-zinc-400 text-sm">
                <MessageCircleOff class="size-6 mx-auto mb-2 opacity-50" />
                Belum ada komentar untuk tulisan kalam ini.
            </div>
        </div>
    </div>
</template>