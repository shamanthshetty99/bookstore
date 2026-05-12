package com.bookstore.controller;

import com.bookstore.model.Book;
import com.bookstore.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * BookController - handles all HTTP requests related to Books.
 *
 * @RestController = @Controller + @ResponseBody
 *   - Returns JSON directly (not a view/template)
 *
 * @RequestMapping("/api/books") sets the base URL for all methods in this class.
 *
 * @CrossOrigin allows frontend (HTML/JS) on any origin to call this API.
 *   In production, restrict this to specific origins.
 */
@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {

    @Autowired
    private BookService bookService;

    /**
     * GET /api/books
     * GET /api/books?search=keyword
     *
     * Returns all books, or filtered by search keyword.
     * ResponseEntity lets us control the HTTP status code.
     */
    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks(
            @RequestParam(required = false) String search) {

        List<Book> books;

        if (search != null && !search.isEmpty()) {
            // Search mode: filter by keyword
            books = bookService.searchBooks(search);
        } else {
            // Normal mode: return all books
            books = bookService.getAllBooks();
        }

        return ResponseEntity.ok(books); // 200 OK + JSON body
    }

    /**
     * GET /api/books/{id}
     *
     * Returns a single book by ID.
     * @PathVariable extracts {id} from the URL.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        Book book = bookService.getBookById(id);

        if (book == null) {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }

        return ResponseEntity.ok(book); // 200 OK
    }

    /**
     * GET /api/books/genre/{genre}
     *
     * Returns books filtered by genre.
     */
    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<Book>> getBooksByGenre(@PathVariable String genre) {
        List<Book> books = bookService.getBooksByGenre(genre);
        return ResponseEntity.ok(books);
    }

    /**
     * POST /api/books
     *
     * Add a new book. (Admin feature)
     * @RequestBody reads the JSON body and maps it to a Book object.
     */
    @PostMapping
    public ResponseEntity<Book> addBook(@RequestBody Book book) {
        Book savedBook = bookService.addBook(book);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBook); // 201 Created
    }

    /**
     * PUT /api/books/{id}
     *
     * Update an existing book. (Admin feature)
     */
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book book) {
        Book updatedBook = bookService.updateBook(id, book);

        if (updatedBook == null) {
            return ResponseEntity.notFound().build(); // 404
        }

        return ResponseEntity.ok(updatedBook); // 200
    }

    /**
     * DELETE /api/books/{id}
     *
     * Delete a book by ID. (Admin feature)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBook(@PathVariable Long id) {
        boolean deleted = bookService.deleteBook(id);

        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Book not found with ID: " + id); // 404
        }

        return ResponseEntity.ok("Book deleted successfully."); // 200
    }
}
