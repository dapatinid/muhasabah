<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { ref, computed, watch } from 'vue';
import { dashboard } from '@/routes';

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Dashboard',
                href: dashboard(),
            },
            {
                title: 'Log Riyadhoh',
                href: '/log-riyadhoh',
            },
        ],
    },
});

interface LogEntry {
    id: number;
    nama: string;
    no_wa: string;
    tanggal: string;
    hari_ke: number;
    grup: string;
    tahajud: number;
    witir: number;
    qobliyah_subuh: string | null;
    subuh_jamaah: string | null;
    dhuha: number;
    dhuhur_jamaah: string | null;
    ashar_jamaah: string | null;
    maghrib_jamaah: string | null;
    isya_jamaah: string | null;
    sedekah_subuh: number;
    birrul_walidain: string | null;
    bakti_masjid: string | null;
    dzikir_pagi: string | null;
    dzikir_sore: string | null;
    istighfar: number;
    sholawat: number;
    alquran: string | null;
    puasa_sunnah: string | null;
    skor: number;
    skor_gabung: string;
}

interface Props {
    entries: LogEntry[];
    filters: {
        search: string;
        date_from: string;
        date_to: string;
    };
    meta: {
        total: number;
        current_page: number;
        last_page: number;
        per_page: number;
    };
}

const props = defineProps<Props>();

    console.log('Data dari Laravel:', props.entries);
if (props.entries.length > 0) {
    console.log('Contoh data pertama:', props.entries[0]);
    console.log('Skor ada?', 'skor' in props.entries[0]);
}

const search = ref(props.filters?.search ?? '');
const dateFrom = ref(props.filters?.date_from ?? '');
const dateTo = ref(props.filters?.date_to ?? '');

let debounceTimer: ReturnType<typeof setTimeout>;

function applyFilters() {
    router.get(
        '/log-riyadhoh',
        {
            search: search.value,
            date_from: dateFrom.value,
            date_to: dateTo.value,
        },
        { preserveState: true, replace: true }
    );
}

watch([search], () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(applyFilters, 400);
});

watch([dateFrom, dateTo], () => {
    applyFilters();
});

function resetFilters() {
    search.value = '';
    dateFrom.value = '';
    dateTo.value = '';
    applyFilters();
}

const ibadahLabels: Record<string, string> = {
    tahajud: 'Tahajud',
    witir: 'Witir',
    qobliyah_subuh: 'Qobliyah Subuh',
    subuh_jamaah: 'Subuh Jamaah',
    dhuha: 'Dhuha',
    dhuhur_jamaah: 'Dhuhur Jamaah',
    ashar_jamaah: 'Ashar Jamaah',
    maghrib_jamaah: 'Maghrib Jamaah',
    isya_jamaah: 'Isya Jamaah',
    sedekah_subuh: 'Sedekah Subuh',
    birrul_walidain: 'Birrul Walidain',
    bakti_masjid: 'Bakti Masjid',
    dzikir_pagi: 'Dzikir Pagi',
    dzikir_sore: 'Dzikir Sore',
    istighfar: 'Istighfar',
    sholawat: 'Sholawat',
    alquran: "Al-Qur'an",
    puasa_sunnah: 'Puasa Sunnah',
};

const ibadahKeys = Object.keys(ibadahLabels);

function formatTanggal(tanggal: string): string {
    const date = new Date(tanggal);
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).replace('Minggu', 'Ahad');
}

function formatNilai(key: string, value: any): string {
    if (value === null || value === undefined) return '-';
    if (['tahajud', 'witir', 'dhuha', 'istighfar', 'sholawat'].includes(key)) {
        return String(value);
    }
    if (key === 'sedekah_subuh') {
        return value ? `Rp ${Number(value).toLocaleString('id-ID')}` : '-';
    }
    return String(value);
}

function nilaiClass(key: string, value: any): string {
    if (value === null || value === undefined || value === 0 || value === '0') {
        return 'text-slate-400 dark:text-slate-600';
    }
    if (['sempurna', 'ya', 'jamaah'].includes(String(value))) {
        return 'text-emerald-600 dark:text-emerald-400 font-medium';
    }
    if (['sebagian', 'sendiri'].includes(String(value))) {
        return 'text-amber-600 dark:text-amber-400 font-medium';
    }
    if (String(value) === 'tidak') {
        return 'text-red-400 dark:text-red-500';
    }
    if (!isNaN(Number(value)) && Number(value) > 0) {
        return 'text-emerald-600 dark:text-emerald-400 font-medium';
    }
    return 'text-slate-700 dark:text-slate-300';
}

function skorClass(skor: number): string {
    // Contoh: Hijau jika skor murni di atas 8000
    if (skor >= 8000) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
    if (skor >= 4000) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
    return 'bg-red-100 text-red-500 dark:bg-red-900/40 dark:text-red-300';
}

const hasFilters = computed(() => search.value || dateFrom.value || dateTo.value);

function goToPage(page: number) {
    router.get(
        '/log-riyadhoh',
        {
            search: search.value,
            date_from: dateFrom.value,
            date_to: dateTo.value,
            page,
        },
        { preserveState: true, replace: true }
    );
}
</script>

<template>
    <Head title="Log Riyadhoh" />

    <div class="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">

        <!-- Header -->
        <div class="flex flex-col gap-1">
            <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Log Riyadhoh</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">
                Data laporan ibadah harian peserta riyadhoh
            </p>
        </div>

        <!-- Filter Card -->
        <div class="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-sidebar p-4">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:flex-wrap">

                <!-- Search -->
                <div class="flex flex-col gap-1 flex-1 min-w-[200px]">
                    <label class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        Cari Nama / No. HP
                    </label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                            </svg>
                        </span>
                        <input
                            v-model="search"
                            type="text"
                            placeholder="Ketik nama atau nomor HP..."
                            class="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                        />
                    </div>
                </div>

                <!-- Date From -->
                <div class="flex flex-col gap-1">
                    <label class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        Tanggal Awal
                    </label>
                    <input
                        v-model="dateFrom"
                        type="date"
                        class="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                    />
                </div>

                <!-- Date To -->
                <div class="flex flex-col gap-1">
                    <label class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        Tanggal Akhir
                    </label>
                    <input
                        v-model="dateTo"
                        type="date"
                        class="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                    />
                </div>

                <!-- Reset -->
                <button
                    v-if="hasFilters"
                    @click="resetFilters"
                    class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reset
                </button>
            </div>

            <!-- Total info -->
            <div class="mt-3 text-xs text-slate-400 dark:text-slate-500">
                Menampilkan <span class="font-semibold text-slate-600 dark:text-slate-300">{{ meta?.total ?? 0 }}</span> entri
            </div>
        </div>

        <!-- Table -->
        <div class="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-sidebar overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                            <th class="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">#</th>
                            <th class="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Nama</th>
                            <th class="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">No. WA</th>
                            <th class="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Tanggal</th>
                            <th class="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Hari ke</th>
                            <th class="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Grup</th>
                            <th
                                v-for="key in ibadahKeys"
                                :key="key"
                                class="px-3 py-3 text-center font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap text-xs"
                            >
                                {{ ibadahLabels[key] }}
                            </th>
                            <th class="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Skor</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="entries && entries.length > 0">
                            <tr
                                v-for="(entry, index) in entries"
                                :key="entry.id"
                                class="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                            >
                                <td class="px-4 py-3 text-slate-400 dark:text-slate-600 text-xs">
                                    {{ ((meta?.current_page - 1) * meta?.per_page) + index + 1 }}
                                </td>
                                <td class="px-4 py-3 font-medium text-slate-800 dark:text-slate-100 whitespace-nowrap">
                                    {{ entry.nama }}
                                </td>
                                <td class="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                    {{ entry.no_wa }}
                                </td>
                                <td class="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap text-xs">
                                    {{ formatTanggal(entry.tanggal) }}
                                </td>
                                <td class="px-4 py-3 text-center text-slate-600 dark:text-slate-300">
                                    {{ entry.hari_ke }}
                                </td>
                                <td class="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                    <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium">
                                        {{ entry.grup }}
                                    </span>
                                </td>
                                <td
                                    v-for="key in ibadahKeys"
                                    :key="key"
                                    class="px-3 py-3 text-center text-xs whitespace-nowrap"
                                    :class="nilaiClass(key, (entry as any)[key])"
                                >
                                    {{ formatNilai(key, (entry as any)[key]) }}
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <span
                                        class="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                                        :class="skorClass(entry.skor ?? 0)"
                                    >
                                        {{ entry.skor_gabung ?? '0' }}
                                    </span>
                                </td>
                            </tr>
                        </template>
                        <template v-else>
                            <tr>
                                <td :colspan="ibadahKeys.length + 7" class="px-4 py-16 text-center text-slate-400 dark:text-slate-600">
                                    <div class="flex flex-col items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                                d="M9 12h6m-3-3v6M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0z" />
                                        </svg>
                                        <p class="text-sm">Tidak ada data yang ditemukan</p>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div
                v-if="meta && meta.last_page > 1"
                class="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800"
            >
                <p class="text-xs text-slate-400 dark:text-slate-500">
                    Halaman {{ meta.current_page }} dari {{ meta.last_page }}
                </p>
                <div class="flex gap-1">
                    <button
                        :disabled="meta.current_page <= 1"
                        @click="goToPage(meta.current_page - 1)"
                        class="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        ← Prev
                    </button>
                    <button
                        v-for="page in meta.last_page"
                        :key="page"
                        @click="goToPage(page)"
                        class="px-3 py-1.5 rounded-lg text-xs font-medium border transition"
                        :class="page === meta.current_page
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'"
                    >
                        {{ page }}
                    </button>
                    <button
                        :disabled="meta.current_page >= meta.last_page"
                        @click="goToPage(meta.current_page + 1)"
                        class="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        Next →
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>