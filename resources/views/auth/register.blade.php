<x-guest-layout>
    <div class="flex items-center justify-center">
        <img src="{{ asset('storage/files/alquran.png') }}" class="size-56"/>
        {{-- STRIKEFEST 2025 --}}
    </div>

    <form method="POST" action="{{ route('register') }}">
        @csrf

        <div>
            <x-input label="Name *" name="name" :value="old('name')" required autofocus autocomplete="name" placeholder="Nama Lengkap" />
        </div>

        <div class="mt-4">
            <x-input label="No. Whatsapp *" type="number" name="phone" :value="old('phone')" required autocomplete="phone" placeholder="Contoh : 085950540055" />
        </div>

        <div class="mt-4">
            <x-input label="Email" type="email" name="email" :value="old('email')" placeholder="Tidak wajib isi, bisa kosongkan dulu" autocomplete="username" />
        </div>

        <div class="mt-4">
            <x-password label="Password *" name="password" required autocomplete="new-password" placeholder="tulis password baru" hint="minimal panjang 8 huruf / angka"/>
        </div>

        <div class="mt-4">
            <x-password label="Confirm Password *" name="password_confirmation" required autocomplete="new-password" placeholder="tulis ulang password diatas" />
        </div>

        <div class="flex items-center justify-end my-6">
            <x-button type="submit" class="w-full">
                {{ __('Daftar') }}
            </x-button>
        </div>
    </form>

    <div class="text-center">
            Sudah punya akun? <a class="underline text-sm text-gray-600 hover:text-gray-900 rounded-md" href="{{ route('login') }}">
                {{ __('Masuk disini') }}
            </a>
    </div>
</x-guest-layout>
