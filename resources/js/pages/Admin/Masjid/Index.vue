<script setup lang="ts">
import { Head, router, usePage, Link } from '@inertiajs/vue3'
import { ref, computed, watch } from 'vue'
import debounce from 'lodash/debounce'
import { Search, Plus, Pencil, Star, Eye } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Masjid', href: '/admin/masjid' },
        ],
    },
});

const page = usePage()
const masjids = computed(() => page.props.masjids as any)
const search = ref(page.props.filters?.search ?? '')

// Watch search dengan debounce agar tidak spam request ke server
watch(
  search,
  debounce((val) => {
    router.get(
      '/admin/masjid',
      { search: val || undefined },
      { preserveState: true, preserveScroll: true, replace: true }
    )
  }, 1000)
)

function goToPage(url: string | null) {
  if (url) router.get(url)
}

// Fungsi pembantu mempercantik teks label tipe jenis
function formatJenis(jenis: string) {
    return jenis.charAt(0).toUpperCase() + jenis.slice(1)
}
</script>

<template>
    <Head title="Manajemen Masjid" />

    <div class="space-y-6 p-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div>
                <h1 class="text-xl font-bold text-zinc-900 dark:text-white">Manajemen Masjid</h1>
                <p class="text-xs text-zinc-500 mt-1">Kelola data komunitas, yayasan, lembaga, dan kelompok jamaah.</p>
            </div>
            <Link href="/admin/masjid/create" class="w-full sm:w-auto">
                <Button class="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-bold h-11 shadow-lg shadow-emerald-500/10">
                    <Plus class="size-4" /> Masjid
                </Button>
            </Link>
        </div>

        <div class="flex items-center gap-3 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div class="relative flex-1 max-w-md">
                <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <input 
                    type="text"
                    v-model="search"
                    placeholder="Cari nama masjid atau jenis..."
                    class="w-full pl-10 pr-4 h-11 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                />
            </div>
        </div>

        <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                            <th class="px-6 py-4">Nama Masjid</th>
                            <th class="px-6 py-4">Jenis</th>
                            <th class="px-6 py-4">Kontak</th>
                            <th class="px-6 py-4">Alamat</th>
                            <th class="px-6 py-4">Rating</th>
                            <th class="px-6 py-4">Media</th> <th class="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
                        <tr v-if="masjids.data.length === 0">
                            <td colspan="7" class="px-6 py-10 text-center text-zinc-400 italic">
                                Belum ada data masjid ditemukan.
                            </td>
                        </tr>
                        <tr v-for="masjid in masjids.data" :key="masjid.id" class="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                            <td class="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                                {{ masjid.nama }}
                            </td>
                            <td class="px-6 py-4">
                                <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                                    {{ formatJenis(masjid.jenis) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                                {{ masjid.kontak || '-' }}
                            </td>
                            <td class="px-6 py-4 text-zinc-500 max-w-xs truncate">
                                {{ masjid.alamat || '-' }}
                            </td>

                            <td class="px-6 py-4">
                                <div class="flex items-center gap-1.5">
                                    <Star class="size-4 fill-amber-400 text-amber-400 shrink-0" />
                                    <span class="font-semibold text-zinc-900 dark:text-zinc-100">
                                        {{ masjid.ratings_avg_score ? Number(masjid.ratings_avg_score).toFixed(1) : '0.0' }}
                                    </span>
                                    <span class="text-xs text-zinc-400 dark:text-zinc-500">
                                        ({{ masjid.ratings_count || 0 }})
                                    </span>
                                </div>
                            </td>                            
                            
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2">
                                    <div class="shrink-0 size-8 rounded-full border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center">
                                        <img v-if="masjid.logo" :src="`/storage/${masjid.logo}`" class="w-full h-full object-cover" alt="Logo" />
                                        <span v-else class="text-[8px] font-medium text-zinc-400">Logo</span>
                                    </div>
                                    
                                    <div class="shrink-0 w-12 h-8 rounded-md border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center">
                                        <img v-if="masjid.sampul" :src="`/storage/${masjid.sampul}`" class="w-full h-full object-cover" alt="Sampul" />
                                        <span v-else class="text-[8px] font-medium text-zinc-400">Sampul</span>
                                    </div>
                                </div>
                            </td>

                            <td class="px-6 py-4 text-end flex justify-end">
                                <Link :href="`/admin/masjid/${masjid.slug}/edit`">
                                    <Button variant="ghost" size="icon" class="hover:bg-emerald-50 text-emerald-600 dark:hover:bg-emerald-950/30 rounded-xl size-9">
                                        <Pencil class="size-4" />
                                    </Button>
                                </Link>
                                <Link :href="`/masjid/${masjid.slug}`">
                                    <Button variant="ghost" size="icon" class="hover:bg-emerald-50 text-emerald-600 dark:hover:bg-emerald-950/30 rounded-xl size-9">
                                        <Eye class="size-4" />
                                    </Button>
                                </Link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="masjids.links.length > 3" class="flex justify-center gap-1 p-4 border-t border-zinc-100 dark:border-zinc-800 overflow-x-auto">
                <button
                    v-for="(link, i) in masjids.links"
                    :key="i"
                    @click="goToPage(link.url)"
                    v-html="link.label"
                    class="shrink-0 px-4 py-2 rounded-xl text-sm transition-all"
                    :class="[
                        link.active ? 'bg-emerald-600 text-white font-bold' : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50',
                        !link.url ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                    ]"
                />
            </div>
        </div>
    </div>
</template>