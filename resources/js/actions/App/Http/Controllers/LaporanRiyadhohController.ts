import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\LaporanRiyadhohController::updateLog
* @see app/Http/Controllers/LaporanRiyadhohController.php:110
* @route '/log-riyadhoh/{id}'
*/
export const updateLog = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateLog.url(args, options),
    method: 'patch',
})

updateLog.definition = {
    methods: ["patch"],
    url: '/log-riyadhoh/{id}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::updateLog
* @see app/Http/Controllers/LaporanRiyadhohController.php:110
* @route '/log-riyadhoh/{id}'
*/
updateLog.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return updateLog.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::updateLog
* @see app/Http/Controllers/LaporanRiyadhohController.php:110
* @route '/log-riyadhoh/{id}'
*/
updateLog.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateLog.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::updateLog
* @see app/Http/Controllers/LaporanRiyadhohController.php:110
* @route '/log-riyadhoh/{id}'
*/
const updateLogForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateLog.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::updateLog
* @see app/Http/Controllers/LaporanRiyadhohController.php:110
* @route '/log-riyadhoh/{id}'
*/
updateLogForm.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateLog.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateLog.form = updateLogForm

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::deleteLog
* @see app/Http/Controllers/LaporanRiyadhohController.php:131
* @route '/log-riyadhoh/{id}'
*/
export const deleteLog = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteLog.url(args, options),
    method: 'delete',
})

deleteLog.definition = {
    methods: ["delete"],
    url: '/log-riyadhoh/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::deleteLog
* @see app/Http/Controllers/LaporanRiyadhohController.php:131
* @route '/log-riyadhoh/{id}'
*/
deleteLog.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return deleteLog.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::deleteLog
* @see app/Http/Controllers/LaporanRiyadhohController.php:131
* @route '/log-riyadhoh/{id}'
*/
deleteLog.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteLog.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::deleteLog
* @see app/Http/Controllers/LaporanRiyadhohController.php:131
* @route '/log-riyadhoh/{id}'
*/
const deleteLogForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteLog.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::deleteLog
* @see app/Http/Controllers/LaporanRiyadhohController.php:131
* @route '/log-riyadhoh/{id}'
*/
deleteLogForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteLog.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

deleteLog.form = deleteLogForm

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::raporRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:138
* @route '/rapor-riyadhoh'
*/
export const raporRiyadhoh = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: raporRiyadhoh.url(options),
    method: 'get',
})

raporRiyadhoh.definition = {
    methods: ["get","head"],
    url: '/rapor-riyadhoh',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::raporRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:138
* @route '/rapor-riyadhoh'
*/
raporRiyadhoh.url = (options?: RouteQueryOptions) => {
    return raporRiyadhoh.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::raporRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:138
* @route '/rapor-riyadhoh'
*/
raporRiyadhoh.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: raporRiyadhoh.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::raporRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:138
* @route '/rapor-riyadhoh'
*/
raporRiyadhoh.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: raporRiyadhoh.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::raporRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:138
* @route '/rapor-riyadhoh'
*/
const raporRiyadhohForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: raporRiyadhoh.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::raporRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:138
* @route '/rapor-riyadhoh'
*/
raporRiyadhohForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: raporRiyadhoh.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::raporRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:138
* @route '/rapor-riyadhoh'
*/
raporRiyadhohForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: raporRiyadhoh.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

raporRiyadhoh.form = raporRiyadhohForm

const LaporanRiyadhohController = { store, log, logRiyadhoh, updateLog, deleteLog, raporRiyadhoh }

export default LaporanRiyadhohController