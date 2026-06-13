<script setup lang="ts">
import { ref, computed } from 'vue'
import { Head, Link } from '@inertiajs/vue3'

// State untuk melacak perpindahan halaman awal ke kuesioner
const isSteppingToQuiz = ref(false)

// State untuk melacak tab/kategori aktif
const activeTab = ref(1)

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Pendaftaran Penyelenggara Acara',
                href: '/pendaftaran/penyelenggara-acara',
            },
        ],
    },
});

// Struktur data pertanyaan
interface Question {
  id: number
  text: string
}

// Daftar kategori penyelenggara acara
const categories = [
  { id: 1, name: 'Konsep & Birokrasi Legal', range: '1-20' },
  { id: 2, name: 'Sponsor & Hak Donor', range: '21-40' },
  { id: 3, name: 'Manajemen Massa & Medis', range: '41-60' },
  { id: 4, name: 'Anggaran & Manajemen Vendor', range: '61-80' },
  { id: 5, name: 'Evaluasi & Pasca-Event', range: '81-100' }
]

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

// 1. Ubah struktur state answers untuk menyimpan pilihan dan alasan
const answers = ref<Record<number, { choice: string, reason: string }>>({})

// Inisialisasi state jawaban
questions.value.forEach(q => {
  answers.value[q.id] = { choice: '', reason: '' }
})

// Opsi pilihan yang tersedia
const options = ['Sangat Tidak Setuju', 'Tidak Setuju', 'Setuju', 'Sangat Setuju']

// 2. Filter pertanyaan per kategori (rentang per 20 soal)
const filteredQuestions = computed(() => {
  return questions.value.filter(q => {
    if (activeTab.value === 1) return q.id >= 1 && q.id <= 20
    if (activeTab.value === 2) return q.id >= 21 && q.id <= 40
    if (activeTab.value === 3) return q.id >= 41 && q.id <= 60
    if (activeTab.value === 4) return q.id >= 61 && q.id <= 80
    return q.id >= 81 && q.id <= 100
  })
})

// 3. Validasi sekarang mengecek kategori yang sedang aktif
const isCategoryValid = computed(() => {
  return filteredQuestions.value.every(q => 
    answers.value[q.id].choice !== '' && 
    answers.value[q.id].reason.trim() !== ''
  )
})

// 4. Update fungsi kalkulasi progress (sesuaikan rentang Penyelenggara Acara)
const getCategoryProgress = (catId: number) => {
  let min = 1, max = 20
  if (catId === 2) { min = 21; max = 40 }
  else if (catId === 3) { min = 41; max = 60 }
  else if (catId === 4) { min = 61; max = 80 }
  else if (catId === 5) { min = 81; max = 100 }

  const catQuestions = questions.value.filter(q => q.id >= min && q.id <= max)
  const answered = catQuestions.filter(q => 
    answers.value[q.id].choice !== '' && answers.value[q.id].reason.trim() !== ''
  ).length
  return `${answered}/${catQuestions.length}`
}

// 5. Fungsi pengiriman ke WA khusus Penyelenggara Acara
const sendToWhatsApp = () => {
  if (!isCategoryValid.value) return

  const activeCategory = categories.find(c => c.id === activeTab.value)
  let waText = `*Laporan Penyelenggara Acara - Kategori: ${activeCategory?.name}*\n\n`

  filteredQuestions.value.forEach(q => {
    const ans = answers.value[q.id]
    waText += `*[${q.id}] ${q.text}*\n`
    waText += `Jawaban: ${ans.choice}\n`
    waText += `Alasan: ${ans.reason}\n\n`
  })

  // Format nomor HP
  const waNumber = '6285950540055' 
  const encodedText = encodeURIComponent(waText)
  
  // Buka tab baru ke WhatsApp
  window.open(`https://wa.me/${waNumber}?text=${encodedText}`, '_blank')
}
</script>

<template>
  <Head title="Verifikasi Penyelenggara Acara" />

  <div v-if="!isSteppingToQuiz" class="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xl m-3">
    <h1 class="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-500 mb-4">Verifikasi Khusus Penyelenggara Acara</h1>
    <p class="text-stone-600 dark:text-stone-400 text-sm leading-relaxed mb-6">
      Sebelum mengajukan proposal pendanaan event/sponsor, pastikan manajemen lapangan, kesiapan crowd control, perizinan, dan transparansi vendor Anda memenuhi <span class="text-stone-800 dark:text-stone-200 font-semibold">100 standar kepatuhan platform</span>.
    </p>
    <button 
      @click="isSteppingToQuiz = true"
      class="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white dark:text-stone-950 font-bold py-3 px-6 rounded-xl transition-colors cursor-pointer"
    >
      Mulai Verifikasi
    </button>
  </div>

  <div v-if="!isSteppingToQuiz" class="p-6 sm:p-8  m-3">
    <p class="text-stone-600 dark:text-stone-400 text-sm leading-relaxed mb-6">          
      Anda juga diwajibkan mengisi questioner menjadi relawan / donatur. Jika belum mengisi <span class="text-indigo-500 font-semibold"><Link href="/pendaftaran/relawan-donatur">klik di sini</Link></span>.
    </p>
  </div>


  <form v-else class="flex flex-col overflow-hidden">
    
    <div class="p-6 border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 sticky top-0 backdrop-blur z-20">
      <h2 class="text-lg font-bold text-amber-600 dark:text-amber-500 mb-4">Standardisasi Manajemen & Akuntabilitas Event</h2>
      
      <div class="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          @click="activeTab = cat.id"
          class="flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 border"
          :class="activeTab === cat.id 
            ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/40 text-amber-600 dark:text-amber-500 shadow-sm' 
            : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'"
        >
          <span>{{ cat.name }}</span>
          <span class="px-1.5 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-[10px] font-mono text-stone-600 dark:text-stone-300">
            {{ getCategoryProgress(cat.id) }}
          </span>
        </button>
      </div>
    </div>

    <div class="p-3 space-y-2">
      <div 
        v-for="q in filteredQuestions" 
        :key="q.id" 
        :class="[
          'p-5 rounded-xl border transition-colors flex flex-col gap-4',
          answers[q.id].choice !== '' && answers[q.id].reason.trim() !== '' 
            ? 'bg-emerald-100 border-emerald-200 dark:bg-emerald-500/20 dark:border-emerald-700/50' 
            : 'bg-white border-stone-200 hover:border-stone-300 dark:bg-stone-950 dark:border-stone-800/60 dark:hover:border-stone-800'
        ]"
      >
        <div class="text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-semibold select-none">
          <span class="font-mono text-xs text-amber-600 dark:text-amber-500 mr-1">[{{ q.id }}]</span>
          {{ q.text }}
        </div>

        <!-- Opsi Radio Kustom (Inline Toggle Icon) -->
        <div class="flex flex-col gap-3">
          <!-- Container Toggle -->
          <div class="flex items-center p-1 bg-stone-100 dark:bg-stone-800 rounded-xl w-fit gap-1 border border-stone-200 dark:border-stone-700/50 shadow-inner">
            <label 
              v-for="opt in options" 
              :key="opt" 
              class="cursor-pointer flex items-center justify-center py-2 px-5 rounded-lg transition-all duration-300"
              :class="[
                answers[q.id].choice === opt 
                  ? (opt === 'Sangat Tidak Setuju' ? 'bg-red-500 text-white shadow-md shadow-red-500/20' :
                    opt === 'Tidak Setuju' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' :
                    opt === 'Setuju' ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20' :
                    'bg-emerald-500 text-rose-400 shadow-md shadow-emerald-500/20')
                  : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-white dark:hover:bg-stone-700/50'
              ]"
              :title="opt"
            >
              <!-- Hidden Native Radio Input -->
              <input
                type="radio"
                :name="'q-' + q.id"
                :value="opt"
                v-model="answers[q.id].choice"
                class="hidden"
              />
              
              <!-- 1. Ikon Silang (Sangat Tidak Setuju) -->
              <svg v-if="opt === 'Sangat Tidak Setuju'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 transition-transform" :class="{'scale-110': answers[q.id].choice === opt}"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              
              <!-- 2. Ikon Unlike (Tidak Setuju) -->
              <svg v-else-if="opt === 'Tidak Setuju'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" :fill="answers[q.id].choice === opt ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 transition-transform" :class="{'scale-110': answers[q.id].choice === opt}"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/></svg>
              
              <!-- 3. Ikon Like (Setuju) -->
              <svg v-else-if="opt === 'Setuju'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" :fill="answers[q.id].choice === opt ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 transition-transform" :class="{'scale-110': answers[q.id].choice === opt}"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>
              
              <!-- 4. Ikon Love (Sangat Setuju) -->
              <svg v-else-if="opt === 'Sangat Setuju'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" :fill="answers[q.id].choice === opt ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 transition-transform" :class="{'scale-110': answers[q.id].choice === opt}"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </label>
          </div>
          
          <!-- Teks Indikator Pilihan Bawah -->
          <div 
            class="text-sm font-bold ml-1 transition-colors select-none" 
            :class="[
              answers[q.id].choice === 'Sangat Tidak Setuju' ? 'text-red-500' :
              answers[q.id].choice === 'Tidak Setuju' ? 'text-amber-500' :
              answers[q.id].choice === 'Setuju' ? 'text-indigo-500' :
              answers[q.id].choice === 'Sangat Setuju' ? 'text-emerald-500' :
              'text-stone-400 dark:text-stone-500'
            ]"
          >
            {{ answers[q.id].choice || 'Pilih jawaban Anda' }}
          </div>
        </div>       

        <div class="relative">
          <textarea
            v-model="answers[q.id].reason"
            maxlength="100"
            placeholder="Tulis alasan jawaban Anda di sini (maks. 100 karakter)..."
            class="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-3 pb-7 text-sm text-stone-800 dark:text-stone-300 placeholder-stone-400 dark:placeholder-stone-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors resize-none"
            rows="2"
          ></textarea>
          
          <div 
            class="absolute bottom-2 right-3 text-[10px] font-mono" 
            :class="answers[q.id].reason.length >= 100 ? 'text-red-500 dark:text-red-400 font-bold' : 'text-stone-400 dark:text-stone-500'"
          >
            {{ answers[q.id].reason.length }}/100
          </div>
        </div>
      </div>
    </div>

    <div class="p-4 border-t border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur flex sm:flex-nowrap flex-wrap-reverse gap-3 sticky bottom-0 z-10">
      <button
        type="button"
        @click="isSteppingToQuiz = false"
        class="w-full sm:w-1/3 bg-stone-200 hover:bg-stone-300 text-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300 font-semibold py-3 px-4 rounded-xl text-sm transition-colors cursor-pointer"
      >
        Kembali
      </button>
      
      <button
        type="button"
        @click="sendToWhatsApp"
        :disabled="!isCategoryValid"
        class="w-full sm:w-2/3 text-center font-bold py-3 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
        :class="isCategoryValid 
          ? 'bg-green-600 hover:bg-green-500 text-white shadow-md shadow-green-600/20' 
          : 'bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-600 cursor-not-allowed'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span>Kirim ke Whatsapp</span>
      </button>
    </div>
  </form>
</template>