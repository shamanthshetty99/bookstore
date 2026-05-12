package com.bookstore.service;

import com.bookstore.model.Book;
import com.bookstore.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * BookService - contains all business logic for Book operations.
 *
 * The Service layer sits between Controller and Repository.
 * - Controller receives HTTP requests and calls Service
 * - Service processes the business logic and calls Repository
 * - Repository talks to the database
 *
 * @Service marks this class as a Spring-managed service bean.
 */
@Service
public class BookService {

    /**
     * @Autowired tells Spring to inject the BookRepository bean automatically.
     * We don't need to create a new instance manually (new BookRepository()).
     */
    @Autowired
    private BookRepository bookRepository;

    /**
     * Get all books from the database.
     * @return List of all Book objects
     */
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    /**
     * Get a single book by its ID.
     * @param id - book ID
     * @return Book if found, null otherwise
     */
    public Book getBookById(Long id) {
        Optional<Book> book = bookRepository.findById(id);
        // Optional.orElse(null) returns the book if present, null if not found
        return book.orElse(null);
    }

    /**
     * Search books by keyword (searches title and author).
     * @param keyword - search term
     * @return List of matching books
     */
    public List<Book> searchBooks(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllBooks(); // return all if no keyword
        }
        return bookRepository.searchBooks(keyword.trim());
    }

    /**
     * Add a new book to the database.
     * @param book - Book object to save
     * @return saved Book with generated ID
     */
    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    /**
     * Update an existing book.
     * @param id   - ID of the book to update
     * @param book - Book object with new values
     * @return updated Book, or null if not found
     */
    public Book updateBook(Long id, Book book) {
        // First check if book exists
        if (!bookRepository.existsById(id)) {
            return null; // Book not found
        }
        book.setId(id); // ensure we update the correct book
        return bookRepository.save(book);
    }

    /**
     * Delete a book by ID.
     * @param id - book ID to delete
     * @return true if deleted, false if not found
     */
    public boolean deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            return false;
        }
        bookRepository.deleteById(id);
        return true;
    }

    /**
     * Get books by genre/category.
     */
    public List<Book> getBooksByGenre(String genre) {
        return bookRepository.findByGenreIgnoreCase(genre);
    }
}
