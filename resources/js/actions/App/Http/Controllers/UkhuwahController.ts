import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\UkhuwahController::ukhuwah
* @see app/Http/Controllers/UkhuwahController.php:16
* @route '/ukhuwah'
*/
export const ukhuwah = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ukhuwah.url(options),
    method: 'get',
})

ukhuwah.definition = {
    methods: ["get","head"],
    url: '/ukhuwah',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UkhuwahController::ukhuwah
* @see app/Http/Controllers/UkhuwahController.php:16
* @route '/ukhuwah'
*/
ukhuwah.url = (options?: RouteQueryOptions) => {
    return ukhuwah.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UkhuwahController::ukhuwah
* @see app/Http/Controllers/UkhuwahController.php:16
* @route '/ukhuwah'
*/
ukhuwah.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ukhuwah.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UkhuwahController::ukhuwah
* @see app/Http/Controllers/UkhuwahController.php:16
* @route '/ukhuwah'
*/
ukhuwah.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ukhuwah.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UkhuwahController::ukhuwah
* @see app/Http/Controllers/UkhuwahController.php:16
* @route '/ukhuwah'
*/
const ukhuwahForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ukhuwah.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UkhuwahController::ukhuwah
* @see app/Http/Controllers/UkhuwahController.php:16
* @route '/ukhuwah'
*/
ukhuwahForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ukhuwah.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UkhuwahController::ukhuwah
* @see app/Http/Controllers/UkhuwahController.php:16
* @route '/ukhuwah'
*/
ukhuwahForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ukhuwah.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

ukhuwah.form = ukhuwahForm

/**
* @see \App\Http\Controllers\UkhuwahController::tokoh
* @see app/Http/Controllers/UkhuwahController.php:64
* @route '/tokoh/{user}'
*/
export const tokoh = (args: { user: string | { slug: string } } | [user: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tokoh.url(args, options),
    method: 'get',
})

tokoh.definition = {
    methods: ["get","head"],
    url: '/tokoh/{user}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UkhuwahController::tokoh
* @see app/Http/Controllers/UkhuwahController.php:64
* @route '/tokoh/{user}'
*/
tokoh.url = (args: { user: string | { slug: string } } | [user: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { user: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.slug
        : args.user,
    }

    return tokoh.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UkhuwahController::tokoh
* @see app/Http/Controllers/UkhuwahController.php:64
* @route '/tokoh/{user}'
*/
tokoh.get = (args: { user: string | { slug: string } } | [user: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tokoh.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UkhuwahController::tokoh
* @see app/Http/Controllers/UkhuwahController.php:64
* @route '/tokoh/{user}'
*/
tokoh.head = (args: { user: string | { slug: string } } | [user: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: tokoh.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UkhuwahController::tokoh
* @see app/Http/Controllers/UkhuwahController.php:64
* @route '/tokoh/{user}'
*/
const tokohForm = (args: { user: string | { slug: string } } | [user: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tokoh.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UkhuwahController::tokoh
* @see app/Http/Controllers/UkhuwahController.php:64
* @route '/tokoh/{user}'
*/
tokohForm.get = (args: { user: string | { slug: string } } | [user: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tokoh.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UkhuwahController::tokoh
* @see app/Http/Controllers/UkhuwahController.php:64
* @route '/tokoh/{user}'
*/
tokohForm.head = (args: { user: string | { slug: string } } | [user: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tokoh.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

tokoh.form = tokohForm

/**
* @see \App\Http\Controllers\UkhuwahController::lingkaran
* @see app/Http/Controllers/UkhuwahController.php:100
* @route '/lingkaran/{lingkaran}'
*/
export const lingkaran = (args: { lingkaran: string | { slug: string } } | [lingkaran: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: lingkaran.url(args, options),
    method: 'get',
})

lingkaran.definition = {
    methods: ["get","head"],
    url: '/lingkaran/{lingkaran}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UkhuwahController::lingkaran
* @see app/Http/Controllers/UkhuwahController.php:100
* @route '/lingkaran/{lingkaran}'
*/
lingkaran.url = (args: { lingkaran: string | { slug: string } } | [lingkaran: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lingkaran: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { lingkaran: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            lingkaran: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lingkaran: typeof args.lingkaran === 'object'
        ? args.lingkaran.slug
        : args.lingkaran,
    }

    return lingkaran.definition.url
            .replace('{lingkaran}', parsedArgs.lingkaran.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UkhuwahController::lingkaran
* @see app/Http/Controllers/UkhuwahController.php:100
* @route '/lingkaran/{lingkaran}'
*/
lingkaran.get = (args: { lingkaran: string | { slug: string } } | [lingkaran: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: lingkaran.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UkhuwahController::lingkaran
* @see app/Http/Controllers/UkhuwahController.php:100
* @route '/lingkaran/{lingkaran}'
*/
lingkaran.head = (args: { lingkaran: string | { slug: string } } | [lingkaran: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: lingkaran.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UkhuwahController::lingkaran
* @see app/Http/Controllers/UkhuwahController.php:100
* @route '/lingkaran/{lingkaran}'
*/
const lingkaranForm = (args: { lingkaran: string | { slug: string } } | [lingkaran: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: lingkaran.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UkhuwahController::lingkaran
* @see app/Http/Controllers/UkhuwahController.php:100
* @route '/lingkaran/{lingkaran}'
*/
lingkaranForm.get = (args: { lingkaran: string | { slug: string } } | [lingkaran: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: lingkaran.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UkhuwahController::lingkaran
* @see app/Http/Controllers/UkhuwahController.php:100
* @route '/lingkaran/{lingkaran}'
*/
lingkaranForm.head = (args: { lingkaran: string | { slug: string } } | [lingkaran: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: lingkaran.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

lingkaran.form = lingkaranForm

/**
* @see \App\Http\Controllers\UkhuwahController::masjid
* @see app/Http/Controllers/UkhuwahController.php:125
* @route '/masjid/{masjid}'
*/
export const masjid = (args: { masjid: string | { slug: string } } | [masjid: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: masjid.url(args, options),
    method: 'get',
})

masjid.definition = {
    methods: ["get","head"],
    url: '/masjid/{masjid}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UkhuwahController::masjid
* @see app/Http/Controllers/UkhuwahController.php:125
* @route '/masjid/{masjid}'
*/
masjid.url = (args: { masjid: string | { slug: string } } | [masjid: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { masjid: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { masjid: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            masjid: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        masjid: typeof args.masjid === 'object'
        ? args.masjid.slug
        : args.masjid,
    }

    return masjid.definition.url
            .replace('{masjid}', parsedArgs.masjid.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UkhuwahController::masjid
* @see app/Http/Controllers/UkhuwahController.php:125
* @route '/masjid/{masjid}'
*/
masjid.get = (args: { masjid: string | { slug: string } } | [masjid: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: masjid.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UkhuwahController::masjid
* @see app/Http/Controllers/UkhuwahController.php:125
* @route '/masjid/{masjid}'
*/
masjid.head = (args: { masjid: string | { slug: string } } | [masjid: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: masjid.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UkhuwahController::masjid
* @see app/Http/Controllers/UkhuwahController.php:125
* @route '/masjid/{masjid}'
*/
const masjidForm = (args: { masjid: string | { slug: string } } | [masjid: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: masjid.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UkhuwahController::masjid
* @see app/Http/Controllers/UkhuwahController.php:125
* @route '/masjid/{masjid}'
*/
masjidForm.get = (args: { masjid: string | { slug: string } } | [masjid: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: masjid.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UkhuwahController::masjid
* @see app/Http/Controllers/UkhuwahController.php:125
* @route '/masjid/{masjid}'
*/
masjidForm.head = (args: { masjid: string | { slug: string } } | [masjid: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: masjid.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

masjid.form = masjidForm

const UkhuwahController = { ukhuwah, tokoh, lingkaran, masjid }

export default UkhuwahController