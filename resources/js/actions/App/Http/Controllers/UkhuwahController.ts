import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\UkhuwahController::ukhuwah
* @see app/Http/Controllers/UkhuwahController.php:13
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
* @see app/Http/Controllers/UkhuwahController.php:13
* @route '/ukhuwah'
*/
ukhuwah.url = (options?: RouteQueryOptions) => {
    return ukhuwah.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UkhuwahController::ukhuwah
* @see app/Http/Controllers/UkhuwahController.php:13
* @route '/ukhuwah'
*/
ukhuwah.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ukhuwah.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UkhuwahController::ukhuwah
* @see app/Http/Controllers/UkhuwahController.php:13
* @route '/ukhuwah'
*/
ukhuwah.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ukhuwah.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UkhuwahController::ukhuwah
* @see app/Http/Controllers/UkhuwahController.php:13
* @route '/ukhuwah'
*/
const ukhuwahForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ukhuwah.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UkhuwahController::ukhuwah
* @see app/Http/Controllers/UkhuwahController.php:13
* @route '/ukhuwah'
*/
ukhuwahForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ukhuwah.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UkhuwahController::ukhuwah
* @see app/Http/Controllers/UkhuwahController.php:13
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

const UkhuwahController = { ukhuwah }

export default UkhuwahController