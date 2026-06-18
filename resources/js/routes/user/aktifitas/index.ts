import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AktifitasController::donasi
* @see app/Http/Controllers/AktifitasController.php:14
* @route '/user/aktifitas/donasi'
*/
export const donasi = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: donasi.url(options),
    method: 'get',
})

donasi.definition = {
    methods: ["get","head"],
    url: '/user/aktifitas/donasi',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AktifitasController::donasi
* @see app/Http/Controllers/AktifitasController.php:14
* @route '/user/aktifitas/donasi'
*/
donasi.url = (options?: RouteQueryOptions) => {
    return donasi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AktifitasController::donasi
* @see app/Http/Controllers/AktifitasController.php:14
* @route '/user/aktifitas/donasi'
*/
donasi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: donasi.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AktifitasController::donasi
* @see app/Http/Controllers/AktifitasController.php:14
* @route '/user/aktifitas/donasi'
*/
donasi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: donasi.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AktifitasController::donasi
* @see app/Http/Controllers/AktifitasController.php:14
* @route '/user/aktifitas/donasi'
*/
const donasiForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: donasi.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AktifitasController::donasi
* @see app/Http/Controllers/AktifitasController.php:14
* @route '/user/aktifitas/donasi'
*/
donasiForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: donasi.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AktifitasController::donasi
* @see app/Http/Controllers/AktifitasController.php:14
* @route '/user/aktifitas/donasi'
*/
donasiForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: donasi.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

donasi.form = donasiForm

/**
* @see \App\Http\Controllers\AktifitasController::tiket
* @see app/Http/Controllers/AktifitasController.php:32
* @route '/user/aktifitas/tiket'
*/
export const tiket = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tiket.url(options),
    method: 'get',
})

tiket.definition = {
    methods: ["get","head"],
    url: '/user/aktifitas/tiket',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AktifitasController::tiket
* @see app/Http/Controllers/AktifitasController.php:32
* @route '/user/aktifitas/tiket'
*/
tiket.url = (options?: RouteQueryOptions) => {
    return tiket.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AktifitasController::tiket
* @see app/Http/Controllers/AktifitasController.php:32
* @route '/user/aktifitas/tiket'
*/
tiket.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tiket.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AktifitasController::tiket
* @see app/Http/Controllers/AktifitasController.php:32
* @route '/user/aktifitas/tiket'
*/
tiket.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: tiket.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AktifitasController::tiket
* @see app/Http/Controllers/AktifitasController.php:32
* @route '/user/aktifitas/tiket'
*/
const tiketForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tiket.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AktifitasController::tiket
* @see app/Http/Controllers/AktifitasController.php:32
* @route '/user/aktifitas/tiket'
*/
tiketForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tiket.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AktifitasController::tiket
* @see app/Http/Controllers/AktifitasController.php:32
* @route '/user/aktifitas/tiket'
*/
tiketForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tiket.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

tiket.form = tiketForm

/**
* @see \App\Http\Controllers\AktifitasController::reaksi
* @see app/Http/Controllers/AktifitasController.php:50
* @route '/user/aktifitas/reaksi'
*/
export const reaksi = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reaksi.url(options),
    method: 'get',
})

reaksi.definition = {
    methods: ["get","head"],
    url: '/user/aktifitas/reaksi',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AktifitasController::reaksi
* @see app/Http/Controllers/AktifitasController.php:50
* @route '/user/aktifitas/reaksi'
*/
reaksi.url = (options?: RouteQueryOptions) => {
    return reaksi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AktifitasController::reaksi
* @see app/Http/Controllers/AktifitasController.php:50
* @route '/user/aktifitas/reaksi'
*/
reaksi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reaksi.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AktifitasController::reaksi
* @see app/Http/Controllers/AktifitasController.php:50
* @route '/user/aktifitas/reaksi'
*/
reaksi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reaksi.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AktifitasController::reaksi
* @see app/Http/Controllers/AktifitasController.php:50
* @route '/user/aktifitas/reaksi'
*/
const reaksiForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: reaksi.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AktifitasController::reaksi
* @see app/Http/Controllers/AktifitasController.php:50
* @route '/user/aktifitas/reaksi'
*/
reaksiForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: reaksi.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AktifitasController::reaksi
* @see app/Http/Controllers/AktifitasController.php:50
* @route '/user/aktifitas/reaksi'
*/
reaksiForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: reaksi.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

reaksi.form = reaksiForm

/**
* @see \App\Http\Controllers\AktifitasController::komentar
* @see app/Http/Controllers/AktifitasController.php:67
* @route '/user/aktifitas/komentar'
*/
export const komentar = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: komentar.url(options),
    method: 'get',
})

komentar.definition = {
    methods: ["get","head"],
    url: '/user/aktifitas/komentar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AktifitasController::komentar
* @see app/Http/Controllers/AktifitasController.php:67
* @route '/user/aktifitas/komentar'
*/
komentar.url = (options?: RouteQueryOptions) => {
    return komentar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AktifitasController::komentar
* @see app/Http/Controllers/AktifitasController.php:67
* @route '/user/aktifitas/komentar'
*/
komentar.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: komentar.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AktifitasController::komentar
* @see app/Http/Controllers/AktifitasController.php:67
* @route '/user/aktifitas/komentar'
*/
komentar.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: komentar.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AktifitasController::komentar
* @see app/Http/Controllers/AktifitasController.php:67
* @route '/user/aktifitas/komentar'
*/
const komentarForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: komentar.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AktifitasController::komentar
* @see app/Http/Controllers/AktifitasController.php:67
* @route '/user/aktifitas/komentar'
*/
komentarForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: komentar.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AktifitasController::komentar
* @see app/Http/Controllers/AktifitasController.php:67
* @route '/user/aktifitas/komentar'
*/
komentarForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: komentar.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

komentar.form = komentarForm

/**
* @see \App\Http\Controllers\AktifitasController::rating
* @see app/Http/Controllers/AktifitasController.php:84
* @route '/user/aktifitas/rating'
*/
export const rating = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: rating.url(options),
    method: 'get',
})

rating.definition = {
    methods: ["get","head"],
    url: '/user/aktifitas/rating',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AktifitasController::rating
* @see app/Http/Controllers/AktifitasController.php:84
* @route '/user/aktifitas/rating'
*/
rating.url = (options?: RouteQueryOptions) => {
    return rating.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AktifitasController::rating
* @see app/Http/Controllers/AktifitasController.php:84
* @route '/user/aktifitas/rating'
*/
rating.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: rating.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AktifitasController::rating
* @see app/Http/Controllers/AktifitasController.php:84
* @route '/user/aktifitas/rating'
*/
rating.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: rating.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AktifitasController::rating
* @see app/Http/Controllers/AktifitasController.php:84
* @route '/user/aktifitas/rating'
*/
const ratingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: rating.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AktifitasController::rating
* @see app/Http/Controllers/AktifitasController.php:84
* @route '/user/aktifitas/rating'
*/
ratingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: rating.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AktifitasController::rating
* @see app/Http/Controllers/AktifitasController.php:84
* @route '/user/aktifitas/rating'
*/
ratingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: rating.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

rating.form = ratingForm

const aktifitas = {
    donasi: Object.assign(donasi, donasi),
    tiket: Object.assign(tiket, tiket),
    reaksi: Object.assign(reaksi, reaksi),
    komentar: Object.assign(komentar, komentar),
    rating: Object.assign(rating, rating),
}

export default aktifitas