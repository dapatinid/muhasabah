<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { MapPin, Target, Star } from 'lucide-vue-next'
import AppLayoutPublic from '@/layouts/AppLayoutPublic.vue'

const props = defineProps<{
  lingkaran: any;
}>()

function formatRating(num: any) { return num ? Number(num).toFixed(1) : '0.0' }
</script>

<template>
  <Head :title="lingkaran.nama" />

  <AppLayoutPublic subtitle="Lingkaran" :title="lingkaran.nama" :show-back="true" back-href="/ukhuwah">
    <div class="bg-linear-to-b from-black via-black to-black/0 pb-20">
      
      <div class="relative h-56 sm:h-72 bg-stone-900 overflow-hidden">
        <img v-if="lingkaran.sampul" :src="`/storage/${lingkaran.sampul}`" class="w-full h-full object-cover opacity-70" />
        <div v-else class="w-full h-full bg-linear-to-br from-emerald-950 to-stone-900"></div>
        <div class="absolute inset-0 bg-linear-to-t from-stone-950 to-transparent"></div>
      </div>

      <div class="max-w-3xl mx-auto px-5 relative -mt-16">
        
        <div class="bg-stone-900 border border-stone-800 p-5 sm:p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-8">
          <div class="relative shrink-0 -mt-12 sm:-mt-16">
            <img v-if="lingkaran.logo" :src="`/storage/${lingkaran.logo}`" class="size-24 sm:size-32 rounded-full object-cover border-4 border-stone-900 bg-stone-800 shadow-lg" />
            <div v-else class="size-24 sm:size-32 rounded-2xl border-4 border-stone-900 bg-stone-800 flex items-center justify-center shadow-lg">
              <Target class="size-10 text-emerald-600" />
            </div>
          </div>

          <div class="text-center sm:text-left flex-1 w-full">
            <span class="inline-block px-2.5 py-0.5 rounded-md bg-emerald-900/30 text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20 mb-2">
              {{ lingkaran.jenis }}
            </span>
            <h1 class="text-2xl font-extrabold text-white leading-tight mb-2">{{ lingkaran.nama }}</h1>
            <div class="flex items-start justify-center sm:justify-start gap-1.5 text-xs text-stone-400">
              <MapPin class="size-4 text-rose-500 shrink-0" />
              <span class="leading-relaxed">{{ lingkaran.alamat || 'Alamat tidak tersedia' }}</span>
            </div>
          </div>

          <div class="flex flex-col items-center justify-center p-3 rounded-2xl bg-stone-950 border border-stone-800 min-w-24">
            <Star class="size-6 text-amber-400 fill-amber-400 mb-1" />
            <span class="text-lg font-bold text-white">{{ formatRating(lingkaran.ratings_avg_score) }}</span>
            <span class="text-[9px] text-stone-500 uppercase font-bold">{{ lingkaran.ratings_count || 0 }} Ulasan</span>
          </div>
        </div>

        <div class="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8">
          <h2 class="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-6 border-b border-stone-800 pb-3">Profil Lingkaran</h2>
          
          <div v-if="lingkaran.deskripsi"
            class="prose prose-invert prose-stone max-w-none
                   prose-p:text-stone-300 prose-p:leading-relaxed prose-p:text-[15px]
                   prose-headings:font-bold prose-headings:text-emerald-100
                   prose-strong:text-emerald-200
                   prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                   prose-ul:text-stone-300 prose-ol:text-stone-300
                   prose-img:rounded-2xl prose-img:border prose-img:border-stone-800
                   prose-iframe:w-full prose-iframe:aspect-video prose-iframe:rounded-xl"
            v-html="lingkaran.deskripsi"
          />
          <div v-else class="text-center py-10 text-stone-500 text-sm">
            Deskripsi profil belum dilengkapi oleh pengurus lingkaran ini.
          </div>
        </div>

      </div>
    </div>
  </AppLayoutPublic>
</template>

<style scoped>
.prose :deep(iframe) { width: 100% !important; aspect-ratio: 16 / 9 !important; height: auto !important; border-radius: 0.75rem; border: 1px solid #292524; }
</style>