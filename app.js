
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');


let cart = [];

class Products{
    async getProducts(){
        try {
            let result = await fetch("products.json");
            let data = await result.json();

            let products = data.items;
            products = products.map(item => {
                const {title, price} = item.fields;
                const {id} = item.sys;
                const image = item.fields.image.fields.file.url;
                return {title, price, id, image }
            })
            return products;
        } catch (error) {
            console.log(Errors);
        }
    }
}

class UI{
    displayProducts(products){
        // console.log(products);
        let result = '';
        products.forEach(products => {
            result += `
            <article class="product">
                <div class="img-container">
                    <img src=${products.image} alt="product 1" class="product-img">
                    <button class="bag-btn" data-id=${products.id}>
                        <i class="fas fa-shopping-cart"></i>
                        Agregar al carrito
                    </button>
                </div>
                <h3>${products.title}</h3>
                <h4>$ ${products.price}</h4>
            </article>
           `;
        });
        productsDOM.innerHTML = result;
    }
    getBagButtons() {
        const buttons = [...document.querySelectorAll('.bag-btn')];
        buttons.forEach(button => {
            let id = button.dataset.id;
            console.log(id);
            
        })
    }
}

class Storage{
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
}

document.addEventListener("DOMContentLoaded", () =>{
    const ui = new UI();
    const products = new Products();

    products.getProducts().then(products => { 
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(()=>{
        ui.getBagButtons();
    });
});