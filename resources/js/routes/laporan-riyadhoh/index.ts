import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\LaporanRiyadhohController::store
* @see app/Http/Controllers/LaporanRiyadhohController.php:23
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
* @see app/Http/Controllers/LaporanRiyadhohController.php:23
* @route '/laporan-riyadhoh-submit'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::store
* @see app/Http/Controllers/LaporanRiyadhohController.php:23
* @route '/laporan-riyadhoh-submit'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::store
* @see app/Http/Controllers/LaporanRiyadhohController.php:23
* @route '/laporan-riyadhoh-submit'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::store
* @see app/Http/Controllers/LaporanRiyadhohController.php:23
* @route '/laporan-riyadhoh-submit'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::log
* @see app/Http/Controllers/LaporanRiyadhohController.php:56
* @route '/laporan-riyadhoh/log'
*/
export const log = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: log.url(options),
    method: 'get',
})

log.definition = {
    methods: ["get","head"],
    url: '/laporan-riyadhoh/log',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::log
* @see app/Http/Controllers/LaporanRiyadhohController.php:56
* @route '/laporan-riyadhoh/log'
*/
log.url = (options?: RouteQueryOptions) => {
    return log.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::log
* @see app/Http/Controllers/LaporanRiyadhohController.php:56
* @route '/laporan-riyadhoh/log'
*/
log.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: log.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::log
* @see app/Http/Controllers/LaporanRiyadhohController.php:56
* @route '/laporan-riyadhoh/log'
*/
log.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: log.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::log
* @see app/Http/Controllers/LaporanRiyadhohController.php:56
* @route '/laporan-riyadhoh/log'
*/
const logForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: log.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::log
* @see app/Http/Controllers/LaporanRiyadhohController.php:56
* @route '/laporan-riyadhoh/log'
*/
logForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: log.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::log
* @see app/Http/Controllers/LaporanRiyadhohController.php:56
* @route '/laporan-riyadhoh/log'
*/
logForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: log.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

log.form = logForm

const laporanRiyadhoh = {
    store: Object.assign(store, store),
    log: Object.assign(log, log),
}

export default laporanRiyadhoh