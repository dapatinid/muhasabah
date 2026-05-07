import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LaporanRiyadhohController::store
* @see app/Http/Controllers/LaporanRiyadhohController.php:13
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
* @see app/Http/Controllers/LaporanRiyadhohController.php:13
* @route '/laporan-riyadhoh-submit'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::store
* @see app/Http/Controllers/LaporanRiyadhohController.php:13
* @route '/laporan-riyadhoh-submit'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::store
* @see app/Http/Controllers/LaporanRiyadhohController.php:13
* @route '/laporan-riyadhoh-submit'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::store
* @see app/Http/Controllers/LaporanRiyadhohController.php:13
* @route '/laporan-riyadhoh-submit'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::log
* @see app/Http/Controllers/LaporanRiyadhohController.php:41
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
* @see app/Http/Controllers/LaporanRiyadhohController.php:41
* @route '/laporan-riyadhoh/log'
*/
log.url = (options?: RouteQueryOptions) => {
    return log.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::log
* @see app/Http/Controllers/LaporanRiyadhohController.php:41
* @route '/laporan-riyadhoh/log'
*/
log.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: log.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::log
* @see app/Http/Controllers/LaporanRiyadhohController.php:41
* @route '/laporan-riyadhoh/log'
*/
log.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: log.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::log
* @see app/Http/Controllers/LaporanRiyadhohController.php:41
* @route '/laporan-riyadhoh/log'
*/
const logForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: log.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::log
* @see app/Http/Controllers/LaporanRiyadhohController.php:41
* @route '/laporan-riyadhoh/log'
*/
logForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: log.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::log
* @see app/Http/Controllers/LaporanRiyadhohController.php:41
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

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::index
* @see app/Http/Controllers/LaporanRiyadhohController.php:0
* @route '/laporan'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/laporan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::index
* @see app/Http/Controllers/LaporanRiyadhohController.php:0
* @route '/laporan'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::index
* @see app/Http/Controllers/LaporanRiyadhohController.php:0
* @route '/laporan'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::index
* @see app/Http/Controllers/LaporanRiyadhohController.php:0
* @route '/laporan'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::index
* @see app/Http/Controllers/LaporanRiyadhohController.php:0
* @route '/laporan'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::index
* @see app/Http/Controllers/LaporanRiyadhohController.php:0
* @route '/laporan'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::index
* @see app/Http/Controllers/LaporanRiyadhohController.php:0
* @route '/laporan'
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

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::logRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:61
* @route '/log-riyadhoh'
*/
export const logRiyadhoh = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logRiyadhoh.url(options),
    method: 'get',
})

logRiyadhoh.definition = {
    methods: ["get","head"],
    url: '/log-riyadhoh',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::logRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:61
* @route '/log-riyadhoh'
*/
logRiyadhoh.url = (options?: RouteQueryOptions) => {
    return logRiyadhoh.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::logRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:61
* @route '/log-riyadhoh'
*/
logRiyadhoh.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logRiyadhoh.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::logRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:61
* @route '/log-riyadhoh'
*/
logRiyadhoh.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: logRiyadhoh.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::logRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:61
* @route '/log-riyadhoh'
*/
const logRiyadhohForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: logRiyadhoh.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::logRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:61
* @route '/log-riyadhoh'
*/
logRiyadhohForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: logRiyadhoh.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::logRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:61
* @route '/log-riyadhoh'
*/
logRiyadhohForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: logRiyadhoh.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

logRiyadhoh.form = logRiyadhohForm

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::raportRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:103
* @route '/raport-riyadhoh'
*/
export const raportRiyadhoh = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: raportRiyadhoh.url(options),
    method: 'get',
})

raportRiyadhoh.definition = {
    methods: ["get","head"],
    url: '/raport-riyadhoh',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::raportRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:103
* @route '/raport-riyadhoh'
*/
raportRiyadhoh.url = (options?: RouteQueryOptions) => {
    return raportRiyadhoh.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::raportRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:103
* @route '/raport-riyadhoh'
*/
raportRiyadhoh.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: raportRiyadhoh.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::raportRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:103
* @route '/raport-riyadhoh'
*/
raportRiyadhoh.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: raportRiyadhoh.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::raportRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:103
* @route '/raport-riyadhoh'
*/
const raportRiyadhohForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: raportRiyadhoh.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::raportRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:103
* @route '/raport-riyadhoh'
*/
raportRiyadhohForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: raportRiyadhoh.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::raportRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:103
* @route '/raport-riyadhoh'
*/
raportRiyadhohForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: raportRiyadhoh.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

raportRiyadhoh.form = raportRiyadhohForm

const LaporanRiyadhohController = { store, log, index, logRiyadhoh, raportRiyadhoh }

export default LaporanRiyadhohController