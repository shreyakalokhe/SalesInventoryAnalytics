public class Inventory {
     int productId;
    int availableQuantity;

     public Inventory(int productId, int initialQuantity, int quantitySold) {
        this.productId = productId;
        this.availableQuantity = initialQuantity - quantitySold;
    }
}
