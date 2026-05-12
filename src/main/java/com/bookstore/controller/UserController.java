package com.bookstore.controller;

import com.bookstore.model.User;
import com.bookstore.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * UserController - handles user authentication (signup, login).
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * POST /api/auth/signup
     *
     * Register a new user.
     *
     * Request body:
     * {
     *   "username": "john",
     *   "email": "john@example.com",
     *   "password": "secret123"
     * }
     */
    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody User user) {
        Map<String, Object> response = userService.registerUser(user);

        if ((Boolean) response.get("success")) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response); // 201
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response); // 409 Conflict
        }
    }

    /**
     * POST /api/auth/login
     *
     * Authenticate a user.
     *
     * Request body:
     * {
     *   "username": "john",
     *   "password": "secret123"
     * }
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Map<String, Object> response = userService.loginUser(username, password);

        if ((Boolean) response.get("success")) {
            return ResponseEntity.ok(response); // 200
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response); // 401
        }
    }
}
