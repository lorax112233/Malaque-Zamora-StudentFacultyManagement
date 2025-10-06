<?php

use Illuminate\Support\Facades\Route;

// SPA catch-all
Route::get('/{any}', function () {
    return view('welcome'); // now using welcome.blade.php
})->where('any', '.*');
