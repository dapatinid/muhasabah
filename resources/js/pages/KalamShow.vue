<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3'
import { computed, ref, onMounted } from 'vue'
import { CalendarDays, Share2, Tag, User, Send } from 'lucide-vue-next'
import AppLayoutPublic from '@/layouts/AppLayoutPublic.vue'
import { toast } from 'vue-sonner'

const props = defineProps<{
  meta?: {
    title: string
    description: string
    image: string
    url: string
  }
  kalam: {
    id: number
    judul: string
    slug: string
    body: string
    kategori: string
    is_anonymous: boolean
    created_at: string
    user: { id: number; name: string } | null
    komentars: Array<{
      id: number
      body: string
      nama_publik?: string
      created_at: string
      user: { id: number; name: string } | null
    }>
    reaksis: Array<{
      id: number
      type: string
      ip_address?: string
    }>
  }
}>()

// --- STATE MANAGEMENT ---
const isSubmittingComment = ref(false)
const isSubmittingReaction = ref(false)
const storageKey = `kalam_reaksi_${props.kalam.slug}`
const selectedReaksi = ref<string | null>(localStorage.getItem(storageKey))

// --- SECURITY MATH CAPTCHA ---
const captchaNum1 = ref(0)
const captchaNum2 = ref(0)
const userCaptchaAnswer = ref('')
const generateCaptcha = () => {
  captchaNum1.value = Math.floor(Math.random() * 9) + 1
  captchaNum2.value = Math.floor(Math.random() * 9) + 1
  userCaptchaAnswer.value = ''
}

onMounted(() => {
  generateCaptcha()
})

// --- INERTIA FORM KOMENTAR ---
const commentForm = useForm({
  nama_publik: '',
  body: '',
  captcha_challenge: computed(() => `${captchaNum1.value}+${captchaNum2.value}`),
  captcha_answer: ''
})

// --- SUBMIT HANDLER ---
const submitKomentar = () => {
  const correctAnswer = captchaNum1.value + captchaNum2.value
  if (parseInt(userCaptchaAnswer.value) !== correctAnswer) {
    alert('Jawaban kode keamanan (Captcha) salah, silakan hitung kembali.')
    generateCaptcha()
    return
  }

  commentForm.captcha_answer = userCaptchaAnswer.value
  isSubmittingComment.value = true

  commentForm.post(`/kalam/${props.kalam.slug}/komentar`, {
    preserveScroll: true,
    onSuccess: () => {
      commentForm.reset('body', 'nama_publik')
      generateCaptcha()
      toast.success('Komentar berhasil dikirim!')
    },
    onFinish: () => {
      isSubmittingComment.value = false
    }
  })
}

const toggleReaksi = (type: string) => {
  if (isSubmittingReaction.value) return
  isSubmittingReaction.value = true

  useForm({ type }).post(`/kalam/${props.kalam.slug}/reaksi`, {
    preserveScroll: true,
    onSuccess: () => {
      if (selectedReaksi.value === type) {
        selectedReaksi.value = null
        localStorage.removeItem(storageKey)
      } else {
        selectedReaksi.value = type
        localStorage.setItem(storageKey, type)
      }
    },
    onFinish: () => {
      isSubmittingReaction.value = false
    }
  })
}

// --- COMPUTED DATA ---
const penulis = computed(() =>
  props.kalam.is_anonymous ? 'Hamba Allah' : (props.kalam.user?.name ?? 'Anonim')
)

const tanggal = computed(() =>
  new Date(props.kalam.created_at).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
)

const kategoriLabel: Record<string, string> = {
  hikmah: 'Hikmah', doa: 'Doa', kisah: 'Kisah', tips: 'Tips & Trik', berita: 'Berita',
}

const reaksiList = [
  { type: 'barakallah',  emoji: '🤲', label: 'Barakallah' },
  { type: 'masya_allah', emoji: '✨', label: "Masyaa Allah" },
  { type: 'subhanallah', emoji: '💚', label: 'Subhanallah' },
  { type: 'aamiin',      emoji: '🙏', label: 'Aamiin' },
]

const reaksiCount = computed(() => {
  const counts: Record<string, number> = {}
  props.kalam.reaksis?.forEach(r => {
    counts[r.type] = (counts[r.type] ?? 0) + 1
  })
  return counts
})

function handleShare() {
  if (typeof window !== 'undefined') {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast.success('Link tulisan berhasil disalin!', {
          description: 'Silakan bagikan hikmah dan ilmu ini ke kerabat Anda.',
          duration: 3000,
        })
      })
      .catch((err) => {
        toast.error('Gagal menyalin tautan.')
        console.error(err)
      })
  }
}
</script>

<template>
  <Head>
    <title>{{ kalam.judul }}</title>
    <meta v-if="meta" name="description" :content="meta.description" />
    <meta v-if="meta" property="og:title" :content="meta.title" />
    <meta v-if="meta" property="og:description" :content="meta.description" />
    <meta v-if="meta" property="og:image" :content="meta.image" />
    <meta v-if="meta" property="og:url" :content="meta.url" />
    <meta property="og:type" content="article" />
  </Head>

  <AppLayoutPublic :subtitle="kalam.kategori" :title="kalam.judul" :show-back="true" back-href="/kalam">  

    <main class="px-5 py-8 space-y-8 pb-32">

      <div class="space-y-4">
        <div>
          <span class="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            <Tag class="size-3" />
            {{ kategoriLabel[kalam.kategori] ?? kalam.kategori }}
          </span>
        </div>

        <h1 class="text-2xl md:text-3xl font-bold leading-snug text-amber-100" style="font-family: 'Amiri', serif;">
          {{ kalam.judul }}
        </h1>

        <div class="flex flex-wrap gap-4 text-xs text-stone-500">
          <span class="flex items-center gap-1.5">
            <User class="size-3.5" />
            {{ penulis }}
          </span>
          <span class="flex items-center gap-1.5">
            <CalendarDays class="size-3.5" />
            {{ tanggal }}
          </span>
        </div>

        <div class="flex items-center gap-3 pt-1">
          <div class="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          <span class="text-amber-500/40 text-lg">✦</span>
          <div class="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        </div>
      </div>

      <div
        class="prose prose-invert prose-stone max-w-none
               prose-p:text-stone-300 prose-p:leading-relaxed prose-p:text-[15px]
               prose-headings:font-bold prose-headings:text-amber-100
               prose-strong:text-amber-200
               prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline
               prose-blockquote:border-l-amber-500 prose-blockquote:text-stone-400 prose-blockquote:bg-stone-900/50 prose-blockquote:rounded-r-xl prose-blockquote:py-1
               prose-ul:text-stone-300 prose-ol:text-stone-300
               prose-img:rounded-2xl prose-img:border prose-img:border-stone-800
               prose-iframe:w-full prose-iframe:aspect-video prose-iframe:rounded-xl"
        v-html="kalam.body"
      />

      <div class="flex items-center gap-3">
        <div class="h-px flex-1 bg-stone-800" />
        <span class="text-stone-700 text-xs">•</span>
        <div class="h-px flex-1 bg-stone-800" />
      </div>

      <div class="space-y-3">
        <p class="text-[10px] font-bold uppercase tracking-widest text-stone-500">Ekspresikan Reaksi Anda</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="r in reaksiList"
            :key="r.type"
            type="button"
            @click="toggleReaksi(r.type)"
            :disabled="isSubmittingReaction"
            class="flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all bg-stone-900 active:scale-95 disabled:opacity-50"
            :class="[
              selectedReaksi === r.type 
                ? 'border-amber-500 text-amber-400 bg-amber-500/5' 
                : 'border-stone-800 text-stone-400 hover:border-amber-500/40'
            ]"
          >
            <span>{{ r.emoji }}</span>
            <span>{{ r.label }}</span>
            <span v-if="reaksiCount[r.type]" class="ml-1 opacity-60 font-mono text-amber-400">
              {{ reaksiCount[r.type] }}
            </span>
          </button>
        </div>
      </div>

      <form @submit.prevent="submitKomentar" class="bg-stone-900 border border-stone-800/80 rounded-3xl p-5 space-y-4">
        <p class="text-[10px] font-bold uppercase tracking-widest text-amber-400">Kirim Pertanyaan / Tanggapan Publik</p>
        
        <div class="space-y-3">
          <input 
            v-model="commentForm.nama_publik" 
            type="text" 
            placeholder="Nama Anda (Wajib isi)" 
            class="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
          <textarea 
            v-model="commentForm.body" 
            required
            rows="3"
            placeholder="Tulis diskusi, tanggapan, atau apresiasi Anda di sini..." 
            class="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
          ></textarea>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div class="flex items-center gap-2 bg-stone-950 px-3 py-2 rounded-xl border border-stone-800">
            <span class="text-xs font-mono text-stone-400 font-bold select-none tracking-wider">Keamanan: {{ captchaNum1 }} + {{ captchaNum2 }} = </span>
            <input 
              v-model="userCaptchaAnswer" 
              type="number" 
              required
              placeholder="?" 
              class="w-12 bg-transparent text-center font-bold text-xs text-amber-400 focus:outline-none font-mono"
            />
          </div>

          <button 
            type="submit" 
            :disabled="isSubmittingComment || !commentForm.body"
            class="ms-auto flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-800 disabled:text-stone-600 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all active:scale-95 shadow-md"
          >
            <Send class="w-3.5 h-3.5" />
            {{ isSubmittingComment ? 'Mengirim...' : 'Komentar' }}
          </button>
        </div>
      </form>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <p class="text-[10px] font-bold uppercase tracking-widest text-stone-500">
            Diskusi Publik 
            <span class="text-amber-400 font-mono ml-1">({{ kalam.komentars?.length || 0 }})</span>
          </p>
        </div>

        <div v-if="!kalam.komentars || kalam.komentars.length === 0"
             class="text-center py-10 rounded-3xl border border-dashed border-stone-850 bg-stone-900/10 text-stone-600 text-sm">
          Belum ada diskusi atau tanggapan publik.
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="komentar in kalam.komentars"
            :key="komentar.id"
            class="bg-stone-900/20 border border-stone-800 rounded-2xl p-4 space-y-1 hover:border-amber-500/20 transition-colors"
          >
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-bold text-amber-200">
                {{ komentar.user ? komentar.user.name : (komentar.nama_publik || 'Hamba Allah (Anonim)') }}
              </span>
              <span class="text-[9px] text-stone-600 font-mono">• {{ new Date(komentar.created_at).toLocaleDateString('id-ID') }}</span>
            </div>
            <p class="text-sm text-stone-400 leading-relaxed">{{ komentar.body }}</p>
          </div>
        </div>
      </div>

    </main>

    <div class="fixed bottom-30 max-w-xl mx-auto inset-x-0 z-50 pointer-events-none">
      <div class="absolute left-5 pointer-events-auto">
        <button 
          @click="handleShare"
          type="button" 
          title="Bagikan tulisan"
          class="w-10 h-10 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <Share2 class="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>      

  </AppLayoutPublic>
</template>

<style scoped>
.prose :deep(blockquote) {
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Mengunci rasio video YouTube di dalam v-html */
.prose :deep(iframe) {
  width: 100% !important;
  aspect-ratio: 16 / 9 !important; /* Mengunci rasio 16:9 */
  height: auto !important;         /* Memaksa height mengikuti aspect-ratio */
  border-radius: 0.75rem;          /* Sesuai dengan rounded-xl */
  border: 1px solid #292524;       /* Sesuai dengan border-stone-800 */
}
</style>