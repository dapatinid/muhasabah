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
            // Pindahkan halaman-halaman ini ke sini agar tidak di-wrap ganda oleh Inertia
            case name === 'HalamanDibangun' || 
                 name === 'Welcome_backup' ||
                 name === 'LaporanRiyadhoh' || 
                 name === 'LaporanRiyadhohLog' ||
                 name === 'AmalIbadah' ||
                 name === 'Kalam' ||
                 name === 'KalamShow' ||
                 name === 'Acara' ||
                 name === 'AcaraShow' ||
                 name === 'AcaraPayment' ||
                 name === 'Donasi' ||
                 name === 'DonasiShow' ||
                 name === 'DonasiPayment' ||
                 name === 'Ukhuwah' ||
                 name === 'Tokoh' ||
                 name === 'Lingkaran' ||
                 name === 'Masjid' ||
                 name === 'Obrolan' ||
                 name === 'Welcome' : 
                return null; 
            
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