<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import { inject } from "vue"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

// 1. Ambil context sidebar (shadcn/radix-vue menggunakan key simbol atau string terikat)
// Jika Anda membuat utils sendiri, sesuaikan key inject-nya. 
// Biasanya jika menggunakan useSidebar(), datanya di-provide oleh parent.
import { useSidebar } from "./utils"
const { isMobile, setOpenMobile } = useSidebar()

const handleContentClick = (event: MouseEvent) => {
  if (!isMobile.value) return

  const target = event.target as HTMLElement
  
  // 2. Cari elemen link (Inertia Link / <a>) terdekat
  const link = target.closest('a')
  
  // 3. Cari button terdekat
  const button = target.closest('button')

  // JIKA yang diklik adalah Link biasa (pasti navigasi/pindah halaman)
  if (link) {
    setOpenMobile(false)
    return
  }

  // JIKA yang diklik adalah Button, pastikan itu BUKAN pemicu dropdown / collapsible
  if (button) {
    const isDropdownTrigger = button.hasAttribute('aria-haspopup') || 
                              button.getAttribute('aria-expanded') !== null ||
                              button.closest('[data-sidebar="menu-action"]') // Menghindari tombol aksi kecil
    
    if (!isDropdownTrigger) {
      setOpenMobile(false)
    }
  }
}
</script>

<template>
  <div
    data-slot="sidebar-content"
    data-sidebar="content"
    :class="cn('flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden', props.class)"
    @click="handleContentClick"
  >
    <slot />
  </div>
</template>