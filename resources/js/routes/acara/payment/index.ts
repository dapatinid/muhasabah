import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AcaraController::store
* @see app/Http/Controllers/AcaraController.php:594
* @route '/acara/{acara}/payment'
*/
export const store = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/acara/{acara}/payment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AcaraController::store
* @see app/Http/Controllers/AcaraController.php:594
* @route '/acara/{acara}/payment'
*/
store.url = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{acara}', parsedArgs.acara.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcaraController::store
* @see app/Http/Controllers/AcaraController.php:594
* @route '/acara/{acara}/payment'
*/
store.post = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcaraController::store
* @see app/Http/Controllers/AcaraController.php:594
* @route '/acara/{acara}/payment'
*/
const storeForm = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcaraController::store
* @see app/Http/Controllers/AcaraController.php:594
* @route '/acara/{acara}/payment'
*/
storeForm.post = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

const payment = {
    store: Object.assign(store, store),
}

export default payment