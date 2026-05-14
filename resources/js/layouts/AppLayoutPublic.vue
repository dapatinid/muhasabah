<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { router, usePage, Link } from '@inertiajs/vue3'
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
const removeListener = router.on('finish', () => {
  const flash = page.props.flash as any
  if (flash?.success) toast.success(flash.success)
  if (flash?.error)   toast.error(flash.error)
  if (flash?.info)    toast.info(flash.info)
})

onUnmounted(() => removeListener())

// ── Hide-on-scroll-up / show-on-scroll-down ───────────────────────────────────
const headerVisible = ref(true)
let lastScrollY = 0
const THRESHOLD = 8 // px minimal sebelum trigger

function onScroll() {
  const currentY = window.scrollY
  const delta = currentY - lastScrollY

  if (Math.abs(delta) < THRESHOLD) return

  if (delta > 0 && currentY > 60) {
    // Scroll ke bawah → sembunyikan header
    headerVisible.value = false
  } else {
    // Scroll ke atas → tampilkan header
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
      class="fixed inset-0 z-0 opacity-10 pointer-events-none"
      :style="{
        backgroundImage: `url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22 viewBox=%220 0 80 80%22><path d=%22M40 0 L50 30 L80 40 L50 50 L40 80 L30 50 L0 40 L30 30 Z%22 fill=%22none%22 stroke=%22%23d4a017%22 stroke-width=%221%22/></svg>')`,
        backgroundSize: '100px 100px',
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
            'fixed top-0 inset-x-0 z-10 max-w-xl mx-auto',
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