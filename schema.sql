-- ============================================================
-- Online Bookstore — MySQL Database Schema
-- ============================================================
-- Run these commands in MySQL Workbench or terminal:
--   mysql -u root -p < schema.sql
-- ============================================================

-- Create and use the database
CREATE DATABASE IF NOT EXISTS bookstoredb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bookstoredb;

-- ============================================================
-- TABLE: books
-- ============================================================
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS users;

CREATE TABLE books (
  id          BIGINT       NOT NULL AUTO_INCREMENT,
  title       VARCHAR(255) NOT NULL,
  author      VARCHAR(255) NOT NULL,
  description TEXT,
  price       DOUBLE       NOT NULL,
  image_url   VARCHAR(500),
  genre       VARCHAR(100),
  rating      DOUBLE,
  PRIMARY KEY (id)
);

-- ============================================================
-- TABLE: users (optional - for authentication)
-- ============================================================
CREATE TABLE users (
  id       BIGINT       NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL UNIQUE,
  email    VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

-- ============================================================
-- TABLE: cart_items
-- ============================================================
CREATE TABLE cart_items (
  id       BIGINT  NOT NULL AUTO_INCREMENT,
  book_id  BIGINT  NOT NULL,
  quantity INT     NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- ============================================================
-- SAMPLE BOOK DATA
-- ============================================================
INSERT INTO books (title, author, description, price, image_url, genre, rating) VALUES
(
  'The Great Gatsby',
  'F. Scott Fitzgerald',
  'Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway interactions with mysterious millionaire Jay Gatsby and Gatsby obsession to reunite with his former lover, Daisy Buchanan. A vivid portrait of the American Dream.',
  12.99,
  'https://covers.openlibrary.org/b/id/8432495-L.jpg',
  'Classic Fiction',
  4.3
),
(
  'To Kill a Mockingbird',
  'Harper Lee',
  'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it. Through the young eyes of Scout and Jem Finch, Harper Lee explores the irrationality of adult attitudes toward race and class.',
  14.99,
  'https://covers.openlibrary.org/b/id/8228691-L.jpg',
  'Classic Fiction',
  4.8
),
(
  '1984',
  'George Orwell',
  'A dystopian social science fiction novel that follows the life of Winston Smith, a low-ranking member of the Party, who is frustrated by the omnipresent eyes of the party. Big Brother is watching.',
  11.99,
  'https://covers.openlibrary.org/b/id/8575708-L.jpg',
  'Science Fiction',
  4.7
),
(
  'Harry Potter and the Philosopher''s Stone',
  'J.K. Rowling',
  'Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal.',
  15.99,
  'https://covers.openlibrary.org/b/id/10110415-L.jpg',
  'Fantasy',
  4.9
),
(
  'The Alchemist',
  'Paulo Coelho',
  'A magical story about following your dreams. Santiago, an Andalusian shepherd boy, travels from his homeland in Spain to the Egyptian desert in search of treasure. A fable about listening to your heart.',
  13.99,
  'https://covers.openlibrary.org/b/id/8479576-L.jpg',
  'Philosophy',
  4.6
),
(
  'Atomic Habits',
  'James Clear',
  'James Clear reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
  18.99,
  'https://covers.openlibrary.org/b/id/12747413-L.jpg',
  'Self-Help',
  4.8
),
(
  'The Da Vinci Code',
  'Dan Brown',
  'Harvard symbologist Robert Langdon is summoned to the Louvre Museum where a curator has been found murdered in a way that suggests involvement of a shadowy society protecting a powerful secret.',
  16.99,
  'https://covers.openlibrary.org/b/id/8109325-L.jpg',
  'Mystery',
  4.4
),
(
  'Dune',
  'Frank Herbert',
  'Set in the distant future amidst a feudal interstellar society, Dune tells the story of young Paul Atreides, whose family accepts stewardship of the desert planet Arrakis.',
  17.99,
  'https://covers.openlibrary.org/b/id/8085449-L.jpg',
  'Science Fiction',
  4.7
);

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================
SELECT 'Books inserted:' AS status, COUNT(*) AS total FROM books;
SELECT id, title, author, price FROM books;
