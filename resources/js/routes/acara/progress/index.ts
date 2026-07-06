import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AcaraController::update
* @see app/Http/Controllers/AcaraController.php:235
* @route '/admin/acara/{acara}/progress'
*/
export const update = (args: { acara: string | number | { slug: string | number } } | [acara: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/acara/{acara}/progress',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AcaraController::update
* @see app/Http/Controllers/AcaraController.php:235
* @route '/admin/acara/{acara}/progress'
*/
update.url = (args: { acara: string | number | { slug: string | number } } | [acara: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
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
* @see app/Http/Controllers/AcaraController.php:235
* @route '/admin/acara/{acara}/progress'
*/
update.put = (args: { acara: string | number | { slug: string | number } } | [acara: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\AcaraController::update
* @see app/Http/Controllers/AcaraController.php:235
* @route '/admin/acara/{acara}/progress'
*/
const updateForm = (args: { acara: string | number | { slug: string | number } } | [acara: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/AcaraController.php:235
* @route '/admin/acara/{acara}/progress'
*/
updateForm.put = (args: { acara: string | number | { slug: string | number } } | [acara: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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