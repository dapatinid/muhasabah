<script setup lang="ts">
import { ref, computed } from 'vue'
import { Head, Link } from '@inertiajs/vue3'
import AppLayout from '@/layouts/AppLayout.vue'

const isSteppingToQuiz = ref(false)

interface Question {
  id: number
  text: string
}

// 200 Pertanyaan Verifikasi Ketat
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
  { id: 155, text: 'Saya siap memberikan akses insigni gudang logistik kepada tim audit platform kapan saja.' },
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

// Struktur Data Tab Kategori (Carousel manual)
const categories = [
  { id: 1, name: 'Integritas & Hukum', range: '1 - 40', start: 1, end: 40 },
  { id: 2, name: 'Sistem Pelaporan', range: '41 - 80', start: 41, end: 80 },
  { id: 3, name: 'Manajemen Risiko', range: '81 - 120', start: 81, end: 120 },
  { id: 4, name: 'Alur Logistik', range: '121 - 160', start: 121, end: 160 },
  { id: 5, name: 'Moral & Sanksi', range: '161 - 200', start: 161, end: 200 }
]

const currentTab = ref(1)
const options = ['Setuju Sekali', 'Setuju', 'Kurang Setuju', 'Kurang Setuju Sekali']
const answers = ref<Record<number, { option: string; explanation: string }>>({})

// Auto-fill Data Kuesioner untuk Testing
questions.value.forEach((q, idx) => {
  q.id = idx + 1
  answers.value[q.id] = { 
    option: 'Setuju Sekali', 
    explanation: `Kami siap mengimplementasikan poin "${q.text.replace(/"/g, '')}" secara nyata di lapangan.` 
  }
})

// Filter pertanyaan berdasarkan tab aktif
const filteredQuestions = computed(() => {
  const cat = categories.find(c => c.id === currentTab.value)
  if (!cat) return []
  return questions.value.filter(q => q.id >= cat.start && q.id <= cat.end)
})

// Validasi apakah tab aktif saat ini sudah terisi semua
const isCurrentTabValid = computed(() => {
  return filteredQuestions.value.every(q => {
    const ans = answers.value[q.id]
    return ans && ans.option !== '' && ans.explanation.trim() !== ''
  })
})

// Fungsi kirim Parsial per Kategori agar URL WA tidak meledak
const handleSendPartialToWhatsApp = () => {
  const activeCat = categories.find(c => c.id === currentTab.value)
  if (!activeCat) return

  const phoneNumber = '6285950540055'
  
  let lines = [
    `*KUESIONER VERIFIKASI PENGGALANG DANA*`,
    `*KATEGORI ${activeCat.id}: ${activeCat.name.toUpperCase()} (No ${activeCat.range})*`,
    `======================================================`,
    ``
  ]

  filteredQuestions.value.forEach((q) => {
    const ans = answers.value[q.id]
    lines.push(`*${q.id}. ${q.text}*`)
    lines.push(`👉 *Jawaban:* ${ans.option}`)
    lines.push(`✍️ *Alasan:* ${ans.explanation}`)
    lines.push(``)
  })

  lines.push(`======================================================`)
  lines.push(`_Dikirim via sistem partisi kuesioner_`)

  const messageString = lines.join('\n')
  const urlEncodedMessage = encodeURIComponent(messageString)
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${urlEncodedMessage}`

  window.open(whatsappUrl, '_blank')
}
</script>

<template>
  <Head title="Testing Verifikasi Penggalang Dana" />

  <AppLayout>
    <div class="max-w-2xl mx-auto mt-10 p-6 bg-stone-900 border border-stone-800 rounded-3xl shadow-xl text-stone-100">
      
      <div v-if="!isSteppingToQuiz" class="text-center max-w-md mx-auto py-4">
        <div class="text-4xl mb-4">🛡️</div>
        <h2 class="text-xl font-bold text-stone-100 mb-2">Pendaftaran Penggalang Dana</h2>
        <p class="text-xs text-amber-500 font-semibold uppercase mb-6">Mode Uji Coba Tersegmentasi WhatsApp</p>
        <button 
          @click="isSteppingToQuiz = true"
          class="block w-full text-center bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold py-3 px-4 rounded-xl text-sm transition-colors cursor-pointer"
        >
          Mulai Verifikasi (Sistem Tab)
        </button>
      </div>

      <div v-else class="space-y-6">
        <div class="bg-stone-950 p-2 rounded-2xl border border-stone-800 sticky top-0 z-20 backdrop-blur-md">
          <div class="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide no-scrollbar">
            <button
              v-for="cat in categories"
              :key="cat.id"
              type="button"
              @click="currentTab = cat.id"
              class="px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border text-center flex-1"
              :class="currentTab === cat.id 
                ? 'bg-amber-500 text-stone-950 border-amber-500' 
                : 'bg-stone-900 text-stone-400 border-stone-800 hover:border-stone-700'"
            >
              <div class="text-[10px] opacity-80">Kat {{ cat.id }}</div>
              <div>{{ cat.range }}</div>
            </button>
          </div>
        </div>

        <div class="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
          <h3 class="text-sm font-bold text-amber-400">Kategori {{ currentTab }}: {{ categories[currentTab-1].name }}</h3>
          <p class="text-[11px] text-stone-400 mt-0.5">Kirim data bagian ini terlebih dahulu ke WhatsApp sebelum pindah ke tab berikutnya.</p>
        </div>

        <form @submit.prevent="handleSendPartialToWhatsApp" class="space-y-5">
          <div 
            v-for="question in filteredQuestions" 
            :key="question.id" 
            class="p-5 bg-stone-950 border border-stone-800/60 rounded-2xl space-y-4"
          >
            <label class="block text-sm font-semibold leading-relaxed text-stone-200">
              {{ question.id }}. {{ question.text }}
            </label>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label 
                v-for="opt in options" 
                :key="opt"
                class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all bg-stone-900"
                :class="answers[question.id]?.option === opt ? 'border-amber-500/80 bg-amber-500/5 text-amber-400' : 'border-stone-800 text-stone-400'"
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
              <span class="text-[11px] font-medium text-stone-500 block">Komitmen / Alasan:</span>
              <textarea
                v-model="answers[question.id].explanation"
                rows="2"
                class="w-full text-xs p-3 rounded-xl bg-stone-900 border border-stone-800 focus:border-amber-500 text-stone-200 outline-none resize-none"
              ></textarea>
            </div>
          </div>

          <div class="pt-4 border-t border-stone-800 flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-stone-900/95 backdrop-blur py-4 z-10">
            <button
              type="button"
              @click="isSteppingToQuiz = false"
              class="w-full sm:w-1/4 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold py-3 px-4 rounded-xl text-sm transition-colors"
            >
              Keluar
            </button>
            <button
              type="submit"
              :disabled="!isCurrentTabValid"
              class="w-full sm:w-3/4 text-center font-bold py-3 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              :class="isCurrentTabValid ? 'bg-amber-500 hover:bg-amber-600 text-stone-950' : 'bg-stone-800 text-stone-600 cursor-not-allowed'"
            >
              <span>🚀 Kirim Bagian {{ currentTab }} (No {{ categories[currentTab-1].range }}) ke WA</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  </AppLayout>
</template>