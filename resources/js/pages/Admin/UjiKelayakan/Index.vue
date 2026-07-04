<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { ref, computed, watch } from 'vue';
import { dashboard } from '@/routes';
import { ChevronsLeft, ChevronsRight, Ellipsis, Eye } from 'lucide-vue-next';
import PreviewModal from './Preview.vue'; // Memuat komponen Preview pembantu

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Uji Kelayakan', href: '/uji-kelayakan' },
        ],
    },
});

interface UjiKelayakan {
    id: number;
    user_id: number;
    class: string;
    kategori: string;
    jawaban: string | any[]; // Bisa berupa string JSON atau Array tergantung penanganan di backend/cast
    created_at: string | null;
    updated_at: string | null;
    // Relasi user jika di-load dari controller
    user?: {
        name: string;
        email: string;
    };
}

interface Props {
    items: UjiKelayakan[];
    filters: {
        search: string;
        class: string;
    };
    pagination: {
        total: number;
        current_page: number;
        last_page: number;
        per_page: number;
    };
}

const props = defineProps<Props>();

const search = ref(props.filters?.search ?? '');
const classFilter = ref(props.filters?.class ?? '');
let debounceTimer: ReturnType<typeof setTimeout>;

function applyFilters() {
    router.get(
        '/uji-kelayakan',
        {
            search: search.value,
            class: classFilter.value,
        },
        { preserveState: true, replace: true }
    );
}

watch([search], () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(applyFilters, 400);
});

watch([classFilter], () => {
    applyFilters();
});

function resetFilters() {
    search.value = '';
    classFilter.value = '';
    applyFilters();
}

function formatTanggal(tanggal: string | null): string {
    if (!tanggal) return '-';
    const date = new Date(tanggal);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

const hasFilters = computed(() => search.value || classFilter.value);

function goToPage(page: number) {
    router.get(
        '/uji-kelayakan',
        {
            search: search.value,
            class: classFilter.value,
            page,
        },
        { preserveState: true, replace: true }
    );
}

// State untuk Modal Preview Detail
const isPreviewOpen = ref(false);
const selectedItem = ref<UjiKelayakan | null>(null);

function openPreview(item: UjiKelayakan) {
    selectedItem.value = item;
    isPreviewOpen.value = true;
}

const displayedPages = computed(() => {
    const current = props.pagination?.current_page ?? 1;
    const last = props.pagination?.last_page ?? 1;
    const delta = 2;
    
    let start = Math.max(1, current - delta);
    let end = Math.min(last, current + delta);

    if (current <= delta) {
        end = Math.min(last, start + (delta * 2));
    } else if (current > last - delta) {
        start = Math.max(1, last - (delta * 2));
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});
</script>

<template>
    <Head title="Daftar Uji Kelayakan" />

    <div class="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
        <div class="flex flex-col gap-1">
            <h1 class="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Uji Kelayakan</h1>
            <p class="text-sm text-zinc-500 dark:text-zinc-400">
                Data hasil uji kelayakan komitmen relawan dan donatur.
            </p>
        </div>

        <div class="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-sidebar p-4">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:flex-wrap">
                <div class="flex flex-col gap-1 flex-1 min-w-[200px]">
                    <label class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                        Cari User / Peserta
                    </label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-3 flex items-center text-zinc-400 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                            </svg>
                        </span>
                        <input
                            v-model="search"
                            type="text"
                            placeholder="Ketik nama atau ID user..."
                            class="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                        />
                    </div>
                </div>

                <div class="flex flex-col gap-1 min-w-[150px]">
                    <label class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                        Filter Kelas
                    </label>
                    <select
                        v-model="classFilter"
                        class="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                    >
                        <option value="">Semua Kelas</option>
                        <option value="relawan-donatur">Relawan Donatur</option>
                        <option value="penulis">Penulis</option>
                        <option value="penggalang-dana">Penggalang Dana</option>
                        <option value="penyelenggara-acara">Penyelenggara Acara</option>
                    </select>
                </div>

                <button
                    v-if="hasFilters"
                    @click="resetFilters"
                    class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                    Reset
                </button>
            </div>

            <div class="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
                Menampilkan <span class="font-semibold text-zinc-600 dark:text-zinc-300">{{ pagination?.total ?? 0 }}</span> entri
            </div>
        </div>

        <div class="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-sidebar overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-700">
                            <th class="px-4 py-3 text-left font-semibold text-zinc-600 dark:text-zinc-300 whitespace-nowrap">#</th>
                            <th class="px-4 py-3 text-left font-semibold text-zinc-600 dark:text-zinc-300 whitespace-nowrap">User ID / Nama</th>
                            <th class="px-4 py-3 text-left font-semibold text-zinc-600 dark:text-zinc-300 whitespace-nowrap">Kelas</th>
                            <th class="px-4 py-3 text-left font-semibold text-zinc-600 dark:text-zinc-300 whitespace-nowrap">Kategori</th>
                            <th class="px-4 py-3 text-center font-semibold text-zinc-600 dark:text-zinc-300 whitespace-nowrap">Waktu Submit</th>
                            <th class="px-4 py-3 text-center font-semibold text-zinc-600 dark:text-zinc-300 whitespace-nowrap">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="items && items.length > 0">
                            <tr
                                v-for="(item, index) in items"
                                :key="item.id"
                                class="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                            >
                                <td class="px-4 py-3 text-zinc-400 dark:text-zinc-600 text-xs">
                                    {{ (((pagination?.current_page ?? 1) - 1) * (pagination?.per_page ?? 50)) + index + 1 }}
                                </td>
                                <td class="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-100 whitespace-nowrap">
                                    {{ item.user?.name ?? `User ID: ${item.user_id}` }}
                                </td>
                                <td class="px-4 py-3 text-zinc-600 dark:text-zinc-300 whitespace-nowrap">
                                    <span class="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-medium">
                                        {{ item.class }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-zinc-600 dark:text-zinc-300 whitespace-nowrap">
                                    {{ item.kategori }}
                                </td>
                                <td class="px-4 py-3 text-center text-zinc-500 dark:text-zinc-400 text-xs whitespace-nowrap">
                                    {{ formatTanggal(item.created_at) }}
                                </td>
                                <td class="px-4 py-3 text-center whitespace-nowrap">
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        class="flex items-center gap-1 text-xs"
                                        @click="openPreview(item)"
                                    >
                                        <Eye class="h-3.5 w-3.5" />
                                        Lihat Jawaban
                                    </Button>
                                </td>
                            </tr>
                        </template>
                        <template v-else>
                            <tr>
                                <td colspan="6" class="px-4 py-16 text-center text-zinc-400 dark:text-zinc-600">
                                    <div class="flex flex-col items-center gap-2">
                                        <p class="text-sm">Tidak ada data hasil tes yang ditemukan</p>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

            <div v-if="pagination && pagination.last_page > 1" class="flex items-center justify-between px-4 py-3 border-t border-zinc-100 dark:border-zinc-800">
                <p class="text-xs text-zinc-400 dark:text-zinc-500">
                    Hal {{ pagination.current_page }} dari {{ pagination.last_page }}
                </p>
                <div class="flex gap-1 ms-3">              
                    <button :disabled="pagination.current_page <= 1" @click="goToPage(1)" class="px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 transition">
                        <ChevronsLeft class="h-4 w-4" />
                    </button>
                    <button v-for="page in displayedPages" :key="page" @click="goToPage(page)" class="px-3 py-1.5 rounded-lg text-xs font-medium border transition" :class="page === pagination.current_page ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'">
                        {{ page }}
                    </button>
                    <button :disabled="pagination.current_page >= pagination.last_page" @click="goToPage(pagination.last_page)" class="px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 transition">
                        <ChevronsRight class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    </div>

    <PreviewModal 
        :open="isPreviewOpen" 
        :item="selectedItem" 
        @close="isPreviewOpen = false" 
    />
</template>