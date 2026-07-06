<script setup lang="ts">
import { Head, useForm, Link, usePage } from '@inertiajs/vue3'
import TiptapEditor from '@/components/TiptapEditor.vue'
import { ArrowLeft, 
    Globe, 
    Lock, 
    Save, 
    Search,
    Settings, 
    ChevronDown, 
    SquarePen, 
    HeartHandshake, 
    MessageSquare,
 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { computed, ref } from 'vue'

const page = usePage();
const user = page.props.auth.user;

const props = defineProps<{
    kalam: {
        id: number;
        slug: string;
        judul: string;
        body: string;
        kategori: string;
        is_anonymous: boolean | number;
        is_published: boolean | number;
    };
    users: Array<{ id: number, name: string, slug: string }>; // (TAMBAHAN) Daftar semua user
    attachedUsers: Array<number>;
    breadcrumbs: any;
}>();

// Inisialisasi form dengan data yang ada dari props
const form = useForm({
    judul: props.kalam.judul,
    slug: props.kalam.slug,
    body: props.kalam.body,
    kategori: props.kalam.kategori,
    // Kita pastikan menjadi boolean karena checkbox butuh boolean
    is_anonymous: Boolean(props.kalam.is_anonymous),
    is_published: Boolean(props.kalam.is_published),
    users: props.attachedUsers ?? [],
})

const dropdownOpen = ref(false)

// Fitur Filter dan Auto-Sort User (Tercentang di Atas)
const searchUser = ref('');
const filteredUsers = computed(() => {
    // 1. Filter berdasarkan pencarian nama terlebih dahulu
    let result = props.users;
    if (searchUser.value) {
        const lower = searchUser.value.toLowerCase();
        result = result.filter(u => u.slug.toLowerCase().includes(lower));
    }

    // 2. Urutkan hasilnya (Reaktif terhadap form.users)
    return [...result].sort((a, b) => {
        // Cek apakah ID user ada di dalam array checkbox yang terpilih
        const isCheckedA = form.users.includes(a.id);
        const isCheckedB = form.users.includes(b.id);

        // Jika A tercentang dan B tidak, A naik ke atas (-1)
        if (isCheckedA && !isCheckedB) return -1;
        // Jika B tercentang dan A tidak, B naik ke atas (1)
        if (!isCheckedA && isCheckedB) return 1;

        // Jika status centangnya sama (sama-sama tercentang atau tidak tercentang), 
        // urutkan rapi berdasarkan abjad nama
        return a.slug.localeCompare(b.slug);
    });
});

const categories = [
    { label: 'Hikmah', value: 'hikmah' },
    { label: 'Doa', value: 'doa' },
    { label: 'Kisah', value: 'kisah' },
    { label: 'Tips & Trik', value: 'tips' },
    { label: 'Berita', value: 'berita' },
]

function submit() {
  form.put(`/admin/kalam/${props.kalam.slug}`, {
    preserveScroll: true,
  })
}

</script>

<template>
    <Head :title="`Edit: ${props.kalam.judul}`" />
        <div class="py-10 px-4 max-w-4xl mx-auto">
            
        <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
                <div>
                    <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        Edit Kalam
                    </h1>
                    <p class="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                        Kelola konten teks, media, reaksi, serta komentar publik.
                    </p>
                </div>

                <div class="relative z-50">
                    <button 
                        type="button"
                        @click="dropdownOpen = !dropdownOpen"
                        class="w-full md:w-auto inline-flex items-center justify-between gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
                    >
                        <span class="flex items-center gap-2">
                            <Settings class="size-4 text-zinc-400" />
                            Opsi Navigasi
                        </span>
                        <ChevronDown class="size-4 text-zinc-400 transition-transform duration-200" :class="{ 'rotate-180': dropdownOpen }" />
                    </button>

                    <div v-if="dropdownOpen" class="fixed inset-0 z-40" @click="dropdownOpen = false"></div>

                    <div 
                        v-if="dropdownOpen"
                        class="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl py-1.5 z-50 origin-top-right divide-y divide-zinc-100 dark:divide-zinc-800"
                    >
                        <div class="px-1 py-1">
                            <Link 
                                :href="`/admin/kalam/${kalam.slug}/edit`"
                                @click="dropdownOpen = false"
                                class="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors w-full text-left text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20"
                            >
                                <SquarePen class="size-4 shrink-0" />
                                Edit Konten Kalam
                            </Link>
                        </div>

                        <div class="px-1 py-1">
                            <Link 
                                :href="`/admin/kalam/${kalam.slug}/reaksi`"
                                @click="dropdownOpen = false"
                                class="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors w-full text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                            >
                                <HeartHandshake class="size-4 text-zinc-400 shrink-0" />
                                Manajemen Reaksi
                            </Link>
                            
                            <Link 
                                :href="`/admin/kalam/${kalam.slug}/komentar`"
                                @click="dropdownOpen = false"
                                class="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors w-full text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                            >
                                <MessageSquare class="size-4 text-zinc-400 shrink-0" />
                                Komentar Publik
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <form @submit.prevent="submit" class="space-y-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm">

                <!-- Status Publikasi -->
                <div v-if="user.level === 'Super Admin'" class="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div :class="form.is_published ? 'bg-blue-100 text-blue-600' : 'bg-zinc-200 text-zinc-500'" class="p-2 rounded-lg">
                                <Globe v-if="form.is_published" class="size-5" />
                                <Lock v-else class="size-5" />
                            </div>
                            <div>
                                <label for="is_published" class="text-sm font-bold cursor-pointer block">
                                    {{ form.is_published ? 'Terbit (Publik)' : 'Draft (Privat)' }}
                                </label>
                                <p class="text-[11px] text-zinc-500">Tentukan visibilitas program ini bagi pembaca.</p>
                            </div>
                        </div>
                        <input 
                            type="checkbox" 
                            id="is_published" 
                            v-model="form.is_published"
                            class="size-6 rounded-lg border-zinc-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                        />
                    </div>
                </div>
                
                <div class="space-y-2">
                    <Label for="judul">Judul Kalam</Label>
                    <Input 
                        id="judul" 
                        v-model="form.judul" 
                        placeholder="Masukkan judul..." 
                        class="text-lg font-semibold h-12 rounded-xl focus:ring-emerald-500"
                        required
                    />
                    <div v-if="form.errors.judul" class="text-red-500 text-xs mt-1">{{ form.errors.judul }}</div>
                </div>
                <div class="space-y-2">
                    <Label for="slug">Slug</Label>
                    <Input 
                        id="slug" 
                        v-model="form.slug" 
                        placeholder="Masukkan slug..." 
                        class="text-lg font-semibold h-12 rounded-xl focus:ring-emerald-500"
                        required
                    />
                    <div v-if="form.errors.slug" class="text-red-500 text-xs mt-1">{{ form.errors.slug }}</div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <Label for="kategori">Kategori Konten</Label>
                        <select 
                            id="kategori"
                            v-model="form.kategori"
                            class="w-full h-11 px-3 rounded-xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                        >
                            <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                                {{ cat.label }}
                            </option>
                        </select>
                        <div v-if="form.errors.kategori" class="text-red-500 text-xs mt-1">{{ form.errors.kategori }}</div>
                    </div>

                    <div class="flex items-center space-x-3 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                        <input 
                            type="checkbox" 
                            id="is_anonymous" 
                            v-model="form.is_anonymous"
                            class="size-5 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <div class="grid gap-1.5 leading-none">
                            <label for="is_anonymous" class="text-sm font-medium leading-none cursor-pointer text-zinc-700 dark:text-zinc-300">
                                Posting sebagai Hamba Allah
                            </label>
                            <p class="text-[11px] text-zinc-500">Identitas Anda akan disembunyikan jika opsi ini aktif.</p>
                        </div>
                    </div>
                </div>

            <div class="space-y-2">
                <Label>Pilih Kontributor Penulis</Label>
                <p class="text-[10px] text-zinc-500 mb-2">Pilih pengguna yang terkait kalam (artikel) ini.</p>
                
                <div class="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
                    <div class="p-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 relative">
                        <Search class="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                        <input 
                            type="text"
                            v-model="searchUser"
                            placeholder="Cari nama pengguna..."
                            class="w-full pl-8 pr-3 py-1.5 text-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-zinc-900 dark:text-zinc-100"
                        />
                    </div>
                    
                    <div class="max-h-52 overflow-y-auto p-2 space-y-1">
                        <label 
                            v-for="user in filteredUsers" 
                            :key="user.id" 
                            class="flex items-center gap-3 p-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800"
                        >
                            <input 
                                type="checkbox" 
                                :value="user.id" 
                                v-model="form.users"
                                class="size-4 rounded border-zinc-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                            />
                            <span class="text-sm font-medium text-zinc-700 dark:text-zinc-200">{{ user.slug }} ~ {{ user.name }}</span>
                        </label>
                        
                        <div v-if="filteredUsers.length === 0" class="p-6 text-center text-sm text-zinc-500 italic">
                            Pengguna tidak ditemukan.
                        </div>
                    </div>
                </div>
                <div v-if="form.errors.users" class="text-red-500 text-xs mt-1">{{ form.errors.users }}</div>
            </div>       

                <div class="space-y-2">
                    <div class="flex justify-between items-center">
                        <Label>Isi Kalam</Label>
                        <span class="text-[10px] text-zinc-400 italic">Terakhir diubah: {{ new Date().toLocaleTimeString() }}</span>
                    </div>
                    <TiptapEditor v-model="form.body" />
                    <div v-if="form.errors.body" class="text-red-500 text-xs mt-1">{{ form.errors.body }}</div>
                </div>

                <div class="flex justify-between items-center pt-6 border-t border-zinc-100 dark:border-zinc-800">
                    <p class="text-xs text-zinc-400 italic">* Perubahan akan langsung diterbitkan setelah Anda menekan tombol simpan.</p>
                    
                    <div class="flex gap-3">
                        <Link href="/admin/kalam" class="px-6 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-bold hover:bg-secondary transition-colors">
                            Batal
                        </Link>
                        <Button 
                            type="submit" 
                            class="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-11 rounded-xl font-bold gap-2 shadow-lg shadow-emerald-500/20"
                            :disabled="form.processing"
                        >
                            <Save class="size-4" />
                            {{ form.processing ? 'Menyimpan...' : 'Simpan Perubahan' }}
                        </Button>
                    </div>
                </div>

            </form>
        </div>
</template>