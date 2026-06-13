<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import { Award, BookOpen, Calendar, CircleStar, FolderGit2, GalleryThumbnails, HeartHandshake, LayoutGrid, Logs, MoonStar, Target } from 'lucide-vue-next';
import AppLogo from '@/components/AppLogo.vue';
import NavFooter from '@/components/NavFooter.vue';
import NavMain from '@/components/NavMain.vue';
import NavMainUkhuwah from '@/components/NavMainUkhuwah.vue';
import NavMainControlPanel from '@/components/NavMainControlPanel.vue';
import NavUser from '@/components/NavUser.vue';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const page = usePage();
const canAccessControlPanel = computed(() => page.props.auth?.can_access_control_panel ?? false);

// Menu utama diatur agar selalu tampil tanpa pengecekan userClasses frontend
const mainNavItems = computed(() => {
    return [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Kalam',
            href: '/admin/kalam',
            icon: BookOpen,
        },
        {
            title: 'Donasi',
            href: '/admin/donasi',
            icon: HeartHandshake,
        },
        {
            title: 'Acara',
            href: '/admin/acara',
            icon: Calendar,
        },
    ];
});

const mainNavItemsUkhuwah = computed(() => {
    const items: NavItem[] = [];
        items.push(
            {
                title: 'Lingkaran',
                href: '/admin/lingkaran',
                icon: Target,
            },
            {
                title: 'Masjid',
                href: '/admin/masjid',
                icon: MoonStar,
            },
        );
    return items;  
});

const mainNavItemsControlPanel = computed(() => {
    const items: NavItem[] = [];
    if (canAccessControlPanel.value) {
        items.push(
            {
                title: 'Banner',
                href: '/admin/banner',
                icon: GalleryThumbnails,
            },
            {
                title: 'Log Riyadhoh',
                href: '/log-riyadhoh',
                icon: Logs,
            },
            {
                title: 'Rapor Riyadhoh',
                href: '/rapor-riyadhoh',
                icon: Award,
            }
        );
    }      
    return items;  
});
</script>

<template>
    <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" as-child>
                        <Link :href="'/'">
                            <AppLogo />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
            <NavMain :items="mainNavItems" class="z-2"/>
            <NavMainUkhuwah :items="mainNavItemsUkhuwah" class="z-1"/>
            <NavMainControlPanel :items="mainNavItemsControlPanel" v-if="canAccessControlPanel"/>
        </SidebarContent>

        <SidebarFooter>
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>