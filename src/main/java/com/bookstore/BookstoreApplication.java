package com.bookstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Online Bookstore application.
 *
 * @SpringBootApplication combines:
 * - @Configuration: marks this as a config class
 * - @EnableAutoConfiguration: auto-configures Spring based on dependencies
 * - @ComponentScan: scans all classes in this package and sub-packages
 */
@SpringBootApplication
public class BookstoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookstoreApplication.class, args);
        System.out.println("========================================");
        System.out.println("  Online Bookstore is running!");
        System.out.println("  Visit: http://localhost:8080");
        System.out.println("  H2 Console: http://localhost:8080/h2-console");
        System.out.println("========================================");
    }
}
