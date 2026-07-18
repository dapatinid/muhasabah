<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import CustomPagination from '@/components/CustomPagination.vue'
import { Clock, HeartHandshake, Ticket, MessageSquare, Heart, Star, UserCheck, Calendar, MessageCircle, CornerDownRight } from 'lucide-vue-next'

const props = defineProps<{
    currentTab: string;
    dataList: any;
}>()

// Helper mapping polimorfik type ke nama modul agar mudah dibaca
const getModulePath = (type: string) => {
    if (type?.includes('Donasi')) return 'Program Donasi'
    if (type?.includes('Acara')) return 'Event & Acara'
    if (type?.includes('Kalam')) return 'Kalam Hikmah'
    return 'Postingan Publik'
}

// Fungsi helper untuk menentukan prefix URL
const getRoutePrefix = (type) => {
  if (!type) return 'lingkaran';

  // Daftarkan semua kondisi di sini
  const routes = {
    'Masjid': 'masjid',
    'Donasi': 'donasi',
    'Acara': 'acara',
    'Kalam': 'kalam'
  };

  // Cari key yang terkandung di dalam reaktiable_type
  const match = Object.keys(routes).find(key => type.includes(key));
  
  // Jika cocok gunakan hasilnya, jika tidak ada yang cocok (default) jadi 'lingkaran'
  return match ? routes[match] : 'lingkaran';
};

// ✔️ Nama penulis komentar induk (untuk ditampilkan pada entri balasan)
const getParentAuthorName = (parent: any) => {
  if (!parent) return 'Pengguna'
  return parent.user?.name || parent.nama_publik || 'Pengguna'
}
</script>

<template>
    <Head title="Aktivitas Saya - Komentar" />

    <div class="py-10 px-4 w-full max-w-4xl mx-auto font-poppins">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <MessageSquare class="size-6 text-amber-500" />
                Komentar Saya
            </h1>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Jejak riwayat kontribusi yang pernah Anda berikan.
            </p>
        </div>
        
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden">
            <div class="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2 bg-zinc-50/50 dark:bg-zinc-900/50">
                <Clock class="size-4 text-zinc-400" />
                <h2 class="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">Riwayat Komentar Terbaru</h2>
            </div>

            <div v-if="dataList?.data.length > 0" class="divide-y divide-zinc-100 dark:divide-zinc-800">
                <div v-for="log in dataList.data" :key="log.id" class="p-4 sm:px-6 flex flex-col gap-3 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                    <div class="flex items-center justify-between text-zinc-400 text-[11px]">
                        <div class="flex items-center gap-1.5">
                            <span class="font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-1 rounded-lg flex items-center gap-1.5">
                                <MessageSquare class="size-3" /> {{ getModulePath(log.commentable_type) }}
                            </span>
                            <!-- ✔️ Badge pembeda: tampil hanya jika komentar ini adalah balasan -->
                            <span v-if="log.parent_id" class="font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-lg flex items-center gap-1.5">
                                <CornerDownRight class="size-3" /> Balasan
                            </span>
                        </div>
                        <span>{{ new Date(log.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }}</span>
                    </div>
                    
                    <div>
                        <div class="text-sm font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-1 mb-2 hover:text-indigo-500">
                            Topik: 
                                    <Link :href="`/${getRoutePrefix(log.commentable_type)}/${log.commentable?.slug}`">
                                        "{{ log.commentable?.judul || 'Konten telah dihapus' }}"
                                    </Link>
                        </div>

                        <!-- ✔️ Konteks sub komentar: kutipan komentar induk yang dibalas -->
                        <div v-if="log.parent_id" class="text-xs text-zinc-500 dark:text-zinc-400 border-l-2 border-zinc-200 dark:border-zinc-700 pl-3 mb-2 line-clamp-2">
                            Membalas <span class="font-semibold text-zinc-600 dark:text-zinc-300">{{ getParentAuthorName(log.parent) }}</span>:
                            <span class="italic">"{{ log.parent?.body ?? 'Komentar telah dihapus' }}"</span>
                        </div>

                        <div class="text-sm text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/80 italic shadow-inner">
                            "{{ log.body }}"
                        </div>
                    </div>
                </div>
                
                <CustomPagination :paginator="dataList" />
            </div>

            <div v-else class="py-20 px-4 text-center text-zinc-400 text-sm">
                <MessageSquare class="size-6 mx-auto mb-2 opacity-30" />
                Belum ada aktivitas komentar yang tercatat pada akun Anda.
            </div>
        </div>
    </div>
</template>

<style scoped>
.scrollbar-none::-webkit-scrollbar { display: none; }
.scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
</style>