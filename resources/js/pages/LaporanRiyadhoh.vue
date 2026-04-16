<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { ref, computed, onMounted, watch } from 'vue';
import { router } from '@inertiajs/vue3';

withDefaults(
    defineProps<{
        canRegister?: boolean;
    }>(),
    {
        canRegister: true,
    },
);

const getJakartaDate = () => {
    const now = new Date();
    // Format ke YYYY-MM-DD menggunakan timezone Jakarta
    return new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(now);
};

const formattedDate = getJakartaDate();

const STORAGE_KEY = 'riyadhoh_form_data';

const form = ref({
    nama: '',
    no_wa: '',
    tanggal: formattedDate,
    hari_ke: '',
    grup: '',
    ibadah: {} as Record<string, string>,
});

const ibadahList = [
    // Tambahkan property type: 'number' untuk yang bersifat kuantitas
    { key: 'tahajud', label: 'Sholat Tahajud', icon: '🌙', kategori: 'Sholat Sunnah Malam', type: 'number', placeholder: 'Jumlah rakaat' },
    { key: 'witir', label: 'Sholat Witir', icon: '⭐', kategori: 'Sholat Sunnah Malam', type: 'number', placeholder: 'Jumlah rakaat' },
    { key: 'qobliyah_subuh', label: 'Qobliyah Subuh', icon: '🌠', kategori: 'Sholat Pagi' },
    { key: 'subuh_jamaah', label: 'Subuh Berjamaah', icon: '🌅', kategori: 'Sholat Pagi' },
    { key: 'dhuha', label: 'Sholat Dhuha', icon: '☀️', kategori: 'Sholat Pagi', type: 'number', placeholder: 'Jumlah rakaat' },
    { key: 'dhuhur_jamaah', label: 'Dhuhur Berjamaah', icon: '🕛', kategori: 'Sholat Jamaah' },
    { key: 'ashar_jamaah', label: 'Ashar Berjamaah', icon: '🕒', kategori: 'Sholat Jamaah' },
    { key: 'maghrib_jamaah', label: 'Maghrib Berjamaah', icon: '🌆', kategori: 'Sholat Jamaah' },
    { key: 'isya_jamaah', label: "Isya' Berjamaah", icon: '🌃', kategori: 'Sholat Jamaah' },
    { key: 'sedekah_subuh', label: 'Sedekah Subuh', icon: '💝', kategori: 'Amal Kebaikan', type: 'number', placeholder: 'Rp' },
    { key: 'birrul_walidain', label: 'Birrul Walidain', icon: '👨‍👩‍👧', kategori: 'Amal Kebaikan' },
    { key: 'bakti_masjid', label: 'Bakti Masjid', icon: '🕌', kategori: 'Amal Kebaikan' },
    { key: 'dzikir_pagi', label: 'Dzikir Pagi', icon: '📿', kategori: 'Dzikir & Wirid' },
    { key: 'dzikir_sore', label: 'Dzikir Sore', icon: '📿', kategori: 'Dzikir & Wirid' },
    { key: 'istighfar', label: 'Istighfar', icon: '🤲', kategori: 'Dzikir & Wirid', type: 'number', placeholder: 'Berapa kali' },
    { key: 'sholawat', label: 'Sholawat', icon: '💚', kategori: 'Dzikir & Wirid', type: 'number', placeholder: 'Berapa kali' },
    { key: 'alquran', label: 'Al-Qur\'an 1 Juz', icon: '📖', kategori: 'Tilawah' },
    { key: 'puasa_sunnah', label: 'Puasa Sunnah', icon: '🍽️', kategori: 'Puasa' },
];

const opsiJawaban = [
    { value: 'sempurna', label: 'Sempurna', color: 'emerald' },
    { value: 'sebagian', label: 'Sebagian', color: 'amber' },
    { value: 'tidak', label: 'Tidak', color: 'rose' },
];

const kategoriList = computed(() => {
    const cats: Record<string, typeof ibadahList> = {};
    ibadahList.forEach(item => {
        if (!cats[item.kategori]) cats[item.kategori] = [];
        cats[item.kategori].push(item);
    });
    return cats;
});

onMounted(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            // Gunakan spread untuk menggabungkan agar default value (seperti tanggal) 
            // tidak hilang jika data storage kosong
            form.value = { ...form.value, ...parsed };
        } catch (e) {
            console.error("Gagal memuat data dari local storage", e);
        }
    }
});

watch(form, (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
}, { deep: true });

const totalDiisi = computed(() => Object.keys(form.value.ibadah).length);
const progress = computed(() => Math.round((totalDiisi.value / 18) * 100));

const isSubmitting = ref(false);
const submitSuccess = ref(false);
const errors = ref<Record<string, string>>({});

function validate() {
    errors.value = {};
    if (!form.value.nama.trim()) errors.value.nama = 'Nama wajib diisi';
    if (!form.value.no_wa.trim()) errors.value.no_wa = 'Nomor WhatsApp wajib diisi';
    if (!form.value.tanggal) errors.value.tanggal = 'Tanggal wajib diisi';
    if (!form.value.hari_ke) errors.value.hari_ke = 'Hari ke wajib diisi';
    if (!form.value.grup.trim()) errors.value.grup = 'Nama grup wajib diisi';
    
    const isAllFilled = ibadahList.every(i => {
        const val = form.value.ibadah[i.key];
        // Perbaikan: Angka 0 harus dianggap terisi
        return val !== undefined && val !== null && val !== '';
    });
    
    if (!isAllFilled) errors.value.ibadah = 'Semua ibadah wajib diisi';
    
    return Object.keys(errors.value).length === 0;
}

// Fungsi pembantu untuk format ribuan (1000 -> 1.000)
const formatNumber = (num: any) => {
    const n = parseInt(num);
    return isNaN(n) ? num : n.toLocaleString('id-ID');
};

const generateWhatsAppMessage = () => {
    // Gunakan array untuk menampung baris agar meminimalisir error manipulasi string
    let lines = [];
    
    lines.push(`*LAPORAN RIYADHOH HARIAN*`);
    lines.push(`--------------------------------`);
    lines.push(`*Identitas*`);
    lines.push(`Nama: ${form.value.nama}`);
    lines.push(`No. WA: ${form.value.no_wa}`);
    lines.push(`Tanggal: ${form.value.tanggal}`);
    lines.push(`Hari Ke: ${form.value.hari_ke}`);
    lines.push(`Grup: ${form.value.grup}`);
    lines.push(``); // Baris kosong

    lines.push(`*Laporan Ibadah*`);
    
    ibadahList.forEach((item) => {
        const nilai = form.value.ibadah[item.key] || '-';
        let displayValue = nilai;

        if (item.type === 'number' && nilai !== '-') {
            const formatted = parseInt(nilai).toLocaleString('id-ID');
            if (item.key === 'sedekah_subuh') displayValue = `Rp ${formatted}`;
            else if (['tahajud', 'witir', 'dhuha'].includes(item.key)) displayValue = `${formatted} Rakaat`;
            else displayValue = `${formatted} Kali`;
        }
        
        // Pastikan ada spasi setelah emoji agar parser WA tidak bingung
        lines.push(`${item.icon} ${item.label}: *${displayValue}*`);
    });

    lines.push(``);
    lines.push(`--------------------------------`);
    lines.push(`_Laporan dikirim via Sistem Riyadhoh_`);

    // Gabungkan dengan join newline (\n) baru di-encode secara keseluruhan
    const fullMessage = lines.join('\n');
    return encodeURIComponent(fullMessage);
};

function submit() {
    if (!validate()) return;
    isSubmitting.value = true;

    const payload = {
        nama: form.value.nama,
        no_wa: form.value.no_wa,
        tanggal: form.value.tanggal,
        hari_ke: form.value.hari_ke,
        grup: form.value.grup,
        ...form.value.ibadah
    };

    router.post('/laporan-riyadhoh-submit', payload, {
        onSuccess: () => {
            localStorage.removeItem(STORAGE_KEY);
            submitSuccess.value = true;
            isSubmitting.value = false;
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // LOGIKA BUKA TAB BARU (3 Detik)
            setTimeout(() => {
                const waNumber = "6285950540055"; // GANTI DENGAN NOMOR WA ANDA
                const text = generateWhatsAppMessage();
                const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${text}`;
                window.open(waUrl, '_blank');
            }, 3000);
        },
        onError: (e) => {
            errors.value = e;
            isSubmitting.value = false;
        },
    });
}

const openWhatsAppManual = () => {
    const waNumber = "6285950540055";
    const text = generateWhatsAppMessage();
    const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${text}`;
    window.open(waUrl, '_blank');
};

// Fungsi untuk memformat tampilan (1000 -> 1.000)
const formatDisplay = (val: any) => {
    if (!val) return '';
    return val.toString().replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Fungsi saat user mengetik
const handleNumberInput = (e: Event, key: string) => {
    const target = e.target as HTMLInputElement;
    
    // 1. Ambil posisi kursor sebelum update (agar tidak loncat ke belakang)
    const start = target.selectionStart;
    
    // 2. Ambil hanya angka saja
    let rawValue = target.value.replace(/\D/g, '');
    
    // 3. Simpan angka murni ke state form (tanpa titik)
    form.value.ibadah[key] = rawValue;
    
    // 4. Format tampilan dengan titik
    const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
    // 5. Update nilai di elemen input secara manual
    target.value = formatted;

    // 6. Kembalikan posisi kursor agar tidak loncat ke paling belakang
    // (Opsional, tapi sangat membantu UX saat mengedit di tengah angka)
    if (start !== null) {
        target.setSelectionStart(start);
        target.setSelectionEnd(start);
    }
};
</script>

<template>
    <Head title="Laporan Riyadhoh" />

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
    <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

    <div class="min-h-screen bg-stone-950 font-sans text-stone-100 pb-24"
         style="font-family: 'Plus Jakarta Sans', sans-serif; background-image: radial-gradient(ellipse at 20% 20%, rgba(120,90,40,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(20,100,60,0.12) 0%, transparent 60%);">

        <!-- Decorative top border -->
        <div class="h-1 w-full bg-linear-to-r from-amber-700 via-amber-400 to-amber-700"></div>

        <!-- Header -->
        <header class="relative overflow-hidden py-10 px-4 text-center">
            <div class="absolute inset-0 opacity-5" :style="{ backgroundImage: `url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22><path d=%22M30 5 L55 20 L55 40 L30 55 L5 40 L5 20 Z%22 fill=%22none%22 stroke=%22%23d4a017%22 stroke-width=%221%22/></svg>')` }" style="background-size: 60px 60px;"></div>
            <div class="relative z-10 max-w-2xl mx-auto">
                <p class="text-amber-400 text-sm tracking-[0.3em] uppercase mb-2 font-medium">بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ</p>
                <h1 class="text-3xl md:text-4xl font-bold text-amber-100 mb-1" style="font-family: 'Amiri', serif; letter-spacing: 0.02em;">
                    📋 Laporan Riyadhoh
                </h1>
                <p class="text-stone-400 text-sm mt-2">"Tantangan 40 hari menuju ketaatan dan keimanan, semata-mata mengharap pertolongan Allah."</p>
                <em class="text-stone-400 text-sm mt-2">Isi dengan jujur — Allah Maha Mengetahui apa yang tersembunyi</em>

                
            </div>
        </header>

        <!-- Progress Bar -->
        <div class="top-0 z-50 bg-stone-950/90 backdrop-blur-md border-y border-stone-800/50 mb-8"\
            :class="submitSuccess ? 'hidden' : 'sticky'">
            <div class="max-w-2xl mx-auto px-6 py-4">
                <div class="flex justify-between text-xs text-stone-500 mb-2">
                    <span class="font-medium uppercase tracking-wider">Progress Pengisian</span>
                    <span class="text-amber-400 font-bold">{{ totalDiisi }}/18 Ibadah</span>
                </div>
                <div class="h-1.5 bg-stone-800 rounded-full overflow-hidden shadow-inner">
                    <div
                        class="h-full rounded-full transition-all duration-700 ease-in-out"
                        :class="progress === 100 ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.2)]'"
                        :style="{ width: progress + '%' }"
                    ></div>
                </div>
            </div>
        </div>

        <!-- Success Message -->
        <div v-if="submitSuccess" class="max-w-2xl mx-auto px-4 mb-6">
            <div class="bg-emerald-900/50 border border-emerald-600 rounded-2xl p-8 text-center shadow-2xl">
                <div class="text-5xl mb-4">✅</div>
                <h3 class="text-emerald-300 font-bold text-xl">Jazakallahu Khairan!</h3>
                <p class="text-emerald-400 text-sm mt-1">Laporan berhasil tersimpan di database.</p>
                
                <div class="mt-8 p-6 bg-emerald-950/50 rounded-2xl border border-emerald-500/30">
                    <p class="text-sm text-emerald-100 mb-4">Mengarahkan ke WhatsApp di tab baru...</p>
                    
                    <div class="flex justify-center gap-2 mb-6">
                        <span class="w-3 h-3 bg-amber-400 rounded-full animate-bounce"></span>
                        <span class="w-3 h-3 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span class="w-3 h-3 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    </div>

                    <button 
                        @click="openWhatsAppManual"
                        class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-2.5 px-5 rounded-xl transition-all border border-emerald-400/30 font-semibold shadow-lg active:scale-95"
                    >
                        Klik di sini jika WhatsApp tidak terbuka otomatis
                    </button>
                </div>
            </div>
            
            <div class="flex flex-col items-center mt-10 gap-4">
                <a href="/" class="text-stone-500 hover:text-amber-400 text-sm transition-colors border-b border-stone-800 pb-1">
                    ← Kembali ke Beranda
                </a>
            </div>
        </div>

        <div v-else class="max-w-2xl mx-auto px-4 pb-16 space-y-6">

            <!-- Identitas Diri -->
            <div class="bg-stone-900/80 backdrop-blur border border-stone-700/60 rounded-2xl overflow-hidden shadow-xl">
                <div class="bg-gradient-to-r from-amber-900/60 to-stone-900/60 px-5 py-3 border-b border-stone-700/60 flex items-center gap-2">
                    <span class="text-amber-400">🪪</span>
                    <h2 class="text-amber-200 font-semibold text-sm tracking-wide uppercase">Identitas</h2>
                </div>
                <div class="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <label class="text-xs text-stone-400 font-medium uppercase tracking-wider block mb-1.5">Nama Panggilan *</label>
                        <input
                            v-model="form.nama"
                            type="text"
                            placeholder="Masukkan nama..."
                            class="w-full bg-stone-800 border rounded-xl px-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 outline-none transition-all focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                            :class="errors.nama ? 'border-rose-500' : 'border-stone-700'"
                        />
                        <p v-if="errors.nama" class="text-rose-400 text-xs mt-1">{{ errors.nama }}</p>
                    </div>

                    <div>
                        <label class="text-xs text-stone-400 font-medium uppercase tracking-wider block mb-1.5">No. WhatsApp *</label>
                        <input
                            v-model="form.no_wa"
                            type="tel"
                            placeholder="08xx-xxxx-xxxx"
                            class="w-full bg-stone-800 border rounded-xl px-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 outline-none transition-all focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                            :class="errors.no_wa ? 'border-rose-500' : 'border-stone-700'"
                        />
                        <p v-if="errors.no_wa" class="text-rose-400 text-xs mt-1">{{ errors.no_wa }}</p>
                    </div>

                    <div>
                        <label class="text-xs text-stone-400 font-medium uppercase tracking-wider block mb-1.5">Tanggal *</label>
                        <input
                            v-model="form.tanggal"
                            type="date"
                            class="w-full bg-stone-800 border rounded-xl px-4 py-2.5 text-sm text-stone-100 outline-none transition-all focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                            :class="errors.tanggal ? 'border-rose-500' : 'border-stone-700'"
                        />
                        <p v-if="errors.tanggal" class="text-rose-400 text-xs mt-1">{{ errors.tanggal }}</p>
                    </div>

                    <div>
                        <label class="text-xs text-stone-400 font-medium uppercase tracking-wider block mb-1.5">Hari Ke- *</label>
                        <input
                            v-model="form.hari_ke"
                            type="number"
                            min="1"
                            placeholder="contoh: 7"
                            class="w-full bg-stone-800 border rounded-xl px-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 outline-none transition-all focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                            :class="errors.hari_ke ? 'border-rose-500' : 'border-stone-700'"
                        />
                        <p v-if="errors.hari_ke" class="text-rose-400 text-xs mt-1">{{ errors.hari_ke }}</p>
                    </div>

                    <div class="md:col-span-2">
                        <label class="text-xs text-stone-400 font-medium uppercase tracking-wider block mb-1.5">Nama Grup *</label>
                        <input
                            v-model="form.grup"
                            type="text"
                            placeholder="Contoh: Grup A / Masjid Al-Ikhlas..."
                            class="w-full bg-stone-800 border rounded-xl px-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 outline-none transition-all focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500"
                            :class="errors.grup ? 'border-rose-500' : 'border-stone-700'"
                        />
                        <p v-if="errors.grup" class="text-rose-400 text-xs mt-1">{{ errors.grup }}</p>
                    </div>
                </div>
            </div>

            <!-- Ibadah per Kategori -->
            <div v-for="(items, kategori) in kategoriList" :key="kategori"
                class="bg-stone-900/80 backdrop-blur border border-stone-700/60 rounded-2xl overflow-hidden shadow-xl">
                
                <div class="bg-gradient-to-r from-stone-800/80 to-stone-900/80 px-5 py-3 border-b border-stone-700/60 flex items-center gap-2">
                    <div class="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                    <h2 class="text-amber-300 font-semibold text-xs tracking-widest uppercase">{{ kategori }}</h2>
                </div>

                <div class="divide-y divide-stone-800/80">
                    <div v-for="(ibadah, idx) in items" :key="ibadah.key"
                        class="px-5 py-4 transition-colors hover:bg-stone-800/30">

                        <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div class="flex items-center gap-2.5 flex-1 min-w-0">
                                <span class="text-xl shrink-0">{{ ibadah.icon }}</span>
                                <span class="text-stone-200 text-sm font-medium leading-snug">
                                    {{ ibadah.label }}
                                </span>
                            </div>

                            <div v-if="ibadah.type === 'number'" class="w-full sm:w-40">
                                <div class="relative">
                                    <input
                                        type="text"
                                        inputmode="numeric"
                                        :value="formatDisplay(form.ibadah[ibadah.key])" 
                                        @input="handleNumberInput($event, ibadah.key)"
                                        :placeholder="ibadah.placeholder"
                                        class="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-1.5 text-sm text-amber-400 font-bold focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div v-else class="flex gap-2 shrink-0">
                                <label
                                    v-for="opsi in opsiJawaban"
                                    :key="opsi.value"
                                    class="cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        :name="ibadah.key"
                                        :value="opsi.value"
                                        v-model="form.ibadah[ibadah.key]"
                                        class="sr-only"
                                    />
                                    <span
                                        class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 select-none"
                                        :class="{
                                            'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/50': form.ibadah[ibadah.key] === opsi.value && opsi.value === 'sempurna',
                                            'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-900/50': form.ibadah[ibadah.key] === opsi.value && opsi.value === 'sebagian',
                                            'bg-rose-700 border-rose-600 text-white shadow-lg shadow-rose-900/50': form.ibadah[ibadah.key] === opsi.value && opsi.value === 'tidak',
                                            'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-300': form.ibadah[ibadah.key] !== opsi.value,
                                        }"
                                    >
                                        <span v-if="opsi.value === 'sempurna'">✓</span>
                                        <span v-else-if="opsi.value === 'sebagian'">~</span>
                                        <span v-else>✗</span>
                                        <span class="ml-1">{{ opsi.label }}</span>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 

            <!-- Keterangan Opsi -->
            <div class="bg-stone-900/50 border border-stone-700/40 rounded-2xl px-5 py-4">
                <p class="text-xs text-stone-500 mb-3 font-medium uppercase tracking-wider">Keterangan Opsi</p>
                <div class="flex flex-wrap gap-4 text-xs">
                    <div class="flex items-center gap-2">
                        <span class="inline-block w-3 h-3 rounded-full bg-emerald-500"></span>
                        <span class="text-stone-400">Sempurna — Dikerjakan tuntas sepenuhnya</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="inline-block w-3 h-3 rounded-full bg-amber-500"></span>
                        <span class="text-stone-400">Sebagian — Dikerjakan tidak sempurna</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="inline-block w-3 h-3 rounded-full bg-rose-600"></span>
                        <span class="text-stone-400">Tidak — Tidak dikerjakan sama sekali</span>
                    </div>
                </div>
            </div>         

            <!-- Error ibadah -->
            <div v-if="errors.ibadah" class="bg-rose-900/40 border border-rose-700 rounded-xl px-4 py-3 text-rose-300 text-sm flex items-center gap-2">
                <span>⚠️</span> {{ errors.ibadah }}
            </div>

            <!-- Submit Button -->
            <button
                @click="submit"
                :disabled="isSubmitting"
                class="w-full py-4 rounded-2xl font-bold text-base transition-all duration-300 relative overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed"
                :class="progress === 100 ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 shadow-xl shadow-amber-900/40 hover:shadow-amber-700/50 hover:scale-[1.01]' : 'bg-stone-800 text-stone-500 border border-stone-700'"
            >
                <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Mengirim...
                </span>
                <span v-else-if="progress < 18">
                    Lengkapi semua ibadah dahulu ({{ totalDiisi }}/18)
                </span>
                <span v-else>
                    🕌 Kirim Laporan Riyadhoh
                </span>
            </button>

            <p class="text-center text-xs text-stone-600 pb-4">
                وَمَا تَفْعَلُوا مِنْ خَيْرٍ فَإِنَّ اللَّهَ بِهِ عَلِيمٌ
                <br/>
                <span class="text-stone-700">"Dan kebajikan apa saja yang kamu kerjakan, maka sesungguhnya Allah Maha Mengetahuinya." — QS. Al-Baqarah: 215</span>
            </p>
        </div>
    </div>
</template>