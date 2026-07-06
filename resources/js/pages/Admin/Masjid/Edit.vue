<script setup lang="ts">
import { Head, useForm, Link, usePage } from '@inertiajs/vue3'
import { ref, computed } from 'vue'
import { ArrowLeft, Save, Globe, Lock, Trash2, Search } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import TiptapEditor from '@/components/TiptapEditor.vue' 

const page = usePage();
const user = page.props.auth.user;

const props = defineProps<{
    masjid: {
        id: number;
        nama: string;
        slug: string;
        jenis: string;
        kontak: string | null;
        alamat: string | null;
        deskripsi: string | null;
        logo: string | null;
        sampul: string | null;
        is_published: boolean;
    };
    users: Array<{ id: number, name: string }>; // Props daftar semua user
    attachedUsers: Array<number>; // Props ID user yang sudah tergabung
}>();

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Masjid', href: '/admin/masjid' },
            { title: 'Edit Data', href: '#' },
        ],
    },
});

const form = useForm({
  _method: 'put',
  nama: props.masjid.nama,
  slug: props.masjid.slug,
  jenis: props.masjid.jenis,
  kontak: props.masjid.kontak ?? '',
  alamat: props.masjid.alamat ?? '',
  deskripsi: props.masjid.deskripsi ?? '',
  logo: null,
  sampul: null,
  is_published: Boolean(props.masjid.is_published),
  users: props.attachedUsers ?? [], // Isi default array users dari database pivot
})

const categories = [
  { label: 'Masjid', value: 'masjid' },
  { label: 'Mushola', value: 'mushola' },
]

// Fitur Filter dan Auto-Sort User (Tercentang di Atas)
const searchUser = ref('');
const filteredUsers = computed(() => {
    // 1. Filter berdasarkan pencarian nama terlebih dahulu
    let result = props.users;
    if (searchUser.value) {
        const lower = searchUser.value.toLowerCase();
        result = result.filter(u => u.name.toLowerCase().includes(lower));
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
        return a.name.localeCompare(b.name);
    });
});

const logoPreview = ref(props.masjid.logo ? `/storage/${props.masjid.logo}` : null)
const sampulPreview = ref(props.masjid.sampul ? `/storage/${props.masjid.sampul}` : null)
const showDeleteDialog = ref(false)

function handleLogoUpload(e: any) {
    const file = e.target.files[0]
    form.logo = file
    logoPreview.value = URL.createObjectURL(file)
}

function handleSampulUpload(e: any) {
    const file = e.target.files[0]
    form.sampul = file
    sampulPreview.value = URL.createObjectURL(file)
}

function submit() {
  form.post(`/admin/masjid/${props.masjid.slug}`)
}

function deleteMasjid() {
    form.delete(`/admin/masjid/${props.masjid.slug}`, {
        onSuccess: () => {
            showDeleteDialog.value = false
        }
    })
}
</script>

<template>
    <Head :title="`Edit Masjid - ${props.masjid.nama}`" />

    <div class="p-6">
        <div class="mb-6 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <Link href="/admin/masjid" class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-500 transition-colors">
                    <ArrowLeft class="size-5" />
                </Link>
                <div>
                    <h1 class="text-xl font-bold text-zinc-900 dark:text-white">Edit Masjid</h1>
                    <p class="text-xs text-zinc-500 mt-0.5">Ubah rincian profil data masjid terpilih.</p>
                </div>
            </div>

            <Button 
                type="button" 
                variant="destructive"
                class="rounded-xl font-bold h-10 gap-2"
                @click="showDeleteDialog = true"
            >
                <Trash2 class="size-4" />
                Hapus
            </Button>
        </div>

        <form @submit.prevent="submit">
            <div class="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-6">

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
                            <p class="text-[11px] text-zinc-500">Tentukan visibilitas program ini bagi pengunjung.</p>
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
            
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <Label>Logo (Opsional)</Label>
                        <div class="flex items-center gap-4">
                            <div class="shrink-0 size-16 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 overflow-hidden flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/50">
                                <img v-if="logoPreview" :src="logoPreview" class="w-full h-full object-cover" />
                                <span v-else class="text-xs text-zinc-400">Logo</span>
                            </div>
                            <div class="flex-1">
                                <Input type="file" accept="image/*" @change="handleLogoUpload" class="h-10 cursor-pointer" />
                                <p class="text-[10px] text-zinc-500 mt-1">Maks 2MB. Format: JPG, PNG, WEBP.</p>
                            </div>
                        </div>
                        <div v-if="form.errors.logo" class="text-red-500 text-xs">{{ form.errors.logo }}</div>
                    </div>

                    <div class="space-y-2">
                        <Label>Sampul (Opsional)</Label>
                        <div class="flex items-center gap-4">
                            <div class="shrink-0 w-24 h-16 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 overflow-hidden flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/50">
                                <img v-if="sampulPreview" :src="sampulPreview" class="w-full h-full object-cover" />
                                <span v-else class="text-xs text-zinc-400">Sampul</span>
                            </div>
                            <div class="flex-1">
                                <Input type="file" accept="image/*" @change="handleSampulUpload" class="h-10 cursor-pointer" />
                            </div>
                        </div>
                        <div v-if="form.errors.sampul" class="text-red-500 text-xs">{{ form.errors.sampul }}</div>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <Label for="nama">Nama Masjid</Label>
                        <Input id="nama" v-model="form.nama" placeholder="Masukkan nama masjid..." required />
                        <div v-if="form.errors.nama" class="text-red-500 text-xs mt-1">{{ form.errors.nama }}</div>
                    </div>

                    <div class="space-y-2">
                        <Label for="jenis">Jenis Masjid</Label>
                        <select 
                            id="jenis" 
                            v-model="form.jenis"
                            class="flex h-11 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 text-zinc-900 dark:text-zinc-100"
                        >
                            <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                                {{ cat.label }}
                            </option>
                        </select>
                        <div v-if="form.errors.jenis" class="text-red-500 text-xs mt-1">{{ form.errors.jenis }}</div>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <Label for="slug">Slug</Label>
                        <Input id="slug" v-model="form.slug" placeholder="Masukkan slug..." required />
                        <div v-if="form.errors.slug" class="text-red-500 text-xs mt-1">{{ form.errors.slug }}</div>
                    </div>                

                    <div class="space-y-2">
                        <Label for="kontak">Kontak / No. WA PJ</Label>
                        <Input id="kontak" v-model="form.kontak" placeholder="Contoh: 085950540055" />
                        <div v-if="form.errors.kontak" class="text-red-500 text-xs mt-1">{{ form.errors.kontak }}</div>
                    </div>
                </div>

                <div class="space-y-2">
                    <Label for="alamat">Alamat Lengkap</Label>
                    <textarea 
                        id="alamat" 
                        v-model="form.alamat" 
                        rows="3"
                        placeholder="Tuliskan alamat sekretariat atau pusat kegiatan..."
                        class="flex w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 text-zinc-900 dark:text-zinc-100"
                    ></textarea>
                    <div v-if="form.errors.alamat" class="text-red-500 text-xs mt-1">{{ form.errors.alamat }}</div>
                </div>

                <div class="space-y-2">
                    <Label>Pilih Anggota / Pengelola</Label>
                    <p class="text-[10px] text-zinc-500 mb-2">Pilih pengguna yang terhubung dengan masjid ini.</p>
                    
                    <div class="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
                        <div class="p-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 relative">
                            <Search class="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                            <input 
                                type="text"
                                v-model="searchUser"
                                placeholder="Cari nama pengguna..."
                                class="w-full pl-8 pr-3 py-1.5 text-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-900 dark:text-zinc-100"
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
                                    class="size-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                />
                                <span class="text-sm font-medium text-zinc-700 dark:text-zinc-200">{{ user.name }}</span>
                            </label>
                            
                            <div v-if="filteredUsers.length === 0" class="p-6 text-center text-sm text-zinc-500 italic">
                                Pengguna tidak ditemukan.
                            </div>
                        </div>
                    </div>
                    <div v-if="form.errors.users" class="text-red-500 text-xs mt-1">{{ form.errors.users }}</div>
                </div>

                </div>

                <div class="space-y-2 mt-7">
                    <Label>Deskripsi Masjid</Label>
                    <TiptapEditor v-model="form.deskripsi" />
                    <div v-if="form.errors.deskripsi" class="text-red-500 text-xs mt-1">{{ form.errors.deskripsi }}</div>
                </div>

                <div class="flex justify-end pt-4 gap-3">
                    <Link href="/admin/masjid" class="px-6 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-bold hover:bg-zinc-50 transition-colors dark:text-zinc-300">
                        Batal
                    </Link>
                    <Button 
                        type="submit" 
                        class="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-11 rounded-xl font-bold gap-2"
                        :disabled="form.processing"
                    >
                        <Save class="size-4" />
                        {{ form.processing ? 'Menyimpan...' : 'Simpan' }}
                    </Button>
                </div>
            </form>
        
    </div>

    <Dialog v-model:open="showDeleteDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Masjid?</DialogTitle>
          <DialogDescription>
            Masjid bernama "<strong>{{ props.masjid.nama }}</strong>" akan dimasukkan ke tempat sampah (Soft Delete). Anda masih dapat memulihkannya nanti jika diperlukan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="flex gap-2 justify-end">
          <Button variant="outline" class="rounded-xl" @click="showDeleteDialog = false">Batal</Button>
          <Button variant="destructive" class="rounded-xl" :disabled="form.processing" @click="deleteMasjid">
               {{ form.processing ? 'Menghapus...' : 'Ya, Hapus Data' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
</template>