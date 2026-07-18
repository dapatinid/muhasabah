<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { ShieldCheck, ArrowLeft, Info } from 'lucide-vue-next'
import AppLayoutPublic from '@/layouts/AppLayoutPublic.vue'
</script>

<template>
  <Head title="Tentang Kami - Muhasabah.ID" />
  <AppLayoutPublic>
    <template #header>
      <div class="flex-1 pt-2">
        <p class="text-[10px] text-amber-500 tracking-[0.2em] uppercase font-bold">
          Informasi Umum
        </p>
        <h1 class="text-lg font-bold text-stone-100" style="font-family: 'Amiri', serif;">
          Tentang Kami
        </h1>
      </div>

      <div class="mt-3.75 mb-3 w-10 h-10 rounded-full bg-stone-800 border border-amber-500/30 flex items-center justify-center text-amber-400">
        <Info class="size-5" />
      </div>
    </template>

    <main class="space-y-6 pb-14 mt-5 px-5">
      <button onclick="history.back()" class="inline-flex items-center gap-2 text-xs font-medium text-stone-400 hover:text-amber-400 transition-colors mb-2">
        <ArrowLeft class="size-4" /> Kembali ke Beranda
      </button>

      <section class="backdrop-blur-xs bg-stone-900/40 border border-stone-800/80 rounded-3xl p-6 sm:p-8 space-y-6 text-stone-300 text-sm leading-relaxed">
        
        <p>
          Muhasabah.id adalah sebuah platform digital yang berfokus pada pengembangan spiritual dan sosial umat Muslim melalui program-program kebaikan dan edukasi keagamaan. Situs ini mengedepankan jaminan amanah dalam pengelolaan dan penyaluran donasi, memastikan bahwa setiap kontribusi disalurkan secara transparan dan bertanggung jawab.
        </p>
        <p>
          Muhasabah.id bertujuan untuk menjadi jembatan bagi umat Muslim dalam beramal ibadah, mencari keberkahan, dan memperdalam pemahaman agama, dengan fokus pada manfaat berkelanjutan bagi masyarakat.
        </p>
        <p>
          Muhasabah juga menghubungkan setiap penggunanya terhubung dengan aktifis lain, relawan hingga donatur di halaman Ukhuwah. Fitur Obrolan memungkinkan setiap pengguna memulai kebermanfaatan baru untuk tujuan lebih mulia, "Ukhuwah Islamiyah".
        </p>
        <p>
          Dengan bergabung di platfrom kami, anda telah memiliki pilihan apakah hanya menjadi pengguna biasa atau aktifis (relawan / donatur / keduanya). Kami menyediakan sedikitnya 120 questioner dasar untuk relawan/donatur. Jika ingin membuka semua fitur, total ada 520 questioner untuk bahan pertimbangan kami sebagai bentuk komitmen pengguna kepada platform ini. Questioner yang kami sediakan bukan merupakan tes yang menilai pengguna benar atau salah, namun merupakan diskusi yang sangat umum dan perlu sama sama diketahui & dipahami. 
        </p>

      </section>
    </main>
  </AppLayoutPublic>
</template>