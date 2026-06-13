<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { computed } from 'vue'
import { MapPin, UserCircle2, CheckCircle2, ShieldCheck, BookOpen, Heart, CalendarDays } from 'lucide-vue-next'
import AppLayoutPublic from '@/layouts/AppLayoutPublic.vue'

const props = defineProps<{
  user: any; // Menerima data user dari UkhuwahController
}>()

const joinedDate = computed(() => {
  return new Date(props.user.created_at).toLocaleDateString('id-ID', {
    month: 'long', year: 'numeric'
  })
})

function getTglAcara(tgl: string): string {
  const hasil = new Date(tgl).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric', 
    month: 'long',   
    year: 'numeric',
  })

  // Mengganti teks "Minggu" menjadi "Ahad" jika ada
  return hasil.replace(/^Minggu/, 'Ahad')
}
</script>

<template>
  <Head :title="user.name" />

  <AppLayoutPublic subtitle="Profil Tokoh" :title="user.name" :show-back="true" back-href="/ukhuwah">
    <div class="bg-stone-950 min-h-screen pb-20">
      
      <div class="relative h-48 sm:h-64 bg-stone-900 overflow-hidden">
        <img v-if="user.sampul" :src="`/storage/${user.sampul}`" class="w-full h-full object-cover opacity-80" />
        <div v-else class="w-full h-full bg-linear-to-br from-emerald-950 to-stone-900"></div>
        <div class="absolute inset-0 bg-linear-to-t from-stone-950 to-transparent"></div>
      </div>

      <div class="max-w-3xl mx-auto px-5 relative -mt-16 sm:-mt-20">
        <div class="flex flex-col sm:flex-row items-center sm:items-end gap-5 mb-8">
          
          <div class="relative shrink-0">
            <img v-if="user.avatar" :src="`/storage/${user.avatar}`" class="size-32 sm:size-40 rounded-full object-cover border-4 border-stone-950 bg-stone-900 shadow-xl" />
            <div v-else class="size-32 sm:size-40 rounded-full border-4 border-stone-950 bg-stone-900 flex items-center justify-center shadow-xl">
              <UserCircle2 class="size-16 text-emerald-600" />
            </div>
            <div class="absolute bottom-2 right-2 bg-emerald-500 rounded-full p-1 border-2 border-stone-950" title="Terverifikasi">
              <CheckCircle2 class="size-4 sm:size-5 text-stone-950" />
            </div>
          </div>

          <div class="text-center sm:text-left flex-1 pb-2">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">{{ user.name }}</h1>
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm text-stone-400 mb-3">
              <span class="inline-flex items-center gap-1"><ShieldCheck class="size-4 text-emerald-500" /> {{ user.level || 'Anggota' }}</span>
              <span>•</span>
              <span class="inline-flex items-center gap-1"><MapPin class="size-4 text-rose-500" /> {{ user.city?.name || 'Indonesia' }}</span>
            </div>
            <span class="inline-block px-3 py-1 rounded-lg bg-emerald-900/30 text-emerald-400 text-xs font-bold uppercase tracking-widest border border-emerald-500/20">
              {{ user.class || 'Umum' }}
            </span>
          </div>
        </div>

        <div class="h-px w-full bg-stone-800 mb-8"></div>

        <div class="space-y-10">
          
          <div v-if="user.kalams && user.kalams.length > 0" class="space-y-4">
            <h2 class="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen class="size-5 text-emerald-400" /> Tulisan Kalam
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link v-for="kalam in user.kalams" :key="kalam.id" :href="`/kalam/${kalam.slug}`" class="block bg-stone-900 border border-stone-800 rounded-2xl p-4 hover:border-emerald-500/40 transition-colors">
                <span class="text-[10px] uppercase text-emerald-500 font-bold tracking-wider mb-2 block">{{ kalam.kategori }}</span>
                <h3 class="text-stone-200 font-bold line-clamp-2 leading-snug">{{ kalam.judul }}</h3>
              </Link>
            </div>
          </div>

          <div v-if="user.donasis && user.donasis.length > 0" class="space-y-4">
            <h2 class="text-lg font-bold text-white flex items-center gap-2">
              <Heart class="size-5 text-amber-400" /> Program Kebaikan
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link v-for="donasi in user.donasis" :key="donasi.id" :href="`/donasi/${donasi.slug}`" class="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden hover:border-rose-500/40 transition-colors">
                <div class="h-24 bg-stone-800"><img v-if="donasi.thumbnail" :src="`${donasi.thumbnail}`" class="w-full h-full object-cover" /></div>
                <div class="p-4 flex flex-col gap-1 flex-nowrap"><span class="text-stone-200 font-bold text-sm">{{ donasi.judul }}</span> <span class="text-xs text-stone-400">{{ donasi.subkategori }}</span></div>
              </Link>
            </div>
          </div>

          <div v-if="user.acaras && user.acaras.length > 0" class="space-y-4">
            <h2 class="text-lg font-bold text-white flex items-center gap-2">
              <CalendarDays class="size-5 text-indigo-400" /> Penyelenggaraan Acara
            </h2>
            <div class="grid grid-cols-1 gap-4">
              <Link v-for="acara in user.acaras" :key="acara.id" :href="`/acara/${acara.slug}`" class="flex bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-colors">
                <div class="w-24 bg-stone-800 shrink-0"><img v-if="acara.thumbnail" :src="`${acara.thumbnail}`" class="w-full h-full object-cover" /></div>
                <div class="p-4 flex-1">
                  <h3 class="text-stone-200 font-bold line-clamp-1 text-sm mb-1">{{ acara.judul }}</h3>
                  <p class="text-xs text-stone-400">{{ acara.lokasi }} | {{ getTglAcara(acara.tgl_mulai) }} - {{ getTglAcara(acara.tgl_selesai) }}</p>
                </div>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  </AppLayoutPublic>
</template>