<script setup lang="ts">
import { ref, computed } from 'vue'
import { Head, Link } from '@inertiajs/vue3'

// State untuk melacak apakah user sudah menekan tombol "Daftar Sekarang"
const isSteppingToQuiz = ref(false)

// State untuk melacak tab/kategori aktif
const activeTab = ref(1)

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Pendaftaran Relawan / Donatur',
                href: '/pendaftaran/relawan-donatur',
            },
        ],
    },
});

// Struktur data pertanyaan
interface Question {
  id: number
  text: string
}

// Daftar kategori kelayakan relawan/donatur
const categories = [
  { id: 1, name: 'Empati & Pemahaman Misi', range: '1-20' },
  { id: 2, name: 'Komitmen Waktu & Lapangan (Relawan)', range: '21-40' },
  { id: 3, name: 'Kapasitas & Konsistensi (Donatur)', range: '41-60' },
  { id: 4, name: 'Kolaborasi & Etika Sosial', range: '61-80' },
  { id: 5, name: 'Keberlanjutan & Dampak Sosial', range: '81-100' }
]

// 100 Pertanyaan Kelayakan Relawan & Donatur
const questions = ref<Question[]>([
  // KATEGORI 1: EMPATI & PEMAHAMAN MISI SOSIAL (1-20)
  { id: 1, text: 'Saya percaya bahwa membantu sesama adalah tanggung jawab moral yang harus dilakukan tanpa pamrih.' },
  { id: 2, text: 'Saya mampu membedakan dengan jelas peran saya saat memberikan tenaga (relawan) dan memberikan materi (donatur).' },
  { id: 3, text: 'Melihat ketimpangan sosial di masyarakat memotivasi saya untuk mengambil tindakan nyata.' },
  { id: 4, text: 'Saya bersedia menekan ego pribadi demi mencapai tujuan bersama dalam sebuah misi kemanusiaan.' },
  { id: 5, text: 'Saya tidak mengharapkan pujian, validasi, atau eksposur media saat melakukan kegiatan amal.' },
  { id: 6, text: 'Saya paham bahwa memberikan bantuan bukan berarti merendahkan martabat penerima manfaat.' },
  { id: 7, text: 'Saya bersedia mengutamakan kebutuhan mendesak di lapangan dibandingkan asumsi pribadi tentang apa yang mereka butuhkan.' },
  { id: 8, text: 'Saya sadar bahwa bantuan fisik (tenaga) sama berharganya dengan bantuan finansial (materi).' },
  { id: 9, text: 'Saya memiliki empati yang tinggi saat mendengarkan keluh kesah masyarakat marjinal.' },
  { id: 10, text: 'Saya meyakini bahwa sekecil apapun kontribusi saya, akan membawa perubahan bagi yang membutuhkan.' },
  { id: 11, text: 'Saya siap menghadapi situasi emosional di lapangan tanpa kehilangan fokus pada solusi.' },
  { id: 12, text: 'Bagi saya, kegiatan sosial adalah jalan untuk bertumbuh dan belajar dari ketangguhan orang lain.' },
  { id: 13, text: 'Saya bisa menempatkan diri dan bersikap adaptif ketika berhadapan dengan berbagai lapisan masyarakat.' },
  { id: 14, text: 'Saya memahami bahwa tidak semua masalah sosial bisa diselesaikan secara instan.' },
  { id: 15, text: 'Saya terbuka terhadap kritik jika pendekatan sosial yang saya lakukan dinilai kurang efektif oleh warga lokal.' },
  { id: 16, text: 'Saya merasa terpanggil untuk ikut serta dalam gerakan kolektif dibandingkan hanya bergerak sendirian.' },
  { id: 17, text: 'Saya bersedia menyisihkan waktu istirahat saya di akhir pekan demi misi kemanusiaan.' },
  { id: 18, text: 'Saya sadar bahwa kerelawanan dan donasi membutuhkan komitmen jangka panjang, bukan sekadar tren sesaat.' },
  { id: 19, text: 'Saya dapat menjaga kerahasiaan identitas penerima manfaat jika hal tersebut menyangkut privasi dan martabat mereka.' },
  { id: 20, text: 'Motivasi utama saya bergabung adalah untuk memberikan dampak, bukan untuk mengisi portofolio semata.' },

  // KATEGORI 2: KOMITMEN WAKTU, TENAGA & LAPANGAN - FOKUS RELAWAN (21-40)
  { id: 21, text: 'Saya siap diterjunkan ke lokasi yang minim fasilitas umum atau berada di pelosok daerah.' },
  { id: 22, text: 'Saya bersedia mengelola acara komunitas atau bertindak sebagai fasilitator di lapangan.' },
  { id: 23, text: 'Saya memiliki kemampuan untuk berkoordinasi dalam tim saat berada di bawah tekanan atau kondisi darurat.' },
  { id: 24, text: 'Saya tidak keberatan melakukan pekerjaan fisik kasar (seperti mengangkut barang atau merakit fasilitas) jika dibutuhkan.' },
  { id: 25, text: 'Saya siap mengedukasi masyarakat terkait literasi, manajemen keuangan, atau keterampilan dasar lainnya.' },
  { id: 26, text: 'Saya bersedia mengikuti orientasi atau pelatihan pembekalan kerelawanan sebelum turun ke lapangan.' },
  { id: 27, text: 'Saya bisa berkomunikasi dengan ramah dan sopan kepada warga lokal menggunakan bahasa yang mudah dipahami.' },
  { id: 28, text: 'Jika terjadi perubahan rencana mendadak di lapangan, saya bisa tetap tenang dan mencari jalan keluar.' },
  { id: 29, text: 'Saya memiliki inisiatif untuk mencari tugas yang bisa dikerjakan saat anggota tim lain sedang sibuk.' },
  { id: 30, text: 'Saya menjaga kesehatan fisik dan mental agar tidak menyusahkan tim saat berada di lokasi pengabdian.' },
  { id: 31, text: 'Saya siap membantu dokumentasi, pencatatan data warga, atau urusan administratif di lapangan.' },
  { id: 32, text: 'Saya bersedia mendengarkan arahan dari koordinator lapangan tanpa banyak berdebat.' },
  { id: 33, text: 'Saya bisa menghargai adat istiadat dan kearifan lokal tempat saya menjadi relawan.' },
  { id: 34, text: 'Saya tidak akan menyebarkan foto kondisi memprihatinkan warga ke media sosial pribadi tanpa izin.' },
  { id: 35, text: 'Saya bersedia menjadi narahubung antara komunitas dengan tokoh masyarakat setempat.' },
  { id: 36, text: 'Saya menganggap kelelahan fisik sebagai bagian wajar dari perjuangan kemanusiaan.' },
  { id: 37, text: 'Saya mampu mengorganisir massa atau warga agar pembagian logistik berjalan tertib.' },
  { id: 38, text: 'Saya memiliki keterampilan khusus (medis, pertukangan, IT, desain) yang siap saya dedikasikan secara gratis.' },
  { id: 39, text: 'Saya siap mengalokasikan minimal 1-2 hari dalam sebulan untuk turun langsung ke lokasi binaan.' },
  { id: 40, text: 'Saya mengutamakan keselamatan tim di atas ambisi penyelesaian target pekerjaan di lapangan.' },

  // KATEGORI 3: KAPASITAS BERBAGI & DUKUNGAN FINANSIAL - FOKUS DONATUR (41-60)
  { id: 41, text: 'Saya memiliki penghasilan yang cukup dan berniat menyisihkan sebagian secara rutin untuk donasi.' },
  { id: 42, text: 'Saya menyadari bahwa donasi operasional sama pentingnya dengan donasi program langsung.' },
  { id: 43, text: 'Saya tidak akan mendikte atau memaksakan kehendak kepada panitia tentang bagaimana dana saya harus dieksekusi.' },
  { id: 44, text: 'Saya membutuhkan laporan pertanggungjawaban (LPJ) keuangan yang transparan dan dapat diakses dengan mudah.' },
  { id: 45, text: 'Saya siap berkomitmen menjadi donatur tetap (misal: donasi bulanan) untuk program yang berkelanjutan.' },
  { id: 46, text: 'Saya lebih suka mendanai program pemberdayaan masyarakat ketimbang hanya bantuan karitatif/konsumtif sesaat.' },
  { id: 47, text: 'Saya mempercayakan sepenuhnya pengelolaan dana donasi kepada lembaga atau komunitas yang kredibel.' },
  { id: 48, text: 'Saya merasa nyaman dan percaya berdonasi melalui platform digital atau crowdfunding yang dikelola secara profesional.' },
  { id: 49, text: 'Saya bersedia mengajak keluarga atau rekan kerja untuk ikut serta berdonasi pada program yang saya yakini baik.' },
  { id: 50, text: 'Saya memahami bahwa terkadang akan ada biaya administrasi dari pihak bank/platform yang memotong nominal donasi.' },
  { id: 51, text: 'Bagi saya, transparansi arus kas (cash flow) sebuah lembaga sosial adalah harga mati.' },
  { id: 52, text: 'Saya bersedia membantu mendanai penyediaan alat atau infrastruktur kerja bagi para relawan di lapangan.' },
  { id: 53, text: 'Jika terjadi kelebihan dana (over-funded), saya setuju dana tersebut dialihkan ke program sosial lain yang mendesak.' },
  { id: 54, text: 'Saya ikhlas jika nama saya disamarkan (hamba Allah/anonim) dalam daftar publikasi donatur.' },
  { id: 55, text: 'Saya memahami risiko bahwa program lapangan bisa tertunda karena faktor cuaca atau birokrasi, dan dana saya akan diendapkan sementara.' },
  { id: 56, text: 'Saya mengutamakan kecepatan dalam mentransfer dana ketika ada panggilan darurat kemanusiaan (bencana alam).' },
  { id: 57, text: 'Saya bersedia memberikan donasi dalam bentuk barang bernilai (in-kind) selain dari uang tunai.' },
  { id: 58, text: 'Saya tidak mengharapkan keuntungan finansial atau bisnis apapun dari donasi yang saya salurkan.' },
  { id: 59, text: 'Saya siap mendukung kegiatan urun dana (fundraising) dengan cara membagikan tautan kampanye ke media sosial saya.' },
  { id: 60, text: 'Mendukung inisiatif lokal untuk mandiri secara ekonomi adalah alasan utama saya menyumbang.' },

  // KATEGORI 4: KOLABORASI, ETIKA, & TRANSPARANSI (61-80)
  { id: 61, text: 'Saya siap berkolaborasi lintas komunitas, termasuk dengan kelompok hobi atau asosiasi lokal, untuk aksi sosial.' },
  { id: 62, text: 'Saya menghindari fanatisme golongan dan bersedia bekerja sama dengan relawan dari berbagai latar belakang.' },
  { id: 63, text: 'Saya tidak akan membawa atribut politik atau kampanye partai saat menjalankan misi kemanusiaan.' },
  { id: 64, text: 'Jika saya menemukan penyelewengan dana atau logistik di lapangan, saya akan melaporkannya secara internal dan prosedural.' },
  { id: 65, text: 'Saya menghormati batasan wewenang antara relawan teknis, koordinator lapangan, dan manajemen pusat.' },
  { id: 66, text: 'Saya akan menjaga nama baik komunitas/lembaga baik di dunia nyata maupun di ruang digital.' },
  { id: 67, text: 'Saya tidak akan menggunakan database penerima bantuan atau data sesama relawan untuk kepentingan bisnis pribadi.' },
  { id: 68, text: 'Saya menyadari bahwa komunikasi yang jujur dan terbuka adalah kunci keberhasilan tim kerelawanan.' },
  { id: 69, text: 'Saya menghindari membuat janji-janji manis di luar kapasitas program kepada warga yang dibantu.' },
  { id: 70, text: 'Jika saya menjadi donatur, saya akan berkomunikasi dengan admin secara sopan saat menanyakan progres program.' },
  { id: 71, text: 'Saya bersedia mematuhi Standard Operating Procedure (SOP) yang ditetapkan oleh penyelenggara program.' },
  { id: 72, text: 'Saya siap ditegur jika tindakan saya di lapangan dianggap melanggar norma sosial yang berlaku setempat.' },
  { id: 73, text: 'Saya setuju bahwa laporan dokumentasi yang jujur tanpa rekayasa adalah bentuk pertanggungjawaban tertinggi kepada donatur.' },
  { id: 74, text: 'Saya akan membangun ukhuwah dan relasi yang sehat dengan sesama penggiat sosial.' },
  { id: 75, text: 'Saya menolak keras praktik suap, pungli, atau pemotongan hak penerima bantuan di lapangan.' },
  { id: 76, text: 'Saya bersedia memberikan feedback dan evaluasi konstruktif setelah sebuah program sosial selesai dilaksanakan.' },
  { id: 77, text: 'Saya tidak akan baper (bawa perasaan) jika ide atau usulan program saya belum disetujui oleh tim.' },
  { id: 78, text: 'Saya bersedia menyelesaikan konflik internal tim dengan cara musyawarah dan kekeluargaan.' },
  { id: 79, text: 'Saya memandang warga yang dibantu sebagai subjek yang berdaya, bukan sekadar objek penderitaan untuk dieksploitasi.' },
  { id: 80, text: 'Saya berkomitmen untuk mendahulukan kejujuran dan integritas di setiap tahap proses penyaluran bantuan.' },

  // KATEGORI 5: VISI KEBERLANJUTAN & DAMPAK SOSIAL (81-100)
  { id: 81, text: 'Saya sangat tertarik pada inisiatif sosial yang memberikan dampak jangka panjang, bukan sekadar hit-and-run.' },
  { id: 82, text: 'Saya antusias mendukung pengadaan infrastruktur dasar (seperti saluran air bersih, fasilitas MCK) untuk daerah pelosok/kekeringan.' },
  { id: 83, text: 'Saya percaya bahwa teknologi digital sangat penting untuk mendukung pemerataan dan efisiensi penyaluran bantuan.' },
  { id: 84, text: 'Saya mendukung program yang mengedukasi warga agar suatu saat mereka bisa mandiri dan tidak terus bergantung pada donasi.' },
  { id: 85, text: 'Bagi saya, keberhasilan program bukan diukur dari seberapa banyak dana terkumpul, melainkan seberapa besar perubahan hidup yang terjadi.' },
  { id: 86, text: 'Saya setuju bahwa perawatan/maintenance hasil pembangunan sosial sama pentingnya dengan proses pembangunannya.' },
  { id: 87, text: 'Saya bersemangat untuk menyumbangkan ide terkait pengembangan sistem informasi yang membantu pencatatan sosial.' },
  { id: 88, text: 'Saya siap terlibat dalam pemberdayaan UMKM atau warung-warung lokal di daerah binaan untuk meningkatkan ekonomi sekitar.' },
  { id: 89, text: 'Saya menyadari pentingnya kajian atau survei kelayakan yang mendalam sebelum sebuah program sosial dieksekusi.' },
  { id: 90, text: 'Saya mendukung penuh inovasi sosial yang berupaya menyelesaikan akar permasalahan, bukan sekadar mengobati gejala.' },
  { id: 91, text: 'Saya akan terus mengikuti perkembangan isu-isu kemanusiaan dan krisis sosial agar tetap relevan dalam membantu.' },
  { id: 92, text: 'Saya bermimpi suatu saat penerima donasi (mustahik) dapat bertransformasi menjadi pemberi donasi (muzakki).' },
  { id: 93, text: 'Saya bersedia mendukung pembentukan kelompok swadaya masyarakat agar mereka bisa memelihara infrastruktur yang telah didonasikan.' },
  { id: 94, text: 'Bagi saya, membangun mentalitas pantang menyerah warga lebih menantang daripada membangun fasilitas fisik.' },
  { id: 95, text: 'Saya percaya transparansi logistik dan database bantuan yang rapi akan menumbuhkan trust (kepercayaan) publik yang luar biasa.' },
  { id: 96, text: 'Saya tertarik pada program yang memfasilitasi akses pendidikan berkelanjutan bagi anak-anak putus sekolah.' },
  { id: 97, text: 'Saya memahami bahwa advokasi kebijakan publik juga merupakan bagian dari penyelesaian masalah sosial yang sistemik.' },
  { id: 98, text: 'Saya bersedia ikut serta memonitoring keberlangsungan program setelah 6 bulan atau 1 tahun berlalu.' },
  { id: 99, text: 'Saya mendukung penggunaan produk lokal dalam setiap pengadaan barang bantuan demi menggerakkan ekonomi kerakyatan.' },
  { id: 100, text: 'Saya berkomitmen untuk menjadikan semangat kerelawanan dan kedermawanan sebagai gaya hidup seumur hidup.' }
])

// 1. Inisialisasi state jawaban
const answers = ref<Record<number, { choice: string, reason: string }>>({})

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

// 3. Validasi mengecek kategori yang sedang aktif
const isCategoryValid = computed(() => {
  return filteredQuestions.value.every(q => 
    answers.value[q.id].choice !== '' && 
    answers.value[q.id].reason.trim() !== ''
  )
})

// 4. Kalkulasi progress berdasarkan rentang Relawan/Donatur
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
  let waText = `*Laporan Kelayakan Relawan/Donatur - Kategori: ${activeCategory?.name}*\n\n`

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
  <Head title="Pendaftaran Relawan / Donatur" />

  <div v-if="!isSteppingToQuiz" class="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xl m-3">
    <h1 class="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-500 mb-4">Uji Kelayakan Relawan & Donatur</h1>
    <p class="text-stone-600 dark:text-stone-400 text-sm leading-relaxed mb-6">
      Bergabunglah dalam misi kebaikan. Pastikan Anda memiliki visi yang selaras, baik sebagai penggerak lapangan maupun pendukung finansial melalui <span class="text-stone-800 dark:text-stone-200 font-semibold">100 kriteria uji mandiri</span> berikut.
    </p>
    <button 
      @click="isSteppingToQuiz = true"
      class="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white dark:text-stone-950 font-bold py-3 px-6 rounded-xl transition-colors cursor-pointer"
    >
      Mulai Uji Kelayakan
    </button>
  </div>

  <form v-else class="flex flex-col overflow-hidden">
    
    <div class="p-6 border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 sticky top-0 backdrop-blur z-20">
      <h2 class="text-lg font-bold text-amber-600 dark:text-amber-500 mb-4">Formulir Kelayakan Relawan & Donatur</h2>
      
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

        <div class="flex flex-col gap-3">
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
              <input
                type="radio"
                :name="'q-' + q.id"
                :value="opt"
                v-model="answers[q.id].choice"
                class="hidden"
              />
              
              <svg v-if="opt === 'Sangat Tidak Setuju'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 transition-transform" :class="{'scale-110': answers[q.id].choice === opt}"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              
              <svg v-else-if="opt === 'Tidak Setuju'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" :fill="answers[q.id].choice === opt ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 transition-transform" :class="{'scale-110': answers[q.id].choice === opt}"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/></svg>
              
              <svg v-else-if="opt === 'Setuju'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" :fill="answers[q.id].choice === opt ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 transition-transform" :class="{'scale-110': answers[q.id].choice === opt}"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>
              
              <svg v-else-if="opt === 'Sangat Setuju'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" :fill="answers[q.id].choice === opt ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 transition-transform" :class="{'scale-110': answers[q.id].choice === opt}"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </label>
          </div>
          
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