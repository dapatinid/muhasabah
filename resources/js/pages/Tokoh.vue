<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { computed, ref } from 'vue'
import { 
  MapPin, UserCircle2, CheckCircle2, ShieldCheck, 
  BookOpen, Heart, CalendarDays, Target, MoonStar, MessageCircle, Share2, Info,
  Check, Activity, Send
} from 'lucide-vue-next'
import AppLayoutPublic from '@/layouts/AppLayoutPublic.vue'

// Import Dialog UI Components (Sesuaikan dengan path komponen UI Anda)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

const props = defineProps<{
  user: any
}>()

const joinedDate = computed(() => {
  return new Date(props.user.created_at).toLocaleDateString('id-ID', {
    month: 'long', year: 'numeric'
  })
})

// Hitung Total Seluruh Donasi Masuk
const totalDonasiKeseluruhan = computed(() => {
  if (!props.user.donasis) return 0;
  return props.user.donasis.reduce((total: number, donasi: any) => {
    return total + (Number(donasi.donasi_masuk) || 0);
  }, 0);
});

// Format Rupiah

const formatRupiah = (angka: number) => {

return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

}

// Format Rupiah
const formatRupiahDisingkat = (angka: number): string => {
  if (angka < 1000) return angka.toString();

  const units = [
    { value: 1e18, label: 'kuintiliun' },
    { value: 1e15, label: 'kuadriliun' },
    { value: 1e12, label: 'triliun' },
    { value: 1e9,  label: 'miliar' },
    { value: 1e6,  label: 'juta' },
    { value: 1e3,  label: 'ribu' },
  ];

  for (let i = 0; i < units.length; i++) {
    if (angka >= units[i].value) {
      // Bagi angka dengan unit skala
      const result = angka / units[i].value;
      
      // Gunakan toLocaleString untuk memastikan format Indonesia (1.234,56)
      // Kita batasi maksimum 2 angka di belakang koma
      const formatted = result.toLocaleString('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });

      return `${formatted} ${units[i].label}`;
    }
  }

  return angka.toString();
}


// Modal State
const showLingkaranDialog = ref(false)
const showMasjidDialog = ref(false)
const showTentangDialog = ref(false)
const showPesanDialog = ref(false)

// Tabs
type TabKey = 'kalam' | 'donasi' | 'acara'
const activeTab = ref<TabKey>('kalam')

const tabs: { key: TabKey; label: string; icon: any; color: string; activeColor: string; borderColor: string; count: () => number }[] = [
  {
    key: 'kalam',
    label: 'Kalam',
    icon: BookOpen,
    color: 'text-stone-400',
    activeColor: 'text-emerald-400 bg-linear-to-t from-emerald-900/40 to-transparent',
    borderColor: 'border-emerald-400',
    count: () => props.user.kalams?.length ?? 0,
  },
  {
    key: 'donasi',
    label: 'Kebaikan',
    icon: Heart,
    color: 'text-stone-400',
    activeColor: 'text-amber-400 bg-linear-to-t from-amber-900/40 to-transparent',
    borderColor: 'border-amber-400',
    count: () => props.user.donasis?.length ?? 0,
  },
  {
    key: 'acara',
    label: 'Acara',
    icon: CalendarDays,
    color: 'text-stone-400',
    activeColor: 'text-indigo-400 bg-linear-to-t from-indigo-900/30 to-transparent',
    borderColor: 'border-indigo-400',
    count: () => props.user.acaras?.length ?? 0,
  },
]

const daftarClass = computed((): string[] => {
  if (!props.user?.class) return [];
  // Memisahkan string berdasarkan koma dan membersihkan spasi di ujungnya
  return props.user.class.split(',').map((cls: string) => cls.trim()).filter(Boolean);
});

// Fungsi pembantu jika ingin mengarahkan langsung ke WA dengan template teks
const hubungiWhatsapp = () => {
  let nomor = props.user.whatsapp;

  if (!nomor) {
    alert("Nomor WhatsApp tokoh belum tersedia.");
    return;
  }

  // 1. Bersihkan nomor: Hapus semua karakter non-angka
  nomor = nomor.replace(/\D/g, '');

  // 2. Jika diawali angka '0', ganti menjadi '62' (kode Indonesia)
  if (nomor.startsWith('0')) {
    nomor = '62' + nomor.substring(1);
  }
  
  // 3. Jika nomor tidak diawali 62, tambahkan 62 (opsional, untuk keamanan)
  if (!nomor.startsWith('62')) {
    nomor = '62' + nomor;
  }

  // 4. Encode pesan
  const teks = encodeURIComponent(`_Assalamu'alaikum wr wb._ \nSaudara/i ${props.user.name}. \nSaya ingin mengobrol, nomor ini saya dapat lewat halaman Tokoh di muhasabah.id.`);
  
  // 5. Buka link
  const url = `https://wa.me/${nomor}?text=${teks}`;
  window.open(url, '_blank');
}
</script>

<template>
  <Head :title="user.name" />

  <AppLayoutPublic subtitle="Profil Tokoh" :title="user.name" :show-back="true" back-href="/ukhuwah">
    <div class="bg-linear-to-b from-black via-black to-black/0 pb-20 min-h-screen">

      <div class="relative h-48 sm:h-64 bg-stone-900 overflow-hidden">
        <img v-if="user.sampul" :src="`/storage/${user.sampul}`" class="w-full h-full object-cover opacity-80" />
        <div v-else class="w-full h-full bg-gradient-to-br from-emerald-950 to-stone-900"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-stone-950 to-transparent"></div>
      </div>

      <div class="max-w-3xl mx-auto relative -mt-16 sm:-mt-20">
        <div class="flex flex-col sm:flex-row items-center sm:items-end gap-5 mb-4 px-5">

          <div class="relative shrink-0">
            <img v-if="user.avatar" :src="`/storage/${user.avatar}`"
              class="size-32 sm:size-40 rounded-full object-cover border-4 border-stone-950 bg-stone-900 shadow-xl" />
            <div v-else
              class="size-32 sm:size-40 rounded-full border-4 border-stone-950 bg-stone-900 flex items-center justify-center shadow-xl">
              <UserCircle2 class="size-16 text-emerald-600" />
            </div>
            <div v-if="user.is_online" class="absolute bottom-2 right-2 bg-emerald-500 rounded-full p-1 border-2 border-stone-950"
              title="Terverifikasi">
              <Activity class="size-4 sm:size-5 text-stone-950" />
            </div>
          </div>

          <div class="text-center sm:text-left flex-1 pb-2">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">{{ user.name }}</h1>
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm text-stone-400 mb-3">
              <span class="inline-flex items-center gap-1">
                <ShieldCheck class="size-4 text-emerald-500" /> {{ user.level || 'Anggota' }}
              </span>
              <span>•</span>
              <span class="inline-flex items-center gap-1">
                <MapPin class="size-4 text-rose-500" /> {{ user.city?.name || 'Indonesia' }}
              </span>
            </div>
            <div class="flex flex-wrap gap-2 justify-center sm:justify-start">
              <template v-if="daftarClass.length > 0">
                <span
                  v-for="(item, index) in daftarClass"
                  :key="index"
                  class="inline-block px-3 py-1 rounded-lg bg-emerald-900/30 text-emerald-400 text-xs font-bold uppercase tracking-widest border border-emerald-500/20"
                >
                  {{ item }}
                </span>
              </template>
              <span
                v-else
                class="inline-block px-3 py-1 rounded-lg bg-stone-900 text-stone-400 text-xs font-bold uppercase tracking-widest border border-stone-800"
              >
                Umum
              </span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 px-5 mb-6">
            <button @click="showTentangDialog = true" class="flex items-center justify-center gap-2 py-2.5 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-xl text-stone-300 text-xs font-bold transition-colors">
                <Info class="size-4 text-amber-500" />
                <!-- <span class="truncate">Tentang</span> -->
            </button>

            <button @click="showLingkaranDialog = true" class="flex items-center justify-center gap-2 py-2.5 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-xl text-stone-300 text-xs font-bold transition-colors">
                <Target class="size-4 text-emerald-500" />
                <!-- <span class="truncate">Lingkaran</span> -->
            </button>

            <button @click="showMasjidDialog = true" class="flex items-center justify-center gap-2 py-2.5 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-xl text-stone-300 text-xs font-bold transition-colors">
                <MoonStar class="size-4 text-emerald-500" />
                <!-- <span class="truncate">Masjid</span> -->
            </button>

            <button @click="showPesanDialog = true" class="flex items-center justify-center gap-2 py-2.5 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-xl text-stone-300 text-xs font-bold transition-colors">
                <MessageCircle class="size-4 text-sky-500" />
                <!-- <span class="truncate">Pesan</span> -->
            </button>
        </div>

        <div class="sticky top-[60px] sm:top-[64px] z-10 bg-stone-950/95 backdrop-blur-sm border-b border-stone-800 pt-2">
          <div class="flex">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="activeTab = tab.key"
              :class="[
                'flex-1 flex flex-col items-center gap-1.5 py-3 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 border-b-2',
                activeTab === tab.key
                  ? `${tab.activeColor} ${tab.borderColor}`
                  : 'text-stone-500 border-transparent hover:text-stone-300'
              ]"
            >
              <div class="flex items-center gap-2"> 
                <component :is="tab.icon" class="size-5" /> <span class="font-bold text-lg">{{ tab.count() }}</span>
              </div>
              <div>{{ tab.label }}</div>
            </button>
          </div>
        </div>

        <div class="pt-3">

          <div v-if="activeTab === 'kalam'">
            <div v-if="user.kalams && user.kalams.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4 px-3 mt-2">
              <Link
                v-for="kalam in user.kalams"
                :key="kalam.id"
                :href="`/kalam/${kalam.slug}`"
                class="block bg-stone-900 border border-stone-800 rounded-2xl p-4 hover:border-emerald-500/40 transition-colors group relative"
              >
                <div class="flex justify-between items-center mb-2">
                    <span class="text-[10px] uppercase text-emerald-500 font-bold tracking-wider">{{ kalam.kategori }}</span>
                    <div class="flex items-center gap-3 text-stone-500 text-xs font-mono">
                      <span class="flex items-center gap-1" title="Reaksi"><Heart class="size-3" /> {{ kalam.reaksis_count || 0 }}</span>
                        <span class="flex items-center gap-1" title="Komentar"><MessageCircle class="size-3" /> {{ kalam.komentars_count || 0 }}</span>
                    </div>
                </div>
                <h3 class="text-stone-200 font-bold line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">{{ kalam.judul }}</h3>
              </Link>
            </div>
            <div v-else class="py-16 flex flex-col items-center gap-3 text-stone-600">
              <BookOpen class="size-10" />
              <p class="text-sm">Belum ada tulisan kalam.</p>
            </div>
          </div>

          <div v-if="activeTab === 'donasi'">
            
            <div v-if="user.donasis && user.donasis.length > 0" class="px-3 mb-4">
                <div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-center justify-between">
                    <div class="flex items-center gap-2 text-amber-500">
                        <Info class="size-5" />
                        <span class="text-xs font-bold uppercase tracking-wider">Total Donasi</span>
                    </div>
                    <span class="text-amber-400 font-black font-mono">{{ formatRupiahDisingkat(totalDonasiKeseluruhan) }}</span>
                </div>
            </div>

            <div v-if="user.donasis && user.donasis.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4 px-3">
              <Link
                v-for="donasi in user.donasis"
                :key="donasi.id"
                :href="`/donasi/${donasi.slug}`"
                class="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-colors flex flex-col group"
              >
                <div class="h-32 bg-stone-800 relative">
                  <img v-if="donasi.thumbnail" :src="`${donasi.thumbnail}`" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent"></div>
                  <div class="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                       <span class="bg-stone-900/80 backdrop-blur text-stone-300 text-[10px] px-2 py-1 rounded-md">{{ donasi.subkategori }}</span>
                   </div>
                </div>
                <div class="p-4 flex flex-col gap-2 flex-1">
                  <h3 class="text-stone-200 font-bold text-sm line-clamp-2 leading-snug group-hover:text-amber-400">{{ donasi.judul }}</h3>
                  
                  <div class="mt-auto pt-2 border-t border-stone-800 flex justify-between items-center text-xs">
                      <span class="text-stone-500">Terkumpul</span>
                      <span class="text-amber-400 font-bold font-mono">{{ formatRupiahDisingkat(donasi.donasi_masuk || 0) }}</span>
                  </div>
                </div>
              </Link>
            </div>
            <div v-else class="py-16 flex flex-col items-center gap-3 text-stone-600">
              <Heart class="size-10" />
              <p class="text-sm">Belum ada program kebaikan.</p>
            </div>
          </div>

          <div v-if="activeTab === 'acara'">
            <div v-if="user.acaras && user.acaras.length > 0" class="grid grid-cols-3 gap-1 px-1">
              <Link
                v-for="acara in user.acaras"
                :key="acara.id"
                :href="`/acara/${acara.slug}`"
                class="group relative aspect-[21/30] bg-stone-900 overflow-hidden hover:opacity-90 transition-opacity"
              >
                <img
                  v-if="acara.thumbnail"
                  :src="`${acara.thumbnail}`"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full bg-stone-800 flex items-center justify-center">
                  <CalendarDays class="size-8 text-stone-600" />
                </div>
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                  <p class="text-white text-[10px] font-bold line-clamp-2 leading-tight">{{ acara.judul }}</p>
                  <p class="text-stone-300 text-[9px] mt-0.5 truncate">{{ acara.lokasi }}</p>
                </div>
              </Link>
            </div>
            <div v-else class="py-16 flex flex-col items-center gap-3 text-stone-600">
              <CalendarDays class="size-10" />
              <p class="text-sm">Belum ada penyelenggaraan acara.</p>
            </div>
          </div>

        </div>
      </div>
    </div>

    <Dialog v-model:open="showLingkaranDialog">
        <DialogContent class="bg-stone-950 border border-stone-800 text-stone-200">
            <DialogHeader>
                <DialogTitle class="flex items-center gap-2"><Target class="size-5 text-emerald-500"/> Relasi Lingkaran</DialogTitle>
                <DialogDescription class="text-stone-400">
                    Daftar komunitas, yayasan, atau entitas yang menaungi <strong>{{ user.name }}</strong>.
                </DialogDescription>
            </DialogHeader>
            <div class="py-4">
                <div v-if="user.lingkarans && user.lingkarans.length > 0" class="space-y-3">
                    <Link v-for="lingkaran in user.lingkarans" :key="lingkaran.id" :href="`/lingkaran/${lingkaran.slug}`" class="flex items-center gap-4 p-3 rounded-xl border border-stone-800 hover:border-emerald-500/40 bg-stone-900 transition-colors">
                        <div class="size-12 shrink-0 bg-stone-800 rounded-lg overflow-hidden flex items-center justify-center">
                            <img v-if="lingkaran.logo" :src="`/storage/${lingkaran.logo}`" class="w-full h-full object-cover" />
                            <Target v-else class="size-6 text-stone-500" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <h4 class="font-bold text-sm text-stone-200 truncate">{{ lingkaran.nama }}</h4>
                            <p class="text-xs text-stone-500 truncate">Kunjungi profil lingkaran →</p>
                        </div>
                    </Link>
                </div>
                <div v-else class="text-center py-6 text-sm text-stone-500 italic border border-dashed border-stone-800 rounded-xl">
                    Belum ada relasi lingkaran.
                </div>
            </div>
        </DialogContent>
    </Dialog>

    <Dialog v-model:open="showMasjidDialog">
        <DialogContent class="bg-stone-950 border border-stone-800 text-stone-200">
            <DialogHeader>
                <DialogTitle class="flex items-center gap-2"><MoonStar class="size-5 text-emerald-500"/> Relasi Masjid</DialogTitle>
                <DialogDescription class="text-stone-400">
                    Daftar masjid tempat <strong>{{ user.name }}</strong> berkontribusi atau terdaftar sebagai pengurus/jamaah.
                </DialogDescription>
            </DialogHeader>
            <div class="py-4">
                <div v-if="user.masjids && user.masjids.length > 0" class="space-y-3">
                    <Link v-for="masjid in user.masjids" :key="masjid.id" :href="`/masjid/${masjid.slug}`" class="flex items-center gap-4 p-3 rounded-xl border border-stone-800 hover:border-emerald-500/40 bg-stone-900 transition-colors">
                        <div class="size-12 shrink-0 bg-stone-800 rounded-full overflow-hidden flex items-center justify-center">
                            <img v-if="masjid.logo" :src="`/storage/${masjid.logo}`" class="w-full h-full object-cover" />
                            <MoonStar v-else class="size-6 text-stone-500" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <h4 class="font-bold text-sm text-stone-200 truncate">{{ masjid.nama }}</h4>
                            <p class="text-xs text-stone-500 truncate">Kunjungi profil masjid →</p>
                        </div>
                    </Link>
                </div>
                <div v-else class="text-center py-6 text-sm text-stone-500 italic border border-dashed border-stone-800 rounded-xl">
                    Belum ada relasi masjid.
                </div>
            </div>
        </DialogContent>
    </Dialog>

    <Dialog :open="showTentangDialog" @update:open="showTentangDialog = $event">
        <DialogContent class="bg-stone-950 border-stone-800 text-stone-100 max-w-lg rounded-2xl">
            <DialogHeader>
                <DialogTitle class="flex items-center gap-2 text-stone-100 font-bold">
                    <Info class="size-5 text-amber-500" />
                    Autobiografi / Riwayat Hidup
                </DialogTitle>
                <DialogDescription class="text-stone-400 text-xs">
                    Mengenal lebih dekat profil ringkas dari <strong>{{ user.name }}</strong>.
                </DialogDescription>
            </DialogHeader>
            
            <div class="py-4 max-h-[60vh] overflow-y-auto pr-1">
                <div 
                    v-if="user.tentang_saya && user.tentang_saya.autobiografi" 
                    class="prose prose-sm prose-invert text-stone-300 leading-relaxed text-sm break-words"
                    v-html="user.tentang_saya.autobiografi"
                ></div>
                
                <div v-else class="text-center py-8 text-sm text-stone-500 italic border border-dashed border-stone-800 rounded-xl">
                    Tokoh ini belum menuliskan riwayat hidup atau autobiografinya.
                </div>
            </div>
        </DialogContent>
    </Dialog>

    <Dialog :open="showPesanDialog" @update:open="showPesanDialog = $event">
        <DialogContent class="bg-stone-950 border-stone-800 text-stone-100 max-w-sm rounded-2xl text-center">
            <DialogHeader class="items-center text-center">
                <div class="p-3 bg-sky-500/10 text-sky-500 rounded-full w-fit mb-2">
                    <MessageCircle class="size-6" />
                </div>
                <DialogTitle class="text-stone-100 font-bold text-lg">
                    Hubungi Tokoh
                </DialogTitle>
                <DialogDescription class="text-stone-400 text-sm mt-2 leading-relaxed text-center">                    Pesan atau obrolan ini akan dialihkan langsung menuju aplikasi <strong>WhatsApp</strong>.
                        
                        <span class="text-stone-400 text-xs block leading-relaxed text-left bg-stone-900/50 p-3 rounded-xl border border-stone-800/60 mt-4">
                            <strong class="text-stone-300">💡 Etika Menghubungi Tokoh/Relawan:</strong>
                            <ul class="list-disc pl-4 mt-1.5 space-y-1 text-stone-400">
                                <li>Awali dengan salam, perkenalkan diri, dan sampaikan maksud dengan jelas.</li>
                                <li>Gunakan bahasa yang santun dan hindari mengirim pesan berulang (<em>spam</em>).</li>
                                <li>Relawan memiliki kesibukan pribadi, mohon maklum dan bersabar jika tidak langsung dibalas.</li>
                            </ul>
                        </span>
                </DialogDescription>
            </DialogHeader>
            
            <div class="pt-4 flex flex-col gap-2">
                <button 
                    @click="hubungiWhatsapp"
                    class="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/10 transition-all"
                >
                    <Send class="size-4 fill-current" />
                    Buka WhatsApp
                </button>
                
                <button 
                    @click="showPesanDialog = false"
                    class="w-full py-2.5 bg-transparent hover:bg-stone-900 border border-transparent hover:border-stone-800 text-stone-400 hover:text-stone-200 text-xs font-medium rounded-xl transition-all"
                >
                    Kembali
                </button>
            </div>
        </DialogContent>
    </Dialog>    

  </AppLayoutPublic>
</template>