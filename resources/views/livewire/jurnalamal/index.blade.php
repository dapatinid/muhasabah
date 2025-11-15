<div class="space-y-3 p-3 pb-72">
    <div 
        x-data="{ show: true }" 
        x-init="
            const alert = $el.querySelector('[data-dismiss]');
            if (alert) {
                // intercept tombol close bawaan
                alert.addEventListener('click', (e) => {
                    e.preventDefault();
                    show = false;
                });
            }
            // auto-close setelah 15 detik
            setTimeout(() => show = false, 15000);
        " 
        class="relative overflow-hidden transition-all duration-700"
        :class="{ 'max-h-0 opacity-0': !show, 'max-h-40 opacity-100': show }"
    >
        <div
            x-show="show"
            x-transition:leave="transition ease-in-out duration-700"
            x-transition:leave-start="opacity-100 translate-y-0"
            x-transition:leave-end="opacity-0 -translate-y-3"
        >
            <x-alert color="cyan" icon="light-bulb" close>
                @lang($randomQuote)
            </x-alert>
        </div>
    </div>
    
    <div class="mb-4 flex justify-between items-center gap-3">
        <span class="pt-2">
            <x-dropdown icon="squares-2x2" position="bottom-start">
                <x-dropdown.items separator @click="$store.globalSelect.toggleSemua()"><span x-text="$store.globalSelect.allChecked ? 'Batal pilih semua' : 'Pilih semua'"></span></x-dropdown.items>
                <x-dropdown.items text="Hapus sekaligus" separator wire:click="hapussekaligus"/>
            </x-dropdown>
        </span>
        <x-date wire:model.live="datesort" format="dddd, DD MMM YYYY"/>
        <livewire:jurnalamal.create @created="$refresh" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        @foreach ($jurnalamal as $ja)
        <div
            wire:key="card-{{ $ja->id }}"
            x-data="selectCard({{ $ja->id }})"
            :class="checked ? 'ring-2 ring-inset ring-primary-500 bg-primary-100 dark:bg-primary-900 p-3 rounded-md  dark:text-white' : 'ring-0 shadow bg-white dark:bg-gray-900 p-3 rounded-md  dark:text-white'"
            class=""
        >
            <div class="flex flex-nowrap justify-between items-center">
                <div class="flex items-center gap-2">
                    <div @click="toggle()" class="relative cursor-pointer select-none">
                        <div :class="checked ? '' : 'hidden'" class="bg-primary-100 dark:bg-primary-900 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <x-icon name="check-circle" class="size-12 text-primary-500"/>
                        </div>
                        <img class="bg-cover bg-center size-10" src="{{ isset($ja->challenge->image) ? Str::replace('%2F', '/',url('storage', $ja->challenge->image)) : asset('storage/files/circle.png') }}" alt="{{ $ja->challenge->title }}">
                    </div>
                    <div class="block items-center space-y-1">
                        <input type="checkbox" value="{{ $ja->id }}" wire:model="selected" x-model="checked" class="hidden">
                        <div class="font-bold select-none leading-4">{{ $ja->challenge->title }}</div>
                        <div class="text-xs select-none leading-3">
                            {{ $ja->challengeVariant->is_manual_input == true ? Illuminate\Support\Number::format($ja->submitted_value, locale: 'de'). " " . $ja->challengeVariant->name : $ja->challengeVariant->name }}
                        </div>
                    </div>
                </div>

                <div class="flex justify-end items-center">
                    <span class="me-2">{{ (!empty($ja->note)) ? '✦' : null }}</span>
                    <x-badge text="{{ Illuminate\Support\Number::format($ja->earned_score, locale: 'de') }}" color="cyan" light md/>
<span class="relative inline-block" x-data="{ open: false }" @click.away="open = false">
    <!-- Tombol trigger -->
    <button 
        @click="open = !open" 
        class="-me-2 ms-1 py-2 rounded-full hover:bg-gray-200 transition"
    >
        <x-icon name="ellipsis-vertical" class="w-5 h-5" />
    </button>

    <!-- Isi dropdown di kiri -->
    <div 
        x-show="open" 
        x-transition
        class="absolute right-full mr-0 top-1/2 -translate-y-1/2 w-40 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-100 dark:border-gray-500 z-50"
    >
        <div class="grid grid-cols-3 text-gray-700">
            <!-- Detail -->
            <span 
                class="flex justify-center py-3 active:bg-primary-500 active:text-white hover:bg-primary-500 hover:text-white dark:text-gray-200 cursor-pointer rounded-l-lg"
                href="{{ route('jurnalamal.detail', $ja->challenge->id )}}"
                wire:navigate.hover
                @click="open = false"
            >
                <x-icon name="magnifying-glass" class="h-5 w-5" />
            </span>

            <!-- Edit -->
            <span 
                class="flex justify-center py-3 active:bg-primary-500 active:text-white hover:bg-primary-500 hover:text-white dark:text-gray-200 cursor-pointer"
                wire:click="$dispatch('load::jurnalamal', { jurnalamal : '{{ $ja->id }}'})"
                @click="open = false"
            >
                <x-icon name="pencil" class="h-5 w-5" />
            </span>

            <!-- Hapus -->
            <span 
                class="flex justify-center py-3 active:bg-red-500 active:text-white hover:bg-red-500 hover:text-white dark:text-gray-200 cursor-pointer rounded-r-lg"
                wire:click.stop="confirmHapus({{ $ja->id }})"
                @click="open = false"
            >
                <x-icon name="trash" class="h-5 w-5" />
            </span>
        </div>
    </div>
</span>
                </div>
            </div>
        </div>
        @endforeach
    </div>


{{-- <script>

document.addEventListener('livewire:navigated', () => {
    const path = window.location.pathname;
    const nav = performance.getEntriesByType('navigation')[0];
    const isReload = nav?.type === 'reload';
    const flag = sessionStorage.getItem('app:reloaded');

    // 🔹 Jika halaman selain /jurnal-amal direload penuh
    if (isReload && path !== '/jurnal-amal') {
        sessionStorage.setItem('app:reloaded', 'general');
    }

    // 🔹 Jika /jurnal-amal direload penuh
    if (isReload && path === '/jurnal-amal') {
        sessionStorage.setItem('app:reloaded', 'jurnal');
    }

    // 🔹 Jika sudah pernah reload di /jurnal-amal, jangan reload lagi di mana pun
    if (flag === 'jurnal') return;

    // 🔹 Jika di halaman lain dan belum pernah reload sama sekali
    if (path !== '/jurnal-amal' && !flag) {
        sessionStorage.setItem('app:reloaded', 'general');
        window.location.reload();
        return;
    }

    // 🔹 Jika di /jurnal-amal dan pernah reload di halaman lain (general)
    if (path === '/jurnal-amal' && flag === 'general') {
        sessionStorage.setItem('app:reloaded', 'jurnal');
        window.location.reload();
        return;
    }
});

</script> --}}


    <livewire:jurnalamal.update @updated="$refresh" />
</div>
