import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\KalamController::storeKomentar
* @see app/Http/Controllers/KalamController.php:139
* @route '/kalam/{kalam}/komentar'
*/
export const storeKomentar = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeKomentar.url(args, options),
    method: 'post',
})

storeKomentar.definition = {
    methods: ["post"],
    url: '/kalam/{kalam}/komentar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\KalamController::storeKomentar
* @see app/Http/Controllers/KalamController.php:139
* @route '/kalam/{kalam}/komentar'
*/
storeKomentar.url = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kalam: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { kalam: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            kalam: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        kalam: typeof args.kalam === 'object'
        ? args.kalam.slug
        : args.kalam,
    }

    return storeKomentar.definition.url
            .replace('{kalam}', parsedArgs.kalam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KalamController::storeKomentar
* @see app/Http/Controllers/KalamController.php:139
* @route '/kalam/{kalam}/komentar'
*/
storeKomentar.post = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeKomentar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KalamController::storeKomentar
* @see app/Http/Controllers/KalamController.php:139
* @route '/kalam/{kalam}/komentar'
*/
const storeKomentarForm = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeKomentar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KalamController::storeKomentar
* @see app/Http/Controllers/KalamController.php:139
* @route '/kalam/{kalam}/komentar'
*/
storeKomentarForm.post = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeKomentar.url(args, options),
    method: 'post',
})

storeKomentar.form = storeKomentarForm

/**
* @see \App\Http\Controllers\KalamController::storeReaksi
* @see app/Http/Controllers/KalamController.php:176
* @route '/kalam/{kalam}/reaksi'
*/
export const storeReaksi = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeReaksi.url(args, options),
    method: 'post',
})

storeReaksi.definition = {
    methods: ["post"],
    url: '/kalam/{kalam}/reaksi',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\KalamController::storeReaksi
* @see app/Http/Controllers/KalamController.php:176
* @route '/kalam/{kalam}/reaksi'
*/
storeReaksi.url = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kalam: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { kalam: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            kalam: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        kalam: typeof args.kalam === 'object'
        ? args.kalam.slug
        : args.kalam,
    }

    return storeReaksi.definition.url
            .replace('{kalam}', parsedArgs.kalam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KalamController::storeReaksi
* @see app/Http/Controllers/KalamController.php:176
* @route '/kalam/{kalam}/reaksi'
*/
storeReaksi.post = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeReaksi.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KalamController::storeReaksi
* @see app/Http/Controllers/KalamController.php:176
* @route '/kalam/{kalam}/reaksi'
*/
const storeReaksiForm = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeReaksi.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KalamController::storeReaksi
* @see app/Http/Controllers/KalamController.php:176
* @route '/kalam/{kalam}/reaksi'
*/
storeReaksiForm.post = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeReaksi.url(args, options),
    method: 'post',
})

storeReaksi.form = storeReaksiForm

/**
* @see \App\Http\Controllers\KalamController::index
* @see app/Http/Controllers/KalamController.php:42
* @route '/admin/kalam'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/kalam',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KalamController::index
* @see app/Http/Controllers/KalamController.php:42
* @route '/admin/kalam'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KalamController::index
* @see app/Http/Controllers/KalamController.php:42
* @route '/admin/kalam'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::index
* @see app/Http/Controllers/KalamController.php:42
* @route '/admin/kalam'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KalamController::index
* @see app/Http/Controllers/KalamController.php:42
* @route '/admin/kalam'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::index
* @see app/Http/Controllers/KalamController.php:42
* @route '/admin/kalam'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::index
* @see app/Http/Controllers/KalamController.php:42
* @route '/admin/kalam'
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
* @see \App\Http\Controllers\KalamController::create
* @see app/Http/Controllers/KalamController.php:61
* @route '/admin/kalam/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/kalam/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KalamController::create
* @see app/Http/Controllers/KalamController.php:61
* @route '/admin/kalam/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KalamController::create
* @see app/Http/Controllers/KalamController.php:61
* @route '/admin/kalam/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::create
* @see app/Http/Controllers/KalamController.php:61
* @route '/admin/kalam/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KalamController::create
* @see app/Http/Controllers/KalamController.php:61
* @route '/admin/kalam/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::create
* @see app/Http/Controllers/KalamController.php:61
* @route '/admin/kalam/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::create
* @see app/Http/Controllers/KalamController.php:61
* @route '/admin/kalam/create'
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
* @see \App\Http\Controllers\KalamController::store
* @see app/Http/Controllers/KalamController.php:66
* @route '/admin/kalam'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/kalam',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\KalamController::store
* @see app/Http/Controllers/KalamController.php:66
* @route '/admin/kalam'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KalamController::store
* @see app/Http/Controllers/KalamController.php:66
* @route '/admin/kalam'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KalamController::store
* @see app/Http/Controllers/KalamController.php:66
* @route '/admin/kalam'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KalamController::store
* @see app/Http/Controllers/KalamController.php:66
* @route '/admin/kalam'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\KalamController::uploadImage
* @see app/Http/Controllers/KalamController.php:229
* @route '/admin/kalam/upload-image'
*/
export const uploadImage = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadImage.url(options),
    method: 'post',
})

uploadImage.definition = {
    methods: ["post"],
    url: '/admin/kalam/upload-image',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\KalamController::uploadImage
* @see app/Http/Controllers/KalamController.php:229
* @route '/admin/kalam/upload-image'
*/
uploadImage.url = (options?: RouteQueryOptions) => {
    return uploadImage.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KalamController::uploadImage
* @see app/Http/Controllers/KalamController.php:229
* @route '/admin/kalam/upload-image'
*/
uploadImage.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadImage.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KalamController::uploadImage
* @see app/Http/Controllers/KalamController.php:229
* @route '/admin/kalam/upload-image'
*/
const uploadImageForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadImage.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KalamController::uploadImage
* @see app/Http/Controllers/KalamController.php:229
* @route '/admin/kalam/upload-image'
*/
uploadImageForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadImage.url(options),
    method: 'post',
})

uploadImage.form = uploadImageForm

/**
* @see \App\Http\Controllers\KalamController::edit
* @see app/Http/Controllers/KalamController.php:80
* @route '/admin/kalam/{kalam}/edit'
*/
export const edit = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/kalam/{kalam}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KalamController::edit
* @see app/Http/Controllers/KalamController.php:80
* @route '/admin/kalam/{kalam}/edit'
*/
edit.url = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kalam: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { kalam: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            kalam: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        kalam: typeof args.kalam === 'object'
        ? args.kalam.slug
        : args.kalam,
    }

    return edit.definition.url
            .replace('{kalam}', parsedArgs.kalam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KalamController::edit
* @see app/Http/Controllers/KalamController.php:80
* @route '/admin/kalam/{kalam}/edit'
*/
edit.get = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::edit
* @see app/Http/Controllers/KalamController.php:80
* @route '/admin/kalam/{kalam}/edit'
*/
edit.head = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KalamController::edit
* @see app/Http/Controllers/KalamController.php:80
* @route '/admin/kalam/{kalam}/edit'
*/
const editForm = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::edit
* @see app/Http/Controllers/KalamController.php:80
* @route '/admin/kalam/{kalam}/edit'
*/
editForm.get = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::edit
* @see app/Http/Controllers/KalamController.php:80
* @route '/admin/kalam/{kalam}/edit'
*/
editForm.head = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\KalamController::update
* @see app/Http/Controllers/KalamController.php:91
* @route '/admin/kalam/{kalam}'
*/
export const update = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/kalam/{kalam}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\KalamController::update
* @see app/Http/Controllers/KalamController.php:91
* @route '/admin/kalam/{kalam}'
*/
update.url = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kalam: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { kalam: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            kalam: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        kalam: typeof args.kalam === 'object'
        ? args.kalam.slug
        : args.kalam,
    }

    return update.definition.url
            .replace('{kalam}', parsedArgs.kalam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KalamController::update
* @see app/Http/Controllers/KalamController.php:91
* @route '/admin/kalam/{kalam}'
*/
update.put = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\KalamController::update
* @see app/Http/Controllers/KalamController.php:91
* @route '/admin/kalam/{kalam}'
*/
const updateForm = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KalamController::update
* @see app/Http/Controllers/KalamController.php:91
* @route '/admin/kalam/{kalam}'
*/
updateForm.put = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\KalamController::destroy
* @see app/Http/Controllers/KalamController.php:221
* @route '/admin/kalam/{kalam}'
*/
export const destroy = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/kalam/{kalam}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\KalamController::destroy
* @see app/Http/Controllers/KalamController.php:221
* @route '/admin/kalam/{kalam}'
*/
destroy.url = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kalam: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { kalam: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            kalam: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        kalam: typeof args.kalam === 'object'
        ? args.kalam.slug
        : args.kalam,
    }

    return destroy.definition.url
            .replace('{kalam}', parsedArgs.kalam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KalamController::destroy
* @see app/Http/Controllers/KalamController.php:221
* @route '/admin/kalam/{kalam}'
*/
destroy.delete = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\KalamController::destroy
* @see app/Http/Controllers/KalamController.php:221
* @route '/admin/kalam/{kalam}'
*/
const destroyForm = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KalamController::destroy
* @see app/Http/Controllers/KalamController.php:221
* @route '/admin/kalam/{kalam}'
*/
destroyForm.delete = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\KalamController::show
* @see app/Http/Controllers/KalamController.php:109
* @route '/kalam/{kalam}'
*/
export const show = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/kalam/{kalam}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KalamController::show
* @see app/Http/Controllers/KalamController.php:109
* @route '/kalam/{kalam}'
*/
show.url = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kalam: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { kalam: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            kalam: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        kalam: typeof args.kalam === 'object'
        ? args.kalam.slug
        : args.kalam,
    }

    return show.definition.url
            .replace('{kalam}', parsedArgs.kalam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KalamController::show
* @see app/Http/Controllers/KalamController.php:109
* @route '/kalam/{kalam}'
*/
show.get = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::show
* @see app/Http/Controllers/KalamController.php:109
* @route '/kalam/{kalam}'
*/
show.head = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KalamController::show
* @see app/Http/Controllers/KalamController.php:109
* @route '/kalam/{kalam}'
*/
const showForm = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::show
* @see app/Http/Controllers/KalamController.php:109
* @route '/kalam/{kalam}'
*/
showForm.get = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::show
* @see app/Http/Controllers/KalamController.php:109
* @route '/kalam/{kalam}'
*/
showForm.head = (args: { kalam: string | number | { slug: string | number } } | [kalam: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const kalam = {
    storeKomentar: Object.assign(storeKomentar, storeKomentar),
    storeReaksi: Object.assign(storeReaksi, storeReaksi),
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    uploadImage: Object.assign(uploadImage, uploadImage),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    show: Object.assign(show, show),
}

export default kalam