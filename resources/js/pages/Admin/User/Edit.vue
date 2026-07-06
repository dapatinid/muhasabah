<script setup lang="ts">
import { Head, router, usePage } from '@inertiajs/vue3';
import { useForm } from '@inertiajs/vue3';
import { ref, watch } from 'vue';
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import SearchableSelect from '@/components/SearchableSelect.vue';
import { Plus } from 'lucide-vue-next';

const props = defineProps<{
  user: any;
  provinces: Array<any>;
  cities?: Array<any>;
  districts?: Array<any>;
  villages?: Array<any>;
    breadcrumbs: any;
}>();

// ================= FORM DATA =================
const form = useForm({
  name: props.user.name ?? '',
  slug: props.user.slug ?? '',
  email: props.user.email ?? '',
  whatsapp: props.user.whatsapp ?? '', 
  gender: props.user.gender ?? 'L', // Diset L/P menyesuaikan DB
  password: '', 
  is_active: Boolean(props.user.is_active ?? true), // STRICT BOOLEAN
  is_admin: Boolean(props.user.is_admin ?? false),  // STRICT BOOLEAN
  level: props.user.level ?? '',
  class: props.user.class ?? '',
  negara: props.user.negara ?? 'Indonesia',
  province_code: props.user.province_code ?? null,
  city_code: props.user.city_code ?? null,
  district_code: props.user.district_code ?? null,
  village_code: props.user.village_code ?? null,
  kode_pos: props.user.kode_pos ?? '', 
  jalan: props.user.jalan ?? '', 
  avatar: null as File | null,
  sampul: null as File | null,
  _method: 'PUT'
});

// ================= REAL-TIME LOCAL PREVIEW =================
const avatarLocalPreview = ref<string | null>(null);
const sampulLocalPreview = ref<string | null>(null);

function getImageUrl(path: string | null) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    if (!path.includes('/storage/')) {
      const url = new URL(path);
      return `${url.origin}/storage${url.pathname}`;
    }
    return path;
  }
  if (path.startsWith('storage/')) return '/' + path;
  if (path.startsWith('/storage/')) return path;
  return '/storage/' + path;
}

function onAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] ?? null;
  if (!file) return;
  form.avatar = file;
  avatarLocalPreview.value = URL.createObjectURL(file);
}

function onSampulChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] ?? null;
  if (!file) return;
  form.sampul = file;
  sampulLocalPreview.value = URL.createObjectURL(file);
}

// ================= CASCADING WATCHERS (ALAMAT Inertia Partial Reload) =================
// Kita pakai router.get yang memanggil path UI saat ini
watch(() => form.province_code, (newVal, oldVal) => {
  if (newVal === oldVal) return;
  
  form.city_code = null;
  form.district_code = null;
  form.village_code = null;

  if (newVal) {
    router.get(`/admin/pengguna/${props.user.id}/edit`, { province_code: newVal }, {
      preserveState: true,
      preserveScroll: true,
      only: ['cities'] // Hanya me-reload daftar cities (partial)
    });
  }
});

watch(() => form.city_code, (newVal, oldVal) => {
  if (newVal === oldVal) return;

  form.district_code = null;
  form.village_code = null;

  if (newVal) {
    router.get(`/admin/pengguna/${props.user.id}/edit`, { city_code: newVal }, {
      preserveState: true,
      preserveScroll: true,
      only: ['districts']
    });
  }
});

watch(() => form.district_code, (newVal, oldVal) => {
  if (newVal === oldVal) return;

  form.village_code = null;

  if (newVal) {
    router.get(`/admin/pengguna/${props.user.id}/edit`, { district_code: newVal }, {
      preserveState: true,
      preserveScroll: true,
      only: ['villages']
    });
  }
});

function generateSlugUsername() {
  if (!form.slug) return;
  form.slug = form.slug
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-+/g, '-');
}

// ================= SUBMIT =================
function submit() {
  // PENTING: Gunakan form.post(), bukan form.put()
  form.post(`/admin/pengguna/${props.user.id}`, {
    preserveScroll: true,
    preserveState: true,
    onSuccess: () => {
      if (avatarLocalPreview.value) URL.revokeObjectURL(avatarLocalPreview.value);
      if (sampulLocalPreview.value) URL.revokeObjectURL(sampulLocalPreview.value);
      avatarLocalPreview.value = null;
      sampulLocalPreview.value = null;
    },
    // Tambahkan block onError untuk menangkap kesalahan input (jika murni ada salah ketik/validasi)
    onError: (errors) => {
        console.error(errors);
        toast.error("Gagal menyimpan, periksa kembali isian form Anda.");
    }
  });
}

// ================= TAG INPUT (KELAS USER) =================
const userEndClassInput = ref('');
const userEndClassTags = ref<string[]>([]);

if (form.class) {
  userEndClassTags.value = form.class.split(',').map(s => s.trim()).filter(Boolean);
}

function addUserEndClassTag() {
  const value = userEndClassInput.value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-+/g, '-');
    
  if (!value) return;
  if (!userEndClassTags.value.includes(value)) {
    userEndClassTags.value.push(value);
  }
  userEndClassInput.value = '';
  form.class = userEndClassTags.value.join(','); // Tidak ada spasi
}

function removeUserEndClassTag(tag: string) {
  userEndClassTags.value = userEndClassTags.value.filter(t => t !== tag);
  form.class = userEndClassTags.value.join(','); // Tidak ada spasi
}

// Global flash messaging bridge
const page = usePage();
watch(() => page.props.flash, (flash: any) => {
  if (flash?.success) toast.success(flash.success);
  if (flash?.error) toast.error(flash.error);
}, { deep: true, immediate: true });
</script>

<template>
  <Head title="Edit Pengguna"/>
    <div class="p-6 space-y-6 max-w-6xl mx-auto">

      <Card>
        <CardHeader><CardTitle>Media</CardTitle></CardHeader>
        <CardContent class="grid md:grid-cols-2 gap-6">
          <div class="flex flex-col items-center gap-3">
            <Label class="mb-2">Avatar</Label>
            <div class="w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden bg-muted">
              <img v-if="avatarLocalPreview || user.avatar" :src="avatarLocalPreview || getImageUrl(user.avatar)" class="w-full h-full object-cover"/>
              <span v-else class="text-xs text-muted-foreground">No Image</span>
            </div>
            <Input type="file" accept="image/*" class="w-40" @change="onAvatarChange"/>
          </div>

          <div class="flex flex-col gap-3">
            <Label class="mb-2">Sampul</Label>
            <div class="w-full h-40 border-2 border-dashed rounded-md flex items-center justify-center overflow-hidden bg-muted">
              <img v-if="sampulLocalPreview || user.sampul" :src="sampulLocalPreview || getImageUrl(user.sampul)" class="w-full h-full object-cover"/>
              <span v-else class="text-xs text-muted-foreground">No Image</span>
            </div>
            <Input type="file" accept="image/*" @change="onSampulChange"/>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Info User</CardTitle></CardHeader>
        <CardContent class="grid md:grid-cols-2 gap-4">
          <div class="space-y-2"><Label>Nama</Label><Input v-model="form.name"/></div>
          <div class="space-y-2"><Label>Username / Slug</Label><Input v-model="form.slug" @blur="generateSlugUsername"/></div>
          <div class="space-y-2"><Label>Whatsapp</Label><Input v-model="form.whatsapp"/></div>
          <div class="space-y-2"><Label>Email</Label><Input v-model="form.email"/></div>
          <div class="space-y-2"><Label>Password (opsional)</Label><Input type="password" v-model="form.password" placeholder="Kosongkan jika tidak diubah"/></div>
          
          <div class="space-y-2">
            <Label class="block mb-1">Gender</Label>
            <div class="bg-gray-100 dark:bg-gray-950 p-2 rounded-lg flex gap-1 max-w-xs">
              <button type="button" class="flex-1 py-1.5 rounded text-sm font-medium transition" :class="form.gender === 'L' ? 'bg-blue-600 text-white shadow' : 'text-gray-500'" @click="form.gender = 'L'">Laki-laki</button>
              <button type="button" class="flex-1 py-1.5 rounded text-sm font-medium transition" :class="form.gender === 'P' ? 'bg-pink-600 text-white shadow' : 'text-gray-500'" @click="form.gender = 'P'">Perempuan</button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Alamat</CardTitle></CardHeader>
        <CardContent class="space-y-4">
          <div class="grid md:grid-cols-2 gap-4">
            
            <div class="space-y-2">
              <Label>Provinsi</Label>
              <SearchableSelect 
                v-model="form.province_code" 
                :items="provinces" 
                label="Provinsi" 
                value-key="code" 
                label-key="name"
              />
            </div>

            <div class="space-y-2">
              <Label>Kabupaten / Kota</Label>
              <SearchableSelect 
                v-model="form.city_code" 
                :items="cities || []" 
                label="Kabupaten / Kota" 
                value-key="code" 
                label-key="name"
                :disabled="!form.province_code"
              />
            </div>

            <div class="space-y-2">
              <Label>Kecamatan</Label>
              <SearchableSelect 
                v-model="form.district_code" 
                :items="districts || []" 
                label="Kecamatan" 
                value-key="code" 
                label-key="name"
                :disabled="!form.city_code"
              />
            </div>

            <div class="space-y-2">
              <Label>Desa</Label>
              <SearchableSelect 
                v-model="form.village_code" 
                :items="villages || []" 
                label="Desa" 
                value-key="code" 
                label-key="name"
                :disabled="!form.district_code"
              />
            </div>

          </div>

          <div class="space-y-2">
            <Label>Alamat Lengkap</Label>
            <textarea v-model="form.jalan" rows="3" class="w-full flex min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"/>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div class="space-y-2"><Label>Kode Pos</Label><Input v-model="form.kode_pos"/></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Status</CardTitle></CardHeader>
        <CardContent>
          <div class="bg-gray-100 dark:bg-gray-950 p-2 rounded-lg flex gap-1 max-w-xs">
            <button type="button" class="flex-1 py-1.5 rounded text-sm font-medium transition" :class="!form.is_active ? 'bg-white shadow text-red-600' : 'text-gray-500'" @click="form.is_active = false">Tidak Aktif</button>
            <button type="button" class="flex-1 py-1.5 rounded text-sm font-medium transition" :class="form.is_active ? 'bg-green-500 text-white shadow' : 'text-gray-500'" @click="form.is_active = true">Aktif</button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Permission & Kelas</CardTitle></CardHeader>
        <CardContent class="grid md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <Label>Kelas</Label>
            <div class="flex flex-wrap gap-2 mb-2">
              <span v-for="tag in userEndClassTags" :key="tag" class="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1 text-sm">
                {{ tag }}
                <button type="button" @click="removeUserEndClassTag(tag)" class="text-red-500 hover:text-red-700">✕</button>
              </span>
            </div>

            <div class="flex gap-2">
              <div class="relative flex-1">
                <Input v-model="userEndClassInput" placeholder="Ketik nama kelas..." @keyup.enter.prevent="addUserEndClassTag"/>
              </div>
              <Button type="button" variant="secondary" @click="addUserEndClassTag" class="shrink-0">
                <Plus class="size-4"/>
              </Button>
            </div>
            <p class="text-[10px] text-muted-foreground mt-1">*Gunakan tombol Tambah jika keyboard tidak muncul Enter</p>
          </div>

          <div class="space-y-2">
            <Label>Level</Label>
            <select v-model="form.level" class="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <option value="">- Pilih Level -</option>
              <option value="Founder">Founder</option>
              <option value="Penasehat">Penasehat</option>
              <option value="Pengawas">Pengawas</option>
              <option value="Ketua">Ketua</option>
              <option value="Suspend">Suspend</option>
              <option value="Banned">Banned</option>
            </select>
          </div>

          <div class="space-y-2">
            <Label class="block mb-1">Hak Akses Sistem</Label>
            <div class="bg-gray-100 dark:bg-gray-950 p-2 rounded-lg flex gap-1 max-w-xs">
              <button type="button" class="flex-1 py-1.5 rounded text-sm font-medium transition" :class="!form.is_admin ? 'bg-white shadow text-red-600' : 'text-gray-500'" @click="form.is_admin = false">Non Admin</button>
              <button type="button" class="flex-1 py-1.5 rounded text-sm font-medium transition" :class="form.is_admin ? 'bg-blue-600 text-white shadow' : 'text-gray-500'" @click="form.is_admin = true">Admin</button>
            </div>
          </div>

        </CardContent>
      </Card>

      <div class="flex justify-end">
        <Button class="w-full md:w-auto" type="button" @click="submit">Simpan Perubahan</Button>
      </div>

    </div>
</template>