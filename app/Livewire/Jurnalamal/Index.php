<?php

namespace App\Livewire\Jurnalamal;

use App\Livewire\Traits\Alert;
use App\Models\ChallengeProgress;
use Carbon\Carbon;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Renderless;
use Livewire\Attributes\Title;
use Livewire\Attributes\Url;
use Livewire\Component;
use Livewire\WithPagination;
use Illuminate\Support\Arr;

class Index extends Component
{
    use WithPagination, Alert;

    #[Url()]
    public $selected = [];

    // #[Url()]
    public $datesort;

    public array $sort = [
        'column'    => 'id',
        'direction' => 'desc',
    ];

    #[Title('Jurnal Amal')]
    public function mount() {
        $this->datesort = Carbon::now()->format('Y-m-d');
    }

    public function updatedDatesort() {
        $this->selected = [];
    }

    public function render(): View
    {
        $quotes = [
            "Sholat sunnah dua rakaat sebelum Subuh lebih baik daripada dunia dan seisinya.",
            "Jadikanlah sabar dan sholat sebagai penolongmu. Sungguh (sholat) itu berat, kecuali bagi orang-orang yang khusyuk.",
            "Barangsiapa yang menempuh jalan untuk mencari ilmu, maka Allah akan mudahkan baginya jalan menuju surga.",
            "Tinggalkanlah dosa, karena dosa akan memadamkan cahaya keimanan di hatimu.",
            "Perbanyaklah istighfar, karena ia adalah pembersih hati dari segala noda dan karat.",
            "Dzikir kepada Allah adalah ketenangan bagi hati yang gelisah.",
            "Setiap amal kebaikan yang dilakukan dengan ikhlas akan kembali kepada pelakunya sebagai pahala yang berlipat ganda.",
            "Jangan pernah menunda sholat. Ibadah yang paling dicintai Allah adalah yang tepat waktu.",
            "Waktu terbaik untuk berdoa adalah saat sujud. Manfaatkanlah momen itu sepenuhnya.",
            "Sedekah tidak akan mengurangi harta, malah ia akan membersihkannya dan melipatgandakan pahala.",
            "Puasa bukan hanya menahan lapar dan dahaga, tapi juga menahan diri dari perkataan sia-sia dan perbuatan dosa.",
            "Membaca Al-Qur'an adalah teman terbaik di dunia dan syafaat di akhirat.",
            "Ubah rasa lelahmu dalam ibadah menjadi kenikmatan, karena janji Allah itu pasti.",
            "Kesempatan beribadah hari ini mungkin tidak akan terulang esok. Manfaatkan setiap detik.",
            "Jadikanlah tawakal sebagai sandaran utamamu, setelah usaha maksimal dalam beribadah.",
            "Keistiqomahan dalam amal sedikit lebih baik daripada amal banyak namun terputus-putus.",
            "Ingatlah, setiap kesulitan yang kamu hadapi dalam beribadah adalah penghapus dosamu.",
            "Pintu taubat selalu terbuka. Segeralah kembali kepada Allah, tak peduli seberapa besar dosamu.",
            "Cinta sejati adalah cinta yang membawa kita semakin dekat dengan Allah dan ketaatan kepada-Nya.",
            "Jadikanlah setiap hembusan napas sebagai peluang untuk menambah timbangan amal kebaikanmu.",
            "Ibadah yang terasa berat hari ini adalah tabungan kemudahanmu di hari akhir.",
            "Luruskan niat, karena nilai sebuah amal hanya ditentukan oleh keikhlasan di dalamnya.",
            "Malam adalah saksi bisu bagi hamba yang bangun hanya untuk bermunajat kepada Tuhannya.",
            "Jangan biarkan kesibukan dunia melupakanmu dari kewajiban sholat.",
            "Sholat malam (Tahajud) adalah cara terbaik memulai hari dengan keberkahan.",
            "Tersenyum kepada saudaramu adalah sedekah. Jangan remehkan amal kecil.",
            "Hati yang bersih akan selalu merindukan saat-saat beribadah.",
            "Menjaga lisan dari ghibah adalah salah satu ibadah tersulit dan berpahala besar.",
            "Setiap langkah menuju masjid adalah penghapus dosa dan peninggi derajat.",
            "Jadilah hamba yang pandai bersyukur, karena syukur akan menambah nikmat, termasuk nikmat ibadah.",
            "Jika sholatmu baik, maka seluruh amalmu insya Allah akan menjadi baik.",
            "Bersegeralah dalam kebaikan, karena ajal tidak menunggu taubatmu sempurna.",
            "Doa adalah senjata terkuat orang mukmin. Jangan pernah berhenti memohon.",
            "Ujian dan cobaan adalah pembersih. Hadapi dengan sabar dan perbanyak ibadah.",
            "Kehidupan dunia hanyalah persinggahan. Fokuslah pada bekal perjalanan abadi.",
            "Jauhkan diri dari perdebatan sia-sia. Manfaatkan lisan untuk berdzikir.",
            "Sempurnakan wudhu-mu, karena ia adalah kunci diterimanya sholat.",
            "Orang yang paling beruntung adalah yang diberi kesempatan beramal sholeh.",
            "Tolonglah orang lain, niscaya Allah akan menolongmu dalam kesulitan ibadah.",
            "Takutlah akan hari ketika anggota tubuhmu bersaksi atas segala perbuatanmu.",
            "Cari keberkahan rezeki agar ibadah terasa ringan dan nikmat.",
            "Jangan jadikan ibadah sebagai beban, tapi jadikan sebagai kebutuhan hati.",
            "Istiqomah adalah kunci. Lakukan sedikit, tapi terus menerus.",
            "Jaga pandangan dari yang haram, agar hatimu mudah menerima cahaya hidayah.",
            "Rasulullah SAW bersabda: 'Dunia adalah penjara bagi orang mukmin'. Jangan terlalu nyaman.",
            "Kelembutan hati didapatkan melalui ketaatan dan menjauhi maksiat.",
            "Semangatlah dalam menghadiri majelis ilmu, itu adalah taman surga di dunia.",
            "Perbaiki hubunganmu dengan orang tua, itu adalah pintu besar menuju ridha Allah.",
            "Bersihkan hatimu dari dengki dan iri, agar ibadahmu diterima dengan sempurna.",
            "Setiap waktu luang adalah modal berharga. Jangan biarkan berlalu tanpa amal sholeh.",
            "Bukan seberapa banyak kamu beribadah, tapi seberapa **ikhlas** kamu melakukannya.",
            "Sujud adalah puncak kerendahan diri, manfaatkan untuk meminta apa saja.",
            "Hati yang lalai mudah ditipu oleh gemerlapnya kesenangan sesaat.",
            "Jadikanlah kematian sebagai pengingat terbaik untuk memperbanyak amal.",
            "Berbakti kepada suami adalah ladang ibadah besar bagi seorang istri.",
            "Jadilah penyebar kedamaian dan kebaikan di mana pun kamu berada.",
            "Doa saat hujan turun adalah mustajab. Jangan lewatkan kesempatan itu.",
            "Nafsu seringkali mengajak kepada keburukan. Lawanlah dengan dzikir dan puasa.",
            "Tanggung jawabmu terhadap keluargamu juga adalah ibadah.",
            "Jangan pernah berputus asa dari rahmat Allah, teruslah bertaubat dan beramal.",
            "Sesungguhnya bersama kesulitan ada kemudahan. Iringi usahamu dengan ibadah.",
            "Kunci kebahagiaan sejati ada pada ketaatan mutlak kepada Allah.",
            "Jadikan Al-Qur'an sebagai *roadmap* hidupmu, bukan sekadar bacaan.",
            "Cukuplah Allah sebagai penolong. Tidak ada daya dan kekuatan kecuali dari-Nya.",
            "Perbanyaklah sholawat, ia adalah penyebab diampuninya dosa dan naiknya derajat.",
            "Jaga sholatmu di awal waktu, niscaya Allah akan menjagamu dalam segala urusan.",
            "Ketidaksempurnaan ibadahmu bisa ditutup dengan amal-amal sunnah.",
            "Amal yang paling disukai Allah adalah yang dikerjakan secara berkelanjutan, walaupun sedikit.",
            "Ukhuwah (persaudaraan) yang terjalin karena Allah adalah ibadah yang mulia.",
            "Tinggalkan kebiasaan burukmu sebelum kebiasaan itu meninggalkanmu dalam penyesalan.",
            "Berbuat baiklah kepada tetangga, itu adalah bagian dari kesempurnaan iman.",
            "Akal adalah anugerah. Gunakan untuk merenungi kebesaran Allah dan syariat-Nya.",
            "Setan membenci orang yang senantiasa menjaga kebersihan diri dan hati.",
            "Mencari nafkah yang halal adalah jihad dan ibadah yang wajib.",
            "Peringatan yang paling jujur bagimu adalah kematian.",
            "Jadilah seperti lebah: makan yang baik, hasilkan yang baik, dan tidak merusak.",
            "Orang yang beribadah di kala muda akan merasakan manisnya iman di masa tua.",
            "Pintu surga itu banyak. Carilah amal yang paling sesuai dengan kemampuanmu dan tekuni.",
            "Jangan lupakan hak fakir miskin dalam hartamu. Tunaikan zakat dan sedekah.",
            "Setiap ujian keimanan akan meningkatkan kualitas ibadah dan tawakalmu.",
            "Tahan amarahmu. Orang yang kuat adalah yang mampu menahan amarahnya.",
            "Minta perlindungan Allah dari sifat malas dalam beribadah.",
            "Ibadah adalah investasi jangka panjang yang tidak pernah merugi.",
            "Luruskan barisan sholatmu, luruskan juga hatimu dalam beribadah.",
            "Jangan terlalu khawatirkan penilaian manusia, fokus pada penilaian Allah.",
            "Ilmu adalah pelita. Ia akan memandu jalanmu menuju ibadah yang benar.",
            "Hargai setiap tetesan air yang kamu gunakan untuk wudhu.",
            "Semangatlah membantu orang yang sedang membutuhkan.",
            "Membaca doa setelah adzan adalah ibadah sunnah yang sering terlupakan.",
            "Jadikan rumahmu tempat dzikir dan bacaan Qur'an, bukan kuburan.",
            "Jadilah pribadi yang mudah memaafkan kesalahan orang lain.",
            "Ibadah haji adalah panggilan suci. Berusahalah untuk menyambutnya.",
            "Seberat apapun masalahmu, sholatlah. Sholat adalah jalan keluar.",
            "Niat yang baik akan menghasilkan amal yang baik, meskipun terhalang pelaksanaannya.",
            "Allah tidak melihat bentuk tubuhmu, tapi melihat hati dan amalmu.",
            "Berharaplah hanya kepada Allah, bukan kepada makhluk.",
            "Sesungguhnya waktu dhuha adalah waktu menuai pahala di awal hari.",
            "Jangan sombong dengan amal ibadahmu. Kesombongan menghapus pahala.",
            "Selalu perbaharui taubatmu setiap kali kamu tergelincir.",
            "Jadikan sabar sebagai pakaian dan syukur sebagai nafas hidupmu.",
            "Waktu paling mustajab untuk terkabulnya doa adalah antara adzan dan iqamah.",
            "Berhati-hatilah dengan riya' (pamer ibadah), itu adalah syirik kecil.",
            "Makan dan minum secukupnya. Perut yang penuh seringkali membuat malas ibadah.",
            "Pelihara lisanmu dari dusta, karena dusta adalah pintu menuju maksiat.",
            "Perbanyak sholat sunnah rawatib untuk menambal kekurangan sholat wajib.",
            "Ibadah adalah jembatan yang menghubungkan hamba dengan Tuhannya.",
            "Jangan tunggu tua untuk beribadah. Kematian tidak menunggu usia.",    
            "Hidup ini singkat, jangan sia-siakan waktu untuk hal yang menjauhkanmu dari surga.",
            "Perbanyaklah doa di sepertiga malam terakhir, saat Allah turun ke langit dunia.",
            "Ibadah adalah jembatan penghubung antara keinginan duniawi dan ketenangan ukhrawi.",
            "Jangan menunda amal sholeh. Usia tidak menjamin waktu untuk berbuat baik.",
            "Jadilah lentera bagi orang lain melalui akhlak dan ibadahmu.",
            "Rendahkan hatimu di hadapan Allah. Keikhlasan adalah mahkota ibadah.",
            "Setiap pagi adalah kesempatan baru untuk memulai ketaatan yang lebih baik.",
            "Dosa-dosa kecil yang terus diulang bisa menjadi dosa besar yang merusak ibadah.",
            "Mencari ilmu yang bermanfaat adalah ibadah yang pahalanya terus mengalir.",
            "Sholat adalah tiang agama. Tegakkanlah tiang itu dengan sebaik-baiknya.",
            "Pelihara sholat ashar, karena ia adalah sholat yang sering melalaikan.",
            "Jangan tinggalkan majelis dzikir, di sana ada ketenangan dan rahmat Allah.",
            "Keberkahan hidup didapatkan dari ibadah yang dilaksanakan dengan penuh kesadaran.",
            "Gunakan masa mudamu sebelum datang masa tuamu dalam ketaatan.",
            "Tinggalkan perdebatan agama yang tidak produktif. Fokus pada amal.",
            "Hati yang terpaut pada masjid adalah tanda cinta kepada Allah.",
            "Sedekah yang paling utama adalah yang diberikan saat kita dalam keadaan sulit.",
            "Jangan sampai hartamu menjadi beban dan penghalangmu menuju surga.",
            "Berbuat baiklah kepada binatang. Kasih sayang adalah bagian dari iman.",
            "Puasa sunnah adalah pelindung dari api neraka.",
            "Rasulullah sangat mencintai sholat sunnah sebelum fajar. Ikutilah sunnahnya.",
            "Perbaiki kualitas bacaan Al-Qur'anmu, itu adalah amanah yang harus dijaga.",
            "Setiap musibah yang menimpamu, jika disikapi sabar, akan menjadi pahala.",
            "Orang yang beruntung adalah yang selalu ingat akan hari perhitungan.",
            "Tinggalkan kebiasaan burukmu. Ketaatan butuh pengorbanan.",
            "Keikhlasan adalah rahasia antara kamu dan Tuhanmu, jangan biarkan orang lain mengetahuinya.",
            "Jadikan ibadah sebagai kebutuhan, bukan sekadar kewajiban.",
            "Ibadah tanpa ilmu adalah kesia-siaan. Carilah ilmu agama yang benar.",
            "Waktu terbaik untuk memohon adalah saat kamu merasa lemah dan tak berdaya.",
            "Sifat qana'ah (merasa cukup) adalah kekayaan sejati seorang mukmin.",
            "Jangan terlalu khawatirkan rezeki, fokuslah pada ketaatanmu.",
            "Bersihkan rumahmu dari hal-hal yang tidak disukai malaikat rahmat.",
            "Jadilah hamba yang pandai berterima kasih kepada sesama manusia.",
            "Pintu surga Ar-Rayyan dikhususkan bagi orang yang berpuasa.",
            "Setiap tarikan nafas adalah peluang untuk memuji kebesaran Allah.",
            "Ubah waktu menunggu menjadi waktu beristighfar dan berdzikir.",
            "Jangan biarkan hatimu dipenuhi rasa takut kecuali takut kepada Allah.",
            "Berpegang teguh pada Al-Qur'an dan Sunnah adalah keselamatanmu.",
            "Pahala yang paling cepat didapatkan adalah pahala silaturahmi.",
            "Tahanlah diri dari menuntut hak orang lain, itu lebih menenangkan.",
            "Hati-hati terhadap dosa lisan. Ia bisa menjerumuskanmu ke neraka.",
            "Keberkahan hidup terletak pada keridhaan Allah. Carilah ridha-Nya melalui ibadah.",
            "Jika kamu merasa lelah, ingatlah lelahnya para nabi dan sahabat dalam berdakwah.",
            "Lakukan amal dengan sembunyi-sembunyi, sebagaimana kamu menyembunyikan dosamu.",
            "Jangan pernah meremehkan kekuatan doa orang tua.",
            "Ibadah yang diterima akan memberikan ketenangan dalam segala situasi.",
            "Sujud syukur adalah cara termudah untuk mengakui kebesaran nikmat-Nya.",
            "Manfaatkan setiap akhir pekan untuk menambah bekal akhiratmu.",
            "Kejujuran adalah fondasi dari semua ibadah dan muamalah.",
            "Tinggalkan kebiasaan menunda. Kematian tidak mengenal kata 'nanti'.",
            "Pilihlah teman yang mengajakmu mendekat kepada Allah.",
            "Jadilah hamba yang selalu berprasangka baik (husnuzan) kepada Allah.",
            "Setiap senyum tulus yang kau berikan adalah pahala bagimu.",
            "Zakat adalah pembersih harta dan jiwa. Tunaikan dengan ikhlas.",
            "Jangan biarkan media sosial menjadi ladang dosa lisan dan mata.",
            "Waktu antara Subuh dan terbit matahari adalah waktu memanen pahala.",
            "Hati yang lalai akan mudah didominasi oleh hawa nafsu.",
            "Ikhlas bukan hanya dalam sholat, tapi juga dalam pekerjaan dan perkataan.",
            "Istiqomah adalah pertahanan terbaik melawan godaan setan.",
            "Jadilah orang yang ringan tangan membantu urusan orang lain.",
            "Ingatlah, setiap detik yang berlalu tidak akan pernah kembali.",
            "Perbanyaklah memohon agar diwafatkan dalam keadaan husnul khatimah.",
            "Tinggalkan kebiasaan tidur larut malam yang membuatmu kehilangan Subuh.",
            "Kebaikan yang dilakukan di tengah kesulitan nilainya lebih tinggi.",
            "Jadikan rumahmu sebagai tempat ibadah kedua setelah masjid.",
            "Tadabbur Al-Qur'an (merenungi maknanya) adalah ibadah hati yang mendalam.",
            "Tidak ada yang mampu menolongmu di hari kiamat selain amal sholehmu.",
            "Hati yang penuh rasa syukur tidak akan pernah merasa kekurangan.",
            "Berani mengakui kesalahan adalah langkah awal menuju perbaikan ibadah.",
            "Pelihara sholat tahajud, walau hanya dua rakaat ringan.",
            "Jadilah penyabar, karena Allah mencintai orang-orang yang sabar.",
            "Hidupkan malammu dengan ibadah, niscaya siangmu akan penuh berkah.",
            "Sedekah jariyah adalah investasi abadi yang terus memberimu pahala.",
            "Jangan iri pada harta dunia orang lain, irilah pada ketaatan mereka.",
            "Waktumu adalah umurmu. Habiskan umurmu untuk mengabdi kepada Allah.",
            "Amal yang paling disukai adalah yang paling ikhlas, meskipun sedikit.",
            "Pilihlah pemimpin yang takut kepada Allah, karena ia akan memimpinmu dalam kebaikan.",
            "Istighfar adalah detoksifikasi bagi jiwa yang berlumuran dosa.",
            "Kesempurnaan iman adalah akhlak yang mulia.",
            "Hati-hati terhadap dosa yang dianggap remeh, karena semua akan dihitung.",
            "Jadilah pribadi yang selalu mengutamakan kepentingan akhirat.",
            "Keutamaan sholat berjamaah melebihi sholat sendirian hingga 27 kali lipat.",
            "Jangan biarkan setan menghentikanmu dari berdzikir setelah sholat.",
            "Berdoa bukan hanya saat butuh, tapi setiap saat sebagai bentuk ketaatan.",
            "Tawakal adalah menyerahkan urusan setelah berusaha maksimal dalam ibadah.",
            "Jadikanlah Al-Qur'an sebagai obat bagi hati yang sakit.",
            "Lelah dalam ketaatan akan hilang, tapi pahalanya akan kekal.",
            "Setiap kesulitan yang kamu lewati dalam beribadah adalah ujian cinta dari-Nya.",
            "Perbaiki hubunganmu dengan Allah, niscaya Allah akan memperbaiki hubunganmu dengan manusia.",
            "Berbuat baiklah di dunia, karena di akhirat kita hanya menuai apa yang kita tanam.",
            "Kunci untuk mencapai keistiqomahan adalah doa dan mujahadah (bersungguh-sungguh).",
            "Jadilah hamba yang mudah memaafkan, agar Allah pun mudah mengampunimu.",
            "Jangan putus asa dengan dirimu sendiri. Terus perbaiki diri dan ibadahmu.",
            "Pahala terbaik menanti mereka yang beramal tanpa diketahui orang lain.",
            "Semangatlah mencari nafkah yang halal, karena itu adalah ibadah yang mulia.",
            "Kematian adalah gerbang menuju kehidupan abadi. Siapkan bekal terbaikmu.",
            "Jadikanlah sholat sunnah rawatib sebagai kebiasaan harianmu.",
            "Ridha Allah adalah tujuan tertinggi dari setiap amal ibadah.",
            "Dzikir pagi dan petang adalah benteng pelindung diri dari godaan setan.",
            "Setiap ibadah yang kamu lakukan adalah bukti cintamu kepada Sang Pencipta.",
            "Bangun pagi dengan niat ibadah. Itu adalah kunci keberkahan harimu.",                    
        ];
        $randomQuote = Arr::random($quotes);
        $jurnalamal = ChallengeProgress::query()->whereUserId(Auth::id())->whereDate('date',$this->datesort)->orderBy('challenge_id','asc')->get();
        return view('livewire.jurnalamal.index',compact('jurnalamal','randomQuote'));
    }

    #[Renderless]
    public function confirmHapus($id): void
    {   
        $this->question('Data akan dihapus.', 'Yakin hapus?')
            ->confirm(
                method: 'deletesatuan',
                params: ['id' => $id] 
            )
            ->cancel()
            ->send();
    }
    
    public function deletesatuan($id): void
    {
        ChallengeProgress::whereIn('id', (array) $id)->delete();

        $this->dispatch('deleted');

        $this->success('Data terpilih dihapus', 'Sukses Hapus');
    }

    #[Renderless]
    public function hapussekaligus()
    {
        if ($this->selected == null) {
            $this->toast()->error('Gagal', 'Tidak ada data terpilih')->send();
        } else {
            $this->question('Data terpilih akan dihapus sekaligus.', 'Yakin hapus?')
                ->error('Hapus Sekaligus!', count($this->selected) . ' data terpilih akan terhapus')
                ->confirm(method: 'hapussekaliguskonfirmasi')
                ->cancel()
                ->send();
        }
    }

    public function hapussekaliguskonfirmasi()
    {
        foreach ($this->selected as $key => $id) {
            ChallengeProgress::find($id)->delete();
        }

        $this->selected = [];
        $this->toast()->success('Berhasil hapus', 'Semangat Amal Ibadah setiap hari !!!')->send();
        // return $this->redirect('/jurnalamal', navigate: true);
    }
}
