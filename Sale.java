public class Sale {
    int saleId;
    int productId;
    int quantitySold;
    double totalAmount;

    public Sale(int saleId, int productId, int quantitySold, double price) {
        this.saleId = saleId;
        this.productId = productId;
        this.quantitySold = quantitySold;
        this.totalAmount = quantitySold * price;
    }
}
