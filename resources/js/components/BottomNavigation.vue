<script setup lang="ts">
import { ref } from 'vue'
import { Link } from '@inertiajs/vue3'
import { 
  House, CalendarDays, MapPin, BookOpenText, 
  HeartHandshake, LayoutGrid, Coins, 
  ChartNoAxesCombined, Scale, HandHeart, Beef 
} from 'lucide-vue-next'

// Logic FAB Donasi pindah ke sini
const isDonationOpen = ref(false)
const toggleDonation = () => isDonationOpen.value = !isDonationOpen.value

const donationMenus = [
  { name: 'Semua', link: '/halaman-dibangun', icon: LayoutGrid },
  { name: 'Infaq', link: '/halaman-dibangun', icon: Coins },
  { name: 'Program', link: '/halaman-dibangun', icon: ChartNoAxesCombined },
  { name: 'Zakat', link: '/halaman-dibangun', icon: Scale },
  { name: 'Waqaf', link: '/halaman-dibangun', icon: HandHeart },
  { name: 'Qurban', link: '/halaman-dibangun', icon: Beef },
]
</script>

<template>
  <footer class="fixed bottom-0 inset-x-0 bg-stone-900/90 backdrop-blur-lg border-t border-stone-800 pb-3 pt-3 z-50 max-w-xl mx-auto">
    <div class="grid grid-cols-5 items-center justify-items-center">
      
      <!-- Beranda -->
      <Link href="/" class="flex flex-col items-center gap-1 w-full text-amber-500">
        <House class="size-5" />
        <span class="text-[10px] font-bold">Beranda</span>
      </Link>

      <!-- Acara -->
      <Link href="/halaman-dibangun" class="flex flex-col items-center gap-1 w-full text-stone-500 hover:text-amber-400 transition-colors">
        <CalendarDays class="size-5" />
        <span class="text-[10px] font-medium">Acara</span>
      </Link>

      <!-- Donasi FAB -->
      <div class="relative w-full flex justify-center">
        <transition name="fade-up">
          <div v-if="isDonationOpen"
               class="absolute bottom-14 w-40 bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div class="flex flex-col">
              <Link v-for="menu in donationMenus" :key="menu.name" :href="menu.link"
                    class="px-4 py-3 text-[11px] font-semibold text-stone-300 hover:bg-amber-500/10 hover:text-amber-400 border-b border-stone-800/50 last:border-0 transition-colors flex items-center justify-between group">
                <span>{{ menu.name }}</span>
                <component :is="menu.icon" class="size-3.5 text-stone-500 group-hover:text-amber-500 transition-colors" />
              </Link>
            </div>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-stone-900 border-r border-b border-stone-800 rotate-45"></div>
          </div>
        </transition>

        <div class="absolute -top-12 flex flex-col items-center">
          <button @click="toggleDonation"
                  :class="[isDonationOpen ? 'scale-110' : '']"
                  class="bg-linear-to-b from-amber-400 to-amber-600 w-14 h-14 rounded-full shadow-[0_8px_20px_rgba(217,119,6,0.4)] flex items-center justify-center border-4 border-stone-950 transition-all duration-300">
            <HeartHandshake :class="[isDonationOpen ? 'scale-110 rotate-360' : '']" class="size-6 transition-all duration-300" />
          </button>
          <span class="text-[10px] font-medium text-stone-500">Donasi</span>
        </div>
      </div>

      <!-- Masjid -->
      <Link href="/halaman-dibangun" class="flex flex-col items-center gap-1 w-full text-stone-500 hover:text-amber-400 transition-colors">
        <MapPin class="size-5" />
        <span class="text-[10px] font-medium">Masjid</span>
      </Link>

      <!-- Riyadhoh -->
      <Link href="/laporan-riyadhoh" class="flex flex-col items-center gap-1 w-full text-stone-500 hover:text-amber-400 transition-colors">
        <BookOpenText class="size-5" />
        <span class="text-[10px] font-medium">Riyadhoh</span>
      </Link>

    </div>
  </footer>
</template>

<style scoped>
.fade-up-enter-active, .fade-up-leave-active {
  transition: all 0.3s ease;
}
.fade-up-enter-from, .fade-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>