import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see routes/web.php:103
* @route '/admin/tentang-saya'
*/
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/tentang-saya',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:103
* @route '/admin/tentang-saya'
*/
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see routes/web.php:103
* @route '/admin/tentang-saya'
*/
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

/**
* @see routes/web.php:103
* @route '/admin/tentang-saya'
*/
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

/**
* @see routes/web.php:103
* @route '/admin/tentang-saya'
*/
const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see routes/web.php:103
* @route '/admin/tentang-saya'
*/
editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see routes/web.php:103
* @route '/admin/tentang-saya'
*/
editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\TentangSayaController::update
* @see app/Http/Controllers/TentangSayaController.php:9
* @route '/admin/tentang-saya'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/admin/tentang-saya',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TentangSayaController::update
* @see app/Http/Controllers/TentangSayaController.php:9
* @route '/admin/tentang-saya'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TentangSayaController::update
* @see app/Http/Controllers/TentangSayaController.php:9
* @route '/admin/tentang-saya'
*/
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TentangSayaController::update
* @see app/Http/Controllers/TentangSayaController.php:9
* @route '/admin/tentang-saya'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TentangSayaController::update
* @see app/Http/Controllers/TentangSayaController.php:9
* @route '/admin/tentang-saya'
*/
updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(options),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\TentangSayaController::uploadImage
* @see app/Http/Controllers/TentangSayaController.php:24
* @route '/admin/tentang-saya/upload-image'
*/
export const uploadImage = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadImage.url(options),
    method: 'post',
})

uploadImage.definition = {
    methods: ["post"],
    url: '/admin/tentang-saya/upload-image',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TentangSayaController::uploadImage
* @see app/Http/Controllers/TentangSayaController.php:24
* @route '/admin/tentang-saya/upload-image'
*/
uploadImage.url = (options?: RouteQueryOptions) => {
    return uploadImage.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TentangSayaController::uploadImage
* @see app/Http/Controllers/TentangSayaController.php:24
* @route '/admin/tentang-saya/upload-image'
*/
uploadImage.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadImage.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TentangSayaController::uploadImage
* @see app/Http/Controllers/TentangSayaController.php:24
* @route '/admin/tentang-saya/upload-image'
*/
const uploadImageForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadImage.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TentangSayaController::uploadImage
* @see app/Http/Controllers/TentangSayaController.php:24
* @route '/admin/tentang-saya/upload-image'
*/
uploadImageForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadImage.url(options),
    method: 'post',
})

uploadImage.form = uploadImageForm

const tentangSaya = {
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    uploadImage: Object.assign(uploadImage, uploadImage),
}

export default tentangSaya