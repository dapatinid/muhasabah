<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { ref, watch, onBeforeUnmount } from 'vue'
import { router } from '@inertiajs/vue3'
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  List, ListOrdered, Quote, Undo, Redo, 
  ImagePlus, Loader2 
} from 'lucide-vue-next'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

const isUploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      // Matikan dari StarterKit agar tidak duplikat
      link: false,
      underline: false,
    }),
    Underline,                              // ← pakai versi kita sendiri
    Link.configure({ openOnClick: false }), // ← dengan konfigurasi custom
    Image.configure({
      inline: false,
      HTMLAttributes: {
        class: 'rounded-2xl border border-slate-200 shadow-sm mx-auto my-4 max-w-full h-auto',
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

function triggerFileInput() {
  fileInput.value?.click()
}

function handleImageUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  isUploading.value = true

  router.post('/kalam/upload-image', 
    { image: file }, 
    {
      forceFormData: true,
      onSuccess: (page) => {
        console.log('page.props:', page.props)        // ← lihat isinya
        console.log('flash:', page.props.flash)       // ← ada tidak?
        
        const flash = (page.props as any).flash
        const url = flash?.uploaded_image_url
        console.log('url:', url)                      // ← dapat URL tidak?
        
        if (url) {
            editor.value?.chain().focus().setImage({ src: url }).run()
        }
     },
      onFinish: () => {
        isUploading.value = false
        if (fileInput.value) fileInput.value.value = ''
      }
    }
  )
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<template>
  <div v-if="editor" class="border rounded-2xl overflow-hidden bg-white dark:bg-slate-950 border-slate-200">
    
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-1 p-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-100">
      
      <!-- Format teks -->
      <div class="flex items-center bg-white dark:bg-slate-800 rounded-lg border p-0.5 shadow-sm">
        <button type="button" @click="editor.chain().focus().toggleBold().run()" :class="{ 'bg-slate-100 text-emerald-600': editor.isActive('bold') }" class="p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700">
          <Bold class="size-4" />
        </button>
        <button type="button" @click="editor.chain().focus().toggleItalic().run()" :class="{ 'bg-slate-100 text-emerald-600': editor.isActive('italic') }" class="p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700">
          <Italic class="size-4" />
        </button>
        <button type="button" @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'bg-slate-100 text-emerald-600': editor.isActive('underline') }" class="p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700">
          <UnderlineIcon class="size-4" />
        </button>
      </div>

      <!-- List & Quote -->
      <div class="flex items-center bg-white dark:bg-slate-800 rounded-lg border p-0.5 shadow-sm">
        <button type="button" @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'bg-slate-100 text-emerald-600': editor.isActive('bulletList') }" class="p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700">
          <List class="size-4" />
        </button>
        <button type="button" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'bg-slate-100 text-emerald-600': editor.isActive('orderedList') }" class="p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700">
          <ListOrdered class="size-4" />
        </button>
        <button type="button" @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'bg-slate-100 text-emerald-600': editor.isActive('blockquote') }" class="p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700">
          <Quote class="size-4" />
        </button>
      </div>

      <!-- Upload Foto -->
      <div class="flex items-center">
        <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleImageUpload" />
        <button 
          type="button" 
          @click="triggerFileInput" 
          :disabled="isUploading"
          class="flex items-center gap-2 p-2 px-3 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all disabled:opacity-50"
        >
          <Loader2 v-if="isUploading" class="size-4 animate-spin" />
          <ImagePlus v-else class="size-4" />
          <span class="text-xs font-bold uppercase tracking-tight">Foto</span>
        </button>
      </div>

      <!-- Undo / Redo -->
      <div class="ms-auto flex items-center gap-1">
        <button type="button" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()" class="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-30">
          <Undo class="size-4" />
        </button>
        <button type="button" @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()" class="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-30">
          <Redo class="size-4" />
        </button>
      </div>
    </div>

    <!-- Editor Area -->
    <editor-content :editor="editor" />
  </div>
</template>

