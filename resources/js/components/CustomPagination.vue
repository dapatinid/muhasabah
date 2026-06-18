<script setup lang="ts">
import { computed } from 'vue'
import { router } from '@inertiajs/vue3'
import { ChevronsLeft, ChevronsRight, Ellipsis } from 'lucide-vue-next'

const props = defineProps<{
    paginator: any;
}>()

const displayedPages = computed(() => {
    const current = props.paginator.current_page;
    const last = props.paginator.last_page;
    const delta = 1; // Menampilkan 1 angka sebelum & sesudah current page
    
    const range = [];
    for (let i = Math.max(1, current - delta); i <= Math.min(last, current + delta); i++) {
        range.push(i);
    }
    return range;
})

const goToPageNumber = (page: number) => {
    // Mengambil URL asli dari paginator (path) dan menambahkan query ?page=X
    router.get(props.paginator.path, { page: page }, { preserveState: true, preserveScroll: true })
}
</script>

<template>
    <div v-if="paginator && paginator.last_page > 1" class="flex justify-center gap-1.5 pt-6 pb-2 flex-wrap items-center border-t border-zinc-100 dark:border-zinc-800 mt-4">
        
        <button
            :disabled="paginator.current_page <= 1"
            @click="goToPageNumber(1)"
            class="px-3 py-1.5 rounded-xl text-xs font-semibold border bg-stone-900 border-stone-800 text-stone-500 hover:border-amber-500/30 hover:text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
            <ChevronsLeft class="h-4 w-4" />
        </button>

        <button v-show="paginator.current_page > 2" disabled class="px-1 py-1.5 rounded-xl text-xs font-semibold border bg-stone-900 border-stone-800 text-stone-500 opacity-40 transition-all">
            <Ellipsis class="h-4 w-4" />
        </button>      

        <button
            v-for="page in displayedPages"
            :key="page"
            @click="goToPageNumber(page)"
            class="px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all"
            :class="page === paginator.current_page
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-stone-900 border-stone-800 text-stone-500 hover:border-amber-500/30 hover:text-stone-300'"
        >
            {{ page }}
        </button>

        <button v-show="paginator.current_page < paginator.last_page - 1" disabled class="px-1 py-1.5 rounded-xl text-xs font-semibold border bg-stone-900 border-stone-800 text-stone-500 opacity-40 transition-all">
            <Ellipsis class="h-4 w-4" />
        </button>   

        <button
            :disabled="paginator.current_page >= paginator.last_page"
            @click="goToPageNumber(paginator.last_page)"
            class="px-3 py-1.5 rounded-xl text-xs font-semibold border bg-stone-900 border-stone-800 text-stone-500 hover:border-amber-500/30 hover:text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
            <ChevronsRight class="h-4 w-4" />
        </button>
    </div>
</template>