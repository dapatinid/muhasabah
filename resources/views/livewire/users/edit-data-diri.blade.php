<div class="mx-auto max-w-lg p-3">
   <x-card :header="__('Edit Data Diri :nama', ['nama' => $user?->name])" color="primary">
        <form id="update-profile-data-diri" wire:submit="save_data_diri">
            <div class="space-y-6">
                <div>
                    @if ($image) 
                        <img src="{{ $image->temporaryUrl() }}" class="object-cover text-center mx-auto size-[120px] rounded-full">
                    @else
                        @if ($user->image != null)
                            <img src="{{ url('storage/'.$user->image) }}" alt="avatar" class="object-cover text-center mx-auto size-[120px] rounded-full">
                        @else
                            <img src="{{ url('storage/avatar/user.png') }}" alt="avatar" class="object-cover text-center mx-auto size-[120px] rounded-full">
                        @endif
                    @endif 
                </div>
                <div>
                    <x-upload label="Avatar" wire:model="image" required />
                </div>
                <div>
                    <x-select.styled label="{{ __('Gender') }} *" wire:model="user.gender" required :options="[
                        ['label' => 'Laki - Laki', 'value' => 'L'],
                        ['label' => 'Perempuan', 'value' => 'P'],
                    ]" />
                </div>
                <div>
                    <x-input label="{{ __('Tempat Lahir') }} *" wire:model="user.tempat_lahir" required />
                </div>
                <div>
                    <x-date label="{{ __('Tanggal Lahir') }} *" wire:model="user.tanggal_lahir" required />
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
                    ]" />
                </div>
                <div>
                    {{-- <x-input label="{{ __('Grup') }}" wire:model="user.grup" /> --}}
                    <x-select.styled label="{{ __('Grup') }} *" wire:model="user.grup" required :options="[
                        ['label' => 'Kendal', 'value' => 'Kendal'],
                        ['label' => 'Batang', 'value' => 'Batang'],
                        ['label' => 'Semarang', 'value' => 'Semarang'],
                        ['label' => 'Temanggung', 'value' => 'Temanggung'],
                        ['label' => 'Pekalongan', 'value' => 'Pekalongan'],
                        ['label' => 'Tegal', 'value' => 'Tegal'],
                        ['label' => 'Gunungkidul', 'value' => 'Gunungkidul'],
                    ]" />                     
                </div>

                <div>
                    @if ($image_id) 
                        <img src="{{ $image_id->temporaryUrl() }}" class="object-cover text-center mx-auto w-50 aspect-[16/11]">
                    @else
                        @if ($user->image_id != null)
                            <img src="{{ url('storage/'.$user->image_id) }}" alt="foto_id" class="object-cover text-center mx-auto w-50 aspect-[16/11]">
                        @else
                            <img src="{{ url('storage/image_id/image_id.png') }}" alt="foto_id" class="object-cover text-center mx-auto w-50 aspect-[16/11]">
                        @endif
                    @endif
                </div>
                <div>
                    <x-upload label="Foto KTP" wire:model="image_id" required />
                </div>
                <div>
                    <x-input label="{{ __('No. ID / KTP / Passport') }} *" wire:model="user.no_id" required />
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
