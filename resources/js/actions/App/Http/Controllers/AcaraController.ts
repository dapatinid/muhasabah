import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AcaraController::acara
* @see app/Http/Controllers/AcaraController.php:20
* @route '/acara'
*/
export const acara = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: acara.url(options),
    method: 'get',
})

acara.definition = {
    methods: ["get","head"],
    url: '/acara',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AcaraController::acara
* @see app/Http/Controllers/AcaraController.php:20
* @route '/acara'
*/
acara.url = (options?: RouteQueryOptions) => {
    return acara.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcaraController::acara
* @see app/Http/Controllers/AcaraController.php:20
* @route '/acara'
*/
acara.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: acara.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::acara
* @see app/Http/Controllers/AcaraController.php:20
* @route '/acara'
*/
acara.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: acara.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AcaraController::acara
* @see app/Http/Controllers/AcaraController.php:20
* @route '/acara'
*/
const acaraForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: acara.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::acara
* @see app/Http/Controllers/AcaraController.php:20
* @route '/acara'
*/
acaraForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: acara.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::acara
* @see app/Http/Controllers/AcaraController.php:20
* @route '/acara'
*/
acaraForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: acara.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

acara.form = acaraForm

/**
* @see \App\Http\Controllers\AcaraController::payment
* @see app/Http/Controllers/AcaraController.php:546
* @route '/acara/{acara}/payment'
*/
export const payment = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payment.url(args, options),
    method: 'get',
})

payment.definition = {
    methods: ["get","head"],
    url: '/acara/{acara}/payment',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AcaraController::payment
* @see app/Http/Controllers/AcaraController.php:546
* @route '/acara/{acara}/payment'
*/
payment.url = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { acara: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { acara: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            acara: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        acara: typeof args.acara === 'object'
        ? args.acara.slug
        : args.acara,
    }

    return payment.definition.url
            .replace('{acara}', parsedArgs.acara.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcaraController::payment
* @see app/Http/Controllers/AcaraController.php:546
* @route '/acara/{acara}/payment'
*/
payment.get = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payment.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::payment
* @see app/Http/Controllers/AcaraController.php:546
* @route '/acara/{acara}/payment'
*/
payment.head = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payment.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AcaraController::payment
* @see app/Http/Controllers/AcaraController.php:546
* @route '/acara/{acara}/payment'
*/
const paymentForm = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payment.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::payment
* @see app/Http/Controllers/AcaraController.php:546
* @route '/acara/{acara}/payment'
*/
paymentForm.get = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payment.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::payment
* @see app/Http/Controllers/AcaraController.php:546
* @route '/acara/{acara}/payment'
*/
paymentForm.head = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\AcaraController::storePayment
* @see app/Http/Controllers/AcaraController.php:559
* @route '/acara/{acara}/payment'
*/
export const storePayment = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePayment.url(args, options),
    method: 'post',
})

storePayment.definition = {
    methods: ["post"],
    url: '/acara/{acara}/payment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AcaraController::storePayment
* @see app/Http/Controllers/AcaraController.php:559
* @route '/acara/{acara}/payment'
*/
storePayment.url = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { acara: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { acara: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            acara: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        acara: typeof args.acara === 'object'
        ? args.acara.slug
        : args.acara,
    }

    return storePayment.definition.url
            .replace('{acara}', parsedArgs.acara.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcaraController::storePayment
* @see app/Http/Controllers/AcaraController.php:559
* @route '/acara/{acara}/payment'
*/
storePayment.post = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePayment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcaraController::storePayment
* @see app/Http/Controllers/AcaraController.php:559
* @route '/acara/{acara}/payment'
*/
const storePaymentForm = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storePayment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcaraController::storePayment
* @see app/Http/Controllers/AcaraController.php:559
* @route '/acara/{acara}/payment'
*/
storePaymentForm.post = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storePayment.url(args, options),
    method: 'post',
})

storePayment.form = storePaymentForm

/**
* @see \App\Http\Controllers\AcaraController::storeKomentar
* @see app/Http/Controllers/AcaraController.php:492
* @route '/acara/{acara}/komentar'
*/
export const storeKomentar = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeKomentar.url(args, options),
    method: 'post',
})

storeKomentar.definition = {
    methods: ["post"],
    url: '/acara/{acara}/komentar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AcaraController::storeKomentar
* @see app/Http/Controllers/AcaraController.php:492
* @route '/acara/{acara}/komentar'
*/
storeKomentar.url = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { acara: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { acara: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            acara: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        acara: typeof args.acara === 'object'
        ? args.acara.slug
        : args.acara,
    }

    return storeKomentar.definition.url
            .replace('{acara}', parsedArgs.acara.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcaraController::storeKomentar
* @see app/Http/Controllers/AcaraController.php:492
* @route '/acara/{acara}/komentar'
*/
storeKomentar.post = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeKomentar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcaraController::storeKomentar
* @see app/Http/Controllers/AcaraController.php:492
* @route '/acara/{acara}/komentar'
*/
const storeKomentarForm = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeKomentar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcaraController::storeKomentar
* @see app/Http/Controllers/AcaraController.php:492
* @route '/acara/{acara}/komentar'
*/
storeKomentarForm.post = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeKomentar.url(args, options),
    method: 'post',
})

storeKomentar.form = storeKomentarForm

/**
* @see \App\Http\Controllers\AcaraController::storeReaksi
* @see app/Http/Controllers/AcaraController.php:519
* @route '/acara/{acara}/reaksi'
*/
export const storeReaksi = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeReaksi.url(args, options),
    method: 'post',
})

storeReaksi.definition = {
    methods: ["post"],
    url: '/acara/{acara}/reaksi',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AcaraController::storeReaksi
* @see app/Http/Controllers/AcaraController.php:519
* @route '/acara/{acara}/reaksi'
*/
storeReaksi.url = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { acara: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { acara: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            acara: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        acara: typeof args.acara === 'object'
        ? args.acara.slug
        : args.acara,
    }

    return storeReaksi.definition.url
            .replace('{acara}', parsedArgs.acara.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcaraController::storeReaksi
* @see app/Http/Controllers/AcaraController.php:519
* @route '/acara/{acara}/reaksi'
*/
storeReaksi.post = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeReaksi.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcaraController::storeReaksi
* @see app/Http/Controllers/AcaraController.php:519
* @route '/acara/{acara}/reaksi'
*/
const storeReaksiForm = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeReaksi.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcaraController::storeReaksi
* @see app/Http/Controllers/AcaraController.php:519
* @route '/acara/{acara}/reaksi'
*/
storeReaksiForm.post = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeReaksi.url(args, options),
    method: 'post',
})

storeReaksi.form = storeReaksiForm

/**
* @see \App\Http\Controllers\AcaraController::index
* @see app/Http/Controllers/AcaraController.php:51
* @route '/admin/acara'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/acara',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AcaraController::index
* @see app/Http/Controllers/AcaraController.php:51
* @route '/admin/acara'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcaraController::index
* @see app/Http/Controllers/AcaraController.php:51
* @route '/admin/acara'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::index
* @see app/Http/Controllers/AcaraController.php:51
* @route '/admin/acara'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AcaraController::index
* @see app/Http/Controllers/AcaraController.php:51
* @route '/admin/acara'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::index
* @see app/Http/Controllers/AcaraController.php:51
* @route '/admin/acara'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::index
* @see app/Http/Controllers/AcaraController.php:51
* @route '/admin/acara'
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
* @see \App\Http\Controllers\AcaraController::create
* @see app/Http/Controllers/AcaraController.php:81
* @route '/admin/acara/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/acara/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AcaraController::create
* @see app/Http/Controllers/AcaraController.php:81
* @route '/admin/acara/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcaraController::create
* @see app/Http/Controllers/AcaraController.php:81
* @route '/admin/acara/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::create
* @see app/Http/Controllers/AcaraController.php:81
* @route '/admin/acara/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AcaraController::create
* @see app/Http/Controllers/AcaraController.php:81
* @route '/admin/acara/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::create
* @see app/Http/Controllers/AcaraController.php:81
* @route '/admin/acara/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::create
* @see app/Http/Controllers/AcaraController.php:81
* @route '/admin/acara/create'
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
* @see \App\Http\Controllers\AcaraController::store
* @see app/Http/Controllers/AcaraController.php:87
* @route '/admin/acara'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/acara',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AcaraController::store
* @see app/Http/Controllers/AcaraController.php:87
* @route '/admin/acara'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcaraController::store
* @see app/Http/Controllers/AcaraController.php:87
* @route '/admin/acara'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcaraController::store
* @see app/Http/Controllers/AcaraController.php:87
* @route '/admin/acara'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcaraController::store
* @see app/Http/Controllers/AcaraController.php:87
* @route '/admin/acara'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\AcaraController::edit
* @see app/Http/Controllers/AcaraController.php:125
* @route '/admin/acara/{acara}/edit'
*/
export const edit = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/acara/{acara}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AcaraController::edit
* @see app/Http/Controllers/AcaraController.php:125
* @route '/admin/acara/{acara}/edit'
*/
edit.url = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { acara: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { acara: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            acara: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        acara: typeof args.acara === 'object'
        ? args.acara.slug
        : args.acara,
    }

    return edit.definition.url
            .replace('{acara}', parsedArgs.acara.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcaraController::edit
* @see app/Http/Controllers/AcaraController.php:125
* @route '/admin/acara/{acara}/edit'
*/
edit.get = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::edit
* @see app/Http/Controllers/AcaraController.php:125
* @route '/admin/acara/{acara}/edit'
*/
edit.head = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AcaraController::edit
* @see app/Http/Controllers/AcaraController.php:125
* @route '/admin/acara/{acara}/edit'
*/
const editForm = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::edit
* @see app/Http/Controllers/AcaraController.php:125
* @route '/admin/acara/{acara}/edit'
*/
editForm.get = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::edit
* @see app/Http/Controllers/AcaraController.php:125
* @route '/admin/acara/{acara}/edit'
*/
editForm.head = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\AcaraController::update
* @see app/Http/Controllers/AcaraController.php:142
* @route '/admin/acara/{acara}'
*/
export const update = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/acara/{acara}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AcaraController::update
* @see app/Http/Controllers/AcaraController.php:142
* @route '/admin/acara/{acara}'
*/
update.url = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { acara: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { acara: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            acara: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        acara: typeof args.acara === 'object'
        ? args.acara.slug
        : args.acara,
    }

    return update.definition.url
            .replace('{acara}', parsedArgs.acara.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcaraController::update
* @see app/Http/Controllers/AcaraController.php:142
* @route '/admin/acara/{acara}'
*/
update.put = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\AcaraController::update
* @see app/Http/Controllers/AcaraController.php:142
* @route '/admin/acara/{acara}'
*/
const updateForm = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcaraController::update
* @see app/Http/Controllers/AcaraController.php:142
* @route '/admin/acara/{acara}'
*/
updateForm.put = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\AcaraController::progress
* @see app/Http/Controllers/AcaraController.php:195
* @route '/admin/acara/{acara}/progress'
*/
export const progress = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: progress.url(args, options),
    method: 'get',
})

progress.definition = {
    methods: ["get","head"],
    url: '/admin/acara/{acara}/progress',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AcaraController::progress
* @see app/Http/Controllers/AcaraController.php:195
* @route '/admin/acara/{acara}/progress'
*/
progress.url = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { acara: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { acara: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            acara: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        acara: typeof args.acara === 'object'
        ? args.acara.slug
        : args.acara,
    }

    return progress.definition.url
            .replace('{acara}', parsedArgs.acara.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcaraController::progress
* @see app/Http/Controllers/AcaraController.php:195
* @route '/admin/acara/{acara}/progress'
*/
progress.get = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: progress.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::progress
* @see app/Http/Controllers/AcaraController.php:195
* @route '/admin/acara/{acara}/progress'
*/
progress.head = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: progress.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AcaraController::progress
* @see app/Http/Controllers/AcaraController.php:195
* @route '/admin/acara/{acara}/progress'
*/
const progressForm = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: progress.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::progress
* @see app/Http/Controllers/AcaraController.php:195
* @route '/admin/acara/{acara}/progress'
*/
progressForm.get = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: progress.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::progress
* @see app/Http/Controllers/AcaraController.php:195
* @route '/admin/acara/{acara}/progress'
*/
progressForm.head = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\AcaraController::updateProgress
* @see app/Http/Controllers/AcaraController.php:207
* @route '/admin/acara/{acara}/progress'
*/
export const updateProgress = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateProgress.url(args, options),
    method: 'put',
})

updateProgress.definition = {
    methods: ["put"],
    url: '/admin/acara/{acara}/progress',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AcaraController::updateProgress
* @see app/Http/Controllers/AcaraController.php:207
* @route '/admin/acara/{acara}/progress'
*/
updateProgress.url = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { acara: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { acara: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            acara: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        acara: typeof args.acara === 'object'
        ? args.acara.slug
        : args.acara,
    }

    return updateProgress.definition.url
            .replace('{acara}', parsedArgs.acara.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcaraController::updateProgress
* @see app/Http/Controllers/AcaraController.php:207
* @route '/admin/acara/{acara}/progress'
*/
updateProgress.put = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateProgress.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\AcaraController::updateProgress
* @see app/Http/Controllers/AcaraController.php:207
* @route '/admin/acara/{acara}/progress'
*/
const updateProgressForm = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateProgress.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcaraController::updateProgress
* @see app/Http/Controllers/AcaraController.php:207
* @route '/admin/acara/{acara}/progress'
*/
updateProgressForm.put = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\AcaraController::reaksi
* @see app/Http/Controllers/AcaraController.php:220
* @route '/admin/acara/{acara}/reaksi'
*/
export const reaksi = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reaksi.url(args, options),
    method: 'get',
})

reaksi.definition = {
    methods: ["get","head"],
    url: '/admin/acara/{acara}/reaksi',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AcaraController::reaksi
* @see app/Http/Controllers/AcaraController.php:220
* @route '/admin/acara/{acara}/reaksi'
*/
reaksi.url = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { acara: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { acara: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            acara: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        acara: typeof args.acara === 'object'
        ? args.acara.slug
        : args.acara,
    }

    return reaksi.definition.url
            .replace('{acara}', parsedArgs.acara.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcaraController::reaksi
* @see app/Http/Controllers/AcaraController.php:220
* @route '/admin/acara/{acara}/reaksi'
*/
reaksi.get = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reaksi.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::reaksi
* @see app/Http/Controllers/AcaraController.php:220
* @route '/admin/acara/{acara}/reaksi'
*/
reaksi.head = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reaksi.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AcaraController::reaksi
* @see app/Http/Controllers/AcaraController.php:220
* @route '/admin/acara/{acara}/reaksi'
*/
const reaksiForm = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: reaksi.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::reaksi
* @see app/Http/Controllers/AcaraController.php:220
* @route '/admin/acara/{acara}/reaksi'
*/
reaksiForm.get = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: reaksi.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::reaksi
* @see app/Http/Controllers/AcaraController.php:220
* @route '/admin/acara/{acara}/reaksi'
*/
reaksiForm.head = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\AcaraController::komentar
* @see app/Http/Controllers/AcaraController.php:243
* @route '/admin/acara/{acara}/komentar'
*/
export const komentar = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: komentar.url(args, options),
    method: 'get',
})

komentar.definition = {
    methods: ["get","head"],
    url: '/admin/acara/{acara}/komentar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AcaraController::komentar
* @see app/Http/Controllers/AcaraController.php:243
* @route '/admin/acara/{acara}/komentar'
*/
komentar.url = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { acara: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { acara: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            acara: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        acara: typeof args.acara === 'object'
        ? args.acara.slug
        : args.acara,
    }

    return komentar.definition.url
            .replace('{acara}', parsedArgs.acara.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcaraController::komentar
* @see app/Http/Controllers/AcaraController.php:243
* @route '/admin/acara/{acara}/komentar'
*/
komentar.get = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: komentar.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::komentar
* @see app/Http/Controllers/AcaraController.php:243
* @route '/admin/acara/{acara}/komentar'
*/
komentar.head = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: komentar.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AcaraController::komentar
* @see app/Http/Controllers/AcaraController.php:243
* @route '/admin/acara/{acara}/komentar'
*/
const komentarForm = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: komentar.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::komentar
* @see app/Http/Controllers/AcaraController.php:243
* @route '/admin/acara/{acara}/komentar'
*/
komentarForm.get = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: komentar.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::komentar
* @see app/Http/Controllers/AcaraController.php:243
* @route '/admin/acara/{acara}/komentar'
*/
komentarForm.head = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\AcaraController::keuangan
* @see app/Http/Controllers/AcaraController.php:275
* @route '/admin/acara/{acara}/keuangan'
*/
export const keuangan = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: keuangan.url(args, options),
    method: 'get',
})

keuangan.definition = {
    methods: ["get","head"],
    url: '/admin/acara/{acara}/keuangan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AcaraController::keuangan
* @see app/Http/Controllers/AcaraController.php:275
* @route '/admin/acara/{acara}/keuangan'
*/
keuangan.url = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { acara: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { acara: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            acara: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        acara: typeof args.acara === 'object'
        ? args.acara.slug
        : args.acara,
    }

    return keuangan.definition.url
            .replace('{acara}', parsedArgs.acara.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcaraController::keuangan
* @see app/Http/Controllers/AcaraController.php:275
* @route '/admin/acara/{acara}/keuangan'
*/
keuangan.get = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: keuangan.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::keuangan
* @see app/Http/Controllers/AcaraController.php:275
* @route '/admin/acara/{acara}/keuangan'
*/
keuangan.head = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: keuangan.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AcaraController::keuangan
* @see app/Http/Controllers/AcaraController.php:275
* @route '/admin/acara/{acara}/keuangan'
*/
const keuanganForm = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: keuangan.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::keuangan
* @see app/Http/Controllers/AcaraController.php:275
* @route '/admin/acara/{acara}/keuangan'
*/
keuanganForm.get = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: keuangan.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::keuangan
* @see app/Http/Controllers/AcaraController.php:275
* @route '/admin/acara/{acara}/keuangan'
*/
keuanganForm.head = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: keuangan.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

keuangan.form = keuanganForm

/**
* @see \App\Http\Controllers\AcaraController::bulkKeuangan
* @see app/Http/Controllers/AcaraController.php:318
* @route '/admin/acara/{acara}/bulk-keuangan'
*/
export const bulkKeuangan = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkKeuangan.url(args, options),
    method: 'post',
})

bulkKeuangan.definition = {
    methods: ["post"],
    url: '/admin/acara/{acara}/bulk-keuangan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AcaraController::bulkKeuangan
* @see app/Http/Controllers/AcaraController.php:318
* @route '/admin/acara/{acara}/bulk-keuangan'
*/
bulkKeuangan.url = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { acara: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { acara: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            acara: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        acara: typeof args.acara === 'object'
        ? args.acara.slug
        : args.acara,
    }

    return bulkKeuangan.definition.url
            .replace('{acara}', parsedArgs.acara.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcaraController::bulkKeuangan
* @see app/Http/Controllers/AcaraController.php:318
* @route '/admin/acara/{acara}/bulk-keuangan'
*/
bulkKeuangan.post = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkKeuangan.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcaraController::bulkKeuangan
* @see app/Http/Controllers/AcaraController.php:318
* @route '/admin/acara/{acara}/bulk-keuangan'
*/
const bulkKeuanganForm = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkKeuangan.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcaraController::bulkKeuangan
* @see app/Http/Controllers/AcaraController.php:318
* @route '/admin/acara/{acara}/bulk-keuangan'
*/
bulkKeuanganForm.post = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkKeuangan.url(args, options),
    method: 'post',
})

bulkKeuangan.form = bulkKeuanganForm

/**
* @see \App\Http\Controllers\AcaraController::storeTasyaruf
* @see app/Http/Controllers/AcaraController.php:408
* @route '/admin/acara/{acara}/tasyaruf'
*/
export const storeTasyaruf = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTasyaruf.url(args, options),
    method: 'post',
})

storeTasyaruf.definition = {
    methods: ["post"],
    url: '/admin/acara/{acara}/tasyaruf',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AcaraController::storeTasyaruf
* @see app/Http/Controllers/AcaraController.php:408
* @route '/admin/acara/{acara}/tasyaruf'
*/
storeTasyaruf.url = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { acara: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { acara: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            acara: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        acara: typeof args.acara === 'object'
        ? args.acara.slug
        : args.acara,
    }

    return storeTasyaruf.definition.url
            .replace('{acara}', parsedArgs.acara.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcaraController::storeTasyaruf
* @see app/Http/Controllers/AcaraController.php:408
* @route '/admin/acara/{acara}/tasyaruf'
*/
storeTasyaruf.post = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTasyaruf.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcaraController::storeTasyaruf
* @see app/Http/Controllers/AcaraController.php:408
* @route '/admin/acara/{acara}/tasyaruf'
*/
const storeTasyarufForm = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeTasyaruf.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcaraController::storeTasyaruf
* @see app/Http/Controllers/AcaraController.php:408
* @route '/admin/acara/{acara}/tasyaruf'
*/
storeTasyarufForm.post = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeTasyaruf.url(args, options),
    method: 'post',
})

storeTasyaruf.form = storeTasyarufForm

/**
* @see \App\Http\Controllers\AcaraController::destroy
* @see app/Http/Controllers/AcaraController.php:540
* @route '/admin/acara/{acara}'
*/
export const destroy = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/acara/{acara}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AcaraController::destroy
* @see app/Http/Controllers/AcaraController.php:540
* @route '/admin/acara/{acara}'
*/
destroy.url = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { acara: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { acara: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            acara: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        acara: typeof args.acara === 'object'
        ? args.acara.slug
        : args.acara,
    }

    return destroy.definition.url
            .replace('{acara}', parsedArgs.acara.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcaraController::destroy
* @see app/Http/Controllers/AcaraController.php:540
* @route '/admin/acara/{acara}'
*/
destroy.delete = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\AcaraController::destroy
* @see app/Http/Controllers/AcaraController.php:540
* @route '/admin/acara/{acara}'
*/
const destroyForm = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcaraController::destroy
* @see app/Http/Controllers/AcaraController.php:540
* @route '/admin/acara/{acara}'
*/
destroyForm.delete = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\AcaraController::show
* @see app/Http/Controllers/AcaraController.php:460
* @route '/acara/{acara}'
*/
export const show = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/acara/{acara}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AcaraController::show
* @see app/Http/Controllers/AcaraController.php:460
* @route '/acara/{acara}'
*/
show.url = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { acara: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { acara: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            acara: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        acara: typeof args.acara === 'object'
        ? args.acara.slug
        : args.acara,
    }

    return show.definition.url
            .replace('{acara}', parsedArgs.acara.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcaraController::show
* @see app/Http/Controllers/AcaraController.php:460
* @route '/acara/{acara}'
*/
show.get = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::show
* @see app/Http/Controllers/AcaraController.php:460
* @route '/acara/{acara}'
*/
show.head = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AcaraController::show
* @see app/Http/Controllers/AcaraController.php:460
* @route '/acara/{acara}'
*/
const showForm = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::show
* @see app/Http/Controllers/AcaraController.php:460
* @route '/acara/{acara}'
*/
showForm.get = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AcaraController::show
* @see app/Http/Controllers/AcaraController.php:460
* @route '/acara/{acara}'
*/
showForm.head = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const AcaraController = { acara, payment, storePayment, storeKomentar, storeReaksi, index, create, store, edit, update, progress, updateProgress, reaksi, komentar, keuangan, bulkKeuangan, storeTasyaruf, destroy, show }

export default AcaraController