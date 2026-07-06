import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DonasiController::donasi
* @see app/Http/Controllers/DonasiController.php:21
* @route '/donasi'
*/
export const donasi = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: donasi.url(options),
    method: 'get',
})

donasi.definition = {
    methods: ["get","head"],
    url: '/donasi',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DonasiController::donasi
* @see app/Http/Controllers/DonasiController.php:21
* @route '/donasi'
*/
donasi.url = (options?: RouteQueryOptions) => {
    return donasi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::donasi
* @see app/Http/Controllers/DonasiController.php:21
* @route '/donasi'
*/
donasi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: donasi.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::donasi
* @see app/Http/Controllers/DonasiController.php:21
* @route '/donasi'
*/
donasi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: donasi.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DonasiController::donasi
* @see app/Http/Controllers/DonasiController.php:21
* @route '/donasi'
*/
const donasiForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: donasi.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::donasi
* @see app/Http/Controllers/DonasiController.php:21
* @route '/donasi'
*/
donasiForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: donasi.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::donasi
* @see app/Http/Controllers/DonasiController.php:21
* @route '/donasi'
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
* @see \App\Http\Controllers\DonasiController::uploadBuktiSusulan
* @see app/Http/Controllers/DonasiController.php:518
* @route '/payment/{payment}/upload-bukti'
*/
export const uploadBuktiSusulan = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadBuktiSusulan.url(args, options),
    method: 'post',
})

uploadBuktiSusulan.definition = {
    methods: ["post"],
    url: '/payment/{payment}/upload-bukti',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DonasiController::uploadBuktiSusulan
* @see app/Http/Controllers/DonasiController.php:518
* @route '/payment/{payment}/upload-bukti'
*/
uploadBuktiSusulan.url = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { payment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            payment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payment: typeof args.payment === 'object'
        ? args.payment.id
        : args.payment,
    }

    return uploadBuktiSusulan.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::uploadBuktiSusulan
* @see app/Http/Controllers/DonasiController.php:518
* @route '/payment/{payment}/upload-bukti'
*/
uploadBuktiSusulan.post = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadBuktiSusulan.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::uploadBuktiSusulan
* @see app/Http/Controllers/DonasiController.php:518
* @route '/payment/{payment}/upload-bukti'
*/
const uploadBuktiSusulanForm = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadBuktiSusulan.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::uploadBuktiSusulan
* @see app/Http/Controllers/DonasiController.php:518
* @route '/payment/{payment}/upload-bukti'
*/
uploadBuktiSusulanForm.post = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadBuktiSusulan.url(args, options),
    method: 'post',
})

uploadBuktiSusulan.form = uploadBuktiSusulanForm

/**
* @see \App\Http\Controllers\DonasiController::payment
* @see app/Http/Controllers/DonasiController.php:557
* @route '/donasi/{donasi}/payment'
*/
export const payment = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payment.url(args, options),
    method: 'get',
})

payment.definition = {
    methods: ["get","head"],
    url: '/donasi/{donasi}/payment',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DonasiController::payment
* @see app/Http/Controllers/DonasiController.php:557
* @route '/donasi/{donasi}/payment'
*/
payment.url = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { donasi: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { donasi: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            donasi: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        donasi: typeof args.donasi === 'object'
        ? args.donasi.slug
        : args.donasi,
    }

    return payment.definition.url
            .replace('{donasi}', parsedArgs.donasi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::payment
* @see app/Http/Controllers/DonasiController.php:557
* @route '/donasi/{donasi}/payment'
*/
payment.get = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payment.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::payment
* @see app/Http/Controllers/DonasiController.php:557
* @route '/donasi/{donasi}/payment'
*/
payment.head = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payment.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DonasiController::payment
* @see app/Http/Controllers/DonasiController.php:557
* @route '/donasi/{donasi}/payment'
*/
const paymentForm = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payment.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::payment
* @see app/Http/Controllers/DonasiController.php:557
* @route '/donasi/{donasi}/payment'
*/
paymentForm.get = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payment.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::payment
* @see app/Http/Controllers/DonasiController.php:557
* @route '/donasi/{donasi}/payment'
*/
paymentForm.head = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payment.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

payment.form = paymentForm

/**
* @see \App\Http\Controllers\DonasiController::storePayment
* @see app/Http/Controllers/DonasiController.php:564
* @route '/donasi/{donasi}/payment'
*/
export const storePayment = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePayment.url(args, options),
    method: 'post',
})

storePayment.definition = {
    methods: ["post"],
    url: '/donasi/{donasi}/payment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DonasiController::storePayment
* @see app/Http/Controllers/DonasiController.php:564
* @route '/donasi/{donasi}/payment'
*/
storePayment.url = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { donasi: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { donasi: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            donasi: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        donasi: typeof args.donasi === 'object'
        ? args.donasi.slug
        : args.donasi,
    }

    return storePayment.definition.url
            .replace('{donasi}', parsedArgs.donasi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::storePayment
* @see app/Http/Controllers/DonasiController.php:564
* @route '/donasi/{donasi}/payment'
*/
storePayment.post = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePayment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::storePayment
* @see app/Http/Controllers/DonasiController.php:564
* @route '/donasi/{donasi}/payment'
*/
const storePaymentForm = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storePayment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::storePayment
* @see app/Http/Controllers/DonasiController.php:564
* @route '/donasi/{donasi}/payment'
*/
storePaymentForm.post = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storePayment.url(args, options),
    method: 'post',
})

storePayment.form = storePaymentForm

/**
* @see \App\Http\Controllers\DonasiController::storeKomentar
* @see app/Http/Controllers/DonasiController.php:415
* @route '/donasi/{donasi}/komentar'
*/
export const storeKomentar = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeKomentar.url(args, options),
    method: 'post',
})

storeKomentar.definition = {
    methods: ["post"],
    url: '/donasi/{donasi}/komentar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DonasiController::storeKomentar
* @see app/Http/Controllers/DonasiController.php:415
* @route '/donasi/{donasi}/komentar'
*/
storeKomentar.url = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { donasi: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { donasi: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            donasi: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        donasi: typeof args.donasi === 'object'
        ? args.donasi.slug
        : args.donasi,
    }

    return storeKomentar.definition.url
            .replace('{donasi}', parsedArgs.donasi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::storeKomentar
* @see app/Http/Controllers/DonasiController.php:415
* @route '/donasi/{donasi}/komentar'
*/
storeKomentar.post = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeKomentar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::storeKomentar
* @see app/Http/Controllers/DonasiController.php:415
* @route '/donasi/{donasi}/komentar'
*/
const storeKomentarForm = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeKomentar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::storeKomentar
* @see app/Http/Controllers/DonasiController.php:415
* @route '/donasi/{donasi}/komentar'
*/
storeKomentarForm.post = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeKomentar.url(args, options),
    method: 'post',
})

storeKomentar.form = storeKomentarForm

/**
* @see \App\Http\Controllers\DonasiController::storeReaksi
* @see app/Http/Controllers/DonasiController.php:462
* @route '/donasi/{donasi}/reaksi'
*/
export const storeReaksi = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeReaksi.url(args, options),
    method: 'post',
})

storeReaksi.definition = {
    methods: ["post"],
    url: '/donasi/{donasi}/reaksi',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DonasiController::storeReaksi
* @see app/Http/Controllers/DonasiController.php:462
* @route '/donasi/{donasi}/reaksi'
*/
storeReaksi.url = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { donasi: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { donasi: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            donasi: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        donasi: typeof args.donasi === 'object'
        ? args.donasi.slug
        : args.donasi,
    }

    return storeReaksi.definition.url
            .replace('{donasi}', parsedArgs.donasi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::storeReaksi
* @see app/Http/Controllers/DonasiController.php:462
* @route '/donasi/{donasi}/reaksi'
*/
storeReaksi.post = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeReaksi.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::storeReaksi
* @see app/Http/Controllers/DonasiController.php:462
* @route '/donasi/{donasi}/reaksi'
*/
const storeReaksiForm = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeReaksi.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::storeReaksi
* @see app/Http/Controllers/DonasiController.php:462
* @route '/donasi/{donasi}/reaksi'
*/
storeReaksiForm.post = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeReaksi.url(args, options),
    method: 'post',
})

storeReaksi.form = storeReaksiForm

/**
* @see \App\Http\Controllers\DonasiController::index
* @see app/Http/Controllers/DonasiController.php:60
* @route '/admin/donasi'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/donasi',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DonasiController::index
* @see app/Http/Controllers/DonasiController.php:60
* @route '/admin/donasi'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::index
* @see app/Http/Controllers/DonasiController.php:60
* @route '/admin/donasi'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::index
* @see app/Http/Controllers/DonasiController.php:60
* @route '/admin/donasi'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DonasiController::index
* @see app/Http/Controllers/DonasiController.php:60
* @route '/admin/donasi'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::index
* @see app/Http/Controllers/DonasiController.php:60
* @route '/admin/donasi'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::index
* @see app/Http/Controllers/DonasiController.php:60
* @route '/admin/donasi'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\DonasiController::create
* @see app/Http/Controllers/DonasiController.php:88
* @route '/admin/donasi/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/donasi/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DonasiController::create
* @see app/Http/Controllers/DonasiController.php:88
* @route '/admin/donasi/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::create
* @see app/Http/Controllers/DonasiController.php:88
* @route '/admin/donasi/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::create
* @see app/Http/Controllers/DonasiController.php:88
* @route '/admin/donasi/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DonasiController::create
* @see app/Http/Controllers/DonasiController.php:88
* @route '/admin/donasi/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::create
* @see app/Http/Controllers/DonasiController.php:88
* @route '/admin/donasi/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::create
* @see app/Http/Controllers/DonasiController.php:88
* @route '/admin/donasi/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\DonasiController::store
* @see app/Http/Controllers/DonasiController.php:93
* @route '/admin/donasi'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/donasi',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DonasiController::store
* @see app/Http/Controllers/DonasiController.php:93
* @route '/admin/donasi'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::store
* @see app/Http/Controllers/DonasiController.php:93
* @route '/admin/donasi'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::store
* @see app/Http/Controllers/DonasiController.php:93
* @route '/admin/donasi'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::store
* @see app/Http/Controllers/DonasiController.php:93
* @route '/admin/donasi'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\DonasiController::edit
* @see app/Http/Controllers/DonasiController.php:115
* @route '/admin/donasi/{donasi}/edit'
*/
export const edit = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/donasi/{donasi}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DonasiController::edit
* @see app/Http/Controllers/DonasiController.php:115
* @route '/admin/donasi/{donasi}/edit'
*/
edit.url = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { donasi: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { donasi: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            donasi: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        donasi: typeof args.donasi === 'object'
        ? args.donasi.slug
        : args.donasi,
    }

    return edit.definition.url
            .replace('{donasi}', parsedArgs.donasi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::edit
* @see app/Http/Controllers/DonasiController.php:115
* @route '/admin/donasi/{donasi}/edit'
*/
edit.get = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::edit
* @see app/Http/Controllers/DonasiController.php:115
* @route '/admin/donasi/{donasi}/edit'
*/
edit.head = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DonasiController::edit
* @see app/Http/Controllers/DonasiController.php:115
* @route '/admin/donasi/{donasi}/edit'
*/
const editForm = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::edit
* @see app/Http/Controllers/DonasiController.php:115
* @route '/admin/donasi/{donasi}/edit'
*/
editForm.get = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::edit
* @see app/Http/Controllers/DonasiController.php:115
* @route '/admin/donasi/{donasi}/edit'
*/
editForm.head = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\DonasiController::update
* @see app/Http/Controllers/DonasiController.php:130
* @route '/admin/donasi/{donasi}'
*/
export const update = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/donasi/{donasi}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\DonasiController::update
* @see app/Http/Controllers/DonasiController.php:130
* @route '/admin/donasi/{donasi}'
*/
update.url = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { donasi: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { donasi: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            donasi: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        donasi: typeof args.donasi === 'object'
        ? args.donasi.slug
        : args.donasi,
    }

    return update.definition.url
            .replace('{donasi}', parsedArgs.donasi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::update
* @see app/Http/Controllers/DonasiController.php:130
* @route '/admin/donasi/{donasi}'
*/
update.put = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\DonasiController::update
* @see app/Http/Controllers/DonasiController.php:130
* @route '/admin/donasi/{donasi}'
*/
const updateForm = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::update
* @see app/Http/Controllers/DonasiController.php:130
* @route '/admin/donasi/{donasi}'
*/
updateForm.put = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\DonasiController::progress
* @see app/Http/Controllers/DonasiController.php:160
* @route '/admin/donasi/{donasi}/progress'
*/
export const progress = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: progress.url(args, options),
    method: 'get',
})

progress.definition = {
    methods: ["get","head"],
    url: '/admin/donasi/{donasi}/progress',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DonasiController::progress
* @see app/Http/Controllers/DonasiController.php:160
* @route '/admin/donasi/{donasi}/progress'
*/
progress.url = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { donasi: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { donasi: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            donasi: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        donasi: typeof args.donasi === 'object'
        ? args.donasi.slug
        : args.donasi,
    }

    return progress.definition.url
            .replace('{donasi}', parsedArgs.donasi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::progress
* @see app/Http/Controllers/DonasiController.php:160
* @route '/admin/donasi/{donasi}/progress'
*/
progress.get = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: progress.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::progress
* @see app/Http/Controllers/DonasiController.php:160
* @route '/admin/donasi/{donasi}/progress'
*/
progress.head = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: progress.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DonasiController::progress
* @see app/Http/Controllers/DonasiController.php:160
* @route '/admin/donasi/{donasi}/progress'
*/
const progressForm = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: progress.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::progress
* @see app/Http/Controllers/DonasiController.php:160
* @route '/admin/donasi/{donasi}/progress'
*/
progressForm.get = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: progress.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::progress
* @see app/Http/Controllers/DonasiController.php:160
* @route '/admin/donasi/{donasi}/progress'
*/
progressForm.head = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: progress.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

progress.form = progressForm

/**
* @see \App\Http\Controllers\DonasiController::updateProgress
* @see app/Http/Controllers/DonasiController.php:175
* @route '/admin/donasi/{donasi}/progress'
*/
export const updateProgress = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateProgress.url(args, options),
    method: 'put',
})

updateProgress.definition = {
    methods: ["put"],
    url: '/admin/donasi/{donasi}/progress',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\DonasiController::updateProgress
* @see app/Http/Controllers/DonasiController.php:175
* @route '/admin/donasi/{donasi}/progress'
*/
updateProgress.url = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { donasi: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { donasi: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            donasi: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        donasi: typeof args.donasi === 'object'
        ? args.donasi.slug
        : args.donasi,
    }

    return updateProgress.definition.url
            .replace('{donasi}', parsedArgs.donasi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::updateProgress
* @see app/Http/Controllers/DonasiController.php:175
* @route '/admin/donasi/{donasi}/progress'
*/
updateProgress.put = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateProgress.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\DonasiController::updateProgress
* @see app/Http/Controllers/DonasiController.php:175
* @route '/admin/donasi/{donasi}/progress'
*/
const updateProgressForm = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateProgress.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::updateProgress
* @see app/Http/Controllers/DonasiController.php:175
* @route '/admin/donasi/{donasi}/progress'
*/
updateProgressForm.put = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateProgress.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateProgress.form = updateProgressForm

/**
* @see \App\Http\Controllers\DonasiController::reaksi
* @see app/Http/Controllers/DonasiController.php:194
* @route '/admin/donasi/{donasi}/reaksi'
*/
export const reaksi = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reaksi.url(args, options),
    method: 'get',
})

reaksi.definition = {
    methods: ["get","head"],
    url: '/admin/donasi/{donasi}/reaksi',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DonasiController::reaksi
* @see app/Http/Controllers/DonasiController.php:194
* @route '/admin/donasi/{donasi}/reaksi'
*/
reaksi.url = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { donasi: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { donasi: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            donasi: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        donasi: typeof args.donasi === 'object'
        ? args.donasi.slug
        : args.donasi,
    }

    return reaksi.definition.url
            .replace('{donasi}', parsedArgs.donasi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::reaksi
* @see app/Http/Controllers/DonasiController.php:194
* @route '/admin/donasi/{donasi}/reaksi'
*/
reaksi.get = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reaksi.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::reaksi
* @see app/Http/Controllers/DonasiController.php:194
* @route '/admin/donasi/{donasi}/reaksi'
*/
reaksi.head = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reaksi.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DonasiController::reaksi
* @see app/Http/Controllers/DonasiController.php:194
* @route '/admin/donasi/{donasi}/reaksi'
*/
const reaksiForm = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: reaksi.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::reaksi
* @see app/Http/Controllers/DonasiController.php:194
* @route '/admin/donasi/{donasi}/reaksi'
*/
reaksiForm.get = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: reaksi.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::reaksi
* @see app/Http/Controllers/DonasiController.php:194
* @route '/admin/donasi/{donasi}/reaksi'
*/
reaksiForm.head = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: reaksi.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

reaksi.form = reaksiForm

/**
* @see \App\Http\Controllers\DonasiController::komentar
* @see app/Http/Controllers/DonasiController.php:228
* @route '/admin/donasi/{donasi}/komentar'
*/
export const komentar = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: komentar.url(args, options),
    method: 'get',
})

komentar.definition = {
    methods: ["get","head"],
    url: '/admin/donasi/{donasi}/komentar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DonasiController::komentar
* @see app/Http/Controllers/DonasiController.php:228
* @route '/admin/donasi/{donasi}/komentar'
*/
komentar.url = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { donasi: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { donasi: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            donasi: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        donasi: typeof args.donasi === 'object'
        ? args.donasi.slug
        : args.donasi,
    }

    return komentar.definition.url
            .replace('{donasi}', parsedArgs.donasi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::komentar
* @see app/Http/Controllers/DonasiController.php:228
* @route '/admin/donasi/{donasi}/komentar'
*/
komentar.get = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: komentar.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::komentar
* @see app/Http/Controllers/DonasiController.php:228
* @route '/admin/donasi/{donasi}/komentar'
*/
komentar.head = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: komentar.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DonasiController::komentar
* @see app/Http/Controllers/DonasiController.php:228
* @route '/admin/donasi/{donasi}/komentar'
*/
const komentarForm = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: komentar.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::komentar
* @see app/Http/Controllers/DonasiController.php:228
* @route '/admin/donasi/{donasi}/komentar'
*/
komentarForm.get = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: komentar.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::komentar
* @see app/Http/Controllers/DonasiController.php:228
* @route '/admin/donasi/{donasi}/komentar'
*/
komentarForm.head = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: komentar.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

komentar.form = komentarForm

/**
* @see \App\Http\Controllers\DonasiController::donasiMasuk
* @see app/Http/Controllers/DonasiController.php:263
* @route '/admin/donasi/{donasi}/donasi-masuk'
*/
export const donasiMasuk = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: donasiMasuk.url(args, options),
    method: 'get',
})

donasiMasuk.definition = {
    methods: ["get","head"],
    url: '/admin/donasi/{donasi}/donasi-masuk',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DonasiController::donasiMasuk
* @see app/Http/Controllers/DonasiController.php:263
* @route '/admin/donasi/{donasi}/donasi-masuk'
*/
donasiMasuk.url = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { donasi: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { donasi: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            donasi: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        donasi: typeof args.donasi === 'object'
        ? args.donasi.slug
        : args.donasi,
    }

    return donasiMasuk.definition.url
            .replace('{donasi}', parsedArgs.donasi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::donasiMasuk
* @see app/Http/Controllers/DonasiController.php:263
* @route '/admin/donasi/{donasi}/donasi-masuk'
*/
donasiMasuk.get = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: donasiMasuk.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::donasiMasuk
* @see app/Http/Controllers/DonasiController.php:263
* @route '/admin/donasi/{donasi}/donasi-masuk'
*/
donasiMasuk.head = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: donasiMasuk.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DonasiController::donasiMasuk
* @see app/Http/Controllers/DonasiController.php:263
* @route '/admin/donasi/{donasi}/donasi-masuk'
*/
const donasiMasukForm = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: donasiMasuk.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::donasiMasuk
* @see app/Http/Controllers/DonasiController.php:263
* @route '/admin/donasi/{donasi}/donasi-masuk'
*/
donasiMasukForm.get = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: donasiMasuk.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::donasiMasuk
* @see app/Http/Controllers/DonasiController.php:263
* @route '/admin/donasi/{donasi}/donasi-masuk'
*/
donasiMasukForm.head = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: donasiMasuk.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

donasiMasuk.form = donasiMasukForm

/**
* @see \App\Http\Controllers\DonasiController::storeBulkDonasi
* @see app/Http/Controllers/DonasiController.php:656
* @route '/admin/donasi/{donasi}/bulk-donasi'
*/
export const storeBulkDonasi = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeBulkDonasi.url(args, options),
    method: 'post',
})

storeBulkDonasi.definition = {
    methods: ["post"],
    url: '/admin/donasi/{donasi}/bulk-donasi',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DonasiController::storeBulkDonasi
* @see app/Http/Controllers/DonasiController.php:656
* @route '/admin/donasi/{donasi}/bulk-donasi'
*/
storeBulkDonasi.url = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { donasi: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { donasi: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            donasi: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        donasi: typeof args.donasi === 'object'
        ? args.donasi.slug
        : args.donasi,
    }

    return storeBulkDonasi.definition.url
            .replace('{donasi}', parsedArgs.donasi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::storeBulkDonasi
* @see app/Http/Controllers/DonasiController.php:656
* @route '/admin/donasi/{donasi}/bulk-donasi'
*/
storeBulkDonasi.post = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeBulkDonasi.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::storeBulkDonasi
* @see app/Http/Controllers/DonasiController.php:656
* @route '/admin/donasi/{donasi}/bulk-donasi'
*/
const storeBulkDonasiForm = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeBulkDonasi.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::storeBulkDonasi
* @see app/Http/Controllers/DonasiController.php:656
* @route '/admin/donasi/{donasi}/bulk-donasi'
*/
storeBulkDonasiForm.post = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeBulkDonasi.url(args, options),
    method: 'post',
})

storeBulkDonasi.form = storeBulkDonasiForm

/**
* @see \App\Http\Controllers\DonasiController::tasyaruf
* @see app/Http/Controllers/DonasiController.php:299
* @route '/admin/donasi/{donasi}/tasyaruf'
*/
export const tasyaruf = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tasyaruf.url(args, options),
    method: 'get',
})

tasyaruf.definition = {
    methods: ["get","head"],
    url: '/admin/donasi/{donasi}/tasyaruf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DonasiController::tasyaruf
* @see app/Http/Controllers/DonasiController.php:299
* @route '/admin/donasi/{donasi}/tasyaruf'
*/
tasyaruf.url = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { donasi: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { donasi: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            donasi: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        donasi: typeof args.donasi === 'object'
        ? args.donasi.slug
        : args.donasi,
    }

    return tasyaruf.definition.url
            .replace('{donasi}', parsedArgs.donasi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::tasyaruf
* @see app/Http/Controllers/DonasiController.php:299
* @route '/admin/donasi/{donasi}/tasyaruf'
*/
tasyaruf.get = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tasyaruf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::tasyaruf
* @see app/Http/Controllers/DonasiController.php:299
* @route '/admin/donasi/{donasi}/tasyaruf'
*/
tasyaruf.head = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: tasyaruf.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DonasiController::tasyaruf
* @see app/Http/Controllers/DonasiController.php:299
* @route '/admin/donasi/{donasi}/tasyaruf'
*/
const tasyarufForm = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tasyaruf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::tasyaruf
* @see app/Http/Controllers/DonasiController.php:299
* @route '/admin/donasi/{donasi}/tasyaruf'
*/
tasyarufForm.get = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tasyaruf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::tasyaruf
* @see app/Http/Controllers/DonasiController.php:299
* @route '/admin/donasi/{donasi}/tasyaruf'
*/
tasyarufForm.head = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tasyaruf.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

tasyaruf.form = tasyarufForm

/**
* @see \App\Http\Controllers\DonasiController::storeTasyaruf
* @see app/Http/Controllers/DonasiController.php:319
* @route '/admin/donasi/{donasi}/tasyaruf'
*/
export const storeTasyaruf = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTasyaruf.url(args, options),
    method: 'post',
})

storeTasyaruf.definition = {
    methods: ["post"],
    url: '/admin/donasi/{donasi}/tasyaruf',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DonasiController::storeTasyaruf
* @see app/Http/Controllers/DonasiController.php:319
* @route '/admin/donasi/{donasi}/tasyaruf'
*/
storeTasyaruf.url = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { donasi: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { donasi: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            donasi: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        donasi: typeof args.donasi === 'object'
        ? args.donasi.slug
        : args.donasi,
    }

    return storeTasyaruf.definition.url
            .replace('{donasi}', parsedArgs.donasi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::storeTasyaruf
* @see app/Http/Controllers/DonasiController.php:319
* @route '/admin/donasi/{donasi}/tasyaruf'
*/
storeTasyaruf.post = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTasyaruf.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::storeTasyaruf
* @see app/Http/Controllers/DonasiController.php:319
* @route '/admin/donasi/{donasi}/tasyaruf'
*/
const storeTasyarufForm = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeTasyaruf.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::storeTasyaruf
* @see app/Http/Controllers/DonasiController.php:319
* @route '/admin/donasi/{donasi}/tasyaruf'
*/
storeTasyarufForm.post = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeTasyaruf.url(args, options),
    method: 'post',
})

storeTasyaruf.form = storeTasyarufForm

/**
* @see \App\Http\Controllers\DonasiController::destroy
* @see app/Http/Controllers/DonasiController.php:509
* @route '/admin/donasi/{donasi}'
*/
export const destroy = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/donasi/{donasi}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DonasiController::destroy
* @see app/Http/Controllers/DonasiController.php:509
* @route '/admin/donasi/{donasi}'
*/
destroy.url = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { donasi: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { donasi: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            donasi: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        donasi: typeof args.donasi === 'object'
        ? args.donasi.slug
        : args.donasi,
    }

    return destroy.definition.url
            .replace('{donasi}', parsedArgs.donasi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::destroy
* @see app/Http/Controllers/DonasiController.php:509
* @route '/admin/donasi/{donasi}'
*/
destroy.delete = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\DonasiController::destroy
* @see app/Http/Controllers/DonasiController.php:509
* @route '/admin/donasi/{donasi}'
*/
const destroyForm = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::destroy
* @see app/Http/Controllers/DonasiController.php:509
* @route '/admin/donasi/{donasi}'
*/
destroyForm.delete = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\DonasiController::toggleStatus
* @see app/Http/Controllers/DonasiController.php:749
* @route '/admin/payment/{payment}/toggle-status'
*/
export const toggleStatus = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

toggleStatus.definition = {
    methods: ["put"],
    url: '/admin/payment/{payment}/toggle-status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\DonasiController::toggleStatus
* @see app/Http/Controllers/DonasiController.php:749
* @route '/admin/payment/{payment}/toggle-status'
*/
toggleStatus.url = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { payment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            payment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payment: typeof args.payment === 'object'
        ? args.payment.id
        : args.payment,
    }

    return toggleStatus.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::toggleStatus
* @see app/Http/Controllers/DonasiController.php:749
* @route '/admin/payment/{payment}/toggle-status'
*/
toggleStatus.put = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleStatus.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\DonasiController::toggleStatus
* @see app/Http/Controllers/DonasiController.php:749
* @route '/admin/payment/{payment}/toggle-status'
*/
const toggleStatusForm = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleStatus.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::toggleStatus
* @see app/Http/Controllers/DonasiController.php:749
* @route '/admin/payment/{payment}/toggle-status'
*/
toggleStatusForm.put = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleStatus.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

toggleStatus.form = toggleStatusForm

/**
* @see \App\Http\Controllers\DonasiController::show
* @see app/Http/Controllers/DonasiController.php:381
* @route '/donasi/{donasi}'
*/
export const show = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/donasi/{donasi}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DonasiController::show
* @see app/Http/Controllers/DonasiController.php:381
* @route '/donasi/{donasi}'
*/
show.url = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { donasi: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { donasi: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            donasi: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        donasi: typeof args.donasi === 'object'
        ? args.donasi.slug
        : args.donasi,
    }

    return show.definition.url
            .replace('{donasi}', parsedArgs.donasi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::show
* @see app/Http/Controllers/DonasiController.php:381
* @route '/donasi/{donasi}'
*/
show.get = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::show
* @see app/Http/Controllers/DonasiController.php:381
* @route '/donasi/{donasi}'
*/
show.head = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DonasiController::show
* @see app/Http/Controllers/DonasiController.php:381
* @route '/donasi/{donasi}'
*/
const showForm = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::show
* @see app/Http/Controllers/DonasiController.php:381
* @route '/donasi/{donasi}'
*/
showForm.get = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::show
* @see app/Http/Controllers/DonasiController.php:381
* @route '/donasi/{donasi}'
*/
showForm.head = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\DonasiController::generateMayarLink
* @see app/Http/Controllers/DonasiController.php:761
* @route '/payment/{payment}/mayar'
*/
export const generateMayarLink = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateMayarLink.url(args, options),
    method: 'post',
})

generateMayarLink.definition = {
    methods: ["post"],
    url: '/payment/{payment}/mayar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DonasiController::generateMayarLink
* @see app/Http/Controllers/DonasiController.php:761
* @route '/payment/{payment}/mayar'
*/
generateMayarLink.url = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { payment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            payment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payment: typeof args.payment === 'object'
        ? args.payment.id
        : args.payment,
    }

    return generateMayarLink.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::generateMayarLink
* @see app/Http/Controllers/DonasiController.php:761
* @route '/payment/{payment}/mayar'
*/
generateMayarLink.post = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateMayarLink.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::generateMayarLink
* @see app/Http/Controllers/DonasiController.php:761
* @route '/payment/{payment}/mayar'
*/
const generateMayarLinkForm = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: generateMayarLink.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::generateMayarLink
* @see app/Http/Controllers/DonasiController.php:761
* @route '/payment/{payment}/mayar'
*/
generateMayarLinkForm.post = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: generateMayarLink.url(args, options),
    method: 'post',
})

generateMayarLink.form = generateMayarLinkForm

const DonasiController = { donasi, uploadBuktiSusulan, payment, storePayment, storeKomentar, storeReaksi, index, create, store, edit, update, progress, updateProgress, reaksi, komentar, donasiMasuk, storeBulkDonasi, tasyaruf, storeTasyaruf, destroy, toggleStatus, show, generateMayarLink }

export default DonasiController