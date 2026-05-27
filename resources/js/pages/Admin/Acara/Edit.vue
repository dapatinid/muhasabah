<script setup lang="ts">
import { Head, useForm, Link } from '@inertiajs/vue3'
import TiptapEditor from '@/Components/TiptapEditor.vue'
import { ArrowLeft, Save, Globe, Lock, ChevronDown, Settings, HeartHandshake, MessageSquare, ArrowDownCircle, ArrowUpCircle, Eye, SquarePen, Newspaper, Ticket, CalendarDays, AlertCircle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ref } from 'vue'

const props = defineProps<{
    acara: {
        id: number;
        slug: string;
        judul: string;
        lokasi: string;
        body: string;
        kategori: string;
        subkategori: string;
        accept_tiket: boolean | number;
        harga_tiket: number;
        kuota_tiket: number;
        accept_donasi: boolean | number;
        target_donasi: number;
        panduan_acara: string | null;
        tgl_mulai: string | null;
        tgl_selesai: string | null;
        batas_registrasi: string | null;
        is_published?: boolean | number; // Opsional jika ada kolom publikasi
    }
}>();

const dropdownOpen = ref(false)

// --- 1. TULIS HELPER INI DI ATAS INISIALISASI FORM (Setelah import) ---
const formatToInputDatetime = (dateString: string | null) => {
    if (!dateString) return '';
    
    // Normalisasi spasi ke T agar objek Date javascript valid membaca stringnya
    const isoString = dateString.includes('T') ? dateString : dateString.replace(' ', 'T');
    const date = new Date(isoString);
    
    if (isNaN(date.getTime())) {
        return '';
    }
    
    // Ekstrak waktu lokal murni dari mesin Mac Anda tanpa kalkulasi offset otomatis browser
    const pad = (num: number) => String(num).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// --- 2. UBAH INISIALISASI FORM ANDA MENJADI SEPERTI INI ---
const form = useForm({
    judul: props.acara.judul,
    slug: props.acara.slug,
    lokasi: props.acara.lokasi,
    body: props.acara.body,
    kategori: props.acara.kategori,
    subkategori: props.acara.subkategori,
    
    // Modul Tiket
    accept_tiket: Boolean(props.acara.accept_tiket),
    harga_tiket: props.acara.harga_tiket,
    kuota_tiket: props.acara.kuota_tiket,

    // Modul Donasi
    accept_donasi: Boolean(props.acara.accept_donasi),
    target_donasi: props.acara.target_donasi,
    panduan_acara: props.acara.panduan_acara ?? '',

    // 🔴 BERSIH & AMAN: Mengunci jam lokal langsung dari instans objek Date
    tgl_mulai: formatToInputDatetime(props.acara.tgl_mulai),
    tgl_selesai: formatToInputDatetime(props.acara.tgl_selesai),
    batas_registrasi: formatToInputDatetime(props.acara.batas_registrasi),
})

const categories = [
  { label: 'Kajian & Dakwah', value: 'kajian' },
  { label: 'Pelatihan / Workshop', value: 'workshop' },
  { label: 'Sosial & Santunan', value: 'sosial' },
  { label: 'Musyawarah / Rapat', value: 'musyawarah' },
  { label: 'Peringatan Hari Besar', value: 'hari-besar' },
]

const subcategories = [
  { label: 'Umum / Publik', value: 'umum' },
  { label: 'Khusus Internal', value: 'internal' },
  { label: 'Pemuda / Remaja', value: 'pemuda' },
  { label: 'Muslimah / Akhwat', value: 'muslimah' },
]

function submit() {
    // Bersihkan nilai data turunan jika modul dinonaktifkan di tengah jalan
    if (!form.accept_tiket) {
        form.harga_tiket = 0
        form.kuota_tiket = 0
    }
    if (!form.accept_donasi) {
        form.target_donasi = 0
        form.panduan_acara = '-'
    }

    form.put(`/admin/acara/${props.acara.slug}`, {
        preserveScroll: true,
        onError: (errors) => {
            console.error("Gagal memperbarui acara:", errors)
        }
    })
}
</script>

<template>
    <Head :title="`Edit Acara: ${props.acara.judul}`" />
    
    <div class="py-10 px-4 w-full mx-auto max-w-5xl">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div class="flex items-center gap-4">
                <Link href="/admin/acara" class="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-indigo-600 transition-colors">
                    <ArrowLeft class="size-5" />
                </Link>
                <div>
                    <h1 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Edit Agenda Acara</h1>
                    <p class="text-sm text-zinc-500">Perbarui informasi pelaksanaan, ketersediaan tiket, atau penggalangan dana internal.</p>
                </div>
            </div>

            <div class="relative flex">
                <button 
                    type="button" 
                    @click="dropdownOpen = !dropdownOpen" 
                    @blur="setTimeout(() => dropdownOpen = false, 200)" 
                    class="ms-auto h-11 px-5 inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-200 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all"
                >
                    <Settings class="size-4 text-zinc-400" />
                    <span>Kelola Acara</span>
                    <ChevronDown class="size-4 text-zinc-400" :class="{ 'rotate-180': dropdownOpen }" />
                </button>
                
                <div v-if="dropdownOpen" class="absolute right-0 mt-12 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 py-2">
                    <div class="px-2">
                        <span class="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl">
                            <SquarePen class="size-4" />Edit Konten
                        </span>
                    </div>
                    <div class="px-2">
                        <Link :href="`/acara/${acara.slug}`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl">
                            <Eye class="size-4 text-zinc-400" />Preview Publik
                        </Link>
                    </div>
                    <div class="px-2">
                        <Link :href="`/admin/acara/${acara.slug}/progress`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl">
                            <Newspaper class="size-4 text-zinc-400" />Progress / Berita
                        </Link>
                    </div>
                    <div class="px-2">
                        <Link :href="`/admin/acara/${acara.slug}/reaksi`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl">
                            <HeartHandshake class="size-4 text-zinc-400" />Reaksi / Emoticon
                        </Link>
                    </div>
                    <div class="px-2">
                        <Link :href="`/admin/acara/${acara.slug}/komentar`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl">
                            <MessageSquare class="size-4 text-zinc-400" />Komentar & Doa
                        </Link>
                    </div>
                    <div class="px-2">
                        <Link :href="`/admin/acara/${acara.slug}/keuangan`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl">
                            <Ticket class="size-4 text-indigo-500" />Buku Kas Keuangan
                        </Link>
                    </div>
                </div>
            </div>            
        </div>

        <div v-if="Object.keys(form.errors).length > 0" class="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm flex gap-2 items-start">
            <AlertCircle class="size-5 shrink-0 mt-0.5" />
            <div>
                <span class="font-bold">Gagal memperbarui formulir.</span> Mohon tinjau kesalahan penulisan atau bentrokan batas waktu tanggal di bawah ini.
            </div>
        </div>

        <form @submit.prevent="submit" class="space-y-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm">   
            
            <div class="space-y-6">
                <h2 class="text-lg font-bold text-zinc-800 dark:text-zinc-200 border-b pb-2 flex items-center gap-2">
                    <CalendarDays class="size-5 text-indigo-500" /> Informasi Utama Kegiatan
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <Label   for="judul" :class="{'text-red-500': form.errors.judul}">Nama / Judul Acara</Label>
                        <Input 
                            id="judul" 
                            v-model="form.judul" 
                            class="h-12 rounded-xl focus:ring-indigo-500 font-semibold text-base"
                            :class="{'border-red-500': form.errors.judul}"
                            required
                        />
                        <div v-if="form.errors.judul" class="text-red-500 text-xs font-semibold">{{ form.errors.judul }}</div>
                    </div>

                    <div class="space-y-2">
                        <Label for="slug" :class="{'text-red-500': form.errors.slug}">URL Slug (Tautan Unik)</Label>
                        <Input 
                            id="slug" 
                            v-model="form.slug" 
                            class="h-12 rounded-xl focus:ring-indigo-500 font-mono"
                            :class="{'border-red-500': form.errors.slug}"
                            required
                        />
                        <div v-if="form.errors.slug" class="text-red-500 text-xs font-semibold">{{ form.errors.slug }}</div>
                    </div>

                    <div class="space-y-2">
                        <Label for="kategori">Kategori Acara</Label>
                        <select 
                            id="kategori"
                            v-model="form.kategori"
                            class="w-full h-11 px-3 rounded-xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                                {{ cat.label }}
                            </option>
                        </select>
                    </div>

                    <div class="space-y-2">
                        <Label for="subkategori">Subkategori Target Pengunjung</Label>
                        <select 
                            id="subkategori"
                            v-model="form.subkategori"
                            class="w-full h-11 px-3 rounded-xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option v-for="sub in subcategories" :key="sub.value" :value="sub.value">
                                {{ sub.label }}
                            </option>
                        </select>
                    </div>

                    <div class="space-y-2 md:col-span-2">
                        <Label for="lokasi" :class="{'text-red-500': form.errors.lokasi}">Lokasi Pelaksanaan</Label>
                        <Input 
                            id="lokasi" 
                            v-model="form.lokasi" 
                            class="h-11 rounded-xl focus:ring-indigo-500"
                            :class="{'border-red-500': form.errors.lokasi}"
                            required
                        />
                        <div v-if="form.errors.lokasi" class="text-red-500 text-xs font-semibold">{{ form.errors.lokasi }}</div>
                    </div>

                    <div class="space-y-2">
                        <Label for="tgl_mulai" :class="{'text-red-500': form.errors.tgl_mulai}">Tanggal & Waktu Mulai</Label>
                        <Input 
                            id="tgl_mulai" 
                            type="datetime-local"
                            v-model="form.tgl_mulai" 
                            class="h-11 rounded-xl focus-visible:ring-indigo-500"
                            :class="{'border-red-500': form.errors.tgl_mulai}"
                        />
                        <div v-if="form.errors.tgl_mulai" class="text-red-500 text-xs font-semibold">{{ form.errors.tgl_mulai }}</div>
                    </div>

                    <div class="space-y-2">
                        <Label for="tgl_selesai" :class="{'text-red-500': form.errors.tgl_selesai}">Tanggal & Waktu Selesai</Label>
                        <Input 
                            id="tgl_selesai" 
                            type="datetime-local"
                            v-model="form.tgl_selesai" 
                            class="h-11 rounded-xl focus-visible:ring-indigo-500"
                            :class="{'border-red-500': form.errors.tgl_selesai}"
                        />
                        <div v-if="form.errors.tgl_selesai" class="text-red-500 text-xs font-semibold">{{ form.errors.tgl_selesai }}</div>
                    </div>

                    <div class="space-y-2 md:col-span-2">
                        <Label for="batas_registrasi" :class="{'text-red-500': form.errors.batas_registrasi}">Batas Akhir Pendaftaran Tiket</Label>
                        <Input 
                            id="batas_registrasi" 
                            type="datetime-local"
                            v-model="form.batas_registrasi" 
                            class="h-11 rounded-xl focus-visible:ring-indigo-500"
                            :class="{'border-red-500': form.errors.batas_registrasi}"
                        />
                        <div v-if="form.errors.batas_registrasi" class="text-red-500 text-xs font-semibold">{{ form.errors.batas_registrasi }}</div>
                    </div>
                </div>
            </div>       

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                
                <div class="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2 font-bold text-zinc-800 dark:text-zinc-200">
                            <Ticket class="size-5 text-indigo-500" /> Modul Tiket & Peserta
                        </div>
                        <input 
                            id="accept_tiket"
                            type="checkbox" 
                            v-model="form.accept_tiket" 
                            class="w-4 h-4 text-indigo-600 border-zinc-300 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                    </div>
                    
                    <div v-if="form.accept_tiket" class="space-y-4 pt-2">
                        <div class="space-y-1.5">
                            <Label for="harga_tiket" :class="{'text-red-500': form.errors.harga_tiket}">Harga Tiket (Rp)</Label>
                            <div class="relative">
                                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">Rp</span>
                                <Input 
                                    id="harga_tiket" 
                                    type="number" 
                                    v-model.number="form.harga_tiket" 
                                    class="pl-9 h-10 rounded-lg focus-visible:ring-indigo-500"
                                    min="0"
                                />
                            </div>
                            <div v-if="form.errors.harga_tiket" class="text-red-500 text-xs font-semibold">{{ form.errors.harga_tiket }}</div>
                        </div>

                        <div class="space-y-1.5">
                            <Label for="kuota_tiket" :class="{'text-red-500': form.errors.kuota_tiket}">Kuota Batas Peserta</Label>
                            <Input 
                                id="kuota_tiket" 
                                type="number" 
                                v-model.number="form.kuota_tiket" 
                                class="h-10 rounded-lg focus-visible:ring-indigo-500"
                                min="0"
                            />
                            <div v-if="form.errors.kuota_tiket" class="text-red-500 text-xs font-semibold">{{ form.errors.kuota_tiket }}</div>
                        </div>
                    </div>
                </div>

                <div class="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2 font-bold text-zinc-800 dark:text-zinc-200">
                            <HandHeart class="size-5 text-amber-500" /> Modul Sponsorship & Donasi
                        </div>
                        <input 
                            id="accept_donasi"
                            type="checkbox" 
                            v-model="form.accept_donasi" 
                            class="w-4 h-4 text-amber-600 border-zinc-300 rounded focus:ring-amber-500 cursor-pointer"
                        />
                    </div>
                    
                    <div v-if="form.accept_donasi" class="space-y-4 pt-2">
                        <div class="space-y-1.5">
                            <Label for="target_donasi" :class="{'text-red-500': form.errors.target_donasi}">Target Dana Operasional</Label>
                            <div class="relative">
                                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">Rp</span>
                                <Input 
                                    id="target_donasi" 
                                    type="number" 
                                    v-model.number="form.target_donasi" 
                                    class="pl-9 h-10 rounded-lg focus-visible:ring-indigo-500"
                                    min="0"
                                />
                            </div>
                            <div v-if="form.errors.target_donasi" class="text-red-500 text-xs font-semibold">{{ form.errors.target_donasi }}</div>
                        </div>

                        <div class="space-y-1.5">
                            <Label for="panduan_acara" :class="{'text-red-500': form.errors.panduan_acara}">Panduan Keterangan Sponsor</Label>
                            <Input 
                                id="panduan_acara" 
                                v-model="form.panduan_acara" 
                                class="h-10 rounded-lg focus-visible:ring-indigo-500"
                            />
                            <div v-if="form.errors.panduan_acara" class="text-red-500 text-xs font-semibold">{{ form.errors.panduan_acara }}</div>
                        </div>
                    </div>
                </div>

            </div>

            <div class="space-y-2">
                <Label :class="{'text-red-500': form.errors.body}">Deskripsi Lengkap, Rencana Kegiatan & Susunan Acara</Label>
                <TiptapEditor v-model="form.body" />
                <div v-if="form.errors.body" class="text-red-500 text-xs mt-1">{{ form.errors.body }}</div>
            </div>

            <div class="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-zinc-100 dark:border-zinc-800 gap-4">
                <p class="text-xs text-zinc-400 italic">Pembaruan data akan langsung disinkronkan ke halaman publik.</p>
                
                <div class="flex gap-3 w-full md:w-auto">
                    <Link href="/admin/acara" class="flex-1 md:flex-none text-center px-6 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        Batal
                    </Link>
                    <Button 
                        type="submit" 
                        class="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-11 rounded-xl font-bold gap-2 shadow-lg shadow-indigo-500/20"
                        :disabled="form.processing"
                    >
                        <Save class="size-4" />
                        {{ form.processing ? 'Menyimpan...' : 'Simpan Perubahan' }}
                    </Button>
                </div>
            </div>

        </form>
    </div>
</template>