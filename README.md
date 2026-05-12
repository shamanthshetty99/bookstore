# 📚 PageTurn — Online Bookstore

A complete full-stack web application built with **Spring Boot** (backend) and **HTML/CSS/Vanilla JS** (frontend), following **MVC architecture**.

---

## 🗂️ Project Structure

```
bookstore/
│
├── pom.xml                          ← Maven build file (dependencies)
├── schema.sql                       ← MySQL database schema + sample data
│
├── src/main/
│   ├── java/com/bookstore/
│   │   ├── BookstoreApplication.java   ← App entry point (main method)
│   │   │
│   │   ├── model/                   ← Data entities (map to DB tables)
│   │   │   ├── Book.java
│   │   │   ├── CartItem.java
│   │   │   └── User.java
│   │   │
│   │   ├── repository/              ← Database operations (DAO layer)
│   │   │   ├── BookRepository.java
│   │   │   ├── CartItemRepository.java
│   │   │   └── UserRepository.java
│   │   │
│   │   ├── service/                 ← Business logic layer
│   │   │   ├── BookService.java
│   │   │   ├── CartService.java
│   │   │   └── UserService.java
│   │   │
│   │   ├── controller/              ← REST API endpoints (HTTP handlers)
│   │   │   ├── BookController.java
│   │   │   ├── CartController.java
│   │   │   └── UserController.java
│   │   │
│   │   └── config/
│   │       └── AppConfig.java       ← CORS config + sample data loader
│   │
│   └── resources/
│       └── application.properties   ← Database & server config
│
└── frontend/                        ← Static HTML/CSS/JS files
    ├── index.html                   ← Homepage (book listing + search)
    ├── book-details.html            ← Single book detail view
    ├── cart.html                    ← Shopping cart
    ├── checkout.html                ← Order success page
    ├── login.html                   ← Login + Signup forms
    ├── css/
    │   └── style.css                ← All styles
    └── js/
        ├── api.js                   ← Shared fetch helpers + utilities
        ├── index.js                 ← Homepage logic
        ├── book-details.js          ← Book detail page logic
        ├── cart.js                  ← Cart page logic
        └── auth.js                  ← Login/Signup logic
```

---

## 🚀 Quick Start (H2 In-Memory — No MySQL needed)

### Prerequisites
- Java 17+ installed
- Maven 3.6+ installed (or use the IntelliJ Maven plugin)

### Steps

**1. Clone / Download the project**
```bash
cd bookstore
```

**2. Run the Spring Boot application**
```bash
mvn spring-boot:run
```

Or in IntelliJ:
- Open project → Right-click `BookstoreApplication.java` → Run

**3. Open the frontend**

Open `frontend/index.html` directly in your browser.
*(Double-click the file, or right-click → Open With → Browser)*

**4. Done! 🎉**
- Backend: `http://localhost:8080`
- Frontend: Open `frontend/index.html` in browser
- H2 Console: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:bookstoredb`
  - Username: `sa`, Password: *(empty)*

---

## 🗄️ Switch to MySQL (Optional)

**1. Install MySQL and create the database**
```sql
CREATE DATABASE bookstoredb;
```

**2. Run the schema**
```bash
mysql -u root -p bookstoredb < schema.sql
```

**3. Update `application.properties`**

Comment out H2 section, uncomment MySQL section:
```properties
# Comment these out:
# spring.datasource.url=jdbc:h2:mem:bookstoredb...
# spring.datasource.driver-class-name=org.h2.Driver

# Uncomment and set your credentials:
spring.datasource.url=jdbc:mysql://localhost:3306/bookstoredb?useSSL=false&serverTimezone=UTC
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect

# Also change ddl-auto to update (not create-drop) for MySQL:
spring.jpa.hibernate.ddl-auto=update
```

---

## 🔌 REST API Endpoints

### Books
| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/api/books`          | Get all books            |
| GET    | `/api/books?search=X` | Search books by keyword  |
| GET    | `/api/books/{id}`     | Get single book          |
| POST   | `/api/books`          | Add new book (admin)     |
| PUT    | `/api/books/{id}`     | Update book (admin)      |
| DELETE | `/api/books/{id}`     | Delete book (admin)      |

### Cart
| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/api/cart`           | Get all cart items       |
| POST   | `/api/cart`           | Add item to cart         |
| PUT    | `/api/cart/{id}`      | Update item quantity     |
| DELETE | `/api/cart/{id}`      | Remove item from cart    |
| GET    | `/api/cart/total`     | Get cart total price     |
| POST   | `/api/cart/checkout`  | Checkout + clear cart    |

### Auth
| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| POST   | `/api/auth/signup`    | Register new user        |
| POST   | `/api/auth/login`     | Login user               |

---

## 🧪 API Testing with curl

```bash
# Get all books
curl http://localhost:8080/api/books

# Search books
curl "http://localhost:8080/api/books?search=gatsby"

# Get book by ID
curl http://localhost:8080/api/books/1

# Add to cart (book ID 1, quantity 2)
curl -X POST http://localhost:8080/api/cart \
  -H "Content-Type: application/json" \
  -d '{"bookId": 1, "quantity": 2}'

# Get cart
curl http://localhost:8080/api/cart

# Remove cart item (item ID 1)
curl -X DELETE http://localhost:8080/api/cart/1

# Checkout
curl -X POST http://localhost:8080/api/cart/checkout

# Signup
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"secret123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"secret123"}'
```

---

## 🏗️ MVC Architecture Flow

```
Browser (HTML/JS)
      │
      │  HTTP Request (fetch API)
      ▼
┌─────────────────────────────────────────┐
│           SPRING BOOT SERVER            │
│                                         │
│  Controller  ←  receives HTTP request   │
│      │          returns JSON response   │
│      ▼                                  │
│   Service    ←  business logic          │
│      │          validation, processing  │
│      ▼                                  │
│  Repository  ←  database operations     │
│      │          JPA queries             │
│      ▼                                  │
│  Database (H2 / MySQL)                  │
└─────────────────────────────────────────┘
      │
      │  JSON Response
      ▼
Browser renders HTML dynamically
```

### How Frontend Connects to Backend

1. **JavaScript** calls `fetch('http://localhost:8080/api/books')`
2. Spring Boot's **BookController** handles the `/api/books` request
3. Controller calls **BookService** → which calls **BookRepository**
4. JPA queries the **database**, results returned as Java objects
5. Spring auto-converts Java objects → **JSON** response
6. JavaScript receives the JSON and **renders HTML** dynamically

---

## ✨ Features

- ✅ Browse all books with cover images
- ✅ Search by title or author
- ✅ Filter by genre
- ✅ View detailed book info
- ✅ Add to cart with quantity selector
- ✅ Update cart quantities
- ✅ Remove items from cart
- ✅ Checkout with order summary
- ✅ Confetti animation on success 🎉
- ✅ Toast notifications
- ✅ Responsive design (mobile-friendly)
- ✅ User login & signup
- ✅ Star ratings display

---

## 🔮 Future Improvements

- Add Spring Security with JWT tokens for proper auth
- Add book reviews and comments
- Implement pagination for large book catalogs
- Add admin dashboard for managing books
- Integrate payment gateway (Stripe/Razorpay)
- Add order history tracking
- Implement email notifications
- Add book recommendations engine
- Deploy to cloud (AWS / Heroku / Railway)

---

## 📦 Maven Dependencies Used

| Dependency                    | Purpose                              |
|-------------------------------|--------------------------------------|
| `spring-boot-starter-web`     | REST API, MVC, Tomcat server         |
| `spring-boot-starter-data-jpa`| Database ORM (JPA + Hibernate)       |
| `mysql-connector-j`           | MySQL JDBC driver                    |
| `h2`                          | In-memory database for development   |
| `lombok`                      | Reduces boilerplate code             |
