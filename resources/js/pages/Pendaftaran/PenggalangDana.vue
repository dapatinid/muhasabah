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
                title: 'Pendaftaran Penggalang Dana',
                href: '/pendaftaran/penggalang-dana',
            },
        ],
    },
});

// Struktur data pertanyaan
interface Question {
  id: number
  text: string
}

// Daftar kategori pakta integritas
const categories = [
  { id: 1, name: 'Integritas Finansial & Hukum', range: '1-40' },
  { id: 2, name: 'Pelaporan & Akuntabilitas', range: '41-80' },
  { id: 3, name: 'Risiko & Sisa Dana', range: '81-120' },
  { id: 4, name: 'Alur Logistik & Pihak Ketiga', range: '121-160' },
  { id: 5, name: 'Sanksi & Komitmen Legal', range: '161-200' }
]

// 200 Pertanyaan Verifikasi Ketat Penggalang Dana (Anti-Penggelapan & Transparansi)
const questions = ref<Question[]>([
  // KATEGORI 1: INTEGRITAS FINANSIAL & DOKUMEN HUKUM (1-40)
  { id: 1, text: 'Saya bersedia mengunggah kartu identitas resmi (KTP/Paspor) yang valid dan masih berlaku.' },
  { id: 2, text: 'Saya menjamin bahwa rekening bank yang digunakan terdaftar atas nama pribadi/lembaga resmi yang cocok dengan identitas.' },
  { id: 3, text: 'Saya bersedia melampirkan Surat Keterangan Catatan Kepolisian (SKCK) jika diminta oleh tim verifikasi.' },
  { id: 4, text: 'Saya menjamin dana yang digalang tidak akan bercampur dengan rekening operasional pribadi sehari-hari.' },
  { id: 5, text: 'Saya siap memberikan akses mutasi rekening koran secara berkala kepada tim auditor internal platform.' },
  { id: 6, text: 'Saya bersedia menandatangani pakta integritas di atas meterai mengenai anti-penggelapan dana.' },
  { id: 7, text: 'Saya menjamin bahwa yayasan/lembaga saya memiliki izin resmi penggalangan uang (PUB) dari Kemensos/Dinas Sosial.' },
  { id: 8, text: 'Saya tidak sedang terlibat dalam sengketa hukum atau kasus perdata yang berkaitan dengan keuangan.' },
  { id: 9, text: 'Saya bersedia diverifikasi secara faktual melalui video call atau kunjungan lapangan ke domisili saya.' },
  { id: 10, text: 'Saya menjamin seluruh dokumen legalitas lembaga yang saya unggah adalah sah dan bukan rekayasa.' },
  { id: 11, text: 'Saya bersedia mencantumkan nomor kontak penanggung jawab cadangan yang bisa dihubungi setiap saat.' },
  { id: 12, text: 'Saya siap memberikan data NPWP pribadi atau NPWP lembaga demi kepatuhan pajak.' },
  { id: 13, text: 'Saya menjamin tidak pernah masuk dalam daftar hitam (blacklist) penggalang dana di platform lain.' },
  { id: 14, text: 'Saya bersedia memberikan surat rekomendasi dari tokoh masyarakat atau RT/RW setempat terkait kampanye ini.' },
  { id: 15, text: 'Saya menyatakan bahwa seluruh informasi mengenai profil penerima manfaat (beneficiary) adalah nyata.' },
  { id: 16, text: 'Saya bersedia denda finansial diterapkan jika ditemukan manipulasi data identitas pada profil saya.' },
  { id: 17, text: 'Saya menjamin tidak menggunakan identitas orang lain untuk mendaftar sebagai penggalang dana.' },
  { id: 18, text: 'Saya siap memperbarui masa berlaku dokumen hukum yang kedaluwarsa selama kampanye berjalan.' },
  { id: 19, text: 'Saya bersedia akun dibekukan seketika jika dokumen legalitas utama saya terindikasi palsu.' },
  { id: 20, text: 'Saya paham bahwa pemalsuan dokumen publik memiliki konsekuensi pidana penjara yang berat.' },
  { id: 21, text: 'Saya bersedia mencantumkan alamat kantor atau domisili tinggal secara mendetail dan akurat.' },
  { id: 22, text: 'Saya siap melampirkan bukti kepemilikan aset atau sewa tempat operasional lembaga kami.' },
  { id: 23, text: 'Saya menjamin struktur organisasi pengelola dana di tim kami diisi oleh orang-orang yang kompeten.' },
  { id: 24, text: 'Saya bersedia memaparkan riwayat penggalangan dana yang pernah saya lakukan sebelumnya.' },
  { id: 25, text: 'Saya bersedia jika sistem melakukan background check terhadap rekam jejak digital saya di media sosial.' },
  { id: 26, text: 'Saya memastikan tidak ada benturan kepentingan (conflict of interest) antara penggalang dan penerima manfaat.' },
  { id: 27, text: 'Saya siap melampirkan akta pendirian yayasan jika penggalangan dana mengatasnamakan institusi.' },
  { id: 28, text: 'Saya menjamin dana sumbangan tidak bersumber dari aktivitas ilegal atau pencucian uang (money laundering).' },
  { id: 29, text: 'Saya bersedia memberikan surat kuasa asli dari penerima manfaat jika saya bertindak sebagai jembatan.' },
  { id: 30, text: 'Saya berkomitmen mematuhi segala regulasi perundang-undangan tentang pengumpulan uang dan barang.' },
  { id: 31, text: 'Saya siap diperiksa oleh aparat penegak hukum jika terjadi aduan masyarakat mengenai keabsahan dokumen kami.' },
  { id: 32, text: 'Saya bersedia membatalkan penggalangan jika dokumen penerima manfaat tidak dapat diverifikasi secara fisik.' },
  { id: 33, text: 'Saya menjamin pengurus lembaga kami terbebas dari catatan kriminal pencurian uang atau penipuan.' },
  { id: 34, text: 'Saya bersedia melampirkan tagihan listrik atau air sebagai bukti validitas domisili operasional.' },
  { id: 35, text: 'Saya siap menyerahkan draf rencana anggaran biaya (RAB) yang ditandatangani oleh akuntan atau bendahara tim.' },
  { id: 36, text: 'Saya memastikan bahwa permohonan bantuan ini belum pernah diajukan dan didanai penuh oleh APBD/APHN.' },
  { id: 37, text: 'Saya bersedia memperlihatkan buku tabungan fisik asli saat proses audit mendadak oleh manajemen.' },
  { id: 38, text: 'Saya menjamin status kepemilikan rekening yayasan tidak dalam pemblokiran pihak bank.' },
  { id: 39, text: 'Saya bersedia melampirkan laporan keuangan tahunan lembaga yang telah diaudit oleh Akuntan Publik (KAP).' },
  { id: 40, text: 'Saya memahami bahwa transparansi legalitas di awal adalah benteng utama pencegahan tindak korupsi dana umat.' },

  // KATEGORI 2: SISTEM PELAPORAN & AKUNTABILITAS PUBLIK (41-80)
  { id: 41, text: 'Saya berkomitmen mengunggah laporan penggunaan dana (LPD) secara berkala setiap minggu.' },
  { id: 42, text: 'Setiap pengeluaran dana wajib disertai dengan bukti kuitansi, nota digital, atau invoice resmi.' },
  { id: 43, text: 'Saya bersedia mengambil dokumentasi foto dan video berkualitas jelas saat penyerahan bantuan dilakukan.' },
  { id: 44, text: 'Saya menolak membuat kuitansi palsu atau membesarkan nominal pengeluaran (mark-up) demi keuntungan pribadi.' },
  { id: 45, text: 'Saya siap merinci pengeluaran sekecil apa pun, termasuk biaya transfer bank atau biaya materai.' },
  { id: 46, text: 'Saya bersedia menggunakan template laporan keuangan standar yang disediakan oleh platform.' },
  { id: 47, text: 'Saya bersedia merilis laporan penyerahan bantuan secara langsung (live) via media sosial jika diminta donatur.' },
  { id: 48, text: 'Saya akan menjawab setiap pertanyaan donatur di kolom komentar laporan dalam waktu maksimal 2x24 jam.' },
  { id: 49, text: 'Saya siap menerima sanksi penundaan pencairan dana berikutnya jika laporan donasi sebelumnya belum selesai.' },
  { id: 50, text: 'Saya bersedia menyertakan testimoni bertanda tangan dari penerima manfaat sebagai bukti dana tersalurkan.' },
  { id: 51, text: 'Saya akan menuliskan narasi perkembangan (update) kondisi penerima manfaat secara berkala dan jujur.' },
  { id: 52, text: 'Saya menolak menyembunyikan sisa saldo donasi yang belum digunakan dari pandangan publik.' },
  { id: 53, text: 'Setiap nota pembelian yang buram atau tidak terbaca siap saya tukar atau mintakan salinan ulang ke toko.' },
  { id: 54, text: 'Saya bersedia mencantumkan nama toko, alamat, dan nomor telepon tempat pembelian barang logistik bantuan.' },
  { id: 55, text: 'Saya siap membuat rekapitulasi total dana masuk dan keluar dalam bentuk tabel spreadsheet publik.' },
  { id: 56, text: 'Saya bersedia laporan saya dikritik dan diaudit langsung oleh para donatur secara terbuka.' },
  { id: 57, text: 'Saya berkomitmen melaporkan kendala di lapangan yang menyebabkan penyaluran dana tertunda.' },
  { id: 58, text: 'Saya tidak akan membebankan biaya operasional tim melebihi batas persentase maksimal yang diizinkan undang-undang.' },
  { id: 59, text: 'Saya siap melampirkan manifest logistik jika penyaluran bantuan melibatkan pengiriman antarkota/pulau.' },
  { id: 60, text: 'Saya paham bahwa ketidakjelasan laporan keuangan dapat menurunkan kepercayaan publik terhadap platform.' },
  { id: 61, text: 'Saya bersedia melampirkan presensi kehadiran tim saat penyaluran donasi di lapangan.' },
  { id: 62, text: 'Saya bersedia mempublikasikan buku kas pembantu penggalangan dana ini agar bisa diunduh siapa saja.' },
  { id: 63, text: 'Saya berkomitmen mengarsipkan semua nota fisik dalam map khusus selama minimal 3 tahun sebagai bukti audit.' },
  { id: 64, text: 'Saya tidak akan menggunakan nota tulisan tangan kosong tanpa stempel resmi dari toko penyedia barang.' },
  { id: 65, text: 'Saya bersedia menyusun laporan evaluasi dampak (impact report) setelah seluruh dana selesai disalurkan.' },
  { id: 66, text: 'Saya bersedia jika sewaktu-waktu donatur melakukan sidak langsung ke lokasi penerima manfaat tanpa pemberitahuan.' },
  { id: 67, text: 'Saya siap memisahkan pelaporan dana operasional dari platform dengan donasi murni dari donatur.' },
  { id: 68, text: 'Saya akan menghindari istilah pengeluaran "Lain-lain" tanpa rincian item yang jelas dalam laporan.' },
  { id: 69, text: 'Saya bersedia mengedukasi seluruh anggota tim lapangan agar tertib mengumpulkan bukti transaksi.' },
  { id: 70, text: 'Saya siap mengembalikan dana donasi secara utuh jika terbukti gagal menyusun laporan penggunaan dana.' },
  { id: 71, text: 'Saya memastikan nominal saldo di sistem platform sama persis dengan kondisi riil di rekening penampung.' },
  { id: 72, text: 'Saya bersedia membeberkan slip gaji atau insentif relawan lapangan jika anggarannya diambil dari donasi.' },
  { id: 73, text: 'Saya menolak menerima tips, komisi, atau kickback dari vendor penyedia barang bantuan.' },
  { id: 74, text: 'Saya siap mempublikasikan dokumentasi serah terima komparatif (kondisi sebelum vs sesudah bantuan).' },
  { id: 75, text: 'Saya bersedia jika laporan keuangan saya ditinjau oleh komunitas relawan independen.' },
  { id: 76, text: 'Saya berkomitmen menggunakan pembukuan berpasangan (double-entry) untuk pencatatan skala besar.' },
  { id: 77, text: 'Saya tidak akan menunda pembuatan laporan hanya karena alasan sibuk atau lelah.' },
  { id: 78, text: 'Saya bersedia melampirkan tautan video drive mentah penyaluran sebagai bukti penguat laporan.' },
  { id: 79, text: 'Saya mengerti bahwa akuntanbilitas publik bersifat mutlak dan tidak bisa dinegosiasikan.' },
  { id: 80, text: 'Saya bangga menyajikan laporan keuangan yang rapi, transparan, dan dapat dipertanggungjawabkan.' },

  // KATEGORI 3: MANAJEMEN RISIKO & PENANGANAAN SISA DANA (81-120)
  { id: 81, text: 'Jika penerima manfaat meninggal dunia atau target terpenuhi, sisa dana wajib dialokasikan sesuai aturan platform.' },
  { id: 82, text: 'Saya bersedia merumuskan rencana darurat (mitigasi) jika penggalangan dana tidak mencapai target minimum.' },
  { id: 83, text: 'Saya tidak akan menggunakan sisa dana donasi untuk keperluan pribadi, sekecil apa pun nominalnya.' },
  { id: 84, text: 'Saya siap melakukan musyawarah dan voting terbuka bersama donatur jika terjadi perubahan urgensi alokasi dana.' },
  { id: 85, text: 'Saya bersedia mengalihkan sisa dana ke kampanye sosial lain yang serupa jika disetujui pihak redaksi.' },
  { id: 86, text: 'Saya siap menanggung kerugian finansial akibat kelalaian operasional tim saya sendiri tanpa menyentuh uang donasi.' },
  { id: 87, text: 'Saya berkomitmen menghentikan pencairan dana secara mandiri jika tujuan utama penggalangan telah selesai.' },
  { id: 88, text: 'Saya bersedia sisa dana yang mengendap dikelola langsung oleh lembaga zakat/sosial mitra platform.' },
  { id: 89, text: 'Saya akan mengomunikasikan risiko inflasi atau kenaikan harga barang kepada donatur sebelum membeli logistik.' },
  { id: 90, text: 'Saya siap mengembalikan dana kepada donatur (refund) jika proyek sosial dibatalkan secara sepihak oleh tim kami.' },
  { id: 91, text: 'Saya tidak akan bersikap egois mempertahankan sisa dana yang sudah tidak relevan dengan kebutuhan penerima manfaat.' },
  { id: 92, text: 'Saya bersedia jika manajemen menahan sebagian dana sebagai jaminan hingga laporan akhir disetujui.' },
  { id: 93, text: 'Saya akan melaporkan keuntungan bunga bank atau selisih kurs mata uang asing dari rekening donasi.' },
  { id: 94, text: 'Saya siap menghadapi pembatalan sepihak dari vendor tanpa mengorbankan anggaran donasi yang ada.' },
  { id: 95, text: 'Saya bersedia menyusun skala prioritas kebutuhan jika dana yang terkumpul hanya mencapai separuh target.' },
  { id: 96, text: 'Saya berkomitmen menghindarkan uang donasi dari instrumen investasi berisiko tinggi (saham, kripto, dll).' },
  { id: 97, text: 'Saya siap membuat surat pernyataan pengalihan hak kelola dana jika saya berhalangan tetap.' },
  { id: 98, text: 'Saya bersedia mematuhi aturan pembatasan nominal pencairan harian demi keamanan dana.' },
  { id: 99, text: 'Saya menjamin sisa dana tidak mengalir ke kas pribadi pengurus yayasan di akhir tahun buku.' },
  { id: 100, text: 'Saya mengerti bahwa mengelola dana publik berarti mengelola amanah dunia dan akhirat.' },
  { id: 101, text: 'Saya siap memitigasi risiko keamanan fisik saat membawa uang tunai donasi di area bencana.' },
  { id: 102, text: 'Saya bersedia jika platform melakukan audit forensik digital terhadap alur mutasi saldo akun saya.' },
  { id: 103, text: 'Saya menolak menyimpan uang donasi tunai dalam jumlah besar di rumah tanpa brankas pengaman.' },
  { id: 104, text: 'Saya bersedia memberikan laporan berkala mengenai kondisi penyusutan nilai barang bantuan yang disimpan di gudang.' },
  { id: 105, text: 'Saya siap bertanggung jawab jika barang bantuan rusak akibat salah manajemen penyimpanan.' },
  { id: 106, text: 'Saya akan menghentikan publikasi ajakan donasi di media sosial luar jika target utama di platform sudah terpenuhi.' },
  { id: 107, text: 'Saya bersedia mengasuransikan barang bantuan bernilai tinggi yang dikirim ke daerah pelosok.' },
  { id: 108, text: 'Saya siap berkoordinasi dengan Badan Penanggulangan Bencana Daerah (BPBD) untuk efisiensi distribusi.' },
  { id: 109, text: 'Saya menolak memaksakan penyaluran bantuan yang justru membahayakan keselamatan tim atau penerima manfaat.' },
  { id: 110, text: 'Saya bersedia membuat addendum RAB jika terjadi perubahan situasi makro ekonomi yang ekstrem.' },
  { id: 111, text: 'Saya akan mencatat barang retur (dikembalikan) dari vendor dan melaporkan nilai pengembalian uangnya.' },
  { id: 112, text: 'Saya siap mengaudit kinerja keuangan sub-kontraktor lapangan yang kami tunjuk.' },
  { id: 113, text: 'Saya bersedia sisa dana disalurkan untuk program pemberdayaan jangka panjang penerima manfaat.' },
  { id: 114, text: 'Saya tidak akan menyembunyikan rincian kerugian akibat barang cacat/rusak dalam perjalanan.' },
  { id: 115, text: 'Saya siap diverifikasi ulang jika nominal penggalangan dana mendadak melonjak naik di luar perkiraan.' },
  { id: 116, text: 'Saya berkomitmen mengalokasikan biaya tak terduga maksimal sebesar batas toleransi platform.' },
  { id: 117, text: 'Saya bersedia menandatangani perjanjian pengalihan sisa dana otomatis jika kampanye pasif dalam 90 hari.' },
  { id: 118, text: 'Saya memastikan tidak mengambil keuntungan sepeser pun dari skema diskon grosir barang logistik.' },
  { id: 119, text: 'Saya siap menerima pemotongan biaya administrasi platform sesuai kesepakatan awal.' },
  { id: 120, text: 'Saya percaya manajemen risiko yang kuat adalah cerminan profesionalitas penggalang dana.' },

  // KATEGORI 4: TRANSPARANSI ALUR LOGISTIK & PIHAK KETIGA (121-160)
  { id: 121, text: 'Saya bersedia memaparkan alur distribusi logistik secara mendetail dari gudang hingga ke tangan penerima.' },
  { id: 122, text: 'Setiap pihak ketiga (vendor/supplier) yang ditunjuk harus melalui proses seleksi harga yang transparan.' },
  { id: 123, text: 'Saya siap melampirkan minimal dua perbandingan harga (pembanding vendor) untuk pengadaan barang skala besar.' },
  { id: 124, text: 'Saya tidak akan menunjuk vendor yang dimiliki oleh kerabat dekat atau keluarga demi menghindari nepotisme.' },
  { id: 125, text: 'Saya bersedia mengunggah surat jalan (delivery order) resmi dari penyedia armada logistik.' },
  { id: 126, text: 'Saya siap memverifikasi kuantitas dan kualitas barang bantuan bersama perwakilan donatur atau saksi setempat.' },
  { id: 127, text: 'Saya berkomitmen menolak segala bentuk nota kosong yang ditawarkan oleh pemilik toko grosir.' },
  { id: 128, text: 'Saya bersedia mencantumkan dokumentasi foto timbangan atau hitungan fisik barang saat tiba di lokasi.' },
  { id: 129, text: 'Saya siap mempublikasikan kontrak kerja sama tertulis dengan pihak rumah sakit atau kontraktor pembangunan.' },
  { id: 130, text: 'Saya menjamin harga beli barang bantuan setara atau lebih murah dari harga pasar normal.' },
  { id: 131, text: 'Saya bersedia membeberkan komisi ekspedisi pengiriman jika anggaran donasi digunakan untuk distribusi.' },
  { id: 132, text: 'Saya siap menyertakan berita acara serah terima (BAST) barang yang sah dan ditandatangani kedua belah pihak.' },
  { id: 133, text: 'Saya menolak memotong hak penerima manfaat demi memberikan komisi/bonus kepada tim lapangan.' },
  { id: 134, text: 'Saya bersedia jika platform berinteraksi langsung dengan vendor kami untuk mencocokkan nilai transaksi.' },
  { id: 135, text: 'Saya siap melampirkan foto label kedaluwarsa pada barang bantuan berupa makanan atau obat-obatan.' },
  { id: 136, text: 'Saya menjamin proses pengemasan bantuan dilakukan secara higienis dan layak konsumsi/pakai.' },
  { id: 137, text: 'Saya bersedia memaparkan rincian biaya sewa gudang sementara jika diperlukan dalam operasional.' },
  { id: 138, text: 'Saya siap mengganti vendor di tengah jalan jika ditemukan indikasi kecurangan harga sepihak.' },
  { id: 139, text: 'Saya berkomitmen mencantumkan spesifikasi teknis barang (merk, tipe, ukuran) secara transparan pada laporan.' },
  { id: 140, text: 'Saya memahami bahwa kebocoran dana paling rawan terjadi pada sektor pengadaan barang pihak ketiga.' },
  { id: 141, text: 'Saya bersedia mempublikasikan denah lokasi titik distribusi bantuan agar mudah dipantau publik.' },
  { id: 142, text: 'Saya siap menyertakan titik koordinat GPS lokasi penyaluran pada dokumentasi foto lapangan.' },
  { id: 143, text: 'Saya menjamin tidak ada pungutan liar (pungli) yang ditoleransi dalam jalur distribusi kami.' },
  { id: 144, text: 'Saya bersedia melampirkan daftar nama relawan yang bertugas mengemas barang logistik.' },
  { id: 145, text: 'Saya siap memberikan klarifikasi jika donatur menemukan barang bantuan dengan kualitas di bawah spesifikasi laporan.' },
  { id: 146, text: 'Saya berkomitmen memprioritaskan pembelian barang dari UMKM lokal di sekitar lokasi penerima manfaat.' },
  { id: 147, text: 'Saya bersedia melaporkan jumlah barang sisa (buffer stock) yang belum tersalurkan di gudang lapangan.' },
  { id: 148, text: 'Saya siap menyusun jadwal distribusi harian yang dapat diakses oleh tim pengawas internal.' },
  { id: 149, text: 'Saya menolak menggunakan jasa calo atau perantara ilegal dalam pengurusan izin distribusi.' },
  { id: 150, text: 'Saya bersedia mengunggah rekaman video unboxing muatan logistik saat pertama kali tiba di posko.' },
  { id: 151, text: 'Saya memastikan semua kendaraan operasional bantuan memiliki dokumen perjalanan yang legal.' },
  { id: 152, text: 'Saya siap melampirkan bukti pembayaran upah buruh panggul atau angkut jika menggunakan dana donasi.' },
  { id: 153, text: 'Saya bersedia diverifikasi silang dengan kepala desa atau tokoh adat tempat bantuan diturunkan.' },
  { id: 154, text: 'Saya menolak menimbun barang bantuan di gudang melebihi batas waktu kedaluwarsa.' },
  { id: 155, text: 'Saya siap memberikan akses inspeksi gudang logistik kepada tim audit platform kapan saja.' },
  { id: 156, text: 'Saya berkomitmen menyertakan kuitansi bensin dan tol yang valid untuk akuntabilitas transportasi.' },
  { id: 157, text: 'Saya memastikan barang bantuan tidak diperjualbelikan kembali oleh oknum internal tim kami.' },
  { id: 158, text: 'Saya siap mempublikasikan testimoni acak dari warga sekitar mengenai ketepatan sasaran logistik.' },
  { id: 159, text: 'Saya bersedia membatalkan kerja sama dengan vendor yang menolak mengeluarkan nota resmi versteper.' },
  { id: 160, text: 'Saya percaya rantai pasok yang bersih adalah bukti keandalan tata kelola penggalang dana.' },

  // KATEGORI 5: KOMITMEN MORAL, ETIKA, & SANKSI HUKUM (161-200)
  { id: 161, text: 'Saya bersedia diproses secara hukum pidana jika terbukti menyalahgunakan dana donasi untuk kepentingan pribadi.' },
  { id: 162, text: 'Saya setuju nama dan foto saya dipublikasikan di halaman hitam (blacklist) jika melakukan penggelapan.' },
  { id: 163, text: 'Saya berkomitmen menjaga privasi martabat penerima manfaat dengan tidak mengeksploitasi kesedihan secara berlebihan.' },
  { id: 164, text: 'Saya menolak mengambil keuntungan finansial rahasia di luar ketentuan hak operasional resmi.' },
  { id: 165, text: 'Saya bersedia mengembalikan seluruh dana donasi yang terlanjur dicairkan jika kampanye terbukti fiktif.' },
  { id: 166, text: 'Saya siap menerima pemblokiran hak akses penggalangan dana seumur hidup jika melanggar kode etik platform.' },
  { id: 167, text: 'Saya berkomitmen untuk tidak menggunakan dana donasi sebagai modal perputaran bisnis pribadi.' },
  { id: 168, text: 'Saya bersedia dituntut secara perdata atas ganti rugi imateriil donatur jika merusak reputasi gerakan sosial ini.' },
  { id: 169, text: 'Saya menjamin tidak akan menyebarkan narasi ujaran kebencian atau muatan politik di deskripsi kampanye.' },
  { id: 170, text: 'Saya siap menandatangani jaminan aset pribadi sebagai pengikat tanggung jawab pengelolaan dana skala besar.' },
  { id: 171, text: 'Saya menolak menggunakan dana donasi untuk membiayai gaya hidup mewah pengurus lembaga.' },
  { id: 172, text: 'Saya bersedia menghadiri persidangan jika sewaktu-waktu terjadi gugatan hukum dari pihak ketiga terkait donasi ini.' },
  { id: 173, text: 'Saya berkomitmen untuk berkata jujur kepada publik mengenai kondisi riil kritis dari penerima manfaat.' },
  { id: 174, text: 'Saya bersedia diawasi oleh lembaga otoritas keuangan independen (seperti PPATK) terkait aliran dana.' },
  { id: 175, text: 'Saya menolak memanfaatkan kelemahan fisik/mental penerima manfaat demi menarik simpati donasi palsu.' },
  { id: 176, text: 'Saya siap menanggung sanksi sosial dan moral jika terbukti tidak amanah dalam menjalankan proyek.' },
  { id: 177, text: 'Saya bersedia memperbarui pakta integritas secara berkala jika kampanye berlangsung tahunan.' },
  { id: 178, text: 'Saya memastikan tidak memberikan data palsu saat proses wawancara kelayakan penggalang dana.' },
  { id: 179, text: 'Saya menolak bekerja sama dengan jaringan penggalang dana ilegal atau tidak terdaftar.' },
  { id: 180, text: 'Saya paham bahwa uang donasi adalah hak mutlak milik asnaf/penerima manfaat yang dilindungi hukum.' },
  { id: 181, text: 'Saya bersedia diverifikasi status kepailitan finansial pribadi sebelum memegang dana donasi.' },
  { id: 182, text: 'Saya berkomitmen memperlakukan dana donatur seketat mengelola uang titipan darurat.' },
  { id: 183, text: 'Saya bersedia menyerahkan kontrol akun kepada tim kurator jika saya terindikasi melanggar aturan internal.' },
  { id: 184, text: 'Saya siap menerima audit investigatif tanpa pemberitahuan jika ada laporan kecurigaan dari 3 donatur berbeda.' },
  { id: 185, text: 'Saya menjamin tidak menggunakan dana donasi untuk pelunasan utang piutang pribadi masa lalu.' },
  { id: 186, text: 'Saya bersedia mempublikasikan laporan pemotongan pajak penghasilan dari penyaluran dana jika ada.' },
  { id: 187, text: 'Saya menolak manipulasi algoritma atau menyewa buzzer untuk menaikkan exposure kampanye secara curang.' },
  { id: 188, text: 'Saya siap melepaskan jabatan penggalang dana jika performa transparansi saya dinilai buruk oleh sistem.' },
  { id: 189, text: 'Saya bersedia mengganti rugi biaya audit eksternal jika terbukti sengaja menyembunyikan transaksi ilegal.' },
  { id: 190, text: 'Saya berkomitmen menjaga kerahasiaan data pribadi donatur dan tidak menyebarluaskannya.' },
  { id: 191, text: 'Saya memastikan iklan kampanye digital didasari realita riil lapangan tanpa dramatisasi palsu.' },
  { id: 192, text: 'Saya bersedia tunduk penuh di bawah yurisdiksi hukum Pengadilan Negeri setempat jika terjadi tuntutan.' },
  { id: 193, text: 'Saya siap dicabut hak asimilasi hukumnya jika melakukan korupsi dana bencana kemanusiaan.' },
  { id: 194, text: 'Saya berkomitmen menyelesaikan seluruh rangkaian penyaluran hingga rupiah terakhir terdokumentasi.' },
  { id: 195, text: 'Saya menolak tunduk pada tekanan pihak luar yang meminta jatah atau pemotongan dana donasi ilegal.' },
  { id: 196, text: 'Saya bersedia jika rekaman wawancara ini dijadikan alat bukti sah di muka pengadilan.' },
  { id: 197, text: 'Saya memastikan seluruh anggota tim inti saya membaca, memahami, dan menyetujui kuesioner ini.' },
  { id: 198, text: 'Saya mengutamakan kebersihan berkah harta hasil pengelolaan amanah sosial ini.' },
  { id: 199, text: 'Saya bersedia mundur dari proses pendaftaran jika merasa tidak mampu memenuhi 200 poin transparansi ini.' },
  { id: 200, text: 'Saya menyatakan dengan sadar dan tanpa paksaan bahwa saya siap menjadi penggalang dana yang jujur, transparan, dan akuntabel.' }
])

// 1. Ubah struktur state answers untuk menyimpan pilihan dan alasan
const answers = ref<Record<number, { choice: string, reason: string }>>({})

// Inisialisasi state jawaban agar reaktif untuk semua pertanyaan
questions.value.forEach(q => {
  answers.value[q.id] = { choice: '', reason: '' }
})

// Opsi pilihan yang tersedia
const options = ['Sangat Tidak Setuju', 'Tidak Setuju', 'Setuju', 'Sangat Setuju']

// 2. Filter pertanyaan tetap sama
const filteredQuestions = computed(() => {
  return questions.value.filter(q => {
    if (activeTab.value === 1) return q.id >= 1 && q.id <= 40
    if (activeTab.value === 2) return q.id >= 41 && q.id <= 80
    if (activeTab.value === 3) return q.id >= 81 && q.id <= 120
    if (activeTab.value === 4) return q.id >= 121 && q.id <= 160
    return q.id >= 161 && q.id <= 200
  })
})

// 3. Validasi sekarang mengecek kategori yang sedang aktif (bukan seluruh form sekaligus)
const isCategoryValid = computed(() => {
  return filteredQuestions.value.every(q => 
    answers.value[q.id].choice !== '' && 
    answers.value[q.id].reason.trim() !== ''
  )
})

// 4. Update fungsi kalkulasi progress agar membaca struktur objek jawaban baru
const getCategoryProgress = (catId: number) => {
  let min = 1, max = 40
  if (catId === 2) { min = 41; max = 80 }
  else if (catId === 3) { min = 81; max = 120 }
  else if (catId === 4) { min = 121; max = 160 }
  else if (catId === 5) { min = 161; max = 200 }

  const catQuestions = questions.value.filter(q => q.id >= min && q.id <= max)
  const answered = catQuestions.filter(q => 
    answers.value[q.id].choice !== '' && answers.value[q.id].reason.trim() !== ''
  ).length
  return `${answered}/${catQuestions.length}`
}

// 5. Ganti fungsi handleSubmit dengan fungsi pengiriman ke WA
const sendToWhatsApp = () => {
  if (!isCategoryValid.value) return

  const activeCategory = categories.find(c => c.id === activeTab.value)
  let waText = `*Laporan Pakta Integritas - Kategori: ${activeCategory?.name}*\n\n`

  filteredQuestions.value.forEach(q => {
    const ans = answers.value[q.id]
    waText += `*[${q.id}] ${q.text}*\n`
    waText += `Jawaban: ${ans.choice}\n`
    waText += `Alasan: ${ans.reason}\n\n`
  })

  // Format nomor HP (085... menjadi 6285...)
  const waNumber = '6285950540055' 
  const encodedText = encodeURIComponent(waText)
  
  // Buka tab baru ke WhatsApp
  window.open(`https://wa.me/${waNumber}?text=${encodedText}`, '_blank')
}
</script>

<template>
    <Head title="Verifikasi Penggalang Dana" />

      <div v-if="!isSteppingToQuiz" class="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xl m-3">
        <h1 class="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-500 mb-4">Verifikasi Ketat Penggalang Dana</h1>
        <p class="text-stone-600 dark:text-stone-400 text-sm leading-relaxed mb-6">          
          Untuk menjaga transparansi, akuntabilitas, dan mencegah penyalahgunaan dana umat, Anda diwajibkan menyetujui <span class="text-stone-800 dark:text-stone-200 font-semibold">200 poin Pakta Integritas</span> secara mutlak.
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
        
        <div class="p-6 border-b sticky top-0 backdrop-blur z-20">
          <h2 class="text-lg font-bold text-amber-500 mb-4">Pakta Integritas Verifikasi Akun</h2>
          
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
              
              <!-- Character Counter -->
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
