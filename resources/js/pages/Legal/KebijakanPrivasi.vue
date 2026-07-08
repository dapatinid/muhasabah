<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { ShieldCheck, ArrowLeft } from 'lucide-vue-next'
import AppLayoutPublic from '@/layouts/AppLayoutPublic.vue'
</script>

<template>
  <Head title="Kebijakan Privasi - Muhasabah.ID" />
  <AppLayoutPublic>
    <template #header>
      <div class="flex-1 pt-2">
        <p class="text-[10px] text-amber-500 tracking-[0.2em] uppercase font-bold">
          Informasi Legal
        </p>
        <h1 class="text-lg font-bold text-stone-100" style="font-family: 'Amiri', serif;">
          Kebijakan Privasi
        </h1>
      </div>

      <div class="mt-3.75 mb-3 w-10 h-10 rounded-full bg-stone-800 border border-amber-500/30 flex items-center justify-center text-amber-400">
        <ShieldCheck class="size-5" />
      </div>
    </template>

    <main class="space-y-6 pb-14 mt-5 px-5">
      <button onclick="history.back()" class="inline-flex items-center gap-2 text-xs font-medium text-stone-400 hover:text-amber-400 transition-colors mb-2">
        <ArrowLeft class="size-4" /> Kembali ke Beranda
      </button>

      <section class="backdrop-blur-xs bg-stone-900/40 border border-stone-800/80 rounded-3xl p-6 sm:p-8 space-y-6 text-stone-300 text-sm leading-relaxed">
        
        <div>
          <h2 class="text-base font-bold text-stone-100 mb-2 font-serif text-amber-400">1. Pendahuluan</h2>
          <p>
            Ahlan wa sahlan di <strong>Muhasabah.ID</strong>. Kebijakan Privasi ini mengatur bagaimana kami mengumpulkan, menggunakan, memelihara, dan melindungi informasi yang dikumpulkan dari pengguna (selanjutnya disebut "Pengguna" atau "Anda") platform digital kami. Kami berkomitmen penuh untuk menjaga amanah atas data pribadi Anda dalam memfasilitasi program infaq, edukasi keagamaan, dan layanan lainnya.
          </p>
        </div>

        <div>
          <h2 class="text-base font-bold text-stone-100 mb-2 font-serif text-amber-400">2. Pengumpulan Data</h2>
          <p>
            Dalam rangka memberikan pelayanan terbaik untuk amal ibadah Anda, kami mungkin mengumpulkan informasi identitas pribadi (seperti nama, alamat email, nomor telepon) dan informasi non-pribadi saat Anda:
          </p>
          <ul class="list-disc pl-5 mt-2 space-y-1 text-stone-400 marker:text-amber-500/50">
            <li>Mendaftar akun di Muhasabah.ID.</li>
            <li>Melakukan transaksi donasi atau infaq.</li>
            <li>Berpartisipasi dalam forum interaktif, Kalam, atau Riyadhoh.</li>
          </ul>
        </div>

        <div>
          <h2 class="text-base font-bold text-stone-100 mb-2 font-serif text-amber-400">3. Penggunaan Informasi</h2>
          <p>
            Setiap informasi yang kami kumpulkan adalah bentuk titipan amanah yang akan digunakan semata-mata untuk:
          </p>
          <ul class="list-disc pl-5 mt-2 space-y-1 text-stone-400 marker:text-amber-500/50">
            <li>Memastikan penyaluran infaq dan donasi Anda terdata secara transparan dan akuntabel.</li>
            <li>Mengirimkan laporan program donasi dan tanda terima transaksi.</li>
            <li>Personalisasi pengalaman spiritual Anda, termasuk merekomendasikan artikel Kalam (dzikir, keutamaan sedekah, dsb) yang relevan.</li>
            <li>Meningkatkan kualitas layanan <em>customer support</em> dan komunikasi.</li>
          </ul>
        </div>

        <div>
          <h2 class="text-base font-bold text-stone-100 mb-2 font-serif text-amber-400">4. Perlindungan dan Keamanan Data</h2>
          <p>
            Mengemban prinsip amanah, kami mengadopsi praktik pengumpulan, penyimpanan, dan pemrosesan data yang tepat, serta langkah-langkah keamanan digital untuk melindungi dari akses tidak sah, perubahan, atau penghancuran informasi pribadi, nama pengguna, kata sandi, informasi transaksi, dan data lainnya.
          </p>
        </div>

        <div>
          <h2 class="text-base font-bold text-stone-100 mb-2 font-serif text-amber-400">5. Berbagi Informasi Pribadi</h2>
          <p>
            Kami <strong>tidak pernah menjual, memperdagangkan, atau menyewakan</strong> informasi identitas pribadi Pengguna kepada pihak ketiga. Kami hanya membagikan data demografis gabungan yang tidak tertaut dengan identitas pribadi dengan mitra bisnis atau lembaga amal terpercaya terkait murni untuk tujuan penyaluran dan pelaporan program sosial.
          </p>
        </div>

        <div>
          <h2 class="text-base font-bold text-stone-100 mb-2 font-serif text-amber-400">6. Persetujuan Anda</h2>
          <p>
            Dengan menggunakan situs Muhasabah.ID, Anda menandakan penerimaan Anda terhadap kebijakan ini. Jika Anda tidak setuju dengan kebijakan ini, mohon untuk tidak menggunakan situs kami. Kebijakan ini dapat diperbarui seiring waktu demi kemaslahatan bersama, dan kami menganjurkan Anda untuk memeriksanya secara berkala.
          </p>
        </div>

      </section>
    </main>
  </AppLayoutPublic>
</template>