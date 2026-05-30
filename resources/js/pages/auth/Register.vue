<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { Form } from '@inertiajs/vue3'; // Sesuai dengan import asli Anda
import { computed, ref } from 'vue';

import InputError from '@/components/InputError.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import TextLink from '@/components/TextLink.vue';
import SearchableSelect from '@/components/SearchableSelect.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

defineOptions({
    layout: {
        title: 'Buat Akun Baru',
        description: 'Setelah menekan tombol "Buat Akun", kamu harus hubungi 085950540055 untuk aktivasi akun',
    },
});

const props = defineProps<{
    provinces: any[];
    cities?: any[];
    districts?: any[];
    villages?: any[];
}>();

// Gunakan local state khusus untuk mengendalikan dropdown wilayah
const wilayahState = ref({
    province_code: '',
    city_code: '',
    district_code: '',
    village_code: '',
});

// Computed Sorting Kabupaten/Kota
const sortedCities = computed(() => {
    if (!props.cities) return [];
    
    return [...props.cities].sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        
        const isKotaA = nameA.startsWith('KOTA');
        const isKotaB = nameB.startsWith('KOTA');
        
        if (isKotaA && !isKotaB) return -1;
        if (!isKotaA && isKotaB) return 1;
        
        return nameA.localeCompare(nameB);
    });
});

// Fungsi untuk membersihkan wilayah di bawahnya
const clearFrom = (level: 'province' | 'city' | 'district') => {
    if (level === 'province') {
        wilayahState.value.city_code = '';
        wilayahState.value.district_code = '';
        wilayahState.value.village_code = '';
    }
    if (level === 'city') {
        wilayahState.value.district_code = '';
        wilayahState.value.village_code = '';
    }
    if (level === 'district') {
        wilayahState.value.village_code = '';
    }
};

const handleProvinceChange = (val: string | null) => {
    wilayahState.value.province_code = val || '';
    clearFrom('province');
    
    if (val) {
        router.reload({
            data: { province_code: val },
            only: ['cities'],
            preserveState: true,
            preserveScroll: true,
        });
    }
};

const handleCityChange = (val: string | null) => {
    wilayahState.value.city_code = val || '';
    clearFrom('city');
    
    if (val) {
        router.reload({
            data: { province_code: wilayahState.value.province_code, city_code: val },
            only: ['districts'],
            preserveState: true,
            preserveScroll: true,
        });
    }
};

const handleDistrictChange = (val: string | null) => {
    wilayahState.value.district_code = val || '';
    clearFrom('district');
    
    if (val) {
        router.reload({
            data: { 
                province_code: wilayahState.value.province_code,
                city_code: wilayahState.value.city_code,
                district_code: val 
            },
            only: ['villages'],
            preserveState: true,
            preserveScroll: true,
        });
    }
};

const handleVillageChange = (val: string | null) => {
    wilayahState.value.village_code = val || '';
};


</script>

<template>
    <Head title="Register" />

    <Form
        v-bind="store.form()"
        :reset-on-success="['password', 'password_confirmation']"
        v-slot="{ errors, processing }"
        class="flex flex-col gap-6"
    >
        <div class="grid gap-6">
            <div class="grid gap-2">
                <Label for="name">Nama Lengkap</Label>
                <Input id="name" type="text" required autofocus :tabindex="1" autocomplete="name" name="name" placeholder="Nama Lengkap" />
                <InputError :message="errors.name" />
            </div>

            <div class="grid gap-2">
                <Label for="email">Email</Label>
                <Input id="email" type="email" required :tabindex="2" autocomplete="email" name="email" placeholder="email@example.com" />
                <InputError :message="errors.email" />
            </div>

            <div class="grid gap-2">
                <Label for="whatsapp">Nomor Whatsapp</Label>
                <Input id="whatsapp" type="text" required :tabindex="3" name="whatsapp" placeholder="081234567890" />
                <InputError :message="errors.whatsapp" />
            </div>

            <div class="grid gap-2">
                <Label for="negara">Negara</Label>
                
                <Input 
                    id="negara" 
                    type="text" 
                    :model-value="'INDONESIA'" 
                    readonly 
                    :tabindex="4" 
                    class="bg-zinc-100 dark:bg-zinc-900 text-zinc-500 cursor-not-allowed focus-visible:ring-0" 
                />
                
                <input type="hidden" name="negara" value="INDONESIA" />
                
                <InputError :message="errors.negara" />
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-2">
                    <Label>Provinsi</Label>
                    <SearchableSelect 
                        :modelValue="wilayahState.province_code || null" 
                        :items="provinces"
                        valueKey="code"
                        labelKey="name"
                        label="Cari Provinsi..."
                        @update:modelValue="handleProvinceChange"
                        class="text-sm"
                    />
                    <input type="hidden" name="province_code" :value="wilayahState.province_code" />
                    <InputError :message="errors.province_code" />
                </div>
                
                <div class="grid gap-2 transition-opacity duration-200" :class="{ 'opacity-50 pointer-events-none': !sortedCities.length }">
                    <Label>Kabupaten/Kota</Label>
                    <SearchableSelect 
                        :modelValue="wilayahState.city_code"
                        :items="sortedCities"
                        valueKey="code"
                        labelKey="name"
                        label="Cari Kab/Kota..."
                        @update:modelValue="handleCityChange"
                        class="text-sm"
                    />
                    <input type="hidden" name="city_code" :value="wilayahState.city_code" />
                    <InputError :message="errors.city_code" />
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-2 transition-opacity duration-200" :class="{ 'opacity-50 pointer-events-none': !districts?.length }">
                    <Label>Kecamatan</Label>
                    <SearchableSelect 
                        :modelValue="wilayahState.district_code"
                        :items="districts || []"
                        valueKey="code"
                        labelKey="name"
                        label="Cari Kecamatan..."
                        @update:modelValue="handleDistrictChange"
                        class="text-sm"
                    />
                    <input type="hidden" name="district_code" :value="wilayahState.district_code" />
                    <InputError :message="errors.district_code" />
                </div>
                
                <div class="grid gap-2 transition-opacity duration-200" :class="{ 'opacity-50 pointer-events-none': !villages?.length }">
                    <Label>Desa/Kelurahan</Label>
                    <SearchableSelect 
                        :modelValue="wilayahState.village_code || null" 
                        :items="villages || []"
                        valueKey="code"
                        labelKey="name"
                        label="Cari Desa..."
                        @update:modelValue="handleVillageChange"
                        class="text-sm"
                    />
                    <input type="hidden" name="village_code" :value="wilayahState.village_code" />
                    <InputError :message="errors.village_code" />
                </div>
            </div>

            <div class="grid gap-2">
                <Label for="kode_pos">Kode Pos</Label>
                <Input id="kode_pos" type="text" required :tabindex="9" name="kode_pos" placeholder="12345" />
                <InputError :message="errors.kode_pos" />
            </div>

            <div class="grid gap-2">
                <Label for="jalan">Jalan / Alamat Lengkap</Label>
                <textarea 
                    id="jalan" 
                    required 
                    :tabindex="10" 
                    name="jalan" 
                    class="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Jl. Merdeka No. 1, RT 01 / RW 02"
                ></textarea>
                <InputError :message="errors.jalan" />
            </div>

            <div class="grid gap-2">
                <Label for="password">Password</Label>
                <PasswordInput id="password" required :tabindex="11" autocomplete="new-password" name="password" placeholder="Password" />
                <InputError :message="errors.password" />
            </div>

            <div class="grid gap-2">
                <Label for="password_confirmation">Konfirmasi Password</Label>
                <PasswordInput id="password_confirmation" required :tabindex="12" autocomplete="new-password" name="password_confirmation" placeholder="Confirm password" />
                <InputError :message="errors.password_confirmation" />
            </div>

            <Button type="submit" class="mt-2 w-full" :tabindex="13" :disabled="processing" data-test="register-user-button">
                <Spinner v-if="processing" />
                Buat Akun
            </Button>
        </div>

        <div class="text-center text-sm text-muted-foreground">
            Jika sudah punya akun
            <TextLink :href="login()" class="underline underline-offset-4 ms-2" :tabindex="14">Masuk di sini</TextLink>
        </div>
    </Form>
</template>