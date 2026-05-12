package com.bookstore.service;

import com.bookstore.model.Book;
import com.bookstore.model.CartItem;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * CartService - business logic for shopping cart operations.
 */
@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private BookRepository bookRepository;

    /**
     * Get all items currently in the cart.
     */
    public List<CartItem> getCartItems() {
        return cartItemRepository.findAll();
    }

    /**
     * Add a book to the cart.
     *
     * If the book is already in the cart, increase its quantity.
     * If it's new, create a new CartItem.
     *
     * @param bookId   - ID of the book to add
     * @param quantity - how many copies
     * @return saved CartItem, or null if book not found
     */
    public CartItem addToCart(Long bookId, Integer quantity) {
        // Step 1: Find the book
        Book book = bookRepository.findById(bookId).orElse(null);
        if (book == null) {
            return null; // Book doesn't exist
        }

        // Step 2: Check if this book is already in the cart
        CartItem existingItem = cartItemRepository.findByBookId(bookId);

        if (existingItem != null) {
            // Book already in cart → increase quantity
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            return cartItemRepository.save(existingItem);
        } else {
            // New item → create and save
            CartItem newItem = new CartItem(book, quantity);
            return cartItemRepository.save(newItem);
        }
    }

    /**
     * Remove a specific item from the cart.
     *
     * @param cartItemId - ID of the CartItem to remove
     * @return true if removed, false if not found
     */
    public boolean removeFromCart(Long cartItemId) {
        if (!cartItemRepository.existsById(cartItemId)) {
            return false;
        }
        cartItemRepository.deleteById(cartItemId);
        return true;
    }

    /**
     * Calculate the total price of all items in the cart.
     */
    public Double getCartTotal() {
        List<CartItem> items = cartItemRepository.findAll();
        double total = 0.0;
        for (CartItem item : items) {
            total += item.getTotalPrice();
        }
        return total;
    }

    /**
     * Clear all items from the cart (called after checkout).
     */
    public void clearCart() {
        cartItemRepository.clearCart();
    }

    /**
     * Update quantity of an existing cart item.
     *
     * @param cartItemId - ID of the CartItem
     * @param quantity   - new quantity
     * @return updated CartItem, or null if not found
     */
    public CartItem updateQuantity(Long cartItemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(cartItemId).orElse(null);
        if (item == null) {
            return null;
        }
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }
}
