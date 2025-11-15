<div @updated="$dispatch('name-updated', { name: $event.detail.name })" class="space-y-3 p-3">
    
    <div class="relative mb-18">
        @if ($image) 
            <img src="{{ $image->temporaryUrl() }}" class="absolute left-1/2 transform -translate-x-1/2 object-cover text-center mx-auto size-[120px] rounded-full">
        @else
            @if ($user->image != null)
                <img src="{{ url('storage/'.$user->image) }}" alt="avatar" class="absolute left-1/2 transform -translate-x-1/2 object-cover text-center mx-auto size-[120px] rounded-full">
            @else
                <img src="{{ url('storage/avatar/user.png') }}" alt="avatar" class="absolute left-1/2 transform -translate-x-1/2 object-cover text-center mx-auto size-[120px] rounded-full">
            @endif
        @endif
    </div>

    <div class="mx-auto max-w-lg mb-3">
    <x-card>
        <form id="update-profile" wire:submit="save">
            <div class="space-y-6 pt-10">

                <div>
                    <x-upload label="Avatar" wire:model="image" required close-after-upload/>
                </div>
                <div>
                    <x-input label="{{ __('Name') }} *" wire:model="user.name" required />
                </div>
                <div>
                    <x-input label="{{ __('No. Whatsapp') }} *" wire:model="user.phone" required />
                </div>
                <div>
                    <x-input label="{{ __('Email') }} *" value="{{ $user->email }}" disabled />
                </div>
                <div>
                    <x-password :label="__('Password')"
                                :hint="__('Kosongkan jika tidak ingin ubah password')"
                                wire:model="password"
                                rules
                                generator
                                x-on:generate="$wire.set('password_confirmation', $event.detail.password)" />
                </div>
                <div>
                    <x-password :label="__('Confirm password')" wire:model="password_confirmation" rules />
                </div>
            </div>
        </form>
        <x-slot:footer>
            <x-button type="submit" form="update-profile" class="w-full">
                @lang('Save')
            </x-button>
        </x-slot:footer>
    </x-card>
    </div>

    <div class="mx-auto max-w-lg mb-3">
    <x-card color="primary">
        <x-slot:header>
            <div class="flex justify-between px-3 py-2">
                <span class="pt-1">@lang('Data Diri')</span>
                <x-button href="/user/profile-data-diri" icon="pencil" wire:navigate.hover sm>
                    @lang('Edit')
                </x-button>
            </div>
        </x-slot:header>
        <div>
            {{ Auth::user()->gender === 'P' ? 'Perempuan' : 'Laki-Laki' }}, TTL : {{ Auth::user()->tempat_lahir }}, {{ Str::substr(Auth::user()->tanggal_lahir, 8, 2) }}-{{ Str::substr(Auth::user()->tanggal_lahir, 5, 2) }}-{{ Str::substr(Auth::user()->tanggal_lahir, 0, 4) }}, No.ID : {{ Auth::user()->no_id }}, Golongan Darah : {{ Auth::user()->golongan_darah }}, Grup : {{ Auth::user()->grup }}
        </div>
    </x-card>
    </div>

    <div class="mx-auto max-w-lg mb-3">
    <x-card color="primary">
        <x-slot:header>
            <div class="flex justify-between px-3 py-2">
                <span class="pt-1">@lang('Alamat')</span>
                <x-button href="/user/profile-alamat" icon="pencil" wire:navigate.hover sm>
                    @lang('Edit')
                </x-button>
            </div>
        </x-slot:header>        
        <div>
            {{ Auth::user()->street }} {{ Auth::user()->zip_code }}, {{ App\Models\Village::where('code',Auth::user()->village)->value('name') }}, {{ App\Models\District::where('code',Auth::user()->district)->value('name') }}, {{ App\Models\City::where('code',Auth::user()->city)->value('name') }}, {{ App\Models\Province::where('code',Auth::user()->state)->value('name') }}
        </div>
    </x-card>
    </div>
</div>
