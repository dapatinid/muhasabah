<div class="">
  <!-- NAV -->
  <header class="{{ request()->is('/') ? 'fixed' : 'hidden' }}  top-0 left-0 right-0 z-40 bg-white/90 shadow">
    <nav class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <img src="{{ asset('storage/files/alquran.png') }}" alt="Logo" class="w-12 h-12">
        <h1 class="font-bold text-lg text-sky-700">Muhasabah.id</h1>
      </div>
      <div class="flex items-center gap-6 text-sm font-medium">
        <a href="#info" class="hidden md:flex hover:text-sky-700">Informasi Event</a>
        {{-- <a href="#panduan" class="hidden md:flex hover:text-sky-700">Panduan Event</a>
        <a href="#galeri" class="hidden md:flex hover:text-sky-700">Galeri</a> --}}
        {{-- <a href="#sponsor" class="hidden md:flex hover:text-sky-700">Sponsor</a> --}}
        <a href="https://wa.me/62{{ $setting->phone ?? 0 }}" target="_blank" class="hidden md:flex hover:text-sky-700">Live Chat</a>
        @guest            
        <a href="/login" class="font-bold px-3 py-1 rounded-md bg-blue-300 hover:text-sky-700">LOGIN</a>
        @endguest
        @auth
        {{-- <a wire:navigate.hover href="/ticket" class="font-bold px-3 py-1 rounded-md bg-blue-300 hover:text-sky-700">TIKET <span class="{{ $myTicket > 0 ? 'absolute' : 'hidden'}} p-1 text-white bg-sky-600 rounded-full -mt-4">{{ $myTicket }}</span></a>     --}}
        <a href="{{ route('jurnalamal.index') }}" class="font-bold px-3 py-1 rounded-md bg-blue-300 hover:text-sky-700">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
          </svg>
        </a>    
        @endauth
      </div>
    </nav>
  </header>

  <!-- HERO -->
  <section class="pt-20 relative -mt-2">
    <div class="hero-bg h-[70vh] flex flex-col items-center justify-center text-center" style="background-image:url('https://images.unsplash.com/photo-1503423571797-2d2bb372094a?auto=format&fit=crop&w=1600&q=60')">
      <div class="p-8 glass rounded-2xl">
        <h2 class="text-4xl md:text-6xl font-extrabold text-sky-900">Workshop Lunas Utang #34</h2>
        <p class="mt-4 text-lg md:text-xl text-sky-800">15-16 November 2025 | Slawi - Tegal</p>
        <div id="countdown" class="mt-6 text-2xl font-bold text-sky-900"></div>
        {{-- <a href="#daftar" class="mt-6 inline-block px-6 py-3 bg-sky-700 text-white font-semibold rounded-xl shadow hover:bg-sky-800">Daftar Sekarang</a> --}}
      </div>
    </div>
  </section>

  <!-- Informasi Event -->
  <section id="info" class="bg-white mx-auto py-16 px-4 [&>ul]:list-disc [&>ul]:ml-5 ">
    <h3 class="text-3xl font-bold text-center mb-8 text-sky-700 ">Informasi Event</h3>
    <div class="flex justify-center text-center">
      <p class="text-gray-700 leading-relaxed">
        @php
            $paragraf = Illuminate\Support\Str::replace('<blockquote>', '<blockquote class="relative border-s-4 border-green-500 dark:border-green-300 py-5 ps-4 sm:ps-6 bg-zinc-100 dark:bg-zinc-800 "><div class="relative z-10"><p class="text-gray-700 dark:text-white"><em>', $setting->info_event ?? null);
              $paragraf = Illuminate\Support\Str::replace('</blockquote>', '</em></p></blockquote>', $paragraf);
              @endphp
        {!! $paragraf !!}
      </p>
    </div>
  </section>


  <!-- Live Chat -->
  <section id="chat" class="bg-sky-700 py-16 text-white text-center">
    <h3 class="text-3xl font-bold mb-6">Live Chat</h3>
    <p class="mb-4">Butuh bantuan atau informasi lebih lanjut? Hubungi kami melalui live chat di bawah ini.</p>
    <a href="https://wa.me/62{{ $setting->phone ?? 0 }}" target="_blank" class="px-6 py-3 bg-green-500 rounded-xl font-semibold hover:bg-green-600">Chat via WhatsApp</a>
  </section>

  <!-- Footer -->
  <footer class="bg-sky-900 text-white py-6 text-center">
    <p>&copy; 2025 Muhasabah | muhasabah.id</p>
  </footer>

  <script>
    // Countdown Timer
    const countdown = document.getElementById('countdown');
    const eventDate = new Date('Nov 15, 2025 08:00:00').getTime();
    setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate - now;
      if (distance < 0) {
        countdown.innerHTML = "Event Sedang Berlangsung!";
        return;
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      countdown.innerHTML = `${days}h ${hours}j ${minutes}m ${seconds}d`;
    }, 1000);
  </script>
</div>