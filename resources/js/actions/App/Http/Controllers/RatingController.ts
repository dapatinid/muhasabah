import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RatingController::storeLingkaran
* @see app/Http/Controllers/RatingController.php:14
* @route '/lingkaran/{lingkaran}/rate'
*/
export const storeLingkaran = (args: { lingkaran: string | number | { slug: string | number } } | [lingkaran: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeLingkaran.url(args, options),
    method: 'post',
})

storeLingkaran.definition = {
    methods: ["post"],
    url: '/lingkaran/{lingkaran}/rate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RatingController::storeLingkaran
* @see app/Http/Controllers/RatingController.php:14
* @route '/lingkaran/{lingkaran}/rate'
*/
storeLingkaran.url = (args: { lingkaran: string | number | { slug: string | number } } | [lingkaran: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
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

    return storeLingkaran.definition.url
            .replace('{lingkaran}', parsedArgs.lingkaran.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RatingController::storeLingkaran
* @see app/Http/Controllers/RatingController.php:14
* @route '/lingkaran/{lingkaran}/rate'
*/
storeLingkaran.post = (args: { lingkaran: string | number | { slug: string | number } } | [lingkaran: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeLingkaran.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RatingController::storeLingkaran
* @see app/Http/Controllers/RatingController.php:14
* @route '/lingkaran/{lingkaran}/rate'
*/
const storeLingkaranForm = (args: { lingkaran: string | number | { slug: string | number } } | [lingkaran: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeLingkaran.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RatingController::storeLingkaran
* @see app/Http/Controllers/RatingController.php:14
* @route '/lingkaran/{lingkaran}/rate'
*/
storeLingkaranForm.post = (args: { lingkaran: string | number | { slug: string | number } } | [lingkaran: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeLingkaran.url(args, options),
    method: 'post',
})

storeLingkaran.form = storeLingkaranForm

/**
* @see \App\Http\Controllers\RatingController::storeMasjid
* @see app/Http/Controllers/RatingController.php:39
* @route '/masjid/{masjid}/rate'
*/
export const storeMasjid = (args: { masjid: string | number | { slug: string | number } } | [masjid: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeMasjid.url(args, options),
    method: 'post',
})

storeMasjid.definition = {
    methods: ["post"],
    url: '/masjid/{masjid}/rate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RatingController::storeMasjid
* @see app/Http/Controllers/RatingController.php:39
* @route '/masjid/{masjid}/rate'
*/
storeMasjid.url = (args: { masjid: string | number | { slug: string | number } } | [masjid: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
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

    return storeMasjid.definition.url
            .replace('{masjid}', parsedArgs.masjid.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RatingController::storeMasjid
* @see app/Http/Controllers/RatingController.php:39
* @route '/masjid/{masjid}/rate'
*/
storeMasjid.post = (args: { masjid: string | number | { slug: string | number } } | [masjid: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeMasjid.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RatingController::storeMasjid
* @see app/Http/Controllers/RatingController.php:39
* @route '/masjid/{masjid}/rate'
*/
const storeMasjidForm = (args: { masjid: string | number | { slug: string | number } } | [masjid: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeMasjid.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RatingController::storeMasjid
* @see app/Http/Controllers/RatingController.php:39
* @route '/masjid/{masjid}/rate'
*/
storeMasjidForm.post = (args: { masjid: string | number | { slug: string | number } } | [masjid: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeMasjid.url(args, options),
    method: 'post',
})

storeMasjid.form = storeMasjidForm

const RatingController = { storeLingkaran, storeMasjid }

export default RatingController