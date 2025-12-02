<div>
    <x-icon name="plus" 
    wire:click="$toggle('modal'); $dispatch('open::createjurnalamal', { date: datesort.value })"
     class="text-white size-7 bg-primary-500 p-1 rounded-md cursor-pointer"/>

    <x-modal :title="__('Catatan Baru')" wire center>
        <x-loading /> 
        <form id="jurnalamal-create" wire:submit="save" class="space-y-4">
            <div class="flex justify-center">
                <x-date wire:model="date" format="dddd, DD MMM YYYY" required 
                {{-- wire:change="onDateChange" --}}
                />
            </div>
            <div>
                <x-select.styled label="{{ __('Amalan') }} *"  wire:model.live="challenge" :options="$tantangan" searchable required wire:change="clearVariant"/>
            </div>
            <div>
                <x-select.styled label="{{ __('Capaian') }} *"  wire:model.live="challenge_variant" :options="$variant" required wire:change="cekInputManual"/>
            </div>
            <div class="{{ $hiddenValue }}">
                {{-- <x-number label="{{ __('Nilai') }} *" wire:model.blur="submitted_value" required centralized/> --}}
                <label>berapa {{ App\Models\ChallengeVariant::find($this->challenge_variant)?->name ?? '' }}? Tuliskan!</label>
                <div 
                    x-data="{
                        raw: @entangle('submitted_value'),
                        formatNumber(v) {
                            if (!v) return '';
                            v = v.toString().replace(/\D/g, '');
                            return v.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                        }
                    }"
                    x-init="
                        $nextTick(() => {
                            $el.querySelector('input').value = formatNumber(raw);
                        });
                    "
                >
                    <input
                        type="text"
                        inputmode="numeric"
                        autocomplete="off"
                        class="flex w-full items-center dark:bg-dark-800 bg-white border dark:border-dark-600 border-gray-300 rounded-lg px-2 py-2"
                        
                        @input="
                            let cleaned = $event.target.value.replace(/\D/g, '');
                            raw = cleaned;
                            $event.target.value = formatNumber(cleaned);
                        "

                        @blur="
                            $event.target.value = formatNumber(raw);
                        "

                        @paste.prevent="
                            let pasted = (event.clipboardData || window.clipboardData).getData('text');
                            pasted = pasted.replace(/\D/g,'');
                            raw = pasted;
                            $event.target.value = formatNumber(pasted);
                        "
                    >
                </div>                

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
