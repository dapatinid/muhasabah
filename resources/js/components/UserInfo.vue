<script setup lang="ts">
import { computed } from 'vue';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/composables/useInitials';
import type { User } from '@/types';

type Props = {
    user: User;
    showEmail?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    showEmail: false,
});

const { getInitials } = useInitials();

// Solusi: Memastikan URL gambar selalu mengarah ke direktori publik penyimpanan Laravel
const absoluteAvatarUrl = computed(() => {
    const avatar = props.user?.avatar;
    if (!avatar) return '';
    
    // 1. Jika URL sudah berupa full eksternal URL (misal: Avatar dari Google/OAuth)
    if (avatar.startsWith('http') || avatar.startsWith('https')) {
        return avatar;
    }
    
    // 2. Jika di database sudah ada kata 'storage/' (jaga-jaga jika format datanya berbeda)
    if (avatar.includes('storage/')) {
        return avatar.startsWith('/') ? avatar : `/${avatar}`;
    }
    
    // 3. Hapus slash di awal (jika ada) agar tidak terjadi dobel slash
    const cleanPath = avatar.replace(/^\//, '');

    // 4. Tambahkan prefix /storage/ bawaan Laravel
    return `/storage/${cleanPath}`;
});
</script>

<template>
    <Avatar class="h-8 w-8 overflow-hidden rounded-lg">
        <AvatarImage :src="absoluteAvatarUrl" :alt="user.name" />
        <AvatarFallback class="rounded-lg text-black dark:text-white">
            {{ getInitials(user.name) }}
        </AvatarFallback>
    </Avatar>

    <div class="grid flex-1 text-left text-sm leading-tight">
        <span class="truncate font-medium">{{ user.name }}</span>
        <span v-if="showEmail" class="truncate text-xs text-muted-foreground">
            {{ user.email }}
        </span>
    </div>
</template>