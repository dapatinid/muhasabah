import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\DonasiController::bulk
* @see app/Http/Controllers/DonasiController.php:647
* @route '/admin/donasi/{donasi}/bulk-donasi'
*/
export const bulk = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulk.url(args, options),
    method: 'post',
})

bulk.definition = {
    methods: ["post"],
    url: '/admin/donasi/{donasi}/bulk-donasi',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DonasiController::bulk
* @see app/Http/Controllers/DonasiController.php:647
* @route '/admin/donasi/{donasi}/bulk-donasi'
*/
bulk.url = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return bulk.definition.url
            .replace('{donasi}', parsedArgs.donasi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::bulk
* @see app/Http/Controllers/DonasiController.php:647
* @route '/admin/donasi/{donasi}/bulk-donasi'
*/
bulk.post = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulk.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::bulk
* @see app/Http/Controllers/DonasiController.php:647
* @route '/admin/donasi/{donasi}/bulk-donasi'
*/
const bulkForm = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulk.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::bulk
* @see app/Http/Controllers/DonasiController.php:647
* @route '/admin/donasi/{donasi}/bulk-donasi'
*/
bulkForm.post = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulk.url(args, options),
    method: 'post',
})

bulk.form = bulkForm

const donasi = {
    bulk: Object.assign(bulk, bulk),
}

export default donasi