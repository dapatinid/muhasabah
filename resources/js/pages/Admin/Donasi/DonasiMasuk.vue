<script setup lang="ts">
import { ref } from 'vue'
import { Head, Link, useForm } from '@inertiajs/vue3'
import { 
    ArrowLeft, Settings, ChevronDown, HeartHandshake, 
    MessageSquare, ArrowDownCircle, ArrowUpCircle, Wallet, 
    Image as ImageIcon, X, Eye, Plus, Trash2, CheckCircle2, 
    SquarePen
} from 'lucide-vue-next'

const props = defineProps<{
    donasi: { id: number; judul: string; slug: string; saldo: number };
    payments: { data: Array<any> };
    summary: { total_donasi: number; total_infaq: number };
    errors: Object;
}>()

const dropdownOpen = ref(false)
const showBulkModal = ref(false)
const activeImage = ref<string | null>(null)

// Struktur Data Default untuk Satu Baris Donasi Tunai
const createEmptyRow = () => ({
    sapaan: 'Sdr/i',
    atas_nama: '',
    is_anonymous: false,
    no_wa: '',
    date: new Date().toISOString().split('T')[0], // Default Hari Ini
    nominal: '',
    infaq_sistem: '5.000', // Default infaq tetap ada
    via: 'CASH', // Default sumber dana
    notes: ''
})

// Gunakan Form Inertia
const bulkForm = useForm({
    donations: [createEmptyRow()]
})

const addRow = () => {
    if (bulkForm.donations.length < 10) {
        bulkForm.donations.push(createEmptyRow())
    }
}

const removeRow = (index: number) => {
    if (bulkForm.donations.length > 1) {
        bulkForm.donations.splice(index, 1)
    }
}

const submitBulk = () => {
    bulkForm.post(`/admin/donasi/${props.donasi.slug}/bulk-donasi`, {
        preserveScroll: true,
        onSuccess: () => {
            showBulkModal.value = false
            bulkForm.reset()
            bulkForm.donations = [createEmptyRow()]
        }
    })
}

const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}

const openPreview = (imagePath: string) => {
    activeImage.value = `/storage/${imagePath}`
}

const closePreview = () => {
    activeImage.value = null
}

// Fungsi pembersih & pemformat input angka generik
const formatInputCurrency = (event: any) => {
    let value = event.target.value.replace(/[^0-9]/g, '')
    if (value) {
        return new Intl.NumberFormat('id-ID').format(parseInt(value))
    }
    return ''
}

const handleNominalInput = (index: number, event: any) => {
    bulkForm.donations[index].nominal = formatInputCurrency(event)
}

const handleInfaqInput = (index: number, event: any) => {
    bulkForm.donations[index].infaq_sistem = formatInputCurrency(event)
}
</script>

<template>
    <Head :title="`Donasi Masuk: ${donasi.judul}`" />
    
    <div class="py-10 px-4 w-full mx-auto space-y-8"><!-- HEADER SECTION (Tetap Sesuai Bawaan Anda) -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
                <Link href="/admin/donasi" class="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-indigo-600 transition-colors">
                    <ArrowLeft class="size-5" />
                </Link>
                <div>
                    <h1 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Arus Dana Masuk</h1>
                    <p class="text-sm text-zinc-500">Log transaksi masuk baik Donasi Pokok maupun dana Tipping Pemeliharaan.</p>
                </div>
            </div>

            <div class="flex items-center gap-2">
                <!-- TOMBOL JUBAH BULK CASH DONASI -->
                <button 
                    @click="showBulkModal = true"
                    class="ms-auto h-11 px-4 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all"
                >
                    <Plus class="size-4" />
                    <span>Bulk Donasi</span>
                </button>

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
                        <div class="px-2"><Link :href="`/admin/donasi/${donasi.slug}/reaksi`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><HeartHandshake class="size-4 text-zinc-400" />Reaksi / Emoticon</Link></div>
                        <div class="px-2"><Link :href="`/admin/donasi/${donasi.slug}/komentar`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><MessageSquare class="size-4" />Komentar & Doa</Link></div>
                        <div class="px-2"><span class="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl"><ArrowDownCircle class="size-4 text-emerald-500" />Donasi Masuk</span></div>
                        <div class="px-2"><Link :href="`/admin/donasi/${donasi.slug}/tasyaruf`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><ArrowUpCircle class="size-4 text-amber-500" />Tasyaruf Keluar</Link></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- STATS CARD EXTRA -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
                <span class="text-xs text-zinc-400 block font-medium">Saldo Program Saat Ini</span>
                <span class="text-xl font-bold text-indigo-600 dark:text-indigo-400">{{ formatIDR(donasi.saldo) }}</span>
            </div>
            <div class="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
                <span class="text-xs text-zinc-400 block font-medium">Akumulasi Pokok Donasi</span>
                <span class="text-xl font-bold text-emerald-600 dark:text-emerald-400">{{ formatIDR(summary.total_donasi) }}</span>
            </div>
            <div class="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
                <span class="text-xs text-zinc-400 block font-medium">Akumulasi Infaq Sistem</span>
                <span class="text-xl font-bold text-amber-600 dark:text-amber-400">{{ formatIDR(summary.total_infaq) }}</span>
            </div>
        </div>

<!-- ALERT PEMBERITAHUAN ERROR JIKA INPUT MASAL GAGAL -->
        <div v-if="errors.bulk_error" class="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-sm text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <X class="size-4 shrink-0" />
            <span>{{ errors.bulk_error }}</span>
        </div>        

        <!-- TABLE MUTASI -->
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-zinc-50 dark:bg-zinc-950 text-xs font-bold text-zinc-500 uppercase border-b border-zinc-200 dark:border-zinc-800">
                            <th class="p-4 pl-6">Tanggal</th>
                            <th class="p-4">Donatur</th>
                            <th class="p-4">Jenis Alokasi</th>
                            <th class="p-4">Rekening</th>
                            <th class="p-4 text-center">Bukti</th>
                            <th class="p-4 pr-6 text-right">Nominal</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-sm text-zinc-600 dark:text-zinc-300">
                        <tr v-for="pay in payments.data" :key="pay.id" class="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20">
                            <td class="p-4 pl-6 text-xs text-zinc-400">{{ new Date(pay.date).toLocaleDateString('id-ID') }}</td>
                            <td class="p-4 font-semibold text-zinc-800 dark:text-white">
                                {{ pay.sapaan }} {{ pay.atas_nama }}
                            </td>
                            <td class="p-4">
                                <span :class="pay.mutation_type === 'donasi_utama' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'" class="px-2 py-0.5 border text-xs font-bold rounded-lg uppercase tracking-wider">
                                    {{ pay.mutation_type }}
                                </span>
                            </td>
                            <td class="p-4 text-xs font-mono text-zinc-500 dark:text-zinc-400">{{ pay.rekening }}</td>
                            
                            <!-- KOLOM BUKTI TRANSFER -->
                            <td class="p-4 text-center">
                                <button 
                                    v-if="pay.image" 
                                    type="button" 
                                    @click="openPreview(pay.image)"
                                    class="group inline-flex items-center justify-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-amber-500/40 transition-all shadow-sm"
                                    title="Lihat Bukti Transfer"
                                >
                                    <img 
                                        :src="`/storage/${pay.image}`" 
                                        alt="Bukti" 
                                        class="size-8 object-cover rounded-lg group-hover:scale-105 transition-transform"
                                    />
                                </button>
                                <span v-else class="text-xs text-zinc-400 dark:text-zinc-600 font-mono">-</span>
                            </td>

                            <td class="p-4 pr-6 text-right font-bold" :class="pay.mutation_type === 'donasi_utama' ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'">{{ formatIDR(pay.nominal) }}</td>
                        </tr>
                        <tr v-if="payments.data.length === 0">
                            <td colspan="6" class="p-8 text-center text-zinc-400">Belum ada mutasi dana masuk untuk program ini.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- LIGHTBOX/MODAL DIALOG PREVIEW IMAGE -->
        <div 
            v-if="activeImage" 
            class="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all"
            @click.self="closePreview"
        >
            <div class="relative max-w-2xl w-full bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                <!-- Header Modal -->
                <div class="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                    <div class="flex items-center gap-2 text-stone-200">
                        <ImageIcon class="size-4 text-amber-500" />
                        <span class="text-xs font-bold uppercase tracking-wider">Pratinjau Bukti Transfer</span>
                    </div>
                    <button 
                        @click="closePreview" 
                        class="p-1.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                    >
                        <X class="size-4" />
                    </button>
                </div>
                <!-- Area Gambar -->
                <div class="p-6 bg-zinc-950 flex items-center justify-center max-h-[70vh] overflow-y-auto">
                    <img 
                        :src="activeImage" 
                        alt="Bukti Transfer Penuh" 
                        class="max-w-full max-h-[60vh] object-contain rounded-xl shadow-lg border border-zinc-800"
                    />
                </div>
                <!-- Footer Modal -->
                <div class="p-3 bg-zinc-900/50 border-t border-zinc-800 text-center">
                    <a 
                        :href="activeImage" 
                        target="_blank" 
                        class="text-xs text-amber-500 hover:underline font-medium"
                    >
                        Buka Gambar di Tab Baru ↗
                    </a>
                </div>
            </div>
        </div>

<!-- ======================================================== -->
        <!-- MODAL DIALOG POPUP FORM BULK INPUT CASH DONASI -->
        <!-- ======================================================== -->
        <div 
            v-if="showBulkModal" 
            class="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-[90] flex items-center justify-center p-4"
        >
            <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden">
                <!-- Header Modal -->
                <div class="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                        <h2 class="text-xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                            <Wallet class="text-emerald-500 size-5" />
                            Input Massal Donasi Tunai/Cash
                        </h2>
                        <p class="text-xs text-zinc-400 mt-0.5">Entri ringkas penyerahan dana titipan tunai dari beberapa donatur sekaligus (Maksimal 10 Baris).</p>
                    </div>
                    <button @click="showBulkModal = false" class="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors">
                        <X class="size-4" />
                    </button>
                </div>

                <!-- Form Area (Scrollable Row) -->
                <form @submit.prevent="submitBulk" class="flex-1 overflow-y-auto p-6 space-y-4">

                    <div 
                        v-for="(row, idx) in bulkForm.donations" 
                        :key="idx" 
                        class="p-5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl flex flex-col gap-4 relative group shadow-sm transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
                    >
                        <!-- TOMBOL HAPUS ROW (Pojok Kanan Atas Absolute agar bersih) -->
                        <button 
                            type="button" 
                            @click="removeRow(idx)"
                            :disabled="bulkForm.donations.length === 1"
                            class="absolute top-4 right-4 p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl disabled:opacity-20 transition-all z-10"
                            title="Hapus Baris Transaksi"
                        >
                            <Trash2 class="size-4" />
                        </button>

                        <!-- ========================================== -->
                        <!-- ROW 1: DATA IDENTITAS DONATUR -->
                        <!-- ========================================== -->
                        <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                            <!-- Nomor Indikator -->
                            <div class="md:col-span-1 flex items-center gap-2">
                                <span class="w-6 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center text-[11px] font-bold text-zinc-500">
                                    {{ idx + 1 }}
                                </span>
                                <span class="md:hidden text-xs font-bold text-zinc-400">Identitas</span>
                            </div>

                            <!-- Nama & Sapaan -->
                            <div class="md:col-span-7 grid grid-cols-4 gap-2">
                                <select 
                                    v-model="row.sapaan" 
                                    :disabled="row.is_anonymous"
                                    class="col-span-1 h-10 px-2 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-1 focus:ring-emerald-500 disabled:opacity-40"
                                >
                                    <option>Sdr/i</option>
                                    <option>Kak</option>
                                    <option>Bapak</option>
                                    <option>Ibu</option>
                                    <option>Hamba Allah</option>
                                </select>
                                <input 
                                    type="text" 
                                    placeholder="Nama Lengkap Donatur"
                                    v-model="row.atas_nama"
                                    :required="!row.is_anonymous"
                                    :disabled="row.is_anonymous"
                                    class="col-span-3 h-10 px-3 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-1 focus:ring-emerald-500 disabled:bg-zinc-100 dark:disabled:bg-zinc-900/40 font-medium"
                                />
                            </div>

                            <!-- No WhatsApp & Checkbox Anonim -->
                            <div class="md:col-span-4 flex items-center gap-4">
                                <input 
                                    type="number" 
                                    placeholder="WhatsApp (Opsional)" 
                                    v-model="row.no_wa"
                                    class="w-full h-10 px-3 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-1 focus:ring-emerald-500 font-mono"
                                />
                                <label class="flex items-center gap-1.5 cursor-pointer select-none text-xs shrink-0 pr-8 md:pr-0">
                                    <input 
                                        type="checkbox" 
                                        v-model="row.is_anonymous"
                                        class="rounded border-zinc-300 dark:border-zinc-700 text-emerald-600 focus:ring-0 size-4"
                                    />
                                    <span class="text-zinc-500 font-bold">Anonim</span>
                                </label>
                            </div>
                        </div>

                        <!-- ========================================== -->
                        <!-- ROW 2: DETAIL WAKTU, KEUANGAN, & SUMBER DANA -->
                        <!-- ========================================== -->
                        <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 border-t border-zinc-100 dark:border-zinc-800/60 pt-3 md:pl-7">
                            
                            <!-- Input Tanggal -->
                            <div class="flex flex-col gap-1">
                                <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Tanggal Transaksi</span>
                                <input 
                                    type="date" 
                                    v-model="row.date"
                                    class="h-10 px-3 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-300 font-medium focus:ring-1 focus:ring-emerald-500 w-full"
                                />
                            </div>

                            <!-- Nominal Pokok -->
                            <div class="flex flex-col gap-1">
                                <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Donasi Pokok</span>
                                <div class="relative">
                                    <span class="absolute left-3 top-2.5 text-xs text-zinc-400 font-bold">Rp</span>
                                    <input 
                                        type="text" 
                                        placeholder="0" 
                                        :value="row.nominal"
                                        @input="handleNominalInput(idx, $event)"
                                        required
                                        class="w-full h-10 pl-8 pr-3 text-xs font-bold font-mono text-emerald-600 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-1 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>

                            <!-- Nominal Infaq Pemeliharaan -->
                            <div class="flex flex-col gap-1">
                                <span class="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Infaq Pemeliharaan</span>
                                <div class="relative">
                                    <span class="absolute left-3 top-2.5 text-xs text-zinc-400 font-bold">Rp</span>
                                    <input 
                                        type="text" 
                                        placeholder="0" 
                                        :value="row.infaq_sistem"
                                        @input="handleInfaqInput(idx, $event)"
                                        required
                                        class="w-full h-10 pl-8 pr-3 text-xs font-bold font-mono text-amber-600 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-1 focus:ring-amber-500"
                                    />
                                </div>
                            </div>

                            <!-- Kanal Saluran Pembayaran (Sumber Dana) -->
                            <div class="flex flex-col gap-1">
                                <span class="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Sumber / Via</span>
                                <select 
                                    v-model="row.via" 
                                    class="h-10 px-3 text-xs font-bold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-1 focus:ring-indigo-500 text-zinc-700 dark:text-zinc-200"
                                >
                                    <option value="CASH">CASH (TUNAI)</option>
                                    <option value="BCA">BANK BCA</option>
                                    <option value="BSI">BANK BSI</option>
                                    <option value="MANDIRI">BANK MANDIRI</option>
                                    <option value="BRI">BANK BRI</option>
                                    <option value="QRIS">QRIS</option>
                                </select>
                            </div>
                        </div>

                        <!-- ========================================== -->
                        <!-- ROW 3: PESAN DOA & UNTAIAN HARAPAN (FULL WIDTH) -->
                        <!-- ========================================== -->
                        <div class="w-full md:pl-7 border-t border-zinc-100 dark:border-zinc-800/60 pt-3">
                            <div class="w-full relative">
                                <input 
                                    type="text" 
                                    placeholder="Tulis baris untaian doa, amanah pesan spiritual, atau harapan khusus donatur disini..." 
                                    v-model="row.notes"
                                    class="w-full h-10 px-3.5 pr-24 text-xs italic text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-1 focus:ring-indigo-500 placeholder-zinc-400"
                                />
                                <span class="absolute right-3 top-2.5 text-[9px] uppercase tracking-wider font-extrabold text-zinc-300 dark:text-zinc-600 pointer-events-none select-none">
                                    Pesan & Doa
                                </span>
                            </div>
                        </div>
                    </div>                    

                    <!-- Tombol Tambah Baris Baru -->
                    <div class="flex justify-start">
                        <button 
                            type="button" 
                            @click="addRow" 
                            :disabled="bulkForm.donations.length >= 10"
                            class="px-4 py-2 border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 rounded-xl text-xs font-bold text-zinc-500 hover:text-emerald-500 flex items-center gap-1.5 disabled:opacity-40 transition-all"
                        >
                            <Plus class="size-3.5" />
                            Tambah Baris Donatur ({{ bulkForm.donations.length }}/10)
                        </button>
                    </div>
                </form>

                <!-- Footer Modal -->
                <div class="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 flex justify-end gap-3">
                    <button 
                        type="button" 
                        @click="showBulkModal = false" 
                        class="px-5 h-11 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold text-sm rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                        Batal
                    </button>
                    <button 
                        type="button"
                        @click="submitBulk"
                        :disabled="bulkForm.processing"
                        class="px-6 h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                        <CheckCircle2 class="size-4" />
                        <span>{{ bulkForm.processing ? 'Menyimpan...' : 'Simpan Semua Donasi' }}</span>
                    </button>
                </div>
            </div>
        </div>        

    </div>
</template>