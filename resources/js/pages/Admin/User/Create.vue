<script setup lang="ts">
import { Head, router, usePage, useForm } from '@inertiajs/vue3'
import { ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import SearchableSelect from '@/components/SearchableSelect.vue'
import { Plus } from 'lucide-vue-next'

const props = defineProps<{
  provinces: Array<any>;
  cities?: Array<any>;
  districts?: Array<any>;
  villages?: Array<any>;
    breadcrumbs: any;
}>()

// ================= FORM DATA =================
const form = useForm({
  name: '',
  slug: '',
  email: '',
  whatsapp: '', 
  gender: 'L', // Menggunakan kode L/P agar sesuai skema DB
  password: '',
  is_active: true,
  is_admin: false,
  level: '',
  class: '',
  negara: 'Indonesia',
  province_code: null,
  city_code: null,
  district_code: null,
  village_code: null,
  kode_pos: '', 
  jalan: '', 
  avatar: null as File | null,
  sampul: null as File | null, 
});

// ================= PREVIEW MEDIA =================
const avatarLocalPreview = ref<string | null>(null);
const sampulLocalPreview = ref<string | null>(null);

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

// ================= CASCADING WATCHERS (ALAMAT VIA ROUTER) =================
watch(() => form.province_code, (newVal, oldVal) => {
  if (newVal === oldVal) return;
  
  form.city_code = null;
  form.district_code = null;
  form.village_code = null;

  if (newVal) {
    router.get('/admin/pengguna/create', { province_code: newVal }, {
      preserveState: true,
      preserveScroll: true,
      only: ['cities']
    });
  }
});

watch(() => form.city_code, (newVal, oldVal) => {
  if (newVal === oldVal) return;

  form.district_code = null;
  form.village_code = null;

  if (newVal) {
    router.get('/admin/pengguna/create', { city_code: newVal }, {
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
    router.get('/admin/pengguna/create', { district_code: newVal }, {
      preserveState: true,
      preserveScroll: true,
      only: ['villages']
    });
  }
});

watch(() => form.is_admin, (isAdmin) => {
  if (!isAdmin) {
    form.level = ''; 
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
  form.post('/admin/pengguna', {
    preserveScroll: true,
    preserveState: true,
    onSuccess: () => {
      if (avatarLocalPreview.value) URL.revokeObjectURL(avatarLocalPreview.value);
      if (sampulLocalPreview.value) URL.revokeObjectURL(sampulLocalPreview.value);
    },
    onError: (errors) => {
        console.error(errors);
        toast.error("Gagal menambahkan pengguna, periksa kembali formulir Anda.");
    }
  });
}

// ================= TAG INPUT (KELAS) =================
const userEndClassInput = ref('')
const userEndClassTags = ref<string[]>([])

function addUserEndClassTag() {
  const value = userEndClassInput.value
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')        
      .replace(/[^a-z0-9\-]/g, '') 
      .replace(/\-+/g, '-');       
  if (!value) return
  if (!userEndClassTags.value.includes(value)) {
    userEndClassTags.value.push(value)
  }
  userEndClassInput.value = ''
  form.class = userEndClassTags.value.join(',')
}

function removeUserEndClassTag(tag: string) {
  userEndClassTags.value = userEndClassTags.value.filter(t => t !== tag)
  form.class = userEndClassTags.value.join(',')
}

// Global flash messaging bridge
const page = usePage();
watch(() => page.props.flash, (flash: any) => {
  if (flash?.success) toast.success(flash.success);
  if (flash?.error) toast.error(flash.error);
}, { deep: true, immediate: true });
</script>

<template>
  <Head title="Tambah Pengguna"/>
    <div class="p-6 space-y-6 max-w-6xl mx-auto">

      <Card>
        <CardHeader><CardTitle>Media</CardTitle></CardHeader>
        <CardContent class="grid md:grid-cols-2 gap-6">
          <div class="flex flex-col items-center gap-3">
            <Label class="mb-2">Avatar</Label>
            <div class="w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden bg-muted">
              <img v-if="avatarLocalPreview" :src="avatarLocalPreview" class="w-full h-full object-cover"/>
              <span v-else class="text-xs text-muted-foreground">No Image</span>
            </div>
            <Input type="file" accept="image/*" class="w-40" @change="onAvatarChange"/>
          </div>

          <div class="flex flex-col gap-3">
            <Label class="mb-2">Sampul</Label>
            <div class="w-full h-40 border-2 border-dashed rounded-md flex items-center justify-center overflow-hidden bg-muted">
              <img v-if="sampulLocalPreview" :src="sampulLocalPreview" class="w-full h-full object-cover"/>
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
          <div class="space-y-2"><Label>Password</Label><Input type="password" v-model="form.password"/></div>
          
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
            <textarea v-model="form.jalan" rows="3" class="w-full flex min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"/>
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
            <button type="button" class="flex-1 py-1.5 rounded text-sm font-medium transition" :class="form.is_active === false ? 'bg-white shadow text-red-600' : 'text-gray-500'" @click="form.is_active = false">Tidak Aktif</button>
            <button type="button" class="flex-1 py-1.5 rounded text-sm font-medium transition" :class="form.is_active === true ? 'bg-green-500 text-white shadow' : 'text-gray-500'" @click="form.is_active = true">Aktif</button>
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
          </div>

          <div class="space-y-2">
            <Label>Level</Label>
            <select v-model="form.level" :disabled="!form.is_admin" class="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:bg-gray-100">
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
              <button type="button" class="flex-1 py-1.5 rounded text-sm font-medium transition" :class="form.is_admin === false ? 'bg-white shadow' : 'text-gray-500'" @click="form.is_admin = false">Non Admin</button>
              <button type="button" class="flex-1 py-1.5 rounded text-sm font-medium transition" :class="form.is_admin === true ? 'bg-blue-600 text-white shadow' : 'text-gray-500'" @click="form.is_admin = true">Admin</button>
            </div>
          </div>

        </CardContent>
      </Card>

      <div class="flex justify-end">
        <Button class="w-full md:w-auto" type="button" @click="submit">Simpan</Button>
      </div>

    </div>
</template>