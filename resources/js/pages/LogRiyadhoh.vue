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

// 1. Definisikan kategori kunci (sama dengan di Laravel)
const rakaatKeys = ['tahajud', 'witir', 'dhuha'];
const hitunganKeys = ['istighfar', 'sholawat'];
const pilihanKeys = [
    'qobliyah_subuh', 'subuh_jamaah', 'dhuhur_jamaah', 'ashar_jamaah',
    'maghrib_jamaah', 'isya_jamaah', 'birrul_walidain', 'bakti_masjid',
    'dzikir_pagi', 'dzikir_sore', 'alquran', 'puasa_sunnah',
];

// 2. Fungsi Hitung Skor Murni
function hitungSkor(entry: LogEntry): number {
    let skor = 0;

    // Hitung Rakaat (x100)
    rakaatKeys.forEach(key => {
        const val = Number((entry as any)[key]) || 0;
        skor += val * 100;
    });

    // Hitung Hitungan (x1)
    hitunganKeys.forEach(key => {
        const val = Number((entry as any)[key]) || 0;
        skor += val;
    });

    // Hitung Pilihan String
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

// 3. Fungsi Format Skor Gabungan (Skor + Sedekah)
function formatSkorGabung(entry: LogEntry): string {
    const skorMurni = hitungSkor(entry);
    const sedekah = Number(entry.sedekah_subuh) || 0;
    
    const formattedSkor = skorMurni.toLocaleString('id-ID');
    
    if (sedekah > 0) {
        return `${formattedSkor} + Rp ${sedekah.toLocaleString('id-ID')}`;
    }
    
    return formattedSkor;
}

// Pagination handler

const displayedPages = computed(() => {
    const current = props.meta.current_page;
    const last = props.meta.last_page;
    const delta = 2; // Jumlah halaman di kiri dan kanan halaman aktif
    
    let start = Math.max(1, current - delta);
    let end = Math.min(last, current + delta);

    // Penyesuaian jika di awal atau di akhir range
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

// State untuk Modal
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

// Fungsi saat Cell di double click
function handleDoubleClick(entry: LogEntry, columnKey: string, label: string) {
    editingCell.value = {
        id: entry.id,
        nama: entry.nama,
        label: label,
        column: columnKey,
        value: (entry as any)[columnKey]
    };
    
    editForm.column = columnKey;
    editForm.value = (entry as any)[columnKey];
    isEditDialogOpen.value = true;
}

function submitUpdate() {
    editForm.patch(`/log-riyadhoh/${editingCell.value?.id}`, {
        preserveScroll: true,
        onSuccess: () => {
            isEditDialogOpen.value = false;
            editingCell.value = null;
        },
    });
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
                                <td class="px-4 py-3 font-medium text-slate-800 dark:text-slate-100 whitespace-nowrap"
                                    @dblclick="handleDoubleClick(entry, 'nama', 'Nama')">
                                    {{ entry.nama }}
                                </td>
                                <td class="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap"
                                    @dblclick="handleDoubleClick(entry, 'no_wa', 'No. WA')">
                                    {{ entry.no_wa }}
                                </td>
                                <td class="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap text-xs"
                                    @dblclick="handleDoubleClick(entry, 'tanggal', 'Tanggal')">
                                    {{ formatTanggal(entry.tanggal) }}
                                </td>
                                <td class="px-4 py-3 text-center text-slate-600 dark:text-slate-300"
                                    @dblclick="handleDoubleClick(entry, 'hari_ke', 'Hari ke')">
                                    {{ entry.hari_ke }}
                                </td>
                                <td class="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap"
                                    @dblclick="handleDoubleClick(entry, 'grup', 'Grup')">
                                    <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium">
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
                                    <!-- Kirim hasil hitungSkor ke skorClass untuk warna -->
                                    <span
                                        class="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                                        :class="skorClass(hitungSkor(entry))"
                                    >
                                        <!-- Tampilkan skor gabungan hasil hitungan frontend -->
                                        {{ formatSkorGabung(entry) }}
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
                class="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800 overflow-x-auto"
            >
                <p class="text-xs text-slate-400 dark:text-slate-500 text-nowrap">
                    Hal {{ meta.current_page }} dari {{ meta.last_page }}
                </p>
                <div class="flex gap-1 ms-3">              
                    <!-- Tombol First Page << -->
                    <button
                        :disabled="meta.current_page <= 1"
                        @click="goToPage(1)"
                        class="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        <ChevronsLeft class="h-4 w-4" />
                    </button>

                    <button v-show="meta.current_page > 3"
                        disabled 
                        class="px-1 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition"
                    >
                        <Ellipsis class="h-4 w-4" />
                    </button>      

                    <!-- Loop Halaman yang sudah difilter -->
                    <button
                        v-for="page in displayedPages"
                        :key="page"
                        @click="goToPage(page)"
                        class="px-3 py-1.5 rounded-lg text-xs font-medium border transition"
                        :class="page === meta.current_page
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'"
                    >
                        {{ page }}
                    </button>

                    <button v-show="meta.current_page < meta.last_page - 2"
                        disabled 
                        class="px-1 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition"
                    >
                        <Ellipsis class="h-4 w-4" />
                    </button>   

                    <!-- Tombol Last Page >> -->
                    <button
                        :disabled="meta.current_page >= meta.last_page"
                        @click="goToPage(meta.last_page)"
                        class="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        <ChevronsRight class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>

    </div>


<!-- Modal Edit Dialog -->
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
                    
                    <!-- Input dinamis berdasarkan tipe data -->
                    <Input 
                        v-if="rakaatKeys.includes(editingCell?.column || '') || hitunganKeys.includes(editingCell?.column || '') || editingCell?.column === 'sedekah_subuh'"
                        type="number"
                        v-model="editForm.value"
                        class="w-full"
                        autofocus
                    />
                    
                    <select 
                        v-else-if="pilihanKeys.includes(editingCell?.column || '')"
                        v-model="editForm.value"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <option value="sempurna">Sempurna / Ya / Jamaah</option>
                        <option value="sebagian">Sebagian / Sendiri</option>
                        <option value="tidak">Tidak</option>
                        <option value="">-</option>
                    </select>

                    <Input 
                        v-else
                        type="text"
                        v-model="editForm.value"
                        class="w-full"
                        autofocus
                    />
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
</template>