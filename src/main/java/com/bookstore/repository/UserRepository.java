package com.bookstore.repository;

import com.bookstore.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * UserRepository - handles database operations for Users.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by username (for login).
     * Optional<User> handles the case where user is not found gracefully.
     */
    Optional<User> findByUsername(String username);

    /**
     * Find user by email.
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if username already exists (for signup validation).
     */
    boolean existsByUsername(String username);

    /**
     * Check if email already exists (for signup validation).
     */
    boolean existsByEmail(String email);
}
