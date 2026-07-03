import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ConversationController::index
* @see app/Http/Controllers/ConversationController.php:14
* @route '/obrolan'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/obrolan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConversationController::index
* @see app/Http/Controllers/ConversationController.php:14
* @route '/obrolan'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConversationController::index
* @see app/Http/Controllers/ConversationController.php:14
* @route '/obrolan'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConversationController::index
* @see app/Http/Controllers/ConversationController.php:14
* @route '/obrolan'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ConversationController::index
* @see app/Http/Controllers/ConversationController.php:14
* @route '/obrolan'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConversationController::index
* @see app/Http/Controllers/ConversationController.php:14
* @route '/obrolan'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConversationController::index
* @see app/Http/Controllers/ConversationController.php:14
* @route '/obrolan'
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
* @see \App\Http\Controllers\ConversationController::mulai
* @see app/Http/Controllers/ConversationController.php:86
* @route '/obrolan/mulai'
*/
export const mulai = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: mulai.url(options),
    method: 'post',
})

mulai.definition = {
    methods: ["post"],
    url: '/obrolan/mulai',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ConversationController::mulai
* @see app/Http/Controllers/ConversationController.php:86
* @route '/obrolan/mulai'
*/
mulai.url = (options?: RouteQueryOptions) => {
    return mulai.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConversationController::mulai
* @see app/Http/Controllers/ConversationController.php:86
* @route '/obrolan/mulai'
*/
mulai.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: mulai.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConversationController::mulai
* @see app/Http/Controllers/ConversationController.php:86
* @route '/obrolan/mulai'
*/
const mulaiForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: mulai.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConversationController::mulai
* @see app/Http/Controllers/ConversationController.php:86
* @route '/obrolan/mulai'
*/
mulaiForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: mulai.url(options),
    method: 'post',
})

mulai.form = mulaiForm

const obrolan = {
    index: Object.assign(index, index),
    mulai: Object.assign(mulai, mulai),
}

export default obrolan