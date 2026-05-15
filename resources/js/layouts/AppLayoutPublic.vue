<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { usePage, Link, router } from '@inertiajs/vue3'
import { Toaster, toast } from 'vue-sonner'
import 'vue-sonner/style.css'
import BottomNavigation from '@/components/BottomNavigation.vue'
import { ArrowLeft } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  subtitle?: string
  title?: string
  showBack?: boolean
  backHref?: string
  showNav?: boolean // Daftarkan di sini
}>(), {
  showBack: false,
  showNav: true // Set default ke true
})

const page = usePage()
const shouldShowNav = computed(() => props.showNav && !page.url.startsWith('/laporan-riyadhoh'))

// ── Flash toast via Inertia finish event ──────────────────────────────────────
const removeListener = router.on('finish', (event) => {
    const flash = page.props.flash as any;
    
    // Ambil pesan
    const msg = flash?.success || flash?.error || flash?.info;
    
    if (msg) {
        // Tampilkan toast berdasarkan jenisnya
        if (flash.success) toast.success(flash.success);
        else if (flash.error) toast.error(flash.error);
        else if (flash.info) toast.info(flash.info);

        // Hapus flash dari props secara paksa agar tidak muncul lagi
        // jika user melakukan navigasi internal (seperti klik menu nav)
        flash.success = null;
        flash.error = null;
        flash.info = null;
    }
});

onUnmounted(() => removeListener());

// ── Hide-on-scroll-up / show-on-scroll-down ───────────────────────────────────
const headerVisible = ref(true)
let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0 // Pastikan sinkron dengan posisi awal
const THRESHOLD = 10 // Naikkan sedikit threshold-nya

function onScroll() {
  const currentY = window.scrollY
  
  // Jika di paling atas banget, paksa muncul
  if (currentY < 10) {
    headerVisible.value = true
    lastScrollY = currentY
    return
  }

  const delta = currentY - lastScrollY
  if (Math.abs(delta) < THRESHOLD) return

  // Logika sembunyikan: jika scroll ke bawah dan sudah melewati area header
  if (delta > 0 && currentY > 80) {
    headerVisible.value = false
  } else if (delta < 0) {
    // Tampilkan jika scroll ke atas
    headerVisible.value = true
  }

  lastScrollY = currentY
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
  <link
    href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />

  <div
    class="min-h-screen bg-stone-950 relative overflow-x-hidden"
    style="font-family: 'Plus Jakarta Sans', sans-serif;"
  >
    <!-- Background pattern -->
<div
  class="fixed inset-0 z-0 opacity-[0.07] pointer-events-none"
  :style="{
    backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 325 325%22%3E%3Cg fill=%22none%22 stroke=%22%23D4A017%22 stroke-width=%225%22%3E%3Cpath d=%22M324.268 160.718l-46.131-46.13V49.349c0-1.381-1.119-2.5-2.5-2.5h-65.24L164.268.718c-.938-.938-2.598-.938-3.535 0l-46.129 46.131H49.361c-1.381 0-2.5 1.119-2.5 2.5v65.239l-46.129 46.13c-.976.977-.976 2.559 0 3.535l46.129 46.13v65.239c0 1.381 1.119 2.5 2.5 2.5h65.242l46.129 46.131c.469.469 1.104.732 1.768.732.663 0 1.299-.264 1.768-.732l46.129-46.131h65.24c1.381 0 2.5-1.119 2.5-2.5v-65.239l46.131-46.13c.469-.469.732-1.104.732-1.768 0-1.076-.263-1.712-.732-2.18zM242.17 195.485v46.668h-46.672l-32.998 33-32.998-33H82.828v-46.668l-32.996-33 32.996-33V82.817h46.674l32.998-33l32.998 33h46.672v46.668l32.998 33-32.998 33z%22/%3E%3Cpath d=%22M228.893 96.097h-38.896L162.5 68.596l-27.498 27.501H96.107v38.889l-27.498 27.5 27.498 27.5v38.889h38.895l27.498 27.501l27.496-27.501h38.896v-38.889l27.498-27.5-27.498-27.5V96.097zm-18.665 78.595h-18.262l12.912 12.91.664 17.926-17.926-.664-12.912-12.911v18.259L162.5 223.356l-12.205-13.145v-18.261l-12.912 12.913-17.926.664.664-17.926 12.912-12.912-18.26.002-13.144-12.207 13.144-12.205 18.26-.002-12.912-12.91-.664-17.926 17.926.664 12.912 12.912v-18.26l12.205-13.145 12.205 13.145v18.26l12.912-12.912 17.926-.664-.664 17.926-12.912 12.912h18.262l13.141 12.205-13.141 12.205z%22/%3E%3Cpolygon points=%22150.768,134.162 134.174,150.755 134.174,174.217 150.766,190.809 174.232,190.809 190.822,174.219 190.822,150.753 174.232,134.162%22/%3E%3C/g%3E%3C/svg%3E')`,
    backgroundSize: '120px 120px',
  }"
/>
    <div
      class="fixed inset-0 z-0 pointer-events-none"
      style="background: radial-gradient(ellipse at 50% 0%, rgba(120,90,40,0.12) 0%, transparent 60%)"
    />

    <div class="relative z-10 max-w-xl mx-auto sm:border-x sm:border-stone-800 min-h-screen">

      <div class="fixed top-0 left-0 z-[101] h-1 w-full bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700 shadow-[0_1px_10px_rgba(251,191,36,0.3)]"></div>

      <!-- ── Smart Header ────────────────────────────────────────────────────── -->
      <nav
        :class="[
            'fixed top-0 inset-x-0 z-[100] max-w-xl mx-auto',
            'bg-stone-950/80 backdrop-blur-md border-b border-stone-800/50',
            'sm:border-x sm:border-stone-800',   // ← tambah ini
            'px-5 flex items-center gap-3',
            'transition-transform duration-300 ease-in-out',
            headerVisible ? 'translate-y-0' : '-translate-y-full',
        ]"
      >
        <!-- Tombol back (opsional) -->
        <Link
          v-if="showBack"
          :href="backHref ?? '/'"
          class="my-4 w-9 h-9 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-500/40 transition-all shrink-0"
        >
          <ArrowLeft class="size-4" />
        </Link>

        <!-- Teks header -->
        <div v-if="title || subtitle" class="flex-1 min-w-0">
          <p
            v-if="subtitle"
            class="text-[10px] text-amber-500 tracking-[0.2em] uppercase font-bold truncate"
          >
            {{ subtitle }}
          </p>
          <h1
            v-if="title"
            class="text-base font-bold text-stone-100 leading-tight truncate"
            style="font-family: 'Amiri', serif;"
          >
            {{ title }}
          </h1>
        </div>

        <!-- Slot untuk konten kustom di header (e.g. avatar, action button) -->
        <slot name="header" />
      </nav>

      <!-- ── Main Content ───────────────────────────────────────────────────── -->
      <main :class="[shouldShowNav ? 'pb-32' : 'pb-10', 'pt-8']">
        <slot />
      </main>

      <!-- ── Bottom Navigation ──────────────────────────────────────────────── -->
      <BottomNavigation v-if="shouldShowNav" />
    </div>

    <!-- ── Toast ─────────────────────────────────────────────────────────────── -->
    <Toaster position="top-right" richColors />
  </div>
</template>