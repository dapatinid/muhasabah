<script setup lang="ts">
import { Head, useForm, Link, usePage } from '@inertiajs/vue3'
import { ref, watch, computed } from 'vue'
import TiptapEditor from '@/components/TiptapEditor.vue'
import { ArrowLeft, Save, Globe, Lock, ChevronDown, Settings, HeartHandshake, MessageSquare, ArrowDownCircle, ArrowUpCircle, Eye, SquarePen, Newspaper, Ticket, CalendarDays, AlertCircle, Plus, Trash2, Search } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const page = usePage();
const user = page.props.auth.user;

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
    };
    users: Array<{ id: number, name: string, slug: string }>; // (TAMBAHAN) Daftar semua user
    attachedUsers: Array<number>;
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

// Fitur Filter dan Auto-Sort User (Tercentang di Atas)
const searchUser = ref('');
const filteredUsers = computed(() => {
    // 1. Filter berdasarkan pencarian nama terlebih dahulu
    let result = props.users;
    if (searchUser.value) {
        const lower = searchUser.value.toLowerCase();
        result = result.filter(u => u.slug.toLowerCase().includes(lower));
    }

    // 2. Urutkan hasilnya (Reaktif terhadap form.users)
    return [...result].sort((a, b) => {
        // Cek apakah ID user ada di dalam array checkbox yang terpilih
        const isCheckedA = form.users.includes(a.id);
        const isCheckedB = form.users.includes(b.id);

        // Jika A tercentang dan B tidak, A naik ke atas (-1)
        if (isCheckedA && !isCheckedB) return -1;
        // Jika B tercentang dan A tidak, B naik ke atas (1)
        if (!isCheckedA && isCheckedB) return 1;

        // Jika status centangnya sama (sama-sama tercentang atau tidak tercentang), 
        // urutkan rapi berdasarkan abjad nama
        return a.slug.localeCompare(b.slug);
    });
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
    is_published: Boolean(props.acara.is_published),
    users: props.attachedUsers ?? [],
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

    form.transform((data) => ({
        ...data,
        accept_tiket: data.accept_tiket ? 1 : 0,
        accept_donasi: data.accept_donasi ? 1 : 0,
        is_published: data.is_published ? 1 : 0,
        variants: data.accept_tiket ? data.variants : [],
    })).put(`/admin/acara/${props.acara.slug}`, {
        preserveScroll: true,
        onError: (errors) => {
            console.error('Validation Errors:', errors);
            alert("Gagal menyimpan!\n\nTerdapat error validasi (mungkin di kolom yang disembunyikan):\n" + Object.values(errors).join("\n"));
        }
    })
}
</script>

<template>
    <Head :title="'Edit - ' + props.acara.judul" />

    <div class="pt-8 px-4 w-full">   
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
            <div class="flex items-center gap-3">
                <div>
                    <h1 class="text-xl font-bold tracking-tight">Edit Agenda Acara</h1>
                    <p class="text-xs text-zinc-400">Sesuaikan info agenda, paket investasi varian kursi, atau pengelolaan donasi.</p>
                </div>
            </div>

            <div class="relative flex">
                <button type="button" @click="dropdownOpen = !dropdownOpen" @blur="setTimeout(() => dropdownOpen = false, 200)" class="ms-auto h-11 px-5 inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-200 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all cursor-pointer">
                    <Settings class="size-4 text-zinc-400" />
                    <span>Kelola Acara</span>
                    <ChevronDown class="size-4 text-zinc-400 transition-transform" :class="{ 'rotate-180': dropdownOpen }" />
                </button>
                <div v-if="dropdownOpen" class="absolute right-0 mt-12 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 py-2">
                    <div class="px-2"><span class="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl"><SquarePen class="size-4" />Edit Konten</span></div>
                    <div class="px-2"><Link :href="`/acara/${acara.slug}`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><Eye class="size-4 text-zinc-400" />Preview Publik</Link></div>
                    <div class="px-2"><Link :href="`/admin/acara/${acara.slug}/progress`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><Newspaper class="size-4 text-zinc-400" />Progress / Berita</Link></div>
                    <div class="px-2"><Link :href="`/admin/acara/${acara.slug}/reaksi`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><HeartHandshake class="size-4 text-zinc-400" />Reaksi / Emoticon</Link></div>
                    <div class="px-2"><Link :href="`/admin/acara/${acara.slug}/komentar?tab=doa_transaksi`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><MessageSquare class="size-4 text-zinc-400" />Komentar & Doa</Link></div>
                    <div class="px-2"><Link :href="`/admin/acara/${acara.slug}/keuangan`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><Ticket class="size-4 text-indigo-500" />Buku Kas Keuangan</Link></div>
                </div>
            </div>
        </div>
    </div>

    <form @submit.prevent="submit"> 
        
        <div class="mx-auto px-4 py-6 space-y-6 text-zinc-800 dark:text-zinc-200">   

        <div v-if="user.level === 'Super Admin'" class="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 ">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div :class="form.is_published ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'" class="p-2.5 rounded-xl border border-transparent" :style="form.is_published ? 'border-color: rgba(16,185,129,0.2)' : ''">
                        <Globe v-if="form.is_published" class="size-5" />
                        <Lock v-else class="size-5" />
                    </div>
                    <div>
                        <label for="is_published" class="text-sm font-bold cursor-pointer block select-none">
                            {{ form.is_published ? 'Terbit (Status Publik)' : 'Draft (Status Privat)' }}
                        </label>
                        <p class="text-xs text-zinc-400">Tentukan apakah halaman acara ini sudah bisa diakses oleh publik umum.</p>
                    </div>
                </div>
                <input 
                    type="checkbox" 
                    id="is_published" 
                    v-model="form.is_published"
                    class="size-5 rounded-md border-zinc-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                />
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            <div class="lg:col-span-2 space-y-6">
                
                <div class="space-y-4 bg-white dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 ">
                    <h3 class="text-xs font-black uppercase tracking-widest text-indigo-500 border-b border-zinc-50 dark:border-zinc-800/50 pb-2">Informasi Utama</h3>
                    
                    <div class="space-y-1.5">
                        <Label :class="{'text-red-500': form.errors.judul}" class="text-xs font-semibold">Nama / Judul Agenda Kegiatan</Label>
                        <Input v-model="form.judul" required class="h-11 rounded-xl bg-zinc-50/30 dark:bg-zinc-950/30" :class="{'border-red-500 focus-visible:ring-red-500': form.errors.judul}" />
                        <div v-if="form.errors.judul" class="text-red-500 text-xs mt-1">{{ form.errors.judul }}</div>
                    </div>
                    
                    <div class="space-y-1.5">
                        <Label :class="{'text-red-500': form.errors.slug}" class="text-xs font-semibold">Slug / URL Kustom Halaman</Label>
                        <Input v-model="form.slug" required class="h-11 rounded-xl bg-zinc-50/30 dark:bg-zinc-950/30" :class="{'border-red-500 focus-visible:ring-red-500': form.errors.slug}" />
                        <div v-if="form.errors.slug" class="text-red-500 text-xs mt-1">{{ form.errors.slug }}</div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <Label class="text-xs font-semibold">Kategori Utama</Label>
                            <select v-model="form.kategori" class="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-950/30 px-3 py-1 text-sm  transition-colors focus-visible:outline-hidden focus:border-zinc-400 dark:focus:border-zinc-700 focus:ring-0">
                                <option v-for="cat in categories" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
                            </select>
                        </div>
                        <div class="space-y-1.5">
                            <Label :class="{'text-red-500': form.errors.subkategori}" class="text-xs font-semibold">Target Jamaah / Sub-kategori</Label>
                            <Input v-model="form.subkategori" class="h-11 rounded-xl bg-zinc-50/30 dark:bg-zinc-950/30" :class="{'border-red-500 focus-visible:ring-red-500': form.errors.subkategori}" />
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <Label :class="{'text-red-500': form.errors.lokasi}" class="text-xs font-semibold">Lokasi Penyelenggaraan / Tempat</Label>
                        <Input v-model="form.lokasi" required class="h-11 rounded-xl bg-zinc-50/30 dark:bg-zinc-950/30" :class="{'border-red-500 focus-visible:ring-red-500': form.errors.lokasi}" />
                        <div v-if="form.errors.lokasi" class="text-red-500 text-xs mt-1">{{ form.errors.lokasi }}</div>
                    </div>
                </div>

                <div class="space-y-4 bg-white dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 ">
                    <div class="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                        <div class="flex items-center gap-2">
                            <Ticket class="w-4 h-4 text-indigo-500" />
                            <h3 class="text-xs font-black uppercase tracking-widest text-indigo-500">Modul Registrasi & Varian Tiket</h3>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer select-none">
                            <input type="checkbox" v-model="form.accept_tiket" class="sr-only peer">
                            <div class="w-10 h-5 rounded-full transition-colors duration-200
                                        bg-zinc-200 dark:bg-zinc-800 
                                        peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-600
                                        peer-focus:outline-hidden 
                                        after:content-[''] after:absolute after:top-[2px] after:left-[4px] 
                                        after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 
                                        after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white">
                            </div>
                        </label>
                    </div>

                    <div v-if="form.accept_tiket" class="space-y-4 animate-in fade-in duration-200">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/60 shadow-inner">
                            <div class="space-y-1.5">
                                <Label class="text-xs font-bold">Batas Kuota Utama (Kapasitas Acara)</Label>
                                <Input type="number" v-model.number="form.kuota_tiket" min="1" required placeholder="Contoh: 500" class="h-11 rounded-xl bg-white dark:bg-zinc-900" />
                                <span class="text-[11px] text-zinc-400 block leading-normal">Total maksimal batas kursi keseluruhan acara.</span>
                            </div>
                            
                            <div class="space-y-1.5 flex flex-col justify-center">
                                <Label class="text-xs font-bold text-zinc-400">Status Distribusi Kuota</Label>
                                <div class="text-xs font-semibold mt-1">
                                    <span v-if="sisaKuotaUtama > 0" class="text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1.5 rounded-lg border border-emerald-200/30 inline-block">
                                        Tersedia {{ sisaKuotaUtama }} kursi kosong untuk varian.
                                    </span>
                                    <span v-else-if="sisaKuotaUtama === 0" class="text-blue-600 dark:text-blue-400 font-mono bg-blue-50 dark:bg-blue-950/30 px-2.5 py-1.5 rounded-lg border border-blue-200/30 inline-block">
                                        Semua kuota utama pas dialokasikan.
                                    </span>
                                    <span v-else class="text-red-600 dark:text-red-400 font-mono bg-red-50 dark:bg-red-950/30 px-2.5 py-1.5 rounded-lg border border-red-200/30 inline-block animate-pulse">
                                        ⚠️ Over-alokasi! Kurangi {{ Math.abs(sisaKuotaUtama) }} kursi.
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
                            <p class="text-xs text-zinc-400">Atur sub-opsi jenis tiket, investasi admin, dan batas kapasitas.</p>
                            <Button type="button" variant="outline" size="sm" @click="addVariant" class="gap-1 text-xs border-dashed rounded-lg cursor-pointer">
                                <Plus class="w-3.5 h-3.5" /> Tambah Varian
                            </Button>
                        </div>

                        <div class="space-y-3">
                            <div v-for="(variant, idx) in form.variants" :key="idx" class="grid grid-cols-1 md:grid-cols-12 gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/30 border border-zinc-200 dark:border-zinc-800/60 items-center">
                                
                                <div class="md:col-span-5 space-y-1">
                                    <Label class="text-[11px] font-medium text-zinc-400">Nama Paket Varian Tiket</Label>
                                    <Input v-model="variant.nama_varian" required placeholder="Contoh: Reguler, VIP, Early Bird" class="h-10 rounded-lg bg-white dark:bg-zinc-900" />
                                </div>

                                <div class="md:col-span-4 space-y-1">
                                    <Label class="text-[11px] font-medium text-zinc-400">Harga Tiket Masuk (Rp)</Label>
                                    <Input type="number" v-model.number="variant.harga" required min="0" class="h-10 rounded-lg bg-white dark:bg-zinc-900" />
                                </div>

                                <div class="md:col-span-2 space-y-1">
                                    <Label class="text-[11px] font-medium text-zinc-400">Kuota Kursi</Label>
                                    <Input type="number" v-model.number="variant.jumlah_kursi" required min="1" class="h-10 rounded-lg bg-white dark:bg-zinc-900" />
                                </div>

                                <div class="md:col-span-1 flex justify-center pt-4 md:pt-0">
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        @click="removeVariant(idx)" 
                                        :disabled="form.variants.length === 1"
                                        class="h-10 w-10 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                                    >
                                        <Trash2 class="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-between items-center p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100/40 text-xs font-semibold text-indigo-600 dark:text-indigo-400 font-mono ">
                            <span>Total Distribusi Alokasi Varian:</span>
                            <span>{{ totalAlokasiVarian }} / {{ form.kuota_tiket }} Kursi</span>
                        </div>

                        <div v-if="form.errors.variants" class="text-red-500 text-xs font-semibold mt-1">{{ form.errors.variants }}</div>
                    </div>
                    
                    <div v-else class="text-xs text-zinc-400 italic bg-zinc-50 dark:bg-zinc-950/20 p-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center">
                        Modul pendaftaran dinonaktifkan. Acara ini bertipe terbuka tanpa batasan ketersediaan bangku.
                    </div>
                </div>
            </div>

            <div class="space-y-6">
                
                <div class="space-y-4 bg-white dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 ">
                    <div class="flex items-center gap-2 border-b border-zinc-50 dark:border-zinc-800/50 pb-2">
                        <CalendarDays class="w-4 h-4 text-indigo-500" />
                        <h3 class="text-xs font-black uppercase tracking-widest text-indigo-500">Waktu Pelaksanaan</h3>
                    </div>

                    <div class="space-y-1.5">
                        <Label :class="{'text-red-500': form.errors.tgl_mulai}" class="text-xs font-semibold">Waktu Acara Dimulai</Label>
                        <Input type="datetime-local" v-model="form.tgl_mulai" required class="h-11 rounded-xl bg-zinc-50/30 dark:bg-zinc-950/30" :class="{'border-red-500 focus-visible:ring-red-500': form.errors.tgl_mulai}" />
                        <div v-if="form.errors.tgl_mulai" class="text-red-500 text-xs mt-1">{{ form.errors.tgl_mulai }}</div>
                    </div>

                    <div class="space-y-1.5">
                        <Label :class="{'text-red-500': form.errors.tgl_selesai}" class="text-xs font-semibold">Waktu Acara Selesai</Label>
                        <Input type="datetime-local" v-model="form.tgl_selesai" required class="h-11 rounded-xl bg-zinc-50/30 dark:bg-zinc-950/30" :class="{'border-red-500 focus-visible:ring-red-500': form.errors.tgl_selesai}" />
                        <div v-if="form.errors.tgl_selesai" class="text-red-500 text-xs mt-1">{{ form.errors.tgl_selesai }}</div>
                    </div>

                    <div class="space-y-1.5 pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
                        <Label :class="{'text-red-500': form.errors.batas_registrasi}" class="text-xs font-semibold">Batas Akhir Tutup Registrasi</Label>
                        <Input type="datetime-local" v-model="form.batas_registrasi" class="h-11 rounded-xl bg-zinc-50/30 dark:bg-zinc-950/30" :class="{'border-red-500 focus-visible:ring-red-500': form.errors.batas_registrasi}" />
                        <span class="text-[11px] text-zinc-400 block italic leading-normal">Kosongkan jika pendaftaran dibuka sampai acara berakhir.</span>
                        <div v-if="form.errors.batas_registrasi" class="text-red-500 text-xs mt-1">{{ form.errors.batas_registrasi }}</div>
                    </div>
                </div>

                <div class="space-y-4 bg-white dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 ">
                    <div class="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                        <div class="flex items-center gap-2">
                            <HeartHandshake class="w-4 h-4 text-indigo-500" />
                            <h3 class="text-xs font-black uppercase tracking-widest text-indigo-500">Patungan Dana / Sponsor</h3>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer select-none">
                            <input type="checkbox" v-model="form.accept_donasi" class="sr-only peer">
                            <div class="w-10 h-5 rounded-full transition-colors duration-200
                                        bg-zinc-200 dark:bg-zinc-800 
                                        peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-600
                                        peer-focus:outline-hidden 
                                        after:content-[''] after:absolute after:top-[2px] after:left-[4px] 
                                        after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 
                                        after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white">
                            </div>
                        </label>
                    </div>

                    <div v-if="form.accept_donasi" class="space-y-3 animate-in fade-in duration-200">
                        <div class="space-y-1.5">
                            <Label :class="{'text-red-500': form.errors.target_donasi}" class="text-xs font-semibold">Target Anggaran Dibutuhkan (Rp)</Label>
                            <Input type="number" v-model.number="form.target_donasi" required min="0" class="h-11 rounded-xl bg-zinc-50/30 dark:bg-zinc-950/30" :class="{'border-red-500 focus-visible:ring-red-500': form.errors.target_donasi}" />
                            <div v-if="form.errors.target_donasi" class="text-red-500 text-xs mt-1">{{ form.errors.target_donasi }}</div>
                        </div>

                        <div class="space-y-1.5">
                            <Label :class="{'text-red-500': form.errors.panduan_acara}" class="text-xs font-semibold">Instruksi Pembayaran / Rekening</Label>
                            <Input v-model="form.panduan_acara" class="h-11 rounded-xl bg-zinc-50/30 dark:bg-zinc-950/30" :class="{'border-red-500 focus-visible:ring-red-500': form.errors.panduan_acara}" />
                            <div v-if="form.errors.panduan_acara" class="text-red-500 text-xs mt-1">{{ form.errors.panduan_acara }}</div>
                        </div>
                    </div>
                    
                    <div v-else class="text-xs text-zinc-400 italic bg-zinc-50 dark:bg-zinc-950/20 p-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center">
                        Modul penggalangan donasi patungan dinonaktifkan.
                    </div>
                </div>

                <div class="space-y-2">
                    <Label>Pilih Panitia Acara</Label>
                    <p class="text-[10px] text-zinc-500 mb-2">Pilih pengguna yang terkait sebagai panitia acara ini.</p>
                    
                    <div class="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
                        <div class="p-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 relative">
                            <Search class="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                            <input 
                                type="text"
                                v-model="searchUser"
                                placeholder="Cari nama pengguna..."
                                class="w-full pl-8 pr-3 py-1.5 text-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-zinc-900 dark:text-zinc-100"
                            />
                        </div>
                        
                        <div class="max-h-72 overflow-y-auto p-2 space-y-1">
                            <label 
                                v-for="user in filteredUsers" 
                                :key="user.id" 
                                class="flex items-center gap-3 p-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800"
                            >
                                <input 
                                    type="checkbox" 
                                    :value="user.id" 
                                    v-model="form.users"
                                    class="size-4 rounded border-zinc-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                                />
                                <span class="text-sm font-medium text-zinc-700 dark:text-zinc-200">{{ user.slug }} ~ {{ user.name }}</span>
                            </label>
                            
                            <div v-if="filteredUsers.length === 0" class="p-6 text-center text-sm text-zinc-500 italic">
                                Pengguna tidak ditemukan.
                            </div>
                        </div>
                    </div>
                    <div v-if="form.errors.users" class="text-red-500 text-xs mt-1">{{ form.errors.users }}</div>
                </div>     

            </div>
        
        </div>

        </div>    

        <div class="space-y-2 p-4 ">
            <h3 class="text-xs font-black uppercase tracking-widest text-indigo-500 border-b border-zinc-50 dark:border-zinc-800/50">Konten Narasi Acara</h3>
            <Label :class="{'text-red-500': form.errors.body}" class="text-xs font-semibold">Deskripsi Lengkap, Rencana Kegiatan & Susunan Acara</Label>
            <div class="mt-1.5">
                <TiptapEditor v-model="form.body" />
            </div>
            <div v-if="form.errors.body" class="text-red-500 text-xs mt-1">{{ form.errors.body }}</div>
        </div>

        <div class="flex flex-col sm:flex-row justify-between items-center p-4 gap-4">
            <p class="text-xs text-zinc-400 italic text-center sm:text-left">Pembaruan data agenda akan langsung disinkronkan langsung ke halaman publik.</p>
            
            <div class="flex gap-3 w-full sm:w-auto">
                <Link href="/admin/acara" class="flex-1 sm:flex-none text-center px-6 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                    Batal
                </Link>
                <Button 
                    type="submit" 
                    class="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-11 rounded-xl font-bold gap-2 transition-all cursor-pointer"
                    :disabled="form.processing"
                >
                    <Save class="w-4 h-4" />
                    {{ form.processing ? 'Menyimpan...' : 'Perbarui' }}
                </Button>
            </div>
        </div>

    </form>
</template>