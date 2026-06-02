import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AcaraController::bulk
* @see app/Http/Controllers/AcaraController.php:317
* @route '/admin/acara/{acara}/bulk-keuangan'
*/
export const bulk = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulk.url(args, options),
    method: 'post',
})

bulk.definition = {
    methods: ["post"],
    url: '/admin/acara/{acara}/bulk-keuangan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AcaraController::bulk
* @see app/Http/Controllers/AcaraController.php:317
* @route '/admin/acara/{acara}/bulk-keuangan'
*/
bulk.url = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return bulk.definition.url
            .replace('{acara}', parsedArgs.acara.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcaraController::bulk
* @see app/Http/Controllers/AcaraController.php:317
* @route '/admin/acara/{acara}/bulk-keuangan'
*/
bulk.post = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulk.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcaraController::bulk
* @see app/Http/Controllers/AcaraController.php:317
* @route '/admin/acara/{acara}/bulk-keuangan'
*/
const bulkForm = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulk.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AcaraController::bulk
* @see app/Http/Controllers/AcaraController.php:317
* @route '/admin/acara/{acara}/bulk-keuangan'
*/
bulkForm.post = (args: { acara: string | { slug: string } } | [acara: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulk.url(args, options),
    method: 'post',
})

bulk.form = bulkForm

const acara = {
    bulk: Object.assign(bulk, bulk),
}

export default acara