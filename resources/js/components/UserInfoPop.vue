<script setup lang="ts">
import { computed } from 'vue';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/composables/useInitials';
import { AtSign, Phone } from 'lucide-vue-next';
import type { User } from '@/types';

type Props = {
    user: User;
    showEmail?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    showEmail: false,
});

const { getInitials } = useInitials();

// Menormalisasi path penyimpanan Laravel (avatar & sampul) jadi URL yang bisa dipakai <img>
const resolveStorageUrl = (path?: string | null) => {
    if (!path) return '';

    // 1. Sudah berupa URL eksternal (mis. avatar dari Google/OAuth)
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // 2. Sudah mengandung 'storage/' di path-nya
    if (path.includes('storage/')) {
        return path.startsWith('/') ? path : `/${path}`;
    }

    // 3. Tambahkan prefix /storage/ bawaan Laravel
    return `/storage/${path.replace(/^\//, '')}`;
};

const absoluteAvatarUrl = computed(() => resolveStorageUrl(props.user?.avatar));
const absoluteSampulUrl = computed(() => resolveStorageUrl((props.user as any)?.sampul));

// Rapikan nomor WhatsApp jadi link wa.me (asumsi nomor Indonesia, 0xxx -> 62xxx)
const whatsappHref = computed(() => {
    const raw = (props.user as any)?.whatsapp as string | undefined;
    if (!raw) return '';
    const digits = raw.replace(/\D/g, '');
    const normalized = digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
    return `https://wa.me/${normalized}`;
});
</script>

<template>
    <div class="w-full">
        <!-- Sampul -->
        <div class="relative h-20 w-full overflow-hidden bg-linear-to-br from-accent to-background rounded-t-lg">
            <img
                v-if="absoluteSampulUrl"
                :src="absoluteSampulUrl"
                :alt="`Sampul ${user.name}`"
                class="absolute inset-0 h-full w-full object-cover"
            />
            <div
                class="absolute inset-0"
                style="background: radial-gradient(ellipse at 50% 0%, rgba(120,90,40,0.18) 0%, transparent 70%)"
            />
        </div>

        <!-- Avatar menjorok ke dalam sampul -->
        <div class="flex flex-col items-center px-4 pb-4 -mt-10 bg-linear-to-b from-accent to-background">
            <Avatar class="h-20 w-20 overflow-hidden rounded-full border-4 border-foreground/50 shadow-xl">
                <AvatarImage :src="absoluteAvatarUrl" :alt="user.name" class="object-cover" />
                <AvatarFallback class="rounded-full bg-foreground/10 text-lg font-bold text-emerald-400">
                    {{ getInitials(user.name) }}
                </AvatarFallback>
            </Avatar>

            <span class="mt-2 max-w-full truncate text-sm font-bold dark:text-stone-100">
                {{ user.name }}
            </span>

            <div class="mt-2 flex flex-wrap items-center justify-center gap-1.5">
                <span
                    v-if="user.slug"
                    class="inline-flex items-center gap-1 rounded-full border border-emerald-500/-80 bg-accent px-2 py-0.5 text-[11px] font-medium text-emerald-500"
                >
                    <AtSign class="h-3 w-3" />
                    {{ user.slug }}
                </span>

                <a
                    v-if="(user as any).whatsapp"
                    :href="whatsappHref"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1 rounded-full border border-emerald-500/-80 bg-accent px-2 py-0.5 text-[11px] font-medium text-emerald-500 transition hover:border-emerald-600 hover:text-amber-400"
                    @click.stop
                >
                    <Phone class="h-3 w-3" />
                    {{ (user as any).whatsapp }}
                </a>
            </div>
        </div>
    </div>
</template>