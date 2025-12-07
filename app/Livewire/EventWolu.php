<?php

namespace App\Livewire;

use Livewire\Component;

class EventWolu extends Component
{
   public $showModal = false;
    public $selectedEvent = null;
    public $notenya = null;
    public $daftarkankota;
    public $events;
    public $desc;
    public $ticket;

public function mount()
{
    $this->daftarkankota = urlencode(
    "*Pendaftaran KOTA* \n\n".

    "Bismillahirrohmannirohim. Saya mendaftarkan kota saya untuk diprioritaskan dalam Acara WORKSHOP LUNAS UTANG angkatan selanjutnya. \n\n".
    "Nama saya :  \n".
    "No. WA :  \n".
    "Provinsi : \n".
    "Kabupaten / Kota : \n".
    "Kecamatan : \n\n".

    "Jazakumullah Khair \n\n".

    "_*Pengajuan ini akan diproses oleh admin dan akan dipertimbangkan lebih lanjut. Peserta terbanyak yang mendaftar dalam satu kota tertentu akan masuk dalam daftar event selanjutnya dan kami muat di web._"
    );

    $this->events = collect([
    [
    'id' => 1,
    'name' => 'Workshop Lunas Utang #37',
    'ticket' => 'Rp300.000 / Peserta • Rp500.000 / Pasangan',
    'desc' => '10 - 11 Jan 2025 • Semarang',
    'note' => 'Motivasi atau Alasan mengikuti acara ini?',
    ],
    [
    'id' => 2,
    'name' => 'Workshop Lunas Utang #38',
    'ticket' => 'Rp100.000 / Peserta • Rp150.000 / Pasangan',
    'desc' => '13 - 14 Jan 2025 • Gunung Kidul',
    'note' => 'Motivasi atau Alasan mengikuti acara ini',
    ],
    ])->sortByDesc('id')->values()->toArray();
}


    public $form = [
    'event_name' => '',
    'desc' => '',
    'participant_name' => '',
    'participant_name_2' => '',
    'wa_number' => '',
    'street_address' => '',
    'city' => '',
    'province' => '',
    'note' => '',
    ];


    public function openModal($id)
    {
    $this->selectedEvent = collect($this->events)->firstWhere('id', $id);
    $this->form['event_name'] = $this->selectedEvent['name'];
    $this->desc = $this->selectedEvent['desc'];
    $this->ticket = $this->selectedEvent['ticket'];
    $this->notenya = $this->selectedEvent['note'];
    $this->showModal = true;
    }


    public function closeModal()
    {
    $this->showModal = false;
    }


    public function submit()
    {
    $message = urlencode(
    "*Pendaftaran Event* \n".
    "{$this->form['event_name']}\n\n".

    "Nama Peserta : {$this->form['participant_name']}\n".
    "Nama Pasangan : {$this->form['participant_name_2']}\n".
    "No WA : {$this->form['wa_number']}\n".
    "Alamat : {$this->form['street_address']}\n".
    "Kota/Kabupaten : {$this->form['city']} - {$this->form['province']}\n".
    "Catatan : {$this->form['note']}\n\n".

    "_*Dengan ini saya bersedia mengikuti aturan acara, membayar tiket sebelum acara dimulai, hadir tepat waktu dan mengikuti acara 2 hari penuh._"
    );


    return redirect()->away("https://wa.me/6285950540055?text={$message}");
    }

    public function render()
    {
        return view('livewire.event-wolu');
    }
}
