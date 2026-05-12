package com.bookstore.config;

import com.bookstore.model.Book;
import com.bookstore.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * AppConfig - application-level configuration.
 *
 * @Configuration tells Spring this class contains @Bean definitions.
 */
@Configuration
public class AppConfig {

    /**
     * CORS Configuration.
     *
     * CORS (Cross-Origin Resource Sharing) allows our frontend HTML pages
     * (served from file:// or a different port) to call our Spring Boot API.
     *
     * Without this, browsers would block the requests for security reasons.
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")  // Apply to all /api/* endpoints
                        .allowedOrigins("*")     // Allow all origins (frontend can be anywhere)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");    // Allow all headers
            }
        };
    }

    /**
     * Sample Data Initializer.
     *
     * CommandLineRunner runs this code automatically when the application starts.
     * It pre-loads sample books so we have data to display on the homepage.
     *
     * This runs ONCE at startup and won't duplicate data on restart
     * (because we use create-drop mode which recreates the DB each time).
     */
    @Bean
    public CommandLineRunner initData(@Autowired BookRepository bookRepository) {
        return args -> {
            // Only insert if no books exist
            if (bookRepository.count() == 0) {
                System.out.println("Loading sample book data...");

                bookRepository.save(new Book(
                    "The Great Gatsby",
                    "F. Scott Fitzgerald",
                    "Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan. A vivid portrait of the American Dream.",
                    12.99,
                    "https://covers.openlibrary.org/b/id/8432495-L.jpg",
                    "Classic Fiction",
                    4.3
                ));

                bookRepository.save(new Book(
                    "To Kill a Mockingbird",
                    "Harper Lee",
                    "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it. Through the young eyes of Scout and Jem Finch, Harper Lee explores the irrationality of adult attitudes toward race and class.",
                    14.99,
                    "https://covers.openlibrary.org/b/id/8228691-L.jpg",
                    "Classic Fiction",
                    4.8
                ));

                bookRepository.save(new Book(
                    "1984",
                    "George Orwell",
                    "A dystopian social science fiction novel that follows the life of Winston Smith, a low-ranking member of 'the Party', who is frustrated by the omnipresent eyes of the party. Big Brother is watching. A timeless warning against totalitarianism.",
                    11.99,
                    "https://covers.openlibrary.org/b/id/8575708-L.jpg",
                    "Science Fiction",
                    4.7
                ));

                bookRepository.save(new Book(
                    "Harry Potter and the Philosopher's Stone",
                    "J.K. Rowling",
                    "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle.",
                    15.99,
                    "https://covers.openlibrary.org/b/id/10110415-L.jpg",
                    "Fantasy",
                    4.9
                ));

                bookRepository.save(new Book(
                    "The Alchemist",
                    "Paulo Coelho",
                    "A magical story about following your dreams. Santiago, an Andalusian shepherd boy, travels from his homeland in Spain to the Egyptian desert in search of a treasure buried near the Pyramids. A fable about listening to your heart.",
                    13.99,
                    "https://covers.openlibrary.org/b/id/8479576-L.jpg",
                    "Philosophy",
                    4.6
                ));

                bookRepository.save(new Book(
                    "Atomic Habits",
                    "James Clear",
                    "No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
                    18.99,
                    "https://covers.openlibrary.org/b/id/12747413-L.jpg",
                    "Self-Help",
                    4.8
                ));

                bookRepository.save(new Book(
                    "The Da Vinci Code",
                    "Dan Brown",
                    "Harvard symbologist Robert Langdon is summoned to the Louvre Museum where a curator has been found murdered in a way that suggests involvement of a shadowy society. Racing to solve the puzzle, Langdon uncovers a stunning secret.",
                    16.99,
                    "https://covers.openlibrary.org/b/id/8109325-L.jpg",
                    "Mystery",
                    4.4
                ));

                bookRepository.save(new Book(
                    "Dune",
                    "Frank Herbert",
                    "Set in the distant future amidst a feudal interstellar society, Dune tells the story of young Paul Atreides, whose family accepts control of the desert planet Arrakis. A sweeping tale of politics, religion, ecology, technology, and emotion.",
                    17.99,
                    "https://covers.openlibrary.org/b/id/8085449-L.jpg",
                    "Science Fiction",
                    4.7
                ));

                System.out.println("Sample books loaded successfully! Total: " + bookRepository.count());
            }
        };
    }
}
