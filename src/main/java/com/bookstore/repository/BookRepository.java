package com.bookstore.repository;

import com.bookstore.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * BookRepository - handles all database operations for Books.
 *
 * Extends JpaRepository which provides built-in methods:
 * - findAll()       -> SELECT * FROM books
 * - findById(id)    -> SELECT * FROM books WHERE id = ?
 * - save(book)      -> INSERT or UPDATE
 * - deleteById(id)  -> DELETE FROM books WHERE id = ?
 * - count()         -> SELECT COUNT(*) FROM books
 *
 * We only need to add custom query methods here.
 */
@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    /**
     * Search books by title (case-insensitive, partial match).
     *
     * Spring Data JPA generates the SQL automatically from the method name:
     * SELECT * FROM books WHERE LOWER(title) LIKE LOWER('%keyword%')
     *
     * @param keyword - the search term
     * @return list of matching books
     */
    List<Book> findByTitleContainingIgnoreCase(String keyword);

    /**
     * Search by author name.
     */
    List<Book> findByAuthorContainingIgnoreCase(String author);

    /**
     * Custom JPQL query - search books by title OR author.
     * @Query uses JPQL (Java Persistence Query Language), similar to SQL.
     */
    @Query("SELECT b FROM Book b WHERE " +
           "LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Book> searchBooks(@Param("keyword") String keyword);

    /**
     * Find books by genre.
     */
    List<Book> findByGenreIgnoreCase(String genre);
}
