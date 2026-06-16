import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\DonasiController::upload_bukti
* @see app/Http/Controllers/DonasiController.php:509
* @route '/payment/{payment}/upload-bukti'
*/
export const upload_bukti = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload_bukti.url(args, options),
    method: 'post',
})

upload_bukti.definition = {
    methods: ["post"],
    url: '/payment/{payment}/upload-bukti',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DonasiController::upload_bukti
* @see app/Http/Controllers/DonasiController.php:509
* @route '/payment/{payment}/upload-bukti'
*/
upload_bukti.url = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return upload_bukti.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::upload_bukti
* @see app/Http/Controllers/DonasiController.php:509
* @route '/payment/{payment}/upload-bukti'
*/
upload_bukti.post = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload_bukti.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::upload_bukti
* @see app/Http/Controllers/DonasiController.php:509
* @route '/payment/{payment}/upload-bukti'
*/
const upload_buktiForm = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: upload_bukti.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::upload_bukti
* @see app/Http/Controllers/DonasiController.php:509
* @route '/payment/{payment}/upload-bukti'
*/
upload_buktiForm.post = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: upload_bukti.url(args, options),
    method: 'post',
})

upload_bukti.form = upload_buktiForm

/**
* @see \App\Http\Controllers\DonasiController::toggle_status
* @see app/Http/Controllers/DonasiController.php:740
* @route '/admin/payment/{payment}/toggle-status'
*/
export const toggle_status = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggle_status.url(args, options),
    method: 'put',
})

toggle_status.definition = {
    methods: ["put"],
    url: '/admin/payment/{payment}/toggle-status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\DonasiController::toggle_status
* @see app/Http/Controllers/DonasiController.php:740
* @route '/admin/payment/{payment}/toggle-status'
*/
toggle_status.url = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return toggle_status.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::toggle_status
* @see app/Http/Controllers/DonasiController.php:740
* @route '/admin/payment/{payment}/toggle-status'
*/
toggle_status.put = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggle_status.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\DonasiController::toggle_status
* @see app/Http/Controllers/DonasiController.php:740
* @route '/admin/payment/{payment}/toggle-status'
*/
const toggle_statusForm = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle_status.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::toggle_status
* @see app/Http/Controllers/DonasiController.php:740
* @route '/admin/payment/{payment}/toggle-status'
*/
toggle_statusForm.put = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle_status.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

toggle_status.form = toggle_statusForm

/**
* @see \App\Http\Controllers\DonasiController::mayar
* @see app/Http/Controllers/DonasiController.php:752
* @route '/payment/{payment}/mayar'
*/
export const mayar = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: mayar.url(args, options),
    method: 'post',
})

mayar.definition = {
    methods: ["post"],
    url: '/payment/{payment}/mayar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DonasiController::mayar
* @see app/Http/Controllers/DonasiController.php:752
* @route '/payment/{payment}/mayar'
*/
mayar.url = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return mayar.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::mayar
* @see app/Http/Controllers/DonasiController.php:752
* @route '/payment/{payment}/mayar'
*/
mayar.post = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: mayar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::mayar
* @see app/Http/Controllers/DonasiController.php:752
* @route '/payment/{payment}/mayar'
*/
const mayarForm = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: mayar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::mayar
* @see app/Http/Controllers/DonasiController.php:752
* @route '/payment/{payment}/mayar'
*/
mayarForm.post = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: mayar.url(args, options),
    method: 'post',
})

mayar.form = mayarForm

const payment = {
    upload_bukti: Object.assign(upload_bukti, upload_bukti),
    toggle_status: Object.assign(toggle_status, toggle_status),
    mayar: Object.assign(mayar, mayar),
}

export default payment