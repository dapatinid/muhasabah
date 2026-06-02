import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\WebhookController::handleMayar
* @see app/Http/Controllers/WebhookController.php:12
* @route '/webhook/mayar'
*/
export const handleMayar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handleMayar.url(options),
    method: 'post',
})

handleMayar.definition = {
    methods: ["post"],
    url: '/webhook/mayar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WebhookController::handleMayar
* @see app/Http/Controllers/WebhookController.php:12
* @route '/webhook/mayar'
*/
handleMayar.url = (options?: RouteQueryOptions) => {
    return handleMayar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WebhookController::handleMayar
* @see app/Http/Controllers/WebhookController.php:12
* @route '/webhook/mayar'
*/
handleMayar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handleMayar.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WebhookController::handleMayar
* @see app/Http/Controllers/WebhookController.php:12
* @route '/webhook/mayar'
*/
const handleMayarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: handleMayar.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WebhookController::handleMayar
* @see app/Http/Controllers/WebhookController.php:12
* @route '/webhook/mayar'
*/
handleMayarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: handleMayar.url(options),
    method: 'post',
})

handleMayar.form = handleMayarForm

const WebhookController = { handleMayar }

export default WebhookController