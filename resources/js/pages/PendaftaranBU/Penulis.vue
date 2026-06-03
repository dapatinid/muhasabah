<script setup lang="ts">
import { ref, computed } from 'vue'
import { Head, Link } from '@inertiajs/vue3'
import AppLayout from '@/layouts/AppLayout.vue'

// State untuk melacak apakah user sudah menekan tombol "Daftar Sekarang"
const isSteppingToQuiz = ref(false)

// Struktur data pertanyaan
interface Question {
  id: number
  text: string
}

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
  { id: 100, text: 'Saya percaya bahwa tulisan yang berbobot lahir dari kedalaman membaca dan kejernihan berpikir.' } // diubah ID 100 secara urutan di loop nanti
])

// Normalisasi ID agar urut 1 sampai 100 pas
questions.value.forEach((q, idx) => {
  q.id = idx + 1
})

// Pilihan jawaban (Opsi)
const options = [
    'Setuju Sekali',
    'Setuju',
    'Kurang Setuju',
    'Kurang Setuju Sekali',
]

// State untuk menyimpan jawaban user (pilihan ganda dan penjelasan)
const answers = ref<Record<number, { option: string; explanation: string }>>({})

// Inisialisasi object jawaban kosong untuk setiap pertanyaan
questions.value.forEach(q => {
  answers.value[q.id] = { option: '', explanation: '' }
})

// Validasi apakah semua pertanyaan (opsi & penjelasan) sudah diisi
const isFormValid = computed(() => {
  return questions.value.every(q => {
    const ans = answers.value[q.id]
    return ans && ans.option !== '' && ans.explanation.trim() !== ''
  })
})

// Fungsi untuk generate teks dan redirect ke WhatsApp
const handleSendToWhatsApp = () => {
  const phoneNumber = '6285950540055'
  
  let lines = [
    `*PENDAFTARAN PENULIS KALAM*`,
    `=========================`,
    ``
  ]

  questions.value.forEach((q, index) => {
    const ans = answers.value[q.id]
    lines.push(`*${index + 1}. ${q.text}*`)
    lines.push(`👉 *Jawaban:* ${ans.option}`)
    lines.push(`✍️ *Penjelasan:* ${ans.explanation}`)
    lines.push(`-------------------------`)
    lines.push(``)
  })

  const messageString = lines.join('\n')
  const urlEncodedMessage = encodeURIComponent(messageString)
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${urlEncodedMessage}`

  window.open(whatsappUrl, '_blank')
}
</script>

<template>
  <Head title="Pendaftaran Penulis" />

    <div class="max-w-2xl mx-auto mt-10 p-6 bg-stone-900 border border-stone-800 rounded-3xl shadow-xl text-stone-100 transition-all duration-300">
      
      <div v-if="!isSteppingToQuiz" class="text-center max-w-md mx-auto py-4">
        <div class="text-4xl mb-4">✍️</div>
        <h2 class="text-xl font-bold text-stone-100 mb-2">Akses Halaman Kalam Terkunci</h2>
        <p class="text-sm text-stone-400 mb-6 leading-relaxed">
          Untuk mengakses halaman manajemen Kalam (artikel/kalam), Anda harus mendaftar dan disetujui sebagai **Penulis** terlebih dahulu.
        </p>
        
        <button 
          @click="isSteppingToQuiz = true"
          class="block w-full text-center bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold py-3 px-4 rounded-xl text-sm transition-colors cursor-pointer"
        >
          Daftar Sekarang (Mulai Kuesioner)
        </button>
        
        <Link href="/dashboard" class="block text-xs text-stone-500 hover:text-stone-300 mt-4 underline">
          Kembali ke Dashboard
        </Link>
      </div>

      <div v-else class="space-y-8 animate-fade-in">
        <div class="border-b border-stone-800 pb-4 sticky top-0 bg-stone-900/95 backdrop-blur-md z-10 py-2 flex justify-between items-center">
          <div>
            <h2 class="text-lg font-bold text-amber-500">Kuesioner Kelayakan Penulis</h2>
            <p class="text-[11px] text-stone-400 mt-0.5">Jawab seluruh pertanyaan (100 nomor) untuk membuka tombol kirim.</p>
          </div>
          <div class="text-xs font-bold text-amber-400 bg-stone-950 px-3 py-1.5 rounded-full border border-stone-800">
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
              <span class="text-[11px] font-medium text-stone-500 block">Penjelasan Alasan:</span>
              <textarea
                v-model="answers[question.id].explanation"
                rows="2"
                placeholder="Tuliskan argumen atau penjelasan Anda di sini..."
                class="w-full text-xs p-3 rounded-xl bg-stone-900 border border-stone-800 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-stone-200 placeholder-stone-600 outline-none resize-none"
              ></textarea>
            </div>
          </div>

          <div class="pt-4 border-t border-stone-800 flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-stone-900/90 backdrop-blur py-4">
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
                ? 'bg-amber-500 hover:bg-amber-600 text-stone-950' 
                : 'bg-stone-800 text-stone-600 cursor-not-allowed'"
            >
              <span>💬 Kirim 100 Jawaban ke WhatsApp</span>
            </button>
          </div>
          <p v-if="!isFormValid" class="text-center text-[11px] text-stone-500">
            * Seluruh 100 pertanyaan beserta alasan wajib diisi lengkap untuk mengaktifkan tombol kirim.
          </p>
        </form>
      </div>

    </div>
</template>