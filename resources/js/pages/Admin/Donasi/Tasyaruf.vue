<script setup lang="ts">
import { computed, ref } from 'vue'
import { Head, Link, useForm } from '@inertiajs/vue3'
import { ArrowLeft, Settings, ChevronDown, HeartHandshake, MessageSquare, ArrowDownCircle, ArrowUpCircle, PlusCircle, Inbox, X, Save, Eye, SquarePen } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const props = defineProps<{
    donasi: { id: number; judul: string; slug: string; saldo: number };
    tasyarufs: { data: Array<any> };
}>()

const dropdownOpen = ref(false)
const modalOpen = ref(false)

// Form State menggunakan Inertia useForm
const form = useForm({
    nominal: '',
    rekening: 'BSI Utama',
    notes: ''
})

const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}

const submitTasyaruf = () => {
    form.post(`/admin/donasi/${props.donasi.slug}/tasyaruf`, {
        preserveScroll: true,
        onSuccess: () => {
            modalOpen.value = false
            form.reset()
        }
    })
}

const total_tasyaruf = computed(() => {
    return props.tasyarufs.data.reduce((total, item) => total + item.nominal, 0)
})
</script>

<template>
    <Head :title="`Tasyaruf Keluar: ${donasi.judul}`" />
    
    <div class="py-10 px-4 w-full mx-auto space-y-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
                <Link href="/admin/donasi" class="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-indigo-600 transition-colors">
                    <ArrowLeft class="size-5" />
                </Link>
                <div>
                    <h1 class="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Penyaluran Dana (Tasyaruf)</h1>
                    <p class="text-sm text-zinc-500">Log historis pencairan operasional dan penyaluran kemanfaatan dana.</p>
                </div>
            </div>

            <!-- DROPDOWN NAVIGASI -->
            <div class="relative flex">
                <button type="button" @click="dropdownOpen = !dropdownOpen" @blur="setTimeout(() => dropdownOpen = false, 200)" class="ms-auto h-11 px-5 inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-200 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all">
                    <Settings class="size-4 text-zinc-400" />
                    <span>Kelola</span>
                    <ChevronDown class="size-4 text-zinc-400" :class="{ 'rotate-180': dropdownOpen }" />
                </button>
                <div v-if="dropdownOpen" class="absolute right-0 mt-12 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 py-2">
                    <div class="px-2"><Link :href="`/admin/donasi/${donasi.slug}/edit`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><SquarePen class="size-4 text-zinc-400" />Edit Konten</Link></div>
                    <div class="px-2"><Link :href="`/donasi/${donasi.slug}`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><Eye class="size-4 text-zinc-400" />Preview Publik</Link></div>
                    <div class="px-2"><Link :href="`/admin/donasi/${donasi.slug}/reaksi`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><HeartHandshake class="size-4 text-zinc-400" />Reaksi / Emoticon</Link></div>
                    <div class="px-2"><Link :href="`/admin/donasi/${donasi.slug}/komentar`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><MessageSquare class="size-4 text-zinc-400" />Komentar & Doa</Link></div>
                    <div class="px-2"><Link :href="`/admin/donasi/${donasi.slug}/donasi-masuk`" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl"><ArrowDownCircle class="size-4 text-emerald-500" />Donasi Masuk</Link></div>
                    <div class="px-2"><span class="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl"><ArrowUpCircle class="size-4" />Tasyaruf Keluar</span></div>
                </div>
            </div>
        </div>

        <!-- SALDO INFO & BUTTON PENCATATAN -->
        <div class="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div>
                <span class="text-xs text-zinc-500 block">Saldo vs Tasyaruf</span>
                <span class="text-base sm:text-xl md:text-2xl font-black text-blue-500">{{ formatIDR(donasi.saldo) }}</span>
                <span class="mx-3">VS</span>
                <span class="text-base sm:text-xl md:text-2xl font-black text-amber-500">{{ formatIDR(total_tasyaruf) }}</span>
            </div>
            <button 
                type="button" 
                @click="modalOpen = true"
                class="w-full sm:w-auto h-11 px-6 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 transition-all shadow-md"
            >
                <PlusCircle class="size-4" />
                Catat Tasyaruf
            </button>
        </div>

        <!-- TABLE TASYARUF -->
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-zinc-50 dark:bg-zinc-950 text-xs font-bold text-zinc-500 uppercase border-b border-zinc-200 dark:border-zinc-800">
                            <th class="p-4 pl-6">Tanggal</th>
                            <th class="p-4">Keterangan Penyaluran</th>
                            <th class="p-4">Sumber Rekening</th>
                            <th class="p-4 pr-6 text-right">Nominal Keluar</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-sm text-zinc-600 dark:text-zinc-300">
                        <tr v-for="tas in tasyarufs.data" :key="tas.id" class="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20">
                            <td class="p-4 pl-6 text-xs text-zinc-400">{{ new Date(tas.date).toLocaleDateString('id-ID') }}</td>
                            <td class="p-4 font-medium text-zinc-800 dark:text-white">{{ tas.notes }}</td>
                            <td class="p-4 text-xs font-mono text-zinc-400">{{ tas.rekening }}</td>
                            <td class="p-4 pr-6 text-right font-bold text-red-500">- {{ formatIDR(tas.nominal) }}</td>
                        </tr>
                        <tr v-if="tasyarufs.data.length === 0">
                            <td colspan="4" class="p-12 text-center text-zinc-400">
                                <Inbox class="size-6 mx-auto mb-2 opacity-30" />
                                Belum ada riwayat penyaluran/tasyaruf dana keluar dari program ini.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- MODAL DIALOG POPUP FORM -->
        <div v-if="modalOpen" class="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-6 relative">
                <button @click="modalOpen = false" class="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                    <X class="size-5" />
                </button>

                <div>
                    <h3 class="text-xl font-bold text-zinc-900 dark:text-white">Pencatatan Tasyaruf</h3>
                    <p class="text-xs text-zinc-500">Input pengeluaran dana untuk kemanfaatan atau operasional program.</p>
                </div>

                <form @submit.prevent="submitTasyaruf" class="space-y-4">
                    <div class="space-y-1.5">
                        <Label for="nominal">Nominal Pengeluaran (Rp)</Label>
                        <Input 
                            id="nominal" 
                            type="number" 
                            v-model="form.nominal" 
                            placeholder="Contoh: 500000" 
                            required 
                            :max="donasi.saldo"
                            class="h-11 rounded-xl"
                        />
                        <div v-if="form.errors.nominal" class="text-red-500 text-xs">{{ form.errors.nominal }}</div>
                        <span class="text-[10px] text-zinc-400 block">Maksimal dana yang dapat disalurkan: <strong>{{ formatIDR(donasi.saldo) }}</strong></span>
                    </div>

                    <div class="space-y-1.5">
                        <Label for="rekening">Diambil dari Rekening / Kas</Label>
                        <select 
                            id="rekening"
                            v-model="form.rekening"
                            class="w-full h-11 px-3 rounded-xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                        <option value="Kas Tunai">Kas Tunai / Cash</option>
                            <option value="BSI Utama">BSI Utama (1234xxxx)</option>
                            <option value="Mandiri Ummat">Mandiri Ummat (5678xxxx)</option>
                        </select>
                    </div>

                    <div class="space-y-1.5">
                        <Label for="notes">Keterangan / Keperluan Penyaluran</Label>
                        <textarea 
                            id="notes" 
                            v-model="form.notes" 
                            rows="3" 
                            placeholder="Tulis rincian alokasi penyaluran dana..."
                            required
                            class="w-full p-3 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 focus:ring-indigo-500 focus:border-indigo-500"
                        ></textarea>
                        <div v-if="form.errors.notes" class="text-red-500 text-xs">{{ form.errors.notes }}</div>
                    </div>

                    <div class="flex gap-3 pt-2">
                        <button 
                            type="button" 
                            @click="modalOpen = false" 
                            class="flex-1 h-11 text-center rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            Batal
                        </button>
                        <Button 
                            type="submit" 
                            :disabled="form.processing"
                            class="flex-1 bg-amber-500 hover:bg-amber-600 text-zinc-950 h-11 rounded-xl font-bold gap-2 shadow-lg shadow-amber-500/10"
                        >
                            <Save class="size-4" />
                            {{ form.processing ? 'Menyimpan...' : 'Simpan Mutasi' }}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>