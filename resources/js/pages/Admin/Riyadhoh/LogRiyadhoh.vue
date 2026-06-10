<script setup lang="ts">
import { Head, router, useForm } from '@inertiajs/vue3';
import { ref, computed, watch } from 'vue';
import { dashboard } from '@/routes';
import { ChevronsLeft, ChevronsRight, Ellipsis } from 'lucide-vue-next';
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, 
    DialogFooter, DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Log Riyadhoh', href: '/log-riyadhoh' },
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
    created_at?: string | null; // 🌟 PERBAIKAN: Ditambahkan agar tidak error TS
    updated_at?: string | null; // 🌟 PERBAIKAN: Ditambahkan agar tidak error TS
}

interface Props {
    entries: LogEntry[];
    filters: {
        search: string;
        date_from: string;
        date_to: string;
    };
    pagination: {
        total: number;
        current_page: number;
        last_page: number;
        per_page: number;
    };
    meta: {
        title: string;
    };
}

const props = defineProps<Props>();

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
        return 'text-zinc-400 dark:text-zinc-600';
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
    return 'text-zinc-700 dark:text-zinc-300';
}

function skorClass(skor: number): string {
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

const rakaatKeys = ['tahajud', 'witir', 'dhuha'];
const hitunganKeys = ['istighfar', 'sholawat'];
const pilihanKeys = [
    'qobliyah_subuh', 'subuh_jamaah', 'dhuhur_jamaah', 'ashar_jamaah',
    'maghrib_jamaah', 'isya_jamaah', 'birrul_walidain', 'bakti_masjid',
    'dzikir_pagi', 'dzikir_sore', 'alquran', 'puasa_sunnah',
];

function hitungSkor(entry: LogEntry): number {
    let skor = 0;
    rakaatKeys.forEach(key => {
        const val = Number((entry as any)[key]) || 0;
        skor += val * 100;
    });
    hitunganKeys.forEach(key => {
        const val = Number((entry as any)[key]) || 0;
        skor += val;
    });
    pilihanKeys.forEach(key => {
        const val = String((entry as any)[key] || '').toLowerCase();
        if (['sempurna', 'ya', 'jamaah'].includes(val)) {
            skor += 1000;
        } else if (['sebagian', 'sendiri'].includes(val)) {
            skor += 500;
        }
    });
    return skor;
}

function formatSkorGabung(entry: LogEntry): string {
    const skorMurni = hitungSkor(entry);
    const sedekah = Number(entry.sedekah_subuh) || 0;
    const formattedSkor = skorMurni.toLocaleString('id-ID');
    if (sedekah > 0) {
        return `${formattedSkor} + Rp ${sedekah.toLocaleString('id-ID')}`;
    }
    return formattedSkor;
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

const isEditDialogOpen = ref(false);
const editingCell = ref<{
    id: number;
    nama: string;
    label: string;
    column: string;
    value: any;
} | null>(null);

const editForm = useForm({
    column: '',
    value: '' as any,
});


function submitUpdate() {
    editForm.patch(`/log-riyadhoh/${editingCell.value?.id}`, {
        preserveScroll: true,
        onSuccess: () => {
            isEditDialogOpen.value = false;
            editingCell.value = null;
        },
    });
}

// Tambahkan state untuk fitur Hapus
const isDeleteDialogOpen = ref(false);
const deletingEntry = ref<LogEntry | null>(null);

function confirmDelete(entry: LogEntry) {
    deletingEntry.value = entry;
    isDeleteDialogOpen.value = true;
}

function submitDelete() {
    if (!deletingEntry.value) return;
    
    router.delete(`/log-riyadhoh/${deletingEntry.value.id}`, {
        preserveScroll: true,
        onSuccess: () => {
            isDeleteDialogOpen.value = false;
            deletingEntry.value = null;
        },
    });
}

// Perbarui fungsi handleDoubleClick yang sudah ada
function handleDoubleClick(entry: LogEntry, columnKey: string, label: string) {
    let val = (entry as any)[columnKey];
    
    // Perbaikan: Potong string waktu jika kolom yang diklik adalah 'tanggal'
    if (columnKey === 'tanggal' && typeof val === 'string') {
        val = val.split('T')[0]; // Mengubah "2026-06-07T17:00:00..." menjadi "2026-06-07"
    }

    editingCell.value = {
        id: entry.id,
        nama: entry.nama,
        label: label,
        column: columnKey,
        value: val
    };
    
    editForm.column = columnKey;
    editForm.value = val;
    isEditDialogOpen.value = true;
}
</script>

<template>
    <Head :title="props.meta?.title ?? 'Log Riyadhoh'" />

    <div class="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">

        <div class="flex flex-col gap-1">
            <h1 class="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Log Riyadhoh</h1>
            <p class="text-sm text-zinc-500 dark:text-zinc-400">
                Data laporan ibadah harian peserta riyadhoh
            </p>
        </div>

        <div class="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-sidebar p-4">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:flex-wrap">

                <div class="flex flex-col gap-1 flex-1 min-w-[200px]">
                    <label class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                        Cari Nama / No. HP
                    </label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-3 flex items-center text-zinc-400 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                            </svg>
                        </span>
                        <input
                            v-model="search"
                            type="text"
                            placeholder="Ketik nama atau nomor HP..."
                            class="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                        />
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <label class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                        Tanggal Awal
                    </label>
                    <input
                        v-model="dateFrom"
                        type="date"
                        class="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                    />
                </div>

                <div class="flex flex-col gap-1">
                    <label class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                        Tanggal Akhir
                    </label>
                    <input
                        v-model="dateTo"
                        type="date"
                        class="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                    />
                </div>

                <button
                    v-if="hasFilters"
                    @click="resetFilters"
                    class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
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
                            <th class="px-4 py-3 text-left font-semibold text-zinc-600 dark:text-zinc-300 whitespace-nowrap">Nama</th>
                            <th class="px-4 py-3 text-left font-semibold text-zinc-600 dark:text-zinc-300 whitespace-nowrap">No. WA</th>
                            <th class="px-4 py-3 text-left font-semibold text-zinc-600 dark:text-zinc-300 whitespace-nowrap">Tanggal</th>
                            <th class="px-4 py-3 text-center font-semibold text-zinc-600 dark:text-zinc-300 whitespace-nowrap">Hari ke</th>
                            <th class="px-4 py-3 text-left font-semibold text-zinc-600 dark:text-zinc-300 whitespace-nowrap">Grup</th>
                            <th
                                v-for="key in ibadahKeys"
                                :key="key"
                                class="px-3 py-3 text-center font-semibold text-zinc-600 dark:text-zinc-300 whitespace-nowrap text-xs"
                            >
                                {{ ibadahLabels[key] }}
                            </th>
                            <th class="px-4 py-3 text-center font-semibold text-zinc-600 dark:text-zinc-300 whitespace-nowrap">Skor</th>
                            <th class="px-4 py-3 text-center font-semibold text-zinc-600 dark:text-zinc-300 whitespace-nowrap">Dibuat</th>
                            <th class="px-4 py-3 text-center font-semibold text-zinc-600 dark:text-zinc-300 whitespace-nowrap">Diubah</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="entries && entries.length > 0">
                            <tr
                                v-for="(entry, index) in entries"
                                :key="entry.id"
                                class="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                            >
                                <td class="px-4 py-3 text-zinc-400 dark:text-zinc-600 text-xs cursor-pointer hover:text-red-500 transition-colors"
                                    @dblclick="confirmDelete(entry)"
                                    title="Klik ganda untuk hapus baris ini">
                                    {{ (((pagination?.current_page ?? 1) - 1) * (pagination?.per_page ?? 50)) + index + 1 }}
                                </td>
                                <td class="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-100 whitespace-nowrap"
                                    @dblclick="handleDoubleClick(entry, 'nama', 'Nama')">
                                    {{ entry.nama }}
                                </td>
                                <td class="px-4 py-3 text-zinc-500 dark:text-zinc-400 whitespace-nowrap"
                                    @dblclick="handleDoubleClick(entry, 'no_wa', 'No. WA')">
                                    {{ entry.no_wa }}
                                </td>
                                <td class="px-4 py-3 text-zinc-600 dark:text-zinc-300 whitespace-nowrap text-xs"
                                    @dblclick="handleDoubleClick(entry, 'tanggal', 'Tanggal')">
                                    {{ formatTanggal(entry.tanggal) }}
                                </td>
                                <td class="px-4 py-3 text-center text-zinc-600 dark:text-zinc-300"
                                    @dblclick="handleDoubleClick(entry, 'hari_ke', 'Hari ke')">
                                    {{ entry.hari_ke }}
                                </td>
                                <td class="px-4 py-3 text-zinc-600 dark:text-zinc-300 whitespace-nowrap"
                                    @dblclick="handleDoubleClick(entry, 'grup', 'Grup')">
                                    <span class="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-medium">
                                        {{ entry.grup }}
                                    </span>
                                </td>
                                <td
                                    v-for="key in ibadahKeys"
                                    :key="key"
                                    @dblclick="handleDoubleClick(entry, key, ibadahLabels[key])"
                                    class="px-3 py-3 text-center text-xs whitespace-nowrap"
                                    :class="nilaiClass(key, (entry as any)[key])"
                                >
                                    {{ formatNilai(key, (entry as any)[key]) }}
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <span
                                        class="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                                        :class="skorClass(hitungSkor(entry))"
                                    >
                                        {{ formatSkorGabung(entry) }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-zinc-600 dark:text-zinc-300 whitespace-nowrap text-xs">
                                    <span class="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium">
                                        {{ entry.created_at ? new Date(entry.created_at).toLocaleString('id-ID', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) : '-' }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-zinc-600 dark:text-zinc-300 whitespace-nowrap text-xs">
                                    <span class="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium">
                                        {{ entry.updated_at ? new Date(entry.updated_at).toLocaleString('id-ID', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) : '-' }}
                                    </span>
                                </td>
                            </tr>
                        </template>
                        <template v-else>
                            <tr>
                                <td :colspan="ibadahKeys.length + 9" class="px-4 py-16 text-center text-zinc-400 dark:text-zinc-600">
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

            <div
                v-if="pagination && pagination.last_page > 1"
                class="flex items-center justify-between px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 overflow-x-auto"
            >
                <p class="text-xs text-zinc-400 dark:text-zinc-500 text-nowrap">
                    Hal {{ pagination.current_page }} dari {{ pagination.last_page }}
                </p>
                <div class="flex gap-1 ms-3">              
                    <button
                        :disabled="pagination.current_page <= 1"
                        @click="goToPage(1)"
                        class="px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        <ChevronsLeft class="h-4 w-4" />
                    </button>

                    <button v-show="pagination.current_page > 3"
                        disabled 
                        class="px-1 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 transition"
                    >
                        <Ellipsis class="h-4 w-4" />
                    </button>      

                    <button
                        v-for="page in displayedPages"
                        :key="page"
                        @click="goToPage(page)"
                        class="px-3 py-1.5 rounded-lg text-xs font-medium border transition"
                        :class="page === pagination.current_page
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'"
                    >
                        {{ page }}
                    </button>

                    <button v-show="pagination.current_page < pagination.last_page - 2"
                        disabled 
                        class="px-1 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 transition"
                    >
                        <Ellipsis class="h-4 w-4" />
                    </button>   

                    <button
                        :disabled="pagination.current_page >= pagination.last_page"
                        @click="goToPage(pagination.last_page)"
                        class="px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        <ChevronsRight class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>

    </div>

    <Dialog :open="isEditDialogOpen" @update:open="isEditDialogOpen = $event">
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Ubah {{ editingCell?.label }}</DialogTitle>
                <DialogDescription>
                    Mengubah data milik <strong>{{ editingCell?.nama }}</strong>
                </DialogDescription>
            </DialogHeader>

            <form @submit.prevent="submitUpdate" class="space-y-4 py-4">
                <div class="grid gap-2">
                    <Label :for="editingCell?.column">{{ editingCell?.label }}</Label>
                    
                    <Input 
                        v-if="
                            rakaatKeys.includes(editingCell?.column || '') || 
                            hitunganKeys.includes(editingCell?.column || '') || 
                            ['sedekah_subuh', 'hari_ke'].includes(editingCell?.column || '')
                        "
                        type="number"
                        v-model="editForm.value"
                        class="w-full"
                        autofocus
                        placeholder="Masukkan angka..."
                    />

                    <Input 
                        v-else-if="editingCell?.column === 'tanggal'"
                        type="date"
                        v-model="editForm.value"
                        class="w-full"
                        autofocus
                    />

                    <Input 
                        v-else
                        type="text"
                        v-model="editForm.value"
                        class="w-full"
                        autofocus
                        placeholder="Ketik nilai..."
                    />
                    
                    <p v-if="pilihanKeys.includes(editingCell?.column || '')" class="text-[10px] text-zinc-400 italic">
                        Tip: Ketik "sempurna", "sebagian", atau "tidak" untuk pewarnaan otomatis.
                    </p>
                </div>

                <DialogFooter class="gap-2">
                    <Button type="button" variant="outline" @click="isEditDialogOpen = false">
                        Batal
                    </Button>
                    <Button type="submit" :disabled="editForm.processing">
                        {{ editForm.processing ? 'Menyimpan...' : 'Simpan Perubahan' }}
                    </Button>
                </DialogFooter>
            </form>            
        </DialogContent>
    </Dialog>    

    <Dialog :open="isDeleteDialogOpen" @update:open="isDeleteDialogOpen = $event">
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Konfirmasi Hapus Data</DialogTitle>
                <DialogDescription>
                    Apakah Anda yakin ingin menghapus data milik <strong>{{ deletingEntry?.nama }}</strong> pada tanggal <strong>{{ deletingEntry ? formatTanggal(deletingEntry.tanggal) : '' }}</strong>? Aksi ini tidak dapat dibatalkan.
                </DialogDescription>
            </DialogHeader>

            <DialogFooter class="gap-2 pt-2">
                <Button type="button" variant="outline" @click="isDeleteDialogOpen = false">
                    Batal
                </Button>
                <Button type="button" variant="destructive" @click="submitDelete">
                    Ya, Hapus
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>    
</template>