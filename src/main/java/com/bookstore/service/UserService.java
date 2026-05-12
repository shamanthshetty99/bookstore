package com.bookstore.service;

import com.bookstore.model.User;
import com.bookstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * UserService - handles user registration and authentication logic.
 *
 * Note: In production, use Spring Security + BCrypt for proper auth.
 * This is a simplified version for learning purposes.
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Register a new user (signup).
     *
     * @param user - User object with username, email, password
     * @return Map with success/error message
     */
    public Map<String, Object> registerUser(User user) {
        Map<String, Object> response = new HashMap<>();

        // Validate: check if username already taken
        if (userRepository.existsByUsername(user.getUsername())) {
            response.put("success", false);
            response.put("message", "Username already taken. Please choose another.");
            return response;
        }

        // Validate: check if email already registered
        if (userRepository.existsByEmail(user.getEmail())) {
            response.put("success", false);
            response.put("message", "Email already registered. Please login.");
            return response;
        }

        // NOTE: In production, hash the password before saving!
        // Example: user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Save user to database
        User savedUser = userRepository.save(user);

        response.put("success", true);
        response.put("message", "Account created successfully!");
        response.put("userId", savedUser.getId());
        response.put("username", savedUser.getUsername());
        return response;
    }

    /**
     * Login a user.
     *
     * @param username - entered username
     * @param password - entered password
     * @return Map with success/error and user info
     */
    public Map<String, Object> loginUser(String username, String password) {
        Map<String, Object> response = new HashMap<>();

        // Find user by username
        User user = userRepository.findByUsername(username).orElse(null);

        if (user == null) {
            response.put("success", false);
            response.put("message", "User not found. Please signup first.");
            return response;
        }

        // Check password (simple comparison - use BCrypt in production!)
        if (!user.getPassword().equals(password)) {
            response.put("success", false);
            response.put("message", "Incorrect password. Please try again.");
            return response;
        }

        // Login successful
        response.put("success", true);
        response.put("message", "Login successful!");
        response.put("userId", user.getId());
        response.put("username", user.getUsername());
        return response;
    }
}
