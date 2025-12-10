<div @updated="$dispatch('name-updated', { name: $event.detail.name })" class="space-y-3 p-3 mx-auto max-w-lg">
    <div class="{{ Auth::user()->image == null || Auth::user()->gender == null || Auth::user()->tempat_lahir == null || Auth::user()->tanggal_lahir == null || Auth::user()->golongan_darah == null  ? '' : 'hidden' }}">
        <x-alert color="amber" icon="light-bulb" close >
            @lang('Lengkapi data di bawah ini.')
        </x-alert>
    </div> 
    <x-card :header="__('Edit Data Diri')" color="primary">
        <form id="update-profile-data-diri" wire:submit="save_data_diri">
            <div class="space-y-6">
                <div>
                    @if ($image) 
                        <img src="{{ $image->temporaryUrl() }}" class="object-cover text-center mx-auto size-[120px] rounded-full" x-on:click="document.getElementById('image')?.click();">
                    @else
                        @if ($user->image != null)
                            <img src="{{ url('storage/'.$user->image) }}" alt="avatar" class="object-cover text-center mx-auto size-[120px] rounded-full" x-on:click="document.getElementById('image')?.click();">
                        @else
                            <img src="{{ url('storage/avatar/user.png') }}" alt="avatar" class="object-cover text-center mx-auto size-[120px] rounded-full" x-on:click="document.getElementById('image')?.click();">
                        @endif
                    @endif
                </div>
                <div>
                    <x-upload label="{{ __('Avatar') }} *" wire:model="image" required close-after-upload placeholder="Wajib isi, pilih foto profil" hint="foto profil tidak lebih dari 4 MB"/>
                </div>
                <div>
                    <x-select.styled label="{{ __('Gender') }} *" wire:model="user.gender" required :options="[
                        ['label' => 'Laki - Laki', 'value' => 'L'],
                        ['label' => 'Perempuan', 'value' => 'P'],
                    ]" placeholder="Wajib isi"/>
                </div>
                <div>
                    <x-input label="{{ __('Tempat Lahir') }} *" wire:model="user.tempat_lahir" required placeholder="Wajib isi"/>
                </div>
                <div>
                    <x-date label="{{ __('Tanggal Lahir') }} *" wire:model="user.tanggal_lahir" required placeholder="Wajib isi"/>
                </div>

                <div>
                    <x-select.styled label="{{ __('Golongan Darah') }} *" wire:model="user.golongan_darah" required :options="[
                        ['label' => 'Belum diketahui', 'value' => '-'],
                        ['label' => 'O+', 'value' => 'O+'],
                        ['label' => 'O-', 'value' => 'O-'],
                        ['label' => 'B+', 'value' => 'B+'],
                        ['label' => 'B-', 'value' => 'B-'],
                        ['label' => 'AB+', 'value' => 'AB+'],
                        ['label' => 'AB-', 'value' => 'AB-'],
                        ['label' => 'A+', 'value' => 'A+'],
                        ['label' => 'A-', 'value' => 'A-'],
                    ]" placeholder="Wajib isi"/>
                </div>
                <div>
                    {{-- <x-input label="{{ __('Grup') }}" wire:model="user.grup" placeholder="tidak wajib isi"/> --}}
                    <x-select.styled label="{{ __('Grup') }} *" wire:model="user.grup" required searchable :options="[
                        ['label' => 'Non Grup', 'value' => 'Non Grup'],
                        ['label' => 'Kendal', 'value' => 'Kendal'],
                        ['label' => 'Batang', 'value' => 'Batang'],
                        ['label' => 'Semarang', 'value' => 'Semarang'],
                        ['label' => 'Gunung Prau', 'value' => 'Gunung Prau'],
                        ['label' => 'Temanggung', 'value' => 'Temanggung'],
                        ['label' => 'Pekalongan', 'value' => 'Pekalongan'],
                        ['label' => 'Tegal', 'value' => 'Tegal'],
                        ['label' => 'Gunungkidul', 'value' => 'Gunungkidul'],
                    ]" placeholder="Wajib isi"/>                    
                </div>

                <div class="border-t-2 border-gray-200 dark:border-gray-800 pt-6">
                    @if ($image_id) 
                        <img src="{{ $image_id->temporaryUrl() }}" class="object-cover text-center mx-auto w-50 aspect-[16/11]" x-on:click="document.getElementById('image_id')?.click();">
                    @else
                        @if ($user->image_id != null)
                            <img src="{{ url('storage/'.$user->image_id) }}" alt="foto_id" class="object-cover text-center mx-auto w-50 aspect-[16/11]" x-on:click="document.getElementById('image_id')?.click();">
                        @else
                            <img src="{{ url('storage/image_id/image_id.png') }}" alt="foto_id" class="object-cover text-center mx-auto w-50 aspect-[16/11]" x-on:click="document.getElementById('image_id')?.click();">
                        @endif
                    @endif
                </div>
                <div>
                    <x-upload label="Foto KTP" wire:model="image_id" placeholder="tidak wajib isi" close-after-upload/>
                </div>
                <div>
                    <x-input label="{{ __('No. ID / KTP / Passport') }}" wire:model="user.no_id" placeholder="tidak wajib isi"/>
                </div>

            </div>
        </form>
        <x-slot:footer>
            <x-button type="submit" form="update-profile-data-diri" class="w-full">
                @lang('Save')
            </x-button>
        </x-slot:footer>
    </x-card>
</div>
