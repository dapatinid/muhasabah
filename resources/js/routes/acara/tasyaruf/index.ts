import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AcaraController::store
* @see app/Http/Controllers/AcaraController.php:424
* @route '/admin/acara/{acara}/tasyaruf'
*/
export const store = (args: { acara: string | number | { slug: string | number } } | [acara: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/acara/{acara}/tasyaruf',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AcaraController::store
* @see app/Http/Controllers/AcaraController.php:424
* @route '/admin/acara/{acara}/tasyaruf'
*/
store.url = (args: { acara: string | number | { slug: string | number } } | [acara: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
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
* @see app/Http/Controllers/AcaraController.php:424
* @route '/admin/acara/{acara}/tasyaruf'
*/
store.post = (args: { acara: string | number | { slug: string | number } } | [acara: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcaraController::store
* @see app/Http/Controllers/AcaraController.php:424
* @route '/admin/acara/{acara}/tasyaruf'
*/
const storeForm = (args: { acara: string | number | { slug: string | number } } | [acara: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcaraController::store
* @see app/Http/Controllers/AcaraController.php:424
* @route '/admin/acara/{acara}/tasyaruf'
*/
storeForm.post = (args: { acara: string | number | { slug: string | number } } | [acara: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

const tasyaruf = {
    store: Object.assign(store, store),
}

export default tasyaruf