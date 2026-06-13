import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LingkaranController::index
* @see app/Http/Controllers/LingkaranController.php:15
* @route '/admin/lingkaran'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/lingkaran',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LingkaranController::index
* @see app/Http/Controllers/LingkaranController.php:15
* @route '/admin/lingkaran'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LingkaranController::index
* @see app/Http/Controllers/LingkaranController.php:15
* @route '/admin/lingkaran'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LingkaranController::index
* @see app/Http/Controllers/LingkaranController.php:15
* @route '/admin/lingkaran'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LingkaranController::index
* @see app/Http/Controllers/LingkaranController.php:15
* @route '/admin/lingkaran'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LingkaranController::index
* @see app/Http/Controllers/LingkaranController.php:15
* @route '/admin/lingkaran'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LingkaranController::index
* @see app/Http/Controllers/LingkaranController.php:15
* @route '/admin/lingkaran'
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
* @see \App\Http\Controllers\LingkaranController::create
* @see app/Http/Controllers/LingkaranController.php:41
* @route '/admin/lingkaran/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/lingkaran/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LingkaranController::create
* @see app/Http/Controllers/LingkaranController.php:41
* @route '/admin/lingkaran/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LingkaranController::create
* @see app/Http/Controllers/LingkaranController.php:41
* @route '/admin/lingkaran/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LingkaranController::create
* @see app/Http/Controllers/LingkaranController.php:41
* @route '/admin/lingkaran/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LingkaranController::create
* @see app/Http/Controllers/LingkaranController.php:41
* @route '/admin/lingkaran/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LingkaranController::create
* @see app/Http/Controllers/LingkaranController.php:41
* @route '/admin/lingkaran/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LingkaranController::create
* @see app/Http/Controllers/LingkaranController.php:41
* @route '/admin/lingkaran/create'
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
* @see \App\Http\Controllers\LingkaranController::store
* @see app/Http/Controllers/LingkaranController.php:49
* @route '/admin/lingkaran'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/lingkaran',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LingkaranController::store
* @see app/Http/Controllers/LingkaranController.php:49
* @route '/admin/lingkaran'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LingkaranController::store
* @see app/Http/Controllers/LingkaranController.php:49
* @route '/admin/lingkaran'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LingkaranController::store
* @see app/Http/Controllers/LingkaranController.php:49
* @route '/admin/lingkaran'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LingkaranController::store
* @see app/Http/Controllers/LingkaranController.php:49
* @route '/admin/lingkaran'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\LingkaranController::uploadImage
* @see app/Http/Controllers/LingkaranController.php:155
* @route '/admin/lingkaran/upload-image'
*/
export const uploadImage = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadImage.url(options),
    method: 'post',
})

uploadImage.definition = {
    methods: ["post"],
    url: '/admin/lingkaran/upload-image',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LingkaranController::uploadImage
* @see app/Http/Controllers/LingkaranController.php:155
* @route '/admin/lingkaran/upload-image'
*/
uploadImage.url = (options?: RouteQueryOptions) => {
    return uploadImage.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LingkaranController::uploadImage
* @see app/Http/Controllers/LingkaranController.php:155
* @route '/admin/lingkaran/upload-image'
*/
uploadImage.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadImage.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LingkaranController::uploadImage
* @see app/Http/Controllers/LingkaranController.php:155
* @route '/admin/lingkaran/upload-image'
*/
const uploadImageForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadImage.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LingkaranController::uploadImage
* @see app/Http/Controllers/LingkaranController.php:155
* @route '/admin/lingkaran/upload-image'
*/
uploadImageForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadImage.url(options),
    method: 'post',
})

uploadImage.form = uploadImageForm

/**
* @see \App\Http\Controllers\LingkaranController::edit
* @see app/Http/Controllers/LingkaranController.php:77
* @route '/admin/lingkaran/{lingkaran}/edit'
*/
export const edit = (args: { lingkaran: number | { id: number } } | [lingkaran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/lingkaran/{lingkaran}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LingkaranController::edit
* @see app/Http/Controllers/LingkaranController.php:77
* @route '/admin/lingkaran/{lingkaran}/edit'
*/
edit.url = (args: { lingkaran: number | { id: number } } | [lingkaran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lingkaran: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { lingkaran: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            lingkaran: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lingkaran: typeof args.lingkaran === 'object'
        ? args.lingkaran.id
        : args.lingkaran,
    }

    return edit.definition.url
            .replace('{lingkaran}', parsedArgs.lingkaran.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LingkaranController::edit
* @see app/Http/Controllers/LingkaranController.php:77
* @route '/admin/lingkaran/{lingkaran}/edit'
*/
edit.get = (args: { lingkaran: number | { id: number } } | [lingkaran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LingkaranController::edit
* @see app/Http/Controllers/LingkaranController.php:77
* @route '/admin/lingkaran/{lingkaran}/edit'
*/
edit.head = (args: { lingkaran: number | { id: number } } | [lingkaran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LingkaranController::edit
* @see app/Http/Controllers/LingkaranController.php:77
* @route '/admin/lingkaran/{lingkaran}/edit'
*/
const editForm = (args: { lingkaran: number | { id: number } } | [lingkaran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LingkaranController::edit
* @see app/Http/Controllers/LingkaranController.php:77
* @route '/admin/lingkaran/{lingkaran}/edit'
*/
editForm.get = (args: { lingkaran: number | { id: number } } | [lingkaran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LingkaranController::edit
* @see app/Http/Controllers/LingkaranController.php:77
* @route '/admin/lingkaran/{lingkaran}/edit'
*/
editForm.head = (args: { lingkaran: number | { id: number } } | [lingkaran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\LingkaranController::update
* @see app/Http/Controllers/LingkaranController.php:95
* @route '/admin/lingkaran/{lingkaran}'
*/
const update75df068099ea43eaccb18e7a7a046fa0 = (args: { lingkaran: number | { id: number } } | [lingkaran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update75df068099ea43eaccb18e7a7a046fa0.url(args, options),
    method: 'put',
})

update75df068099ea43eaccb18e7a7a046fa0.definition = {
    methods: ["put"],
    url: '/admin/lingkaran/{lingkaran}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\LingkaranController::update
* @see app/Http/Controllers/LingkaranController.php:95
* @route '/admin/lingkaran/{lingkaran}'
*/
update75df068099ea43eaccb18e7a7a046fa0.url = (args: { lingkaran: number | { id: number } } | [lingkaran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lingkaran: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { lingkaran: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            lingkaran: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lingkaran: typeof args.lingkaran === 'object'
        ? args.lingkaran.id
        : args.lingkaran,
    }

    return update75df068099ea43eaccb18e7a7a046fa0.definition.url
            .replace('{lingkaran}', parsedArgs.lingkaran.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LingkaranController::update
* @see app/Http/Controllers/LingkaranController.php:95
* @route '/admin/lingkaran/{lingkaran}'
*/
update75df068099ea43eaccb18e7a7a046fa0.put = (args: { lingkaran: number | { id: number } } | [lingkaran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update75df068099ea43eaccb18e7a7a046fa0.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\LingkaranController::update
* @see app/Http/Controllers/LingkaranController.php:95
* @route '/admin/lingkaran/{lingkaran}'
*/
const update75df068099ea43eaccb18e7a7a046fa0Form = (args: { lingkaran: number | { id: number } } | [lingkaran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update75df068099ea43eaccb18e7a7a046fa0.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LingkaranController::update
* @see app/Http/Controllers/LingkaranController.php:95
* @route '/admin/lingkaran/{lingkaran}'
*/
update75df068099ea43eaccb18e7a7a046fa0Form.put = (args: { lingkaran: number | { id: number } } | [lingkaran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update75df068099ea43eaccb18e7a7a046fa0.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update75df068099ea43eaccb18e7a7a046fa0.form = update75df068099ea43eaccb18e7a7a046fa0Form
/**
* @see \App\Http\Controllers\LingkaranController::update
* @see app/Http/Controllers/LingkaranController.php:95
* @route '/admin/lingkaran/{lingkaran}'
*/
const update75df068099ea43eaccb18e7a7a046fa0 = (args: { lingkaran: number | { id: number } } | [lingkaran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update75df068099ea43eaccb18e7a7a046fa0.url(args, options),
    method: 'patch',
})

update75df068099ea43eaccb18e7a7a046fa0.definition = {
    methods: ["patch"],
    url: '/admin/lingkaran/{lingkaran}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\LingkaranController::update
* @see app/Http/Controllers/LingkaranController.php:95
* @route '/admin/lingkaran/{lingkaran}'
*/
update75df068099ea43eaccb18e7a7a046fa0.url = (args: { lingkaran: number | { id: number } } | [lingkaran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lingkaran: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { lingkaran: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            lingkaran: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lingkaran: typeof args.lingkaran === 'object'
        ? args.lingkaran.id
        : args.lingkaran,
    }

    return update75df068099ea43eaccb18e7a7a046fa0.definition.url
            .replace('{lingkaran}', parsedArgs.lingkaran.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LingkaranController::update
* @see app/Http/Controllers/LingkaranController.php:95
* @route '/admin/lingkaran/{lingkaran}'
*/
update75df068099ea43eaccb18e7a7a046fa0.patch = (args: { lingkaran: number | { id: number } } | [lingkaran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update75df068099ea43eaccb18e7a7a046fa0.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\LingkaranController::update
* @see app/Http/Controllers/LingkaranController.php:95
* @route '/admin/lingkaran/{lingkaran}'
*/
const update75df068099ea43eaccb18e7a7a046fa0Form = (args: { lingkaran: number | { id: number } } | [lingkaran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update75df068099ea43eaccb18e7a7a046fa0.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LingkaranController::update
* @see app/Http/Controllers/LingkaranController.php:95
* @route '/admin/lingkaran/{lingkaran}'
*/
update75df068099ea43eaccb18e7a7a046fa0Form.patch = (args: { lingkaran: number | { id: number } } | [lingkaran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update75df068099ea43eaccb18e7a7a046fa0.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update75df068099ea43eaccb18e7a7a046fa0.form = update75df068099ea43eaccb18e7a7a046fa0Form

export const update = {
    '/admin/lingkaran/{lingkaran}': update75df068099ea43eaccb18e7a7a046fa0,
    '/admin/lingkaran/{lingkaran}': update75df068099ea43eaccb18e7a7a046fa0,
}

/**
* @see \App\Http\Controllers\LingkaranController::destroy
* @see app/Http/Controllers/LingkaranController.php:138
* @route '/admin/lingkaran/{lingkaran}'
*/
export const destroy = (args: { lingkaran: number | { id: number } } | [lingkaran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/lingkaran/{lingkaran}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\LingkaranController::destroy
* @see app/Http/Controllers/LingkaranController.php:138
* @route '/admin/lingkaran/{lingkaran}'
*/
destroy.url = (args: { lingkaran: number | { id: number } } | [lingkaran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lingkaran: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { lingkaran: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            lingkaran: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lingkaran: typeof args.lingkaran === 'object'
        ? args.lingkaran.id
        : args.lingkaran,
    }

    return destroy.definition.url
            .replace('{lingkaran}', parsedArgs.lingkaran.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LingkaranController::destroy
* @see app/Http/Controllers/LingkaranController.php:138
* @route '/admin/lingkaran/{lingkaran}'
*/
destroy.delete = (args: { lingkaran: number | { id: number } } | [lingkaran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\LingkaranController::destroy
* @see app/Http/Controllers/LingkaranController.php:138
* @route '/admin/lingkaran/{lingkaran}'
*/
const destroyForm = (args: { lingkaran: number | { id: number } } | [lingkaran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LingkaranController::destroy
* @see app/Http/Controllers/LingkaranController.php:138
* @route '/admin/lingkaran/{lingkaran}'
*/
destroyForm.delete = (args: { lingkaran: number | { id: number } } | [lingkaran: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const LingkaranController = { index, create, store, uploadImage, edit, update, destroy }

export default LingkaranController