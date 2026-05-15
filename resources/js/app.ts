import { createInertiaApp } from '@inertiajs/vue3';
import { initializeTheme } from '@/composables/useAppearance';
import AppLayout from '@/layouts/AppLayout.vue';
import AppLayoutPublic from '@/layouts/AppLayoutPublic.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'HalamanDibangun' || 
                name === 'Welcome_backup' : 
                return null;
            case name === 'LaporanRiyadhoh' || 
                name === 'LaporanRiyadhohLog' ||
                name === 'AmalIbadah' ||
                name === 'Kalam' ||
                name === 'KalamShow' ||
                name === 'Donasi' ||
                name === 'DonasiShow' ||
                name === 'DonasiPayment' ||
                name === 'Welcome' :
                return AppLayoutPublic;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();