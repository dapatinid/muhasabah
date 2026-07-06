<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue' // Tambahkan computed
import { Head, router, useForm, usePage, Link } from '@inertiajs/vue3'
import { createClient } from '@supabase/supabase-js'
import AppLayoutPublic from '@/layouts/AppLayoutPublic.vue'
import { ArrowLeft, Send, X, Search, RefreshCw, Rocket, LoaderCircle } from 'lucide-vue-next'

const props = defineProps<{
    conversations: any[];
    activeChat?: any;
    messages?: any[];
}>()

const messagesContainer = ref<HTMLElement | null>(null)
// Buat referensi DOM untuk elemen input chat
const messageInput = ref<HTMLInputElement | null>(null)

// 1. Inisialisasi Inertia Form
const form = useForm({
    body: ''
})

// 2. Fungsi Membuka Obrolan (Menggunakan Inertia Partial Reload)
const openChat = (conversation: any) => {
    router.get('/obrolan', { chat: conversation.id }, {
        preserveState: true,  
        preserveScroll: true, 
        only: ['activeChat', 'messages', 'conversations'], // SANGAT PENTING: Tambahkan 'conversations' di sini
        onSuccess: () => {
            scrollToBottom()
            // Berikan auto focus ke input saat laci obrolan dibuka
            nextTick(() => messageInput.value?.focus())
        }
    })
}

// 3. Fungsi Menutup Obrolan
const closeChat = () => {
    router.get('/obrolan', {}, {
        preserveState: true,
        preserveScroll: true,
        only: ['activeChat', 'messages'] // Menghapus parameter 'chat' dari URL
    })
}

// 4. Fungsi Kirim Pesan via Inertia
const sendMessage = () => {
    if (!form.body.trim() || !props.activeChat) return

    form.post(`/obrolan/${props.activeChat.id}/messages`, {
        preserveScroll: true,
        preserveState: true,
        only: ['messages', 'conversations'],
        onSuccess: () => {
            form.reset('body')
            scrollToBottom()
            // fallback saja, karena readonly harusnya sudah menjaga fokus tetap ada
            nextTick(() => messageInput.value?.focus())
        }
    })
}

// Utilitas Scroll Otomatis ke Pesan Terbaru
const scrollToBottom = async () => {
    await nextTick()
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
}

// Scroll otomatis jika URL diakses dengan ?chat=xxx (dari Tokoh.vue)
onMounted(() => {
    if (props.activeChat) {
        scrollToBottom()
        nextTick(() => messageInput.value?.focus())
    }
})

// Opsional: Pantau perubahan pesan jika di-refresh
watch(() => props.messages, () => {
    scrollToBottom()
}, { deep: true })


// --- SETUP SUPABASE ---
const page = usePage()
const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
)

let realtimeChannel = null;

onMounted(() => {
    if (props.activeChat) scrollToBottom()

    const authUserId = String(page.props.auth.user.id)

    realtimeChannel = supabase
        .channel('public:notifications')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `audience=eq.${authUserId}`
            },
            (payload) => {
                const newNotif = payload.new

                if (newNotif.type === 'message.new') {
                    
                    router.reload({
                        only: ['messages', 'conversations'],
                        preserveState: true,
                        preserveScroll: true,
                        onSuccess: () => {
                            if (props.activeChat && props.activeChat.id == newNotif.data.conversation_id) {
                                scrollToBottom()
                            }
                        }
                    })
                    playNotificationSound() // Mainkan suara notifikasi

                }
            }
        )
        .subscribe()

          // 🔔 Tambahkan ini untuk membuka gembok proteksi audio Safari iOS
  document.addEventListener('click', unlockAudioForIOS, { passive: true })
  document.addEventListener('touchstart', unlockAudioForIOS, { passive: true })  
})

onUnmounted(() => {
    if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel)
    }

    // 🔔 Bersihkan juga listener audio jika user langsung keluar halaman sebelum sempat klik
  document.removeEventListener('click', unlockAudioForIOS)
  document.removeEventListener('touchstart', unlockAudioForIOS)
})

const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // 1. Logika untuk "barusan" (di bawah 60 detik)
    if (seconds < 60) return 'barusan';

    // 2. Logika untuk "xx menit lalu" (di bawah 60 menit)
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} menit lalu`;

    // 3. Selain kondisi di atas, format tanggal absolut (contoh: "2026 Juli 3, 10:23")
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    
    // Ambil nama bulan dalam bahasa Indonesia secara manual
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const monthName = months[date.getMonth()];
    const day = date.getDate();

    // Jika tahun berbeda dengan tahun sekarang, tampilkan tahun di depan
    if (date.getFullYear() !== now.getFullYear()) {
        return `${date.getFullYear()} ${monthName} ${day}, ${hour}:${minute}`;
    }

    // Jika tahun sama, tahun disembunyikan
    return `${monthName} ${day}, ${hour}:${minute}`;
};

// State untuk pencarian
const isSearching = ref(false)
const searchQuery = ref('')

// Filter obrolan berdasarkan nama user secara frontend
const filteredConversations = computed(() => {
    if (!searchQuery.value.trim()) {
        return props.conversations
    }
    return props.conversations.filter(conv => 
        conv.user?.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})

// Fungsi untuk menutup mode pencarian & reset filter
const clearSearch = () => {
    searchQuery.value = ''
    isSearching.value = false
}

const vFocusOnMount = {
    mounted: (el: HTMLInputElement) => el.focus()
}

// ── INJEKSI AUDIO NOTIFIKASI ─────────────────────────────────────────────────
let notificationAudio: HTMLAudioElement | null = null

// Fungsi inisialisasi awal (dipanggil saat interaksi pertama user)
const unlockAudioForIOS = () => {
  if (!notificationAudio) {
    notificationAudio = new Audio('/mixkit-long-pop-2358.wav')

    // 🔇 Bisukan dulu saat proses "unlock" agar tidak terdengar bunyi acak
    // setiap kali user tap/klik pertama kali di halaman ini.
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
    notificationAudio = new Audio('/mixkit-long-pop-2358.wav')
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
    <AppLayoutPublic>
        <Head title="Obrolan" />

        <div class="mx-auto z-101 pointer-events-none -mt-16 mb-18">
            <div class="absolute w-full pointer-events-auto gap-3">
                
                <div v-if="isSearching" class="h-14 bg-stone-900 border-stone-800 border-b z-60 shadow-2xl flex items-center px-5 pt-1 gap-2">
                    <Search class="size-5 text-stone-400 shrink-0" />
                    <input 
                        v-model="searchQuery"
                        type="text" 
                        placeholder="Cari nama..." 
                        class="ms-2 flex-1 bg-transparent border-none text-white text-sm outline-none focus:outline-none placeholder-stone-500"
                        v-focus-on-mount
                    />
                    <button @click="clearSearch" class="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 transition">
                        <X class="size-4" />
                    </button>
                </div>

                <h1 v-else class="h-14 text-white mb-4 pt-1 px-3 flex items-center justify-center relative bg-stone-900 border-stone-800 border-b z-60 shadow-2xl">
                    <button @click="isSearching = true" class="absolute left-3 p-2 rounded-full hover:bg-stone-800 text-stone-400 transition">
                        <Search class="size-5" />
                    </button>
                    
                    <span class="text-xl font-bold">Obrolan</span>
                </h1>

            </div>
        </div>           

        <div class="mx-auto">

            <div v-if="filteredConversations.length == 0" class="px-3 text-center text-stone-500 py-10">
                {{ searchQuery ? 'Nama tidak ditemukan.' : 'Belum ada obrolan.' }}
            </div>

            <div v-else class="px-3 space-y-3">
                <div 
                    v-for="conv in filteredConversations" :key="conv.id"
                            @click="openChat(conv)"
                    :class="[
                        'flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-colors',
                        conv.unread_count > 0 
                            ? 'bg-emerald-950/20 border-emerald-800/40 hover:bg-emerald-950/30' 
                            : 'bg-stone-900 border-stone-800 hover:bg-stone-800'
                    ]"
                >
                    <div class="size-12 bg-stone-800 rounded-full flex items-center justify-center shrink-0 relative">
                        <img v-if="conv.user.avatar" :src="`/storage/${conv.user.avatar}`"
                          class=" rounded-full object-cover border-4 border-stone-950 bg-stone-900 shadow-xl" />
                        <img v-else :src="conv.user.gender === 'P' ? `/avatar_cewe.png` : `/avatar_cowo.png`"
                          class=" rounded-full object-cover border-4 border-stone-950 bg-stone-900 shadow-xl" />
                    </div>
                    <!-- <div class="size-12 bg-stone-800 rounded-full flex items-center justify-center shrink-0 relative">
                        <span class="text-stone-400 font-bold">{{ conv.user.name.charAt(0) }}</span>
                        <span v-if="conv.unread_count > 0" class="absolute top-0 right-0 size-3 bg-emerald-500 rounded-full border-2 border-stone-900"></span>
                    </div> -->
                        
                    
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-baseline gap-2">
                            <h3 
                                :class="[
                                    'text-sm truncate',
                                    conv.unread_count > 0 ? 'font-black text-white' : 'font-bold text-stone-200'
                                ]"
                            >
                                {{ conv.user.name }}
                            </h3>
                            <span class="text-[10px] text-stone-500 shrink-0">
                                {{ conv.last_message ? new Date(conv.last_message.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) : '' }}
                            </span>
                        </div>

                        <div class="flex justify-between items-center gap-2 mt-0.5">
                            <p 
                                :class="[
                                    'text-xs truncate flex-1',
                                    conv.unread_count > 0 ? 'text-stone-200 font-semibold' : 'text-stone-400'
                                ]"
                            >
                                {{ conv.last_message?.body || 'Belum ada pesan' }}
                            </p>

                            <div 
                                v-if="conv.unread_count > 0" 
                                class="min-w-[18px] h-4 px-1 flex items-center justify-center bg-emerald-500 text-stone-950 text-[10px] font-black rounded-full shrink-0 animate-pulse"
                            >
                                {{ conv.unread_count }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Transition name="drawer">
            <div v-if="activeChat" class="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-stone-900 sm:border-l border-stone-800 z-[60] flex flex-col shadow-2xl">
                
                <div class="h-14 pt-1 sm:px-4 px-2 flex items-center gap-2 border-b border-stone-800 bg-stone-900/90 backdrop-blur-sm shrink-0">
                    <div class="size-10 bg-stone-800 rounded-full flex items-center justify-center shrink-0 relative sm:hidden">
                        <img v-if="activeChat.user.avatar" :src="`/storage/${activeChat.user.avatar}`"
                          class=" rounded-full object-cover border-4 border-stone-950 bg-stone-900 shadow-xl" />
                        <img v-else :src="activeChat.user.gender === 'P' ? `/avatar_cewe.png` : `/avatar_cowo.png`"
                          class=" rounded-full object-cover border-4 border-stone-950 bg-stone-900 shadow-xl" />
                    </div>
                    <div class="font-bold text-stone-200 truncate">{{ activeChat.user.name }}</div>
                    <button @click="closeChat" class="p-2 ms-auto rounded-full hover:bg-stone-600 bg-stone-800 text-stone-400 transition">
                        <X class="size-5" />
                    </button>
                </div>

                <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0a0a0a]">
                    <div 
                        v-for="msg in messages" :key="msg.id"
                        :class="[
                            'flex flex-col gap-1 max-w-[75%]',
                            msg.sender_id == activeChat.user.id 
                                ? 'self-start mr-auto' 
                                : 'self-end ml-auto'
                        ]"
                    >
                        <div 
                            :class="[
                                'p-3 text-sm',
                                msg.sender_id == activeChat.user.id 
                                    ? 'bg-stone-800 text-stone-200 rounded-2xl rounded-bl-none' 
                                    : 'bg-emerald-600 text-white rounded-2xl rounded-br-none'
                            ]"
                        >
                            {{ msg.body }}
                        </div>

                        <span 
                            :class="[
                                'text-[10px] opacity-70 px-1 flex items-center ',
                                msg.sender_id == activeChat.user.id ? 'text-stone-500 ' : 'text-emerald-100 justify-end'
                            ]"
                        >
                            {{ formatRelativeTime(msg.created_at) }}
                        </span>
                    </div>
                </div>

                <div class="p-3 bg-stone-900 border-t border-stone-800 shrink-0">
                    <form @submit.prevent="sendMessage" class="flex gap-2">
                        <input 
                            ref="messageInput"
                            v-model="form.body"
                            type="text" 
                            placeholder="Ketik pesan..."
                            class="flex-1 bg-stone-800 border-none rounded-full px-4 py-2.5 text-sm text-white outline-none focus:outline-none focus:ring-1 focus:ring-emerald-500 [-webkit-tap-highlight-color:transparent] appearance-none disabled:opacity-50"
                            :readonly="form.processing"
                            :aria-disabled="form.processing"
                        />
                        <button 
                            type="submit"
                            :disabled="form.processing"
                            class="relative bg-emerald-600 disabled:opacity-50 hover:bg-emerald-700 p-2.5 rounded-full text-white transition shrink-0"
                        >
                            <LoaderCircle v-if="form.processing" class="size-5 mx-0.5 animate-spin" />
                            <Send v-else class="size-5 mt-0.5 mx-0.5" />
                        
                        </button>
                    </form>
                </div>

            </div>
        </Transition>

        <Transition name="fade">
            <div v-if="activeChat" @click="closeChat" class="fixed inset-0 bg-black/50 z-55 sm:block hidden"></div>
        </Transition>

    </AppLayoutPublic>
</template>

<style scoped>
.drawer-enter-active, .drawer-leave-active { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.drawer-enter-from, .drawer-leave-to { transform: translateX(100%); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>