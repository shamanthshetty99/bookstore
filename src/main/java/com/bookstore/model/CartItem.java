package com.bookstore.model;

import jakarta.persistence.*;

/**
 * CartItem Entity - represents a book added to the shopping cart.
 *
 * Each CartItem links to a Book and stores the quantity selected.
 */
@Entity
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Many cart items can reference one book.
     * @ManyToOne creates a foreign key (book_id) in cart_items table.
     * @JoinColumn specifies the column name for the foreign key.
     * FetchType.EAGER means the Book data is loaded immediately with CartItem.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    // How many copies of this book the user wants
    @Column(nullable = false)
    private Integer quantity;

    // --- Default Constructor ---
    public CartItem() {}

    // --- Parameterized Constructor ---
    public CartItem(Book book, Integer quantity) {
        this.book = book;
        this.quantity = quantity;
    }

    // --- Helper method: calculate total price for this item ---
    public Double getTotalPrice() {
        if (book != null && quantity != null) {
            return book.getPrice() * quantity;
        }
        return 0.0;
    }

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Book getBook() { return book; }
    public void setBook(Book book) { this.book = book; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
