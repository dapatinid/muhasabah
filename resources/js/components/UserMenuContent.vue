<script setup lang="ts">
import { Link, router, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import { Info, LogOut, MessageCircle, Settings } from 'lucide-vue-next';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import UserInfoPop from '@/components/UserInfoPop.vue';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import type { User } from '@/types';

type Props = {
    user: User;
};

const handleLogout = () => {
    router.flushAll();
};

defineProps<Props>();

// 🔔 Ambil jumlah chat belum terbaca dari shared props Inertia
const page = usePage();
const unreadChatsCount = computed(() => (page.props.unread_chats_count as number) ?? 0);
</script>

<template>
    <DropdownMenuLabel class="p-0 font-normal">
        <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <UserInfoPop :user="user" :show-email="true" />
        </div>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
        <DropdownMenuItem :as-child="true">
            <Link class="block w-full cursor-pointer" :href="`/admin/tentang-saya`" prefetch>
                <Info class="mr-2 h-4 w-4" />
                Tentang Saya
            </Link>
        </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuGroup>
        <DropdownMenuItem :as-child="true">
            <Link class="flex w-full items-center cursor-pointer" :href="`/obrolan`" prefetch>
                <MessageCircle class="mr-2 h-4 w-4" />
                <span class="flex-1">Obrolan</span>
                <span
                    v-if="unreadChatsCount > 0"
                    class="ml-2 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-stone-950"
                >
                    {{ unreadChatsCount > 99 ? '99+' : unreadChatsCount }}
                </span>
            </Link>
        </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuGroup>
        <DropdownMenuItem :as-child="true">
            <Link class="block w-full cursor-pointer" :href="edit()" prefetch>
                <Settings class="mr-2 h-4 w-4" />
                Settings
            </Link>
        </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem :as-child="true">
        <Link
            class="block w-full cursor-pointer"
            :href="logout()"
            @click="handleLogout"
            as="button"
            data-test="logout-button"
        >
            <LogOut class="mr-2 h-4 w-4" />
            Log out
        </Link>
    </DropdownMenuItem>
</template>