package com.salesinventory.sales_inventory;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "*")
public class SaleController {

    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;

    public SaleController(
            SaleRepository saleRepository,
            ProductRepository productRepository) {

        this.saleRepository = saleRepository;
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Sale> getSales() {
        return saleRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> addSale(@RequestBody Sale sale) {

        if (sale.getQuantitySold() <= 0) {
            return ResponseEntity.badRequest().body("Invalid quantity!");
        }

        return productRepository.findById(sale.getProductId()).map(product -> {

            if (sale.getQuantitySold() > product.getQuantity()) {
                return ResponseEntity.badRequest()
                        .body("Not enough stock available.");
            }

            double price = product.getPrice();
            double total = sale.getQuantitySold() * price;

            product.setQuantity(
                    product.getQuantity() - sale.getQuantitySold()
            );

            sale.setProductName(product.getName());
            sale.setPrice(price);
            sale.setTotalAmount(total);

            productRepository.save(product);
            return ResponseEntity.ok(saleRepository.save(sale));

        }).orElse(ResponseEntity.notFound().build());
    }
}