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
                    <span class="pt-2">
                        <x-dropdown icon="ellipsis-vertical" static>
                            <x-dropdown.items 
                                icon="magnifying-glass"
                                text="Lihat Progress"
                                href="{{ route('jurnalamal.detail',  $ja->challenge->id )}}"
                                wire:navigate.hover
                            />
                            <x-dropdown.items 
                                icon="pencil"
                                text="Edit Catatan"
                                separator
                                wire:click="$dispatch('load::jurnalamal', { 'jurnalamal' : '{{ $ja->id }}'})"
                            />
                            <x-dropdown.items 
                                icon="trash"
                                text="Hapus Catatan"
                                separator
                                wire:click.stop="confirmHapus({{ $ja->id }})"
                            />
                        </x-dropdown>
                    </span>
                </div>
            </div>
        </div>
        @endforeach
    </div>


<script>


document.addEventListener('alpine:init', () => {
    // Komponen card individual
    Alpine.data('selectCard', (id) => ({
        id,
        checked: false,
        toggle() {
            this.checked = !this.checked;
            const checkbox = this.$root.querySelector('input[type="checkbox"]');
            checkbox.checked = this.checked;
            checkbox.dispatchEvent(new Event('input', { bubbles: true }));
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));

            // setiap kali toggle, perbarui status global
            Alpine.store('globalSelect').updateStatus();
        },
    }));

    // Store global untuk toggle semua
    Alpine.store('globalSelect', {
        allChecked: false, // status global
        toggleSemua() {
            const cards = document.querySelectorAll('[x-data^="selectCard"]');
            const targetState = !this.allChecked; // toggle state baru

            cards.forEach((el) => {
                const checkbox = el.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = targetState;
                    checkbox.dispatchEvent(new Event('input', { bubbles: true }));
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                    if (el.__x) {
                        el.__x.$data.checked = targetState;
                    }
                }
            });

            this.allChecked = targetState;
        },
        updateStatus() {
            const cards = document.querySelectorAll('[x-data^="selectCard"]');
            if (cards.length === 0) {
                this.allChecked = false;
                return;
            }
            this.allChecked = Array.from(cards).every(el => {
                const input = el.querySelector('input[type="checkbox"]');
                return input && input.checked;
            });
        },
    });
});

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

</script>


    <livewire:jurnalamal.update @updated="$refresh" />
</div>
