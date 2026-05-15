import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../wayfinder'
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: login.url(options),
    method: 'get',
})

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: login.url(options),
    method: 'get',
})

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: login.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

login.form = loginForm

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
* @route '/logout'
*/
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
* @route '/logout'
*/
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
* @route '/logout'
*/
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
* @route '/logout'
*/
const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: logout.url(options),
    method: 'post',
})

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
* @route '/logout'
*/
logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: logout.url(options),
    method: 'post',
})

logout.form = logoutForm

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: register.url(options),
    method: 'get',
})

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: register.url(options),
    method: 'get',
})

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
registerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: register.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

register.form = registerForm

/**
* @see routes/web.php:10
* @route '/'
*/
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:10
* @route '/'
*/
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
* @see routes/web.php:10
* @route '/'
*/
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

/**
* @see routes/web.php:10
* @route '/'
*/
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})

/**
* @see routes/web.php:10
* @route '/'
*/
const homeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: home.url(options),
    method: 'get',
})

/**
* @see routes/web.php:10
* @route '/'
*/
homeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: home.url(options),
    method: 'get',
})

/**
* @see routes/web.php:10
* @route '/'
*/
homeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: home.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

home.form = homeForm

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/laporan-riyadhoh'
*/
export const laporanRiyadhoh = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: laporanRiyadhoh.url(options),
    method: 'get',
})

laporanRiyadhoh.definition = {
    methods: ["get","head"],
    url: '/laporan-riyadhoh',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/laporan-riyadhoh'
*/
laporanRiyadhoh.url = (options?: RouteQueryOptions) => {
    return laporanRiyadhoh.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/laporan-riyadhoh'
*/
laporanRiyadhoh.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: laporanRiyadhoh.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/laporan-riyadhoh'
*/
laporanRiyadhoh.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: laporanRiyadhoh.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/laporan-riyadhoh'
*/
const laporanRiyadhohForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: laporanRiyadhoh.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/laporan-riyadhoh'
*/
laporanRiyadhohForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: laporanRiyadhoh.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/laporan-riyadhoh'
*/
laporanRiyadhohForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: laporanRiyadhoh.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

laporanRiyadhoh.form = laporanRiyadhohForm

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/amal-ibadah'
*/
export const amalIbadah = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: amalIbadah.url(options),
    method: 'get',
})

amalIbadah.definition = {
    methods: ["get","head"],
    url: '/amal-ibadah',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/amal-ibadah'
*/
amalIbadah.url = (options?: RouteQueryOptions) => {
    return amalIbadah.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/amal-ibadah'
*/
amalIbadah.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: amalIbadah.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/amal-ibadah'
*/
amalIbadah.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: amalIbadah.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/amal-ibadah'
*/
const amalIbadahForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: amalIbadah.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/amal-ibadah'
*/
amalIbadahForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: amalIbadah.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/amal-ibadah'
*/
amalIbadahForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: amalIbadah.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

amalIbadah.form = amalIbadahForm

/**
* @see \App\Http\Controllers\KalamController::kalam
* @see app/Http/Controllers/KalamController.php:12
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
* @see app/Http/Controllers/KalamController.php:12
* @route '/kalam'
*/
kalam.url = (options?: RouteQueryOptions) => {
    return kalam.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KalamController::kalam
* @see app/Http/Controllers/KalamController.php:12
* @route '/kalam'
*/
kalam.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: kalam.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::kalam
* @see app/Http/Controllers/KalamController.php:12
* @route '/kalam'
*/
kalam.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: kalam.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\KalamController::kalam
* @see app/Http/Controllers/KalamController.php:12
* @route '/kalam'
*/
const kalamForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: kalam.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::kalam
* @see app/Http/Controllers/KalamController.php:12
* @route '/kalam'
*/
kalamForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: kalam.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\KalamController::kalam
* @see app/Http/Controllers/KalamController.php:12
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
* @see \App\Http\Controllers\DonasiController::donasi
* @see app/Http/Controllers/DonasiController.php:16
* @route '/donasi'
*/
export const donasi = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: donasi.url(options),
    method: 'get',
})

donasi.definition = {
    methods: ["get","head"],
    url: '/donasi',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DonasiController::donasi
* @see app/Http/Controllers/DonasiController.php:16
* @route '/donasi'
*/
donasi.url = (options?: RouteQueryOptions) => {
    return donasi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DonasiController::donasi
* @see app/Http/Controllers/DonasiController.php:16
* @route '/donasi'
*/
donasi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: donasi.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::donasi
* @see app/Http/Controllers/DonasiController.php:16
* @route '/donasi'
*/
donasi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: donasi.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DonasiController::donasi
* @see app/Http/Controllers/DonasiController.php:16
* @route '/donasi'
*/
const donasiForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: donasi.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::donasi
* @see app/Http/Controllers/DonasiController.php:16
* @route '/donasi'
*/
donasiForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: donasi.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DonasiController::donasi
* @see app/Http/Controllers/DonasiController.php:16
* @route '/donasi'
*/
donasiForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: donasi.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

donasi.form = donasiForm

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/halaman-dibangun'
*/
export const halamanDibangun = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: halamanDibangun.url(options),
    method: 'get',
})

halamanDibangun.definition = {
    methods: ["get","head"],
    url: '/halaman-dibangun',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/halaman-dibangun'
*/
halamanDibangun.url = (options?: RouteQueryOptions) => {
    return halamanDibangun.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/halaman-dibangun'
*/
halamanDibangun.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: halamanDibangun.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/halaman-dibangun'
*/
halamanDibangun.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: halamanDibangun.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/halaman-dibangun'
*/
const halamanDibangunForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: halamanDibangun.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/halaman-dibangun'
*/
halamanDibangunForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: halamanDibangun.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/halaman-dibangun'
*/
halamanDibangunForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: halamanDibangun.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

halamanDibangun.form = halamanDibangunForm

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

dashboard.form = dashboardForm

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::logRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:61
* @route '/log-riyadhoh'
*/
export const logRiyadhoh = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logRiyadhoh.url(options),
    method: 'get',
})

logRiyadhoh.definition = {
    methods: ["get","head"],
    url: '/log-riyadhoh',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::logRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:61
* @route '/log-riyadhoh'
*/
logRiyadhoh.url = (options?: RouteQueryOptions) => {
    return logRiyadhoh.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::logRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:61
* @route '/log-riyadhoh'
*/
logRiyadhoh.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logRiyadhoh.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::logRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:61
* @route '/log-riyadhoh'
*/
logRiyadhoh.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: logRiyadhoh.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::logRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:61
* @route '/log-riyadhoh'
*/
const logRiyadhohForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: logRiyadhoh.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::logRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:61
* @route '/log-riyadhoh'
*/
logRiyadhohForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: logRiyadhoh.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::logRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:61
* @route '/log-riyadhoh'
*/
logRiyadhohForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: logRiyadhoh.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

logRiyadhoh.form = logRiyadhohForm

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::raporRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:120
* @route '/rapor-riyadhoh'
*/
export const raporRiyadhoh = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: raporRiyadhoh.url(options),
    method: 'get',
})

raporRiyadhoh.definition = {
    methods: ["get","head"],
    url: '/rapor-riyadhoh',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::raporRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:120
* @route '/rapor-riyadhoh'
*/
raporRiyadhoh.url = (options?: RouteQueryOptions) => {
    return raporRiyadhoh.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::raporRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:120
* @route '/rapor-riyadhoh'
*/
raporRiyadhoh.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: raporRiyadhoh.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::raporRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:120
* @route '/rapor-riyadhoh'
*/
raporRiyadhoh.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: raporRiyadhoh.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::raporRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:120
* @route '/rapor-riyadhoh'
*/
const raporRiyadhohForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: raporRiyadhoh.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::raporRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:120
* @route '/rapor-riyadhoh'
*/
raporRiyadhohForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: raporRiyadhoh.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LaporanRiyadhohController::raporRiyadhoh
* @see app/Http/Controllers/LaporanRiyadhohController.php:120
* @route '/rapor-riyadhoh'
*/
raporRiyadhohForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: raporRiyadhoh.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

raporRiyadhoh.form = raporRiyadhohForm
