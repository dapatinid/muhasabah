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
import { Camera, User as UserIcon } from 'lucide-vue-next'; // 🌟 Import Icon Baru

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

// ============================================
// STATE MEDIA (AVATAR & SAMPUL)
// ============================================
const avatarPreview = ref(user.value?.avatar ? `/storage/${user.value.avatar}` : null);
const sampulPreview = ref(user.value?.sampul ? `/storage/${user.value.sampul}` : null);

function handleAvatarChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) avatarPreview.value = URL.createObjectURL(file);
}

function handleSampulChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) sampulPreview.value = URL.createObjectURL(file);
}

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
});

watch(province_code, async (newVal, oldVal) => {
    if (oldVal === undefined || newVal === oldVal) return;
    city_code.value = null; district_code.value = null; village_code.value = null;
    citiesList.value = []; districtsList.value = []; villagesList.value = [];
    if (newVal) citiesList.value = await fetchWilayahData(`/api/wilayah/cities/${newVal}`);
});

watch(city_code, async (newVal, oldVal) => {
    if (oldVal === undefined || newVal === oldVal) return;
    district_code.value = null; village_code.value = null;
    districtsList.value = []; villagesList.value = [];
    if (newVal) districtsList.value = await fetchWilayahData(`/api/wilayah/districts/${newVal}`);
});

watch(district_code, async (newVal, oldVal) => {
    if (oldVal === undefined || newVal === oldVal) return;
    village_code.value = null; villagesList.value = [];
    if (newVal) villagesList.value = await fetchWilayahData(`/api/wilayah/villages/${newVal}`);
});
</script>

<template>
    <Head title="Pengaturan Profil" />

    <h1 class="sr-only">Profile settings</h1>

    <div class="flex flex-col space-y-8">
        
        <Form
            v-bind="ProfileController.update.form()"
            class="space-y-8"
            v-slot="{ errors, processing, recentlySuccessful }"
        >

            <div class="space-y-4">
                <Heading
                    variant="small"
                    title="Tampilan Profil"
                    description="Kustomisasi foto profil dan sampul jejaring Anda."
                />
                
                <Card class="border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden bg-white dark:bg-zinc-950">
                    <div class="relative h-32 sm:h-48 bg-zinc-100 dark:bg-zinc-800 group/sampul flex items-center justify-center">
                        <img v-if="sampulPreview" :src="sampulPreview" class="absolute inset-0 w-full h-full object-cover" />
                        
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/sampul:opacity-100 transition-opacity flex items-center justify-center">
                            <Label for="sampul" class="cursor-pointer flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/70 text-white rounded-full text-sm font-medium backdrop-blur-sm transition-colors">
                                <Camera class="size-4" /> Ubah Sampul
                            </Label>
                            <input type="file" id="sampul" name="sampul" accept="image/*" class="hidden" @change="handleSampulChange" />
                        </div>
                    </div>

                    <div class="relative px-6 pb-6">
                        <div class="relative -mt-12 sm:-mt-16 size-24 sm:size-32 rounded-full border-4 border-white dark:border-zinc-950 bg-zinc-50 dark:bg-zinc-900 overflow-hidden shadow-md group/avatar">
                            
                            <img v-if="avatarPreview" :src="avatarPreview" class="w-full h-full object-cover" />
                            <div v-else class="w-full h-full flex items-center justify-center text-zinc-300 dark:text-zinc-700">
                                <UserIcon class="size-12 sm:size-16" />
                            </div>

                            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                                <Label for="avatar" class="cursor-pointer flex flex-col items-center justify-center w-full h-full text-white text-xs font-medium">
                                    <Camera class="size-6 mb-1" />
                                </Label>
                                <input type="file" id="avatar" name="avatar" accept="image/*" class="hidden" @change="handleAvatarChange" />
                            </div>
                        </div>

                        <InputError class="mt-2" :message="errors.avatar" />
                        <InputError class="mt-1" :message="errors.sampul" />
                    </div>
                </Card>
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

                    <div class="grid gap-2 md:col-span-2">
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