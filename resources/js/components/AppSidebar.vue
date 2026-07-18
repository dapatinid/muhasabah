<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import { Award, BookOpen, Calendar, CircleStar, FolderGit2, GalleryThumbnails, HeartHandshake, LayoutGrid, Logs, MessageCircle, MessageSquare, MoonStar, ShieldCheck, Smile, Star, Target, Ticket, Users, Wallet } from 'lucide-vue-next';
import AppLogo from '@/components/AppLogo.vue';
import NavFooter from '@/components/NavFooter.vue';
import NavMain from '@/components/NavMain.vue';
import NavMainUkhuwah from '@/components/NavMainUkhuwah.vue';
import NavMainAktifitas from '@/components/NavMainAktifitas.vue';
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
const superAdmin = computed(() => page.props.auth?.super_admin ?? false);

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

const mainNavItemsAktifitas = computed(() => {
    const items: NavItem[] = [];
        items.push(
            {
                title: 'Donasi',
                href: '/user/aktifitas/donasi',
                icon: Wallet,
            },
            {
                title: 'Tiket',
                href: '/user/aktifitas/tiket',
                icon: Ticket,
            },
            {
                title: 'Reaksi',
                href: '/user/aktifitas/reaksi',
                icon: Smile,
            },
            {
                title: 'Komentar',
                href: '/user/aktifitas/komentar',
                icon: MessageSquare,
            },
            {
                title: 'Rating',
                href: '/user/aktifitas/rating',
                icon: Star,
            },
        );
    return items;  
});

const mainNavItemsControlPanel = computed(() => {
    const items: NavItem[] = [];
    if (superAdmin.value) {
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
            },
            {
                title: 'Uji Kelayakan',
                href: '/admin/uji-kelayakan',
                icon: ShieldCheck,
            },
            {
                title: 'Kelola Pengguna',
                href: '/admin/pengguna',
                icon: Users,
            },
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
            <NavMain :items="mainNavItems" class="z-3"/>
            <NavMainUkhuwah :items="mainNavItemsUkhuwah" class="z-2"/>
            <NavMainAktifitas :items="mainNavItemsAktifitas" class="z-1"/>
            <NavMainControlPanel :items="mainNavItemsControlPanel" v-if="superAdmin"/>
        </SidebarContent>

        <SidebarFooter>
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>