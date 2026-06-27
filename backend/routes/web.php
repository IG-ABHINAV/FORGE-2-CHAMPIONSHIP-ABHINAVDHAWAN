<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'PulseDesk API',
        'status' => 'ok',
    ]);
});
