<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\AuthController;
use App\Models\BookCategory;
use App\Models\BorrowRecord;
use App\Http\Controllers\Api\BorrowController;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/book-categories', function () {
    try {
        return response()->json(
            [
                'success' => true,
                'data' => BookCategory::all(),
            ],
            200
        );
    } catch (\Exception $e) {
        return response()->json(
            [
                'success' => false,
                'message' => 'Failed to fetch categories',
            ],
            500
        );
    }
});

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/books', [BookController::class, 'index']);
    Route::get('/books/{id}', [BookController::class, 'show']);
    Route::post('/books', [BookController::class, 'store']);
    Route::put('/books/{id}', [BookController::class, 'update']);
    Route::delete('/books/{id}', [BookController::class, 'destroy']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/borrow', [BorrowController::class, 'borrow']);
    Route::post('/return/{id}', [BorrowController::class, 'returnBook']);
    Route::get('/my-borrows', [BorrowController::class, 'myBorrows']);
});
