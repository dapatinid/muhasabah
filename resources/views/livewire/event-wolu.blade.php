<div class="max-w-xl mx-auto space-y-4 p-4">

<x-alert color="red" icon="paper-airplane"> Daftarkan kota mu dalam acara WORKSHOP LUNAS UTANG <a href="http://wa.me/6285950540055?text={{ $daftarkankota }}" target="_blank" class="underline text-blue-300">Klik di sini</a> </x-alert>

<h2 class="text-primary-700 dark:text-primary-500 text-xl">Acara Terdekat</h2>

@foreach ($events as $event)
<div class="border rounded-xl shadow cursor-pointer hover:shadow-lg transition dark:text-white bg-white dark:bg-black select-none" wire:click="openModal({{ $event['id'] }})">
<div class="flex items-center">
    <div class="p-4">
        <h2 class="font-bold text-lg">{{ $event['name'] }}</h2>
        <p class="text-sm text-gray-600 dark:text-gray-200">{{ $event['desc'] }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-200">{{ $event['ticket'] }}</p>
    </div>
    <div class="ms-auto -mr-5">
        <div class="text-white -rotate-90 {{ $event['label'] === 'SELESAI' ? 'bg-blue-500' : 'bg-green-500' }} px-3 rounded-lg"><span >{{ $event['label'] }}</span></div>
    </div>
</div>

</div>
@endforeach


@if ($showModal)
<div
x-data="{ show: false }"
x-init="setTimeout(() => show = true, 10)"
x-show="show"
x-transition.opacity.duration.250ms
class="fixed inset-0 bg-black/40 flex items-start justify-center z-50 overflow-auto"
>
<div
x-show="show"
x-transition.duration.300ms.scale.origin-top
class="bg-white w-full max-w-lg rounded-xl shadow-lg relative"
>

<div class="flex bg-primary-500 rounded-t-xl py-3 px-5">
    <h2 class="text-xl font-bold">Form Pendaftaran</h2>
    <button wire:click="closeModal" class="ms-auto text-gray-500">✕</button>
</div>


<form wire:submit.prevent="submit" class="space-y-3 px-6">


<div>   
<input type="text" wire:model="form.event_name" class="text-2xl text-center font-bold w-full border-none rounded px-2 mt-2 -mb-4 focus:ring-0 active:ring-0" readonly>
<h2 class="text-sm text-center">{{ $this->desc }}</h2>
<h2 class="text-sm text-center">{{ $this->ticket }}</h2>
</div>


<div>
<label class="font-semibold">Nama Peserta</label>
<input type="text" wire:model="form.participant_name" class="w-full border rounded p-2" required>
</div>
<div>
<label class="font-semibold">Nama Pasangan</label>
<input type="text" wire:model="form.participant_name_2" class="w-full border rounded p-2" placeholder="Tulis jika hadir dengan pasangan">
</div>


<div>
<label class="font-semibold">Nomor WA Peserta</label>
<input type="number" wire:model="form.wa_number" class="w-full border rounded p-2" required>
</div>


<div>
<label class="font-semibold">Alamat</label>
<input type="text" wire:model="form.street_address" class="w-full border rounded p-2" required placeholder="Jalan, RT RW, Desa, Kecamatan">
</div>


<div class="grid grid-cols-2 gap-2">
<div>
<label class="font-semibold">Kabupaten / Kota</label>
<input type="text" wire:model="form.city" class="w-full border rounded p-2" required>
</div>
<div>
<label class="font-semibold">Provinsi</label>
<input type="text" wire:model="form.province" class="w-full border rounded p-2" required>
</div>
</div>


<div>
<label class="font-semibold">{{ $notenya }}</label>
<textarea wire:model="form.note" class="w-full border rounded p-2" rows="3"></textarea>
</div>

<div>
    *Dengan ini saya bersedia mengikuti aturan acara, membayar tiket sebelum acara dimulai, hadir tepat waktu dan mengikuti acara 2 hari penuh.
</div>


<button type="submit" class="w-full bg-green-600 text-white p-2 mb-6 rounded-lg font-semibold">
Daftar Sekarang
</button>
</form>


</div>
</div>
@endif
</div>