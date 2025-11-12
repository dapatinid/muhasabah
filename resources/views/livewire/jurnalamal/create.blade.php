<div>
    <x-icon name="plus" 
    wire:click="$toggle('modal'); $dispatch('open::createjurnalamal', { date: datesort.value })"
     class="text-white size-7 bg-primary-500 p-1 rounded-md cursor-pointer"/>

    <x-modal :title="__('Catatan Baru')" wire >
        <form id="jurnalamal-create" wire:submit="save" class="space-y-4">
            <div class="flex justify-center">
                <x-date wire:model="date" format="dddd, DD MMM YYYY" required 
                {{-- wire:change="onDateChange" --}}
                />
            </div>
            <div>
                <x-select.styled label="{{ __('Amalan') }}"  wire:model.live="challenge" :options="$tantangan" searchable required wire:change="clearVariant"/>
            </div>
            <div>
                <x-select.styled label="{{ __('Capaian') }}"  wire:model.live="challenge_variant" :options="$variant" searchable required wire:change="cekInputManual"/>
            </div>
            <div class="{{ $hiddenValue }}">
                <x-number label="{{ __('Nilai') }} *" wire:model.blur="submitted_value" required centralized/>
            </div>
            <div class="hidden">
                <x-number label="{{ __('Score') }} *" wire:model="earned_score" required centralized />
            </div>
            <div>
                <x-input label="{{ __('Catatan') }}" wire:model="note" />
            </div>
            <div>
                <p>{{ $deskripsi }}</p>
            </div>

        </form>
        <x-slot:footer>
            <x-button type="submit" form="jurnalamal-create" class="w-full md:w-auto">
                @lang('Save')
            </x-button>
        </x-slot:footer>
    </x-modal>
</div>
