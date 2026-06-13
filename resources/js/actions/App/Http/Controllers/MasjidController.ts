import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MasjidController::index
* @see app/Http/Controllers/MasjidController.php:15
* @route '/admin/masjid'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/masjid',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasjidController::index
* @see app/Http/Controllers/MasjidController.php:15
* @route '/admin/masjid'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasjidController::index
* @see app/Http/Controllers/MasjidController.php:15
* @route '/admin/masjid'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasjidController::index
* @see app/Http/Controllers/MasjidController.php:15
* @route '/admin/masjid'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasjidController::index
* @see app/Http/Controllers/MasjidController.php:15
* @route '/admin/masjid'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasjidController::index
* @see app/Http/Controllers/MasjidController.php:15
* @route '/admin/masjid'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasjidController::index
* @see app/Http/Controllers/MasjidController.php:15
* @route '/admin/masjid'
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
* @see \App\Http\Controllers\MasjidController::create
* @see app/Http/Controllers/MasjidController.php:41
* @route '/admin/masjid/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/masjid/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasjidController::create
* @see app/Http/Controllers/MasjidController.php:41
* @route '/admin/masjid/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasjidController::create
* @see app/Http/Controllers/MasjidController.php:41
* @route '/admin/masjid/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasjidController::create
* @see app/Http/Controllers/MasjidController.php:41
* @route '/admin/masjid/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasjidController::create
* @see app/Http/Controllers/MasjidController.php:41
* @route '/admin/masjid/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasjidController::create
* @see app/Http/Controllers/MasjidController.php:41
* @route '/admin/masjid/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasjidController::create
* @see app/Http/Controllers/MasjidController.php:41
* @route '/admin/masjid/create'
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
* @see \App\Http\Controllers\MasjidController::store
* @see app/Http/Controllers/MasjidController.php:49
* @route '/admin/masjid'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/masjid',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MasjidController::store
* @see app/Http/Controllers/MasjidController.php:49
* @route '/admin/masjid'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasjidController::store
* @see app/Http/Controllers/MasjidController.php:49
* @route '/admin/masjid'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasjidController::store
* @see app/Http/Controllers/MasjidController.php:49
* @route '/admin/masjid'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasjidController::store
* @see app/Http/Controllers/MasjidController.php:49
* @route '/admin/masjid'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\MasjidController::uploadImage
* @see app/Http/Controllers/MasjidController.php:155
* @route '/admin/masjid/upload-image'
*/
export const uploadImage = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadImage.url(options),
    method: 'post',
})

uploadImage.definition = {
    methods: ["post"],
    url: '/admin/masjid/upload-image',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MasjidController::uploadImage
* @see app/Http/Controllers/MasjidController.php:155
* @route '/admin/masjid/upload-image'
*/
uploadImage.url = (options?: RouteQueryOptions) => {
    return uploadImage.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasjidController::uploadImage
* @see app/Http/Controllers/MasjidController.php:155
* @route '/admin/masjid/upload-image'
*/
uploadImage.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadImage.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasjidController::uploadImage
* @see app/Http/Controllers/MasjidController.php:155
* @route '/admin/masjid/upload-image'
*/
const uploadImageForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadImage.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasjidController::uploadImage
* @see app/Http/Controllers/MasjidController.php:155
* @route '/admin/masjid/upload-image'
*/
uploadImageForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadImage.url(options),
    method: 'post',
})

uploadImage.form = uploadImageForm

/**
* @see \App\Http\Controllers\MasjidController::edit
* @see app/Http/Controllers/MasjidController.php:77
* @route '/admin/masjid/{masjid}/edit'
*/
export const edit = (args: { masjid: number | { id: number } } | [masjid: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/masjid/{masjid}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MasjidController::edit
* @see app/Http/Controllers/MasjidController.php:77
* @route '/admin/masjid/{masjid}/edit'
*/
edit.url = (args: { masjid: number | { id: number } } | [masjid: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { masjid: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { masjid: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            masjid: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        masjid: typeof args.masjid === 'object'
        ? args.masjid.id
        : args.masjid,
    }

    return edit.definition.url
            .replace('{masjid}', parsedArgs.masjid.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasjidController::edit
* @see app/Http/Controllers/MasjidController.php:77
* @route '/admin/masjid/{masjid}/edit'
*/
edit.get = (args: { masjid: number | { id: number } } | [masjid: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasjidController::edit
* @see app/Http/Controllers/MasjidController.php:77
* @route '/admin/masjid/{masjid}/edit'
*/
edit.head = (args: { masjid: number | { id: number } } | [masjid: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MasjidController::edit
* @see app/Http/Controllers/MasjidController.php:77
* @route '/admin/masjid/{masjid}/edit'
*/
const editForm = (args: { masjid: number | { id: number } } | [masjid: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasjidController::edit
* @see app/Http/Controllers/MasjidController.php:77
* @route '/admin/masjid/{masjid}/edit'
*/
editForm.get = (args: { masjid: number | { id: number } } | [masjid: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MasjidController::edit
* @see app/Http/Controllers/MasjidController.php:77
* @route '/admin/masjid/{masjid}/edit'
*/
editForm.head = (args: { masjid: number | { id: number } } | [masjid: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\MasjidController::update
* @see app/Http/Controllers/MasjidController.php:95
* @route '/admin/masjid/{masjid}'
*/
const update89be7faf3c7847c1f4e5bf8770652a0b = (args: { masjid: number | { id: number } } | [masjid: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update89be7faf3c7847c1f4e5bf8770652a0b.url(args, options),
    method: 'put',
})

update89be7faf3c7847c1f4e5bf8770652a0b.definition = {
    methods: ["put"],
    url: '/admin/masjid/{masjid}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\MasjidController::update
* @see app/Http/Controllers/MasjidController.php:95
* @route '/admin/masjid/{masjid}'
*/
update89be7faf3c7847c1f4e5bf8770652a0b.url = (args: { masjid: number | { id: number } } | [masjid: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { masjid: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { masjid: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            masjid: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        masjid: typeof args.masjid === 'object'
        ? args.masjid.id
        : args.masjid,
    }

    return update89be7faf3c7847c1f4e5bf8770652a0b.definition.url
            .replace('{masjid}', parsedArgs.masjid.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasjidController::update
* @see app/Http/Controllers/MasjidController.php:95
* @route '/admin/masjid/{masjid}'
*/
update89be7faf3c7847c1f4e5bf8770652a0b.put = (args: { masjid: number | { id: number } } | [masjid: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update89be7faf3c7847c1f4e5bf8770652a0b.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MasjidController::update
* @see app/Http/Controllers/MasjidController.php:95
* @route '/admin/masjid/{masjid}'
*/
const update89be7faf3c7847c1f4e5bf8770652a0bForm = (args: { masjid: number | { id: number } } | [masjid: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update89be7faf3c7847c1f4e5bf8770652a0b.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasjidController::update
* @see app/Http/Controllers/MasjidController.php:95
* @route '/admin/masjid/{masjid}'
*/
update89be7faf3c7847c1f4e5bf8770652a0bForm.put = (args: { masjid: number | { id: number } } | [masjid: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update89be7faf3c7847c1f4e5bf8770652a0b.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update89be7faf3c7847c1f4e5bf8770652a0b.form = update89be7faf3c7847c1f4e5bf8770652a0bForm
/**
* @see \App\Http\Controllers\MasjidController::update
* @see app/Http/Controllers/MasjidController.php:95
* @route '/admin/masjid/{masjid}'
*/
const update89be7faf3c7847c1f4e5bf8770652a0b = (args: { masjid: number | { id: number } } | [masjid: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update89be7faf3c7847c1f4e5bf8770652a0b.url(args, options),
    method: 'patch',
})

update89be7faf3c7847c1f4e5bf8770652a0b.definition = {
    methods: ["patch"],
    url: '/admin/masjid/{masjid}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\MasjidController::update
* @see app/Http/Controllers/MasjidController.php:95
* @route '/admin/masjid/{masjid}'
*/
update89be7faf3c7847c1f4e5bf8770652a0b.url = (args: { masjid: number | { id: number } } | [masjid: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { masjid: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { masjid: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            masjid: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        masjid: typeof args.masjid === 'object'
        ? args.masjid.id
        : args.masjid,
    }

    return update89be7faf3c7847c1f4e5bf8770652a0b.definition.url
            .replace('{masjid}', parsedArgs.masjid.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasjidController::update
* @see app/Http/Controllers/MasjidController.php:95
* @route '/admin/masjid/{masjid}'
*/
update89be7faf3c7847c1f4e5bf8770652a0b.patch = (args: { masjid: number | { id: number } } | [masjid: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update89be7faf3c7847c1f4e5bf8770652a0b.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MasjidController::update
* @see app/Http/Controllers/MasjidController.php:95
* @route '/admin/masjid/{masjid}'
*/
const update89be7faf3c7847c1f4e5bf8770652a0bForm = (args: { masjid: number | { id: number } } | [masjid: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update89be7faf3c7847c1f4e5bf8770652a0b.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasjidController::update
* @see app/Http/Controllers/MasjidController.php:95
* @route '/admin/masjid/{masjid}'
*/
update89be7faf3c7847c1f4e5bf8770652a0bForm.patch = (args: { masjid: number | { id: number } } | [masjid: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update89be7faf3c7847c1f4e5bf8770652a0b.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update89be7faf3c7847c1f4e5bf8770652a0b.form = update89be7faf3c7847c1f4e5bf8770652a0bForm

export const update = {
    '/admin/masjid/{masjid}': update89be7faf3c7847c1f4e5bf8770652a0b,
    '/admin/masjid/{masjid}': update89be7faf3c7847c1f4e5bf8770652a0b,
}

/**
* @see \App\Http\Controllers\MasjidController::destroy
* @see app/Http/Controllers/MasjidController.php:138
* @route '/admin/masjid/{masjid}'
*/
export const destroy = (args: { masjid: number | { id: number } } | [masjid: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/masjid/{masjid}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MasjidController::destroy
* @see app/Http/Controllers/MasjidController.php:138
* @route '/admin/masjid/{masjid}'
*/
destroy.url = (args: { masjid: number | { id: number } } | [masjid: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { masjid: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { masjid: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            masjid: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        masjid: typeof args.masjid === 'object'
        ? args.masjid.id
        : args.masjid,
    }

    return destroy.definition.url
            .replace('{masjid}', parsedArgs.masjid.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MasjidController::destroy
* @see app/Http/Controllers/MasjidController.php:138
* @route '/admin/masjid/{masjid}'
*/
destroy.delete = (args: { masjid: number | { id: number } } | [masjid: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MasjidController::destroy
* @see app/Http/Controllers/MasjidController.php:138
* @route '/admin/masjid/{masjid}'
*/
const destroyForm = (args: { masjid: number | { id: number } } | [masjid: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MasjidController::destroy
* @see app/Http/Controllers/MasjidController.php:138
* @route '/admin/masjid/{masjid}'
*/
destroyForm.delete = (args: { masjid: number | { id: number } } | [masjid: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const MasjidController = { index, create, store, uploadImage, edit, update, destroy }

export default MasjidController