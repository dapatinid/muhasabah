import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TentangSayaController::storeOrUpdate
* @see app/Http/Controllers/TentangSayaController.php:9
* @route '/admin/tentang-saya'
*/
export const storeOrUpdate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeOrUpdate.url(options),
    method: 'post',
})

storeOrUpdate.definition = {
    methods: ["post"],
    url: '/admin/tentang-saya',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TentangSayaController::storeOrUpdate
* @see app/Http/Controllers/TentangSayaController.php:9
* @route '/admin/tentang-saya'
*/
storeOrUpdate.url = (options?: RouteQueryOptions) => {
    return storeOrUpdate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TentangSayaController::storeOrUpdate
* @see app/Http/Controllers/TentangSayaController.php:9
* @route '/admin/tentang-saya'
*/
storeOrUpdate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeOrUpdate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TentangSayaController::storeOrUpdate
* @see app/Http/Controllers/TentangSayaController.php:9
* @route '/admin/tentang-saya'
*/
const storeOrUpdateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeOrUpdate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TentangSayaController::storeOrUpdate
* @see app/Http/Controllers/TentangSayaController.php:9
* @route '/admin/tentang-saya'
*/
storeOrUpdateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeOrUpdate.url(options),
    method: 'post',
})

storeOrUpdate.form = storeOrUpdateForm

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

const TentangSayaController = { storeOrUpdate, uploadImage }

export default TentangSayaController