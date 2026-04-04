<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { BookOpen, BookOpenText, CalendarDays, HeartHandshake, House, MapPin, Newspaper, Search, UserRound } from 'lucide-vue-next';
import { ref } from 'vue';

// Mock Data untuk Banner & Artikel
const banners = [
    { id: 1, title: 'Menyambut Idul Adha', image: 'https://images.unsplash.com/photo-1587617425953-9075d28b8c46?q=80&w=2070&auto=format&fit=crop', subtitle: 'Kisah Nabi Ibrahim AS dan nabi Ismail AS' },
    { id: 2, title: 'Persiapkan Qurban Terbaik', image: 'https://images.unsplash.com/photo-1656635098050-cd59fc6a2a52?q=80&w=2070&auto=format&fit=crop', subtitle: 'Berbagi adalah bentuk kebaikan dan keberkahan' },
    { id: 3, title: 'Tahun Baru Islam', image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=400&auto=format&fit=crop', subtitle: '14 abad dalam sejarah Islam dan tradisi yang diwariskan' },
];

const categories = [
    { name: 'Tulis Artikel', icon: '📋', link: '#', color: 'bg-amber-500/20 text-amber-400' },
    { name: 'Buat Acara', icon: '📅', link: '#', color: 'bg-rose-500/30 text-rose-400' },
    { name: 'Galang Dana', icon: '💰', link: '#', color: 'bg-emerald-500/20 text-emerald-400' },
    { name: '+Daftar Masjid', icon: '🕌', link: '#', color: 'bg-blue-500/20 text-blue-400' },
];

const articles = [
    { title: 'Keutamaan Shalat Tahajud di Sepertiga Malam', excerpt: 'Shalat tahajud adalah shalat sunnah yang paling utama setelah shalat fardhu...', date: '12 Apr 2026', image: 'https://images.unsplash.com/photo-1637518026117-9d1ac5e73f07?q=80&w=987&auto=format&fit=crop' },
    { title: 'Adab Berdoa Agar Cepat Dikabulkan', excerpt: 'Salah satu adab terpenting dalam berdoa adalah menghadirkan hati dan keyakinan...', date: '10 Apr 2026', image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=400&auto=format&fit=crop' },
];

const searchQuery = ref('');


const isDonationOpen = ref(false); // State untuk dropdown
const toggleDonation = () => isDonationOpen.value = !isDonationOpen.value;

// Mock data untuk menu donasi
const donationMenus = [
    { name: 'Semua', link: '#' },
    { name: 'Infaq', link: '#' },
    { name: 'Program', link: '#' },
    { name: 'Waqaf', link: '#' },
    { name: 'Qurban', link: '#' },
];
</script>

<template>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
    <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

<Head title="Beranda Ibadah" />

<div class="min-h-screen bg-black relative overflow-x-hidden">
        
    <div class="fixed inset-0 z-0 opacity-20 pointer-events-none" 
            :style="{ 
            backgroundImage: `url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22 viewBox=%220 0 80 80%22><path d=%22M40 0 L50 30 L80 40 L50 50 L40 80 L30 50 L0 40 L30 30 Z%22 fill=%22none%22 stroke=%22%23d4a017%22 stroke-width=%221%22/></svg>')`,
            backgroundSize: '100px 100px'
            }">
    </div>

    <div class="relative z-10 min-h-screen bg-stone-950 font-sans text-stone-100 max-w-xl mx-auto border-x border-stone-800 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
             style="font-family: 'Plus Jakarta Sans', sans-serif; background-image: radial-gradient(ellipse at 20% 0%, rgba(120,90,40,0.15) 0%, transparent 50%);">

        <nav class="px-6 py-5 flex justify-between items-center sticky top-0 z-50 bg-stone-950/80 backdrop-blur-md border-b border-stone-800/50">
            <div>
                <p class="text-[10px] text-amber-500 tracking-[0.2em] uppercase font-bold">Assalamu'alaikum,</p>
                <h1 class="text-lg font-bold text-stone-100" style="font-family: 'Amiri', serif;">Hamba Allah</h1>
            </div>
            <div class="w-10 h-10 rounded-full bg-stone-800 border border-amber-500/30 flex items-center justify-center text-xl">
                <UserRound />
            </div>
        </nav>    

        <main class="px-5 space-y-8 pb-32">
            
            <section class="relative mt-5">
                <div class="relative group">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 group-focus-within:text-amber-400 transition-colors"><Search /></span>
                    <input 
                        v-model="searchQuery"
                        type="text" 
                        placeholder="Cari kajian, doa, atau masjid..."
                        class="w-full bg-stone-900 border border-stone-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all outline-none"
                    >
                </div>
            </section>

            <section class="overflow-hidden">
                <div class="flex gap-4 overflow-x-auto snap-x no-scrollbar">
                    <div v-for="banner in banners" :key="banner.id" 
                         class="min-w-[85%] relative h-44 rounded-3xl overflow-hidden snap-center border border-stone-800">
                        <img :src="banner.image" :alt="banner.title" class="absolute inset-0 w-full h-full object-cover opacity-60">
                        <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent"></div>
                        <div class="absolute bottom-5 left-5">
                            <h3 class="text-xl font-bold text-amber-100" style="font-family: 'Amiri', serif;">{{ banner.title }}</h3>
                            <p class="text-xs text-stone-300">{{ banner.subtitle }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-sm font-bold uppercase tracking-wider text-amber-200/70">Layanan Utama</h2>
                </div>
                <div class="grid grid-cols-4 gap-3">
                    <Link v-for="cat in categories" :key="cat.name" :href="cat.link" class="flex flex-col items-center gap-2 group">
                        <div :class="[cat.color, 'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 shadow-lg']">
                            {{ cat.icon }}
                        </div>
                        <span class="text-[10px] font-semibold text-center text-stone-400 group-hover:text-amber-400 transition-colors leading-tight">
                            {{ cat.name }}
                        </span>
                    </Link>
                </div>
            </section>

            <section>
                <div class="flex justify-between items-end mb-4">
                    <h2 class="text-sm font-bold uppercase tracking-wider text-amber-200/70">Artikel Pilihan</h2>
                    <button class="text-xs text-amber-500 font-medium">Lihat Semua</button>
                </div>
                <div class="space-y-4">
                    <div v-for="article in articles" :key="article.title" 
                         class="bg-stone-900/50 border border-stone-800/60 rounded-2xl p-3 flex gap-4 hover:border-amber-500/30 transition-all">
                        <img :src="article.image" :alt="article.title" class="w-24 h-24 rounded-xl object-cover shrink-0">
                        <div class="flex flex-col justify-between py-1">
                            <div>
                                <h4 class="text-sm font-bold text-stone-100 line-clamp-2 leading-snug">{{ article.title }}</h4>
                                <p class="text-[11px] text-stone-500 mt-1 line-clamp-2">{{ article.excerpt }}</p>
                            </div>
                            <span class="text-[10px] text-amber-600 font-medium">{{ article.date }}</span>
                        </div>
                    </div>
                </div>
            </section>

        </main>

        <footer class="fixed bottom-0 inset-x-0 bg-stone-900/90 backdrop-blur-lg border-t border-stone-800 pb-3 pt-3 z-50 max-w-xl mx-auto">
            <div class="grid grid-cols-5 items-center justify-items-center">
                
                <button class="flex flex-col items-center gap-1 w-full text-amber-500">
                    <span class="text-xl"><House /></span>
                    <span class="text-[10px] font-bold">Beranda</span>
                </button>

                <button class="flex flex-col items-center gap-1 w-full text-stone-500 hover:text-amber-400 transition-colors">
                    <span class="text-xl"><CalendarDays /></span>
                    <span class="text-[10px] font-medium">Acara</span>
                </button>
        
                <div class="relative w-full flex justify-center">
                    <transition name="fade-up">
                        <div v-if="isDonationOpen" 
                            class="absolute bottom-20 w-32 bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-[60]">
                            <div class="flex flex-col">
                                <Link v-for="menu in donationMenus" 
                                    :key="menu.name" 
                                    :href="menu.link"
                                    class="px-4 py-3 text-[11px] font-semibold text-stone-300 hover:bg-amber-500/10 hover:text-amber-400 border-b border-stone-800/50 last:border-0 text-center transition-colors">
                                    {{ menu.name }}
                                </Link>
                            </div>
                            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-stone-900 border-r border-b border-stone-800 rotate-45"></div>
                        </div>
                    </transition>

                    <div class="absolute -top-12 flex flex-col items-center">
                        <button 
                            @click="toggleDonation"
                            :class="[isDonationOpen ? 'scale-110 rotate-360' : '']"
                            class="bg-linear-to-b from-amber-400 to-amber-600 w-14 h-14 rounded-full shadow-[0_8px_20px_rgba(217,119,6,0.4)] flex items-center justify-center text-2xl border-4 border-stone-950 active:scale-90 transition-all duration-300">
                            <HeartHandshake />
                        </button>
                        <span class="text-[10px] font-medium text-stone-500 mt-0">Donasi</span>
                    </div>
                </div>

                <button class="flex flex-col items-center gap-1 w-full text-stone-500 hover:text-amber-400 transition-colors">
                    <span class="text-xl"><MapPin /></span>
                    <span class="text-[10px] font-medium">Masjid</span>
                </button>

                <Link :href="'/laporan-riyadhoh'" class="flex flex-col items-center gap-1 w-full text-stone-500 hover:text-amber-400 transition-colors">
                    <span class="text-xl"><BookOpenText /></span>
                    <span class="text-[10px] font-medium">Riyadhoh</span>
                </Link>

            </div>
        </footer>       
    </div>
</div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>