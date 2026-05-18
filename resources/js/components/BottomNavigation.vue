<script setup lang="ts">
import { ref, computed } from 'vue'
import { Link, usePage } from '@inertiajs/vue3' // Tambahkan usePage di sini
import { 
  House, CalendarDays, MapPin, BookOpenText, 
  HeartHandshake, LayoutGrid, Coins, 
  ChartNoAxesCombined, Scale, HandHeart, Beef, 
  CircleStar
} from 'lucide-vue-next'

// Ambil data page untuk mendeteksi URL aktif
const page = usePage()
const currentUrl = computed(() => page.url)

// Logic FAB Donasi
const isDonationOpen = ref(false)
const toggleDonation = () => isDonationOpen.value = !isDonationOpen.value

const donationMenus = [
  { name: 'Infaq', link: '/donasi?kategori=infaq', icon: Coins },
  { name: 'Program', link: '/donasi?kategori=program', icon: ChartNoAxesCombined },
  { name: 'Zakat', link: '/donasi?kategori=zakat', icon: Scale },
  { name: 'Waqaf', link: '/donasi?kategori=waqaf', icon: HandHeart },
  { name: 'Qurban', link: '/donasi?kategori=qurban', icon: Beef },
]
</script>

<template>
  <footer class="fixed bottom-0 inset-x-0 bg-stone-900/90 backdrop-blur-lg border-t border-stone-800 pb-3 pt-3 z-50 max-w-xl mx-auto">
    <div class="grid grid-cols-5 items-center justify-items-center">
      
      <!-- Beranda -->
      <Link href="/" 
            :class="[currentUrl === '/' ? 'text-amber-500' : 'text-stone-500 hover:text-amber-400']"
            class="flex flex-col items-center gap-1 w-full transition-colors">
        <House class="size-5" />
        <span class="text-[10px]" :class="currentUrl === '/' ? 'font-bold' : 'font-medium'">Beranda</span>
      </Link>

      <!-- Acara -->
      <Link href="/halaman-dibangun" 
            :class="currentUrl === '/halaman-dibangun' ? 'text-amber-500' : 'text-stone-500 hover:text-amber-400'"
            class="flex flex-col items-center gap-1 w-full transition-colors">
        <CalendarDays class="size-5" />
        <span class="text-[10px]" :class="currentUrl === '/halaman-dibangun' ? 'font-bold' : 'font-medium'">Acara</span>
      </Link>

      <!-- Donasi FAB -->
      <div class="relative w-full flex justify-center">
        <transition name="fade-up">
          <div v-if="isDonationOpen"
               class="absolute bottom-14 w-40 bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div class="flex flex-col">
              <Link v-for="menu in donationMenus" :key="menu.name" :href="menu.link" @click="isDonationOpen = false"
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
            <HeartHandshake :class="[isDonationOpen ? 'scale-110 rotate-360' : '']" class="text-white size-6 transition-all duration-300" />
          </button>
          <span class="text-[10px] font-medium text-stone-500">Donasi</span>
        </div>
      </div>

      <!-- Masjid -->
      <!-- Catatan: Ganti href nya jika nanti sudah ada halaman spesifiknya -->
      <Link href="/halaman-dibangun" 
            :class="currentUrl === '/masjid' ? 'text-amber-500' : 'text-stone-500 hover:text-amber-400'"
            class="flex flex-col items-center gap-1 w-full transition-colors">
        <MapPin class="size-5" />
        <span class="text-[10px]" :class="currentUrl === '/masjid' ? 'font-bold' : 'font-medium'">Masjid</span>
      </Link>

      <!-- Ukhuwah -->
      <!-- Catatan: Ganti href nya jika nanti sudah ada halaman spesifiknya -->
      <Link href="/halaman-dibangun" 
            :class="currentUrl === '/ukhuwah' ? 'text-amber-500' : 'text-stone-500 hover:text-amber-400'"
            class="flex flex-col items-center gap-1 w-full transition-colors">
        <CircleStar class="size-5" />
        <span class="text-[10px]" :class="currentUrl === '/ukhuwah' ? 'font-bold' : 'font-medium'">Ukhuwah</span>
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