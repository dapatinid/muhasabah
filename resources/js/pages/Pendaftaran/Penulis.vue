<script setup lang="ts">
import { ref, computed } from 'vue'
import { Head, Link } from '@inertiajs/vue3'

// State untuk melacak apakah user sudah menekan tombol "Daftar Sekarang"
const isSteppingToQuiz = ref(false)

// State untuk melacak tab/kategori aktif
const activeTab = ref(1)

// Struktur data pertanyaan
interface Question {
  id: number
  text: string
}

// Daftar kategori kelayakan penulis
const categories = [
  { id: 1, name: 'Komitmen & Konsistensi', range: '1-20' },
  { id: 2, name: 'Integritas & Anti-Plagiasi', range: '21-40' },
  { id: 3, name: 'Etika & Filter SARA', range: '41-60' },
  { id: 4, name: 'Kritik & Editing', range: '61-80' },
  { id: 5, name: 'Kualitas & Pengembangan', range: '81-100' }
]

// 100 Pertanyaan Kelayakan Penulis Kalam
const questions = ref<Question[]>([
  // KATEGORI 1: KOMITMEN & KONSISTENSI (1-20)
  { id: 1, text: 'Saya berkomitmen untuk menerbitkan artikel minimal 2 kali dalam seminggu secara berkala.' },
  { id: 2, text: 'Saya siap meluangkan waktu khusus setiap hari untuk riset dan menulis konten Kalam.' },
  { id: 3, text: 'Kehadiran tenggat waktu (deadline) dari editor justru memotivasi saya untuk menulis lebih baik.' },
  { id: 4, text: 'Saya tetap akan menulis secara konsisten meskipun artikel saya di awal-awal sepi pembaca.' },
  { id: 5, text: 'Saya bersedia berpartisipasi dalam rapat redaksi bulanan jika diundang oleh tim Kalam.' },
  { id: 6, text: 'Menulis bagi saya adalah jalan dakwah dan literasi, bukan sekadar mencari popularitas instan.' },
  { id: 7, text: 'Saya sanggup menjaga ritme menulis meskipun sedang sibuk dengan urusan pekerjaan utama.' },
  { id: 8, text: 'Saya akan segera memberi tahu pihak editor jika terjadi kendala yang membuat tulisan saya terlambat.' },
  { id: 9, text: 'Saya siap membuat stok tulisan cadangan untuk mengantisipasi masa-masa darurat/sibuk.' },
  { id: 10, text: 'Saya percaya bahwa disiplin menulis jauh lebih penting daripada menunggu datangnya inspirasi.' },
  { id: 11, text: 'Saya bersedia berkontribusi dalam jangka panjang (minimal 6 bulan ke depan) sebagai penulis tetap.' },
  { id: 12, text: 'Saya siap mengalokasikan waktu untuk merevisi tulisan secara mandiri sebelum dikirim ke meja editor.' },
  { id: 13, text: 'Saya mampu mengelola stres dengan baik saat dihadapkan pada jadwal publikasi yang padat.' },
  { id: 14, text: 'Saya selalu mendokumentasikan ide-ide tulisan baru ke dalam catatan khusus agar tidak lupa.' },
  { id: 15, text: 'Saya bersedia menulis tema-tema khusus yang ditugaskan langsung oleh tim redaksi Kalam.' },
  { id: 16, text: 'Saya akan menjaga komunikasi yang responsif dan sopan dengan tim admin maupun sesama penulis.' },
  { id: 17, text: 'Saya mengutamakan penyelesaian satu artikel berkualitas hingga tuntas dibanding menimbun banyak draf setengah jadi.' },
  { id: 18, text: 'Bagi saya, menjaga kepercayaan pembaca lewat konsistensi rilis adalah prioritas utama.' },
  { id: 19, text: 'Saya siap mempelajari pola manajemen waktu baru demi kelancaran proses produksi artikel.' },
  { id: 20, text: 'Saya yakin komitmen menulis saya tidak akan luntur meskipun menghadapi kejenuhan (writer’s block).' },

  // KATEGORI 2: INTEGRITAS AKADEMIK & ANTI-PLAGIARISME (21-40)
  { id: 21, text: 'Artikel yang saya tulis harus bersifat orisinal dan bukan hasil saduran mentah atau plagiasi.' },
  { id: 22, text: 'Saya tidak akan pernah menggunakan tools AI (seperti ChatGPT) untuk men-generate artikel murni secara utuh.' },
  { id: 23, text: 'Setiap kutipan, data, atau pemikiran tokoh lain wajib saya cantumkan sumbernya dengan jelas.' },
  { id: 24, text: 'Saya lebih memilih menulis sedikit kata tapi hasil pemikiran sendiri dibanding ribuan kata hasil copy-paste.' },
  { id: 25, text: 'Saya bersedia menerima sanksi pemblokiran akun jika terbukti melakukan tindakan plagiarisme.' },
  { id: 26, text: 'Saya selalu melakukan cek ulang (cross-check) terhadap keaslian kalimat yang saya susun.' },
  { id: 27, text: 'Menggunakan ide orang lain tanpa izin atau atribusi adalah pelanggaran berat dalam kode etik saya.' },
  { id: 28, text: 'Saya siap bertanggung jawab secara hukum penuh atas keaslian seluruh isi konten yang saya terbitkan.' },
  { id: 29, text: 'Meskipun menggunakan kutipan dari kitab klasik atau buku, saya akan menarasikannya kembali dengan bahasa sendiri.' },
  { id: 30, text: 'Saya menolak keras praktik mempublikasikan satu artikel yang sama di dua media online yang berbeda.' },
  { id: 31, text: 'Integritas nama baik saya sebagai penulis jauh lebih berharga dibanding traffic instan hasil konten curian.' },
  { id: 32, text: 'Saya paham cara membedakan antara mencari inspirasi referensi dengan meniru struktur tulisan orang lain.' },
  { id: 33, text: 'Jika saya menggunakan bantuan gambar atau ilustrasi luar, saya wajib menyertakan kredit fotografer/kreatornya.' },
  { id: 34, text: 'Saya akan menghindari manipulasi data atau kutipan demi mencocokkan argumen pribadi saya.' },
  { id: 35, text: 'Setiap dalil Al-Qur’an atau Hadist yang saya cantumkan harus diverifikasi teks Arab dan kesahihan riwayatnya.' },
  { id: 36, text: 'Saya tidak akan mengubah makna asli dari narasumber saat melakukan teknik parafrase kalimat.' },
  { id: 37, text: 'Saya bersedia artikel saya melewati proses screening plagiat otomatis oleh sistem internal Kalam.' },
  { id: 38, text: 'Jujur dalam menulis adalah bagian dari cerminan akhlak seorang penuntut ilmu.' },
  { id: 39, text: 'Saya tidak akan mengambil jalan pintas dalam menulis demi mengejar kuantitas setoran artikel.' },
  { id: 40, text: 'Bagi saya, orisinalitas adalah pondasi utama dalam membangun personal branding penulis yang kuat.' },

  // KATEGORI 3: ETIKA JURNALISTIK & PENYARINGAN ISU SARA (41-60)
  { id: 41, text: 'Saya memahami bahwa tulisan yang melanggar SARA dan bersifat provokatif akan langsung dihapus oleh redaksi.' },
  { id: 42, text: 'Saya berkomitmen untuk menghindari pembahasan khilafiyah (perbedaan mazhab) yang memicu perpecahan umat.' },
  { id: 43, text: 'Dalam mengulas isu sensitif, saya akan menyajikannya secara objektif tanpa menyudutkan kelompok tertentu.' },
  { id: 44, text: 'Saya tidak akan menyebarkan berita yang belum jelas kebenarannya (hoaks) di dalam artikel Kalam.' },
  { id: 45, text: 'Gaya bahasa yang saya gunakan harus tetap santun, sejuk, dan edukatif meskipun sedang mengkritik seuatu.' },
  { id: 46, text: 'Saya akan menyaring informasi dari media sosial terlebih dahulu sebelum menjadikannya bahan ulasan tulisan.' },
  { id: 47, text: 'Menjaga kedamaian dan ukhuwah islamiyah di ruang digital adalah tanggung jawab moral saya sebagai penulis.' },
  { id: 48, text: 'Saya menolak menulis judul yang menjebak (clickbait) demi memanipulasi emosi pembaca.' },
  { id: 49, text: 'Jika ada kekeliruan data dalam artikel yang terlanjur terbit, saya bersedia melakukan ralat terbuka.' },
  { id: 50, text: 'Saya tidak akan memanfaatkan platform Kalam untuk kepentingan politik praktis atau kampanye hitam.' },
  { id: 51, text: 'Menghargai privasi dan hak narasumber adalah hal yang mutlak saya terapkan saat menulis opini berbasis fakta.' },
  { id: 52, text: 'Saya mengutamakan tulisan yang membawa solusi dan optimisme di tengah konflik sosial masyarakat.' },
  { id: 53, text: 'Setiap opini pribadi yang saya keluarkan harus didasari argumen logis, bukan sekadar luapan emosi amarah.' },
  { id: 54, text: 'Saya bertekad menjauhkan platform Kalam dari ujaran kebencian, perundungan, ataupun pencemaran nama baik.' },
  { id: 55, text: 'Saya paham batas aman antara mengkritik kebijakan dengan menghina personal figur publik.' },
  { id: 56, text: 'Saya bersedia mengikuti panduan komunitas (community guidelines) yang ditetapkan oleh manajemen Kalam.' },
  { id: 57, text: 'Sebelum mengirim artikel, saya selalu memposisikan diri sebagai pembaca umum untuk menilai dampak tulisan tersebut.' },
  { id: 58, text: 'Saya tidak akan memuat konten yang berbau pornografi, kekerasan ekstrem, atau hal tabu lainnya.' },
  { id: 59, text: 'Saya setuju bahwa kebenaran informasi di atas segala-galanya dibanding kecepatan menaikkan isu hangat.' },
  { id: 60, text: 'Saya berkomitmen menjaga marwah media Kalam agar tetap bersih dari muatan-muatan toksik.' },

  // KATEGORI 4: KESIAPAN MENERIMA KRITIK & EDITING (61-80)
  { id: 61, text: 'Saya siap menerima kritik dan saran yang membangun dari editor maupun pembaca dengan lapang dada.' },
  { id: 62, text: 'Saya tidak akan merasa sakit hati atau tersinggung jika draf artikel saya ditolak atau dikembalikan oleh editor.' },
  { id: 63, text: 'Saya memberikan hak sepenuhnya kepada editor untuk mengubah judul atau struktur kalimat demi keterbacaan.' },
  { id: 64, text: 'Jika editor meminta revisi total, saya akan mengerjakannya kembali dengan senang hati demi kualitas terbaik.' },
  { id: 65, text: 'Saya menganggap proses editing sebagai ruang belajar gratis untuk meningkatkan skill kepenulisan saya.' },
  { id: 66, text: 'Saya bersedia menerima masukan dari pembaca di kolom komentar dan membalasnya secara bijak.' },
  { id: 67, text: 'Saya tidak akan bersikap defensif atau keras kepala mempertahankan gaya menulis yang dinilai keliru oleh tim ahli.' },
  { id: 68, text: 'Saya siap menyelaraskan gaya penulisan saya dengan standar PUEBI/EYD yang berlaku di media Kalam.' },
  { id: 69, text: 'Bagi saya, koreksi dari orang lain adalah cara tercepat untuk melihat kelemahan sudut pandang saya.' },
  { id: 70, text: 'Saya bersedia draf artikel saya ditunda penayangannya jika dirasa membutuhkan riset tambahan.' },
  { id: 71, text: 'Saya menghargai profesionalitas editor dan mempercayai keputusan akhir mereka terkait layak tidaknya artikel.' },
  { id: 72, text: 'Kritikan pedas dari pembaca akan saya jadikan bahan evaluasi, bukan alasan untuk berhenti menulis.' },
  { id: 73, text: 'Saya aktif bertanya kepada senior atau editor jika menemui kebingungan arah pembahasan artikel.' },
  { id: 74, text: 'Saya siap mengubah sudut pandang tulisan jika ditemukan data baru yang mematahkan argumen awal saya.' },
  { id: 75, text: 'Saya berkomitmen untuk terus memperbaiki kesalahan tata bahasa yang sering berulang pada draf sebelumnya.' },
  { id: 76, text: 'Saya percaya proses kurasi yang ketat akan melahirkan ekosistem penulis yang berkelas.' },
  { id: 77, text: 'Saya tidak akan memprotes kebijakan redaksi di media sosial jika draf saya belum disetujui tayang.' },
  { id: 78, text: 'Saya menghormati waktu kerja editor dengan cara mengirimkan revisi tepat waktu.' },
  { id: 79, text: 'Menerima koreksi kesalahan ketik (typo) adalah hal mendasar yang saya sambut dengan terbuka.' },
  { id: 80, text: 'Saya siap bertumbuh bersama komunitas Kalam dengan mengesampingkan ego ego pribadi.' },

  // KATEGORI 5: KUALITAS RISET & KEDALAMAN MATERI (81-100)
  { id: 81, text: 'Gaya penulisan saya berfokus pada kedalaman materi dan data pendukung yang valid (bukan sekadar asumsi).' },
  { id: 82, text: 'Saya terbiasa membaca buku, jurnal, atau artikel ilmiah sebelum mulai mengeksekusi topik tulisan.' },
  { id: 83, text: 'Saya siap melakukan wawancara ringan atau mengutip pendapat pakar ahli demi memperkuat bobot artikel.' },
  { id: 84, text: 'Saya mengutamakan kualitas ulasan mendalam (in-depth review) daripada tulisan yang dangkal dan sekilas.' },
  { id: 85, text: 'Setiap angka statistik yang saya tampilkan di dalam teks wajib diverifikasi dari lembaga resmi (seperti BPS, dll).' },
  { id: 86, text: 'Saya mampu menyederhanakan materi agama/filsafat yang berat menjadi ulasan yang renyah dipahami awam.' },
  { id: 87, text: 'Saya selalu memeriksa latar belakang keilmuan penulis dari referensi yang saya jadikan acuan.' },
  { id: 88, text: 'Menyusun kerangka tulisan (outline) adalah rutinitas wajib saya sebelum mengembangkan isi paragraf.' },
  { id: 89, text: 'Saya menghindari membuat kesimpulan yang terburu-buru tanpa memaparkan bukti-bukti yang kuat terlebih dahulu.' },
  { id: 90, text: 'Saya tertarik mengeksplorasi sudut pandang baru yang belum banyak dibahas oleh media-media arus utama.' },
  { id: 91, text: 'Saya bersedia berinvestasi waktu untuk membaca draf berulang kali demi memastikan alur logika antar paragraf sinkron.' },
  { id: 92, text: 'Bagi saya, menyajikan peta masalah yang utuh jauh lebih penting daripada sekadar memburu jumlah kata minimum.' },
  { id: 93, text: 'Saya terbiasa memisahkan antara fakta di lapangan dengan penafsiran opini subjektif saya sendiri.' },
  { id: 94, text: 'Saya siap memperbarui konten lama yang saya tulis jika di kemudian hari ditemukan pembaruan data ilmiah.' },
  { id: 95, text: 'Saya rajin mengikuti perkembangan tren keilmuan dan literasi kontemporer agar tulisan tetap relevan.' },
  { id: 96, text: 'Saya paham esensi penggunaan analogi/metafora yang tepat untuk membantu mengilustrasikan poin rumit.' },
  { id: 97, text: 'Saya menolak menulis artikel bertema sains/keagamaan tanpa didampingi rujukan otoritatif di bidangnya.' },
  { id: 98, text: 'Bagi saya, proses riset menghabiskan 70% waktu, sedangkan proses mengetik hanyalah sisa 30%-nya.' },
  { id: 99, text: 'Saya berkomitmen menyajikan catatan kaki (footnote) atau daftar pustaka jika format tulisan memintanya.' },
  { id: 100, text: 'Saya percaya bahwa tulisan yang berbobot lahir dari kedalaman membaca dan kejernihan berpikir.' }
])

// 1. Ubah struktur state answers
const answers = ref<Record<number, { choice: string, reason: string }>>({})

// Inisialisasi state jawaban
questions.value.forEach(q => {
  answers.value[q.id] = { choice: '', reason: '' }
})

// Opsi pilihan yang tersedia
const options = ['Sangat Setuju', 'Setuju', 'Tidak Setuju', 'Sangat Tidak Setuju']

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

// 3. Validasi mengecek kategori yang sedang aktif
const isCategoryValid = computed(() => {
  return filteredQuestions.value.every(q => 
    answers.value[q.id].choice !== '' && 
    answers.value[q.id].reason.trim() !== ''
  )
})

// 4. Update fungsi kalkulasi progress (sesuaikan rentang Penulis)
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

// 5. Fungsi pengiriman ke WA
const sendToWhatsApp = () => {
  if (!isCategoryValid.value) return

  const activeCategory = categories.find(c => c.id === activeTab.value)
  let waText = `*Laporan Kelayakan Penulis - Kategori: ${activeCategory?.name}*\n\n`

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
  <Head title="Pendaftaran Penulis Kalam" />

  <div v-if="!isSteppingToQuiz" class="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xl m-3">
    <h1 class="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-500 mb-4">Uji Kelayakan Penulis Kalam</h1>
    <p class="text-stone-600 dark:text-stone-400 text-sm leading-relaxed mb-6">
      Bergabunglah sebagai kontributor literasi. Pastikan Anda memenuhi standar komitmen, integritas jurnalistik, dan regulasi media melalui <span class="text-stone-800 dark:text-stone-200 font-semibold">100 kriteria uji mandiri</span>.
    </p>
    <button 
      @click="isSteppingToQuiz = true"
      class="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white dark:text-stone-950 font-bold py-3 px-6 rounded-xl transition-colors cursor-pointer"
    >
      Daftar Sekarang & Mulai Uji
    </button>
  </div>

  <form v-else class="bg-white dark:bg-stone-900 flex flex-col overflow-hidden m-3 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
    
    <div class="p-6 border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 sticky top-0 backdrop-blur z-20">
      <h2 class="text-lg font-bold text-amber-600 dark:text-amber-500 mb-4">Uji Kelayakan Komunitas Kontributor</h2>
      
      <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-2 px-2">
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
        <div class="text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-semibold">
          <span class="font-mono text-xs text-amber-600 dark:text-amber-500 mr-1">[{{ q.id }}]</span>
          {{ q.text }}
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-6 px-1">
            <label 
              v-for="opt in options" 
              :key="opt" 
              class="cursor-pointer flex items-center justify-center"
              :title="opt"
            >
              <input
                type="radio"
                :name="'writer-q-' + q.id"
                :value="opt"
                v-model="answers[q.id].choice"
                class="w-5 h-5 bg-white border-stone-300 dark:border-stone-700 dark:bg-stone-800 text-amber-500 focus:ring-amber-500/30 cursor-pointer transition-all hover:scale-110"
              />
            </label>
          </div>
          
          <div 
            class="text-sm font-semibold mt-1" 
            :class="answers[q.id].choice ? 'text-amber-600 dark:text-amber-500' : 'text-stone-400 dark:text-stone-500'"
          >
            {{ answers[q.id].choice || 'Pilih jawaban' }}
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