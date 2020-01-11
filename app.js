
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
let buttonsDOM = [];

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
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            //console.log(id);
            let inCart = cart.find(item => (item.id === id))
            if (inCart) {
                button.innerText = "Dentro del carrito";
                // button.style.color = "red";
                button.disabled = true;
            }else {
                button.addEventListener('click', (event) =>{
                    //console.log(event);   
                    event.target.innerText = "Dentro del carrito";
                    button.style.color = "red";
                    event.target.disabled = true;  
                    
                    let cartItem = {...Storage.getProduct(id), amount: 1 };
                    //console.log(cartItem);
                    cart = [...cart, cartItem];
                    //console.log(cart);
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    this.addCartItem(cartItem);
                    this.showCart();
                });
            }
        })
    }

    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item =>{
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
        //console.log(cartTotal, cartItems); 
    }

    addCartItem(item) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <img src=${item.image} alt="producto">
            <div>
                <h4>${item.title}</h4>
                <h5>$ ${item.price}</h5>
                <span class="remote-item" data-id=${item.id}>Eliminar</span>
            </div>
            <div>
                <i class="fas fa-chevron-up" data-id=${item.id}></i>
                <p class="item-amount">${item.amount}</p>
                <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>
        `;
        cartContent.appendChild(div);
       // console.log(cartContent);
    }

    showCart() {
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    }

    setupAPP() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart);
    }

    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));
    }

    hideCart() {
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }

    cartLogic() {
        clearCartBtn.addEventListener('click', () =>{
            this.clearCart();
        })
    }

    clearCart() {
        //console.log(this);
        let cartItems = cart.map(item => item.id)
        //console.log(cartItems);
        cartItems.forEach(id => this.removeItem(id));
        console.log(cartContent.children);
        
        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();
    }

    removeItem(id) {
        cart= cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>Agregar al carrito`;
    }

    getSingleButton(id) {
        return buttonsDOM.find(button => button.dataset.id === id);
    }
}

class Storage{
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }

    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }

    static saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    static getCart() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    }
}

document.addEventListener("DOMContentLoaded", () =>{
    const ui = new UI();
    const products = new Products();

    ui.setupAPP();

    products.getProducts().then(products => { 
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(()=>{
        ui.getBagButtons();
        ui.cartLogic();
    });
});