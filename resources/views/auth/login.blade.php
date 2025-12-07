<x-guest-layout>
    <div class="flex items-center justify-center">
        <img src="{{ asset('storage/files/alquran.png') }}" class="size-56"/>
    </div>

    <form method="POST" action="{{ route('login') }}">
        @csrf

        <div class="space-y-4">
            {{-- <x-input label="Email *" type="email" name="email" :value="old('email', 'test@example.com')" required autofocus autocomplete="username" /> --}}
            <x-input label="No. Whatsapp *" type="number" name="phone"  required autofocus autocomplete="phone" />

            <x-password label="Password *" type="password" name="password" required autocomplete="current-password" />
        </div>

        <div class="block mt-4">
            <x-checkbox label="Remember me" id="remember_me" type="checkbox" name="remember" />
        </div>

        <div class="flex items-center justify-between mt-4">
                <div class="flex items-center justify-start">
                    <a href="https://wa.me/62085950540055?text=Mohon%20bantu%20saya%2C%20saya%20telah%20lupa%20password.%0ANama%20%3A%0Aemail%20%3A" 
                    {{-- href="https://wa.me/62{{ App\Models\Setting::get()->first()->phone ?? 0 }}"  --}}
                        target="_blank">Lupa Password?</a>
                </div>
                <div class="flex items-center justify-end mb-6">
                    <x-button type="submit" class="ms-3">
                        {{ __('Masuk') }}
                    </x-button>
                </div>
        </div>
    </form>
    @if (Route::has('register'))
    <div  class="text-center border-t-2 pt-4">
        Belum punya akun?<a class="underline text-sm text-gray-600 hover:text-gray-900 rounded-md" href="{{ route('register') }}">
            {{ __('Daftar disini') }}
        </a>
    </div>
    @endif
    <script>
    document.addEventListener('livewire:navigated', () => {
        fetch('/login/check', { cache: "no-store" })
            .then(res => res.json())
            .then(data => {
                if (data.authenticated) {
                    window.location.reload();
                }
            });
    });
    </script>    
</x-guest-layout>
