<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { usePage, router } from '@inertiajs/vue3'
import { Toaster, toast } from 'vue-sonner'
import 'vue-sonner/style.css'
import BottomNavigation from '@/components/BottomNavigation.vue'
import { ArrowLeft } from 'lucide-vue-next'
import MasjidPattern from '@/components/MasjidPattern.vue';

// ── 1. Impor Supabase Client untuk Real-time ──────────────────────────────────
import { createClient } from '@supabase/supabase-js'

const props = withDefaults(defineProps<{
  subtitle?: string
  title?: string
  showBack?: boolean
  backHref?: string
  showNav?: boolean
}>(), {
  showBack: false,
  showNav: true
})

const page = usePage()
const shouldShowNav = computed(() => props.showNav && !page.url.startsWith('/laporan-riyadhoh') && !page.url.startsWith('/obrolan'))
const ifObrolan = computed(() => page.url.startsWith('/obrolan'))

// ── 2. Inisialisasi Client Supabase Sesuai Pola Ukhuwah.vue ────────────────────
const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
)

let realtimeChannel: any = null

// Fungsi untuk mengaktifkan pemantauan notifikasi chat global
const initRealtimeNotifications = () => {
  const authUserId = page.props.auth?.user ? String(page.props.auth.user.id) : null
  if (!authUserId) return

  realtimeChannel = supabase
    .channel('public:notifications_global_layout')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `audience=eq.${authUserId}`
      },
      (payload) => {
        // Cek jika tipe notifikasi adalah pesan baru
        if (payload.new.type === 'message.new') {
          
          // A. Selalu reload counter/state unread chat secara diam-diam agar badge counter di semua halaman sinkron
          router.reload({ only: ['messages', 'conversations', 'unread_chats_count'] })

          // B. Ambil detail konten pesan dari payload data notifications Anda
          // (Sesuaikan key 'title' dan 'content' dengan nama kolom asli di tabel notifications Anda)
          // console.log('Notifikasi pesan baru diterima:', payload.new)
          const senderName = payload.new.data.sender_name || 'Pesan Baru'
          const rawBody = payload.new.data.body_preview || 'Ada pesan baru masuk ke obrolan Anda.'
          const messageText = rawBody.length > 30 ? rawBody.substring(0, 30) + '...' : rawBody

          // C. Jangan tampilkan popup toast jika user sedang berada aktif di dalam halaman obrolan
          if (window.location.pathname.startsWith('/obrolan')) {
            return
          }

          // D. Tampilkan popup Sonner Toast secara instan
          playNotificationSound() // Mainkan suara notifikasi
          toast.success(senderName, {
            description: messageText,
            duration: 5000,
            action: {
              label: 'Buka',
              onClick: () => router.get('/obrolan')
            }
          })
        }
      }
    )
    .subscribe()
}

// ── History Helper ────────────────────────────────────────────────────────────
const getHistory = (): { path: string; scrollY: number }[] => {
  try {
    return JSON.parse(localStorage.getItem('app_history') || '[]')
  } catch {
    return []
  }
}

// ── Scroll Restore Helper ─────────────────────────────────────────────────────
// Karena banyak <img loading="lazy">, gambar baru mulai di-load browser saat
// posisinya mendekati viewport. Jadi kita tetap perlu "memaksa" scroll ke target
// (agar gambar di sekitar situ ke-trigger loading-nya), TAPI kita berhenti bukan
// berdasarkan waktu tetap, melainkan berdasarkan sinyal nyata bahwa halaman sudah
// selesai load: tinggi dokumen sudah stabil (tidak ada elemen/gambar baru yang
// mengubah layout) selama beberapa saat berturut-turut.
// ── Skeleton Overlay (menyembunyikan lompatan scroll selama transisi) ────────
const isPageLoading = ref(false)

const restoreScroll = (targetY: number, options?: { longWait?: boolean; onSettled?: () => void }) => {
  const notifySettled = () => options?.onSettled?.()

  if (targetY <= 0) {
    window.scrollTo({ top: 0, behavior: 'instant' })
    notifySettled()
    return
  }

  // Full remount (mis. dari handlePopState yang fetch ulang data) butuh waktu
  // lebih lama: DOM mulai dari nol, gambar lazy-load harus dipicu ulang satu
  // per satu seiring scroll mendekat, jadi progresnya bertahap, bukan instan.
  const maxWaitTime = options?.longWait ? 6000 : 3000
  const requiredStableTime = 250 // Tinggi dokumen harus tidak berubah selama 250ms berturut-turut
  const startTime = Date.now()

  let lastHeight = document.documentElement.scrollHeight
  let stableSince = Date.now()
  let rafId = 0

  const tick = () => {
    // Paksa posisi scroll ke target setiap frame, supaya gambar lazy-load di
    // sekitar area tersebut ikut ter-trigger oleh browser untuk mulai loading.
    window.scrollTo({ top: targetY, behavior: 'instant' })

    const currentHeight = document.documentElement.scrollHeight
    if (currentHeight !== lastHeight) {
      // Ada konten/gambar baru yang mengubah tinggi halaman -> reset penghitung stabil
      lastHeight = currentHeight
      stableSince = Date.now()
    }

    const reachedTarget = window.scrollY >= targetY - 5
    const heightStable = Date.now() - stableSince >= requiredStableTime
    const timedOut = Date.now() - startTime >= maxWaitTime

    if ((reachedTarget && heightStable) || timedOut) {
      // Pastikan posisi akhir presisi sebelum berhenti
      window.scrollTo({ top: targetY, behavior: 'instant' })
      cancelAnimationFrame(rafId)
      notifySettled()
      return
    }

    rafId = requestAnimationFrame(tick)
  }

  rafId = requestAnimationFrame(tick)
}

// ── Flags ─────────────────────────────────────────────────────────────────────
const isNavigatingBack = ref(false)
const isPopState = ref(false)

// ── Tombol Back (in-app) ──────────────────────────────────────────────────────
const handleBack = () => {
  if (props.backHref) {
    router.visit(props.backHref)
    return
  }

  let history = getHistory()

  if (history.length > 0) {
    history = history.slice(0, -1)
    localStorage.setItem('app_history', JSON.stringify(history))
  }

  const target      = history.length > 0 ? history[history.length - 1].path    : '/'
  const targetScrollY = history.length > 0 ? history[history.length - 1].scrollY : 0

  isNavigatingBack.value = true
  router.visit(target, {
    preserveScroll: false,
    replace: true,
    onFinish: () => {
      // Tunggu satu frame agar DOM Inertia + Vue selesai ter-mount sebelum mulai restore scroll
      requestAnimationFrame(() => {
        restoreScroll(targetScrollY)
        isNavigatingBack.value = false
      })
    }
  })
}

// ── Tombol Back Browser (popstate) ───────────────────────────────────────────
// Pendekatan disederhanakan supaya lebih pasti/predictable:
//
// Sebelumnya kita menunggu event 'navigate' (untuk mendeteksi swap otomatis
// Inertia dari cache) sebelum memicu reload data -- rantai ini rawan meleset
// urutannya. Sekarang kita langsung panggil `router.reload()` begitu popstate
// terjadi, dengan `preserveState: true`.
//
// Kenapa ini lebih baik:
// 1) `router.reload()` adalah visit SUNGGUHAN ke server -> onFinish DIJAMIN
//    terpicu (beda dengan mengandalkan 'navigate' yang sulit dipastikan urutannya).
// 2) `preserveState: true` membuat Inertia TIDAK me-remount komponen halaman --
//    ia hanya mem-patch props (data) ke komponen yang sudah ada. Karena
//    komponen & elemen DOM (termasuk <img> yang lazy-load) tidak dihancurkan,
//    gambar yang sudah ter-load TIDAK ikut reset -- ini otomatis menghindari
//    masalah "tinggi dokumen belum stabil" yang bikin scroll susah pas.
// 3) `preserveScroll: true` mencegah Inertia mereset scroll ke atas secara
//    otomatis -- kita kendalikan sendiri lewat restoreScroll setelah data fresh masuk.
let pendingPopStateCleanup: (() => void) | null = null

const handlePopState = () => {
  // Kalau ada proses popstate sebelumnya yang belum selesai (misal user pencet
  // tombol back berkali-kali dengan cepat), batalkan dulu supaya tidak tumpang tindih
  if (pendingPopStateCleanup) {
    pendingPopStateCleanup()
    pendingPopStateCleanup = null
  }

  isPopState.value = true
  isPageLoading.value = true // Tutup layar dengan skeleton sampai data & posisi scroll benar-benar siap

  let history = getHistory()
  if (history.length > 0) {
    history = history.slice(0, -1)
    localStorage.setItem('app_history', JSON.stringify(history))
  }

  const targetScrollY = history.length > 0 ? history[history.length - 1].scrollY : 0

  let cancelled = false

  const finalize = () => {
    isPageLoading.value = false
    isPopState.value = false
    pendingPopStateCleanup = null
  }

  // Jaring pengaman keseluruhan: apa pun yang terjadi, jangan biarkan skeleton
  // menggantung selamanya kalau reload gagal/lambat
  const hardSafetyTimer = setTimeout(finalize, 8000)

  router.reload({
    preserveScroll: true,
    preserveState: true,
    onFinish: () => {
      if (cancelled) return
      clearTimeout(hardSafetyTimer)

      // DOM tidak di-remount (preserveState:true), jadi tinggi halaman sudah
      // representatif -- cukup tunggu 1 frame untuk memastikan Vue selesai
      // mem-patch data terbaru, baru pulihkan posisi scroll.
      requestAnimationFrame(() => {
        restoreScroll(targetScrollY, { onSettled: finalize })
      })
    }
  })

  pendingPopStateCleanup = () => {
    cancelled = true
    clearTimeout(hardSafetyTimer)
    isPageLoading.value = false
  }
}

// ── Flash Toast ───────────────────────────────────────────────────────────────
const removeFinishListener = router.on('finish', () => {
  const flash = page.props.flash as any
  if (flash?.success) toast.success(flash.success)
  else if (flash?.error) toast.error(flash.error)
  else if (flash?.info) toast.info(flash.info)
  if (flash) { flash.success = null; flash.error = null; flash.info = null }
})

// ── Rekam Scroll + Path sebelum navigasi ─────────────────────────────────────
const removeBeforeListener = router.on('before', () => {
  if (isNavigatingBack.value || isPopState.value) return

  const currentPath = window.location.pathname + window.location.search
  let history = getHistory()

  if (history.length > 0 && history[history.length - 1].path === currentPath) {
    history[history.length - 1].scrollY = window.scrollY
  } else {
    history.push({ path: currentPath, scrollY: window.scrollY })
  }

  if (history.length > 10) history = history.slice(-10)
  localStorage.setItem('app_history', JSON.stringify(history))
})

// ── Lifecycle Hooks ───────────────────────────────────────────────────────────
onMounted(() => {
  // Matikan restorasi scroll bawaan browser: kita kontrol posisi scroll sepenuhnya
  // secara manual (lewat restoreScroll), supaya tidak saling rebutan/konflik
  // dengan mekanisme scroll-restore native browser saat back/forward.
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
  }

  window.addEventListener('popstate', handlePopState)
  // Aktifkan channel real-time notifikasi chat global
  initRealtimeNotifications()

  // 🔔 Tambahkan ini untuk membuka gembok proteksi audio Safari iOS
  document.addEventListener('click', unlockAudioForIOS, { passive: true })
  document.addEventListener('touchstart', unlockAudioForIOS, { passive: true })  
})

onUnmounted(() => {
  window.removeEventListener('popstate', handlePopState)
  removeFinishListener()
  removeBeforeListener()

  // Bersihkan listener/timer restore popstate yang mungkin masih menggantung
  if (pendingPopStateCleanup) {
    pendingPopStateCleanup()
    pendingPopStateCleanup = null
  }
  isPageLoading.value = false
  
  // Bersihkan channel Supabase saat berganti layout utama agar tidak bocor memori
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel)
  }

  // 🔔 Bersihkan juga listener audio jika user langsung keluar halaman sebelum sempat klik
  document.removeEventListener('click', unlockAudioForIOS)
  document.removeEventListener('touchstart', unlockAudioForIOS)
})

// ── Hide/show header on scroll ────────────────────────────────────────────────
const headerVisible = ref(true)
let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0
const THRESHOLD = 10

function onScroll() {
  const currentY = window.scrollY
  if (currentY < 10) { headerVisible.value = true; lastScrollY = currentY; return }
  const delta = currentY - lastScrollY
  if (Math.abs(delta) < THRESHOLD) return
  headerVisible.value = delta <= 0 || currentY <= 80
  lastScrollY = currentY
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

// ── INJEKSI AUDIO NOTIFIKASI ─────────────────────────────────────────────────
let notificationAudio: HTMLAudioElement | null = null

// Fungsi inisialisasi awal (dipanggil saat interaksi pertama user)
const unlockAudioForIOS = () => {
  if (!notificationAudio) {
    notificationAudio = new Audio('/mixkit-correct-answer-tone-2870.wav')

    // 🔇 Bisukan dulu saat proses "unlock" agar tidak terdengar bunyi acak
    // setiap kali user tap/klik pertama kali di halaman manapun.
    notificationAudio.volume = 0

    // Putar sejenak (senyap) untuk memicu izin iOS Safari, lalu langsung hentikan
    notificationAudio.play()
      .then(() => {
        notificationAudio!.pause()
        notificationAudio!.currentTime = 0
        // Kembalikan volume ke level normal untuk notifikasi asli nanti
        notificationAudio!.volume = 0.5

        // Jika sukses dipicu oleh user gesture, bersihkan event listener agar tidak boros memori
        document.removeEventListener('click', unlockAudioForIOS)
        document.removeEventListener('touchstart', unlockAudioForIOS)
      })
      .catch(err => {
        // Tetap kembalikan volume walau gagal, agar tidak nyangkut di 0
        notificationAudio!.volume = 0.5
        console.log('iOS Audio unlock failed:', err)
      })
  }
}

// Fungsi utama untuk memutar suara chat masuk
const playNotificationSound = () => {
  // Jika belum di-unlock (kasus user belum menyentuh layar tapi chat masuk)
  if (!notificationAudio) {
    notificationAudio = new Audio('/mixkit-correct-answer-tone-2870.wav')
    notificationAudio.volume = 0.5
  }

  // Set ulang durasi ke awal agar jika ada chat beruntun, suara tetap keluar
  notificationAudio.currentTime = 0
  
  notificationAudio.play().catch(error => {
    console.log('Audio playback blocked on iOS:', error)
  })
}
</script>

<template>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
  <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

  <div class="min-h-screen bg-stone-950 relative overflow-x-hidden" style="font-family: 'Plus Jakarta Sans', sans-serif;">
    <MasjidPattern />

    <div class="fixed inset-0 z-0 pointer-events-none" style="background: radial-gradient(ellipse at 50% 0%, rgba(120,90,40,0.12) 0%, transparent 60%)" />

    <div :class="!ifObrolan ? 'mx-auto max-w-xl' : 'w-full lg:max-w-xl bg-zinc-950'" class="relative  z-10 sm:border-x sm:border-stone-800 min-h-screen">
      <div class="fixed top-0 left-0 z-101 h-1 w-full bg-linear-to-r from-amber-700 via-amber-400 to-amber-700 shadow-[0_1px_10px_rgba(251,191,36,0.3)]"></div>

      <nav :class="['fixed top-0 inset-x-0 z-100 pt-0.5 max-w-xl mx-auto bg-stone-950/80 backdrop-blur-md border-b border-stone-800/50 sm:border-x sm:border-stone-800 px-5 flex items-center gap-3 transition-transform duration-300 ease-in-out', headerVisible ? 'translate-y-0' : '-translate-y-full']">
        <button
          v-if="showBack"
          @click="handleBack"
          class="my-4 w-9 h-9 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-500/40 transition-all shrink-0"
        >
          <ArrowLeft class="size-4" />
        </button>
        <div v-if="title || subtitle" class="flex-1 min-w-0">
          <p v-if="subtitle" class="text-[10px] text-amber-500 tracking-[0.2em] uppercase font-bold truncate">{{ subtitle }}</p>
          <h1 v-if="title" class="text-base font-bold text-stone-100 leading-tight truncate" style="font-family: 'Amiri', serif;">{{ title }}</h1>
        </div>
        <slot name="header" />
      </nav>

      <main :class="[shouldShowNav ? 'pb-30' : 'pb-10', 'pt-16']">
        <slot />
      </main>

      <BottomNavigation v-if="shouldShowNav" />
    </div>

    <!-- Skeleton Overlay: menutupi layar selama proses kembali (popstate) berlangsung,
         supaya user tidak pernah melihat lompatan/pergeseran posisi scroll -->
    <transition name="skeleton-fade">
      <div
        v-if="isPageLoading"
        class="fixed inset-0 z-201 bg-stone-950 overflow-hidden px-5 pt-20 pb-10 space-y-6"
      >
        <div v-for="n in 4" :key="n" class="space-y-3 animate-pulse">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-stone-800"></div>
            <div class="space-y-1.5">
              <div class="h-3 w-24 bg-stone-800 rounded"></div>
              <div class="h-2.5 w-16 bg-stone-800/70 rounded"></div>
            </div>
          </div>
          <div class="h-3.5 w-2/3 bg-stone-800 rounded"></div>
          <div class="h-3 w-full bg-stone-800/70 rounded"></div>
          <div class="h-3 w-5/6 bg-stone-800/70 rounded"></div>
          <div class="h-56 sm:h-72 w-full bg-stone-800/60 rounded-xl"></div>
        </div>
      </div>
    </transition>

    <Toaster position="top-right" richColors theme="system"/>
  </div>
</template>

<style scoped>
.skeleton-fade-enter-active,
.skeleton-fade-leave-active {
  transition: opacity 0.15s ease;
}
.skeleton-fade-enter-from,
.skeleton-fade-leave-to {
  opacity: 0;
}
</style>