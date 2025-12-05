<?php

namespace App\Livewire;

use Livewire\Component;

class EventRegister extends Component
{
   public $showModal = false;
    public $selectedEvent = null;
    public $notenya = null;


    public $events = [
    [
    'id' => 2,
    'name' => 'Workshop Lunas Utang #38',
    'ticket' => 'Rp100.000 / Peserta • Rp150.000 / Pasangan',
    'desc' => '17 Jan 2025 • Semarang',
    'note' => 'Motivasi atau Alasan mengikuti acara ini?',
    ],
    [
    'id' => 1,
    'name' => 'Workshop Lunas Utang #37',
    'ticket' => 'Rp100.000 / Peserta • Rp150.000 / Pasangan',
    'desc' => '13 Jan 2025 • Gunung Kidul',
    'note' => 'Motivasi atau Alasan mengikuti acara ini',
    ],
    ];


    public $form = [
    'event_name' => '',
    'participant_name' => '',
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
    "Event : {$this->form['event_name']}\n".
    "Nama Peserta : {$this->form['participant_name']}\n".
    "No WA : {$this->form['wa_number']}\n".
    "Alamat : {$this->form['street_address']}\n".
    "Kota/Kabupaten : {$this->form['city']} - {$this->form['province']}\n".
    "Catatan : {$this->form['note']}"
    );


    return redirect()->away("https://wa.me/6285950540055?text={$message}");
    }

    public function render()
    {
        return view('livewire.event-register');
    }
}
