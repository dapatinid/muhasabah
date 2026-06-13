<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { computed, ref } from 'vue'
import { MapPin, UserCircle2, CheckCircle2, ShieldCheck, BookOpen, Heart, CalendarDays, LayoutGrid } from 'lucide-vue-next'
import AppLayoutPublic from '@/layouts/AppLayoutPublic.vue'

const props = defineProps<{
  user: any
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
  return hasil.replace(/^Minggu/, 'Ahad')
}

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
</script>

<template>
  <Head :title="user.name" />

  <AppLayoutPublic subtitle="Profil Tokoh" :title="user.name" :show-back="true" back-href="/ukhuwah">
    <div class="bg-stone-950 min-h-screen pb-20">

      <!-- Cover -->
      <div class="relative h-48 sm:h-64 bg-stone-900 overflow-hidden">
        <img v-if="user.sampul" :src="`/storage/${user.sampul}`" class="w-full h-full object-cover opacity-80" />
        <div v-else class="w-full h-full bg-gradient-to-br from-emerald-950 to-stone-900"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-stone-950 to-transparent"></div>
      </div>

      <!-- Profile Header -->
      <div class="max-w-3xl mx-auto px-5 relative -mt-16 sm:-mt-20">
        <div class="flex flex-col sm:flex-row items-center sm:items-end gap-5 mb-4">

          <!-- Avatar -->
          <div class="relative shrink-0">
            <img v-if="user.avatar" :src="`/storage/${user.avatar}`"
              class="size-32 sm:size-40 rounded-full object-cover border-4 border-stone-950 bg-stone-900 shadow-xl" />
            <div v-else
              class="size-32 sm:size-40 rounded-full border-4 border-stone-950 bg-stone-900 flex items-center justify-center shadow-xl">
              <UserCircle2 class="size-16 text-emerald-600" />
            </div>
            <div class="absolute bottom-2 right-2 bg-emerald-500 rounded-full p-1 border-2 border-stone-950"
              title="Terverifikasi">
              <CheckCircle2 class="size-4 sm:size-5 text-stone-950" />
            </div>
          </div>

          <!-- Info -->
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
            <span
              class="inline-block px-3 py-1 rounded-lg bg-emerald-900/30 text-emerald-400 text-xs font-bold uppercase tracking-widest border border-emerald-500/20">
              {{ user.class || 'Umum' }}
            </span>
          </div>
        </div>

        <!-- Instagram-style Tabs -->
        <div class="sticky top-0 z-10 bg-stone-950 border-b border-stone-800">
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

        <!-- Tab Content -->
        <div class="pt-6">

          <!-- Kalam Tab -->
          <div v-if="activeTab === 'kalam'">
            <div v-if="user.kalams && user.kalams.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                v-for="kalam in user.kalams"
                :key="kalam.id"
                :href="`/kalam/${kalam.slug}`"
                class="block bg-stone-900 border border-stone-800 rounded-2xl p-4 hover:border-emerald-500/40 transition-colors"
              >
                <span class="text-[10px] uppercase text-emerald-500 font-bold tracking-wider mb-2 block">{{ kalam.kategori }}</span>
                <h3 class="text-stone-200 font-bold line-clamp-2 leading-snug">{{ kalam.judul }}</h3>
              </Link>
            </div>
            <div v-else class="py-16 flex flex-col items-center gap-3 text-stone-600">
              <BookOpen class="size-10" />
              <p class="text-sm">Belum ada tulisan kalam.</p>
            </div>
          </div>

          <!-- Donasi Tab -->
          <div v-if="activeTab === 'donasi'">
            <div v-if="user.donasis && user.donasis.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                v-for="donasi in user.donasis"
                :key="donasi.id"
                :href="`/donasi/${donasi.slug}`"
                class="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden hover:border-rose-500/40 transition-colors"
              >
                <div class="h-24 bg-stone-800">
                  <img v-if="donasi.thumbnail" :src="`${donasi.thumbnail}`" class="w-full h-full object-cover" />
                </div>
                <div class="p-4 flex flex-col gap-1">
                  <span class="text-stone-200 font-bold text-sm">{{ donasi.judul }}</span>
                  <span class="text-xs text-stone-400">{{ donasi.subkategori }}</span>
                </div>
              </Link>
            </div>
            <div v-else class="py-16 flex flex-col items-center gap-3 text-stone-600">
              <Heart class="size-10" />
              <p class="text-sm">Belum ada program kebaikan.</p>
            </div>
          </div>

          <!-- Acara Tab — Grid 3 kolom -->
          <div v-if="activeTab === 'acara'">
            <div v-if="user.acaras && user.acaras.length > 0" class="grid grid-cols-3 gap-1">
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
                <!-- Overlay on hover -->
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                  <p class="text-white text-[10px] font-bold line-clamp-2 leading-tight">{{ acara.judul }}</p>
                  <p class="text-stone-300 text-[9px] mt-0.5">{{ acara.lokasi }}</p>
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
  </AppLayoutPublic>
</template>