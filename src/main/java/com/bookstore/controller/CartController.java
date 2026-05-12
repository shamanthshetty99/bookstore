package com.bookstore.controller;

import com.bookstore.model.CartItem;
import com.bookstore.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * CartController - handles all HTTP requests for the shopping cart.
 */
@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    /**
     * GET /api/cart
     *
     * Returns all items currently in the cart.
     */
    @GetMapping
    public ResponseEntity<List<CartItem>> getCartItems() {
        List<CartItem> items = cartService.getCartItems();
        return ResponseEntity.ok(items); // 200 OK
    }

    /**
     * POST /api/cart
     *
     * Add a book to the cart.
     *
     * Request body example:
     * {
     *   "bookId": 1,
     *   "quantity": 2
     * }
     *
     * @RequestBody Map<String, Object> reads key-value pairs from JSON body.
     */
    @PostMapping
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> request) {
        // Extract bookId and quantity from the request body
        Long bookId = Long.parseLong(request.get("bookId").toString());
        Integer quantity = Integer.parseInt(request.getOrDefault("quantity", 1).toString());

        CartItem cartItem = cartService.addToCart(bookId, quantity);

        if (cartItem == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Book not found with ID: " + bookId); // 404
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(cartItem); // 201 Created
    }

    /**
     * DELETE /api/cart/{id}
     *
     * Remove a specific item from the cart by CartItem ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeFromCart(@PathVariable Long id) {
        boolean removed = cartService.removeFromCart(id);

        if (!removed) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Cart item not found with ID: " + id); // 404
        }

        return ResponseEntity.ok("Item removed from cart."); // 200
    }

    /**
     * PUT /api/cart/{id}
     *
     * Update the quantity of a cart item.
     *
     * Request body: { "quantity": 3 }
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuantity(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {

        Integer quantity = Integer.parseInt(request.get("quantity").toString());

        if (quantity <= 0) {
            // If quantity is 0 or less, remove the item
            cartService.removeFromCart(id);
            return ResponseEntity.ok("Item removed from cart.");
        }

        CartItem updated = cartService.updateQuantity(id, quantity);

        if (updated == null) {
            return ResponseEntity.notFound().build(); // 404
        }

        return ResponseEntity.ok(updated); // 200
    }

    /**
     * GET /api/cart/total
     *
     * Returns the total price of all items in the cart.
     */
    @GetMapping("/total")
    public ResponseEntity<Map<String, Double>> getCartTotal() {
        Map<String, Double> response = new HashMap<>();
        response.put("total", cartService.getCartTotal());
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/checkout
     *
     * Place the order and clear the cart.
     */
    @PostMapping("/checkout")
    public ResponseEntity<Map<String, Object>> checkout() {
        // Get items before clearing (for order summary)
        List<CartItem> items = cartService.getCartItems();
        Double total = cartService.getCartTotal();

        if (items.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Cart is empty. Add books before checkout.");
            return ResponseEntity.badRequest().body(error); // 400
        }

        // Clear the cart
        cartService.clearCart();

        // Build success response
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Order placed successfully! Thank you for shopping with us.");
        response.put("itemCount", items.size());
        response.put("totalAmount", total);
        response.put("orderId", "ORD-" + System.currentTimeMillis()); // mock order ID

        return ResponseEntity.ok(response); // 200
    }
}
