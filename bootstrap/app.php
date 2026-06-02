<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->validateCsrfTokens(except: [
                    '/webhook/mayar',
                ]);

        $middleware->web(append: [           
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'is_active'     => \App\Http\Middleware\CheckIsActive::class,
            'admin'         => \App\Http\Middleware\AdminMiddleware::class,
            'control.panel' => \App\Http\Middleware\CanAccessControlPanel::class,
            'super.admin'   => \App\Http\Middleware\SuperAdmin::class,
        ]);        
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
