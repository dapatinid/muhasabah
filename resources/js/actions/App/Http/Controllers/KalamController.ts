import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\KalamController::kalam
* @see app/Http/Controllers/KalamController.php:20
* @route '/kalam'
*/
export const kalam = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kalam.url(options),
    method: 'get',
})

kalam.definition = {
    methods: ["get","head"],
    url: '/kalam',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KalamController::kalam
* @see app/Http/Controllers/KalamController.php:20
* @route '/kalam'
*/
kalam.url = (options?: RouteQueryOptions) => {
    return kalam.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KalamController::kalam
* @see app/Http/Controllers/KalamController.php:20
* @route '/kalam'
*/
kalam.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kalam.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::kalam
* @see app/Http/Controllers/KalamController.php:20
* @route '/kalam'
*/
kalam.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: kalam.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KalamController::kalam
* @see app/Http/Controllers/KalamController.php:20
* @route '/kalam'
*/
const kalamForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: kalam.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::kalam
* @see app/Http/Controllers/KalamController.php:20
* @route '/kalam'
*/
kalamForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: kalam.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::kalam
* @see app/Http/Controllers/KalamController.php:20
* @route '/kalam'
*/
kalamForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: kalam.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

kalam.form = kalamForm

/**
* @see \App\Http\Controllers\KalamController::storeKomentar
* @see app/Http/Controllers/KalamController.php:225
* @route '/kalam/{kalam}/komentar'
*/
export const storeKomentar = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeKomentar.url(args, options),
    method: 'post',
})

storeKomentar.definition = {
    methods: ["post"],
    url: '/kalam/{kalam}/komentar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\KalamController::storeKomentar
* @see app/Http/Controllers/KalamController.php:225
* @route '/kalam/{kalam}/komentar'
*/
storeKomentar.url = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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
* @see app/Http/Controllers/KalamController.php:225
* @route '/kalam/{kalam}/komentar'
*/
storeKomentar.post = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeKomentar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KalamController::storeKomentar
* @see app/Http/Controllers/KalamController.php:225
* @route '/kalam/{kalam}/komentar'
*/
const storeKomentarForm = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeKomentar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KalamController::storeKomentar
* @see app/Http/Controllers/KalamController.php:225
* @route '/kalam/{kalam}/komentar'
*/
storeKomentarForm.post = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeKomentar.url(args, options),
    method: 'post',
})

storeKomentar.form = storeKomentarForm

/**
* @see \App\Http\Controllers\KalamController::storeReaksi
* @see app/Http/Controllers/KalamController.php:281
* @route '/kalam/{kalam}/reaksi'
*/
export const storeReaksi = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeReaksi.url(args, options),
    method: 'post',
})

storeReaksi.definition = {
    methods: ["post"],
    url: '/kalam/{kalam}/reaksi',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\KalamController::storeReaksi
* @see app/Http/Controllers/KalamController.php:281
* @route '/kalam/{kalam}/reaksi'
*/
storeReaksi.url = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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
* @see app/Http/Controllers/KalamController.php:281
* @route '/kalam/{kalam}/reaksi'
*/
storeReaksi.post = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeReaksi.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KalamController::storeReaksi
* @see app/Http/Controllers/KalamController.php:281
* @route '/kalam/{kalam}/reaksi'
*/
const storeReaksiForm = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeReaksi.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KalamController::storeReaksi
* @see app/Http/Controllers/KalamController.php:281
* @route '/kalam/{kalam}/reaksi'
*/
storeReaksiForm.post = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeReaksi.url(args, options),
    method: 'post',
})

storeReaksi.form = storeReaksiForm

/**
* @see \App\Http\Controllers\KalamController::index
* @see app/Http/Controllers/KalamController.php:44
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
* @see app/Http/Controllers/KalamController.php:44
* @route '/admin/kalam'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KalamController::index
* @see app/Http/Controllers/KalamController.php:44
* @route '/admin/kalam'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::index
* @see app/Http/Controllers/KalamController.php:44
* @route '/admin/kalam'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KalamController::index
* @see app/Http/Controllers/KalamController.php:44
* @route '/admin/kalam'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::index
* @see app/Http/Controllers/KalamController.php:44
* @route '/admin/kalam'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::index
* @see app/Http/Controllers/KalamController.php:44
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
* @see app/Http/Controllers/KalamController.php:63
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
* @see app/Http/Controllers/KalamController.php:63
* @route '/admin/kalam/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KalamController::create
* @see app/Http/Controllers/KalamController.php:63
* @route '/admin/kalam/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::create
* @see app/Http/Controllers/KalamController.php:63
* @route '/admin/kalam/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KalamController::create
* @see app/Http/Controllers/KalamController.php:63
* @route '/admin/kalam/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::create
* @see app/Http/Controllers/KalamController.php:63
* @route '/admin/kalam/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::create
* @see app/Http/Controllers/KalamController.php:63
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
* @see app/Http/Controllers/KalamController.php:68
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
* @see app/Http/Controllers/KalamController.php:68
* @route '/admin/kalam'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KalamController::store
* @see app/Http/Controllers/KalamController.php:68
* @route '/admin/kalam'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KalamController::store
* @see app/Http/Controllers/KalamController.php:68
* @route '/admin/kalam'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KalamController::store
* @see app/Http/Controllers/KalamController.php:68
* @route '/admin/kalam'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\KalamController::uploadImage
* @see app/Http/Controllers/KalamController.php:334
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
* @see app/Http/Controllers/KalamController.php:334
* @route '/admin/kalam/upload-image'
*/
uploadImage.url = (options?: RouteQueryOptions) => {
    return uploadImage.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KalamController::uploadImage
* @see app/Http/Controllers/KalamController.php:334
* @route '/admin/kalam/upload-image'
*/
uploadImage.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadImage.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KalamController::uploadImage
* @see app/Http/Controllers/KalamController.php:334
* @route '/admin/kalam/upload-image'
*/
const uploadImageForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadImage.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KalamController::uploadImage
* @see app/Http/Controllers/KalamController.php:334
* @route '/admin/kalam/upload-image'
*/
uploadImageForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadImage.url(options),
    method: 'post',
})

uploadImage.form = uploadImageForm

/**
* @see \App\Http\Controllers\KalamController::edit
* @see app/Http/Controllers/KalamController.php:89
* @route '/admin/kalam/{kalam}/edit'
*/
export const edit = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/kalam/{kalam}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KalamController::edit
* @see app/Http/Controllers/KalamController.php:89
* @route '/admin/kalam/{kalam}/edit'
*/
edit.url = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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
* @see app/Http/Controllers/KalamController.php:89
* @route '/admin/kalam/{kalam}/edit'
*/
edit.get = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::edit
* @see app/Http/Controllers/KalamController.php:89
* @route '/admin/kalam/{kalam}/edit'
*/
edit.head = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KalamController::edit
* @see app/Http/Controllers/KalamController.php:89
* @route '/admin/kalam/{kalam}/edit'
*/
const editForm = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::edit
* @see app/Http/Controllers/KalamController.php:89
* @route '/admin/kalam/{kalam}/edit'
*/
editForm.get = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::edit
* @see app/Http/Controllers/KalamController.php:89
* @route '/admin/kalam/{kalam}/edit'
*/
editForm.head = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see app/Http/Controllers/KalamController.php:105
* @route '/admin/kalam/{kalam}'
*/
const update7bc49cc822f2a5bb0799c40ffc1a4e77 = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update7bc49cc822f2a5bb0799c40ffc1a4e77.url(args, options),
    method: 'put',
})

update7bc49cc822f2a5bb0799c40ffc1a4e77.definition = {
    methods: ["put"],
    url: '/admin/kalam/{kalam}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\KalamController::update
* @see app/Http/Controllers/KalamController.php:105
* @route '/admin/kalam/{kalam}'
*/
update7bc49cc822f2a5bb0799c40ffc1a4e77.url = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return update7bc49cc822f2a5bb0799c40ffc1a4e77.definition.url
            .replace('{kalam}', parsedArgs.kalam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KalamController::update
* @see app/Http/Controllers/KalamController.php:105
* @route '/admin/kalam/{kalam}'
*/
update7bc49cc822f2a5bb0799c40ffc1a4e77.put = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update7bc49cc822f2a5bb0799c40ffc1a4e77.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\KalamController::update
* @see app/Http/Controllers/KalamController.php:105
* @route '/admin/kalam/{kalam}'
*/
const update7bc49cc822f2a5bb0799c40ffc1a4e77Form = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update7bc49cc822f2a5bb0799c40ffc1a4e77.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KalamController::update
* @see app/Http/Controllers/KalamController.php:105
* @route '/admin/kalam/{kalam}'
*/
update7bc49cc822f2a5bb0799c40ffc1a4e77Form.put = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update7bc49cc822f2a5bb0799c40ffc1a4e77.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update7bc49cc822f2a5bb0799c40ffc1a4e77.form = update7bc49cc822f2a5bb0799c40ffc1a4e77Form
/**
* @see \App\Http\Controllers\KalamController::update
* @see app/Http/Controllers/KalamController.php:105
* @route '/admin/kalam/{kalam}'
*/
const update7bc49cc822f2a5bb0799c40ffc1a4e77 = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update7bc49cc822f2a5bb0799c40ffc1a4e77.url(args, options),
    method: 'patch',
})

update7bc49cc822f2a5bb0799c40ffc1a4e77.definition = {
    methods: ["patch"],
    url: '/admin/kalam/{kalam}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\KalamController::update
* @see app/Http/Controllers/KalamController.php:105
* @route '/admin/kalam/{kalam}'
*/
update7bc49cc822f2a5bb0799c40ffc1a4e77.url = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return update7bc49cc822f2a5bb0799c40ffc1a4e77.definition.url
            .replace('{kalam}', parsedArgs.kalam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KalamController::update
* @see app/Http/Controllers/KalamController.php:105
* @route '/admin/kalam/{kalam}'
*/
update7bc49cc822f2a5bb0799c40ffc1a4e77.patch = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update7bc49cc822f2a5bb0799c40ffc1a4e77.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\KalamController::update
* @see app/Http/Controllers/KalamController.php:105
* @route '/admin/kalam/{kalam}'
*/
const update7bc49cc822f2a5bb0799c40ffc1a4e77Form = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update7bc49cc822f2a5bb0799c40ffc1a4e77.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\KalamController::update
* @see app/Http/Controllers/KalamController.php:105
* @route '/admin/kalam/{kalam}'
*/
update7bc49cc822f2a5bb0799c40ffc1a4e77Form.patch = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update7bc49cc822f2a5bb0799c40ffc1a4e77.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update7bc49cc822f2a5bb0799c40ffc1a4e77.form = update7bc49cc822f2a5bb0799c40ffc1a4e77Form

export const update = {
    '/admin/kalam/{kalam}': update7bc49cc822f2a5bb0799c40ffc1a4e77,
    '/admin/kalam/{kalam}': update7bc49cc822f2a5bb0799c40ffc1a4e77,
}

/**
* @see \App\Http\Controllers\KalamController::reaksi
* @see app/Http/Controllers/KalamController.php:134
* @route '/admin/kalam/{kalam}/reaksi'
*/
export const reaksi = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reaksi.url(args, options),
    method: 'get',
})

reaksi.definition = {
    methods: ["get","head"],
    url: '/admin/kalam/{kalam}/reaksi',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KalamController::reaksi
* @see app/Http/Controllers/KalamController.php:134
* @route '/admin/kalam/{kalam}/reaksi'
*/
reaksi.url = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return reaksi.definition.url
            .replace('{kalam}', parsedArgs.kalam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KalamController::reaksi
* @see app/Http/Controllers/KalamController.php:134
* @route '/admin/kalam/{kalam}/reaksi'
*/
reaksi.get = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reaksi.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::reaksi
* @see app/Http/Controllers/KalamController.php:134
* @route '/admin/kalam/{kalam}/reaksi'
*/
reaksi.head = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reaksi.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KalamController::reaksi
* @see app/Http/Controllers/KalamController.php:134
* @route '/admin/kalam/{kalam}/reaksi'
*/
const reaksiForm = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: reaksi.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::reaksi
* @see app/Http/Controllers/KalamController.php:134
* @route '/admin/kalam/{kalam}/reaksi'
*/
reaksiForm.get = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: reaksi.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::reaksi
* @see app/Http/Controllers/KalamController.php:134
* @route '/admin/kalam/{kalam}/reaksi'
*/
reaksiForm.head = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: reaksi.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

reaksi.form = reaksiForm

/**
* @see \App\Http\Controllers\KalamController::komentar
* @see app/Http/Controllers/KalamController.php:168
* @route '/admin/kalam/{kalam}/komentar'
*/
export const komentar = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: komentar.url(args, options),
    method: 'get',
})

komentar.definition = {
    methods: ["get","head"],
    url: '/admin/kalam/{kalam}/komentar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KalamController::komentar
* @see app/Http/Controllers/KalamController.php:168
* @route '/admin/kalam/{kalam}/komentar'
*/
komentar.url = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return komentar.definition.url
            .replace('{kalam}', parsedArgs.kalam.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KalamController::komentar
* @see app/Http/Controllers/KalamController.php:168
* @route '/admin/kalam/{kalam}/komentar'
*/
komentar.get = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: komentar.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::komentar
* @see app/Http/Controllers/KalamController.php:168
* @route '/admin/kalam/{kalam}/komentar'
*/
komentar.head = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: komentar.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KalamController::komentar
* @see app/Http/Controllers/KalamController.php:168
* @route '/admin/kalam/{kalam}/komentar'
*/
const komentarForm = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: komentar.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::komentar
* @see app/Http/Controllers/KalamController.php:168
* @route '/admin/kalam/{kalam}/komentar'
*/
komentarForm.get = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: komentar.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::komentar
* @see app/Http/Controllers/KalamController.php:168
* @route '/admin/kalam/{kalam}/komentar'
*/
komentarForm.head = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: komentar.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

komentar.form = komentarForm

/**
* @see \App\Http\Controllers\KalamController::destroy
* @see app/Http/Controllers/KalamController.php:326
* @route '/admin/kalam/{kalam}'
*/
export const destroy = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/kalam/{kalam}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\KalamController::destroy
* @see app/Http/Controllers/KalamController.php:326
* @route '/admin/kalam/{kalam}'
*/
destroy.url = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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
* @see app/Http/Controllers/KalamController.php:326
* @route '/admin/kalam/{kalam}'
*/
destroy.delete = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\KalamController::destroy
* @see app/Http/Controllers/KalamController.php:326
* @route '/admin/kalam/{kalam}'
*/
const destroyForm = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/KalamController.php:326
* @route '/admin/kalam/{kalam}'
*/
destroyForm.delete = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/KalamController.php:192
* @route '/kalam/{kalam}'
*/
export const show = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/kalam/{kalam}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KalamController::show
* @see app/Http/Controllers/KalamController.php:192
* @route '/kalam/{kalam}'
*/
show.url = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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
* @see app/Http/Controllers/KalamController.php:192
* @route '/kalam/{kalam}'
*/
show.get = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::show
* @see app/Http/Controllers/KalamController.php:192
* @route '/kalam/{kalam}'
*/
show.head = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KalamController::show
* @see app/Http/Controllers/KalamController.php:192
* @route '/kalam/{kalam}'
*/
const showForm = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::show
* @see app/Http/Controllers/KalamController.php:192
* @route '/kalam/{kalam}'
*/
showForm.get = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::show
* @see app/Http/Controllers/KalamController.php:192
* @route '/kalam/{kalam}'
*/
showForm.head = (args: { kalam: string | { slug: string } } | [kalam: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const KalamController = { kalam, storeKomentar, storeReaksi, index, create, store, uploadImage, edit, update, reaksi, komentar, destroy, show }

export default KalamController