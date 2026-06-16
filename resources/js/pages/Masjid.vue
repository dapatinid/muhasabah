<script setup lang="ts">
import { Head, Link, useForm, usePage } from '@inertiajs/vue3'
import { computed, ref } from 'vue'
import { MapPin, MoonStar, Star, Users, MessageSquare, ArrowRight, UserCircle2 } from 'lucide-vue-next'
import AppLayoutPublic from '@/layouts/AppLayoutPublic.vue'

// Import Dialog UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

const props = defineProps<{
  masjid: any;
}>()

const page = usePage()
const userLogin = computed(() => page.props.auth?.user)

function formatRating(num: any) { return num ? Number(num).toFixed(1) : '0.0' }

// Format Tanggal Ulasan
function formatTglUlasan(tgl: string): string {
  return new Date(tgl).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Modal State Control
const showAnggotaDialog = ref(false)
const showRatingDialog = ref(false)

// Form Rating & Ulasan (Inertia Form)
const formRating = useForm({
    score: 5,
    ulasan: '' // Di backend ini akan dipetakan ke kolom 'ulasan'
})

// State untuk hover efek bintang
const hoveredStar = ref(0)

function setScore(score: number) {
    formRating.score = score
}

function submitRating() {
    formRating.post(`/masjid/${props.masjid.slug}/rate`, {
        preserveScroll: true,
        onSuccess: () => {
            formRating.reset('ulasan')
            showRatingDialog.value = false
        }
    })
}
</script>

<template>
  <Head :title="masjid.nama" />

  <AppLayoutPublic subtitle="Masjid" :title="masjid.nama" :show-back="true" back-href="/ukhuwah">
    <div class="bg-linear-to-b from-black via-black to-black/0 pb-20 min-h-screen">
      
      <div class="relative h-56 sm:h-72 bg-stone-900 overflow-hidden">
        <img v-if="masjid.sampul" :src="`/storage/${masjid.sampul}`" class="w-full h-full object-cover opacity-70" />
        <div v-else class="w-full h-full bg-linear-to-br from-emerald-950 to-stone-900"></div>
        <div class="absolute inset-0 bg-linear-to-t from-stone-950 to-transparent"></div>
      </div>

      <div class="max-w-3xl mx-auto px-5 relative -mt-16">
        
        <div class="bg-stone-900 border border-stone-800 p-5 sm:p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6">
          <div class="relative shrink-0 -mt-12 sm:-mt-16">
            <img v-if="masjid.logo" :src="`/storage/${masjid.logo}`" class="size-24 sm:size-32 rounded-2xl object-cover border-4 border-stone-900 bg-stone-800 shadow-lg" />
            <div v-else class="size-24 sm:size-32 rounded-2xl border-4 border-stone-900 bg-stone-800 flex items-center justify-center shadow-lg">
              <MoonStar class="size-12 text-emerald-600" />
            </div>
          </div>

          <div class="text-center sm:text-left flex-1 w-full mt-2 sm:mt-0">
            <span class="inline-block px-2.5 py-0.5 rounded-md bg-emerald-900/30 text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20 mb-2">
              {{ masjid.jenis || 'Masjid' }}
            </span>
            <h1 class="text-2xl font-extrabold text-white leading-tight mb-2">{{ masjid.nama }}</h1>
            <div class="flex items-start justify-center sm:justify-start gap-1.5 text-xs text-stone-400">
              <MapPin class="size-4 text-rose-500 shrink-0 mt-0.5" />
              <span class="leading-relaxed">{{ masjid.alamat || 'Alamat tidak tersedia' }}</span>
            </div>
          </div>

          <div class="flex flex-col items-center justify-center p-3 rounded-2xl bg-stone-950 border border-stone-800 min-w-24 mt-2 sm:mt-0">
            <Star class="size-6 text-amber-400 fill-amber-400 mb-1" />
            <span class="text-lg font-bold text-white">{{ formatRating(masjid.ratings_avg_score) }}</span>
            <span class="text-[9px] text-stone-500 uppercase font-bold">{{ masjid.ratings_count || 0 }} Ulasan</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 mb-6">
            <button @click="showAnggotaDialog = true" class="flex items-center justify-center gap-2 py-3 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-2xl text-stone-200 text-xs font-bold transition-colors shadow-lg">
                <Users class="size-4 text-emerald-400" />
                <span>Jamaah ({{ masjid.users?.length ?? 0 }})</span>
            </button>

            <button @click="showRatingDialog = true" class="flex items-center justify-center gap-2 py-3 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-2xl text-amber-400 text-xs font-bold transition-colors shadow-lg">
                <Star class="size-4 fill-amber-400" />
                <span>Berikan Nilai</span>
            </button>
        </div>

        <div class="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8">
          <h2 class="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-6 border-b border-stone-800 pb-3">Profil Kemasjidan</h2>
          
          <div v-if="masjid.deskripsi"
            class="prose prose-invert prose-stone max-w-none
                   prose-p:text-stone-300 prose-p:leading-relaxed prose-p:text-[15px]
                   prose-headings:font-bold prose-headings:text-emerald-100
                   prose-strong:text-emerald-200
                   prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                   prose-ul:text-stone-300 prose-ol:text-stone-300
                   prose-img:rounded-2xl prose-img:border prose-img:border-stone-800
                   prose-iframe:w-full prose-iframe:aspect-video prose-iframe:rounded-xl"
            v-html="masjid.deskripsi"
          />
          <div v-else class="text-center py-10 text-stone-500 text-sm">
            Deskripsi dan profil historis masjid belum dilengkapi.
          </div>
        </div>

      </div>
    </div>

    <Dialog v-model:open="showAnggotaDialog">
        <DialogContent class="bg-stone-950 border border-stone-800 text-stone-200 max-w-md">
            <DialogHeader>
                <DialogTitle class="flex items-center gap-2"><Users class="size-5 text-emerald-500"/> Daftar Jamaah / Pengurus</DialogTitle>
                <DialogDescription class="text-stone-400">
                    Daftar tokoh atau warga yang berkontribusi di <strong>{{ masjid.nama }}</strong>.
                </DialogDescription>
            </DialogHeader>
            <div class="py-2 max-h-96 overflow-y-auto space-y-2.5 pr-1">
                <div v-if="masjid.users && masjid.users.length > 0" class="space-y-2">
                    <Link 
                        v-for="item in masjid.users" 
                        :key="item.id" 
                        :href="`/tokoh/${item.slug}`" 
                        class="flex items-center gap-3 p-3 rounded-xl border border-stone-800 bg-stone-900/50 hover:bg-stone-900 hover:border-emerald-500/30 transition-all group"
                    >
                        <img v-if="item.avatar" :src="`/storage/${item.avatar}`" class="size-10 rounded-full object-cover border border-stone-700" />
                        <div v-else class="size-10 rounded-full bg-stone-800 flex items-center justify-center border border-stone-700">
                            <UserCircle2 class="size-6 text-stone-600" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <h4 class="font-bold text-sm text-stone-200 truncate group-hover:text-emerald-400 transition-colors">{{ item.name }}</h4>
                            <p class="text-[10px] text-stone-500 uppercase font-semibold tracking-wider">{{ item.class || 'Umum' }}</p>
                        </div>
                        <ArrowRight class="size-4 text-stone-600 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                </div>
                <div v-else class="text-center py-8 text-sm text-stone-500 italic border border-dashed border-stone-800 rounded-xl">
                    Belum ada jamaah atau pengurus yang terhubung di sistem.
                </div>
            </div>
        </DialogContent>
    </Dialog>

    <Dialog v-model:open="showRatingDialog">
        <DialogContent class="bg-stone-950 border border-stone-800 text-stone-200 max-w-lg shadow-2xl">
            <DialogHeader>
                <DialogTitle class="flex items-center gap-2"><MessageSquare class="size-5 text-amber-500"/> Penilaian & Ulasan</DialogTitle>
                <DialogDescription class="text-stone-400">
                    Berikan feedback nilai bintang dan tuliskan kesan Anda untuk {{ masjid.nama }}.
                </DialogDescription>
            </DialogHeader>

            <div class="space-y-5 py-2 max-h-[75vh] overflow-y-auto pr-1">
                
                <div v-if="userLogin" class="bg-stone-900/40 p-4 rounded-2xl border border-stone-800">
                    <form @submit.prevent="submitRating" class="space-y-4">
                        <div class="flex flex-col items-center gap-1">
                            <label class="text-xs text-stone-400 font-bold uppercase tracking-wider">Pilih Rating Bintang</label>
                            <div class="flex gap-1.5 pt-1">
                                <button 
                                    v-for="star in 5" 
                                    :key="star"
                                    type="button"
                                    @click="setScore(star)"
                                    @mouseenter="hoveredStar = star"
                                    @mouseleave="hoveredStar = 0"
                                    class="p-1 transition-transform active:scale-95 cursor-pointer"
                                >
                                    <Star 
                                        :class="[
                                            star <= (hoveredStar || formRating.score) 
                                                ? 'text-amber-400 fill-amber-400' 
                                                : 'text-stone-700'
                                        ]"
                                        class="size-7 transition-colors" 
                                    />
                                </button>
                            </div>
                        </div>

                        <div class="space-y-1">
                            <textarea 
                                v-model="formRating.ulasan"
                                rows="3"
                                placeholder="Tuliskan ulasan atau pengalaman objektif Anda di sini..."
                                required
                                class="w-full text-sm bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-stone-200 placeholder-stone-600"
                            ></textarea>
                            <div v-if="formRating.errors.ulasan" class="text-red-500 text-xs mt-0.5">{{ formRating.errors.ulasan }}</div>
                        </div>

                        <div class="flex justify-end">
                            <button 
                                type="submit" 
                                :disabled="formRating.processing"
                                class="bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-black px-5 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                            >
                                {{ formRating.processing ? 'Mengirim...' : 'Kirim Ulasan' }}
                            </button>
                        </div>
                    </form>
                </div>

                <div v-else class="bg-stone-900/30 border border-stone-800 p-4 rounded-xl text-center text-xs text-stone-500">
                    Silakan <Link href="/login" class="text-amber-400 font-bold hover:underline">Masuk Akun</Link> terlebih dahulu untuk dapat memberikan penilaian.
                </div>

                <div class="space-y-3">
                    <h4 class="text-xs font-bold uppercase tracking-widest text-stone-400 border-b border-stone-800 pb-2">Riwayat Ulasan ({{ masjid.ratings?.length || 0 }})</h4>
                    
                    <div v-if="masjid.ratings && masjid.ratings.length > 0" class="space-y-2">
                        <div 
                            v-for="rating in masjid.ratings" 
                            :key="rating.id" 
                            class="bg-stone-900 border border-stone-850 p-3.5 rounded-2xl space-y-2 flex flex-col"
                        >
                            <div class="flex justify-between items-start gap-2">
                                <div class="flex items-center gap-2 min-w-0">
                                    <img v-if="rating.user?.avatar" :src="`/storage/${rating.user.avatar}`" class="size-6 rounded-full object-cover" />
                                    <span v-else class="size-6 rounded-full bg-stone-800 flex items-center justify-center text-[10px] text-stone-500">U</span>
                                    <span class="text-xs font-bold text-stone-300 truncate">{{ rating.user?.name || 'Anonim' }}</span>
                                </div>
                                <div class="flex gap-0.5 shrink-0">
                                    <Star v-for="bintang in rating.score" :key="bintang" class="size-3 text-amber-400 fill-amber-400" />
                                    <Star v-for="kosong in (5 - rating.score)" :key="kosong" class="size-3 text-stone-700" />
                                </div>
                            </div>
                            <p class="text-stone-300 text-xs leading-relaxed font-normal whitespace-pre-line">{{ rating.ulasan }}</p>
                            <span class="text-[10px] text-stone-600 font-mono self-end pt-1">{{ formatTglUlasan(rating.created_at) }}</span>
                        </div>
                    </div>

                    <div v-else class="text-center py-10 text-xs text-stone-600 italic">
                        Belum ada ulasan yang ditulis untuk masjid ini.
                    </div>
                </div>

            </div>
        </DialogContent>
    </Dialog>

  </AppLayoutPublic>
</template>

<style scoped>
.prose :deep(iframe) { width: 100% !important; aspect-ratio: 16 / 9 !important; height: auto !important; border-radius: 0.75rem; border: 1px solid #292524; }
</style>