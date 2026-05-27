<script setup lang="ts">
import { Head, useForm, Link } from '@inertiajs/vue3'
import TiptapEditor from '@/Components/TiptapEditor.vue'
import { ArrowLeft, Save, Ticket, HandHeart, CalendarDays, AlertCircle, Plus, Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ref, computed } from 'vue' // 🛠️ UPDATE: Import ref dan computed

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Acara',
                href: '/admin/acara',
            },
            {
                title: 'Buat Acara Baru',
                href: '/admin/acara/create',
            },
        ],
    },
});

const form = useForm({
  judul: '',
  lokasi: '',
  body: '',
  kategori: 'kajian',
  subkategori: 'umum', 
  
  // Modul Tiket & Varian Baru
  accept_tiket: true,
  kuota_tiket: 100, // 🛠️ DEFAULT VALUE: Kita set kapasitas awal misalnya 100
  variants: [
    { nama_varian: 'Reguler', harga: 0, jumlah_kursi: 100 }
  ],

  // Modul Donasi / Sponsor
  accept_donasi: false,
  target_donasi: 0,
  panduan_acara: '',

  // Batas Waktu & Registrasi
  tgl_mulai: '',
  tgl_selesai: '',
  batas_registrasi: '', 
})

// 🛠️ UPDATE: Menggunakan computed untuk melacak distribusi kursi secara real-time
const totalAlokasiVarian = computed(() => {
    return form.variants.reduce((sum, v) => sum + (Number(v.jumlah_kursi) || 0), 0)
})

const sisaKuotaUtama = computed(() => {
    return Number(form.kuota_tiket) - totalAlokasiVarian.value
})

const addVariant = () => {
  form.variants.push({
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
  // 🛠️ VALIDASI: Cegah submit jika distribusi kursi di varian melebihi kuota utama ruangan
  if (form.accept_tiket && sisaKuotaUtama.value < 0) {
      alert(`Alokasi varian kursi melebihi Batas Kuota Utama! Kurangi sebanyak ${Math.abs(sisaKuotaUtama.value)} kursi sebelum menyimpan.`)
      return
  }
  
  form.post('/admin/acara')
}
</script>

<template>
  <Head title="Buat Acara Baru" />

  <form @submit.prevent="submit" class="max-w-5xl mx-auto px-4 py-8 space-y-8 pb-24 text-zinc-800 dark:text-zinc-200">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
      <div class="flex items-center gap-3">
        <Link href="/admin/acara" class="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <ArrowLeft class="w-4 h-4" />
        </Link>
        <div>
          <h1 class="text-xl font-bold tracking-tight">Buat Agenda Acara Baru</h1>
          <p class="text-xs text-zinc-400">Publikasikan agenda, manajemen pendaftaran tiket/kursi, atau penggalangan dana operasional.</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      
      <div class="lg:col-span-2 space-y-6">
        <div class="space-y-4 bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 shadow-sm">
          <h3 class="text-xs font-black uppercase tracking-widest text-indigo-500 mb-2">Informasi Utama</h3>
          
          <div class="space-y-2">
            <Label :class="{'text-red-500': form.errors.judul}">Nama / Judul Agenda Kegiatan</Label>
            <Input v-model="form.judul" required placeholder="Contoh: Kajian Akbar Akhir Bulan Bersama..." class="h-11 rounded-xl" :class="{'border-red-500 focus-visible:ring-red-500': form.errors.judul}" />
            <div v-if="form.errors.judul" class="text-red-500 text-xs font-semibold">{{ form.errors.judul }}</div>
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
              <Input v-model="form.subkategori" placeholder="Contoh: Umum, Remaja Masjid, Ibu-ibu" class="h-11 rounded-xl" :class="{'border-red-500 focus-visible:ring-red-500': form.errors.subkategori}" />
            </div>
          </div>

          <div class="space-y-2">
            <Label :class="{'text-red-500': form.errors.lokasi}">Lokasi Penyelenggaraan / Tempat</Label>
            <Input v-model="form.lokasi" required placeholder="Contoh: Ruang Utama Lantai 1, Aula Masjid..." class="h-11 rounded-xl" :class="{'border-red-500 focus-visible:ring-red-500': form.errors.lokasi}" />
            <div v-if="form.errors.lokasi" class="text-red-500 text-xs font-semibold">{{ form.errors.lokasi }}</div>
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
              <p class="text-xs text-zinc-400">Tentukan opsi varian tiket, harga investasi (isi 0 jika gratis), serta kuota masing-masing.</p>
              <Button type="button" variant="outline" size="sm" @click="addVariant" class="gap-1 text-xs border-dashed">
                <Plus class="w-3.5 h-3.5" /> Tambah Varian
              </Button>
            </div>

            <div class="space-y-3">
              <div v-for="(variant, idx) in form.variants" :key="idx" class="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 items-end relative group">
                
                <div class="md:col-span-5 space-y-1.5">
                  <Label class="text-[11px] text-zinc-400">Nama Varian Tiket</Label>
                  <Input v-model="variant.nama_varian" required placeholder="Contoh: Reguler, Ikhwan, Akhwat, VIP" class="h-9 rounded-lg" />
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
            Modul pendaftaran dinonaktifkan. Acara ini bertipe terbuka / kajian bebas tanpa batas kuota kursi pendaftar.
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
            <div v-if="form.errors.tgl_mulai" class="text-red-500 text-xs font-semibold">{{ form.errors.tgl_mulai }}</div>
          </div>

          <div class="space-y-2">
            <Label :class="{'text-red-500': form.errors.tgl_selesai}">Waktu Acara Selesai</Label>
            <Input type="datetime-local" v-model="form.tgl_selesai" required class="h-11 rounded-xl" :class="{'border-red-500 focus-visible:ring-red-500': form.errors.tgl_selesai}" />
            <div v-if="form.errors.tgl_selesai" class="text-red-500 text-xs font-semibold">{{ form.errors.tgl_selesai }}</div>
          </div>

          <div class="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <Label :class="{'text-red-500': form.errors.batas_registrasi}">Batas Akhir Penutupan Registrasi</Label>
            <Input type="datetime-local" v-model="form.batas_registrasi" class="h-11 rounded-xl" :class="{'border-red-500 focus-visible:ring-red-500': form.errors.batas_registrasi}" />
            <span class="text-[10px] text-zinc-400 block italic leading-normal">Kosongkan jika pendaftaran dibuka sampai acara selesai.</span>
            <div v-if="form.errors.batas_registrasi" class="text-red-500 text-xs font-semibold">{{ form.errors.batas_registrasi }}</div>
          </div>
        </div>

        <div class="space-y-4 bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 shadow-sm">
          <div class="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div class="flex items-center gap-2">
              <HandHeart class="w-4 h-4 text-indigo-500" />
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
              <Input type="number" v-model.number="form.target_donasi" required min="0" placeholder="Contoh: 5000000" class="h-11 rounded-xl" :class="{'border-red-500 focus-visible:ring-red-500': form.errors.target_donasi}" />
              <div v-if="form.errors.target_donasi" class="text-red-500 text-xs font-semibold">{{ form.errors.target_donasi }}</div>
            </div>

            <div class="space-y-2">
              <Label :class="{'text-red-500': form.errors.panduan_acara}">Instruksi / Rekening Patungan</Label>
              <Input v-model="form.panduan_acara" placeholder="Contoh: Transfer BSI 711223344 a.n Masjid" class="h-11 rounded-xl" :class="{'border-red-500 focus-visible:ring-red-500': form.errors.panduan_acara}" />
              <div v-if="form.errors.panduan_acara" class="text-red-500 text-xs font-semibold">{{ form.errors.panduan_acara }}</div>
            </div>
          </div>
          <div v-else class="text-xs text-zinc-400 italic bg-zinc-50 dark:bg-zinc-900/30 p-3 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center">
            Modul penggalangan dana dinonaktifkan.
          </div>
        </div>
      </div>

    </div>

    <div class="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
      <div class="flex items-center justify-between mb-1">
        <Label :class="{'text-red-500': form.errors.body}">Deskripsi Lengkap, Rencana Kegiatan & Susunan Acara</Label>
        <span class="text-[10px] text-zinc-400 italic">Gunakan gambar di dalam editor untuk dijadikan banner/thumbnail otomatis</span>
      </div>
      <TiptapEditor v-model="form.body" />
      <div v-if="form.errors.body" class="text-red-500 text-xs font-semibold">{{ form.errors.body }}</div>
    </div>

    <div class="flex flex-col md:flex-row gap-4 items-center justify-end pt-6 border-t border-zinc-100 dark:border-zinc-800">
      <Button 
        type="submit" 
        class="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-10 h-12 rounded-xl font-bold gap-2 shadow-lg shadow-indigo-500/20"
        :disabled="form.processing"
      >
        <Save class="w-4 h-4" />
        {{ form.processing ? 'Menyimpan...' : 'Simpan & Publikasikan' }}
      </Button>
    </div>

  </form>
</template>