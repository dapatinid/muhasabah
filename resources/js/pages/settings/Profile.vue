<script setup lang="ts">
import { Form, Head, Link, usePage } from '@inertiajs/vue3';
import { computed, ref, watch, onMounted } from 'vue';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import Heading from '@/components/Heading.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import SearchableSelect from '@/components/SearchableSelect.vue';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import { Camera, User as UserIcon } from 'lucide-vue-next';

type Props = {
    mustVerifyEmail: boolean;
    status?: string;
    provinces?: any[]; 
};

const props = defineProps<Props>();

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Pengaturan Profil',
                href: edit(),
            },
        ],
    },
});

const page = usePage();
const user = computed(() => page.props.auth?.user || {} as any);
const gender = ref(user.value?.gender || null);

// Ambil referensi form instance dari controller wrapper agar kita bisa memanipulasi datanya
const profileForm = ProfileController.update.form();

// ============================================
// STATE MEDIA (AVATAR & SAMPUL)
// ============================================
const avatarPreview = ref(user.value?.avatar ? `/storage/${user.value.avatar}` : null);
const sampulPreview = ref(user.value?.sampul ? `/storage/${user.value.sampul}` : null);

function handleAvatarChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
        avatarPreview.value = URL.createObjectURL(file);
        // 🌟 MASUKKAN FILE KE DATA FORM INERTIA
        if (profileForm.data) {
            profileForm.data.avatar = file;
        }
    }
}

function handleSampulChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
        sampulPreview.value = URL.createObjectURL(file);
        // 🌟 MASUKKAN FILE KE DATA FORM INERTIA
        if (profileForm.data) {
            profileForm.data.sampul = file;
        }
    }
}

// Sinkronisasi data gender manual ke form inertia setiap kali berubah
watch(gender, (newGender) => {
    if (profileForm.data) {
        profileForm.data.gender = newGender;
    }
});

// ============================================
// STATE WILAYAH (DOMISILI)
// ============================================
const province_code = ref(user.value?.province_code || null);
const city_code = ref(user.value?.city_code || null);
const district_code = ref(user.value?.district_code || null);
const village_code = ref(user.value?.village_code || null);

const provincesList = ref<any[]>(props.provinces || []);
const citiesList = ref<any[]>([]);
const districtsList = ref<any[]>([]);
const villagesList = ref<any[]>([]);

const fetchWilayahData = async (url: string) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Gagal mengambil data wilayah:', error);
        return [];
    }
};

onMounted(async () => {
    if (!provincesList.value.length) {
        provincesList.value = await fetchWilayahData('/api/wilayah/provinces');
    }
    
    if (province_code.value) citiesList.value = await fetchWilayahData(`/api/wilayah/cities/${province_code.value}`);
    if (city_code.value) districtsList.value = await fetchWilayahData(`/api/wilayah/districts/${city_code.value}`);
    if (district_code.value) villagesList.value = await fetchWilayahData(`/api/wilayah/villages/${district_code.value}`);
    
    // Set awal gender ke data form jika ada
    if (profileForm.data && gender.value) {
        profileForm.data.gender = gender.value;
    }
});

watch(province_code, async (newVal, oldVal) => {
    if (oldVal === undefined || newVal === oldVal) return;
    city_code.value = null; district_code.value = null; village_code.value = null;
    citiesList.value = []; districtsList.value = []; villagesList.value = [];
    if (profileForm.data) {
        profileForm.data.province_code = newVal;
        profileForm.data.city_code = null;
        profileForm.data.district_code = null;
        profileForm.data.village_code = null;
    }
    if (newVal) citiesList.value = await fetchWilayahData(`/api/wilayah/cities/${newVal}`);
});

watch(city_code, async (newVal, oldVal) => {
    if (oldVal === undefined || newVal === oldVal) return;
    district_code.value = null; village_code.value = null;
    districtsList.value = []; villagesList.value = [];
    if (profileForm.data) {
        profileForm.data.city_code = newVal;
        profileForm.data.district_code = null;
        profileForm.data.village_code = null;
    }
    if (newVal) districtsList.value = await fetchWilayahData(`/api/wilayah/districts/${newVal}`);
});

watch(district_code, async (newVal, oldVal) => {
    if (oldVal === undefined || newVal === oldVal) return;
    village_code.value = null; villagesList.value = [];
    if (profileForm.data) {
        profileForm.data.district_code = newVal;
        profileForm.data.village_code = null;
    }
    if (newVal) villagesList.value = await fetchWilayahData(`/api/wilayah/villages/${newVal}`);
});

watch(village_code, (newVal) => {
    if (profileForm.data) profileForm.data.village_code = newVal;
});
</script>

<template>
    <Head title="Pengaturan Profil" />

    <h1 class="sr-only">Profile settings</h1>

    <div class="flex flex-col space-y-8">
        
        <Form
            v-bind="profileForm"
            class="space-y-8"
            v-slot="{ errors, processing, recentlySuccessful }"
        >

            <div class="space-y-4">
                <Heading
                    variant="small"
                    title="Tampilan Profil"
                    description="Kustomisasi foto profil dan sampul jejaring Anda."
                />
                
                <div class="relative mb-6">
                    <div class="h-44 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative border border-zinc-200 dark:border-zinc-800">
                        <img v-if="sampulPreview" :src="sampulPreview" class="w-full h-full object-cover" alt="Sampul Profil" />
                        <div v-else class="w-full h-full bg-linear-to-r from-zinc-200 to-stone-200 dark:from-zinc-850 dark:to-stone-900 flex items-center justify-center text-zinc-400 text-xs">
                            Belum ada foto sampul
                        </div>
                        
                        <label class="absolute bottom-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-xl cursor-pointer backdrop-blur-sm transition-all shadow-sm">
                            <Camera class="size-4" />
                            <input type="file" name="sampul" class="hidden" accept="image/*" @change="handleSampulChange" />
                        </label>
                    </div>

                    <div class="px-6 flex flex-col md:flex-row md:items-end gap-4 -mt-14 relative z-10 pointer-events-none">
                        <div class="relative size-28 rounded-full border-4 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-800 shadow-lg overflow-hidden shrink-0 group pointer-events-auto">
                            <img v-if="avatarPreview" :src="avatarPreview" class="w-full h-full object-cover" alt="Avatar" />
                            <div v-else class="w-full h-full flex items-center justify-center text-zinc-400">
                                <UserIcon class="size-8" />
                            </div>

                            <label class="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200 backdrop-blur-[1px]">
                                <Camera class="size-5" />
                                <input type="file" name="avatar" class="hidden" accept="image/*" @change="handleAvatarChange" />
                            </label>
                        </div>

                        <div class="mb-1 text-center md:text-left">
                            <div class="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                <h2 class="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                                    {{ user?.name || 'Nama Pengguna' }}
                                </h2>
                                <span v-if="user?.class" class="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold rounded-md">
                                    {{ user.class }}
                                </span>
                            </div>
                            <p class="text-sm font-medium text-zinc-400 dark:text-zinc-500 mt-0.5 font-mono">
                                @{{ user?.slug || 'username' }}
                            </p>
                        </div>
                    </div>
                    <InputError class="mt-2" :message="errors.avatar" />
                    <InputError class="mt-2" :message="errors.sampul" />
                </div>                
            </div>

            <div class="space-y-4">
                <Heading
                    variant="small"
                    title="Informasi Pribadi"
                    description="Perbarui informasi kontak dan alamat email Anda."
                />

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div class="grid gap-2">
                        <Label for="name">Nama Lengkap</Label>
                        <Input
                            id="name"
                            class="mt-1 block w-full"
                            name="name"
                            :default-value="user?.name"
                            required
                            autocomplete="name"
                            placeholder="Nama Lengkap"
                        />
                        <InputError class="mt-1" :message="errors.name" />
                    </div>

                    <div class="space-y-1">
                        <Label for="slug">Username / Slug Profil</Label>
                        <div class="relative flex items-center">
                            <span class="absolute left-3 text-zinc-400 text-sm font-mono select-none">@</span>
                            <Input
                                id="slug"
                                name="slug"
                                :default-value="user?.slug"
                                required
                                placeholder="username_kamu"
                                class="pl-7 font-mono text-sm lowercase"
                                @input="(e) => e.target.value = (e.target as HTMLInputElement).value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, '')"
                            />
                        </div>
                        <p class="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                            Username unik untuk link profil Anda. Hanya boleh berisi huruf kecil, angka, tanda strip (-) dan (*underscore*).
                        </p>
                        <InputError :message="errors.slug" />
                    </div>

                    <div class="space-y-2 md:col-span-2">
                        <Label>Jenis Kelamin</Label>
                        <input type="hidden" name="gender" :value="gender || ''" />
                        <div class="grid grid-cols-2 gap-3 md:max-w-md">
                            <label
                                :class="[
                                    'flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors',
                                    gender === 'L'
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                                ]"
                            >
                                <input type="radio" value="L" v-model="gender" class="hidden" />
                                Laki-laki
                            </label>
                            <label
                                :class="[
                                    'flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors',
                                    gender === 'P'
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                                ]"
                            >
                                <input type="radio" value="P" v-model="gender" class="hidden" />
                                Perempuan
                            </label>
                        </div>
                        <InputError class="mt-1" :message="errors.gender" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="email">Alamat Email</Label>
                        <Input
                            id="email"
                            type="email"
                            class="mt-1 block w-full"
                            name="email"
                            :default-value="user?.email"
                            required
                            autocomplete="username"
                            placeholder="Alamat email aktif"
                        />
                        <InputError class="mt-1" :message="errors.email" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="whatsapp">No. WhatsApp</Label>
                        <Input
                            id="whatsapp"
                            class="mt-1 block w-full"
                            name="whatsapp"
                            :default-value="user?.whatsapp"
                            autocomplete="tel"
                            placeholder="Contoh: 085950540055"
                        />
                        <InputError class="mt-1" :message="errors.whatsapp" />
                    </div>

                </div>
            </div>

            <div v-if="mustVerifyEmail && !user?.email_verified_at">
                <p class="-mt-2 text-sm text-muted-foreground">
                    Alamat email Anda belum diverifikasi.
                    <Link
                        :href="send()"
                        as="button"
                        class="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                    >
                        Klik di sini untuk mengirim ulang tautan verifikasi.
                    </Link>
                </p>

                <div
                    v-if="status === 'verification-link-sent'"
                    class="mt-2 text-sm font-medium text-green-600"
                >
                    Tautan verifikasi baru telah dikirim ke alamat email Anda.
                </div>
            </div>

            <div class="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <Heading
                    variant="small"
                    title="Informasi Alamat"
                    description="Lengkapi domisili untuk keperluan jejaring ukhuwah dan pendataan."
                />

                <Card class="border border-zinc-200 dark:border-zinc-800 shadow-sm bg-transparent">
                    <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                        
                        <div class="space-y-1">
                            <SearchableSelect
                                :modelValue="province_code"
                                :items="provincesList"
                                valueKey="code"
                                labelKey="name"
                                label="Pilih Provinsi..."
                                @update:modelValue="province_code = $event"
                            />
                            <input type="hidden" name="province_code" :value="province_code || ''" />
                            <InputError class="mt-1" :message="errors.province_code" />
                        </div>

                        <div class="space-y-1">
                            <SearchableSelect
                                :modelValue="city_code"
                                :items="citiesList"
                                valueKey="code"
                                labelKey="name"
                                label="Pilih Kota..."
                                :disabled="!province_code"
                                @update:modelValue="city_code = $event"
                            />
                            <input type="hidden" name="city_code" :value="city_code || ''" />
                            <InputError class="mt-1" :message="errors.city_code" />
                        </div>

                        <div class="space-y-1">
                            <SearchableSelect
                                :modelValue="district_code"
                                :items="districtsList"
                                valueKey="code"
                                labelKey="name"
                                label="Pilih Kecamatan..."
                                :disabled="!city_code"
                                @update:modelValue="district_code = $event"
                            />
                            <input type="hidden" name="district_code" :value="district_code || ''" />
                            <InputError class="mt-1" :message="errors.district_code" />
                        </div>

                        <div class="space-y-1">
                            <SearchableSelect
                                :modelValue="village_code"
                                :items="villagesList"
                                valueKey="code"
                                labelKey="name"
                                label="Pilih Desa..."
                                :disabled="!district_code"
                                @update:modelValue="village_code = $event"
                            />
                            <input type="hidden" name="village_code" :value="village_code || ''" />
                            <InputError class="mt-1" :message="errors.village_code" />
                        </div>

                        <div class="space-y-2 md:col-span-2">
                            <Label for="jalan">Detail Alamat</Label>
                            <textarea
                                id="jalan"
                                name="jalan"
                                :value="user?.jalan"
                                rows="3"
                                class="flex w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                                placeholder="Detail Alamat: Jalan, Gang, RT/RW, Dusun, dll."
                            ></textarea>
                            <InputError class="mt-1" :message="errors.jalan" />
                        </div>

                        <div class="space-y-2 md:col-span-2">
                            <Label for="kode_pos">Kode Pos</Label>
                            <Input
                                id="kode_pos"
                                name="kode_pos"
                                :default-value="user?.kode_pos"
                                class="mt-1 block w-full md:max-w-[200px]"
                                placeholder="Opsional"
                            />
                            <InputError class="mt-1" :message="errors.kode_pos" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div class="flex items-center gap-4 pt-4">
                <Button 
                    :disabled="processing" 
                    data-test="update-profile-button"
                    class="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/20 px-8"
                >
                    Simpan Perubahan
                </Button>

                <Transition
                    enter-active-class="transition ease-in-out"
                    enter-from-class="opacity-0"
                    leave-active-class="transition ease-in-out"
                    leave-to-class="opacity-0"
                >
                    <p
                        v-show="recentlySuccessful"
                        class="text-sm font-medium text-emerald-600 dark:text-emerald-400"
                    >
                        Tersimpan.
                    </p>
                </Transition>
            </div>
        </Form>
    </div>
</template>