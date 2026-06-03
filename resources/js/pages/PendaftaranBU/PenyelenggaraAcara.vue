<script setup lang="ts">
import { ref, computed } from 'vue'
import { Head, Link } from '@inertiajs/vue3'
import AppLayout from '@/layouts/AppLayout.vue'

// State untuk melacak perpindahan halaman awal ke kuesioner
const isSteppingToQuiz = ref(false)

// Struktur data pertanyaan
interface Question {
  id: number
  text: string
}

// 100 Pertanyaan Verifikasi Khusus Penyelenggara Acara (Fokus Event, Sponsor, & Manajemen Lapangan)
const questions = ref<Question[]>([
  // KATEGORI 1: VALIDITAS KONSEP, PERIZINAN BIROKRASI, & LEGALITAS ACARA (1-20)
  { id: 1, text: 'Saya menjamin acara ini memiliki konsep, tujuan, dan target audiens yang jelas serta masuk akal.' },
  { id: 2, text: 'Saya bersedia mengurus Surat Izin Keramaian dari pihak Kepolisian (Polsek/Polres/Polda) sesuai skala acara.' },
  { id: 3, text: 'Saya siap melampirkan surat rekomendasi atau izin pemanfaatan lokasi (venue) dari pemilik tempat resmi.' },
  { id: 4, text: 'Saya menjamin kegiatan acara tidak melanggar adat istiadat, norma kesusilaan, dan hukum yang berlaku di wilayah setempat.' },
  { id: 5, text: 'Saya bersedia mengurus perizinan satgas terkait (misal: Dinas Perhubungan jika memicu rekayasa lalu lintas).' },
  { id: 6, text: 'Saya memastikan draf proposal acara (prospectus) sudah matang sebelum diajukan ke sistem sponsor.' },
  { id: 7, text: 'Saya bersedia membatalkan acara atau menjadwalkan ulang jika izin resmi dari birokrasi setempat ditolak.' },
  { id: 8, text: 'Saya menjamin susunan panitia (panitia inti) diisi oleh individu yang jelas dan dapat dihubungi.' },
  { id: 9, text: 'Saya siap melampirkan Rundown (susunan acara) mendetail dari menit ke menit beserta penanggung jawab per sesi.' },
  { id: 10, text: 'Saya memastikan pengisi acara (guest star/pembicara) sudah menandatangani MoU kesediaan tampil.' },
  { id: 11, text: 'Saya bersedia mengurus pajak tontonan atau pajak reklame/hiburan ke Dispenda jika acara bersifat komersial/berbayar.' },
  { id: 12, text: 'Saya menjamin acara ini tidak ditunggangi oleh kepentingan politik praktis terselubung atau kampanye hitam.' },
  { id: 13, text: 'Saya siap memaparkan rencana jalur evakuasi (clear path) dalam proposal teknis acara.' },
  { id: 14, text: 'Saya berkomitmen menghentikan acara seketika jika di tengah jalan terindikasi melanggar hukum negara.' },
  { id: 15, text: 'Saya menjamin hak kekayaan intelektual (HKI) konten atau karya yang ditampilkan di acara adalah legal.' },
  { id: 16, text: 'Saya bersedia berkoordinasi dengan aparatur desa/kelurahan setempat (RT/RW/Lurah) di lokasi acara.' },
  { id: 17, text: 'Saya memastikan kapasitas maksimum venue (venue capacity) tidak dimanipulasi demi mengejar penjualan tiket.' },
  { id: 18, text: 'Saya siap melampirkan dokumen profil perusahaan/organisasi (Company Profile) penyelenggara yang valid.' },
  { id: 19, text: 'Saya berkomitmen mematuhi regulasi jam malam operasional acara yang ditetapkan oleh pemda setempat.' },
  { id: 20, text: 'Saya paham bahwa menyelenggarakan acara tanpa izin resmi berisiko dibubarkan paksa oleh aparat berwenang.' },

  // KATEGORI 2: MANAJEMEN SPONSOR, HAK DONOR, & KONTRAPRESTASI BENEFIT (21-40)
  { id: 21, text: 'Saya berkomitmen memberikan seluruh benefit (kontraprestasi) kepada sponsor sesuai kesepakatan MoU.' },
  { id: 22, text: 'Saya siap memasang logo sponsor/donatur pada seluruh media cetak (spanduk, backdrop, umbul-umbul) sesuai paketnya.' },
  { id: 23, text: 'Saya akan memberikan slot ad-lips (pemberitahuan lisan) oleh MC untuk menyebutkan brand sponsor selama acara.' },
  { id: 24, text: 'Saya bersedia membagikan ruang promosi berupa booth/stand kepada sponsor utama di lokasi strategis venue.' },
  { id: 25, text: 'Iklan digital sponsor di media sosial acara akan ditayangkan tepat waktu sesuai jadwal campaign.' },
  { id: 26, text: 'Saya siap memberikan kompensasi atau pengembalian dana sponsor jika ada benefit utama yang gagal kami penuhi.' },
  { id: 27, text: 'Saya tidak akan menerima sponsor dari produk yang bertentangan dengan nilai moral/hukum (misal: judi, rokok anak, dll).' },
  { id: 28, text: 'Saya bersedia memberikan slot waktu presentasi produk bagi sponsor di panggung utama jika tertera dalam kontrak.' },
  { id: 29, text: 'Saya berkomitmen menjaga eksklusivitas industri sponsor (tidak memasukkan kompetitor langsung di kelas paket yang sama).' },
  { id: 30, text: 'Saya siap mengirimkan draf desain publikasi yang memuat logo sponsor untuk di-approve sebelum dicetak.' },
  { id: 31, text: 'Saya menjamin perlakuan profesional kepada perwakilan/delegasi sponsor yang menghadiri acara.' },
  { id: 32, text: 'Saya bersedia mencantumkan testimoni atau ucapan terima kasih khusus kepada donatur besar di press release media.' },
  { id: 33, text: 'Saya akan mengirimkan tiket VIP atau undangan resmi khusus untuk manajemen pihak sponsor/donatur.' },
  { id: 34, text: 'Saya tidak akan mengubah letak posisi branding logo sponsor tanpa persetujuan tertulis dari mereka.' },
  { id: 35, text: 'Saya siap mendokumentasikan setiap sudut area yang memuat logo sponsor sebagai bukti pertanggungjawaban.' },
  { id: 36, text: 'Saya berkomitmen menyampaikan jumlah realisasi total penonton/audiens yang hadir kepada pihak sponsor.' },
  { id: 37, text: 'Saya memastikan perwakilan sponsor mendapatkan akses data insight (jika online event) secara transparan.' },
  { id: 38, text: 'Saya menolak menjanjikan benefit komersial yang muluk-muluk di luar kemampuan eksekusi panitia.' },
  { id: 39, text: 'Saya siap melayani komplain dari pihak sponsor selama masa pra-event hingga pasca-event.' },
  { id: 40, text: 'Saya memahami bahwa kepuasan sponsor adalah kunci utama keberlanjutan pendanaan event jangka panjang.' },

  // KATEGORI 3: MANAJEMEN MASSA, KEAMANAN (CROWD CONTROL), & MITIGASI MEDIS (41-60)
  { id: 41, text: 'Saya siap menyediakan tim keamanan internal (security/bouncers) yang proporsional dengan jumlah massa.' },
  { id: 42, text: 'Saya berkomitmen menyediakan posko medis darurat (first-aid station) lengkap dengan obat-obatan dasar.' },
  { id: 43, text: 'Saya siap menyiagakan minimal satu armada ambulans di lokasi jika total kerumunan melebihi 500 orang.' },
  { id: 44, text: 'Saya akan bekerja sama dengan Palang Merah Remaja (PMR), KSR, atau tim medis profesional untuk penanganan pingsan/cedera.' },
  { id: 45, text: 'Saya siap menerapkan sistem pembatas antrean (queue barrier) di pintu masuk utama untuk mencegah desak-desakan.' },
  { id: 46, text: 'Saya bersedia merancang tata letak pintu masuk (In) dan pintu keluar (Out) secara terpisah demi kelancaran alur massa.' },
  { id: 47, text: 'Saya akan memastikan ketersediaan fasilitas dasar penunjang massa seperti toilet portabel dan tempat sampah yang cukup.' },
  { id: 48, text: 'Saya siap menyediakan area khusus (ring aman) bagi penyandang disabilitas, anak-anak, atau lansia jika acara bersifat umum.' },
  { id: 49, text: 'Saya berkomitmen memiliki rencana evakuasi darurat (evacuation plan) jika terjadi bencana alam atau kerusuhan.' },
  { id: 50, text: 'Saya memastikan sound system panggung dapat digunakan sebagai alat pengumuman darurat (public address system).' },
  { id: 51, text: 'Saya siap menunjuk satu koordinator lapangan (korlap) khusus yang memegang kendali penuh atas pergerakan massa.' },
  { id: 52, text: 'Saya berkomitmen melarang peredaran senjata tajam, miras, dan obat-obatan terlarang masuk ke area acara.' },
  { id: 53, text: 'Saya akan melakukan body checking/screening barang bawaan pengunjung di pintu gerbang utama venue.' },
  { id: 54, text: 'Saya siap menyediakan pencahayaan (lighting) yang cukup di seluruh sudut area acara, terutama saat malam hari.' },
  { id: 55, text: 'Saya memastikan ketersediaan Alat Pemadam Api Ringan (APAR) di area instalasi listrik berat, panggung, dan booth kuliner.' },
  { id: 56, text: 'Saya siap menghentikan sesi acara sementara waktu jika kondisi kerumunan dinilai sudah tidak kondusif atau over-capacity.' },
  { id: 57, text: 'Saya berkomitmen menjamin keselamatan kerja seluruh kru panitia, vendor, dan pengisi acara selama konstruksi panggung.' },
  { id: 58, text: 'Saya siap menyediakan air minum darurat gratis bagi pengunjung di barisan depan barikade untuk mencegah dehidrasi.' },
  { id: 59, text: 'Saya akan berkoordinasi dengan Polsek setempat untuk menempatkan personel pengamanan berseragam di titik rawan.' },
  { id: 60, text: 'Saya memahami bahwa kelalaian dalam manajemen massa dapat berujung pada sanksi pidana kelalaian (Pasal 359 KUHP).' },

  // KATEGORI 4: TRANSPARANSI ALOKASI ANGGARAN PRODUKSI & VENDOR ACARA (61-80)
  { id: 61, text: 'Saya siap merinci anggaran produksi event (sewa sound system, panggung, lighting) secara mendetail.' },
  { id: 62, text: 'Setiap kontrak sewa/kontrak vendor (panggung, talent, konsumsi) wajib disertai surat perjanjian hitam di atas putih.' },
  { id: 63, text: 'Saya tidak akan melakukan mark-up harga sewa alat produksi demi mengambil keuntungan pribadi dari dana sponsor.' },
  { id: 64, text: 'Saya siap memaparkan rincian biaya akomodasi, transportasi, dan riders (permintaan khusus) dari pengisi acara.' },
  { id: 65, text: 'Saya bersedia mengunggah invoice atau bukti pembayaran down payment (DP) dan pelunasan kepada seluruh vendor.' },
  { id: 66, text: 'Saya memastikan sistem pembayaran vendor dilakukan secara bertahap sesuai progres pengerjaan di lapangan.' },
  { id: 67, text: 'Saya berkomitmen mengalokasikan anggaran biaya tak terduga (contingency fund) terpisah khusus untuk kendala teknis.' },
  { id: 68, text: 'Saya siap menanggung denda penalti dari vendor secara mandiri jika pembatalan diakibatkan kelalaian internal panitia.' },
  { id: 69, text: 'Saya menjamin harga sewa alat-alat produksi event bersaing sehat dan sesuai dengan standar rate harga pasar.' },
  { id: 70, text: 'Saya menolak bekerja sama dengan vendor ilegal atau yang memiliki rekam jejak buruk dalam eksekusi event.' },
  { id: 71, text: 'Saya siap merinci biaya promosi digital (FB/IG Ads, Google Ads, influencer) yang dibiayai dari dana patungan/sponsor.' },
  { id: 72, text: 'Saya bersedia melaporkan pendapatan dari sektor lain (seperti penjualan tiket masuk, merchandise, atau sewa tenant).' },
  { id: 73, text: 'Saya menolak memotong anggaran krusial keamanan dan medis demi memperbesar anggaran dekorasi estetik semata.' },
  { id: 74, text: 'Saya siap memberikan akses cross-check bagi verifikator untuk mengonfirmasi harga langsung ke pihak vendor.' },
  { id: 75, text: 'Saya berkomitmen melunasi seluruh kewajiban pembayaran vendor maksimal sesuai tenggat waktu pasca-event.' },
  { id: 76, text: 'Saya menjamin tidak ada dana talangan dari pihak ketiga yang tidak jelas asal-usul hukumnya.' },
  { id: 77, text: 'Saya siap menyusun laporan laba rugi (income statement) sederhana khusus untuk operasional event ini.' },
  { id: 78, text: 'Saya menolak menerima komisi terselubung (kickback) dari vendor yang merugikan total efisiensi anggaran acara.' },
  { id: 79, text: 'Saya memastikan pendanaan operasional pra-acara tidak mengandalkan utang piutang atas nama platform.' },
  { id: 80, text: 'Saya percaya transparansi anggaran produksi adalah bukti profesionalisme Event Organizer yang akuntabel.' },

  // KATEGORI 5: PELAPORAN DAMPAK KONTEN (POST-EVENT REPORT) & EVALUASI KEGIATAN (81-100)
  { id: 81, text: 'Saya berkomitmen menyusun dan mengirimkan LPJ (Laporan Pertanggungjawaban) Acara maksimal 14 hari setelah event selesai.' },
  { id: 82, text: 'Saya siap menyusun dokumen LPJ Event khusus (Post-Event Report) untuk dikirimkan kepada seluruh pihak sponsor.' },
  { id: 83, text: 'Saya bersedia melampirkan dokumentasi foto berkualitas HD dan video dokumentasi (aftermovie) acara di laporan akhir.' },
  { id: 84, text: 'Saya akan menyertakan kliping publikasi media (media monitoring) jika acara mendapatkan peliputan berita pers.' },
  { id: 85, text: 'Saya siap menyajikan data demografi konkret pengunjung yang hadir (jumlah, rentang usia) berdasarkan data registrasi/tiket.' },
  { id: 86, text: 'Saya berkomitmen membersihkan kembali seluruh area venue dari sampah sisa acara (zero waste target pasca-event).' },
  { id: 87, text: 'Saya bersedia mempublikasikan statistik keberhasilan acara (misal: jumlah donasi terkumpul, total penerima manfaat) ke publik.' },
  { id: 88, text: 'Saya siap menyertakan hasil kuesioner kepuasan pengunjung (feedback form) di dalam evaluasi internal.' },
  { id: 89, text: 'Saya tidak akan memalsukan atau menggelembungkan data jumlah pengunjung (attendance rate) di dalam laporan.' },
  { id: 90, text: 'Saya bersedia mengadakan rapat evaluasi pembubaran panitia dan mencatat poin-poin kekurangan untuk perbaikan masa depan.' },
  { id: 91, text: 'Saya siap melampirkan bukti pengembalian barang sewa vendor dalam kondisi utuh dan tanpa sengketa.' },
  { id: 92, text: 'Saya berkomitmen menyelesaikan sengketa atau keluhan pengunjung pasca-acara (jika ada) secara kekeluargaan dan bijak.' },
  { id: 93, text: 'Saya siap mencantumkan laporan evaluasi teknis (kendala genset, sound, cuaca) secara jujur di berkas arsip.' },
  { id: 94, text: 'Saya bersedia menyerahkan hak dokumentasi acara kepada platform untuk kebutuhan portofolio verifikasi.' },
  { id: 95, text: 'Saya memastikan semua sisa perlengkapan (inventaris) acara disimpan dengan baik oleh organisasi untuk event selanjutnya.' },
  { id: 96, text: 'Saya siap membagikan sertifikat penghargaan kepada seluruh relawan, panitia, dan pihak yang membantu jalannya acara.' },
  { id: 97, text: 'Saya berkomitmen melaporkan sisa anggaran bersih acara (surplus) dan rencana penggunaannya untuk program sosial lanjutan.' },
  { id: 98, text: 'Saya siap mematuhi penilaian performa (rating) penyelenggara acara yang diberikan oleh sistem platform.' },
  { id: 99, text: 'Saya menjamin tidak akan menghilang (ghosting) dari tanggung jawab pasca-acara sebelum dokumen LPJ disetujui.' },
  { id: 100, text: 'Saya menyatakan dengan penuh kesadaran bahwa menyelenggarakan acara adalah komitmen menjaga kepercayaan publik dari awal hingga akhir.' }
])

// Normalisasi ID pertanyaan agar urut sempurna 1 s.d 100
questions.value.forEach((q, idx) => {
  q.id = idx + 1
})

// Opsi Pilihan Jawaban
const options = [
    'Setuju Sekali',
    'Setuju',
    'Kurang Setuju',
    'Kurang Setuju Sekali',
]

// State penampung jawaban kuesioner
const answers = ref<Record<number, { option: string; explanation: string }>>({})

// Inisialisasi object jawaban kosong untuk seluruh 100 pertanyaan
questions.value.forEach(q => {
  answers.value[q.id] = { option: '', explanation: '' }
})

// Validasi kuesioner: Seluruh 100 pertanyaan wajib terisi pilihan ganda & penjelasannya
const isFormValid = computed(() => {
  return questions.value.every(q => {
    const ans = answers.value[q.id]
    return ans && ans.option !== '' && ans.explanation.trim() !== ''
  })
})

// Fungsi pengiriman laporan jawaban via WhatsApp Web/App API
const handleSendToWhatsApp = () => {
  const phoneNumber = '6285950540055' // Nomor tujuan verifikator utama event
  
  let lines = [
    `*VERIFIKASI KELAYAKAN PENYELENGGARA ACARA (100 POIN MANAJEMEN EVENT)*`,
    `======================================================================`,
    ``
  ]

  questions.value.forEach((q, index) => {
    const ans = answers.value[q.id]
    lines.push(`*${index + 1}. ${q.text}*`)
    lines.push(`👉 *Jawaban:* ${ans.option}`)
    lines.push(`✍️ *Rencana Eksekusi/Alasan:* ${ans.explanation}`)
    lines.push(`----------------------------------------------------------------------`)
    lines.push(``)
  })

  const messageString = lines.join('\n')
  const urlEncodedMessage = encodeURIComponent(messageString)
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${urlEncodedMessage}`

  window.open(whatsappUrl, '_blank')
}
</script>

<template>
  <Head title="Pendaftaran Penyelenggara Acara" />

    <div class="max-w-2xl mx-auto mt-10 p-6 bg-stone-900 border border-stone-800 rounded-3xl shadow-xl text-stone-100 transition-all duration-300">
      
      <div v-if="!isSteppingToQuiz" class="text-center max-w-md mx-auto py-4">
        <div class="text-4xl mb-4">🎪</div>
        <h2 class="text-xl font-bold text-stone-100 mb-2">Pendaftaran Penyelenggara Acara</h2>
        <p class="text-xs text-amber-500 font-semibold tracking-wider uppercase mb-3">Sistem Kelayakan Operasional & Manajemen Event</p>
        <p class="text-xs text-stone-400 mb-6 leading-relaxed text-justify bg-stone-950 p-4 rounded-2xl border border-stone-800">
          Untuk mengajukan proposal sponsor, penggalangan donasi event, atau kerja sama komersial acara, Anda wajib melengkapi **100 instrumen kelayakan penyelenggara acara**. 
          <br/><br/>
          <span class="text-amber-400/80 font-medium">*Catatan: Pertanyaan ini fokus pada kesiapan operasional lapangan, perizinan, crowd control, dan hak sponsor. Validasi fraud keuangan telah diwakili oleh form Penggalang Dana.</span>
        </p>
        
        <button 
          @click="isSteppingToQuiz = true"
          class="block w-full text-center bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold py-3 px-4 rounded-xl text-sm transition-colors cursor-pointer shadow-lg shadow-amber-500/10"
        >
          Mulai Kuesioner Acara (100 Nomor)
        </button>
        
        <Link href="/dashboard" class="block text-xs text-stone-500 hover:text-stone-300 mt-4 underline">
          Kembali ke Dashboard
        </Link>
      </div>

      <div v-else class="space-y-8 animate-fade-in">
        <div class="border-b border-stone-800 pb-4 sticky top-0 bg-stone-900/95 backdrop-blur-md z-10 py-2 flex justify-between items-center">
          <div>
            <h2 class="text-base font-bold text-amber-500 flex items-center gap-1.5">
              <span>🎪</span> Kelayakan Manajemen Acara
            </h2>
            <p class="text-[10px] text-stone-400 mt-0.5">Selesaikan seluruh poin di bawah untuk membuka akses pengajuan sponsor.</p>
          </div>
          <div class="text-[11px] font-bold text-amber-400 bg-stone-950 px-3 py-1.5 rounded-full border border-stone-800 shrink-0">
            100 Pertanyaan
          </div>
        </div>

        <form @submit.prevent="handleSendToWhatsApp" class="space-y-6">
          <div 
            v-for="(question, index) in questions" 
            :key="question.id" 
            class="p-5 bg-stone-950 border border-stone-800/60 rounded-2xl space-y-4 select-none"
          >
            <label class="block text-sm font-semibold leading-relaxed text-stone-200">
              {{ index + 1 }}. {{ question.text }}
            </label>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label 
                v-for="opt in options" 
                :key="opt"
                class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all bg-stone-900"
                :class="answers[question.id]?.option === opt 
                  ? 'border-amber-500/80 bg-amber-500/5 text-amber-400 font-medium' 
                  : 'border-stone-800 text-stone-400 hover:border-stone-700'"
              >
                <input 
                  type="radio" 
                  :name="'q-' + question.id" 
                  :value="opt"
                  v-model="answers[question.id].option"
                  class="accent-amber-500 h-4 w-4"
                />
                <span>{{ opt }}</span>
              </label>
            </div>

            <div class="space-y-1.5">
              <span class="text-[11px] font-medium text-stone-500 block">Rencana Aksi / Penjelasan Teknis Panitia:</span>
              <textarea
                v-model="answers[question.id].explanation"
                rows="2"
                placeholder="Tuliskan bagaimana cara tim Anda mengimplementasikan poin ini di lapangan nanti..."
                class="w-full text-xs p-3 rounded-xl bg-stone-900 border border-stone-800 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-stone-200 placeholder-stone-600 outline-none resize-none"
              ></textarea>
            </div>
          </div>

          <div class="pt-4 border-t border-stone-800 flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-stone-900/95 backdrop-blur py-4 z-10">
            <button
              type="button"
              @click="isSteppingToQuiz = false"
              class="w-full sm:w-1/3 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold py-3 px-4 rounded-xl text-sm transition-colors cursor-pointer"
            >
              Kembali
            </button>
            <button
              type="submit"
              :disabled="!isFormValid"
              class="w-full sm:w-2/3 text-center font-bold py-3 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              :class="isFormValid 
                ? 'bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-md shadow-amber-500/10' 
                : 'bg-stone-800 text-stone-600 cursor-not-allowed'"
            >
              <span>💬 Kirim 100 Validasi Event ke WA</span>
            </button>
          </div>
          <p v-if="!isFormValid" class="text-center text-[11px] text-stone-500">
            * Seluruh 100 instrumen kuesioner manajemen event wajib dilengkapi untuk memproses pengiriman data.
          </p>
        </form>
      </div>

    </div>
</template>