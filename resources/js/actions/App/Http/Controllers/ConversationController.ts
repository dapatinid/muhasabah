import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\ConversationController::getOrCreate
* @see app/Http/Controllers/ConversationController.php:86
* @route '/obrolan/mulai'
*/
export const getOrCreate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: getOrCreate.url(options),
    method: 'post',
})

getOrCreate.definition = {
    methods: ["post"],
    url: '/obrolan/mulai',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ConversationController::getOrCreate
* @see app/Http/Controllers/ConversationController.php:86
* @route '/obrolan/mulai'
*/
getOrCreate.url = (options?: RouteQueryOptions) => {
    return getOrCreate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConversationController::getOrCreate
* @see app/Http/Controllers/ConversationController.php:86
* @route '/obrolan/mulai'
*/
getOrCreate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: getOrCreate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConversationController::getOrCreate
* @see app/Http/Controllers/ConversationController.php:86
* @route '/obrolan/mulai'
*/
const getOrCreateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: getOrCreate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConversationController::getOrCreate
* @see app/Http/Controllers/ConversationController.php:86
* @route '/obrolan/mulai'
*/
getOrCreateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: getOrCreate.url(options),
    method: 'post',
})

getOrCreate.form = getOrCreateForm

/**
* @see \App\Http\Controllers\ConversationController::messages
* @see app/Http/Controllers/ConversationController.php:116
* @route '/obrolan/{conversation}/messages'
*/
export const messages = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: messages.url(args, options),
    method: 'get',
})

messages.definition = {
    methods: ["get","head"],
    url: '/obrolan/{conversation}/messages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConversationController::messages
* @see app/Http/Controllers/ConversationController.php:116
* @route '/obrolan/{conversation}/messages'
*/
messages.url = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conversation: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { conversation: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            conversation: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        conversation: typeof args.conversation === 'object'
        ? args.conversation.id
        : args.conversation,
    }

    return messages.definition.url
            .replace('{conversation}', parsedArgs.conversation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConversationController::messages
* @see app/Http/Controllers/ConversationController.php:116
* @route '/obrolan/{conversation}/messages'
*/
messages.get = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: messages.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConversationController::messages
* @see app/Http/Controllers/ConversationController.php:116
* @route '/obrolan/{conversation}/messages'
*/
messages.head = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: messages.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ConversationController::messages
* @see app/Http/Controllers/ConversationController.php:116
* @route '/obrolan/{conversation}/messages'
*/
const messagesForm = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: messages.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConversationController::messages
* @see app/Http/Controllers/ConversationController.php:116
* @route '/obrolan/{conversation}/messages'
*/
messagesForm.get = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: messages.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConversationController::messages
* @see app/Http/Controllers/ConversationController.php:116
* @route '/obrolan/{conversation}/messages'
*/
messagesForm.head = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: messages.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

messages.form = messagesForm

const ConversationController = { index, getOrCreate, messages }

export default ConversationController