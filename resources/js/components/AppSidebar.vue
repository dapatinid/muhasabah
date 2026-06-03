<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import { Award, BookOpen, Calendar, FolderGit2, GalleryThumbnails, HeartHandshake, LayoutGrid, Logs } from 'lucide-vue-next';
import AppLogo from '@/components/AppLogo.vue';
import NavFooter from '@/components/NavFooter.vue';
import NavMain from '@/components/NavMain.vue';
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

// Mengambil data shared dari Inertia
const page = usePage();
const canAccessControlPanel = computed(() => page.props.auth?.can_access_control_panel ?? false);
const userClasses = computed(() => page.props.auth?.classes ?? []);

// Membuat menu navigasi dinamis berbasis computed
const mainNavItems = computed(() => {
    // Menu dasar yang bisa dilihat semua user aktif
    const items: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    // Tampilkan menu Kelola Kalam jika user punya class 'penulis'
    if (userClasses.value.includes('penulis')) {
        items.push({
            title: 'Kalam',
            href: '/admin/kalam',
            icon: BookOpen,
        });
    }

    // Tampilkan menu Kelola Donasi jika user punya class 'penggalang-dana'
    if (userClasses.value.includes('penggalang-dana')) {
        items.push({
            title: 'Donasi',
            href: '/admin/donasi',
            icon: HeartHandshake,
        });
    }

    // Tampilkan menu Kelola Acara jika user punya class 'penyelenggara-acara'
    if (userClasses.value.includes('penyelenggara-acara')) {
        items.push({
            title: 'Acara',
            href: '/admin/acara',
            icon: Calendar,
        });
    }
    return items;
});

const mainNavItemsControlPanel = computed(() => {
    const items: NavItem[] = [];
    // 🔒 PROTEKSI UTAMA: Hanya muncul jika lolos pengecekan CanAccessControlPanel
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

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/vue-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#vue',
        icon: BookOpen,
    },
];
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
            <!-- Menggunakan mainNavItems yang sudah dinamis -->
            <NavMain :items="mainNavItems" class="z-1"/>
            <NavMainControlPanel :items="mainNavItemsControlPanel" v-if="canAccessControlPanel"/>
        </SidebarContent>

        <SidebarFooter>
            <!-- NavFooter dinonaktifkan sesuai template asli Anda -->
            <!-- <NavFooter :items="footerNavItems" /> -->
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>