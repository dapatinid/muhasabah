<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { ArrowLeft, HardHat, Hammer, Construction } from 'lucide-vue-next'
</script>

<template>
  <Head title="Halaman Sedang Dibangun" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
  <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

  <div class="min-h-screen bg-stone-950 relative overflow-x-hidden flex flex-col items-center justify-center"
       style="font-family: 'Plus Jakarta Sans', sans-serif;">

    <!-- Background pattern (Tetap konsisten dengan tema utama) -->
    <div class="fixed inset-0 z-0 opacity-10 pointer-events-none"
         :style="{
           backgroundImage: `url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22 viewBox=%220 0 80 80%22><path d=%22M40 0 L50 30 L80 40 L50 50 L40 80 L30 50 L0 40 L30 30 Z%22 fill=%22none%22 stroke=%22%23d4a017%22 stroke-width=%221%22/></svg>')`,
           backgroundSize: '100px 100px'
         }" />
    
    <div class="fixed inset-0 z-0 pointer-events-none"
         style="background: radial-gradient(circle at 50% 50%, rgba(120,90,40,0.15) 0%, transparent 70%)" />

    <!-- Konten Utama -->
    <div class="relative z-10 max-w-xl mx-auto px-6 text-center">
      
      <!-- Icon Animasi -->
      <div class="mb-8 relative inline-block">
        <div class="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full"></div>
        <div class="relative bg-stone-900 border border-amber-500/30 p-6 rounded-3xl">
          <Construction class="size-16 text-amber-500 animate-pulse" />
        </div>
      </div>

      <!-- Teks Keterangan -->
      <div class="space-y-4">
        <p class="text-xs text-amber-500 tracking-[0.3em] uppercase font-bold">Mohon Dukungan & Doa</p>
        <h1 class="text-4xl md:text-5xl font-bold text-stone-100 leading-tight" style="font-family: 'Amiri', serif;">
          Halaman Sedang Dibangun
        </h1>
        <p class="text-stone-500 text-sm max-w-xs mx-auto leading-relaxed">
          Fitur ini sedang dalam tahap pengembangan untuk memberikan pengalaman spiritual yang lebih baik bagi Anda.
        </p>
      </div>

      <!-- Garis Dekoratif -->
      <div class="flex items-center justify-center gap-4 my-10">
        <div class="h-[1px] w-12 bg-stone-800"></div>
        <div class="flex gap-1.5">
          <div class="size-1.5 rounded-full bg-amber-500/40"></div>
          <div class="size-1.5 rounded-full bg-amber-500/60"></div>
          <div class="size-1.5 rounded-full bg-amber-500/40"></div>
        </div>
        <div class="h-[1px] w-12 bg-stone-800"></div>
      </div>

      <!-- Tombol Kembali -->
      <Link href="/"
            class="inline-flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all group">
        <ArrowLeft class="size-4 group-hover:-translate-x-1 transition-transform" />
        Kembali ke Beranda
      </Link>

    </div>

    <!-- Footer Copyright Simple -->
    <div class="absolute bottom-10 z-10 text-stone-600 text-[10px] uppercase tracking-widest">
      2026 Muhasabah.id
    </div>

  </div>
</template>

<style scoped>
/* Tambahkan sedikit animasi mengambang untuk icon */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>