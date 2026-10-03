public class Main {
    public static void main(String[] args) {
         Product product = new Product(101, "Laptop", 10, 50000);

        Sale sale = new Sale(1, 101, 2, product.price);
        Inventory inventory = new Inventory(101, product.quantity, sale.quantitySold);

        System.out.println("===== SALES AND INVENTORY ANALYTICS SYSTEM =====");

        System.out.println("\nProduct Details:");
        System.out.println("Product ID: " + product.productId);
        System.out.println("Product Name: " + product.productName);
        System.out.println("Price: Rs. " + product.price);

        System.out.println("\nSales Details:");
        System.out.println("Sale ID: " + sale.saleId);
        System.out.println("Quantity Sold: " + sale.quantitySold);
        System.out.println("Total Amount: Rs. " + sale.totalAmount);

        System.out.println("\nInventory Details:");
        System.out.println("Available Quantity: " + inventory.availableQuantity);
        double totalSales = sale.totalAmount;
        System.out.println("\nAnalytics:");
        System.out.println("Total Sales: Rs. " + totalSales);

        if (inventory.availableQuantity < 5) {
            System.out.println("Low Stock Alert!");}
        else {
            System.out.println("Stock Available");}
    
       
    }
}
