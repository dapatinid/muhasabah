<div @updated="$dispatch('name-updated', { name: $event.detail.name })" class="space-y-3 p-3">

    <div class="mx-auto max-w-lg mb-3">
    <x-card  color="primary">
        <x-slot:header>
            <div class="flex justify-between px-3 py-2">
                <span class="pt-1">@lang('Edit Akun')</span>
            </div>
        </x-slot:header>  
        <form id="update-profile" wire:submit="save">
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


</div>
