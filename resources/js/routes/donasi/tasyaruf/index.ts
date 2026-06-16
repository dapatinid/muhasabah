import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\DonasiController::store
* @see app/Http/Controllers/DonasiController.php:319
* @route '/admin/donasi/{donasi}/tasyaruf'
*/
export const store = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/donasi/{donasi}/tasyaruf',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DonasiController::store
* @see app/Http/Controllers/DonasiController.php:319
* @route '/admin/donasi/{donasi}/tasyaruf'
*/
store.url = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{donasi}', parsedArgs.donasi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::store
* @see app/Http/Controllers/DonasiController.php:319
* @route '/admin/donasi/{donasi}/tasyaruf'
*/
store.post = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::store
* @see app/Http/Controllers/DonasiController.php:319
* @route '/admin/donasi/{donasi}/tasyaruf'
*/
const storeForm = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::store
* @see app/Http/Controllers/DonasiController.php:319
* @route '/admin/donasi/{donasi}/tasyaruf'
*/
storeForm.post = (args: { donasi: string | number | { slug: string | number } } | [donasi: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

const tasyaruf = {
    store: Object.assign(store, store),
}

export default tasyaruf