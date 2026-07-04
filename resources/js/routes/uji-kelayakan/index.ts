import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\UjiKelayakanController::index
* @see app/Http/Controllers/UjiKelayakanController.php:16
* @route '/admin/uji-kelayakan'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/uji-kelayakan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UjiKelayakanController::index
* @see app/Http/Controllers/UjiKelayakanController.php:16
* @route '/admin/uji-kelayakan'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UjiKelayakanController::index
* @see app/Http/Controllers/UjiKelayakanController.php:16
* @route '/admin/uji-kelayakan'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UjiKelayakanController::index
* @see app/Http/Controllers/UjiKelayakanController.php:16
* @route '/admin/uji-kelayakan'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UjiKelayakanController::index
* @see app/Http/Controllers/UjiKelayakanController.php:16
* @route '/admin/uji-kelayakan'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UjiKelayakanController::index
* @see app/Http/Controllers/UjiKelayakanController.php:16
* @route '/admin/uji-kelayakan'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UjiKelayakanController::index
* @see app/Http/Controllers/UjiKelayakanController.php:16
* @route '/admin/uji-kelayakan'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

const ujiKelayakan = {
    index: Object.assign(index, index),
}

export default ujiKelayakan