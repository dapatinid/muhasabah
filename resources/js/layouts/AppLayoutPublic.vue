<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { usePage, router } from '@inertiajs/vue3'
import { Toaster, toast } from 'vue-sonner'
import 'vue-sonner/style.css'
import BottomNavigation from '@/components/BottomNavigation.vue'
import { ArrowLeft } from 'lucide-vue-next'

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
const shouldShowNav = computed(() => props.showNav && !page.url.startsWith('/laporan-riyadhoh'))

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
          const senderName = payload.new.title || 'Pesan Baru'
          const messageText = payload.new.content || 'Ada pesan baru masuk ke obrolan Anda.'

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
const restoreScroll = (targetY: number) => {
  if (targetY <= 0) return
  const start = Date.now()
  const attempt = () => {
    if (document.body.scrollHeight >= targetY + window.innerHeight || Date.now() - start > 1000) {
      window.scrollTo({ top: targetY, behavior: 'instant' })
    } else {
      requestAnimationFrame(attempt)
    }
  }
  requestAnimationFrame(attempt)
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
      restoreScroll(targetScrollY)
      isNavigatingBack.value = false
    }
  })
}

// ── Tombol Back Browser (popstate) ───────────────────────────────────────────
const handlePopState = () => {
  isPopState.value = true

  let history = getHistory()
  if (history.length > 0) {
    history = history.slice(0, -1)
    localStorage.setItem('app_history', JSON.stringify(history))
  }

  const targetScrollY = history.length > 0 ? history[history.length - 1].scrollY : 0

  router.visit(window.location.href, {
    preserveScroll: false,
    replace: true,
    onFinish: () => {
      restoreScroll(targetScrollY)
      isPopState.value = false
    }
  })
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
    <div class="fixed inset-0 z-0 opacity-[0.125] pointer-events-none" :style="{ backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 325 325%22%3E%3Cg fill=%22none%22 stroke=%22%23D4A017%22 stroke-width=%225%22%3E%3Cpath d=%22M324.268 160.718l-46.131-46.13V49.349c0-1.381-1.119-2.5-2.5-2.5h-65.24L164.268.718c-.938-.938-2.598-.938-3.535 0l-46.129 46.131H49.361c-1.381 0-2.5 1.119-2.5 2.5v65.239l-46.129 46.13cc-.976.977-.976 2.559 0 3.535l46.129 46.13v65.239c0 1.381 1.119 2.5 2.5 2.5h65.242l46.129 46.131c.469.469 1.104.732 1.768.732.663 0 1.299-.264 1.768-.732l46.129-46.131h65.24c1.381 0 2.5-1.119 2.5-2.5v-65.239l46.131-46.13c.469-.469.732-1.104.732-1.768 0-1.076-.263-1.712-.732-2.18zM242.17 195.485v46.668h-46.672l-32.998 33-32.998-33H82.828v-46.668l-32.996-33 32.996-33V82.817h46.674l32.998-33l32.998 33h46.672v46.668l32.998 33-32.998 33z%22/%3E%3Cpath d=%22M228.893 96.097h-38.896L162.5 68.596l-27.498 27.501H96.107v38.889l-27.498 27.5 27.498 27.5v38.889h38.895l27.498 27.501l27.496-27.501h38.896v-38.889l27.498-27.5-27.498-27.5V96.097zm-18.665 78.595h-18.262l12.912 12.91.664 17.926-17.926-.664-12.912-12.911v18.259L162.5 223.356l-12.205-13.145v-18.261l-12.912 12.913-17.926.664.664-17.926 12.912-12.912-18.26.002-13.144-12.207 13.144-12.205 18.26-.002-12.912-12.91-.664-17.926 17.926.664 12.912 12.912v-18.26l12.205-13.145 12.205 13.145v18.26l12.912-12.912 17.926-.664-.664 17.926-12.912 12.912h18.262l13.141 12.205-13.141 12.205z%22/%3E%3Cpolygon points=%22150.768,134.162 134.174,150.755 134.174,174.217 150.766,190.809 174.232,190.809 190.822,174.219 190.822,150.753 174.232,134.162%22/%3E%3C/g%3E%3C/svg%3E')`, backgroundSize: '120px 120px' }" />

    <div class="fixed inset-0 z-0 pointer-events-none" style="background: radial-gradient(ellipse at 50% 0%, rgba(120,90,40,0.12) 0%, transparent 60%)" />

    <div class="relative z-10 max-w-xl mx-auto sm:border-x sm:border-stone-800 min-h-screen">
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

      <main :class="[shouldShowNav ? 'pb-32' : 'pb-10', 'pt-16']">
        <slot />
      </main>

      <BottomNavigation v-if="shouldShowNav" />
    </div>

    <Toaster position="top-right" richColors theme="dark" />
  </div>
</template>