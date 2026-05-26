import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\DonasiController::upload_bukti
* @see app/Http/Controllers/DonasiController.php:507
* @route '/payment/{payment}/upload-bukti'
*/
export const upload_bukti = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload_bukti.url(args, options),
    method: 'post',
})

upload_bukti.definition = {
    methods: ["post"],
    url: '/payment/{payment}/upload-bukti',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DonasiController::upload_bukti
* @see app/Http/Controllers/DonasiController.php:507
* @route '/payment/{payment}/upload-bukti'
*/
upload_bukti.url = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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
* @see app/Http/Controllers/DonasiController.php:507
* @route '/payment/{payment}/upload-bukti'
*/
upload_bukti.post = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload_bukti.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::upload_bukti
* @see app/Http/Controllers/DonasiController.php:507
* @route '/payment/{payment}/upload-bukti'
*/
const upload_buktiForm = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: upload_bukti.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::upload_bukti
* @see app/Http/Controllers/DonasiController.php:507
* @route '/payment/{payment}/upload-bukti'
*/
upload_buktiForm.post = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: upload_bukti.url(args, options),
    method: 'post',
})

upload_bukti.form = upload_buktiForm

const payment = {
    upload_bukti: Object.assign(upload_bukti, upload_bukti),
}

export default payment