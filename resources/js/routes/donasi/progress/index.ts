import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\DonasiController::update
* @see app/Http/Controllers/DonasiController.php:164
* @route '/admin/donasi/{donasi}/progress'
*/
export const update = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/donasi/{donasi}/progress',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\DonasiController::update
* @see app/Http/Controllers/DonasiController.php:164
* @route '/admin/donasi/{donasi}/progress'
*/
update.url = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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
* @see app/Http/Controllers/DonasiController.php:164
* @route '/admin/donasi/{donasi}/progress'
*/
update.put = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\DonasiController::update
* @see app/Http/Controllers/DonasiController.php:164
* @route '/admin/donasi/{donasi}/progress'
*/
const updateForm = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/DonasiController.php:164
* @route '/admin/donasi/{donasi}/progress'
*/
updateForm.put = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const progress = {
    update: Object.assign(update, update),
}

export default progress