<script setup lang="ts">
import { Head, useForm, Link } from '@inertiajs/vue3'
import { computed, ref, watch, onUnmounted } from 'vue'
import { Heart, Wallet, ShieldCheck, Check, User, Info, Upload, FileText, Ticket, CheckCircle2, Camera } from 'lucide-vue-next'
import AppLayoutPublic from '@/layouts/AppLayoutPublic.vue'
import QrcodeVue from 'qrcode.vue' // <-- IMPORT LIBRARY QR CODE

// Struktur properti baru yang membawa relasi variants dari backend
const props = defineProps<{
    acara: {
        id: number
        judul: string
        slug: string
        subkategori: string
        accept_tiket: boolean | number
        kuota_tiket: number
        tiket_terjual: number
        accept_donasi: boolean | number
        target_donasi: number
        panduan_acara?: string
        variants: Array<{
            id: number
            nama_varian: string
            harga: number
            jumlah_kursi: number
        }>
    }
}>()

// State Tipe Kontribusi: 'tiket' atau 'donasi'
const jenisKontribusi = ref<'tiket' | 'donasi'>(Boolean(props.acara.accept_tiket) ? 'tiket' : 'donasi')

// Menyimpan ID Varian yang dipilih user (Default: ambil ID varian pertama jika ada)
const variantTerpilihId = ref<number | null>(props.acara.variants && props.acara.variants.length > 0 ? props.acara.variants[0].id : null)

// Inisialisasi Form Payload Inertia
const form = useForm({
    buy_type: jenisKontribusi.value,
    acara_variant_id: variantTerpilihId.value,
    nominal: '', 
    infaq_sistem: 5000 as number | string, // Mengizinkan ID string untuk persentase
    no_wa: '',
    sapaan: 'Kak',
    atas_nama: '',
    is_anonymous: false,
    notes: '',
    payment_method: 'transfer', 
    rekening: 'qris_gopay', 
    bukti_transaksi: null as File | null,
})

// Melacak detail objek dari varian yang sedang aktif dipilih user
const detailVariantAktif = computed(() => {
    if (jenisKontribusi.value !== 'tiket' || !variantTerpilihId.value) return null
    return props.acara.variants.find(v => v.id === variantTerpilihId.value) || null
})

// Sinkronisasi otomatis saat user berpindah tab kontribusi
watch(jenisKontribusi, (newType) => {
    form.buy_type = newType
    if (newType === 'tiket') {
        form.is_anonymous = false
        form.acara_variant_id = variantTerpilihId.value
        form.nominal = detailVariantAktif.value ? detailVariantAktif.value.harga.toString() : '0'
    } else {
        form.acara_variant_id = null
        form.nominal = '' // Kosongkan agar donatur input manual
    }
}, { immediate: true })

// Sinkronisasi nominal otomatis saat user mengubah jenis pilihan varian radio button
watch(variantTerpilihId, (newId) => {
    if (jenisKontribusi.value === 'tiket' && newId) {
        form.acara_variant_id = newId
        const selected = props.acara.variants.find(v => v.id === newId)
        form.nominal = selected ? selected.harga.toString() : '0'
    }
})

// Fungsi format Rupiah masking pada ketikan text input
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

const quickAmounts = [10000, 25000, 50000, 100000, 250000, 500000]
const sapaanOptions = ['Bpk.', 'Ibu', 'Kak', 'Sdr.']

// Opsi Potongan Persentase (Deducted)
const percentageInfaqOptions = [
    { percent: 0.02, label: 'diambil 2%' },
    { percent: 0.05, label: 'diambil 5%' },
    { percent: 0.07, label: 'diambil 7%' },
    { percent: 0.10, label: 'diambil 10%' },
];

// Opsi Nominal Tetap Tambahan (Added)
const baseInfaqOptions = [
    { value: 5000, label: 'administrasi' },
    { value: 10000, label: 'administrasi' },
    { value: 20000, label: 'administrasi + server' },
    { value: 30000, label: 'administrasi + server' },
    { value: 40000, label: 'adm + server + eksekusi lapangan' },
    { value: 50000, label: 'adm + server + eksekusi lapangan' },
    { value: 100000, label: '50% muhasabah.id + 50% relawan' },
];

/* =======================
   KONFIGURASI OPSI INFAQ
======================= */
const computedInfaqOptions = computed(() => {
    const nominalNum = parseInt(form.nominal.toString().replace(/\D/g, '')) || 0;
    
    // 1. Inisialisasi opsi paling pertama dengan "Tanpa Infaq" (Value: 0)
    let options: Array<{id: string | number, value: number, label: string, type: 'added' | 'deducted'}> = [
        { id: 0, value: 0, label: 'tanpa infaq', type: 'added' }
    ];

    // 2. Loop dan tambahkan opsi persentase (deducted) 
    // HANYA JIKA TIPE KONTRIBUSI ADALAH 'DONASI'
    if (nominalNum > 0 && jenisKontribusi.value === 'donasi') {
        percentageInfaqOptions.forEach(opt => {
            const deductionValue = Math.floor(nominalNum * opt.percent);
            if (deductionValue > 0) {
                options.push({
                    id: `${opt.percent * 100}_percent`, 
                    value: deductionValue,
                    label: `${opt.label} dari donasi`,
                    type: 'deducted'
                });
            }
        });
    }

    // Helper untuk menambah opsi base tanpa duplikasi (sifatnya ADDED / ditambah ke total)
    const addOption = (val: number, lbl: string) => {
        if (!options.some(opt => opt.value === val && opt.type === 'added')) {
            options.push({ id: val, value: val, label: lbl, type: 'added' });
        }
    };

    // 3. Logika tambahan untuk Nominal Tetap (Added) yang berlaku untuk Tiket & Donasi
    if (nominalNum > 45000 || nominalNum === 0) {
        addOption(3000, 'administrasi');
        baseInfaqOptions.forEach(opt => addOption(opt.value, opt.label));
        return options;
    }

    const tenPercent = Math.floor(nominalNum * 0.1);
    const twentyPercent = Math.floor(nominalNum * 0.2);

    if (tenPercent > 0) addOption(tenPercent, 'administrasi');
    if (twentyPercent > 0 && twentyPercent !== tenPercent) addOption(twentyPercent, 'administrasi');
    if (!options.some(opt => opt.value === 3000)) addOption(3000, 'administrasi');

    baseInfaqOptions.forEach(opt => {
        if (!options.some(existing => existing.value === opt.value && existing.type === 'added')) {
            addOption(opt.value, opt.label);
        }
    });

    return options;
});

// WATCHER HARUS BERADA DI LUAR COMPUTED
watch(computedInfaqOptions, (newOptions) => {
    const exists = newOptions.some(opt => opt.id === form.infaq_sistem);
    if (!exists && newOptions.length > 0) {
        form.infaq_sistem = newOptions[0].id; // Akan otomatis mereset ke 'tanpa infaq' jika id sebelumnya tidak ada
    }
}, { immediate: true });

/* =======================
   LOGIKA PERHITUNGAN
======================= */
const selectedInfaq = computed(() => {
    return computedInfaqOptions.value.find(opt => opt.id === form.infaq_sistem) || computedInfaqOptions.value[0];
});

const finalNominal = computed(() => {
    const nominalNum = parseInt(form.nominal.toString().replace(/\D/g, '')) || 0;
    
    // PENGAMAN: Jika skema TIKET, pastikan nominal utuh agar sesuai dengan harga DB (lolos validasi)
    if (jenisKontribusi.value === 'tiket') {
        return nominalNum;
    }

    // Jika skema DONASI dan memilih pemotongan
    if (selectedInfaq.value?.type === 'deducted') {
        return nominalNum - selectedInfaq.value.value;
    }
    
    return nominalNum;
});

const finalInfaq = computed(() => {
    return selectedInfaq.value?.value || 0;
});

const totalPembayaran = computed(() => {
    return finalNominal.value + finalInfaq.value;
});

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(val)
}

const displayAtasNama = computed(() => {
    if (form.is_anonymous && jenisKontribusi.value === 'donasi') return 'Hamba Allah'
    return form.atas_nama || '...'
})

/* =======================================
   ALGORITMA QRIS DINAMIS (FRONTEND ONLY)
======================================= */
const dynamicQrisString = computed(() => {
    const amount = totalPembayaran.value;
    // Ini adalah string QRIS Statis mentah
    const baseQris = "00020101021126610014COM.GO-JEK.WWW01189360091438029302900210G8029302900303UMI51440014ID.CO.QRIS.WWW0215ID10265182630370303UMI5204839853033605802ID5925muhasabah id, Sosial Kema6006KENDAL61055135562070703A0163041A3A";
    
    if (amount <= 0) return baseQris; 

    // 1. Hapus CRC lama di 4 digit terakhir ('1A3A')
    let qris = baseQris.slice(0, -4);
    
    // 2. Ubah dari Statis (11) menjadi Dinamis (12)
    qris = qris.replace("010211", "010212");
    
    // 3. Bangun Tag 54 (Nominal)
    const amtStr = amount.toString();
    const amtLen = amtStr.length.toString().padStart(2, '0'); // Panjang digit nominal (misal 5 digit = '05')
    const tag54 = `54${amtLen}${amtStr}`;
    
    // 4. Sisipkan Tag 54 tepat setelah kode IDR (5303360)
    qris = qris.replace("5303360", `5303360${tag54}`);
    
    // 5. Kalkulasi ulang CRC-16 (Standar CCITT-FALSE)
    let crc = 0xFFFF;
    for (let c = 0; c < qris.length; c++) {
        crc ^= qris.charCodeAt(c) << 8;
        for (let i = 0; i < 8; i++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc = crc << 1;
            }
        }
    }
    const crcHex = (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    
    // 6. Gabungkan string dengan CRC baru
    return qris + crcHex;
});

function submit() {
    form.no_wa = form.no_wa.toString();
    
    form.transform((data) => ({
        ...data,
        nominal: finalNominal.value,
        infaq_sistem: finalInfaq.value,
    })).post(`/acara/${props.acara.slug}/payment`, {
        preserveScroll: true,
        onError: (errors) => {
            console.error(errors);
        }
    });
}

// --- STATE & FUNGSI KAMERA ---
const isCameraOpen = ref(false)
const videoElement = ref<HTMLVideoElement | null>(null)
const canvasElement = ref<HTMLCanvasElement | null>(null)
const cameraStream = ref<MediaStream | null>(null)
const imageUrl = ref<string | null>(null) 

const openCamera = async () => {
    isCameraOpen.value = true
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
        })
        cameraStream.value = stream
        
        setTimeout(() => {
            if (videoElement.value) {
                videoElement.value.srcObject = stream
            }
        }, 100)
    } catch (err) {
        console.error("Akses kamera ditolak atau error:", err)
        alert("Gagal mengakses kamera. Pastikan browser memiliki izin akses kamera.")
        isCameraOpen.value = false
    }
}

const closeCamera = () => {
    if (cameraStream.value) {
        cameraStream.value.getTracks().forEach(track => track.stop())
        cameraStream.value = null
    }
    isCameraOpen.value = false
}

const takePhoto = () => {
    if (videoElement.value && canvasElement.value) {
        const video = videoElement.value
        const canvas = canvasElement.value
        
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        const context = canvas.getContext('2d')
        if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height)
            
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], `bukti_transaksi_${Date.now()}.jpg`, { type: 'image/jpeg' })
                    
                    form.bukti_transaksi = file // Menggunakan form.bukti_transaksi sesuai dengan nama variabel di AcaraPayment
                    imageUrl.value = URL.createObjectURL(file)
                    
                    closeCamera()
                }
            }, 'image/jpeg', 0.8) 
        }
    }
}

// Modifikasi handleFileChange agar memunculkan preview gambar saat upload dari galeri
const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        const file = target.files[0];
        form.bukti_transaksi = file;
        imageUrl.value = URL.createObjectURL(file);
    }
};

onUnmounted(() => {
    closeCamera()
})
</script>

<template>
    <Head :title="`Form Checkout: ${acara.judul}`" />
    <AppLayoutPublic :subtitle="acara.subkategori" :title="acara.judul" :show-back="true" :back-href="`/acara/${acara.slug}`">
        
        <div class="px-5 py-8 max-w-2xl mx-auto space-y-8 pb-32">
            
            <div class="text-center space-y-2">
                <div class="inline-flex p-3 rounded-full bg-amber-500/10 border border-amber-500/20 mb-2">
                    <Ticket v-if="jenisKontribusi === 'tiket'" class="size-6 text-amber-400" />
                    <Heart v-else class="size-6 text-amber-500 fill-amber-500" />
                </div>
                <h1 class="text-xl font-bold text-stone-100">Lengkapi Komitmen Kontribusi</h1>
                <p class="text-xs text-stone-500">{{ Boolean(acara.accept_donasi) ? 'Pilih skema kehadiran atau partisipasi pendanaan di bawah ini.' : 'Pilih skema kehadiran di bawah ini.' }}</p>
            </div>

            <div v-if="Boolean(acara.accept_tiket) && Boolean(acara.accept_donasi)" class="grid grid-cols-2 p-1.5 bg-stone-900/80 border border-stone-800 rounded-2xl gap-1">
                <button 
                    type="button"
                    @click="jenisKontribusi = 'tiket'"
                    :class="['flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all select-none', jenisKontribusi === 'tiket' ? 'bg-amber-600 text-white shadow-md' : 'text-stone-400 hover:text-stone-200']"
                >
                    <Ticket class="size-4" />
                    Pesan Tiket Acara
                </button>
                <button 
                    type="button"
                    @click="jenisKontribusi = 'donasi'"
                    :class="['flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all select-none', jenisKontribusi === 'donasi' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-stone-400 hover:text-stone-200']"
                >
                    <Heart class="size-4" />
                    Donatur / Sponsor
                </button>
            </div>

            <form @submit.prevent="submit" class="space-y-8">
                
                <div v-if="jenisKontribusi === 'tiket'" class="space-y-4">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                        <span class="size-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[8px]">1</span>
                        <Ticket class="size-3.5 text-amber-400" /> Pilih Jenis Paket Tiket Kehadiran
                    </label>
                    
                    <div class="grid grid-cols-1 gap-3">
                        <div 
                            v-for="v in acara.variants" 
                            :key="v.id"
                            @click="variantTerpilihId = v.id"
                            class="p-4 rounded-2xl border bg-stone-900/50 cursor-pointer transition-all flex items-center justify-between group"
                            :class="variantTerpilihId === v.id ? 'border-amber-500/60 bg-amber-500/5' : 'border-stone-800 hover:border-stone-700'"
                        >
                            <div class="flex items-center gap-4">
                                <div class="size-5 rounded-full border border-stone-700 flex items-center justify-center shrink-0 bg-stone-950">
                                    <div v-if="variantTerpilihId === v.id" class="size-2.5 rounded-full bg-amber-500"></div>
                                </div>
                                <div>
                                    <span class="text-sm font-bold text-stone-100 block group-hover:text-amber-400 transition-colors">
                                        {{ v.nama_varian }}
                                    </span>
                                    <span class="text-xs text-stone-500 font-medium">
                                        Tiket: <span class="text-stone-300 font-mono ms-1">{{ v.jumlah_kursi }} Kursi</span>
                                    </span>
                                </div>
                            </div>
                            <div class="text-right">
                                <span class="text-sm font-black text-amber-400 font-mono">
                                    {{ v.harga == 0 ? 'GRATIS' : formatCurrency(v.harga) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="jenisKontribusi === 'donasi'" class="space-y-4">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-stone-500 flex items-center gap-2">
                       <span class="size-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[8px]">1</span>
                       Nominal Dukungan Dana
                    </label>

                    <div v-if="acara.panduan_acara && jenisKontribusi === 'donasi'" class="flex gap-2.5 items-start p-3.5 rounded-2xl bg-stone-900/40 border border-stone-800 text-stone-400 text-xs leading-relaxed">
                        <Info class="size-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                            <span class="font-bold text-stone-300 block mb-0.5">Panduan Donasi:</span>
                            {{ acara.panduan_acara }}
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
                            placeholder="Masukkan nominal donasi operasional..."
                            class="w-full bg-stone-900 border border-stone-800 rounded-2xl py-4 pl-12 pr-4 text-lg font-bold text-amber-400 outline-none focus:border-amber-500/40"
                            required
                        />
                    </div>
                </div>

                <div class="space-y-4 bg-stone-900/40 border border-stone-800/80 p-5 rounded-3xl">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                        <Info class="size-3.5 text-amber-400" /> Infaq Sistem
                    </label>
                    <div class="grid grid-cols-1 gap-2">
                        <div 
                            v-for="opt in computedInfaqOptions" 
                            :key="opt.id"
                            @click="form.infaq_sistem = opt.id"
                            class="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all"
                            :class="form.infaq_sistem === opt.id ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' : 'bg-stone-950/60 border-stone-800/50 text-stone-500'"
                        >
                            <div class="flex items-center gap-2.5">
                                <div class="size-3.5 rounded-full border border-stone-700 flex items-center justify-center shrink-0">
                                    <div v-if="form.infaq_sistem === opt.id" class="size-1.5 rounded-full bg-amber-500"></div>
                                </div>
                                <span class="text-xs font-bold font-mono">{{ formatCurrency(opt.value) }}</span>
                            </div>
                            <span class="text-right text-[9px] italic opacity-50 ps-2">{{ opt.label }}</span>
                        </div>
                    </div>
                </div>

                <div class="space-y-4">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-stone-500 flex items-center gap-2">
                       <span class="size-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[8px]">2</span>
                       Identitas Penanggung Jawab
                    </label>
                    <div class="grid grid-cols-12 gap-3">
                        <select 
                            v-model="form.sapaan"
                            class="col-span-4 bg-stone-900 border border-stone-800 rounded-2xl p-4 text-xs font-bold text-stone-300 outline-none"
                        >
                            <option v-for="s in sapaanOptions" :key="s" :value="s">{{ s }}</option>
                        </select>
                        <input 
                            v-model="form.atas_nama"
                            type="text"
                            placeholder="Nama Lengkap Sesuai KTP"
                            :disabled="form.is_anonymous && jenisKontribusi === 'donasi'"
                            required
                            class="col-span-8 bg-stone-900 border border-stone-800 rounded-2xl p-4 text-xs font-medium text-stone-300 outline-none disabled:opacity-30"
                        />
                    </div>
                    
                    <label v-if="jenisKontribusi === 'donasi'" class="flex items-center gap-3 cursor-pointer group select-none">
                        <div class="relative flex items-center">
                            <input type="checkbox" v-model="form.is_anonymous" class="sr-only">
                            <div class="size-5 rounded-lg border border-stone-700 transition-colors" :class="form.is_anonymous ? 'bg-amber-500 border-amber-500' : 'bg-stone-900 group-hover:border-stone-500'">
                                <Check v-if="form.is_anonymous" class="size-4 text-stone-950 font-bold" />
                            </div>
                        </div>
                        <span class="text-xs text-stone-400">Sembunyikan profil saya di daftar publik (Hamba Allah)</span>
                    </label>
                </div>

                <div class="space-y-2">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-stone-500">Nomor WhatsApp Aktif</label>
                    <input 
                        v-model="form.no_wa" 
                        type="text" 
                        inputmode="numeric" 
                        placeholder="Contoh: 08123456789" 
                        class="w-full bg-stone-900 border border-stone-800 rounded-2xl p-4 text-sm font-mono text-stone-300 outline-none focus:border-amber-500/40"
                        required
                    >
                </div>

                <div class="space-y-2">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                        {{ jenisKontribusi === 'tiket' ? 'Catatan Kehadiran / Kebutuhan Khusus' : 'Pesan Dukungan & Doa Mulia' }}
                    </label>
                    <textarea 
                        v-model="form.notes" 
                        :placeholder="jenisKontribusi === 'tiket' ? 'Contoh: Hadir bersama keluarga / Butuh kursi baris depan' : 'Tuliskan doa atau dukungan motivasi untuk panitia'" 
                        rows="3" 
                        required 
                        class="w-full bg-stone-900 border border-stone-800 rounded-2xl p-4 text-sm text-stone-300 outline-none focus:border-amber-500/40"
                    ></textarea>
                </div>

                <div v-if="totalPembayaran > 0" class="space-y-4">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-stone-500 flex items-center gap-2">
                        <span class="size-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[8px]">3</span>
                        Instruksi Penyelesaian Pembayaran QRIS
                    </label>
                    
                    <div class="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden -mt-1">
                        <div class="p-6 space-y-4">
                            <p class="text-[10px] font-black uppercase tracking-wider text-amber-400">Kalkulasi Tagihan Faktur</p>
                            
                            <div class="space-y-2 text-xs">
                                <div class="flex justify-between">
                                    <span class="text-stone-500">Nama Agenda</span>
                                    <span class="text-stone-200 text-right font-medium max-w-[180px] truncate">{{ acara.judul }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-stone-500">Pendaftar</span>
                                    <span class="text-stone-200">{{ form.sapaan }} {{ displayAtasNama }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-stone-500">Tipe Kontribusi</span>
                                    <span class="text-stone-200 font-bold capitalize">{{ form.buy_type }}</span>
                                </div>
                                <div v-if="jenisKontribusi === 'tiket' && detailVariantAktif" class="flex justify-between bg-stone-950/40 p-2 rounded-lg my-1 border border-stone-800/60">
                                    <span class="text-amber-400/90 font-medium">Paket Pilihan</span>
                                    <span class="text-amber-400 font-bold font-sans text-right">
                                        {{ detailVariantAktif.nama_varian }} ({{ detailVariantAktif.jumlah_kursi }} Kursi)
                                    </span>
                                </div>
                                <!-- IMPLEMENTASI FINAL NOMINAL -->
                                <div class="flex justify-between">
                                    <span class="text-stone-500">Nominal Pokok</span>
                                    <span class="text-stone-200 font-mono">{{ formatCurrency(finalNominal) }}</span>
                                </div>
                                <!-- IMPLEMENTASI FINAL INFAQ -->
                                <div class="flex justify-between text-amber-400/80">
                                    <span class="italic">Infaq Sistem</span>
                                    <span class="font-mono">{{ formatCurrency(finalInfaq) }}</span>
                                </div>
                                <div class="pt-2 border-t border-stone-800 flex justify-between text-base font-black">
                                    <span class="text-stone-400 uppercase">Total Transfer</span>
                                    <span class="text-amber-400 font-mono">{{ formatCurrency(totalPembayaran) }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- IMPLEMENTASI VUE QRCODE -->
                        <div class="p-6 pt-4 flex flex-col items-center gap-4 bg-stone-950 border-t border-stone-800/60">
                            <p class="text-base font-bold font-mono text-white">
                                MUHASABAH ID
                            </p>
                            <p class="text-base font-bold font-mono text-white -mt-4">
                                Sosial Kemanusian
                            </p>
                            <!-- Latar belakang diatur ke putih agar mudah di-scan -->
                            <div class="p-3 rounded-2xl transition-all" :class="{'opacity-50 blur-sm pointer-events-none': totalPembayaran <= 0}">
                                <qrcode-vue 
                                    :value="dynamicQrisString" 
                                    :size="200" 
                                    level="M" 
                                    render-as="svg" 
                                    foreground="#f59e0b" 
                                    background="transparent"
                                />
                            </div>
                            <p class="text-[10px] text-stone-500 font-bold tracking-widest uppercase text-center mt-1">
                                Pindai QRIS Menggunakan e-Wallet atau m-Banking Anda
                            </p>
                        </div>
                    </div>

                    <div class="space-y-3">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-stone-500 flex items-center gap-2">
                            <Upload class="size-3.5 text-amber-400" /> Lampirkan Bukti Transaksi (Opsional)
                        </label>
                        
                        <div v-if="!isCameraOpen" class="w-full">
                            <!-- Area jika gambar sudah dipilih -->
                            <div v-if="imageUrl" class="relative w-full h-32 rounded-3xl overflow-hidden border-2 border-dashed border-amber-500/50 bg-amber-500/5 flex items-center justify-center">
                                <img :src="imageUrl" class="h-full object-contain" />
                                <button @click.prevent="imageUrl = null; form.bukti_transaksi = null" class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-colors">
                                    <X class="w-4 h-4" />
                                </button>
                            </div>

                            <!-- Area jika belum ada gambar -->
                            <div v-else class="flex flex-col gap-3">
                                <label class="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-3xl cursor-pointer transition-all bg-stone-900 border-stone-800 hover:border-amber-500/30">
                                    <div class="flex flex-col items-center justify-center pt-2">
                                        <Upload class="size-5 text-stone-500 mb-2" />
                                        <p class="text-xs text-stone-400 font-medium">Pilih dari Galeri</p>
                                    </div>
                                    <input type="file" accept="image/*" class="hidden" @change="handleFileChange" />
                                </label>

                                <button type="button" @click="openCamera" class="w-full flex items-center justify-center gap-2 py-3 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-2xl font-medium border border-stone-800 transition-all text-xs">
                                    <Camera class="w-4 h-4 text-amber-500" />
                                    <span>Ambil Foto Langsung</span>
                                </button>
                            </div>
                        </div>

                        <!-- Area Kamera -->
                        <div v-if="isCameraOpen" class="relative w-full aspect-[3/4] sm:aspect-video rounded-3xl overflow-hidden bg-black border border-stone-800 shadow-xl">
                            <video ref="videoElement" autoplay playsinline class="w-full h-full object-cover"></video>
                            
                            <div class="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between">
                                <button type="button" @click="closeCamera" class="text-stone-300 hover:text-white px-4 py-2 text-xs font-bold">
                                    BATAL
                                </button>
                                <button type="button" @click="takePhoto" class="bg-amber-500 hover:bg-amber-400 text-stone-950 px-5 py-2.5 rounded-full text-xs font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2">
                                    <Camera class="w-4 h-4" />
                                    JEPRET
                                </button>
                            </div>
                            <canvas ref="canvasElement" class="hidden"></canvas>
                        </div>

                        <div v-if="form.errors.bukti_transaksi" class="text-red-500 text-xs mt-1">{{ form.errors.bukti_transaksi }}</div>
                    </div>                  
                </div>

                <div v-else class="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex gap-3 items-center">
                    <ShieldCheck class="size-5 text-emerald-400 shrink-0" />
                    <p class="text-xs text-stone-400 leading-normal">
                        Anda memilih agenda pendaftaran gratis tanpa infaq tambahan. Akun manifest akan langsung aktif setelah menekan tombol selesai.
                    </p>
                </div>

                <div class="flex gap-3 px-2 pt-2 border-t border-stone-900">
                    <ShieldCheck class="size-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p class="text-xs text-stone-500 leading-relaxed italic">
                        Dengan menekan tombol selesai, data Anda akan diverifikasi oleh panitia pelaksana kegiatan demi ketertiban administrasi.
                    </p>
                </div>

                <button 
                    type="submit"
                    :disabled="form.processing"
                    class="w-full disabled:bg-stone-800 font-black py-4 rounded-2xl transition-all active:scale-95 shadow-xl"
                    :class="[
                        jenisKontribusi === 'tiket' 
                            ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-amber-600/10' 
                            : 'bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-amber-500/10'
                    ]"
                >
                    {{ form.processing ? 'SEDANG MEMPROSES PENDAFTARAN...' : 'SELESAI' }}
                </button>

            </form>

        </div>
    </AppLayoutPublic>
</template>