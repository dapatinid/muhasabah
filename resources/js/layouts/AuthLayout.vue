<script setup lang="ts">
import AuthLayout from '@/layouts/auth/AuthSimpleLayout.vue';
import { Link } from '@inertiajs/vue3';
import { ref, onMounted, onUnmounted } from 'vue';
import { ArrowLeft } from 'lucide-vue-next';

const { title = '', description = '' } = defineProps<{
    title?: string;
    description?: string;
}>();

// ── Logika Efek Sembunyi/Muncul Header saat di-Scroll (Smart Header) ──
const headerVisible = ref(true);
let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
const THRESHOLD = 10;

function onScroll() {
    const currentY = window.scrollY;
    
    if (currentY < 10) {
        headerVisible.value = true;
        lastScrollY = currentY;
        return;
    }

    const delta = currentY - lastScrollY;
    if (Math.abs(delta) < THRESHOLD) return;

    if (delta > 0 && currentY > 60) {
        headerVisible.value = false; // Scroll ke bawah: Sembunyikan
    } else if (delta < 0) {
        headerVisible.value = true;  // Scroll ke atas: Tampilkan
    }

    lastScrollY = currentY;
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }));
onUnmounted(() => window.removeEventListener('scroll', onScroll));
</script>

<template>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
    <link
        href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
    />

    <div
        class="min-h-screen bg-stone-950 relative overflow-x-hidden antialiased text-stone-100 selection:bg-amber-500/30"
        style="font-family: 'Plus Jakarta Sans', sans-serif;"
    >
        <div
            class="fixed inset-0 z-0 opacity-[0.06] pointer-events-none"
            :style="{
                backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 325 325%22%3E%3Cg fill=%22none%22 stroke=%22%23D4A017%22 stroke-width=%225%22%3E%3Cpath d=%22M324.268 160.718l-46.131-46.13V49.349c0-1.381-1.119-2.5-2.5-2.5h-65.24L164.268.718c-.938-.938-2.598-.938-3.535 0l-46.129 46.131H49.361c-1.381 0-2.5 1.119-2.5 2.5v65.239l-46.129 46.13c-.976.977-.976 2.559 0 3.535l46.129 46.13v65.239c0 1.381 1.119 2.5 2.5 2.5h65.242l46.129 46.131c.469.469 1.104.732 1.768.732.663 0 1.299-.264 1.768-.732l46.129-46.131h65.24c1.381 0 2.5-1.119 2.5-2.5v-65.239l46.131-46.13c.469-.469.732-1.104.732-1.768 0-1.076-.263-1.712-.732-2.18zM242.17 195.485v46.668h-46.672l-32.998 33-32.998-33H82.828v-46.668l-32.996-33 32.996-33V82.817h46.674l32.998-33l32.998 33h46.672v46.668l32.998 33-32.998 33z%22/%3E%3Cpath d=%22M228.893 96.097h-38.896L162.5 68.596l-27.498 27.501H96.107v38.889l-27.498 27.5 27.498 27.5v38.889h38.895l27.498 27.501l27.496-27.501h38.896v-38.889l27.498-27.5-27.498-27.5V96.097zm-18.665 78.595h-18.262l12.912 12.91.664 17.926-17.926-.664-12.912-12.911v18.259L162.5 223.356l-12.205-13.145v-18.261l-12.912 12.913-17.926.664.664-17.926 12.912-12.912-18.26.002-13.144-12.207 13.144-12.205 18.26-.002-12.912-12.91-.664-17.926 17.926.664 12.912 12.912v-18.26l12.205-13.145 12.205 13.145v18.26l12.912-12.912 17.926-.664-.664 17.926-12.912 12.912h18.262l13.141 12.205-13.141 12.205z%22/%3E%3Cpolygon points=%22150.768,134.162 134.174,150.755 134.174,174.217 150.766,190.809 174.232,190.809 190.822,174.219 190.822,150.753 174.232,134.162%22/%3E%3C/g%3E%3C/svg%3E')`,
                backgroundSize: '100px 100px',
            }"
        />
        <div
            class="fixed inset-0 z-0 pointer-events-none"
            style="background: radial-gradient(ellipse at 50% 0%, rgba(212,160,23,0.05) 0%, transparent 70%)"
        />

        <div class="fixed top-0 left-0 z-[101] h-[3px] w-full bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700 shadow-[0_1px_10px_rgba(251,191,36,0.3)]"></div>

        <nav
            :class="[
                'fixed top-0 inset-x-0 z-[100] max-w-xl mx-auto',
                'bg-stone-950/80 backdrop-blur-md border-b border-stone-800/60',
                'sm:border-x sm:border-stone-800',
                'px-5 flex items-center gap-4 h-16',
                'transition-transform duration-300 ease-in-out',
                headerVisible ? 'translate-y-0' : '-translate-y-full',
            ]"
        >
            <Link
                href="/"
                class="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-500/40 transition-all duration-200 shrink-0 shadow-sm"
            >
                <ArrowLeft class="w-4 h-4" />
            </Link>

            <div class="flex-1 min-w-0">
                <p class="text-[9px] text-amber-500 tracking-[0.25em] uppercase font-bold truncate">
                    Akses Sistem
                </p>
                <h1 class="text-sm font-bold text-stone-200 tracking-wide truncate">
                    {{ title || 'Kembali ke Beranda' }}
                </h1>
            </div>
        </nav>

        <div class="relative z-10 max-w-xl mx-auto sm:border-x sm:border-stone-900 min-h-screen pt-20 pb-12 px-4 flex flex-col justify-center bg-background">
            
            <div class="w-full max-w-md mx-auto">
                <AuthLayout :title="title" :description="description">
                    <slot />
                </AuthLayout>
            </div>

        </div>
    </div>
</template>