<script setup lang="ts">
import { Head, Link, router, usePage } from '@inertiajs/vue3' // Tambahkan usePage di sini
import { ref, watch, computed } from 'vue' // Tambahkan computed di sini
import debounce from 'lodash/debounce'
import { Search, MapPin, Star, UserCircle2, CircleStar, MoonStar, Target, MessageCircle } from 'lucide-vue-next'
import AppLayoutPublic from '@/layouts/AppLayoutPublic.vue'
import { onMounted, onUnmounted } from 'vue'
import { createClient } from '@supabase/supabase-js'

const props = defineProps<{
  items: any;
  tab: string;
  filters: { search?: string; tab?: string };
}>();

const page = usePage()
const unreadChatsCount = computed(() => page.props.unread_chats_count)

const search = ref(props.filters?.search ?? '');
const activeTab = ref(props.tab ?? 'tokoh');

watch(search, debounce((val) => {
  router.get('/ukhuwah', { search: val || undefined, tab: activeTab.value }, { preserveState: true, preserveScroll: true, replace: true })
}, 800));

function switchTab(newTab: string) {
  activeTab.value = newTab;
  router.get('/ukhuwah', { tab: newTab, search: search.value || undefined }, { preserveState: true, preserveScroll: true })
}

function goToPage(url: string | null) { if (url) router.get(url) }
function formatRating(num: any) { return num ? Number(num).toFixed(1) : '0.0' }

const tabs = [
  { key: 'tokoh',    label: 'Tokoh',    icon: UserCircle2 },
  { key: 'lingkaran', label: 'Lingkaran', icon: Target },
  { key: 'masjid',   label: 'Masjid',   icon: MoonStar },
]

const pisahkanClass = (cls: string | null | undefined): string[] => {
  if (!cls) return [];
  return cls.split(',').map((item: string) => item.trim()).filter(Boolean);
};

// Inisialisasi Supabase
const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
)

let realtimeChannel = null

onMounted(() => {
    const authUserId = String(page.props.auth.user?.id)
    if (!authUserId) return

    // Dengarkan notifikasi masuk saat berada di halaman Ukhuwah
    realtimeChannel = supabase
        .channel('public:notifications_global')
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `audience=eq.${authUserId}`
            },
            (payload) => {
                if (payload.new.type === 'message.new') {
                    // Minta Inertia menarik ulang data counter unread secara diam-diam
                    router.reload({ only: ['messages', 'conversations', 'unread_chats_count'] })
                }
            }
        )
        .subscribe()
})

onUnmounted(() => {
    if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel)
    }
})
</script>

<template>
  <Head title="Jejaring Ukhuwah" />

  <AppLayoutPublic subtitle="Persatuan" title="Ukhuwah" :show-back="true">
    <div class="bg-linear-to-b from-black via-black to-black/0">

      <div class="relative overflow-hidden bg-linear-to-br from-emerald-950 via-emerald-900 to-teal-900">
        <svg class="absolute -top-8 -right-8 opacity-10 w-64 h-64 text-white" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <polygon points="100,10 190,55 190,145 100,190 10,145 10,55" stroke="currentColor" stroke-width="1.5" fill="none"/>
          <polygon points="100,30 172,67.5 172,132.5 100,170 28,132.5 28,67.5" stroke="currentColor" stroke-width="1" fill="none"/>
          <polygon points="100,50 155,80 155,120 100,150 45,120 45,80" stroke="currentColor" stroke-width="0.75" fill="none"/>
          <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" stroke-width="0.5"/>
          <line x1="10" y1="55" x2="190" y2="145" stroke="currentColor" stroke-width="0.5"/>
          <line x1="190" y1="55" x2="10" y2="145" stroke="currentColor" stroke-width="0.5"/>
        </svg>
        <svg class="absolute -bottom-4 -left-4 opacity-10 w-32 h-32 text-white" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="50" cy="50" r="40" stroke="currentColor" stroke-width="1"/>
          <circle cx="50" cy="50" r="28" stroke="currentColor" stroke-width="0.75"/>
          <circle cx="50" cy="50" r="16" stroke="currentColor" stroke-width="0.5"/>
          <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" stroke-width="0.5"/>
          <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" stroke-width="0.5"/>
        </svg>

        <div class="relative max-w-3xl mx-auto px-6 py-12 text-center">
          <p class="text-emerald-300/80 text-xs font-semibold tracking-[0.2em] uppercase mb-3">Persatuan Umat</p>
          <h1 class="text-4xl font-extrabold text-white tracking-tight mb-3 leading-tight">
            Jejaring <span class="text-emerald-300">Ukhuwah</span>
          </h1>
          <p class="text-emerald-100/70 text-sm max-w-sm mx-auto leading-relaxed">
            Temukan tokoh, lingkaran, dan masjid. Mari bangun silaturahmi yang bermakna.
          </p>
        </div>
      </div>

      <div class="max-w-3xl mx-auto px-4 -mt-6 pb-16">

        <div class="relative mb-2 flex gap-2 bg-stone-900 p-1.5 rounded-2xl border border-stone-800">
          <button
            v-for="t in tabs"
            :key="t.key"
            @click="switchTab(t.key)"
            :class="[
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200',
              activeTab === t.key
                ? 'bg-emerald-600 text-white'
                : 'text-stone-500 hover:text-stone-300 hover:bg-stone-800'
            ]"
          >
            <span><component :is="t.icon" class="size-4" /></span>
            <span>{{ t.label }}</span>
          </button>
        </div>

        <div class="relative mb-6">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-stone-400 pointer-events-none" />
          <input
            v-model="search"
            type="search"
            :placeholder="'Cari nama ' + activeTab + '…'"
            class="w-full pl-11 pr-5 py-3.5 border-b border-b-stone-800 text-sm text-stone-100 placeholder-stone-400 focus:outline-none ring-0 focus:border-b-2 focus:border-b-emerald-500/60 shadow-none transition"
          />
        </div>

        <div
          v-if="items.data.length === 0"
          class="py-20 text-center"
        >
          <div class="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search class="size-7 text-stone-400" />
          </div>
          <p class="text-stone-500 font-medium text-sm">Belum ada data ditemukan.</p>
          <p class="text-stone-400 text-xs mt-1">Coba kata kunci yang berbeda.</p>
        </div>

        <div v-else-if="activeTab === 'tokoh'" class="grid grid-cols-1 gap-4">
          <Link
            v-for="user in items.data"
            :key="user.id"
            :href="`/tokoh/${user.slug}`"
            class="group bg-stone-900 rounded-2xl border border-stone-800 p-5 flex items-center gap-4 hover:-translate-y-0.5 hover:border-emerald-500/30 transition-all duration-200"
          >
            <div class="relative shrink-0">
              <img
                v-if="user.avatar"
                :src="`/storage/${user.avatar}`"
                class="size-14 rounded-2xl object-cover"
              />
              <img v-else
                :src="user.gender === 'P' ? `/avatar_cewe.png` : `/avatar_cowo.png`"
                class="size-14 rounded-2xl object-cover"
              />
              <!-- <div
                v-else
                class="size-14 rounded-2xl bg-linear-to-br from-emerald-900/40 to-teal-900/40 flex items-center justify-center"
              >
                <UserCircle2 class="size-7 text-emerald-500" />
              </div> -->
              <span v-if="user.is_online" class="absolute -bottom-0.5 -right-0.5 size-3 bg-emerald-400 rounded-full border-2 border-stone-900"></span>
            </div>

            <div class="min-w-0">
              <h3 class="font-bold text-white text-sm truncate group-hover:text-emerald-400 transition-colors">{{ user.name }}</h3>
              <p class="text-xs text-stone-400 mt-0.5 truncate">{{ user.level || 'Anggota' }} <span class="mx-1">•</span> {{ user.city?.name?.replace('KABUPATEN', 'KAB.') || 'Indonesia'}}</p>
              <div class="flex flex-nowrap gap-1.5 mt-2 overflow-auto no-scrollbar">
                <template v-if="pisahkanClass(user.class).length > 0">
                  <span
                    v-for="(clsItem, index) in pisahkanClass(user.class)"
                    :key="index"
                    class="text-nowrap inline-block px-2 py-0.5 rounded-md bg-emerald-900/30 text-emerald-400 text-[8px] font-bold uppercase tracking-wide border border-emerald-500/10"
                  >
                    {{ clsItem }}
                  </span>
                </template>
                <span
                  v-else
                  class="text-nowrap inline-block px-2 py-0.5 rounded-md bg-stone-900 text-stone-500 text-[8px] font-bold uppercase tracking-wide border border-stone-800"
                >
                  Umum
                </span>
              </div>
            </div>
          </Link>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            v-for="item in items.data"
            :key="item.id"
            :href="`/${activeTab}/${item.slug}`"
            class="group bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden hover:-translate-y-0.5 hover:border-emerald-500/30 transition-all duration-200 flex flex-col"
          >
            <div class="h-28 bg-linear-to-br from-stone-800 to-stone-700 relative overflow-hidden">
              <img
                v-if="item.sampul"
                :src="`/storage/${item.sampul}`"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-linear-to-t from-black/30 to-transparent"></div>
            </div>

            <div class="px-5 pt-4 pb-3 flex-1 relative">
              <div class="absolute -top-7 left-5">
                <img
                  v-if="item.logo"
                  :src="`/storage/${item.logo}`"
                  class="size-14 object-cover border-[3px] border-stone-900 shadow-md group-hover:border-emerald-900/50 transition-colors"
                  :class="activeTab === 'lingkaran' ? 'rounded-full' : 'rounded-xl'"
                />
                <div
                  v-else
                  class="size-14 bg-linear-to-br border-[3px] border-stone-900 shadow-md flex items-center justify-center text-white text-lg font-extrabold group-hover:border-emerald-900/50 transition-colors"
                  :class="activeTab === 'lingkaran' ? 'rounded-full' : 'rounded-xl'"
                >
                  {{ item.nama?.charAt(0) ?? '?' }}
                </div>
              </div>

              <div class="pl-16 mb-5 relative">
                <span class="absolute -top-9 inline-block mt-0.5 text-[10px] uppercase font-semibold tracking-wider text-emerald-400">
                  {{ item.jenis }}
                </span>
                <h3 class="absolute -top-3 font-bold text-white text-sm leading-tight line-clamp-1 group-hover:text-emerald-400 transition-colors">{{ item.nama }}</h3>
              </div>

              <div class="flex items-start gap-1.5 text-stone-400 text-xs mt-3">
                <MapPin class="size-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span class="line-clamp-1 leading-relaxed">{{ item.alamat || 'Alamat tidak tersedia' }}</span>
              </div>
            </div>

            <div class="px-5 py-3 border-t border-stone-800 flex items-center justify-between bg-stone-800/30">
              <div class="flex items-center gap-1.5">
                <Star class="size-3.5 fill-amber-400 text-amber-400" />
                <span class="text-xs font-bold text-stone-200">{{ formatRating(item.ratings_avg_score) }}</span>
              </div>
              <span class="text-[10px] text-stone-400">{{ item.ratings_count || 0 }} ulasan</span>
            </div>
          </Link>
        </div>

        <div v-if="items.links?.length > 3" class="flex justify-center items-center gap-1 pt-10">
          <button
            v-for="(link, i) in items.links"
            :key="i"
            @click="goToPage(link.url)"
            v-html="link.label"
            :disabled="!link.url"
            :class="[
              'min-w-[36px] h-9 px-3 rounded-xl text-xs font-bold transition-all border',
              link.active
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200/60'
                : link.url
                  ? 'bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-emerald-400 hover:text-emerald-600'
                  : 'bg-stone-900 border-stone-800 text-stone-300 dark:text-stone-600 cursor-not-allowed'
            ]"
          />
        </div>

      </div> 

    </div>

    <div class="fixed bottom-32 max-w-xl mx-auto inset-x-0 z-50 pointer-events-none">
      <div class="absolute left-5 pointer-events-auto flex flex-col gap-3">
        
        <Link 
            href="/obrolan"
            class="relative size-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-600/20 transition-all pointer-events-auto"
        >
            <MessageCircle class="size-5" />

            <span 
                v-if="unreadChatsCount > 0"
                class="absolute -top-1.5 -right-1.5 min-w-[18px] h-4 px-1 flex items-center justify-center bg-rose-500 text-white text-[10px] font-black rounded-full border-2 border-stone-900 animate-bounce"
            >
                {{ unreadChatsCount }}
            </span>
        </Link>

      </div>
    </div>  
 

  </AppLayoutPublic>
</template>