<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { 
  LayoutDashboard, BookOpen, Heart, CalendarDays, 
  TrendingUp, Users, ArrowUpRight 
} from 'lucide-vue-next';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: '/dashboard' },
        ],
    },
});

const props = defineProps<{
    stats: {
        total_kalam: number;
        total_donasi: number;
        total_acara: number;
        donasi_terkumpul: number;
    }
}>();
</script>

<template>
    <Head title="Dashboard" />

    <div class="p-4 sm:p-6 space-y-8">
        
        <div class="flex items-center justify-between">
            <div class="me-3">
                <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Ringkasan Sistem</h1>
                <p class="text-sm text-zinc-500">Selamat datang kembali, pantau aktivitas terbaru di sini.</p>
            </div>
            <Link href="/admin/tentang-saya" class="bg-emerald-600 hover:bg-emerald-700 text-center text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all">
                Edit Bio
            </Link>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xs">
                <div class="flex justify-between items-start mb-4">
                    <div class="p-2 bg-amber-500/10 text-amber-600 rounded-xl"><BookOpen class="size-5"/></div>
                    <span class="text-xs font-bold text-zinc-400">KALAM</span>
                </div>
                <h3 class="text-2xl font-bold">{{ stats.total_kalam }}</h3>
                <p class="text-xs text-zinc-500">Total artikel diterbitkan</p>
            </div>

            <div class="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xs">
                <div class="flex justify-between items-start mb-4">
                    <div class="p-2 bg-rose-500/10 text-rose-600 rounded-xl"><Heart class="size-5"/></div>
                    <span class="text-xs font-bold text-zinc-400">DONASI</span>
                </div>
                <h3 class="text-2xl font-bold">{{ stats.total_donasi }}</h3>
                <p class="text-xs text-zinc-500">Program aktif</p>
            </div>

            <div class="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xs">
                <div class="flex justify-between items-start mb-4">
                    <div class="p-2 bg-sky-500/10 text-sky-600 rounded-xl"><CalendarDays class="size-5"/></div>
                    <span class="text-xs font-bold text-zinc-400">ACARA</span>
                </div>
                <h3 class="text-2xl font-bold">{{ stats.total_acara }}</h3>
                <p class="text-xs text-zinc-500">Agenda mendatang</p>
            </div>

            <div class="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xs">
                <div class="flex justify-between items-start mb-4">
                    <div class="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl"><TrendingUp class="size-5"/></div>
                    <span class="text-xs font-bold text-zinc-400">PENDANAAN</span>
                </div>
                <h3 class="text-2xl font-bold text-emerald-600">Rp{{ stats.donasi_terkumpul.toLocaleString() }}</h3>
                <p class="text-xs text-zinc-500">Total dana terkumpul</p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="md:col-span-2 p-6 rounded-3xl bg-zinc-900 text-zinc-100 shadow-2xl shadow-zinc-900/20">
                <h4 class="font-bold mb-2">Pusat Kendali Cepat</h4>
                <p class="text-sm text-zinc-400 mb-6">Kelola data utama Anda dengan cepat melalui shortcut di bawah.</p>
                <div class="flex gap-3">
                    <Link href="/admin/kalam" class="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-all">Kelola Kalam</Link>
                    <Link href="/admin/donasi" class="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-all">Kelola Donasi</Link>
                    <Link href="/admin/acara" class="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-all">Kelola Acara</Link>
                </div>
            </div>
            
            <div class="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-center flex flex-col items-center justify-center">
                <Users class="size-8 text-zinc-300 mb-3" />
                <h4 class="font-bold text-zinc-900 dark:text-zinc-50">Butuh Bantuan?</h4>
                <p class="text-xs text-zinc-500 mt-1 mb-4">Panduan sistem tersedia untuk Anda.</p>
                <button class="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline">Lihat Dokumentasi →</button>
            </div>
        </div>
    </div>
</template>