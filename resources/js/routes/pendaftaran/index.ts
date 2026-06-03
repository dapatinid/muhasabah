import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penulis'
*/
export const penulis = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: penulis.url(options),
    method: 'get',
})

penulis.definition = {
    methods: ["get","head"],
    url: '/pendaftaran/penulis',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penulis'
*/
penulis.url = (options?: RouteQueryOptions) => {
    return penulis.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penulis'
*/
penulis.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: penulis.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penulis'
*/
penulis.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: penulis.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penulis'
*/
const penulisForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: penulis.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penulis'
*/
penulisForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: penulis.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penulis'
*/
penulisForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: penulis.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

penulis.form = penulisForm

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penggalang-dana'
*/
export const penggalangDana = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: penggalangDana.url(options),
    method: 'get',
})

penggalangDana.definition = {
    methods: ["get","head"],
    url: '/pendaftaran/penggalang-dana',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penggalang-dana'
*/
penggalangDana.url = (options?: RouteQueryOptions) => {
    return penggalangDana.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penggalang-dana'
*/
penggalangDana.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: penggalangDana.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penggalang-dana'
*/
penggalangDana.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: penggalangDana.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penggalang-dana'
*/
const penggalangDanaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: penggalangDana.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penggalang-dana'
*/
penggalangDanaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: penggalangDana.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penggalang-dana'
*/
penggalangDanaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: penggalangDana.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

penggalangDana.form = penggalangDanaForm

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penyelenggara-acara'
*/
export const penyelenggaraAcara = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: penyelenggaraAcara.url(options),
    method: 'get',
})

penyelenggaraAcara.definition = {
    methods: ["get","head"],
    url: '/pendaftaran/penyelenggara-acara',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penyelenggara-acara'
*/
penyelenggaraAcara.url = (options?: RouteQueryOptions) => {
    return penyelenggaraAcara.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penyelenggara-acara'
*/
penyelenggaraAcara.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: penyelenggaraAcara.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penyelenggara-acara'
*/
penyelenggaraAcara.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: penyelenggaraAcara.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penyelenggara-acara'
*/
const penyelenggaraAcaraForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: penyelenggaraAcara.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penyelenggara-acara'
*/
penyelenggaraAcaraForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: penyelenggaraAcara.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penyelenggara-acara'
*/
penyelenggaraAcaraForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: penyelenggaraAcara.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

penyelenggaraAcara.form = penyelenggaraAcaraForm

const pendaftaran = {
    penulis: Object.assign(penulis, penulis),
    penggalangDana: Object.assign(penggalangDana, penggalangDana),
    penyelenggaraAcara: Object.assign(penyelenggaraAcara, penyelenggaraAcara),
}

export default pendaftaran