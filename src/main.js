const BASE_URL = "https://ecommercebackend.fundamentos-29.repl.co/";

async function getProducts() {
  //PROBAR,INTENTAR
  try {
    //LLAMAR A LA BASE DE DATOS
    const data = await fetch(BASE_URL);
    //PASAR DE STRING A UN JSON
    const response = await data.json();
    localStorage.setItem("products", JSON.stringify(response));
    return response;
    //ATRAPAR
  } catch (error) {
    console.log(error);
  }
}

function validateAmountProduct(store,id) {
  if(store.cart[id].amount === store.cart[id].quantity) {
    alert("ya no hay mas en stock");
  }else{
    store.cart[id].amount++;
  }
  }

function printProducts(store) {
  let html = "";

  store.products.forEach(function ({ id, image, name, price, quantity }) {
    console.log({ id, image, name, price, quantity });

    html += `
        <div class="product">
        <div class="product__img">
        <img src="${image}" alt="">
        </div>
        <h3>${name}</h3>
        <p>$${price}.0- ${quantity} unidades</p>
        ${
          quantity
          ? `<button class="product__btn" id="${id}">agregar</button>`
          :"<div></div>"
        }

        </div>
        `;
  });

  const productsHTML = document.querySelector(".products");
  productsHTML.innerHTML = html;
}

function handleShowCart() {
  const iconCart = document.querySelector(".icon__cart");
  const cart = document.querySelector(".cart");

  iconCart.addEventListener("click", function() {
  cart.classList.toggle("cart__show");
    
  });

}

function printProductsInCart(store) {
  
  let html = "";

  for (const key in store.cart) {
    const { amount, id, image, name, price, quantity } = store.cart[key];
    html += `
    <div class="cart__product">
    <div className="cart__product__img">
    <img src="${image}" alt="" />
    </div>

    <div className="cart__product__body">
    <p> 
      <b>${name}</b>
    </p>
    <p> 
      <small>price: $${price} | <b>$${
        amount * price
      }</b></small>
          </p>
          <p>
          <small>disponible ${quantity}</small>
          </p>

        <div className="cart__product__opt" id="${id}">
         <i class='bx bx-minus'></i>
        <span>${amount}</span>
        <i class='bx bx-plus'></i>
        <i class='bx bxs-trash'></i>
    </div>
    </div>
    </div>
    `;
    
    };
    document.querySelector(".cart__products").innerHTML = html;
}

function addToCartFromProducts(store) {
  const productsHTML = document.querySelector(".products");

  productsHTML.addEventListener("click", function(e){
    //TARGET: hace referenecia al elemento que se hace click
    if((e.target.classList.contains("product__btn"))) {
      const id = Number(e.target.id);
      const productFound = store.products.find(function(product){
        return product.id === id;
      });

      //objeto store.car
      if (store.cart[productFound.id]){
        validateAmountProduct(store,productFound.id);
      }else{
        store.cart[productFound.id]= {
          ...productFound,
          amount: 1,
        };
      };

      localStorage.setItem("cart", JSON.stringify(store.cart));
      printProductsInCart(store);
      printTotal(store);

    //CURRENTTARGET: hace referencia al elemento que se asigno el evento
    // console.log(e.currentTarget);
      };
  });

}

function printTotal(store) {
  let totalProducts = 0;
  let totalPrice = 0;

   for (const key in store.cart) {
        const { amount, price } = store.cart[key];

        totalProducts += amount;
        totalPrice += amount * price;
    }
    document.querySelector("#totalProducts").textContent = totalProducts; 
    document.querySelector("#totalPrice").textContent = totalPrice;
    document.querySelector(".ball").textContent = totalProducts;

   }


function handleCart(store) {
  document.querySelector(".cart__products").addEventListener("click", function(e) {
    if(e.target.classList.contains("bx")) {
      const id = Number(e.target.parentElement.id);
        
      if(e.target.classList.contains("bx-minus")){
        if(store.cart[id].amount === 1) {
          const response = confirm("seguro quieres eliminar?");
          if(response) delete store.cart[id];
        }else{
          store.cart[id].amount--;
        }
      }
      if(e.target.classList.contains("bx-plus")){
        validateAmountProduct(store,id);
      }
      if(e.target.classList.contains("bxs-trash")){
        const response = confirm("seguro quieres eliminar?");
        if(response) delete store.cart[id];
        }
      localStorage.setItem("cart", JSON.stringify(store.cart));
      printProductsInCart(store);
      printTotal(store);
      }
  });
}


function handleTotal(store) {
  document.querySelector(".btn__buy").addEventListener("click", function() {
    if(!Object.values(store.cart).length)  return alert("y si primero compras algo?");
    const response = confirm("seguro que quieres comprar?");
      if(!response) return;

      const newArray = [];

      store.products.forEach((product)=> {
        if(store.cart[product.id]) {
          newArray.push({
            ...product,
            quantity: product.quantity - store.cart[product.id].amount,
          });
    }else{
      newArray.push(product);
    }
    });
  
  
    store.products = newArray;
    store.cart = {};
    localStorage.setItem("products", JSON.stringify(store.products));
    localStorage.setItem("cart", JSON.stringify(store.cart));

    printProducts(store);
    printProductsInCart(store)
    printTotal(store);

  });
}

//FUNCION DE INICIALIZAR LA FUNCION
async function main() {
  //UN OBJETO STORE(TIENDA)
  const store = {
    products: 
        JSON.parse(localStorage.getItem("products")) || 
        (await getProducts()),
    cart: JSON.parse(localStorage.getItem("cart")) || {},
  };
  printProducts(store);
  handleShowCart();
  addToCartFromProducts(store);
  printProductsInCart(store);
  handleCart(store);
  printTotal(store);
  handleTotal(store);
  handleMenu();


};

main();


const switchButton = document.getElementById('switch');
switchButton.addEventListener('click',()=>{
    document.body.classList.toggle('dark');
    switchButton.classList.toggle('active')
})