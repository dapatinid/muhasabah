<script setup lang="ts">
import { computed } from 'vue';
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, 
    DialogDescription, DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface JawabanDetail {
    question_id: number;
    question_text: string;
    choice: string;
    reason: string;
}

interface UjiKelayakan {
    id: number;
    user_id: number;
    class: string;
    kategori: string;
    jawaban: string | JawabanDetail[];
    user?: {
        name: string;
        email: string;
    };
}

const props = defineProps<{
    open: boolean;
    item: UjiKelayakan | null;
}>();

const emit = defineEmits(['close']);

// Mengurai kolom JSON agar aman dibaca baik berupa string mentah maupun array objek
const daftarJawaban = computed<JawabanDetail[]>(() => {
    if (!props.item?.jawaban) return [];
    if (typeof props.item.jawaban === 'string') {
        try {
            return JSON.parse(props.item.jawaban);
        } catch (e) {
            return [];
        }
    }
    return props.item.jawaban;
});

// Perhitungan Score secara Frontend
const totalScore = computed(() => {
    return daftarJawaban.value.reduce((acc, jawab) => {
        const choice = jawab.choice ? jawab.choice.trim().toLowerCase() : '';
        
        if (choice === 'sangat setuju') {
            return acc + 10;
        } else if (choice === 'setuju') {
            return acc + 5;
        } else if (choice === 'tidak setuju') {
            return acc - 5;
        } else if (choice === 'sangat tidak setuju') {
            return acc - 10;
        }
        
        return acc;
    }, 0);
});

// Menentukan style badge berdasarkan pilihan jawaban kuesioner
function getChoiceClass(choice: string): string {
    const cleanChoice = choice ? choice.trim().toLowerCase() : '';
    
    if (cleanChoice === 'sangat tidak setuju') {
        return 'bg-red-50 text-red-500 dark:bg-red-950/30 border-red-200/60';
    }
    if (cleanChoice === 'tidak setuju') {
        return 'bg-amber-50 text-amber-500 dark:bg-amber-950/30 border-amber-200/60';
    }
    if (cleanChoice === 'setuju') {
        return 'bg-indigo-50 text-indigo-500 dark:bg-indigo-950/30 border-indigo-200/60';
    }
    if (cleanChoice === 'sangat setuju') {
        return 'bg-emerald-50 text-emerald-500 dark:bg-emerald-950/30 border-emerald-200/60';
    }
    
    return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200';
}
</script>

<template>
    <Dialog :open="props.open" @update:open="emit('close')">
        <DialogContent class="sm:max-w-[650px] max-h-[85vh] flex flex-col p-0 overflow-hidden">
            
            <DialogHeader class="p-6 pb-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-row items-start justify-between gap-4">
                <div class="flex-1 space-y-1">
                    <DialogTitle class="text-xl font-bold text-zinc-800 dark:text-zinc-100">
                        Detail Hasil Komitmen
                    </DialogTitle>
                    <DialogDescription class="leading-relaxed">
                        Peserta: <span class="font-semibold text-zinc-700 dark:text-zinc-300">{{ props.item?.user?.name ?? `User ID ${props.item?.user_id}` }}</span> 
                        <span class="mx-1.5">•</span> Kelas: <span class="capitalize font-semibold">{{ props.item?.class }}</span>
                        <br />
                        Kategori: <span class="text-emerald-600 dark:text-emerald-400 font-medium">{{ props.item?.kategori }}</span>
                    </DialogDescription>
                </div>

                <div class="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700 text-center min-w-[120px]">
                    <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                        Total Skor
                    </span>
                    <span class="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                        {{ totalScore }}
                    </span>
                    <span class="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">
                        {{ daftarJawaban.length }} Questioner
                    </span>
                </div>
            </DialogHeader>

            <div class="flex-1 overflow-y-auto p-6 space-y-5 bg-zinc-50/50 dark:bg-zinc-900/20">
                <div 
                    v-for="(jawab, index) in daftarJawaban" 
                    :key="jawab.question_id"
                    class="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-3"
                >
                    <div class="flex items-start justify-between gap-4">
                        <div class="flex gap-2">
                            <span class="text-xs font-bold text-zinc-400 mt-0.5 min-w-[18px]">
                                {{ index + 1 }}.
                            </span>
                            <p class="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
                                {{ jawab.question_text }}
                            </p>
                        </div>
                    </div>

                    <div class="ps-6">
                        <span 
                            class="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold border"
                            :class="getChoiceClass(jawab.choice)"
                        >
                            {{ jawab.choice }}
                        </span>
                    </div>

                    <div class="ps-6 pt-1">
                        <div class="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg border border-zinc-100 dark:border-zinc-800/60">
                            <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                                Alasan / Komitmen Lapangan:
                            </span>
                            <p class="text-xs text-zinc-600 dark:text-zinc-300 italic whitespace-pre-line leading-relaxed">
                                "{{ jawab.reason }}"
                            </p>
                        </div>
                    </div>
                </div>

                <div v-if="daftarJawaban.length === 0" class="text-center py-8 text-zinc-400 text-sm">
                    Struktur jawaban tidak valid atau kosong.
                </div>
            </div>

            <DialogFooter class="p-4 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
                <Button type="button" variant="outline" @click="emit('close')">
                    Tutup Preview
                </Button>
            </DialogFooter>

        </DialogContent>
    </Dialog>
</template>