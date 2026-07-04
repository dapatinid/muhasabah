<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import { TextStyle } from '@tiptap/extension-text-style'
import { ref, watch, onBeforeUnmount } from 'vue'
import { router } from '@inertiajs/vue3'
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  List, ListOrdered, Quote, Undo, Redo, 
  ImagePlus, Loader2, VideoIcon,
  Minus, Link as LinkIcon, Type
} from 'lucide-vue-next'

// FontSize extension manual (tidak ada package resmi untuk v3)
import { Extension } from '@tiptap/core'

const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return { types: ['textStyle'] }
  },
  addGlobalAttributes() {
    return [{
      types: this.options.types,
      attributes: {
        fontSize: {
          default: null,
          parseHTML: el => el.style.fontSize?.replace(/['"]/g, '') || null,
          renderHTML: attrs => {
            if (!attrs.fontSize) return {}
            return { style: `font-size: ${attrs.fontSize}` }
          },
        },
      },
    }]
  },
  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }: any) =>
        chain().setMark('textStyle', { fontSize }).run(),
      unsetFontSize: () => ({ chain }: any) =>
        chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
    } as any
  },
})

// Ganti baris ini:
// const props = defineProps<{ modelValue: string }>()

// Menjadi ini:
const props = withDefaults(defineProps<{ 
  modelValue: string;
  uploadUrl?: string; // Jadikan opsional
}>(), {
  modelValue: '',
  uploadUrl: '/admin/kalam/upload-image' // Default tetap ke kalam agar fitur lama tidak rusak
})
const emit = defineEmits(['update:modelValue'])

const isUploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const showYoutubeInput = ref(false)
const youtubeUrl = ref('')
const showLinkInput = ref(false)
const linkUrl = ref('')
const selectedFontSize = ref('16px')

const fontSizes = [
  { label: 'Kecil',   value: '13px' },
  { label: 'Normal',  value: '16px' },
  { label: 'Sedang',  value: '20px' },
  { label: 'Besar',   value: '24px' },
  { label: 'Judul',   value: '32px' },
]

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      link: false,
      underline: false,
    }),
    Underline,
    TextStyle,
    FontSize,
    HorizontalRule,  
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-emerald-600 underline underline-offset-2 cursor-pointer',
      },
    }),
    Image.configure({
      inline: false,
      HTMLAttributes: {
        class: 'rounded-2xl border border-zinc-200 shadow-sm mx-auto my-4 max-w-full h-auto',
      },
    }),
    Youtube.configure({
      controls: true,
      nocookie: true,
      width: 640,
      height: 360,
      HTMLAttributes: {
        class: 'rounded-2xl mx-auto my-4 w-full aspect-video',
      },
    }),
  ],
  editorProps: {
    attributes: {
      class: 'prose dark:prose-invert max-w-none p-5 min-h-[350px] focus:outline-none tiptap-content',
    },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

watch(() => props.modelValue, (value) => {
  if (editor.value && editor.value.getHTML() !== value) {
    editor.value.commands.setContent(value, false)
  }
})

// Upload gambar
function triggerFileInput() { fileInput.value?.click() }

function handleImageUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  isUploading.value = true
  
  router.post(props.uploadUrl, { image: file }, {
    forceFormData: true,
    preserveScroll: true,
    preserveState: true, // Tambahkan ini agar state editor tidak ter-reset
    onSuccess: (page) => {
      // 🌟 KITA CEK ISI PROPS DI CONSOLE
      console.log("Berhasil Request! Isi Props:", page.props); 
      
      const url = (page.props as any).flash?.uploaded_image_url;
      
      if (url) {
        editor.value?.chain().focus().setImage({ src: url }).run()
      } else {
        alert("Gambar berhasil di-upload, tapi URL gagal ditangkap oleh editor. Cek Console Inspect Element.");
      }
    },
    // 🌟 TAMBAHKAN ONERROR UNTUK MENANGKAP KEGAGALAN VALIDASI (MISAL: FILE > 2MB)
    onError: (errors) => {
      console.error("Validasi Gagal:", errors);
      alert("Gagal upload gambar: " + (errors.image || "Terjadi kesalahan pada server"));
    },
    onFinish: () => {
      isUploading.value = false
      if (fileInput.value) fileInput.value.value = ''
    }
  })
}

// YouTube
function insertYoutube() {
  const url = youtubeUrl.value.trim()
  if (!url) return
  editor.value?.chain().focus().setYoutubeVideo({ src: url }).run()
  youtubeUrl.value = ''
  showYoutubeInput.value = false
}
function cancelYoutube() {
  youtubeUrl.value = ''
  showYoutubeInput.value = false
}

// Hyperlink
function openLinkInput() {
  // Isi dengan URL yang sudah ada jika teks dipilih
  const existing = editor.value?.getAttributes('link').href ?? ''
  linkUrl.value = existing
  showLinkInput.value = true
  showYoutubeInput.value = false
}
function insertLink() {
  const url = linkUrl.value.trim()
  
  if (!url) {
    editor.value?.chain().focus().unsetLink().run()
    linkUrl.value = ''
    showLinkInput.value = false
    return
  }

  // Pastikan URL punya protokol
  const finalUrl = url.startsWith('http') ? url : `https://${url}`

  // Jika tidak ada teks terseleksi, sisipkan URL sebagai teks sekaligus link
  const { from, to } = editor.value!.state.selection
  const hasSelection = from !== to

  if (hasSelection) {
    editor.value?.chain().focus().setLink({ href: finalUrl, target: '_blank' }).run()
  } else {
    // Tidak ada seleksi — sisipkan URL sebagai teks baru dengan link
    editor.value?.chain().focus()
      .insertContent(`<a href="${finalUrl}" target="_blank">${finalUrl}</a>`)
      .run()
  }

  linkUrl.value = ''
  showLinkInput.value = false
}
function cancelLink() {
  linkUrl.value = ''
  showLinkInput.value = false
}
function removeLink() {
  editor.value?.chain().focus().unsetLink().run()
  showLinkInput.value = false
}

// Font size
function applyFontSize(size: string) {
  selectedFontSize.value = size
  if (size === '16px') {
    (editor.value?.chain().focus() as any).unsetFontSize().run()
  } else {
    (editor.value?.chain().focus() as any).setFontSize(size).run()
  }
}

// Divider
function insertDivider() {
  editor.value?.chain().focus().insertContent('<hr>').run()
}

onBeforeUnmount(() => { editor.value?.destroy() })
</script>

<template>
  <div v-if="editor" class="border rounded-2xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
    
    <!-- Toolbar -->
    <div class="sticky top-0 z-10 flex flex-wrap items-center gap-1 p-2 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 rounded-t-2xl">

      <!-- Font Size -->
      <div class="flex items-center bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-0.5 shadow-sm">
        <div class="flex items-center gap-1 px-2 py-2">
          <Type class="size-3.5 text-zinc-400 shrink-0" />
          <select
            :value="selectedFontSize"
            @change="applyFontSize(($event.target as HTMLSelectElement).value)"
            class="text-sm bg-transparent outline-none cursor-pointer text-zinc-600 dark:text-zinc-300 pr-1 leading-none font-medium"
            title="Ukuran font"
          >
            <option v-for="size in fontSizes" :key="size.value" :value="size.value">
              {{ size.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Format teks -->
      <div class="flex items-center bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-0.5 shadow-sm">
        <button type="button" @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'bg-zinc-100 dark:bg-zinc-700 text-emerald-600': editor.isActive('bold') }"
          class="p-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors" title="Bold">
          <Bold class="size-4" />
        </button>
        <button type="button" @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'bg-zinc-100 dark:bg-zinc-700 text-emerald-600': editor.isActive('italic') }"
          class="p-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors" title="Italic">
          <Italic class="size-4" />
        </button>
        <button type="button" @click="editor.chain().focus().toggleUnderline().run()"
          :class="{ 'bg-zinc-100 dark:bg-zinc-700 text-emerald-600': editor.isActive('underline') }"
          class="p-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors" title="Underline">
          <UnderlineIcon class="size-4" />
        </button>
      </div>

      <!-- List & Quote -->
      <div class="flex items-center bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-0.5 shadow-sm">
        <button type="button" @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'bg-zinc-100 dark:bg-zinc-700 text-emerald-600': editor.isActive('bulletList') }"
          class="p-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors" title="Bullet list">
          <List class="size-4" />
        </button>
        <button type="button" @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'bg-zinc-100 dark:bg-zinc-700 text-emerald-600': editor.isActive('orderedList') }"
          class="p-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors" title="Numbered list">
          <ListOrdered class="size-4" />
        </button>
        <button type="button" @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ 'bg-zinc-100 dark:bg-zinc-700 text-emerald-600': editor.isActive('blockquote') }"
          class="p-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors" title="Blockquote">
          <Quote class="size-4" />
        </button>
      </div>

      <!-- Divider -->
      <div class="flex items-center">
        <button
          type="button"
          @click="insertDivider"
          class="flex items-center gap-2 p-2 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 border border-zinc-200 dark:border-zinc-700 transition-all"
          title="Sisipkan garis pemisah"
        >
          <Minus class="size-4" />
        </button>
      </div>

      <!-- Hyperlink -->
      <div class="flex items-center">
        <button
          type="button"
          @click="openLinkInput"
          :class="{ 'bg-blue-50 text-blue-600 border-blue-200': showLinkInput || editor.isActive('link') }"
          class="flex items-center gap-2 p-2 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-blue-50 hover:text-blue-600 border border-zinc-200 dark:border-zinc-700 hover:border-blue-200 transition-all"
          title="Sisipkan link"
        >
          <LinkIcon class="size-4" />
        </button>
      </div>

      <!-- Upload Foto -->
      <div class="flex items-center">
        <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleImageUpload" />
        <button
          type="button"
          @click="triggerFileInput"
          :disabled="isUploading"
          class="flex items-center gap-2 p-2 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-emerald-50 hover:text-emerald-600 border border-zinc-200 dark:border-zinc-700 hover:border-emerald-200 transition-all"
          title="Upload foto"
        >
          <Loader2 v-if="isUploading" class="size-4 animate-spin" />
          <ImagePlus v-else class="size-4" />
        </button>
      </div>

      <!-- YouTube -->
      <div class="flex items-center">
        <button
          type="button"
          @click="showYoutubeInput = !showYoutubeInput; showLinkInput = false"
          :class="{ 'bg-red-50 text-red-600 border-red-200': showYoutubeInput }"
          class="flex items-center gap-2 p-2 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-red-50 hover:text-red-600 border border-zinc-200 dark:border-zinc-700 hover:border-red-200 transition-all"
          title="Sisipkan video YouTube"
        >
          <VideoIcon class="size-4" />
        </button>
      </div>

      <!-- Undo / Redo -->
      <div class="ms-auto flex items-center gap-1">
        <button type="button" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()"
          class="p-2 text-zinc-400 hover:text-zinc-600 disabled:opacity-30 transition-colors" title="Undo">
          <Undo class="size-4" />
        </button>
        <button type="button" @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()"
          class="p-2 text-zinc-400 hover:text-zinc-600 disabled:opacity-30 transition-colors" title="Redo">
          <Redo class="size-4" />
        </button>
      </div>
    </div>

    <!-- Input YouTube URL -->
    <div v-if="showYoutubeInput"
         class="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-950/30 border-b border-red-100 dark:border-red-900/50">
      <VideoIcon class="size-4 text-red-500 shrink-0" />
      <input
        v-model="youtubeUrl"
        type="url"
        placeholder="Tempel URL YouTube... (https://youtube.com/watch?v=...)"
        class="flex-1 text-sm bg-transparent outline-none text-zinc-700 dark:text-zinc-300 placeholder-zinc-400"
        @keydown.enter.prevent="insertYoutube"
        @keydown.esc="cancelYoutube"
        autofocus
      />
      <button type="button" @click="insertYoutube" :disabled="!youtubeUrl.trim()"
        class="text-xs font-bold px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-40 transition-all">
        Sisipkan
      </button>
      <button type="button" @click="cancelYoutube" class="text-xs text-zinc-400 hover:text-zinc-600 px-2">
        Batal
      </button>
    </div>

    <!-- Input Hyperlink -->
    <div v-if="showLinkInput"
         class="flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/50">
      <LinkIcon class="size-4 text-blue-500 shrink-0" />
      <input
        v-model="linkUrl"
        type="url"
        placeholder="Masukkan URL... (https://...)"
        class="flex-1 text-sm bg-transparent outline-none text-zinc-700 dark:text-zinc-300 placeholder-zinc-400"
        @keydown.enter.prevent="insertLink"
        @keydown.esc="cancelLink"
        autofocus
      />
      <button type="button" @click="insertLink" :disabled="!linkUrl.trim()"
        class="text-xs font-bold px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-40 transition-all">
        Terapkan
      </button>
      <button v-if="editor.isActive('link')" type="button" @click="removeLink"
        class="text-xs font-bold px-3 py-1.5 bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-lg hover:bg-red-100 hover:text-red-600 transition-all">
        Hapus Link
      </button>
      <button type="button" @click="cancelLink" class="text-xs text-zinc-400 hover:text-zinc-600 px-2">
        Batal
      </button>
    </div>

    <!-- Editor Area -->
    <editor-content :editor="editor" />
  </div>
</template>

<style>
.tiptap-content .ProseMirror {
  min-height: 350px;
  outline: none !important;
}

.tiptap-content ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}
.tiptap-content ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}
.tiptap-content blockquote {
  border-left: 4px solid #10b981;
  padding-left: 1rem;
  margin: 0.75rem 0;
  color: #64748b;
  font-style: italic;
}

/* Divider */
.tiptap-content hr {
  border: none;
  border-top: 2px solid #e2e8f0;
  margin: 1.5rem 0;
}
.dark .tiptap-content hr {
  border-top-color: #334155;
}

/* YouTube */
.tiptap-content iframe {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 1rem;
  margin: 1rem auto;
  display: block;
}
.tiptap-content .ProseMirror-selectednode iframe {
  outline: 3px solid #ef4444;
  outline-offset: 4px;
  border-radius: 1rem;
}

/* Gambar */
.tiptap-content img.ProseMirror-selectednode {
  outline: 3px solid #10b981;
  outline-offset: 4px;
}
</style>