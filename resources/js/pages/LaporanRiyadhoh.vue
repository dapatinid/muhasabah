<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import { ArrowLeft, SendHorizonal } from 'lucide-vue-next';
import { ref, computed, onMounted, watch } from 'vue';
import AppLayoutPublic from '@/layouts/AppLayoutPublic.vue';

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
    { key: 'tahajud', label: 'Sholat Tahajud', icon: '🌙', kategori: 'Sholat Sunnah Malam', type: 'number', placeholder: 'Jumlah rakaat' },
    { key: 'witir', label: 'Sholat Witir', icon: '⭐', kategori: 'Sholat Sunnah Malam', type: 'number', placeholder: 'Jumlah rakaat' },
    { key: 'qobliyah_subuh', label: 'Qobliyah Subuh', icon: '🌠', kategori: 'Sholat Pagi', options: [{ value: 'ya', label: 'Ya', color: 'emerald' }, { value: 'tidak', label: 'Tidak', color: 'rose' }] },
    { key: 'subuh_jamaah', label: 'Subuh Berjamaah', icon: '🌅', kategori: 'Sholat Pagi', options: [{ value: 'jamaah', label: 'Jamaah', color: 'emerald' }, { value: 'sendiri', label: 'Sendiri', color: 'amber' }, { value: 'tidak', label: 'Tidak', color: 'rose' }] },
    { key: 'dhuha', label: 'Sholat Dhuha', icon: '☀️', kategori: 'Sholat Pagi', type: 'number', placeholder: 'Jumlah rakaat' },
    { key: 'dhuhur_jamaah', label: 'Dhuhur Berjamaah', icon: '🕛', kategori: 'Sholat Jamaah', options: [{ value: 'jamaah', label: 'Jamaah', color: 'emerald' }, { value: 'sendiri', label: 'Sendiri', color: 'amber' }, { value: 'tidak', label: 'Tidak', color: 'rose' }] },
    { key: 'ashar_jamaah', label: 'Ashar Berjamaah', icon: '🕒', kategori: 'Sholat Jamaah', options: [{ value: 'jamaah', label: 'Jamaah', color: 'emerald' }, { value: 'sendiri', label: 'Sendiri', color: 'amber' }, { value: 'tidak', label: 'Tidak', color: 'rose' }] },
    { key: 'maghrib_jamaah', label: 'Maghrib Berjamaah', icon: '🌆', kategori: 'Sholat Jamaah', options: [{ value: 'jamaah', label: 'Jamaah', color: 'emerald' }, { value: 'sendiri', label: 'Sendiri', color: 'amber' }, { value: 'tidak', label: 'Tidak', color: 'rose' }] },
    { key: 'isya_jamaah', label: "Isya' Berjamaah", icon: '🌃', kategori: 'Sholat Jamaah', options: [{ value: 'jamaah', label: 'Jamaah', color: 'emerald' }, { value: 'sendiri', label: 'Sendiri', color: 'amber' }, { value: 'tidak', label: 'Tidak', color: 'rose' }] },
    { key: 'sedekah_subuh', label: 'Sedekah Subuh', icon: '💝', kategori: 'Amal Kebaikan', type: 'number', placeholder: 'Rp' },
    { key: 'birrul_walidain', label: 'Birrul Walidain', icon: '👨‍👩‍👧', kategori: 'Amal Kebaikan' },
    { key: 'bakti_masjid', label: 'Bakti Masjid', icon: '🕌', kategori: 'Amal Kebaikan' },
    { key: 'dzikir_pagi', label: 'Dzikir Pagi', icon: '📿', kategori: 'Dzikir & Wirid', options: [{ value: 'ya', label: 'Ya', color: 'emerald' }, { value: 'tidak', label: 'Tidak', color: 'rose' }] },
    { key: 'dzikir_sore', label: 'Dzikir Sore', icon: '📿', kategori: 'Dzikir & Wirid', options: [{ value: 'ya', label: 'Ya', color: 'emerald' }, { value: 'tidak', label: 'Tidak', color: 'rose' }] },
    { key: 'istighfar', label: 'Istighfar', icon: '🤲', kategori: 'Dzikir & Wirid', type: 'number', placeholder: 'Berapa kali' },
    { key: 'sholawat', label: 'Sholawat', icon: '💚', kategori: 'Dzikir & Wirid', type: 'number', placeholder: 'Berapa kali' },
    { key: 'alquran', label: 'Al-Qur\'an 1 Juz', icon: '📖', kategori: 'Tilawah' },
    { key: 'puasa_sunnah', label: 'Puasa Sunnah', icon: '🍽️', kategori: 'Puasa' },
];

const opsiJawabanDefault = [
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

const saveScrollPosition = () => {
    sessionStorage.setItem('riyadhoh_scroll_pos', window.scrollY.toString());
};

onMounted(() => {
    const savedScroll = sessionStorage.getItem('riyadhoh_scroll_pos');
    if (savedScroll) {
        setTimeout(() => {
            window.scrollTo({ top: parseInt(savedScroll), behavior: 'instant' });
            sessionStorage.removeItem('riyadhoh_scroll_pos');
        }, 100);
    }
    
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        try { form.value = { ...form.value, ...JSON.parse(savedData) }; } 
        catch (e) { console.error(e); }
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
        return val !== undefined && val !== null && val !== '';
    });
    
    if (!isAllFilled) errors.value.ibadah = 'Semua ibadah wajib diisi';
    return Object.keys(errors.value).length === 0;
}

const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-600 border-emerald-500 text-white',
    amber:   'bg-amber-600 border-amber-500 text-white',
    rose:    'bg-rose-600 border-rose-500 text-white',
}

const selectedClass = (opsi: { value: string; color?: string }, key: string) => {
    return form.value.ibadah[key] === opsi.value
        ? (colorMap[opsi.color ?? 'amber'])
        : 'bg-stone-800 border-stone-700 text-stone-400'
}

const generateWhatsAppMessage = () => {
    let lines = [`*LAPORAN RIYADHOH HARIAN*`, `--------------------------------`, `*Identitas*`, `Nama: ${form.value.nama}`, `No. WA: ${form.value.no_wa}`, `Tanggal: ${form.value.tanggal}`, `Hari Ke: ${form.value.hari_ke}`, `Grup: ${form.value.grup}`, `` , `*Laporan Ibadah*` ];
    ibadahList.forEach((item) => {
        const nilai = form.value.ibadah[item.key] || '-';
        let displayValue = nilai;
        if (item.type === 'number' && nilai !== '-') {
            const formatted = parseInt(nilai).toLocaleString('id-ID');
            if (item.key === 'sedekah_subuh') displayValue = `Rp ${formatted}`;
            else if (['tahajud', 'witir', 'dhuha'].includes(item.key)) displayValue = `${formatted} Rakaat`;
            else displayValue = `${formatted} Kali`;
        }
        lines.push(`${item.icon} ${item.label}: *${displayValue}*`);
    });
    lines.push(``, `--------------------------------`, `_Laporan dikirim via Sistem Riyadhoh_`);
    return encodeURIComponent(lines.join('\n'));
};

function submit() {
    if (!validate()) return;
    isSubmitting.value = true;

    const payload = { ...form.value, ...form.value.ibadah };

    router.post('/laporan-riyadhoh-submit', payload, {
        onSuccess: () => {
            localStorage.removeItem(STORAGE_KEY);
            submitSuccess.value = true;
            isSubmitting.value = false;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
                const waNumber = "6285950540055";
                const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${generateWhatsAppMessage()}`;
                window.open(waUrl, '_blank');
            }, 3000);
        },
        onError: (e) => {
            errors.value = e;
            isSubmitting.value = false;
        },
    });
}

const formatDisplay = (val: any) => {
    if (!val) return '';
    return val.toString().replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const handleNumberInput = (e: Event, key: string) => {
    const target = e.target as HTMLInputElement;
    const start = target.selectionStart;
    let rawValue = target.value.replace(/\D/g, '');
    form.value.ibadah[key] = rawValue;
    target.value = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    if (start !== null) { target.setSelectionStart(start); target.setSelectionEnd(start); }
};

const openWhatsAppManual = () => {
    const waUrl = `https://api.whatsapp.com/send?phone=6285950540055&text=${generateWhatsAppMessage()}`;
    window.open(waUrl, '_blank');
};
</script>

<template>
    <Head title="Laporan Riyadhoh" />

    <AppLayoutPublic subtitle="Tantangan 40 Hari" title="Riyadhoh" :show-back="true" :show-nav="false">

        <div class="fixed top-0 inset-x-0 z-40 bg-stone-950/90 backdrop-blur-md border-y border-stone-800/50"
            :class="submitSuccess ? 'hidden' : 'block'">
            <div class="max-w-xl mx-auto px-6 py-4">
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

        <div class="min-h-screen font-sans text-stone-100 pb-24"
             style="font-family: 'Plus Jakarta Sans', sans-serif; background-image: radial-gradient(ellipse at 20% 20%, rgba(120,90,40,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(20,100,60,0.12) 0%, transparent 60%);">

            <!-- Header -->
            <header class="relative overflow-hidden py-10 px-4 text-center">
                <div class="relative z-10 max-w-2xl mx-auto">
                    <p class="text-amber-400 text-sm tracking-[0.3em] uppercase mb-2 font-medium">بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ</p>
                    <h1 class="text-3xl md:text-4xl font-bold text-amber-100 mb-1" style="font-family: 'Amiri', serif; letter-spacing: 0.02em;">
                        📋 Laporan Riyadhoh
                    </h1>
                    <p class="text-stone-400 text-sm mt-2">"Tantangan 40 hari menuju ketaatan dan keimanan, semata-mata mengharap ridho & pertolongan Allah Azza wa Jalla."</p>
                    <em class="text-stone-400 text-sm mt-2">Isi dengan jujur — Allah Maha Mengetahui apa yang tersembunyi</em>
                </div>
            </header>


            <!-- Main Content -->
            <div v-if="submitSuccess" class="max-w-2xl mx-auto px-4 mb-6">
                <!-- ... (Success UI sama seperti sebelumnya) ... -->
                <div class="bg-emerald-900/50 border border-emerald-600 rounded-2xl p-8 text-center shadow-2xl">
                    <div class="text-5xl mb-4">✅</div>
                    <h3 class="text-emerald-300 font-bold text-xl">Jazakallahu Khairan!</h3>
                    <p class="text-emerald-400 text-sm mt-1">Laporan berhasil tersimpan.</p>
                    <div class="mt-8 p-6 bg-emerald-950/50 rounded-2xl border border-emerald-500/30">
                        <p class="text-sm text-emerald-100 mb-4">Mengarahkan ke WhatsApp...</p>
                        <button @click="openWhatsAppManual" class="bg-emerald-600 hover:bg-emerald-50 text-white text-xs py-2.5 px-5 rounded-xl">Buka WA Manual</button>
                    </div>
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
                        <!-- Input Nama -->
                        <div>
                            <label class="text-xs text-stone-400 font-medium uppercase tracking-wider block mb-1.5">Nama Panggilan *</label>
                            <input v-model="form.nama" type="text" placeholder="Masukkan nama..." class="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-stone-100 outline-none focus:border-amber-500" :class="errors.nama ? 'border-rose-500' : ''" />
                        </div>
                        <!-- Input WA -->
                        <div>
                            <label class="text-xs text-stone-400 font-medium uppercase tracking-wider block mb-1.5">No. WhatsApp *</label>
                            <input v-model="form.no_wa" type="tel" placeholder="08595054xxx..." class="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-stone-100 outline-none focus:border-amber-500" :class="errors.no_wa ? 'border-rose-500' : ''" />
                        </div>
                        <!-- Input Tanggal -->
                        <div>
                            <label class="text-xs text-stone-400 font-medium uppercase tracking-wider block mb-1.5">Tanggal *</label>
                            <input v-model="form.tanggal" type="date" class="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-stone-100" />
                        </div>
                        <!-- Input Hari Ke -->
                        <div>
                            <label class="text-xs text-stone-400 font-medium uppercase tracking-wider block mb-1.5">Hari Ke- *</label>
                            <input v-model="form.hari_ke" type="number" placeholder="Contoh: 7" class="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-stone-100" />
                        </div>
                        <div class="md:col-span-2">
                            <label class="text-xs text-stone-400 font-medium uppercase tracking-wider block mb-1.5">Nama Grup *</label>
                            <input v-model="form.grup" type="text" placeholder="Contoh: Grup A..." class="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-stone-100" />
                        </div>
                    </div>
                </div>

                <!-- Ibadah per Kategori -->
                <div v-for="(items, kategori) in kategoriList" :key="kategori" class="bg-stone-900/80 backdrop-blur border border-stone-700/60 rounded-2xl overflow-hidden shadow-xl">
                    <div class="bg-gradient-to-r from-stone-800/80 to-stone-900/80 px-5 py-3 border-b border-stone-700/60 flex items-center gap-2">
                        <div class="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                        <h2 class="text-amber-300 font-semibold text-xs tracking-widest uppercase">{{ kategori }}</h2>
                    </div>
                    <div class="divide-y divide-stone-800/80">
                        <div v-for="ibadah in items" :key="ibadah.key" class="px-5 py-4 transition-colors hover:bg-stone-800/30">
                            <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                                <div class="flex items-center gap-2.5 flex-1 min-w-0">
                                    <span class="text-xl shrink-0">{{ ibadah.icon }}</span>
                                    <Link :href="`/amal-ibadah#${ibadah.key}`" @click="saveScrollPosition" target="_blank" class="text-stone-200 text-sm font-medium hover:text-amber-400 transition-colors flex items-center gap-1 group">
                                        {{ ibadah.label }}
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </Link>
                                </div>
                                <!-- Input Number / Radio -->
                                <div v-if="ibadah.type === 'number'" class="w-full sm:w-40">
                                    <input type="text" inputmode="numeric" :value="formatDisplay(form.ibadah[ibadah.key])" @input="handleNumberInput($event, ibadah.key)" :placeholder="ibadah.placeholder" class="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-1.5 text-sm text-amber-400 font-bold focus:border-amber-500 outline-none" />
                                </div>
                                <div v-else class="flex flex-wrap gap-2 shrink-0">
                                    <label v-for="opsi in (ibadah.options || opsiJawabanDefault)" :key="opsi.value" class="cursor-pointer">
                                        <input type="radio" :name="ibadah.key" :value="opsi.value" v-model="form.ibadah[ibadah.key]" class="sr-only" />
                                        <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border transition-all" :class="selectedClass(opsi, ibadah.key)">
                                            {{ opsi.label }}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer & Submit -->
                <div v-if="errors.ibadah" class="bg-rose-900/40 border border-rose-700 rounded-xl px-4 py-3 text-rose-300 text-sm">
                    ⚠️ {{ errors.ibadah }}
                </div>

                <button @click="submit" :disabled="isSubmitting" class="w-full h-14 rounded-2xl font-bold text-base transition-all active:scale-95 disabled:opacity-50" :class="progress === 100 ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-500'">
                    <span v-if="isSubmitting">Mengirim...</span>
                    <span v-else-if="progress < 100">Lengkapi ({{ totalDiisi }}/18)</span>
                    <span v-else class="flex items-center justify-center gap-2">KIRIM LAPORAN <SendHorizonal class="size-4"/></span>
                </button>       

                <p class="text-center text-xs text-stone-600 pb-4">
                    وَمَا تَفْعَلُوا مِنْ خَيْرٍ فَإِنَّ اللَّهَ بِهِ عَلِيمٌ
                    <br/>
                    <span class="text-stone-700">"Dan kebajikan apa saja yang kamu kerjakan, maka sesungguhnya Allah Maha Mengetahuinya." — QS. Al-Baqarah: 215</span>
                </p>                
            </div>
   
        </div>
    </AppLayoutPublic>
</template>