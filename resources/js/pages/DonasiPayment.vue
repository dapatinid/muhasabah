<script setup lang="ts">
import { Head, useForm, Link } from '@inertiajs/vue3'
import { computed, ref } from 'vue'
import { Heart, Wallet, ShieldCheck, Check, User, Info, Upload, FileText } from 'lucide-vue-next'
import AppLayoutPublic from '@/layouts/AppLayoutPublic.vue'

const props = defineProps<{
    donasi: {
        id: number;
        judul: string;
        slug: string;
        panduan_donasi?: string; // Menampung panduan dari database
    }
}>()

const form = useForm({
    nominal: '',
    infaq_sistem: 5000, // Default pilihan pertama
    no_wa: '',
    sapaan: 'Kak',
    atas_nama: '',
    is_anonymous: false,
    notes: '',
    payment_method: 'transfer', 
    rekening: 'qris_gopay', 
    bukti_donasi: null as File | null, // State untuk menampung file upload
})

// Fungsi untuk memformat tampilan (hanya untuk display)
const formatDisplay = (val: any) => {
    if (!val) return '';
    let str = val.toString().replace(/\D/g, '');
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const handleNominalInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const start = target.selectionStart || 0;
    const oldLength = target.value.length;
    
    let rawValue = target.value.replace(/\D/g, '');
    form.nominal = rawValue;

    const formatted = formatDisplay(rawValue);
    target.value = formatted;

    const newLength = formatted.length;
    const lengthDiff = newLength - oldLength;
    const newCursorPos = start + lengthDiff;
    
    setTimeout(() => {
        target.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
};

// Handle file upload
const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        form.bukti_donasi = target.files[0];
    }
};

// Cek status donatur prioritas secara computed
const isPriorityDonator = computed(() => {
    return form.infaq_sistem === 100000;
});

/* Logic totalPembayaran tetap aman karena menggunakan parseInt */
const totalPembayaran = computed(() => {
    const n = parseInt(form.nominal) || 0
    const i = parseInt(form.infaq_sistem.toString()) || 0
    return n + i
})

const quickAmounts = [10000, 25000, 50000, 100000, 250000, 500000]

const infaqOptions = [
    { value: 5000, label: 'administrasi' },
    { value: 10000, label: 'administrasi' },
    { value: 20000, label: 'administrasi + server' },
    { value: 30000, label: 'administrasi + server' },
    { value: 40000, label: 'adm + server + eksekusi lapangan' },
    { value: 50000, label: 'adm + server + eksekusi lapangan' },
    { value: 100000, label: '50% muhasabah.id + 50% relawan' },
]

const sapaanOptions = ['Bpk.', 'Ibu', 'Kak']

/* =======================
   LOGIKA PERHITUNGAN
======================= */
const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(val)
}

const displayAtasNama = computed(() => {
    if (form.is_anonymous) return 'Hamba Allah'
    return form.atas_nama || '...'
})

function submit() {
    form.nominal = form.nominal.toString().replace(/\D/g, '');
    form.no_wa = form.no_wa.toString();
    
    // Gunakan Inertia post (secara otomatis menjadi FormData jika mendeteksi objek File)
    form.post(`/donasi/${props.donasi.slug}/payment`, {
        preserveScroll: true,
        onError: (errors) => {
            console.log(errors);
        }
    });
}
</script>

<template>
    <Head :title="`Donasi: ${donasi.judul}`" />
    <AppLayoutPublic subtitle="Konfirmasi Donasi" :title="donasi.judul" :show-back="true" :back-href="`/donasi/${donasi.slug}`">
        
        <div class="px-5 py-8 max-w-2xl mx-auto space-y-8 pb-32">
            
            <div class="text-center space-y-2">
                <div class="inline-flex p-3 rounded-full bg-amber-500/10 border border-amber-500/20 mb-2">
                    <Heart class="size-6 text-amber-500 fill-amber-500" />
                </div>
                <h1 class="text-xl font-bold text-stone-100">Lengkapi Detail Donasi</h1>
            </div>

            <form @submit.prevent="submit" class="space-y-8">
                
                <!-- 1. NOMINAL DONASI -->
                <div class="space-y-4">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-stone-500 flex items-center gap-2">
                       <span class="size-4 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[8px]">1</span>
                       Nominal Donasi
                    </label>

                    <!-- INFO PANDUAN DONASI -->
                    <div v-if="donasi.panduan_donasi" class="flex gap-2.5 items-start p-3.5 rounded-2xl bg-stone-900/40 border border-stone-800 text-stone-400 text-xs leading-relaxed">
                        <Info class="size-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                            <span class="font-bold text-stone-300 block mb-0.5">Panduan Donasi:</span>
                            {{ donasi.panduan_donasi }}
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-3 gap-3">
                        <button 
                            type="button"
                            v-for="amount in quickAmounts" 
                            @click="form.nominal = amount.toString()"
                            :class="['py-3 rounded-2xl border text-xs font-bold transition-all', form.nominal == amount.toString() ? 'bg-amber-500 border-amber-500 text-stone-950' : 'bg-stone-900 border-stone-800 text-stone-400']"
                        >
                            {{ amount / 1000 }}rb
                        </button>
                    </div>

                    <div class="relative">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">Rp</span>
                        <input 
                            type="text" 
                            inputmode="numeric"
                            :value="formatDisplay(form.nominal)" 
                            @input="handleNominalInput"
                            placeholder="Nominal lainnya..."
                            class="w-full bg-stone-900 border border-stone-800 rounded-2xl py-4 pl-12 pr-4 text-lg font-bold text-amber-400 outline-none focus:border-amber-500/40"
                            required
                        />
                    </div>
                </div>

                <!-- 2. BANTU SISTEM -->
                <div class="space-y-4 bg-amber-500/5 border border-amber-500/10 p-5 rounded-3xl">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-amber-500 flex items-center gap-2">
                        <Info class="size-3" /> Bantu sistem kami tetap hidup
                    </label>
                    <div class="space-y-2">
                        <div 
                            v-for="opt in infaqOptions" 
                            :key="opt.value"
                            @click="form.infaq_sistem = opt.value"
                            class="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all"
                            :class="form.infaq_sistem === opt.value ? 'bg-amber-500/20 border-amber-500/50 text-amber-200' : 'bg-stone-900/50 border-stone-800 text-stone-500'"
                        >
                            <div class="flex items-center gap-3">
                                <div class="size-4 rounded-full border border-stone-700 flex items-center justify-center">
                                    <div v-if="form.infaq_sistem === opt.value" class="size-2 rounded-full bg-amber-500"></div>
                                </div>
                                <span class="text-xs font-bold">{{ formatCurrency(opt.value) }}</span>
                            </div>
                            <span class="text-[10px] italic opacity-60 text-right ms-4">{{ opt.label }}</span>
                        </div>
                    </div>

                    <!-- KETERANGAN DONATUR PRIORITAS -->
                    <div v-if="isPriorityDonator" class="mt-3 p-3 text-center bg-gradient-to-r from-amber-500/20 to-yellow-600/20 border border-amber-500/30 rounded-xl text-xs font-bold text-amber-400 tracking-wide animate-pulse">
                        ⭐ Anda adalah donatur prioritas
                    </div>
                </div>

                <!-- 3. PROFIL DONATUR -->
                <div class="space-y-4">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-stone-500 flex items-center gap-2">
                       <span class="size-4 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[8px]">2</span>
                       Identitas Donatur
                    </label>
                    <div class="grid grid-cols-12 gap-3">
                        <select 
                            v-model="form.sapaan"
                            class="col-span-4 bg-stone-900 border border-stone-800 rounded-2xl p-4 text-sm text-stone-300 outline-none"
                        >
                            <option v-for="s in sapaanOptions" :key="s" :value="s">{{ s }}</option>
                        </select>
                        <input 
                            v-model="form.atas_nama"
                            type="text"
                            placeholder="Atas Nama"
                            :disabled="form.is_anonymous"
                            class="col-span-8 bg-stone-900 border border-stone-800 rounded-2xl p-4 text-sm text-stone-300 outline-none disabled:opacity-30"
                        />
                    </div>
                    
                    <label class="flex items-center gap-3 cursor-pointer group">
                        <div class="relative flex items-center">
                            <input type="checkbox" v-model="form.is_anonymous" class="sr-only">
                            <div class="size-5 rounded-lg border border-stone-700 transition-colors" :class="form.is_anonymous ? 'bg-amber-500 border-amber-500' : 'bg-stone-900 group-hover:border-stone-500'">
                                <Check v-if="form.is_anonymous" class="size-4 text-stone-950 font-bold" />
                            </div>
                        </div>
                        <span class="text-xs text-stone-400">Sembunyikan nama saya (Hamba Allah)</span>
                    </label>
                </div>

                <!-- 4. PESAN -->
                <div class="space-y-2">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-stone-500">No. WhatsApp</label>
                    <input 
                        v-model="form.no_wa" 
                        type="text" 
                        inputmode="numeric" 
                        placeholder="85950540055 tanpa angka 0" 
                        class="w-full bg-stone-900 border border-stone-800 rounded-2xl p-4 text-sm text-stone-300 outline-none focus:border-amber-500/40"
                    >
                </div>

                <!-- 4. PESAN -->
                <div class="space-y-2">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-stone-500">Doa & Pesan (Opsional)</label>
                    <textarea v-model="form.notes" rows="3" class="w-full bg-stone-900 border border-stone-800 rounded-2xl p-4 text-sm text-stone-300 outline-none focus:border-amber-500/40"></textarea>
                </div>

                <label class="text-[10px] font-bold uppercase tracking-widest text-stone-500 flex items-center gap-2">
                    <span class="size-4 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[8px]">3</span>
                    Scan QRIS & Konfirmasi
                </label>
                <!-- 5. RINGKASAN & QRIS -->
                <div class="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden -mt-3">
                    <div class="p-6 space-y-4">
                        <p class="text-[10px] font-black uppercase tracking-tighter text-amber-500">Ringkasan Donasi</p>
                        
                        <div class="space-y-2 text-xs">
                            <div class="flex justify-between">
                                <span class="text-stone-500">Program</span>
                                <span class="text-stone-200 text-right font-medium max-w-[150px] line-clamp-1">{{ donasi.judul }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-stone-500">Atas Nama</span>
                                <span class="text-stone-200">{{ form.sapaan }} {{ displayAtasNama }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-stone-500">No. WhatsApp</span>
                                <span class="text-stone-200">{{ form.no_wa }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-stone-500">Nominal Donasi</span>
                                <span class="text-stone-200">{{ formatCurrency(parseInt(form.nominal) || 0) }}</span>
                            </div>
                            <div class="flex justify-between text-emerald-400/80">
                                <span class="italic">Infaq Sistem</span>
                                <span>{{ formatCurrency(form.infaq_sistem) }}</span>
                            </div>
                            <div class="pt-2 border-t border-stone-800 flex justify-between text-base font-black">
                                <span class="text-stone-400 uppercase">Total</span>
                                <span class="text-amber-500">{{ formatCurrency(totalPembayaran) }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- QRIS Placeholder -->
                    <div class="p-6 flex flex-col items-center gap-4">
                        <img 
                            src="/QRIS_MUHASABAH_ID.png" 
                            alt="QRIS QR Code" 
                            class="w-full object-cover rounded-lg"
                        />
                        <p class="text-[10px] text-stone-400 font-bold tracking-widest uppercase">Scan QRIS Untuk Donasi</p>
                    </div>
                </div>

                <!-- 6. UPLOAD BUKTI DONASI -->
                <div class="space-y-3">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-stone-500 flex items-center gap-2">
                        <Upload class="size-3.5 text-amber-500" /> Upload Bukti Transfer / Donasi (Opsional)
                    </label>
                    <div class="relative flex items-center justify-center w-full">
                        <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-3xl cursor-pointer transition-all bg-stone-900 border-stone-800 hover:border-amber-500/40">
                            <div class="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                                <template v-if="!form.bukti_donasi">
                                    <Upload class="size-6 text-stone-500 mb-2" />
                                    <p class="text-xs text-stone-400 font-medium">Klik untuk upload atau drag bukti transaksi</p>
                                    <p class="text-[10px] text-stone-500 mt-1">Format gambar (PNG, JPG, JPEG, WEBP)</p>
                                </template>
                                <template v-else>
                                    <FileText class="size-6 text-amber-500 mb-2" />
                                    <p class="text-xs text-amber-400 font-bold max-w-[250px] truncate">{{ form.bukti_donasi.name }}</p>
                                    <p class="text-[10px] text-stone-400 mt-1">Klik untuk mengganti gambar</p>
                                </template>
                            </div>
                            <input 
                                type="file" 
                                accept="image/*" 
                                class="hidden" 
                                @change="handleFileChange"
                            />
                        </label>
                    </div>
                    <div v-if="form.errors.bukti_donasi" class="text-red-500 text-xs mt-1">{{ form.errors.bukti_donasi }}</div>
                </div>

                <!-- INFO AMAN -->
                <div class="flex gap-3 px-2">
                    <ShieldCheck class="size-5 text-emerald-500 shrink-0" />
                    <p class="text-xs text-stone-500 leading-relaxed italic">
                        Donasi ini diproses secara aman. Anda akan dialihkan ke halaman riwayat donasi setelah menekan tombol selesai.
                    </p>
                </div>

                <!-- BUTTON SELESAI -->
                <button 
                    type="submit"
                    :disabled="form.processing"
                    class="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-stone-800 text-stone-950 font-black py-5 rounded-2xl transition-all active:scale-95 shadow-xl shadow-amber-500/20"
                >
                    {{ form.processing ? 'SEDANG MEMPROSES...' : 'SELESAI' }}
                </button>

            </form>

        </div>
    </AppLayoutPublic>
</template>