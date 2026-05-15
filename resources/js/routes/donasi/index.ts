import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import payment44796b from './payment'
/**
* @see \App\Http\Controllers\DonasiController::payment
* @see app/Http/Controllers/DonasiController.php:137
* @route '/donasi/{donasi}/payment'
*/
export const payment = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payment.url(args, options),
    method: 'get',
})

payment.definition = {
    methods: ["get","head"],
    url: '/donasi/{donasi}/payment',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DonasiController::payment
* @see app/Http/Controllers/DonasiController.php:137
* @route '/donasi/{donasi}/payment'
*/
payment.url = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { donasi: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { donasi: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            donasi: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        donasi: typeof args.donasi === 'object'
        ? args.donasi.slug
        : args.donasi,
    }

    return payment.definition.url
            .replace('{donasi}', parsedArgs.donasi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::payment
* @see app/Http/Controllers/DonasiController.php:137
* @route '/donasi/{donasi}/payment'
*/
payment.get = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payment.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::payment
* @see app/Http/Controllers/DonasiController.php:137
* @route '/donasi/{donasi}/payment'
*/
payment.head = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payment.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DonasiController::payment
* @see app/Http/Controllers/DonasiController.php:137
* @route '/donasi/{donasi}/payment'
*/
const paymentForm = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payment.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::payment
* @see app/Http/Controllers/DonasiController.php:137
* @route '/donasi/{donasi}/payment'
*/
paymentForm.get = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payment.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::payment
* @see app/Http/Controllers/DonasiController.php:137
* @route '/donasi/{donasi}/payment'
*/
paymentForm.head = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: payment.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

payment.form = paymentForm

/**
* @see \App\Http\Controllers\DonasiController::index
* @see app/Http/Controllers/DonasiController.php:42
* @route '/admin/donasi'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/donasi',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DonasiController::index
* @see app/Http/Controllers/DonasiController.php:42
* @route '/admin/donasi'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::index
* @see app/Http/Controllers/DonasiController.php:42
* @route '/admin/donasi'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::index
* @see app/Http/Controllers/DonasiController.php:42
* @route '/admin/donasi'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DonasiController::index
* @see app/Http/Controllers/DonasiController.php:42
* @route '/admin/donasi'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::index
* @see app/Http/Controllers/DonasiController.php:42
* @route '/admin/donasi'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::index
* @see app/Http/Controllers/DonasiController.php:42
* @route '/admin/donasi'
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
* @see \App\Http\Controllers\DonasiController::create
* @see app/Http/Controllers/DonasiController.php:61
* @route '/admin/donasi/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/donasi/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DonasiController::create
* @see app/Http/Controllers/DonasiController.php:61
* @route '/admin/donasi/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::create
* @see app/Http/Controllers/DonasiController.php:61
* @route '/admin/donasi/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::create
* @see app/Http/Controllers/DonasiController.php:61
* @route '/admin/donasi/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DonasiController::create
* @see app/Http/Controllers/DonasiController.php:61
* @route '/admin/donasi/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::create
* @see app/Http/Controllers/DonasiController.php:61
* @route '/admin/donasi/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::create
* @see app/Http/Controllers/DonasiController.php:61
* @route '/admin/donasi/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\DonasiController::store
* @see app/Http/Controllers/DonasiController.php:66
* @route '/admin/donasi'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/donasi',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DonasiController::store
* @see app/Http/Controllers/DonasiController.php:66
* @route '/admin/donasi'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::store
* @see app/Http/Controllers/DonasiController.php:66
* @route '/admin/donasi'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::store
* @see app/Http/Controllers/DonasiController.php:66
* @route '/admin/donasi'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::store
* @see app/Http/Controllers/DonasiController.php:66
* @route '/admin/donasi'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\DonasiController::uploadImage
* @see app/Http/Controllers/DonasiController.php:127
* @route '/admin/donasi/upload-image'
*/
export const uploadImage = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadImage.url(options),
    method: 'post',
})

uploadImage.definition = {
    methods: ["post"],
    url: '/admin/donasi/upload-image',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DonasiController::uploadImage
* @see app/Http/Controllers/DonasiController.php:127
* @route '/admin/donasi/upload-image'
*/
uploadImage.url = (options?: RouteQueryOptions) => {
    return uploadImage.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::uploadImage
* @see app/Http/Controllers/DonasiController.php:127
* @route '/admin/donasi/upload-image'
*/
uploadImage.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadImage.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::uploadImage
* @see app/Http/Controllers/DonasiController.php:127
* @route '/admin/donasi/upload-image'
*/
const uploadImageForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadImage.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::uploadImage
* @see app/Http/Controllers/DonasiController.php:127
* @route '/admin/donasi/upload-image'
*/
uploadImageForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadImage.url(options),
    method: 'post',
})

uploadImage.form = uploadImageForm

/**
* @see \App\Http\Controllers\DonasiController::edit
* @see app/Http/Controllers/DonasiController.php:82
* @route '/admin/donasi/{donasi}/edit'
*/
export const edit = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/donasi/{donasi}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DonasiController::edit
* @see app/Http/Controllers/DonasiController.php:82
* @route '/admin/donasi/{donasi}/edit'
*/
edit.url = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { donasi: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { donasi: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            donasi: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        donasi: typeof args.donasi === 'object'
        ? args.donasi.slug
        : args.donasi,
    }

    return edit.definition.url
            .replace('{donasi}', parsedArgs.donasi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::edit
* @see app/Http/Controllers/DonasiController.php:82
* @route '/admin/donasi/{donasi}/edit'
*/
edit.get = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::edit
* @see app/Http/Controllers/DonasiController.php:82
* @route '/admin/donasi/{donasi}/edit'
*/
edit.head = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DonasiController::edit
* @see app/Http/Controllers/DonasiController.php:82
* @route '/admin/donasi/{donasi}/edit'
*/
const editForm = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::edit
* @see app/Http/Controllers/DonasiController.php:82
* @route '/admin/donasi/{donasi}/edit'
*/
editForm.get = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::edit
* @see app/Http/Controllers/DonasiController.php:82
* @route '/admin/donasi/{donasi}/edit'
*/
editForm.head = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\DonasiController::update
* @see app/Http/Controllers/DonasiController.php:93
* @route '/admin/donasi/{donasi}'
*/
export const update = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/donasi/{donasi}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\DonasiController::update
* @see app/Http/Controllers/DonasiController.php:93
* @route '/admin/donasi/{donasi}'
*/
update.url = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { donasi: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { donasi: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            donasi: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        donasi: typeof args.donasi === 'object'
        ? args.donasi.slug
        : args.donasi,
    }

    return update.definition.url
            .replace('{donasi}', parsedArgs.donasi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::update
* @see app/Http/Controllers/DonasiController.php:93
* @route '/admin/donasi/{donasi}'
*/
update.put = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\DonasiController::update
* @see app/Http/Controllers/DonasiController.php:93
* @route '/admin/donasi/{donasi}'
*/
const updateForm = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::update
* @see app/Http/Controllers/DonasiController.php:93
* @route '/admin/donasi/{donasi}'
*/
updateForm.put = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\DonasiController::destroy
* @see app/Http/Controllers/DonasiController.php:121
* @route '/admin/donasi/{donasi}'
*/
export const destroy = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/donasi/{donasi}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DonasiController::destroy
* @see app/Http/Controllers/DonasiController.php:121
* @route '/admin/donasi/{donasi}'
*/
destroy.url = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { donasi: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { donasi: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            donasi: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        donasi: typeof args.donasi === 'object'
        ? args.donasi.slug
        : args.donasi,
    }

    return destroy.definition.url
            .replace('{donasi}', parsedArgs.donasi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::destroy
* @see app/Http/Controllers/DonasiController.php:121
* @route '/admin/donasi/{donasi}'
*/
destroy.delete = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\DonasiController::destroy
* @see app/Http/Controllers/DonasiController.php:121
* @route '/admin/donasi/{donasi}'
*/
const destroyForm = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DonasiController::destroy
* @see app/Http/Controllers/DonasiController.php:121
* @route '/admin/donasi/{donasi}'
*/
destroyForm.delete = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\DonasiController::show
* @see app/Http/Controllers/DonasiController.php:112
* @route '/donasi/{donasi}'
*/
export const show = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/donasi/{donasi}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DonasiController::show
* @see app/Http/Controllers/DonasiController.php:112
* @route '/donasi/{donasi}'
*/
show.url = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { donasi: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { donasi: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            donasi: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        donasi: typeof args.donasi === 'object'
        ? args.donasi.slug
        : args.donasi,
    }

    return show.definition.url
            .replace('{donasi}', parsedArgs.donasi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::show
* @see app/Http/Controllers/DonasiController.php:112
* @route '/donasi/{donasi}'
*/
show.get = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::show
* @see app/Http/Controllers/DonasiController.php:112
* @route '/donasi/{donasi}'
*/
show.head = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DonasiController::show
* @see app/Http/Controllers/DonasiController.php:112
* @route '/donasi/{donasi}'
*/
const showForm = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::show
* @see app/Http/Controllers/DonasiController.php:112
* @route '/donasi/{donasi}'
*/
showForm.get = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::show
* @see app/Http/Controllers/DonasiController.php:112
* @route '/donasi/{donasi}'
*/
showForm.head = (args: { donasi: string | { slug: string } } | [donasi: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const donasi = {
    payment: Object.assign(payment, payment44796b),
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    uploadImage: Object.assign(uploadImage, uploadImage),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    show: Object.assign(show, show),
}

export default donasi