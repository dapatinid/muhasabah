import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\LaporanRiyadhohController::store
* @see app/Http/Controllers/LaporanRiyadhohController.php:22
* @route '/laporan-riyadhoh-submit'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/laporan-riyadhoh-submit',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::store
* @see app/Http/Controllers/LaporanRiyadhohController.php:22
* @route '/laporan-riyadhoh-submit'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::store
* @see app/Http/Controllers/LaporanRiyadhohController.php:22
* @route '/laporan-riyadhoh-submit'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::store
* @see app/Http/Controllers/LaporanRiyadhohController.php:22
* @route '/laporan-riyadhoh-submit'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::store
* @see app/Http/Controllers/LaporanRiyadhohController.php:22
* @route '/laporan-riyadhoh-submit'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const laporanRiyadhoh = {
    store: Object.assign(store, store),
}

export default laporanRiyadhoh