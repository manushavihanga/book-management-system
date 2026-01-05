<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Book;
use App\Models\BorrowRecord;
use Illuminate\Support\Facades\DB;

class BorrowController extends Controller
{
    // Get all borrow records for authenticated user
    public function myBorrows()
    {
        try {
            $records = BorrowRecord::with('book.category')
                ->where('user_id', auth()->id())
                ->orderBy('borrowed_at', 'desc')
                ->get();

            return response()->json($records);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch borrow records'
            ], 500);
        }
    }

    // Borrow a book
    public function borrow(Request $request)
    {
        $request->validate([
            'book_id' => 'required|exists:books,id',
        ]);

        $book = Book::findOrFail($request->book_id);

        if ($book->stock <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'Out of stock'
            ], 400);
        }

        // Check if user already borrowed this book and hasn't returned it
        $existingBorrow = BorrowRecord::where('user_id', auth()->id())
            ->where('book_id', $book->id)
            ->whereNull('returned_at')
            ->first();

        if ($existingBorrow) {
            return response()->json([
                'success' => false,
                'message' => 'You have already borrowed this book'
            ], 400);
        }

        DB::transaction(function () use ($book) {
            BorrowRecord::create([
                'user_id' => auth()->id(),
                'book_id' => $book->id,
                'borrowed_at' => now(),
            ]);

            $book->decrement('stock');
        });

        return response()->json([
            'success' => true,
            'message' => 'Book borrowed successfully'
        ]);
    }

    // Return a book
    public function returnBook($id)
    {
        try {
            $record = BorrowRecord::where('id', $id)
                ->whereNull('returned_at')
                ->firstOrFail();

            // Check if the record belongs to the authenticated user
            if ($record->user_id !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized - You can only return your own borrowed books'
                ], 403);
            }

            DB::transaction(function () use ($record) {
                $record->update(['returned_at' => now()]);
                $record->book->increment('stock');
            });

            return response()->json([
                'success' => true,
                'message' => 'Book returned successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to return book: ' . $e->getMessage()
            ], 404);
        }
    }
}