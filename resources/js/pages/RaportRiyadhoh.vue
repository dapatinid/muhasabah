<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import { dashboard } from '@/routes';
import { toPng } from 'html-to-image';
import { nextTick } from 'vue';
import { Award } from 'lucide-vue-next';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Raport Riyadhoh', href: '/raport-riyadhoh' },
        ],
    },
});

interface LogEntry {
    id: number;
    nama: string;
    no_wa: string;
    tanggal: string;
    hari_ke: number;
    grup: string;
    tahajud: number;
    witir: number;
    qobliyah_subuh: string | null;
    subuh_jamaah: string | null;
    dhuha: number;
    dhuhur_jamaah: string | null;
    ashar_jamaah: string | null;
    maghrib_jamaah: string | null;
    isya_jamaah: string | null;
    sedekah_subuh: number;
    birrul_walidain: string | null;
    bakti_masjid: string | null;
    dzikir_pagi: string | null;
    dzikir_sore: string | null;
    istighfar: number;
    sholawat: number;
    alquran: string | null;
    puasa_sunnah: string | null;
    skor: number;
    skor_gabung: string; 
}

interface Props {
    no_wa?: string;
    entries?: LogEntry[];
    peserta?: {
        nama: string;
        no_wa: string;
        grup: string;
        tanggal_mulai: string;
        tanggal_selesai: string;
        total_hari: number;
        skor_rata: number;
        skor_total: number;
        skor_total_gabung: number;
    } | null;
}

const props = defineProps<Props>();

const noWa = ref(props.no_wa ?? '');
const loading = ref(false);

function cariRaport() {
    if (!noWa.value.trim()) return;
    loading.value = true;
    router.get(
        '/raport-riyadhoh',
        { no_wa: noWa.value.trim() },
        {
            preserveState: true,
            replace: true,
            onFinish: () => { loading.value = false; },
        }
    );
}

const ibadahCols = [
    { key: 'tahajud', label: 'Tahajud' },
    { key: 'witir', label: 'Witir' },
    { key: 'qobliyah_subuh', label: 'Qob.Subuh' },
    { key: 'subuh_jamaah', label: 'Subuh' },
    { key: 'dhuha', label: 'Dhuha' },
    { key: 'dhuhur_jamaah', label: 'Dhuhur' },
    { key: 'ashar_jamaah', label: 'Ashar' },
    { key: 'maghrib_jamaah', label: 'Maghrib' },
    { key: 'isya_jamaah', label: 'Isya' },
    { key: 'sedekah_subuh', label: 'Sedekah' },
    { key: 'birrul_walidain', label: 'Bir.Wali.' },
    { key: 'bakti_masjid', label: 'Bakti Masjid' },
    { key: 'dzikir_pagi', label: 'Dzikir Pagi' },
    { key: 'dzikir_sore', label: 'Dzikir Sore' },
    { key: 'istighfar', label: 'Istighfar' },
    { key: 'sholawat', label: 'Sholawat' },
    { key: 'alquran', label: "Tadarus 1 Juz" },
    { key: 'puasa_sunnah', label: 'Puasa Sunnah' },
];

// Build grid hari 1-40, isi dengan entry atau null
const harGrid = computed(() => {
    const grid: (LogEntry | null)[] = [];
    for (let h = 1; h <= 40; h++) {
        const found = props.entries?.find(e => e.hari_ke === h) ?? null;
        grid.push(found);
    }
    return grid;
});

function formatNilai(key: string, value: any): string {
    if (value === null || value === undefined) return '—';
    if (key === 'sedekah_subuh') {
        return value > 0 ? `${Number(value).toLocaleString('id-ID')}` : '—';
    }
    const map: Record<string, string> = {
        sempurna: '✓', ya: '✓', jamaah: '✓',
        sebagian: '½', sendiri: '½',
        tidak: '✗',
    };
    if (map[String(value)]) return map[String(value)];
    if (!isNaN(Number(value))) return Number(value) > 0 ? String(value) : '—';
    return String(value);
}

function nilaiClass(key: string, value: any): string {
    if (value === null || value === undefined || value === 0 || value === '0' || value === 'tidak') {
        return value === 'tidak' ? 'text-rose-500' : 'text-slate-300';
    }
    if (['sempurna', 'ya', 'jamaah'].includes(String(value))) return 'text-emerald-600 font-bold';
    if (['sebagian', 'sendiri'].includes(String(value))) return 'text-amber-500 font-semibold';
    if (!isNaN(Number(value)) && Number(value) > 0) return 'text-emerald-600 font-semibold';
    return 'text-slate-500';
}

function skorColor(skor: number): string {
    if (skor >= 15) return '#16a34a';
    if (skor >= 10) return '#d97706';
    return '#dc2626';
}

function formatTgl(tgl: string) {
    return new Date(tgl).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        .replace('Minggu', 'Ahad');
}

///// PRINT & DOWNLOAD FUNCTIONS

const page1Ref = ref<HTMLElement | null>(null);
const page2Ref = ref<HTMLElement | null>(null);

async function downloadRaportPng() {
    if (!page1Ref.value || !page2Ref.value) return;

    await nextTick();

    const options = {
        cacheBust: true,
        pixelRatio: 3, // kualitas tinggi
        backgroundColor: '#ffffff',
    };

    // PAGE 1
    const dataUrl1 = await toPng(page1Ref.value, options);
    const link1 = document.createElement('a');
    link1.download = `piagam-${props.peserta?.no_wa ?? 'raport'}.png`;
    link1.href = dataUrl1;
    link1.click();

    // PAGE 2
    const dataUrl2 = await toPng(page2Ref.value, options);
    const link2 = document.createElement('a');
    link2.download = `log-ibadah-${props.peserta?.no_wa ?? 'raport'}.png`;
    link2.href = dataUrl2;
    link2.click();
}
</script>

<template>
    <Head title="Raport Riyadhoh" />

    <!-- Screen UI -->
    <div class="print:hidden flex flex-col gap-6 p-4 max-w-3xl mx-auto">
        <div class="flex flex-col gap-1">
            <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Raport Riyadhoh</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">Masukkan nomor WhatsApp peserta untuk melihat raport</p>
        </div>

        <!-- Search -->
        <div class="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-sidebar p-4">
            <div class="flex gap-3 flex-col sm:flex-row">
                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    </span>
                    <input
                        v-model="noWa"
                        type="text"
                        placeholder="Contoh: 08123456789"
                        class="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                        @keydown.enter="cariRaport"
                    />
                </div>
                <button
                    @click="cariRaport"
                    :disabled="loading || !noWa.trim()"
                    class="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                >
                    <svg v-if="loading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    {{ loading ? 'Mencari...' : 'Tampilkan Raport' }}
                </button>
            </div>
        </div>

        <!-- Not found -->
        <div v-if="no_wa && !peserta && entries !== undefined" class="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6 text-center">
            <p class="text-red-600 dark:text-red-400 font-medium">Nomor WhatsApp tidak ditemukan dalam data riyadhoh.</p>
        </div>

        <!-- Found info -->
        <div v-if="peserta" class="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
                <p class="font-bold text-emerald-800 dark:text-emerald-200 text-lg">{{ peserta.nama }}</p>
                <p class="text-sm text-emerald-700 dark:text-emerald-300">{{ peserta.no_wa }} · Grup {{ peserta.grup }}</p>
                <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{{ peserta.total_hari }} hari tercatat · Skor rata-rata {{ peserta.skor_rata }}</p>
            </div>
            <button
                v-if="peserta"
                @click="downloadRaportPng"
                class="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
            >
                Download PNG
            </button>
        </div>
    </div>

    <!-- ============================================================ -->
    <!-- PRINT AREA — Landscape A4                                    -->
    <!-- ============================================================ -->
    <div v-if="peserta && entries" class="raport-print-root">

        <!-- ======================================================== -->
        <!-- HALAMAN 1 : PIAGAM                                       -->
        <!-- ======================================================== -->
        <div ref="page1Ref" class="raport-page certificate-page">

            <!-- Corner ornaments -->
            <div class="corner tl"></div>
            <div class="corner tr"></div>
            <div class="corner bl"></div>
            <div class="corner br"></div>

            <!-- Outer border line -->
            <div class="outer-border"></div>
            <div class="inner-border"></div>

            <!-- Watermark rosette -->
            <div class="watermark">
                <Award class="watermark-award" />
            </div>

            <!-- Header bismillah area -->
            <div class="cert-header">
                <div class="arabic-bismillah">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>
                <div class="cert-subtitle-top">PROGRAM RIYADHOH 40 HARI</div>
            </div>  

            <!-- Divider khat -->
            <div class="khat-divider">
                <span class="khat-line"></span>
                    <Award class="award-icon small" />
                    <Award class="award-icon big" />
                    <Award class="award-icon small" />
                <span class="khat-line"></span>
            </div>

            <!-- Title -->
            <div class="cert-title-area">
                <div class="cert-label-atas">PIAGAM KELULUSAN</div>
                <div class="cert-title-main">CERTIFICATE OF COMPLETION</div>
            </div>

            <!-- Diberikan kepada -->
            <div class="cert-body">
                <p class="cert-diberikan">Diberikan kepada:</p>
                <div class="cert-nama">{{ peserta.nama }}</div>
                <div class="cert-meta">Grup: {{ peserta.grup }} &nbsp;·&nbsp; {{ peserta.no_wa }}</div>

                <p class="cert-kalimat">
                    Telah menyelesaikan <strong>Tantangan Ibadah 40 Hari Riyadhoh</strong> dengan penuh istiqomah dan kesungguhan,
                    dimulai sejak <strong>{{ formatTgl(peserta.tanggal_mulai) }}</strong> hingga <strong>{{ formatTgl(peserta.tanggal_selesai) }}</strong>.
                    Semoga amal ibadah ini menjadi bekal di dunia dan akhirat.
                </p>

                <!-- Stats baris -->
                <div class="cert-stats">
                    <div class="cert-stat-item">
                        <div class="stat-angka">{{ peserta.total_hari }}</div>
                        <div class="stat-label">Hari Tercatat</div>
                    </div>

                    <div class="cert-stat-sep">·</div>

                    <div class="cert-stat-item">
                        <div class="stat-angka">
                            Rp{{ Number(peserta.total_sedekah).toLocaleString('id-ID') }}
                        </div>
                        <div class="stat-label">Sedekah</div>
                    </div>

                    <div class="cert-stat-sep">·</div>

                    <div class="cert-stat-item">
                        <div class="stat-angka">
                            {{ Number(peserta.skor_total).toLocaleString('id-ID') }}
                        </div>
                        <div class="stat-label">Skor</div>
                    </div>

                    <div class="cert-stat-sep">·</div>

                    <div class="cert-stat-item">
                        <div class="stat-angka">
                            {{ Number(peserta.skor_rata).toLocaleString('id-ID') }}
                        </div>
                        <div class="stat-label">Rata-rata Skor</div>
                    </div>
                </div>
            </div>

            <!-- Divider bawah -->
            <div class="khat-divider">
                <span class="khat-line"></span>
                <span class="khat-diamond">✦</span>
                <span class="khat-diamond small">✦</span>
                <span class="khat-diamond">✦</span>
                <span class="khat-line"></span>
            </div>

            <!-- Footer doa -->
            <div class="cert-footer">
                <div class="arabic-doa">اَللّٰهُمَّ تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ</div>
                <div class="doa-terjemah">Ya Allah, terimalah dari kami, sesungguhnya Engkau Maha Mendengar lagi Maha Mengetahui</div>
            </div>
        </div>


        <!-- ======================================================== -->
        <!-- HALAMAN 2 : TABEL LOG IBADAH                             -->
        <!-- ======================================================== -->
        <div ref="page2Ref" class="raport-page log-page">

            <div class="log-header">
                <div class="log-title-left">
                    <div class="log-title-main">LOG IBADAH HARIAN</div>
                    <div class="log-title-sub">Program Riyadhoh 40 Hari</div>
                </div>
                <div class="log-title-right">
                    <div class="log-peserta-nama">{{ peserta.nama }}</div>
                    <div class="log-peserta-meta">{{ peserta.no_wa }} · Grup {{ peserta.grup }}</div>
                    <div class="log-peserta-meta">{{ formatTgl(peserta.tanggal_mulai) }} — {{ formatTgl(peserta.tanggal_selesai) }}</div>
                </div>
            </div>

            <div class="log-table-wrap">
                <table class="log-table">
                    <thead>
                        <tr>
                            <th class="col-hari" style="color:springgreen;">Hari</th>
                            <th class="col-tgl" style="color:springgreen;">Tanggal</th>
                            <th v-for="col in ibadahCols" :key="col.key" class="col-ibadah">{{ col.label }}</th>
                            <th class="col-skor">Skor</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(entry, idx) in harGrid"
                            :key="idx"
                            :class="{ 'row-empty': !entry, 'row-even': idx % 2 === 1 }"
                        >
                            <td class="col-hari">{{ idx + 1 }}</td>
                            <td class="col-tgl">
                                <span v-if="entry">{{ formatTgl(entry.tanggal).replace(/\s*\d{4}$/, '') }}</span>
                                <span v-else class="empty-dash">—</span>
                            </td>
                            <td
                                v-for="col in ibadahCols"
                                :key="col.key"
                                class="col-ibadah"
                                :class="entry ? nilaiClass(col.key, (entry as any)[col.key]) : 'text-slate-300'"
                            >
                                <span v-if="entry">{{ formatNilai(col.key, (entry as any)[col.key]) }}</span>
                                <span v-else class="empty-dash">—</span>
                            </td>
                            <td class="col-skor">
                                <span v-if="entry" class="skor-badge">
                                    {{ entry.skor_gabung }}
                                </span>
                                <span v-else class="empty-dash">—</span>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr class="tfoot-row">
                            <td colspan="2" class="tfoot-label">TOTAL / RATA-RATA</td>
                            <td v-for="col in ibadahCols" :key="col.key" class="col-ibadah tfoot-val">—</td>
                            <td class="col-skor tfoot-skor">
                                {{ peserta.skor_total_gabung }}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div class="log-footer">
                <span>بِسْمِ اللَّهِ</span>
                <span>Dicetak dari sistem Riyadhoh · {{ new Date().toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' }) }}</span>
                <span>اَللّٰهُمَّ تَقَبَّلْ</span>
            </div>
        </div>

    </div>
</template>

<style scoped>
/* ================================================================
   SCREEN: container biasa
   ================================================================ */
.raport-print-root {
    display: none; /* hidden on screen, shown on print */
}

@media print {
    .raport-print-root {
        display: block;
    }
}

/* Preview on screen when peserta ada */
.raport-print-root {
    display: block;
    margin-top: 2rem;
    padding: 0 1rem 4rem;
}

/* ================================================================
   SHARED PAGE
   ================================================================ */
.raport-page {
    width: 297mm;
    min-height: 210mm;
    background: #fff;
    box-sizing: border-box;
    position: relative;
    margin: 0 auto 32px;
    box-shadow: 0 4px 32px rgba(0,0,0,0.12);
    page-break-after: always;
    overflow: visible;
}

/* ================================================================
   HALAMAN 1 — PIAGAM
   ================================================================ */

.award-icon {
    color: #15803d;
    opacity: 0.75;
}

.award-icon.small {
    width: 12mm;
    height: 12mm;
    stroke-width: 1.6;
}

.award-icon.big {
    width: 18mm;
    height: 18mm;
    stroke-width: 1.6;
}

.certificate-page {
    padding: 18mm 22mm;
    background: #fff;
    font-family: 'Georgia', 'Times New Roman', serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 0;
}

/* borders */
.outer-border {
    position: absolute;
    inset: 8mm;
    border: 2.5px solid #15803d;
    pointer-events: none;
}
.inner-border {
    position: absolute;
    inset: 11mm;
    border: 1px solid #bbf7d0;
    pointer-events: none;
}

/* corners */
.corner {
    position: absolute;
    width: 18mm;
    height: 18mm;
    pointer-events: none;
}
.corner::before,
.corner::after {
    content: '';
    position: absolute;
    background: #15803d;
}
.corner::before { width: 100%; height: 2.5px; top: 8mm; }
.corner::after  { width: 2.5px; height: 100%; left: 8mm; }
.tl { top: 0; left: 0; }
.tr { top: 0; right: 0; transform: scaleX(-1); }
.bl { bottom: 0; left: 0; transform: scaleY(-1); }
.br { bottom: 0; right: 0; transform: scale(-1); }

/* watermark */
.watermark {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 0;
}
.watermark svg { width: 160mm; height: 160mm; }

.watermark-award {
    width: 150mm;
    height: 150mm;
    opacity: 0.08;
    color: #16a34a;
}

/* all cert children above watermark */
.certificate-page > *:not(.watermark):not(.corner):not(.outer-border):not(.inner-border) {
    position: relative;
    z-index: 1;
}

/* header */
.cert-header {
    text-align: center;
    margin-top: 2mm;
}
.arabic-bismillah {
    font-size: 20pt;
    color: #15803d;
    letter-spacing: 0.05em;
    line-height: 1.6;
    font-family: 'Scheherazade New', 'Amiri', 'Traditional Arabic', serif;
}
.cert-subtitle-top {
    font-size: 7.5pt;
    letter-spacing: 0.35em;
    color: #6b7280;
    text-transform: uppercase;
    margin-top: 1mm;
    font-family: 'Palatino', Georgia, serif;
}

/* khat divider */
.khat-divider {
    display: flex;
    align-items: center;
    gap: 3mm;
    width: 100%;
    justify-content: center;
    margin: 2mm 0;
}
.khat-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, #86efac, transparent);
}
.khat-diamond { color: #15803d; font-size: 9pt; }
.khat-diamond.small { font-size: 6pt; }

/* title area */
.cert-title-area { text-align: center; margin: 1mm 0; }
.cert-label-atas {
    font-size: 8pt;
    letter-spacing: 0.4em;
    color: #16a34a;
    text-transform: uppercase;
    font-family: 'Palatino', Georgia, serif;
}
.cert-title-main {
    font-size: 24pt;
    font-weight: 700;
    color: #14532d;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-family: 'Palatino Linotype', Palatino, Georgia, serif;
    line-height: 1.1;
    margin-top: 1mm;
}

/* body */
.cert-body { text-align: center; width: 100%; }
.cert-diberikan {
    font-size: 9pt;
    color: #6b7280;
    letter-spacing: 0.1em;
    margin: 2mm 0 1mm;
    font-style: italic;
}
.cert-nama {
    font-size: 28pt;
    font-weight: 700;
    color: #14532d;
    font-family: 'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif;
    font-style: italic;
    border-bottom: 1.5px solid #86efac;
    display: inline-block;
    padding: 0 8mm 1mm;
    line-height: 1.2;
    letter-spacing: 0.02em;
    text-transform: capitalize;
}
.cert-meta {
    font-size: 8.5pt;
    color: #4b5563;
    margin-top: 2mm;
    letter-spacing: 0.05em;
}
.cert-kalimat {
    font-size: 9pt;
    color: #374151;
    line-height: 1.7;
    margin: 3mm auto 0;
    max-width: 200mm;
}
.cert-kalimat strong { color: #15803d; }

/* stats */
.cert-stats {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6mm;
    margin-top: 4mm;
    padding: 3mm 8mm;
    border: 1px solid #d1fae5;
    border-radius: 2mm;
    background: #f0fdf4;
    display: inline-flex;
}
.cert-stat-item { text-align: center; }
.stat-angka { font-size: 14pt; font-weight: 700; color: #15803d; line-height: 1; }
.stat-label { font-size: 6.5pt; color: #6b7280; letter-spacing: 0.05em; margin-top: 0.5mm; }
.cert-stat-sep { font-size: 16pt; color: #86efac; line-height: 1; }

/* footer */
.cert-footer { text-align: center; margin-bottom: 1mm; }
.arabic-doa {
    font-size: 14pt;
    color: #15803d;
    font-family: 'Scheherazade New', 'Amiri', 'Traditional Arabic', serif;
    line-height: 1.8;
}
.doa-terjemah {
    font-size: 7pt;
    color: #6b7280;
    font-style: italic;
    margin-top: 0.5mm;
}

/* ================================================================
   HALAMAN 2 — LOG TABEL
   ================================================================ */
.log-page {
    padding: 8mm 8mm 6mm;
    display: flex;
    flex-direction: column;
    gap: 4mm;
    font-family: 'Segoe UI', system-ui, sans-serif;
    background: #fff;
    overflow: visible;
}

.log-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2px solid #16a34a;
    padding-bottom: 3mm;
}
.log-title-main {
    font-size: 14pt;
    font-weight: 800;
    color: #14532d;
    letter-spacing: 0.06em;
}
.log-title-sub {
    font-size: 7pt;
    color: #6b7280;
    letter-spacing: 0.15em;
    margin-top: 0.5mm;
}
.log-title-right { text-align: right; }
.log-peserta-nama {
    font-size: 11pt;
    font-weight: 700;
    color: #14532d;
}
.log-peserta-meta {
    font-size: 6.5pt;
    color: #6b7280;
    margin-top: 0.5mm;
}

/* table */
.log-table-wrap { overflow: visible; }
.log-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 5.5pt;
}
.log-table thead tr {
    background: #14532d;
    color: #fff;
}
.log-table thead th {
    padding: 1.5mm 1mm;
    text-align: center;
    font-weight: 600;
    letter-spacing: 0.02em;
    white-space: nowrap;
    border: 0.3px solid #166534;
}
.log-table tbody tr {
    border-bottom: 0.3px solid #e5e7eb;
}
.log-table tbody tr.row-even {
    background: #f9fafb;
}
.log-table tbody tr.row-empty {
    opacity: 0.5;
}
.log-table td {
    padding: 1mm 1mm;
    text-align: center;
    border: 0.3px solid #f3f4f6;
    white-space: nowrap;
}
.col-hari { font-weight: 700; color: #15803d; width: 6mm; }
.col-tgl { font-size: 5pt; color: #374151; width: 18mm; text-align: left; padding-left: 1.5mm; }
.col-ibadah { width: auto; min-width: 8mm; }
.col-skor { font-weight: 700; width: 8mm; }
.empty-dash { color: #d1d5db; }

.skor-badge {
    display: inline-block;
    border: 1px solid;
    border-radius: 2px;
    padding: 0 1mm;
    font-weight: 700;
    font-size: 5.5pt;
    line-height: 1.6;
}

/* tfoot */
.tfoot-row { background: #f0fdf4; font-weight: 700; }
.tfoot-label {
    text-align: right;
    padding-right: 2mm;
    font-size: 5.5pt;
    color: #15803d;
    letter-spacing: 0.05em;
    border-top: 1px solid #16a34a;
}
.tfoot-val {
    border-top: 1px solid #16a34a;
    color: #9ca3af;
}
.tfoot-skor {
    color: #15803d;
    border-top: 1px solid #16a34a;
    font-size: 6pt;
}
.tfoot-persen { font-size: 5pt; color: #6b7280; }

/* log footer */
.log-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #d1fae5;
    padding-top: 2mm;
    font-size: 6pt;
    color: #9ca3af;
}
.log-footer span:first-child,
.log-footer span:last-child {
    color: #16a34a;
    font-family: 'Traditional Arabic', serif;
    font-size: 9pt;
}

/* ================================================================
   PRINT OVERRIDES
   ================================================================ */
@media print {
    @page { size: A4 landscape; margin: 0; }
    body * { visibility: hidden; }
    .raport-print-root,
    .raport-print-root * { visibility: visible; }
    .raport-print-root { position: fixed; top: 0; left: 0; }
    .raport-page { box-shadow: none; margin: 0; page-break-after: always; }
    .print\:hidden { display: none !important; }

    /* ensure colors print */
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
</style>