<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { FileText, ArrowLeft } from 'lucide-vue-next'
import AppLayoutPublic from '@/layouts/AppLayoutPublic.vue'
</script>

<template>
  <Head title="Syarat & Ketentuan - Muhasabah.ID" />
  <AppLayoutPublic>
    <template #header>
      <div class="flex-1 pt-2">
        <p class="text-[10px] text-teal-500 tracking-[0.2em] uppercase font-bold">
          Informasi Legal
        </p>
        <h1 class="text-lg font-bold text-stone-100" style="font-family: 'Amiri', serif;">
          Syarat & Ketentuan
        </h1>
      </div>

      <div class="mt-3.75 mb-3 w-10 h-10 rounded-full bg-stone-800 border border-teal-500/30 flex items-center justify-center text-teal-400">
        <FileText class="size-5" />
      </div>
    </template>

    <main class="space-y-6 pb-14 mt-5 px-5">
      <button onclick="history.back()" class="inline-flex items-center gap-2 text-xs font-medium text-stone-400 hover:text-teal-400 transition-colors mb-2">
        <ArrowLeft class="size-4" /> Kembali ke Beranda
      </button>

      <section class="backdrop-blur-xs bg-stone-900/40 border border-stone-800/80 rounded-3xl p-6 sm:p-8 space-y-6 text-stone-300 text-sm leading-relaxed">
        
        <div>
          <p class="text-stone-400 italic">Pembaruan Terakhir: Juli 2026</p>
          <hr class="border-stone-800 my-4" />
          <h2 class="text-base font-bold text-stone-100 mb-2 font-serif text-teal-400">1. Ketentuan Umum</h2>
          <p>
            Muhasabah.ID adalah platform digital berlandaskan nilai-nilai syariat Islam yang berfokus pada pengembangan spiritual, sosial umat Muslim, edukasi keagamaan, serta pengelolaan infaq dan donasi. Dengan mengakses dan menggunakan platform ini, Anda menyetujui untuk terikat oleh Syarat dan Ketentuan berikut. 
          </p>
        </div>

        <div>
          <h2 class="text-base font-bold text-stone-100 mb-2 font-serif text-teal-400">2. Kewajiban Pengguna</h2>
          <p>
            Dalam menggunakan platform ini, setiap Pengguna diwajibkan untuk:
          </p>
          <ul class="list-disc pl-5 mt-2 space-y-1 text-stone-400 marker:text-teal-500/50">
            <li>Memberikan informasi yang valid dan jujur saat pendaftaran maupun berdonasi.</li>
            <li>Tidak menyebarkan konten yang bertentangan dengan syariat Islam, hoaks, fitnah, atau memicu perpecahan (SARA) di fitur interaksi Kalam atau komentar.</li>
            <li>Menjaga kerahasiaan akun dan kata sandi masing-masing.</li>
          </ul>
        </div>

        <div>
          <h2 class="text-base font-bold text-stone-100 mb-2 font-serif text-teal-400">3. Ketentuan Infaq & Donasi</h2>
          <p>
            Kami menjunjung tinggi transparansi dan prinsip amanah dalam setiap dana yang dititipkan:
          </p>
          <ul class="list-disc pl-5 mt-2 space-y-1 text-stone-400 marker:text-teal-500/50">
            <li>Seluruh dana yang terkumpul akan disalurkan berdasarkan <strong>Keterangan atau Detail Program Donasi</strong> yang telah ditetapkan oleh penanggung jawab program.</li>
            <li>Muhasabah.ID berhak melakukan pemotongan biaya operasional platform (apabila ada) yang nominal atau persentasenya diinformasikan secara transparan pada setiap kampanye donasi.</li>
            <li>Laporan penyaluran dana (tasyaruf) akan diperbarui secara berkala dan dapat diakses publik pada masing-masing halaman program.</li>
            <li>Jika terjadi pelanggaran terhadap ketentuan ini, Muhasabah.ID berhak mengambil tindakan yang sesuai, termasuk pada pemblokiran akun Pengguna.</li>
          </ul>
        </div>

        <div>
          <h2 class="text-base font-bold text-stone-100 mb-2 font-serif text-teal-400">4. Hak Kekayaan Intelektual (Konten Kalam)</h2>
          <p>
            Seluruh konten edukasi keagamaan yang tersedia di platform, termasuk Artikel "Kalam", Program "Donasi", atau "Acara" Kegiatan, adalah milik Muhasabah.ID atau kontributor/penulis (tokoh) kami. 
            Anda diizinkan untuk membagikan dan menyebarluaskan konten tersebut untuk tujuan dakwah dan kebaikan, dengan kewajiban menyertakan sumber (tautan kembali ke Muhasabah.ID).
          </p>
        </div>

        <div>
          <h2 class="text-base font-bold text-stone-100 mb-2 font-serif text-teal-400">5. Penafian (Disclaimer)</h2>
          <p>
            Muhasabah.ID berusaha sebaik mungkin menyajikan materi keagamaan yang valid dan bersanad. Namun, konten pada artikel (Kalam) dan ruang diskusi bersifat edukasi spiritual umum dan bukan fatwa. Untuk permasalahan fikih atau syariat yang spesifik dan kompleks, pengguna disarankan berkonsultasi langsung dengan ulama atau ahli ilmu.
          </p>
        </div>

        <div>
          <h2 class="text-base font-bold text-stone-100 mb-2 font-serif text-teal-400">6. Perubahan Ketentuan</h2>
          <p>
            Kami berhak untuk memperbarui atau mengubah Syarat & Ketentuan ini kapan saja. Perubahan akan segera berlaku setelah diunggah ke platform. Penggunaan Anda yang berkelanjutan atas platform ini merupakan persetujuan Anda terhadap perubahan tersebut.
          </p>
        </div>

      </section>
    </main>
  </AppLayoutPublic>
</template>