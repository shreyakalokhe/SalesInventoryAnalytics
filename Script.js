const API = "https://salesinventoryanalytics-1.onrender.com/api";

let products = [];
let sales = [];
let selectedUpdateId = null;
let salesChart = null;


// ================= START AFTER HTML LOAD =================

document.addEventListener("DOMContentLoaded", function () {

    setupEvents();
    loadData();

});


// ================= LOAD DATA =================

async function loadData() {

    try {

        const productResponse =
            await fetch(`${API}/products`);

        const salesResponse =
            await fetch(`${API}/sales`);

        if (!productResponse.ok || !salesResponse.ok) {

            throw new Error("Backend connection failed");

        }

        products = await productResponse.json();
        sales = await salesResponse.json();

        refreshAll();

    } catch (error) {

        console.error(error);

        alert(
            "Backend connection failed. Please make sure Spring Boot is running."
        );

    }

}


// ================= EVENTS =================

function setupEvents() {

    document
        .getElementById("addProductButton")
        .addEventListener("click", addProduct);


    document
        .getElementById("productSelect")
        .addEventListener("change", function () {

            const productId = Number(this.value);

            const product =
                products.find(p => p.id === productId);

            if (!product) {

                document.getElementById("salePrice").value = "";

                document.getElementById("saleTotal").innerText =
                    "Total Amount: Rs. 0";

                return;
            }

            document.getElementById("salePrice").value =
                product.price;

            calculateSaleTotal();

        });


    document
        .getElementById("saleQuantity")
        .addEventListener("input", calculateSaleTotal);


    document
        .getElementById("addSaleButton")
        .addEventListener("click", addSale);


    document
        .getElementById("saveUpdateButton")
        .addEventListener("click", saveUpdate);


    document
        .getElementById("cancelUpdateButton")
        .addEventListener("click", cancelUpdate);

}


// ================= REFRESH ALL =================

function refreshAll() {

    updateDashboard();

    updateProductDropdown();

    displaySales();

    displayStock();

    updateSalesChart();

}


// ================= ADD PRODUCT =================

async function addProduct() {

    const name =
        document.getElementById("newProductName")
        .value
        .trim();

    const quantity =
        Number(
            document.getElementById("newProductQuantity").value
        );

    const price =
        Number(
            document.getElementById("newProductPrice").value
        );


    if (name === "") {

        alert("Please enter product name.");
        return;

    }


    if (quantity < 0 || isNaN(quantity)) {

        alert("Please enter valid stock quantity.");
        return;

    }


    if (price <= 0 || isNaN(price)) {

        alert("Please enter valid price.");
        return;

    }


    try {

        const response =
            await fetch(`${API}/products`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    quantity: quantity,
                    price: price
                })

            });


        if (response.status === 409) {

            alert("Product already exists!");

            clearProductForm();

            return;

        }


        if (!response.ok) {

            throw new Error("Product could not be added.");

        }


        clearProductForm();

        await loadData();

        showMessage(
            "productMessage",
            "Product added successfully!"
        );


    } catch (error) {

        console.error(error);

        alert("Unable to add product.");

    }

}


// ================= CLEAR PRODUCT FORM =================

function clearProductForm() {

    document.getElementById("newProductName").value = "";

    document.getElementById("newProductQuantity").value = "";

    document.getElementById("newProductPrice").value = "";

}


// ================= PRODUCT DROPDOWN =================

function updateProductDropdown() {

    const select =
        document.getElementById("productSelect");

    select.innerHTML =
        `<option value="">Select Product</option>`;


    products.forEach(product => {

        const option =
            document.createElement("option");

        option.value = product.id;

        option.textContent = product.name;

        select.appendChild(option);

    });

}


// ================= SALE TOTAL =================

function calculateSaleTotal() {

    const productId =
        Number(
            document.getElementById("productSelect").value
        );

    const quantity =
        Number(
            document.getElementById("saleQuantity").value
        );


    const product =
        products.find(p => p.id === productId);


    if (!product || quantity <= 0) {

        document.getElementById("saleTotal").innerText =
            "Total Amount: Rs. 0";

        return;

    }


    const total =
        quantity * product.price;


    document.getElementById("saleTotal").innerText =
        `Total Amount: Rs. ${total}`;

}


// ================= ADD SALE =================

async function addSale() {

    const productId =
        Number(
            document.getElementById("productSelect").value
        );

    const quantity =
        Number(
            document.getElementById("saleQuantity").value
        );


    if (!productId) {

        alert("Please select a product.");
        return;

    }


    if (quantity <= 0 || isNaN(quantity)) {

        alert("Please enter valid quantity.");
        return;

    }


    const product =
        products.find(p => p.id === productId);


    if (!product) {

        alert("Product not found.");
        return;

    }


    if (quantity > product.quantity) {

        alert("Not enough stock available.");
        return;

    }


    try {

        const response =
            await fetch(`${API}/sales`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

    productId: productId,

    productName: product.name,

    quantitySold: quantity,

    price: product.price,

    totalAmount: quantity * product.price

})

            });


        if (!response.ok) {

            const message =
                await response.text();

            alert(
                message ||
                "Sale could not be added."
            );

            return;

        }


        document.getElementById("productSelect").value = "";

        document.getElementById("saleQuantity").value = "";

        document.getElementById("salePrice").value = "";

        document.getElementById("saleTotal").innerText =
            "Total Amount: Rs. 0";


        await loadData();


        showMessage(
            "saleMessage",
            "Sale added successfully!"
        );


    } catch (error) {

        console.error(error);

        alert("Unable to add sale.");

    }

}


// ================= SALES RECORDS =================

function displaySales() {

    const table =
        document.querySelector("#salesTable tbody");


    table.innerHTML = "";


    sales.forEach(sale => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${sale.productName}</td>

            <td>${sale.quantitySold}</td>

            <td>Rs. ${sale.price}</td>

            <td>Rs. ${sale.totalAmount}</td>

        `;


        table.appendChild(row);

    });

}


// ================= STOCK TABLE =================

function displayStock() {

    const table =
        document.querySelector("#stockTable tbody");


    table.innerHTML = "";


    products.forEach((product, index) => {

        const status =
            product.quantity === 0
                ? "Out of Stock"
                : "In Stock";


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${product.name}</td>

            <td>${product.quantity}</td>

            <td>${status}</td>

            <td>

                <button onclick="updateProduct(${index})">
                    Update
                </button>

                <button onclick="removeProduct(${index})">
                    Remove
                </button>

            </td>

        `;


        table.appendChild(row);

    });

}


// ================= UPDATE PRODUCT =================

function updateProduct(index) {

    const product =
        products[index];


    if (!product) return;


    selectedUpdateId =
        product.id;


    document.getElementById("updateQuantity").value =
        product.quantity;


    document.getElementById("updatePrice").value =
        product.price;


    document.getElementById("updateBox").style.display =
        "block";

}


// ================= SAVE UPDATE =================

async function saveUpdate() {

    if (!selectedUpdateId) return;


    const quantity =
        Number(
            document.getElementById("updateQuantity").value
        );


    const price =
        Number(
            document.getElementById("updatePrice").value
        );


    if (quantity < 0 || isNaN(quantity)) {

        alert("Invalid stock quantity.");
        return;

    }


    if (price <= 0 || isNaN(price)) {

        alert("Invalid price.");
        return;

    }


    try {

        const response =
            await fetch(
                `${API}/products/${selectedUpdateId}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        quantity: quantity,
                        price: price
                    })

                }
            );


        if (!response.ok) {

            throw new Error("Update failed");

        }


        document.getElementById("updateBox").style.display =
            "none";


        selectedUpdateId = null;


        await loadData();


    } catch (error) {

        console.error(error);

        alert("Unable to update product.");

    }

}


// ================= CANCEL UPDATE =================

function cancelUpdate() {

    document.getElementById("updateBox").style.display =
        "none";


    selectedUpdateId = null;

}


// ================= REMOVE PRODUCT =================

async function removeProduct(index) {

    const product =
        products[index];


    if (!product) return;


    const confirmDelete =
        confirm(
            `Are you sure you want to remove ${product.name}?`
        );


    if (!confirmDelete) return;


    try {

        const response =
            await fetch(
                `${API}/products/${product.id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            alert("Unable to remove product.");
            return;

        }


        await loadData();


    } catch (error) {

        console.error(error);

        alert("Unable to remove product.");

    }

}


// ================= DASHBOARD =================

function updateDashboard() {

    const totalProducts =
        document.getElementById("totalProducts");


    const totalSales =
        document.getElementById("totalSales");


    totalProducts.innerText =
        products.length;


    let total = 0;


    sales.forEach(sale => {

        total +=
            Number(sale.totalAmount);

    });


    totalSales.innerText =
        `Rs. ${total}`;

}


// ================= SALES ANALYTICS =================

function updateSalesChart() {

    const canvas =
        document.getElementById("salesChart");


    if (!canvas || typeof Chart === "undefined") {
        return;
    }


    const salesData = {};


    products.forEach(product => {

        salesData[product.name] = 0;

    });


    sales.forEach(sale => {

        if (!salesData.hasOwnProperty(sale.productName)) {

            salesData[sale.productName] = 0;

        }


        salesData[sale.productName] +=
            Number(sale.totalAmount);

    });


    const labels =
        Object.keys(salesData);


    const values =
        Object.values(salesData);


    if (salesChart) {

        salesChart.destroy();

    }


    salesChart =
        new Chart(canvas, {

            type: "bar",

            data: {

                labels: labels,

                datasets: [{

                    label: "Sales Amount",

                    data: values

                }]

            },

            options: {

                responsive: false,

                plugins: {

                    legend: {
                        display: true
                    }

                },

                scales: {

                    x: {

                        ticks: {
                            autoSkip: false
                        }

                    },

                    y: {

                        beginAtZero: true,

                        title: {

                            display: true,

                            text: "Sales Amount"

                        }

                    }

                }

            }

        });

}


// ================= MESSAGE =================

function showMessage(id, message) {

    const element =
        document.getElementById(id);

    if (element) {

        element.innerText = message;

        setTimeout(function () {
            element.innerText = "";
        }, 2000);

    }

}