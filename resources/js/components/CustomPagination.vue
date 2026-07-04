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
    const delta = 1;
    
    const range = [];
    for (let i = Math.max(1, current - delta); i <= Math.min(last, current + delta); i++) {
        range.push(i);
    }
    return range;
})

const goToPageNumber = (page: number) => {
    router.get(props.paginator.path, { page: page }, { preserveState: true, preserveScroll: true })
}
</script>

<template>
    <div v-if="paginator && paginator.last_page > 1" class="flex justify-center gap-1.5 pt-6 pb-2 flex-wrap items-center border-t border-accent mt-4">
        
        <button
            :disabled="paginator.current_page <= 1"
            @click="goToPageNumber(1)"
            class="px-3 py-1.5 rounded-xl text-xs font-semibold border border-accent text-muted-foreground hover:bg-emerald-500 hover:text-white hover:border-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
            <ChevronsLeft class="h-4 w-4" />
        </button>

        <button v-show="paginator.current_page > 2" disabled class="px-1 py-1.5 rounded-xl text-xs font-semibold border border-accent text-muted-foreground opacity-40 transition-all">
            <Ellipsis class="h-4 w-4" />
        </button>      

        <button
            v-for="page in displayedPages"
            :key="page"
            @click="goToPageNumber(page)"
            class="px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all"
            :class="page === paginator.current_page
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : 'border-accent text-muted-foreground hover:bg-emerald-500 hover:text-white hover:border-emerald-500'"
        >
            {{ page }}
        </button>

        <button v-show="paginator.current_page < paginator.last_page - 1" disabled class="px-1 py-1.5 rounded-xl text-xs font-semibold border border-accent text-muted-foreground opacity-40 transition-all">
            <Ellipsis class="h-4 w-4" />
        </button>   

        <button
            :disabled="paginator.current_page >= paginator.last_page"
            @click="goToPageNumber(paginator.last_page)"
            class="px-3 py-1.5 rounded-xl text-xs font-semibold border border-accent text-muted-foreground hover:bg-emerald-500 hover:text-white hover:border-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
            <ChevronsRight class="h-4 w-4" />
        </button>
    </div>
</template>