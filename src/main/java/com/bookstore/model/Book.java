package com.bookstore.model;

import jakarta.persistence.*;

/**
 * Book Entity - represents a book in the database.
 *
 * @Entity tells JPA/Hibernate this class maps to a database table.
 * @Table(name = "books") specifies the table name.
 */
@Entity
@Table(name = "books")
public class Book {

    // Primary key, auto-incremented by the database
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Book title - cannot be null
    @Column(nullable = false)
    private String title;

    // Book author - cannot be null
    @Column(nullable = false)
    private String author;

    // Long description - TEXT type for longer content
    @Column(columnDefinition = "TEXT")
    private String description;

    // Price of the book
    @Column(nullable = false)
    private Double price;

    // URL to book cover image
    @Column(name = "image_url")
    private String imageUrl;

    // Genre/category
    private String genre;

    // Star rating (1-5)
    private Double rating;

    // --- Default Constructor (required by JPA) ---
    public Book() {}

    // --- Parameterized Constructor ---
    public Book(String title, String author, String description,
                Double price, String imageUrl, String genre, Double rating) {
        this.title = title;
        this.author = author;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.genre = genre;
        this.rating = rating;
    }

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    @Override
    public String toString() {
        return "Book{id=" + id + ", title='" + title + "', author='" + author + "', price=" + price + "}";
    }
}
