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
