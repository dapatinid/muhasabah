<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { ChevronsUpDown } from 'lucide-vue-next';
import { computed } from 'vue';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import UserInfo from '@/components/UserInfo.vue';
import UserMenuContent from '@/components/UserMenuContent.vue';

const page = usePage();
const user = computed(() => page.props.auth.user);
const unreadChatsCount = computed(() => (page.props.unread_chats_count as number) ?? 0);

// 1. Ambil setOpenMobile dari useSidebar
const { isMobile, state, setOpenMobile } = useSidebar();

// 2. Fungsi untuk menutup sidebar mobile saat menu user diklik
const handleUserMenuClick = (event: MouseEvent) => {
    if (!isMobile.value) return;

    const target = event.target as HTMLElement;
    
    // Jika yang diklik adalah link (seperti Profile) atau button (seperti Logout)
    if (target.closest('a') || target.closest('button')) {
        setOpenMobile(false);
    }
};

</script>

<template>
    <SidebarMenu>
        <SidebarMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <SidebarMenuButton
                        size="lg"
                        class="relative data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        data-test="sidebar-menu-button"
                    >
                        <UserInfo :user="user" /> 
                        <span
                            v-if="unreadChatsCount > 0"
                            class="absolute right-2 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-stone-950"
                        >
                            {{ unreadChatsCount > 99 ? '99+' : unreadChatsCount }}
                        </span>
                        <ChevronsUpDown class="ml-auto size-4" />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    class="w-(--reka-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                    :side="
                        isMobile
                            ? 'bottom'
                            : state === 'collapsed'
                              ? 'left'
                              : 'bottom'
                    "
                    align="end"
                    :side-offset="4"
                >
                    <div @click="handleUserMenuClick">
                        <UserMenuContent :user="user" />
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    </SidebarMenu>
</template>