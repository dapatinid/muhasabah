<div>
    <x-modal :title="__('Edit Catatan : :challenge_id', ['challenge_id' => $jurnalamal?->challenge->title])" wire>
        <form id="jurnalamal-update-{{ $jurnalamal?->id }}" wire:submit="save" class="space-y-4">
            <div class="flex justify-center">
                {{ Carbon\Carbon::parse($jurnalamal?->date)->translatedFormat('l, d M Y') }}
            </div>
            <div class="hidden">
                <x-date wire:model="jurnalamal.date" format="dddd, DD MMM YYYY" required />
            </div>
            <div>
                <x-select.styled label="{{ __('Amalan') }} *"  wire:model.live="jurnalamal.challenge_id" :options="$tantangan" searchable required wire:change="clearVariant"/>
            </div>
            <div>
                <x-select.styled label="{{ __('Capaian') }} *"  wire:model.live="jurnalamal.challenge_variant_id" :options="$variant" searchable required wire:change="cekInputManual"/>
            </div>
            <div class="{{ $hiddenValuenya }}">
                <x-number label="{{ __('Nilai') }} *" wire:model.blur="jurnalamal.submitted_value" required centralized />
            </div>
            <div class="hidden">
                <x-number label="{{ __('Score') }} *" wire:model="jurnalamal.earned_score" required centralized />
            </div>
            <div>
                <x-input label="{{ __('Catatan') }}" wire:model="jurnalamal.note" />
            </div>
            <div>
                <p>{{ $deskripsinya }}</p>
            </div>
        </form>
        <x-slot:footer>
            <x-button type="submit" form="jurnalamal-update-{{ $jurnalamal?->id }}" loading="save" class="w-full md:w-auto">
                @lang('Save')
            </x-button>
        </x-slot:footer>
    </x-modal>
</div>
