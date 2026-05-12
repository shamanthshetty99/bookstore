package com.bookstore.repository;

import com.bookstore.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * CartItemRepository - handles all database operations for CartItems.
 */
@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    /**
     * Check if a specific book is already in the cart.
     * Used to avoid duplicate entries (instead, increase quantity).
     *
     * @param bookId - the book ID to check
     * @return CartItem if found, null otherwise
     */
    CartItem findByBookId(Long bookId);

    /**
     * Delete all items from the cart (used after checkout).
     *
     * @Modifying + @Transactional are required for DELETE/UPDATE queries.
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM CartItem c")
    void clearCart();
}
