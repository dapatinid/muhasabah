import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/kebijakan-privasi'
*/
const Controller8d420e8836099d9098a665641f2faef3 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller8d420e8836099d9098a665641f2faef3.url(options),
    method: 'get',
})

Controller8d420e8836099d9098a665641f2faef3.definition = {
    methods: ["get","head"],
    url: '/kebijakan-privasi',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/kebijakan-privasi'
*/
Controller8d420e8836099d9098a665641f2faef3.url = (options?: RouteQueryOptions) => {
    return Controller8d420e8836099d9098a665641f2faef3.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/kebijakan-privasi'
*/
Controller8d420e8836099d9098a665641f2faef3.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller8d420e8836099d9098a665641f2faef3.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/kebijakan-privasi'
*/
Controller8d420e8836099d9098a665641f2faef3.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller8d420e8836099d9098a665641f2faef3.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/kebijakan-privasi'
*/
const Controller8d420e8836099d9098a665641f2faef3Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller8d420e8836099d9098a665641f2faef3.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/kebijakan-privasi'
*/
Controller8d420e8836099d9098a665641f2faef3Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller8d420e8836099d9098a665641f2faef3.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/kebijakan-privasi'
*/
Controller8d420e8836099d9098a665641f2faef3Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller8d420e8836099d9098a665641f2faef3.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller8d420e8836099d9098a665641f2faef3.form = Controller8d420e8836099d9098a665641f2faef3Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/syarat-ketentuan'
*/
const Controller03293bd771fb203395c1b7dcfc34d6ff = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller03293bd771fb203395c1b7dcfc34d6ff.url(options),
    method: 'get',
})

Controller03293bd771fb203395c1b7dcfc34d6ff.definition = {
    methods: ["get","head"],
    url: '/syarat-ketentuan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/syarat-ketentuan'
*/
Controller03293bd771fb203395c1b7dcfc34d6ff.url = (options?: RouteQueryOptions) => {
    return Controller03293bd771fb203395c1b7dcfc34d6ff.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/syarat-ketentuan'
*/
Controller03293bd771fb203395c1b7dcfc34d6ff.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller03293bd771fb203395c1b7dcfc34d6ff.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/syarat-ketentuan'
*/
Controller03293bd771fb203395c1b7dcfc34d6ff.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller03293bd771fb203395c1b7dcfc34d6ff.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/syarat-ketentuan'
*/
const Controller03293bd771fb203395c1b7dcfc34d6ffForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller03293bd771fb203395c1b7dcfc34d6ff.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/syarat-ketentuan'
*/
Controller03293bd771fb203395c1b7dcfc34d6ffForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller03293bd771fb203395c1b7dcfc34d6ff.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/syarat-ketentuan'
*/
Controller03293bd771fb203395c1b7dcfc34d6ffForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller03293bd771fb203395c1b7dcfc34d6ff.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller03293bd771fb203395c1b7dcfc34d6ff.form = Controller03293bd771fb203395c1b7dcfc34d6ffForm
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/laporan-riyadhoh'
*/
const Controllerd695224dce3196d1787d0802ce2060c0 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerd695224dce3196d1787d0802ce2060c0.url(options),
    method: 'get',
})

Controllerd695224dce3196d1787d0802ce2060c0.definition = {
    methods: ["get","head"],
    url: '/laporan-riyadhoh',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/laporan-riyadhoh'
*/
Controllerd695224dce3196d1787d0802ce2060c0.url = (options?: RouteQueryOptions) => {
    return Controllerd695224dce3196d1787d0802ce2060c0.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/laporan-riyadhoh'
*/
Controllerd695224dce3196d1787d0802ce2060c0.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerd695224dce3196d1787d0802ce2060c0.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/laporan-riyadhoh'
*/
Controllerd695224dce3196d1787d0802ce2060c0.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllerd695224dce3196d1787d0802ce2060c0.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/laporan-riyadhoh'
*/
const Controllerd695224dce3196d1787d0802ce2060c0Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllerd695224dce3196d1787d0802ce2060c0.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/laporan-riyadhoh'
*/
Controllerd695224dce3196d1787d0802ce2060c0Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllerd695224dce3196d1787d0802ce2060c0.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/laporan-riyadhoh'
*/
Controllerd695224dce3196d1787d0802ce2060c0Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllerd695224dce3196d1787d0802ce2060c0.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controllerd695224dce3196d1787d0802ce2060c0.form = Controllerd695224dce3196d1787d0802ce2060c0Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/amal-ibadah'
*/
const Controller0ae8bd5ae264ec9c75cf771d5afced2f = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller0ae8bd5ae264ec9c75cf771d5afced2f.url(options),
    method: 'get',
})

Controller0ae8bd5ae264ec9c75cf771d5afced2f.definition = {
    methods: ["get","head"],
    url: '/amal-ibadah',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/amal-ibadah'
*/
Controller0ae8bd5ae264ec9c75cf771d5afced2f.url = (options?: RouteQueryOptions) => {
    return Controller0ae8bd5ae264ec9c75cf771d5afced2f.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/amal-ibadah'
*/
Controller0ae8bd5ae264ec9c75cf771d5afced2f.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller0ae8bd5ae264ec9c75cf771d5afced2f.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/amal-ibadah'
*/
Controller0ae8bd5ae264ec9c75cf771d5afced2f.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller0ae8bd5ae264ec9c75cf771d5afced2f.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/amal-ibadah'
*/
const Controller0ae8bd5ae264ec9c75cf771d5afced2fForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller0ae8bd5ae264ec9c75cf771d5afced2f.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/amal-ibadah'
*/
Controller0ae8bd5ae264ec9c75cf771d5afced2fForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller0ae8bd5ae264ec9c75cf771d5afced2f.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/amal-ibadah'
*/
Controller0ae8bd5ae264ec9c75cf771d5afced2fForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller0ae8bd5ae264ec9c75cf771d5afced2f.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller0ae8bd5ae264ec9c75cf771d5afced2f.form = Controller0ae8bd5ae264ec9c75cf771d5afced2fForm
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/halaman-dibangun'
*/
const Controllera0a232698784441c4a3e6e34ee783364 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllera0a232698784441c4a3e6e34ee783364.url(options),
    method: 'get',
})

Controllera0a232698784441c4a3e6e34ee783364.definition = {
    methods: ["get","head"],
    url: '/halaman-dibangun',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/halaman-dibangun'
*/
Controllera0a232698784441c4a3e6e34ee783364.url = (options?: RouteQueryOptions) => {
    return Controllera0a232698784441c4a3e6e34ee783364.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/halaman-dibangun'
*/
Controllera0a232698784441c4a3e6e34ee783364.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllera0a232698784441c4a3e6e34ee783364.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/halaman-dibangun'
*/
Controllera0a232698784441c4a3e6e34ee783364.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllera0a232698784441c4a3e6e34ee783364.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/halaman-dibangun'
*/
const Controllera0a232698784441c4a3e6e34ee783364Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllera0a232698784441c4a3e6e34ee783364.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/halaman-dibangun'
*/
Controllera0a232698784441c4a3e6e34ee783364Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllera0a232698784441c4a3e6e34ee783364.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/halaman-dibangun'
*/
Controllera0a232698784441c4a3e6e34ee783364Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllera0a232698784441c4a3e6e34ee783364.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controllera0a232698784441c4a3e6e34ee783364.form = Controllera0a232698784441c4a3e6e34ee783364Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/relawan-donatur'
*/
const Controller89a4b2c3a8c2dc9fdef49e8fa41784f3 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller89a4b2c3a8c2dc9fdef49e8fa41784f3.url(options),
    method: 'get',
})

Controller89a4b2c3a8c2dc9fdef49e8fa41784f3.definition = {
    methods: ["get","head"],
    url: '/pendaftaran/relawan-donatur',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/relawan-donatur'
*/
Controller89a4b2c3a8c2dc9fdef49e8fa41784f3.url = (options?: RouteQueryOptions) => {
    return Controller89a4b2c3a8c2dc9fdef49e8fa41784f3.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/relawan-donatur'
*/
Controller89a4b2c3a8c2dc9fdef49e8fa41784f3.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller89a4b2c3a8c2dc9fdef49e8fa41784f3.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/relawan-donatur'
*/
Controller89a4b2c3a8c2dc9fdef49e8fa41784f3.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller89a4b2c3a8c2dc9fdef49e8fa41784f3.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/relawan-donatur'
*/
const Controller89a4b2c3a8c2dc9fdef49e8fa41784f3Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller89a4b2c3a8c2dc9fdef49e8fa41784f3.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/relawan-donatur'
*/
Controller89a4b2c3a8c2dc9fdef49e8fa41784f3Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller89a4b2c3a8c2dc9fdef49e8fa41784f3.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/relawan-donatur'
*/
Controller89a4b2c3a8c2dc9fdef49e8fa41784f3Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller89a4b2c3a8c2dc9fdef49e8fa41784f3.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller89a4b2c3a8c2dc9fdef49e8fa41784f3.form = Controller89a4b2c3a8c2dc9fdef49e8fa41784f3Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penulis'
*/
const Controllerc28ff98a1abedae6b846834b62651fdd = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerc28ff98a1abedae6b846834b62651fdd.url(options),
    method: 'get',
})

Controllerc28ff98a1abedae6b846834b62651fdd.definition = {
    methods: ["get","head"],
    url: '/pendaftaran/penulis',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penulis'
*/
Controllerc28ff98a1abedae6b846834b62651fdd.url = (options?: RouteQueryOptions) => {
    return Controllerc28ff98a1abedae6b846834b62651fdd.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penulis'
*/
Controllerc28ff98a1abedae6b846834b62651fdd.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerc28ff98a1abedae6b846834b62651fdd.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penulis'
*/
Controllerc28ff98a1abedae6b846834b62651fdd.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllerc28ff98a1abedae6b846834b62651fdd.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penulis'
*/
const Controllerc28ff98a1abedae6b846834b62651fddForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllerc28ff98a1abedae6b846834b62651fdd.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penulis'
*/
Controllerc28ff98a1abedae6b846834b62651fddForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllerc28ff98a1abedae6b846834b62651fdd.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penulis'
*/
Controllerc28ff98a1abedae6b846834b62651fddForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllerc28ff98a1abedae6b846834b62651fdd.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controllerc28ff98a1abedae6b846834b62651fdd.form = Controllerc28ff98a1abedae6b846834b62651fddForm
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penggalang-dana'
*/
const Controller4a5f04b4aa2d7cd4b7f1c6e4e8dbcf65 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller4a5f04b4aa2d7cd4b7f1c6e4e8dbcf65.url(options),
    method: 'get',
})

Controller4a5f04b4aa2d7cd4b7f1c6e4e8dbcf65.definition = {
    methods: ["get","head"],
    url: '/pendaftaran/penggalang-dana',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penggalang-dana'
*/
Controller4a5f04b4aa2d7cd4b7f1c6e4e8dbcf65.url = (options?: RouteQueryOptions) => {
    return Controller4a5f04b4aa2d7cd4b7f1c6e4e8dbcf65.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penggalang-dana'
*/
Controller4a5f04b4aa2d7cd4b7f1c6e4e8dbcf65.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller4a5f04b4aa2d7cd4b7f1c6e4e8dbcf65.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penggalang-dana'
*/
Controller4a5f04b4aa2d7cd4b7f1c6e4e8dbcf65.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller4a5f04b4aa2d7cd4b7f1c6e4e8dbcf65.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penggalang-dana'
*/
const Controller4a5f04b4aa2d7cd4b7f1c6e4e8dbcf65Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller4a5f04b4aa2d7cd4b7f1c6e4e8dbcf65.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penggalang-dana'
*/
Controller4a5f04b4aa2d7cd4b7f1c6e4e8dbcf65Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller4a5f04b4aa2d7cd4b7f1c6e4e8dbcf65.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penggalang-dana'
*/
Controller4a5f04b4aa2d7cd4b7f1c6e4e8dbcf65Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller4a5f04b4aa2d7cd4b7f1c6e4e8dbcf65.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller4a5f04b4aa2d7cd4b7f1c6e4e8dbcf65.form = Controller4a5f04b4aa2d7cd4b7f1c6e4e8dbcf65Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penyelenggara-acara'
*/
const Controllerc159247004fc5584428c19c841705317 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerc159247004fc5584428c19c841705317.url(options),
    method: 'get',
})

Controllerc159247004fc5584428c19c841705317.definition = {
    methods: ["get","head"],
    url: '/pendaftaran/penyelenggara-acara',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penyelenggara-acara'
*/
Controllerc159247004fc5584428c19c841705317.url = (options?: RouteQueryOptions) => {
    return Controllerc159247004fc5584428c19c841705317.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penyelenggara-acara'
*/
Controllerc159247004fc5584428c19c841705317.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerc159247004fc5584428c19c841705317.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penyelenggara-acara'
*/
Controllerc159247004fc5584428c19c841705317.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllerc159247004fc5584428c19c841705317.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penyelenggara-acara'
*/
const Controllerc159247004fc5584428c19c841705317Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllerc159247004fc5584428c19c841705317.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penyelenggara-acara'
*/
Controllerc159247004fc5584428c19c841705317Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllerc159247004fc5584428c19c841705317.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/pendaftaran/penyelenggara-acara'
*/
Controllerc159247004fc5584428c19c841705317Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllerc159247004fc5584428c19c841705317.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controllerc159247004fc5584428c19c841705317.form = Controllerc159247004fc5584428c19c841705317Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
const Controllere19ee86e9cf603ce1a59a1ec5d21dec5 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})

Controllere19ee86e9cf603ce1a59a1ec5d21dec5.definition = {
    methods: ["get","head"],
    url: '/settings/appearance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url = (options?: RouteQueryOptions) => {
    return Controllere19ee86e9cf603ce1a59a1ec5d21dec5.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
const Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controllere19ee86e9cf603ce1a59a1ec5d21dec5.form = Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form

const Controller = {
    '/kebijakan-privasi': Controller8d420e8836099d9098a665641f2faef3,
    '/syarat-ketentuan': Controller03293bd771fb203395c1b7dcfc34d6ff,
    '/laporan-riyadhoh': Controllerd695224dce3196d1787d0802ce2060c0,
    '/amal-ibadah': Controller0ae8bd5ae264ec9c75cf771d5afced2f,
    '/halaman-dibangun': Controllera0a232698784441c4a3e6e34ee783364,
    '/pendaftaran/relawan-donatur': Controller89a4b2c3a8c2dc9fdef49e8fa41784f3,
    '/pendaftaran/penulis': Controllerc28ff98a1abedae6b846834b62651fdd,
    '/pendaftaran/penggalang-dana': Controller4a5f04b4aa2d7cd4b7f1c6e4e8dbcf65,
    '/pendaftaran/penyelenggara-acara': Controllerc159247004fc5584428c19c841705317,
    '/settings/appearance': Controllere19ee86e9cf603ce1a59a1ec5d21dec5,
}

export default Controller