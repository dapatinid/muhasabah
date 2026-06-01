<script setup lang="ts">
import { Head, useForm, Link } from '@inertiajs/vue3'
import { computed, ref, watch, onUnmounted } from 'vue'
import { Heart, Wallet, ShieldCheck, Check, User, Info, Upload, FileText, Camera } from 'lucide-vue-next'
import AppLayoutPublic from '@/layouts/AppLayoutPublic.vue'
import QrcodeVue from 'qrcode.vue' // <-- IMPORT LIBRARY QR CODE

const props = defineProps<{
    donasi: {
        id: number;
        judul: string;
        slug: string;
        panduan_donasi?: string;
    }
}>()

const form = useForm({
    nominal: '',
    infaq_sistem: 5000 as number | string,
    no_wa: '',
    sapaan: 'Kak',
    atas_nama: '',
    is_anonymous: false,
    notes: '',
    payment_method: 'transfer', 
    rekening: 'qris_gopay', 
    bukti_donasi: null as File | null,
})

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

const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        form.bukti_donasi = target.files[0];
    }
};

const isPriorityDonator = computed(() => {
    return form.infaq_sistem === 100000;
});

const quickAmounts = [10000, 25000, 50000, 100000, 250000, 500000]

/* =======================
   KONFIGURASI OPSI INFAQ
======================= */
const percentageInfaqOptions = [
    { percent: 0.02, label: 'diambil 2% dari donasi' },
    { percent: 0.05, label: 'diambil 5% dari donasi' },
    { percent: 0.07, label: 'diambil 7% dari donasi' },
    { percent: 0.10, label: 'diambil 10% dari donasi' },
];

const baseInfaqOptions = [
    { value: 5000, label: 'administrasi' },
    { value: 10000, label: 'administrasi' },
    { value: 20000, label: 'administrasi + server' },
    { value: 30000, label: 'administrasi + server' },
    { value: 40000, label: 'adm + server + eksekusi lapangan' },
    { value: 50000, label: 'adm + server + eksekusi lapangan' },
    { value: 100000, label: '50% muhasabah.id + 50% relawan' },
];

const computedInfaqOptions = computed(() => {
    const nominalNum = parseInt(form.nominal.toString().replace(/\D/g, '')) || 0;
    
    let options: Array<{id: string | number, value: number, label: string, type: 'added' | 'deducted'}> = [
        { id: 0, value: 0, label: 'tanpa infaq', type: 'added' }
    ];

    if (nominalNum > 0) {
        percentageInfaqOptions.forEach(opt => {
            const deductionValue = Math.floor(nominalNum * opt.percent);
            if (deductionValue > 0) {
                options.push({
                    id: `${opt.percent * 100}_percent`, 
                    value: deductionValue,
                    label: opt.label,
                    type: 'deducted'
                });
            }
        });
    }

    const addOption = (val: number, lbl: string) => {
        if (!options.some(opt => opt.value === val && opt.type === 'added')) {
            options.push({ id: val, value: val, label: lbl, type: 'added' });
        }
    };

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

watch(computedInfaqOptions, (newOptions) => {
    const exists = newOptions.some(opt => opt.id === form.infaq_sistem);
    if (!exists && newOptions.length > 0) {
        form.infaq_sistem = newOptions[0].id;
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

const sapaanOptions = ['Bpk.', 'Ibu', 'Kak']

const displayAtasNama = computed(() => {
    if (form.is_anonymous) return 'Hamba Allah'
    return form.atas_nama || '...'
})

/* =======================================
   ALGORITMA QRIS DINAMIS (FRONTEND ONLY)
======================================= */
const dynamicQrisString = computed(() => {
    const amount = totalPembayaran.value;
    // Ini adalah string QRIS Statis mentah Anda dari gambar sebelumnya
    const baseQris = "00020101021126610014COM.GO-JEK.WWW01189360091438029302900210G8029302900303UMI51440014ID.CO.QRIS.WWW0215ID10265182630370303UMI5204839853033605802ID5925muhasabah id, Sosial Kema6006KENDAL61055135562070703A0163041A3A";
    
    // Jika belum ada input, tampilkan QRIS Statis asli
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
    
    // 5. Kalkulasi ulang CRC-16 (Standar CCITT-FALSE / 0x1021 / 0xFFFF)
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
    // Konversi hasil int ke Hexadecimal 4 digit
    const crcHex = (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    
    // 6. Gabungkan string dengan CRC baru
    return qris + crcHex;
});

function submit() {
    form.no_wa = form.no_wa.toString();
    
    // Transform data sebelum di POST ke backend
    form.transform((data) => ({
        ...data,
        nominal: finalNominal.value,
        infaq_sistem: finalInfaq.value,
    })).post(`/donasi/${props.donasi.slug}/payment`, {
        preserveScroll: true,
        onError: (errors) => {
            console.log(errors);
        }
    });
}

// State untuk Kamera
const isCameraOpen = ref(false)
const videoElement = ref<HTMLVideoElement | null>(null)
const canvasElement = ref<HTMLCanvasElement | null>(null)
const cameraStream = ref<MediaStream | null>(null)

// State untuk preview gambar (Mungkin Anda sudah punya ini, sesuaikan saja)
const imageUrl = ref<string | null>(null) 

// Fungsi Membuka Kamera
const openCamera = async () => {
    isCameraOpen.value = true
    try {
        // Minta akses kamera (facingMode: 'environment' memprioritaskan kamera belakang di HP)
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
        })
        cameraStream.value = stream
        
        // Pasang stream ke elemen video setelah DOM ter-render
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

// Fungsi Menutup Kamera
const closeCamera = () => {
    if (cameraStream.value) {
        cameraStream.value.getTracks().forEach(track => track.stop())
        cameraStream.value = null
    }
    isCameraOpen.value = false
}

// Fungsi Mengambil Foto
const takePhoto = () => {
    if (videoElement.value && canvasElement.value) {
        const video = videoElement.value
        const canvas = canvasElement.value
        
        // Sesuaikan ukuran canvas dengan resolusi video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        const context = canvas.getContext('2d')
        if (context) {
            // Gambar frame video saat ini ke canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height)
            
            // Konversi canvas menjadi file Blob gambar (.jpg)
            canvas.toBlob((blob) => {
                if (blob) {
                    // Buat file baru dari blob
                    const file = new File([blob], `bukti_transfer_${Date.now()}.jpg`, { type: 'image/jpeg' })
                    
                    // Masukkan ke form Inertia
                    form.bukti_donasi = file
                    
                    // Buat preview URL agar user bisa melihat hasilnya
                    imageUrl.value = URL.createObjectURL(file)
                    
                    // Matikan kamera setelah jepret
                    closeCamera()
                }
            }, 'image/jpeg', 0.8) // Kualitas 80% untuk kompresi ringan
        }
    }
}

// Pastikan kamera dimatikan jika user berpindah halaman sebelum menutup kamera
onUnmounted(() => {
    closeCamera()
})
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
                
                <div class="space-y-4">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-stone-500 flex items-center gap-2">
                       <span class="size-4 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[8px]">1</span>
                       Nominal Donasi
                    </label>

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

                <div class="space-y-4 bg-amber-500/5 border border-amber-500/10 p-5 rounded-3xl">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-amber-500 flex items-center gap-2">
                        <Info class="size-3" /> Bantu sistem kami tetap hidup
                    </label>
                    <div class="space-y-2">
                        <div 
                            v-for="opt in computedInfaqOptions" 
                            :key="opt.id"
                            @click="form.infaq_sistem = opt.id"
                            class="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all"
                            :class="form.infaq_sistem === opt.id ? 'bg-amber-500/20 border-amber-500/50 text-amber-200' : 'bg-stone-900/50 border-stone-800 text-stone-500'"
                        >
                            <div class="flex items-center gap-3">
                                <div class="size-4 rounded-full border border-stone-700 flex items-center justify-center">
                                    <div v-if="form.infaq_sistem === opt.id" class="size-2 rounded-full bg-amber-500"></div>
                                </div>
                                <span class="text-xs font-bold">
                                    {{ formatCurrency(opt.value) }}
                                </span>
                            </div>
                            <span class="text-[10px] italic opacity-60 text-right ms-4">{{ opt.label }}</span>
                        </div>
                    </div>

                    <div v-if="isPriorityDonator" class="mt-3 p-3 text-center bg-gradient-to-r from-amber-500/20 to-yellow-600/20 border border-amber-500/30 rounded-xl text-xs font-bold text-amber-400 tracking-wide animate-pulse">
                        ⭐ Anda adalah donatur prioritas
                    </div>
                </div>

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
                            required
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

                <div class="space-y-2">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-stone-500">No. WhatsApp</label>
                    <input 
                        v-model="form.no_wa" 
                        type="text" 
                        inputmode="numeric" 
                        placeholder="Contoh: 08123456789" 
                        class="w-full bg-stone-900 border border-stone-800 rounded-2xl p-4 text-sm text-stone-300 outline-none focus:border-amber-500/40"
                        required
                    >
                </div>

                <div class="space-y-2">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-stone-500">Doa & Pesan</label>
                    <textarea v-model="form.notes" placeholder="Tambahkan komentar dukungan & doa" rows="3" required class="w-full bg-stone-900 border border-stone-800 rounded-2xl p-4 text-sm text-stone-300 outline-none focus:border-amber-500/40"></textarea>
                </div>

                <label class="text-[10px] font-bold uppercase tracking-widest text-stone-500 flex items-center gap-2">
                    <span class="size-4 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[8px]">3</span>
                    Scan QRIS & Konfirmasi
                </label>
                
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
                                <span class="text-stone-200">
                                    {{ formatCurrency(finalNominal) }}
                                </span>
                            </div>
                            <div class="flex justify-between text-emerald-400/80">
                                <span class="italic">Infaq Sistem</span>
                                <span>{{ formatCurrency(finalInfaq) }}</span>
                            </div>
                            <div class="pt-2 border-t border-stone-800 flex justify-between text-base font-black">
                                <span class="text-stone-400 uppercase">Total Bayar QRIS</span>
                                <span class="text-amber-500">{{ formatCurrency(totalPembayaran) }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 pt-4 flex flex-col items-center gap-4 bg-stone-950 border-t border-stone-800/50">
                        <p class="text-base font-bold font-mono text-white">
                            MUHASABAH ID
                        </p>
                        <p class="text-base font-bold font-mono text-white -mt-4">
                            Sosial Kemanusian
                        </p>
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
                        <p class="text-[10px] text-stone-500 font-bold tracking-widest uppercase mt-1">
                            {{ totalPembayaran > 0 ? 'Scan QRIS untuk menyelesaikan' : 'Masukkan nominal terlebih dahulu' }}
                        </p>
                    </div>
                </div>

                <div class="mt-4">
                    <label class="block text-sm font-medium text-stone-300 mb-2">Upload Bukti Transfer</label>
                    
                    <div v-if="!isCameraOpen" class="w-full">
                        <div v-if="imageUrl" class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-stone-800">
                            <img :src="imageUrl" class="w-full h-full object-cover" />
                            <button @click.prevent="imageUrl = null; form.bukti_donasi = null" class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg">
                                <X class="w-4 h-4" />
                            </button>
                        </div>

                        <div v-else class="flex flex-col gap-3">
                            <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-stone-700 rounded-2xl cursor-pointer bg-stone-900/50 hover:bg-stone-800/50 transition-colors">
                                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload class="w-8 h-8 text-stone-500 mb-2" />
                                    <p class="text-sm text-stone-400 font-medium">Pilih dari Galeri / Folder</p>
                                </div>
                                <input type="file" accept="image/*" class="hidden" @change="handleFileChange" />
                            </label>

                            <button type="button" @click="openCamera" class="w-full flex items-center justify-center gap-2 py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl font-medium border border-stone-700 transition-all">
                                <Camera class="w-5 h-5 text-amber-500" />
                                <span>Atau Ambil Foto Langsung</span>
                            </button>
                        </div>
                    </div>

                    <div v-if="isCameraOpen" class="relative w-full aspect-[3/4] sm:aspect-video rounded-2xl overflow-hidden bg-black border border-stone-800 shadow-xl">
                        <video 
                            ref="videoElement" 
                            autoplay 
                            playsinline 
                            class="w-full h-full object-cover"
                        ></video>
                        
                        <div class="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between">
                            <button type="button" @click="closeCamera" class="text-stone-300 hover:text-white px-4 py-2 font-medium">
                                Batal
                            </button>
                            <button type="button" @click="takePhoto" class="bg-amber-500 hover:bg-amber-400 text-stone-950 px-6 py-3 rounded-full font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2">
                                <Camera class="w-5 h-5" />
                                Jepret
                            </button>
                        </div>

                        <canvas ref="canvasElement" class="hidden"></canvas>
                    </div>

                    <div v-if="form.errors.bukti_donasi" class="text-red-500 text-xs mt-1">
                        {{ form.errors.bukti_donasi }}
                    </div>
                </div>              

                <div class="flex gap-3 px-2">
                    <ShieldCheck class="size-5 text-emerald-500 shrink-0" />
                    <p class="text-xs text-stone-500 leading-relaxed italic">
                        Donasi ini diproses secara aman. Anda akan dialihkan ke halaman riwayat donasi setelah menekan tombol selesai.
                    </p>
                </div>

                <button 
                    type="submit"
                    :disabled="form.processing"
                    class="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-stone-800 text-stone-950 font-black py-3 rounded-2xl transition-all active:scale-95 shadow-xl shadow-amber-500/20"
                >
                    {{ form.processing ? 'SEDANG MEMPROSES...' : 'SELESAI' }}
                </button>

            </form>

        </div>
    </AppLayoutPublic>
</template>