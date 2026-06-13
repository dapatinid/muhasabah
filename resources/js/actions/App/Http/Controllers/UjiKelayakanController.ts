import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\UjiKelayakanController::store
* @see app/Http/Controllers/UjiKelayakanController.php:12
* @route '/pendaftaran/uji-kelayakan'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/pendaftaran/uji-kelayakan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UjiKelayakanController::store
* @see app/Http/Controllers/UjiKelayakanController.php:12
* @route '/pendaftaran/uji-kelayakan'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UjiKelayakanController::store
* @see app/Http/Controllers/UjiKelayakanController.php:12
* @route '/pendaftaran/uji-kelayakan'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UjiKelayakanController::store
* @see app/Http/Controllers/UjiKelayakanController.php:12
* @route '/pendaftaran/uji-kelayakan'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UjiKelayakanController::store
* @see app/Http/Controllers/UjiKelayakanController.php:12
* @route '/pendaftaran/uji-kelayakan'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const UjiKelayakanController = { store }

export default UjiKelayakanController