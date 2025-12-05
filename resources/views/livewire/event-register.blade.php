<div class="max-w-xl mx-auto space-y-4 p-4">
@foreach ($events as $event)
<div class="border rounded-xl p-4 shadow cursor-pointer bg-primary-200" wire:click="openModal({{ $event['id'] }})">
<h2 class="font-bold text-lg">{{ $event['name'] }}</h2>
<p class="text-sm text-gray-600">{{ $event['ticket'] }}</p>
<p class="text-sm text-gray-600">{{ $event['desc'] }}</p>
</div>
@endforeach


<!-- Modal -->
@if ($showModal)
<div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
<div class="bg-white w-full max-w-lg rounded-xl p-6 shadow-lg relative">


<button wire:click="closeModal" class="absolute top-3 right-3 text-gray-700">✕</button>


<h2 class="text-xl font-bold mb-4">Form Pendaftaran</h2>


<form wire:submit.prevent="submit" class="space-y-3">


<div>
<label class="font-semibold">Nama Event</label>
<input type="text" wire:model="form.event_name" class="w-full border rounded p-2" readonly>
</div>


<div>
<label class="font-semibold">Nama Peserta</label>
<input type="text" wire:model="form.participant_name" class="w-full border rounded p-2" required>
</div>


<div>
<label class="font-semibold">Nomor WA Peserta</label>
<input type="number" wire:model="form.wa_number" class="w-full border rounded p-2" required placeholder="Contoh : 085950540055">
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
<label class="font-semibold">Catatan</label>
<textarea wire:model="form.note" class="w-full border rounded p-2" rows="3" placeholder="{{ $this->notenya }}"></textarea>
</div>


<button type="submit" class="w-full bg-green-600 text-white p-2 rounded-lg font-semibold">
Daftar via WhatsApp
</button>
</form>
</div>
</div>
@endif
</div>