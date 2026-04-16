<script setup lang="ts">
import { Head } from '@inertiajs/vue3';

interface LogGroup {
    formatted_date: string;
    entries: string[];
}

defineProps<{
    logs: LogGroup[];
}>();
</script>

<template>
    <Head title="Log Laporan Riyadhoh" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
    <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

    <div class="min-h-screen bg-stone-950 font-sans text-stone-100 pb-24"
         style="font-family: 'Plus Jakarta Sans', sans-serif; background-image: radial-gradient(ellipse at 20% 20%, rgba(120,90,40,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(20,100,60,0.12) 0%, transparent 60%);">

        <div class="h-1 w-full bg-linear-to-r from-amber-700 via-amber-400 to-amber-700"></div>

        <header class="relative overflow-hidden py-10 px-4 text-center">
            <div class="absolute inset-0 opacity-5" :style="{ backgroundImage: `url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22><path d=%22M30 5 L55 20 L55 40 L30 55 L5 40 L5 20 Z%22 fill=%22none%22 stroke=%22%23d4a017%22 stroke-width=%221%22/></svg>')` }" style="background-size: 60px 60px;"></div>
            <div class="relative z-10 max-w-2xl mx-auto">
                <p class="text-amber-400 text-sm tracking-[0.3em] uppercase mb-2 font-medium">بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ</p>
                <h1 class="text-3xl md:text-4xl font-bold text-amber-100 mb-1" style="font-family: 'Amiri', serif; letter-spacing: 0.02em;">
                    📜 Log Riyadhoh
                </h1>
                <p class="text-stone-400 text-sm mt-2">Daftar riwayat laporan harian jamaah</p>
            </div>
        </header>

        <main class="max-w-3xl mx-auto px-2">
            <div class="bg-stone-900/80 backdrop-blur border border-stone-700/60 rounded-2xl overflow-hidden shadow-2xl">
                
                <div class="bg-stone-800/50 px-6 py-3 border-b border-stone-700/60 flex justify-between items-center">
                    <span class="text-[10px] text-stone-500 uppercase tracking-[0.2em] font-bold">Log Riyadhoh</span>
                    <div class="flex gap-1.5">
                        <div class="w-2.5 h-2.5 rounded-full bg-stone-700"></div>
                        <div class="w-2.5 h-2.5 rounded-full bg-stone-700"></div>
                        <div class="w-2.5 h-2.5 rounded-full bg-stone-700"></div>
                    </div>
                </div>

                <div class="py-6 px-2 sm:p-8 font-mono overflow-x-auto">
                    <div v-if="logs.length > 0">
                        <div v-for="(group, index) in logs" :key="index" class="mb-6 last:mb-0">
                            
                            <div class="flex items-center gap-4 mb-4">
                                <h3 class="text-amber-400 font-bold text-sm sm:text-base whitespace-nowrap uppercase tracking-tighter">
                                    {{ group.formatted_date }}
                                </h3>
                                <div class="h-px w-full bg-stone-800"></div>
                            </div>
                            
                                <div class="space-y-3">
                                    <div v-for="(line, lIndex) in group.entries" :key="lIndex" 
                                        class="flex items-end gap-2 text-stone-400 text-xs sm:text-sm group/line hover:text-stone-200 transition-colors">
                                        
                                        <div class="flex-none flex items-baseline gap-1.5 whitespace-nowrap">
                                            <span class="text-stone-600 font-mono text-[10px] sm:text-xs">[{{ lIndex + 1 }}]</span>
                                            
                                            <span class="font-semibold text-stone-200 uppercase tracking-tight">
                                                {{ line.split('(')[0].trim() }}
                                            </span>
                                            
                                            <span v-if="line.includes('(')" class="text-[10px] sm:text-[11px] text-stone-500 font-medium">
                                                ({{ line.split('(')[1].split(')')[0] }})
                                            </span>
                                        </div>

                                        <div class="flex-1 border-b border-dotted border-stone-800 mb-1 group-hover/line:border-stone-600 transition-colors"></div>

                                        <div class="flex-none whitespace-nowrap font-mono text-amber-500/80 italic text-[10px] sm:text-xs tracking-tighter">
                                            {{ line.split('...').pop().trim() }}
                                        </div>
                                    </div>
                                </div>

                        </div>
                    </div>

                    <div v-else class="text-center py-20">
                        <span class="text-4xl mb-4 block">📂</span>
                        <p class="text-stone-500 italic">Belum ada data yang terekam dalam sistem.</p>
                    </div>
                </div>
            </div>

            <div class="mt-10 flex flex-col items-center gap-6 text-center">
                <a href="/laporan-riyadhoh"
                   class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 border border-stone-700 text-amber-400 text-sm font-semibold hover:bg-amber-600 hover:text-stone-950 transition-all active:scale-95 shadow-lg">
                    <span>←</span> Isi Laporan Baru
                </a>
                
                <p class="text-[10px] text-stone-700 uppercase tracking-widest leading-loose">
                    Generated by Riyadhoh Tracking System<br/>
                    Data update automatically every submission
                </p>
            </div>
        </main>
    </div>
</template>

<style scoped>
/* Agar titik-titik (dots) di log tetap sejajar di layar kecil */
.font-mono {
    font-variant-ligatures: none;
    word-spacing: -0.1em;
}
</style>