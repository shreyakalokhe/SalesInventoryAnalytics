package com.salesinventory.sales_inventory;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Product> getProducts() {
        return productRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody Product product) {

        if (productRepository.findByNameIgnoreCase(product.getName()).isPresent()) {
            return ResponseEntity.status(409).body("Product already exists!");
        }

        if (product.getQuantity() < 0 || product.getPrice() <= 0) {
            return ResponseEntity.badRequest().body("Invalid quantity or price!");
        }

        return ResponseEntity.ok(productRepository.save(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestBody Product updatedProduct) {

        return productRepository.findById(id).map(product -> {

            product.setQuantity(updatedProduct.getQuantity());
            product.setPrice(updatedProduct.getPrice());

            return ResponseEntity.ok(productRepository.save(product));

        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {

        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        productRepository.deleteById(id);
        return ResponseEntity.ok("Product removed successfully!");
    }
}