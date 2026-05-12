<script setup lang="ts">
import AppLayout from '@/layouts/app/AppSidebarLayout.vue';
import type { BreadcrumbItem } from '@/types';
import { onMounted, onUnmounted } from 'vue';
import { router, usePage } from '@inertiajs/vue3'; 
import { Toaster, toast } from 'vue-sonner';
import 'vue-sonner/style.css';

const { breadcrumbs = [] } = defineProps<{
    breadcrumbs?: BreadcrumbItem[];
}>();

const page = usePage()

// ← Pakai event Inertia, bukan watch
// Event 'finish' fire setiap kali navigasi selesai, termasuk request yang sama
const removeListener = router.on('finish', () => {
  const flash = page.props.flash as any
  
  if (flash?.success) toast.success(flash.success)
  if (flash?.error)   toast.error(flash.error)
  if (flash?.info)    toast.info(flash.info)
})

onUnmounted(() => {
  removeListener()
})
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <slot />
        <Toaster position="top-right" richColors />
    </AppLayout>
</template>