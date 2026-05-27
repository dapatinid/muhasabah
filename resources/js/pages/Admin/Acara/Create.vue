<script setup lang="ts">
import { Head, useForm, Link } from '@inertiajs/vue3'
import TiptapEditor from '@/Components/TiptapEditor.vue'
import { ArrowLeft, Save, Ticket, HandHeart, CalendarDays, AlertCircle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
  
  // Modul Tiket
  accept_tiket: true,
  harga_tiket: 0,
  kuota_tiket: 100,

  // Modul Donasi / Sponsor
  accept_donasi: false,
  target_donasi: 0,
  panduan_acara: '', // Sinkron dengan validasi 'panduan_acara' di controller

  // Batas Waktu & Registrasi
  tgl_mulai: '',
  tgl_selesai: '',
  batas_registrasi: '', 
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
  // Antisipasi rules 'required_if:accept_donasi,true' di backend Laravel.
  // Jika modul donasi tidak dicentang, isi string kosong agar tidak memicu error text-length,
  // namun jika controller Anda mewajibkan string, biarkan diproses validasi bawaan.
  if (!form.accept_tiket) {
    form.harga_tiket = 0
    form.kuota_tiket = 0
  }
  if (!form.accept_donasi) {
    form.target_donasi = 0
    form.panduan_acara = '-' // Beri fallback aman agar tidak kena 'required_if' string kosong
  }

  form.post('/admin/acara', {
    preserveScroll: true,
    onSuccess: () => {
      form.reset()
    },
    onError: (errors) => {
      console.error("Gagal menyimpan acara:", errors)
    }
  })
}
</script>

<template>
  <Head title="Buat Agenda Acara Baru" />

    <div class="py-10 px-4 w-full mx-auto max-w-5xl">
      
      <div class="flex items-center gap-4 mb-8">
        <Link href="/admin/acara" class="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-indigo-600 transition">
          <ArrowLeft class="size-5" />
        </Link>
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Buat Agenda Acara</h1>
          <p class="text-zinc-500 text-sm">Publikasikan agenda kegiatan, manajemen registrasi, dan pendanaan kepanitiaan.</p>
        </div>
      </div>

      <div v-if="Object.keys(form.errors).length > 0" class="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm flex gap-2 items-start">
        <AlertCircle class="size-5 shrink-0 mt-0.5" />
        <div>
          <span class="font-bold">Gagal menyimpan formulir.</span> Mohon periksa kembali kolom inputan di bawah yang bertanda merah atau pastikan logika urutan tanggal sudah valid.
        </div>
      </div>

      <form @submit.prevent="submit" class="space-y-8 bg-white dark:bg-zinc-900 border p-8 rounded-3xl shadow-sm">
        
        <div class="space-y-6">
          <h2 class="text-lg font-bold text-zinc-800 dark:text-zinc-200 border-b pb-2 flex items-center gap-2">
            <CalendarDays class="size-5 text-indigo-500" /> Informasi Utama Kegiatan
          </h2>

          <div class="space-y-2">
            <Label for="judul" :class="{'text-red-500': form.errors.judul}">Nama / Judul Acara</Label>
            <Input 
              id="judul" 
              v-model="form.judul" 
              placeholder="Contoh: Tabligh Akbar Bersama Ulama Nasional" 
              class="text-lg font-semibold h-12 rounded-xl focus-visible:ring-indigo-500"
              :class="{'border-red-500 focus-visible:ring-red-500': form.errors.judul}"
              required
            />
            <div v-if="form.errors.judul" class="text-red-500 text-xs font-semibold">{{ form.errors.judul }}</div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div v-if="form.errors.kategori" class="text-red-500 text-xs font-semibold">{{ form.errors.kategori }}</div>
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
              <div v-if="form.errors.subkategori" class="text-red-500 text-xs font-semibold">{{ form.errors.subkategori }}</div>
            </div>

            <div class="space-y-2 md:col-span-2">
              <Label for="lokasi" :class="{'text-red-500': form.errors.lokasi}">Lokasi / Tempat Pelaksanaan</Label>
              <Input 
                id="lokasi" 
                v-model="form.lokasi" 
                placeholder="Contoh: Ruang Utama Masjid Al-Ikhlas / Zoom Meeting" 
                class="h-11 rounded-xl focus-visible:ring-indigo-500"
                :class="{'border-red-500 focus-visible:ring-red-500': form.errors.lokasi}"
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
                :class="{'border-red-500 focus-visible:ring-red-500': form.errors.tgl_mulai}"
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
                :class="{'border-red-500 focus-visible:ring-red-500': form.errors.tgl_selesai}"
              />
              <div v-if="form.errors.tgl_selesai" class="text-red-500 text-xs font-semibold">{{ form.errors.tgl_selesai }}</div>
            </div>

            <div class="space-y-2 md:col-span-2">
              <Label for="batas_registrasi" :class="{'text-red-500': form.errors.batas_registrasi}">Batas Akhir Registrasi Pendaftaran</Label>
              <Input 
                id="batas_registrasi" 
                type="datetime-local"
                v-model="form.batas_registrasi" 
                class="h-11 rounded-xl focus-visible:ring-indigo-500"
                :class="{'border-red-500 focus-visible:ring-red-500': form.errors.batas_registrasi}"
              />
              <p class="text-[11px] text-zinc-400 italic">* Harus diatur sebelum atau sama dengan waktu dimulainya acara.</p>
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
            <p class="text-xs text-zinc-500">Aktifkan jika acara ini memerlukan pendaftaran tiket oleh peserta (Gratis atau Berbayar).</p>
            
            <div v-if="form.accept_tiket" class="space-y-4 pt-2">
              <div class="space-y-1.5">
                <Label for="harga_tiket" :class="{'text-red-500': form.errors.harga_tiket}">Harga Tiket Masuk</Label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">Rp</span>
                  <Input 
                    id="harga_tiket" 
                    type="number" 
                    v-model.number="form.harga_tiket" 
                    class="pl-9 h-10 rounded-lg focus-visible:ring-indigo-500"
                    :class="{'border-red-500 focus-visible:ring-red-500': form.errors.harga_tiket}"
                    min="0"
                  />
                </div>
                <p class="text-[10px] text-amber-600">Isi dengan <span class="font-bold">0</span> jika pendaftaran tidak dipungut biaya (Gratis).</p>
                <div v-if="form.errors.harga_tiket" class="text-red-500 text-xs font-semibold">{{ form.errors.harga_tiket }}</div>
              </div>

              <div class="space-y-1.5">
                <Label for="kuota_tiket" :class="{'text-red-500': form.errors.kuota_tiket}">Kuota Batas Maksimal Peserta</Label>
                <Input 
                  id="kuota_tiket" 
                  type="number" 
                  v-model.number="form.kuota_tiket" 
                  class="h-10 rounded-lg focus-visible:ring-indigo-500"
                  :class="{'border-red-500 focus-visible:ring-red-500': form.errors.kuota_tiket}"
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
            <p class="text-xs text-zinc-500">Aktifkan jika panitia membuka kesempatan penggalangan dana infaq operasional atau sponsorship dari luar.</p>
            
            <div v-if="form.accept_donasi" class="space-y-4 pt-2">
              <div class="space-y-1.5">
                <Label for="target_donasi" :class="{'text-red-500': form.errors.target_donasi}">Target Kebutuhan Dana Pendanaan</Label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">Rp</span>
                  <Input 
                    id="target_donasi" 
                    type="number" 
                    v-model.number="form.target_donasi" 
                    class="pl-9 h-10 rounded-lg focus-visible:ring-indigo-500"
                    :class="{'border-red-500 focus-visible:ring-red-500': form.errors.target_donasi}"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div v-if="form.errors.target_donasi" class="text-red-500 text-xs font-semibold">{{ form.errors.target_donasi }}</div>
              </div>

              <div class="space-y-1.5">
                <Label for="panduan_acara" :class="{'text-red-500': form.errors.panduan_acara}">Panduan Pengiriman Sponsorship & Acara</Label>
                <Input 
                  id="panduan_acara" 
                  v-model="form.panduan_acara" 
                  placeholder="Contoh: Paket Sponsor Gold minimal Rp 1.000.000 melalui transfer..." 
                  class="h-10 rounded-lg focus-visible:ring-indigo-500"
                  :class="{'border-red-500 focus-visible:ring-red-500': form.errors.panduan_acara}"
                />
                <div v-if="form.errors.panduan_acara" class="text-red-500 text-xs font-semibold">{{ form.errors.panduan_acara }}</div>
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
            class="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-10 h-12 rounded-xl font-bold gap-2 shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
            :disabled="form.processing"
          >
            <Save class="size-5" />
            {{ form.processing ? 'Menyimpan...' : 'Terbitkan Agenda Acara' }}
          </Button>
        </div>

      </form>
    </div>
</template>