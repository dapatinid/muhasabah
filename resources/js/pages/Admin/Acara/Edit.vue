<script setup lang="ts">
import { Head, useForm, Link } from '@inertiajs/vue3'
import { ref, watch, computed } from 'vue'
import TiptapEditor from '@/components/TiptapEditor.vue'
import { ArrowLeft, Save, Globe, Lock, ChevronDown, Settings, HeartHandshake, MessageSquare, ArrowDownCircle, ArrowUpCircle, Eye, SquarePen, Newspaper, Ticket, CalendarDays, AlertCircle, Plus, Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
        kuota_tiket: number;
        accept_donasi: boolean | number;
        target_donasi: number;
        panduan_acara: string | null;
        tgl_mulai: string | null;
        tgl_selesai: string | null;
        batas_registrasi: string | null;
        is_published?: boolean | number;
        
        variants?: Array<{
            id?: number;
            nama_varian: string;
            harga: number;
            jumlah_kursi: number;
        }>
    }
}>();

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Acara',
                href: '/admin/acara',
            },
            {
                title: 'Edit Acara',
                href: '#',
            },
        ],
    },
});

const dropdownOpen = ref(false)

const formatToInputDatetime = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);
    return localISOTime;
};

interface VariantFormItem {
    id?: number;
    nama_varian: string;
    harga: number;
    jumlah_kursi: number;
}

// Inisialisasi form edit
const form = useForm({
    id: props.acara.id,
    judul: props.acara.judul,
    slug: props.acara.slug,
    lokasi: props.acara.lokasi,
    body: props.acara.body,
    kategori: props.acara.kategori,
    subkategori: props.acara.subkategori,
    
    // Modul Tiket & Varian Baru
    accept_tiket: Boolean(props.acara.accept_tiket),
    kuota_tiket: props.acara.kuota_tiket,
    variants: (props.acara.variants && props.acara.variants.length > 0 
    ? props.acara.variants.map(v => ({
        id: v.id,
        nama_varian: v.nama_varian,
        harga: Number(v.harga),
        jumlah_kursi: Number(v.jumlah_kursi)
      }))
    : [{ id: undefined, nama_varian: 'Reguler', harga: 0, jumlah_kursi: props.acara.kuota_tiket || 100 }]) as VariantFormItem[],

    accept_donasi: Boolean(props.acara.accept_donasi),
    target_donasi: Number(props.acara.target_donasi),
    panduan_acara: props.acara.panduan_acara ?? '',
    tgl_mulai: formatToInputDatetime(props.acara.tgl_mulai),
    tgl_selesai: formatToInputDatetime(props.acara.tgl_selesai),
    batas_registrasi: formatToInputDatetime(props.acara.batas_registrasi),
})

// Menghitung total kursi yang sudah dialokasikan ke varian
const totalAlokasiVarian = computed(() => {
    return form.variants.reduce((sum, v) => sum + (Number(v.jumlah_kursi) || 0), 0)
})

// Menghitung sisa kuota utama yang masih tersedia untuk dibagikan
const sisaKuotaUtama = computed(() => {
    return Number(form.kuota_tiket) - totalAlokasiVarian.value
})

const addVariant = () => {
  form.variants.push({
    id: undefined,
    nama_varian: '',
    harga: 0,
    jumlah_kursi: 0
  })
}

const removeVariant = (index: number) => {
  if (form.variants.length > 1) {
    form.variants.splice(index, 1)
  }
}

const categories = [
    { label: 'Kajian & Dakwah', value: 'kajian' },
    { label: 'Pelatihan / Workshop', value: 'workshop' },
    { label: 'Sosial / Santunan', value: 'sosial' },
    { label: 'Musyawarah / Rapat', value: 'musyawarah' },
    { label: 'Hari Besar Islam', value: 'hari-besar' },
]

const submit = () => {
    if (form.accept_tiket && sisaKuotaUtama.value < 0) {
        alert(`Alokasi varian kursi melebihi Batas Kuota Utama! Kurangi sebanyak ${Math.abs(sisaKuotaUtama.value)} kursi sebelum menyimpan.`)
        return
    }

    // Gunakan transform untuk mencegat dan membersihkan payload sebelum dikirim ke backend
    form.transform((data) => ({
        ...data,
        // 1. Paksa konversi boolean ke 1 atau 0 agar PHP dan MySQL memprosesnya tanpa error casting
        accept_tiket: data.accept_tiket ? 1 : 0,
        accept_donasi: data.accept_donasi ? 1 : 0,
        
        // 2. Kosongkan array variants jika tiket dimatikan, 
        // agar tidak memicu error validasi "variants.*" secara diam-diam di backend
        variants: data.accept_tiket ? data.variants : [],
    })).put(`/admin/acara/${props.acara.slug}`, {
        preserveScroll: true,
        onError: (errors) => {
            // Tampilkan alert jika terjadi error (sangat berguna untuk melacak error di field yang tersembunyi)
            console.error('Validation Errors:', errors);
            alert("Gagal menyimpan!\n\nTerdapat error validasi (mungkin di kolom yang disembunyikan):\n" + Object.values(errors).join("\n"));
        }
    })
}
</script>

<template>
    <Head :title="'Edit - ' + props.acara.judul" />

    <form @submit.prevent="submit" class="max-w-5xl mx-auto px-4 py-8 space-y-8 pb-24 text-zinc-800 dark:text-zinc-200">
        
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
            <div class="flex items-center gap-3">
                <Link href="/admin/acara" class="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                    <ArrowLeft class="w-4 h-4" />
                </Link>
                <div>
                    <h1 class="text-xl font-bold tracking-tight">Edit Agenda Acara</h1>
                    <p class="text-xs text-zinc-400">Sesuaikan info agenda, paket investasi varian kursi, atau pengelolaan donasi.</p>
                </div>
            </div>

            <div class="relative flex">
                <button type="button" @click="dropdownOpen = !dropdownOpen" @blur="setTimeout(() => dropdownOpen = false, 200)" class="ms-auto h-11 px-5 inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-200 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all">
                    <Settings class="size-4 text-zinc-400" />
                    <span>Kelola Acara</span>
                    <ChevronDown class="size-4 text-zinc-400" :class="{ 'rotate-180': dropdownOpen }" />
                </button>
                <div v-if="dropdownOpen" class="absolute right-0 mt-12 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 py-2">
                    <div class="px-2"><span class="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl"><SquarePen class="size-4 text-zinc-400" />Edit Konten</span></div>
                    <div class="px-2"><Link :href="`/acara/${acara.slug}`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><Eye class="size-4 text-zinc-400" />Preview Publik</Link></div>
                    <div class="px-2"><Link :href="`/admin/acara/${acara.slug}/progress`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><Newspaper class="size-4 text-zinc-400" />Progress / Berita</Link></div>
                    <div class="px-2"><Link :href="`/admin/acara/${acara.slug}/reaksi`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><HeartHandshake class="size-4 text-zinc-400" />Reaksi / Emoticon</Link></div>
                    <div class="px-2"><Link :href="`/admin/acara/${acara.slug}/komentar?tab=doa_transaksi`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><MessageSquare class="size-4 text-zinc-400" />Komentar & Doa</Link></div>
                    <div class="px-2"><Link :href="`/admin/acara/${acara.slug}/keuangan`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><Ticket class="size-4 text-indigo-500" />Buku Kas Keuangan</Link></div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            <div class="lg:col-span-2 space-y-6">
                <div class="space-y-4 bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 shadow-sm">
                    <h3 class="text-xs font-black uppercase tracking-widest text-indigo-500 mb-2">Informasi Utama</h3>
                    
                    <div class="space-y-2">
                        <Label :class="{'text-red-500': form.errors.judul}">Nama / Judul Agenda Kegiatan</Label>
                        <Input v-model="form.judul" required class="h-11 rounded-xl" :class="{'border-red-500 focus-visible:ring-red-500': form.errors.judul}" />
                        <div v-if="form.errors.judul" class="text-red-500 text-xs mt-1">{{ form.errors.judul }}</div>
                    </div>
                    <div class="space-y-2">
                        <Label :class="{'text-red-500': form.errors.slug}">Slug / URL</Label>
                        <Input v-model="form.slug" required class="h-11 rounded-xl" :class="{'border-red-500 focus-visible:ring-red-500': form.errors.slug}" />
                        <div v-if="form.errors.slug" class="text-red-500 text-xs mt-1">{{ form.errors.slug }}</div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label>Kategori Utama</Label>
                            <select v-model="form.kategori" class="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300">
                                <option v-for="cat in categories" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
                            </select>
                        </div>
                        <div class="space-y-2">
                            <Label :class="{'text-red-500': form.errors.subkategori}">Target Jamaah / Sub-kategori</Label>
                            <Input v-model="form.subkategori" class="h-11 rounded-xl" :class="{'border-red-500 focus-visible:ring-red-500': form.errors.subkategori}" />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <Label :class="{'text-red-500': form.errors.lokasi}">Lokasi Penyelenggaraan / Tempat</Label>
                        <Input v-model="form.lokasi" required class="h-11 rounded-xl" :class="{'border-red-500 focus-visible:ring-red-500': form.errors.lokasi}" />
                        <div v-if="form.errors.lokasi" class="text-red-500 text-xs mt-1">{{ form.errors.lokasi }}</div>
                    </div>
                </div>

                <div class="space-y-4 bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 shadow-sm">
                    <div class="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                        <div class="flex items-center gap-2">
                            <Ticket class="w-4 h-4 text-indigo-500" />
                            <h3 class="text-xs font-black uppercase tracking-widest text-indigo-500">Modul Registrasi & Varian Tiket</h3>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer select-none">
                            <input type="checkbox" v-model="form.accept_tiket" class="sr-only peer">
                            <div class="w-9 h-5 bg-zinc-200 dark:bg-zinc-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>

                    <div v-if="form.accept_tiket" class="space-y-4 animate-in fade-in duration-200">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                            <div class="space-y-1.5">
                                <Label class="text-xs font-bold">Batas Kuota Utama (Kapasitas Acara)</Label>
                                <Input type="number" v-model.number="form.kuota_tiket" min="1" required placeholder="Contoh: 500" class="h-11 rounded-xl bg-white dark:bg-zinc-950" />
                                <span class="text-[10px] text-zinc-400 block">Total maksimal batas kursi keseluruhan acara.</span>
                            </div>
                            
                            <div class="space-y-1.5 flex flex-col justify-center">
                                <Label class="text-xs font-bold text-zinc-400">Status Distribusi Kursi</Label>
                                <div class="text-sm font-semibold mt-2">
                                    <span v-if="sisaKuotaUtama > 0" class="text-emerald-600 dark:text-emerald-400 font-mono">
                                        Tersedia sisa {{ sisaKuotaUtama }} kursi untuk varian lain.
                                    </span>
                                    <span v-else-if="sisaKuotaUtama === 0" class="text-blue-600 dark:text-blue-400 font-mono">
                                        Semua kuota utama habis teralokasikan secara pas.
                                    </span>
                                    <span v-else class="text-red-600 dark:text-red-400 font-mono animate-pulse">
                                        ⚠️ Over-alokasi! Melebihi kuota utama sebesar {{ Math.abs(sisaKuotaUtama) }} kursi.
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center justify-between">
                            <p class="text-xs text-zinc-400">Atur ulang opsi ketersediaan bangku dan biaya administrasi per varian.</p>
                            <Button type="button" variant="outline" size="sm" @click="addVariant" class="gap-1 text-xs border-dashed">
                                <Plus class="w-3.5 h-3.5" /> Tambah Varian
                            </Button>
                        </div>

                        <div class="space-y-3">
                            <div v-for="(variant, idx) in form.variants" :key="idx" class="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 items-end">
                                
                                <div class="md:col-span-5 space-y-1.5">
                                    <Label class="text-[11px] text-zinc-400">Nama Varian Tiket</Label>
                                    <Input v-model="variant.nama_varian" required placeholder="Contoh: Reguler, VIP" class="h-9 rounded-lg" />
                                </div>

                                <div class="md:col-span-4 space-y-1.5">
                                    <Label class="text-[11px] text-zinc-400">Harga Investasi (Rp)</Label>
                                    <Input type="number" v-model.number="variant.harga" required min="0" class="h-9 rounded-lg" />
                                </div>

                                <div class="md:col-span-2 space-y-1.5">
                                    <Label class="text-[11px] text-zinc-400">Kuota Kursi</Label>
                                    <Input type="number" v-model.number="variant.jumlah_kursi" required min="1" class="h-9 rounded-lg" />
                                </div>

                                <div class="md:col-span-1 flex justify-center pb-0.5">
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        @click="removeVariant(idx)" 
                                        :disabled="form.variants.length === 1"
                                        class="h-9 w-9 text-zinc-400 hover:text-red-500 rounded-lg"
                                    >
                                        <Trash2 class="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-between items-center p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/30 text-xs font-semibold text-indigo-600 dark:text-indigo-400 font-mono">
                            <span>Total Kursi Teralokasi ke Varian:</span>
                            <span>{{ totalAlokasiVarian }} / {{ form.kuota_tiket }} Kursi</span>
                        </div>

                        <div v-if="form.errors.variants" class="text-red-500 text-xs font-semibold">{{ form.errors.variants }}</div>
                    </div>
                    <div v-else class="text-xs text-zinc-400 italic bg-zinc-50 dark:bg-zinc-900/30 p-3 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center">
                        Modul pendaftaran dinonaktifkan. Acara ini bertipe terbuka tanpa batasan kuota.
                    </div>
                </div>
            </div>

            <div class="space-y-6">
                <div class="space-y-4 bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 shadow-sm">
                    <div class="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                        <CalendarDays class="w-4 h-4 text-indigo-500" />
                        <h3 class="text-xs font-black uppercase tracking-widest text-indigo-500">Batas Waktu Pelaksanaan</h3>
                    </div>

                    <div class="space-y-2">
                        <Label :class="{'text-red-500': form.errors.tgl_mulai}">Waktu Acara Dimulai</Label>
                        <Input type="datetime-local" v-model="form.tgl_mulai" required class="h-11 rounded-xl" :class="{'border-red-500 focus-visible:ring-red-500': form.errors.tgl_mulai}" />
                        <div v-if="form.errors.tgl_mulai" class="text-red-500 text-xs mt-1">{{ form.errors.tgl_mulai }}</div>
                    </div>

                    <div class="space-y-2">
                        <Label :class="{'text-red-500': form.errors.tgl_selesai}">Waktu Acara Selesai</Label>
                        <Input type="datetime-local" v-model="form.tgl_selesai" required class="h-11 rounded-xl" :class="{'border-red-500 focus-visible:ring-red-500': form.errors.tgl_selesai}" />
                        <div v-if="form.errors.tgl_selesai" class="text-red-500 text-xs mt-1">{{ form.errors.tgl_selesai }}</div>
                    </div>

                    <div class="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                        <Label :class="{'text-red-500': form.errors.batas_registrasi}">Batas Akhir Penutupan Registrasi</Label>
                        <Input type="datetime-local" v-model="form.batas_registrasi" class="h-11 rounded-xl" :class="{'border-red-500 focus-visible:ring-red-500': form.errors.batas_registrasi}" />
                        <span class="text-[10px] text-zinc-400 block italic leading-normal">Kosongkan jika pendaftaran dibuka sampai acara selesai.</span>
                        <div v-if="form.errors.batas_registrasi" class="text-red-500 text-xs mt-1">{{ form.errors.batas_registrasi }}</div>
                    </div>
                </div>

                <div class="space-y-4 bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 shadow-sm">
                    <div class="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                        <div class="flex items-center gap-2">
                            <HeartHandshake class="w-4 h-4 text-indigo-500" />
                            <h3 class="text-xs font-black uppercase tracking-widest text-indigo-500">Modul Patungan Dana / Sponsor</h3>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer select-none">
                            <input type="checkbox" v-model="form.accept_donasi" class="sr-only peer">
                            <div class="w-9 h-5 bg-zinc-200 dark:bg-zinc-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>

                    <div v-if="form.accept_donasi" class="space-y-4 animate-in fade-in duration-200">
                        <div class="space-y-2">
                            <Label :class="{'text-red-500': form.errors.target_donasi}">Target Kebutuhan Anggaran (Rp)</Label>
                            <Input type="number" v-model.number="form.target_donasi" required min="0" class="h-11 rounded-xl" :class="{'border-red-500 focus-visible:ring-red-500': form.errors.target_donasi}" />
                            <div v-if="form.errors.target_donasi" class="text-red-500 text-xs mt-1">{{ form.errors.target_donasi }}</div>
                        </div>

                        <div class="space-y-2">
                            <Label :class="{'text-red-500': form.errors.panduan_acara}">Instruksi / Rekening Patungan</Label>
                            <Input v-model="form.panduan_acara" class="h-11 rounded-xl" :class="{'border-red-500 focus-visible:ring-red-500': form.errors.panduan_acara}" />
                            <div v-if="form.errors.panduan_acara" class="text-red-500 text-xs mt-1">{{ form.errors.panduan_acara }}</div>
                        </div>
                    </div>
                    <div v-else class="text-xs text-zinc-400 italic bg-zinc-50 dark:bg-zinc-900/30 p-3 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center">
                        Modul penggalangan dana dinonaktifkan.
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
                    <Save class="w-4 h-4" />
                    {{ form.processing ? 'Menyimpan...' : 'Perbarui Agenda' }}
                </Button>
            </div>
        </div>

    </form>
</template>