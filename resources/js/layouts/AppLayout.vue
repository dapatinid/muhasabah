<script setup lang="ts">
import AppLayout from '@/layouts/app/AppSidebarLayout.vue';
import type { BreadcrumbItem } from '@/types';
import { computed, watch, nextTick } from 'vue';
import { usePage } from '@inertiajs/vue3'; 
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'vue-sonner';

const { breadcrumbs = [] } = defineProps<{
    breadcrumbs?: BreadcrumbItem[];
}>();

const page = usePage()

const flash = computed(() => page.props.flash as { success?: string; error?: string; info?: string })

watch(flash, (val) => {
  if (!val?.success && !val?.error && !val?.info) return
  
  nextTick(() => {
    if (val?.success) toast.success(val.success)
    if (val?.error)   toast.error(val.error)
    if (val?.info)    toast.info(val.info)
  })
}, { immediate: true })
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <slot />
        <Toaster position="top-right" richColors />
    </AppLayout>
</template>
