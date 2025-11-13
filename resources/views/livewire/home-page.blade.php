<div class="bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen flex flex-col">
 
    <!-- Header -->
    <header x-data="{ open: false }" class="flex justify-between items-center px-8 py-6">
        <h1 class="text-2xl font-bold text-indigo-700 flex items-center gap-2">
            <span class="text-3xl">📖</span>
            <span>Muhasabah.id</span>
        </h1>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex space-x-4 items-center">
            <a href="https://wa.me/62085950540055" target="_blank" class="text-gray-700 hover:text-indigo-700">Tanya</a>
            <a href="#tentang" class="text-gray-700 hover:text-indigo-700">Tentang</a>
            <a href="#bergabung" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                Bergabung
            </a>
        </nav>

        <!-- Mobile Menu Button -->
        <button @click="open = !open" class="md:hidden text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-2">
            <svg x-show="!open" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg x-show="open" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <!-- Mobile Dropdown -->
        <div x-show="open" x-transition
            class="absolute top-20 left-0 w-full bg-white border-t border-gray-100 shadow-md md:hidden">
            <nav class="flex flex-col text-center py-4 space-y-2">
                <a href="https://wa.me/62085950540055" target="_blank" @click="open = false" class="text-gray-700 hover:text-indigo-700">Tanya</a>
                <a href="#tentang" @click="open = false" class="text-gray-700 hover:text-indigo-700">Tentang</a>
                <a href="#bergabung" @click="open = false"
                  class="bg-indigo-600 text-white px-4 py-2 mx-auto rounded-lg hover:bg-indigo-700 transition w-32">
                  Bergabung
                </a>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <main class="flex flex-col items-center text-center mt-20 px-6">
        <h2 class="text-4xl font-bold text-gray-800 mb-4">
            Catat & Renungkan Ibadah Harianmu
        </h2>
        <p class="text-gray-600 max-w-2xl mb-8">
            <strong>Muhasabah</strong> membantu kamu menjaga konsistensi ibadah harian
            melalui jurnal amal pribadi yang mudah digunakan.  
            Refleksi diri setiap hari untuk menjadi lebih baik dari hari kemarin.
        </p>
        <a href="/jurnal-amal"
           class="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition shadow">
           Mulai Sekarang
        </a>
    </main>

    <!-- Tentang -->
    <section id="tentang" class="mt-32 px-8 text-center">
        <h3 class="text-2xl font-semibold text-indigo-700 mb-4">Tentang Muhasabah</h3>
        <p class="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Aplikasi <strong>Muhasabah</strong> dirancang untuk membantu setiap muslim 
            dalam merefleksikan amal dan ibadah hariannya.  
            Dengan tampilan yang ringan dan ramah pengguna, kamu bisa mencatat salat, tilawah, sedekah, dan amalan lain kapan pun.
        </p>
    </section>

    <!-- Ajakan -->
    <section id="bergabung" class="mt-20 text-center bg-indigo-50 py-16 px-8">
        <h3 class="text-3xl font-bold text-indigo-800 mb-6">Ayo Mulai Muhasabah Diri Hari Ini</h3>
        <p class="text-gray-700 mb-8 max-w-xl mx-auto">
            Daftar sekarang dan jadikan setiap hari lebih bermakna dengan mencatat kebaikanmu.
        </p>
        <a href="/register"
           class="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition">
           Daftar Gratis
        </a>
    </section>

    <!-- Footer -->
    <footer class="mt-auto text-center text-gray-500 py-6 border-t border-t-blue-200">
        <p>© 2025 Muhasabah.id • Semua hak dilindungi.</p>
    </footer>
  
</div>