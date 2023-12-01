const containerCards = document.getElementById('cards')
const btnAddProduct = document.getElementById('create-product');
const modal = document.querySelector('.modal');
const closeMod = document.getElementById('close-modal');
const inputName = document.getElementById('input-name');
const inputImg = document.getElementById('input-img');
const inputPrice = document.getElementById('input-price');
const inputDescription = document.getElementById('input-description');
const inputCategory = document.getElementById('input-category');
const inputStock = document.getElementById('input-stock');
const inputSKU = document.getElementById('input-sku');
const btnAddToCart = document.querySelector('.btnAdd')
const emptyCart = document.getElementById('empty-cart');
const saveProduct = document.getElementById('save-product');
const btnFilterAsc = document.getElementById('filter-asc');
const btnFilterDesc = document.getElementById('filter-desc');
const btnModifyProduct = document.getElementById('modify-product');
const modifyModal = document.querySelector('.modal-modify')
const closeModModal = document.getElementById('close-modal-modify');
const btnUpdate = document.getElementById('update-product');




window.addEventListener('load', renderCards);

function renderCards(){
  containerCards.innerHTML = ''; // Limpiar el contenedor antes de renderizar

  products.map(product => {
      product ? createCards(product) : null;
  });
}




function createCards(product){
    const {sku, name, price, image, description, category, stock} = product;

    const card = document.createElement('div');
    card.classList.add('card-product');
    card.setAttribute('data-category', product.category);
    card.setAttribute('data-sku', product.sku);
    product.isActive = true;

    const imgCard = document.createElement('img');
    imgCard.setAttribute('src', image);
    imgCard.setAttribute('alt', `${name}-${sku}`);
    imgCard.classList.add('image');

    const nameCard = document.createElement('p');
    nameCard.textContent = name;
    nameCard.classList.add('name-product');

    const priceCard = document.createElement('p');
    priceCard.textContent = `$${price}USD`;
    priceCard.classList.add('price');
    
    const desCard = document.createElement('p');
    desCard.textContent = description;
    desCard.classList.add('description');

    const categoryCard = document.createElement('p');
    categoryCard.textContent = `Categoria: ${category}`;
    categoryCard.classList.add('category')

    const stockCard = document.createElement('p');
    stockCard.textContent = `Existencias: ${stock}`;
    stockCard.classList.add('stock');
    

    const btnAdd = document.createElement('button');
    btnAdd.setAttribute('id',sku);
    btnAdd.classList.add('btnAdd');
    btnAdd.textContent = 'Añadir al carrito';
    
    card.appendChild(imgCard);
    card.appendChild(nameCard);
    card.appendChild(priceCard);
    card.appendChild(desCard);
    card.appendChild(categoryCard);
    card.appendChild(stockCard);
    card.appendChild(btnAdd);

    containerCards.appendChild(card);
}


function updateStock(updatedProduct) {
  if (updatedProduct.stock === 0) {
    // Actualizar el estado isActive a false
    const foundProduct = products.find(product => product.sku === updatedProduct.sku);
    if (foundProduct) {
        foundProduct.isActive = false;
        console.log('Estado de isActive actualizado a false:', foundProduct.isActive);
    }
    
    renderCards();
  }
}

btnAddProduct.addEventListener('click', addProdcut);

function addProdcut(){
    modal.classList.add('modal-show');
}

closeMod.addEventListener('click', closeModal);

function closeModal(){
    modal.classList.remove('modal-show')
}

saveProduct.addEventListener('click', createNewProduct)

function createNewProduct(){
    modal.classList.remove('modal-show')
    let product = {sku:'', name:'', price:'', image:'', description:'', category:'', stock:''};
    product.name = inputName.value;
    product.sku = inputSKU.value;
    product.price = inputPrice.value;
    product.image = inputImg.value;
    product.description = inputDescription.value;
    product.category = inputCategory.value;
    product.stock = inputStock.value;

    //products.push(product);
    products=[...products,product]
    renderCards();
}

// Array para almacenar los productos en el carrito
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    try {
        const storedCart = localStorage.getItem('products-in-cart');
        if (storedCart) {
            // Intenta analizar la cadena JSON
            cart = JSON.parse(storedCart);
            updateCart();  // Actualiza la interfaz del carrito después de cargar desde localStorage
        }
    } catch (error) {
        // Maneja el error al analizar la cadena JSON
        console.error('Error parsing cart from localStorage:', error);
        // Puedes tomar medidas adicionales según tus necesidades, como restablecer el carrito o informar al usuario.
    }

    // Resto del código...
});


// Función para agregar un producto al carrito
function addToCart(productToAdd) {
  const { sku, stock } = productToAdd;
  if (stock > 0) {
      const existingItem = cart.find(item => item.sku === sku);

      if (existingItem) {
          existingItem.quantity += 1;
      } else {
          cart.push({ ...productToAdd, quantity: 1 });
      }

      // Actualizar el stock del producto
      productToAdd.stock -= 1;

      // Guardar el carrito en localStorage
      localStorage.setItem('products-in-cart', JSON.stringify(cart));

      // Actualizar la interfaz del carrito
      updateCart();
  }
}

  
  
// Función para actualizar la vista del carrito
function updateCart() {
  const cartItemsDiv = document.getElementById('cart-items');
  cartItemsDiv.innerHTML = '';

  let totalPrice = 0;

  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-new-product');
    cartItem.innerHTML = `<p id = "text">${item.name} - Cantidad:</p> 
    <div class = "buttons">
      <button class = "btn-Minum" onclick="decrementQuantity('${item.sku}')">-</button><p id="text">
      ${item.quantity}</p>
      <button class = "btn-Plus" onclick="incrementQuantity('${item.sku}')">+</button>
      <button class = "btn-Delete" onclick="removeFromCart('${item.sku}')">Eliminar</button>
    </div>`;

    cartItemsDiv.appendChild(cartItem);

    totalPrice += item.price * item.quantity;
  });

  document.getElementById('cart-total').innerText = `$${totalPrice}`;
}

// Funciones para ajustar la cantidad de productos en el carrito
function incrementQuantity(sku) {
  const item = cart.find(item => item.sku === sku);
  if (item && item.quantity < item.stock) {
    item.quantity++;
    updateCart();
  }
}

function decrementQuantity(sku) {
  const item = cart.find(item => item.sku === sku);
  if (item && item.quantity > 1) {
    item.quantity--;
    updateCart();
  }
  
}

// Función para eliminar un producto del carrito
function removeFromCart(sku) {
  cart = cart.filter(item => item.sku !== sku);
  localStorage.setItem('products-in-cart', JSON.stringify(cart));
  updateCart();
}


// Función para vaciar completamente el carrito
document.getElementById('empty-cart').addEventListener('click', () => {
  cart = [];
  localStorage.setItem('prdocuts-in-cart', cart)
  updateCart();
});

// Función para realizar el checkout (puedes implementarla según tus necesidades)
document.getElementById('checkout').addEventListener('click', () => {
  // Lógica para finalizar la compra
});

// Evento al hacer clic en "Añadir al carrito" en cada producto
containerCards.addEventListener('click', function(event) {
    if (event.target.classList.contains('btnAdd')) {
      const sku = event.target.getAttribute('id');
      const productToAdd = products.find(product => product.sku === sku);
      addToCart(productToAdd);
    }
  });
  
  // Función para eliminar un producto del carrito
  function removeFromCart(sku) {
    cart = cart.filter(item => item.sku !== sku);
    localStorage.setItem('products-in-cart', JSON.stringify(cart));
    updateCart();
}

  
  // Función para vaciar completamente el carrito
  emptyCart.addEventListener('click', () => {
    cart = [];
    localStorage.setItem('products-in-cart', cart);
    updateCart();
  });
  
  // Función para realizar el checkout (puedes implementarla según tus necesidades)
  document.getElementById('checkout').addEventListener('click', () => {
    // Lógica para finalizar la compra
  });

  function filterByCategory(category) {
    document.querySelectorAll('.card-product').forEach( card =>{
        card.style.display = 'none'
    })

    if (category === 'Todo') {
        document.querySelectorAll('.card-product').forEach( card =>{
            card.style.display = 'block'
        })
    }else{
        document.querySelectorAll(`[data-category=${category}]`).forEach(card =>{
            card.style.display = 'block'
        })
    }
}

  
function sortProducts(order) {
  if (order === 'asc') {
    products = sortByPriceAscending(products);
  } else if (order === 'desc') {
    products = sortByPriceDescending(products);
  }

  renderCards();
}

// Luego, donde sea que necesites ordenar los productos, como por ejemplo en un botón para ordenar ascendente o descendente, llama a la función sortProducts con el parámetro adecuado:

// Para ordenar ascendente
// Suponiendo que tienes un botón con un evento para ordenar ascendente
btnFilterAsc.addEventListener('click', () => {
  sortProducts('asc');
});

// Para ordenar descendente
// Suponiendo que tienes un botón con un evento para ordenar descendente
btnFilterDesc.addEventListener('click', () => {
  sortProducts('desc');
});


function sortByPriceAscending(products) {
  return products.slice().sort((a, b) => a.price - b.price);
}

function sortByPriceDescending(products) {
  return products.slice().sort((a, b) => b.price - a.price);
}

btnModifyProduct.addEventListener('click', showModifyModal);

function showModifyModal(){
  modifyModal.classList.add('modal-modify-show')
}

closeModModal.addEventListener('click', closeModalModify);

function closeModalModify(){
    modifyModal.classList.remove('modal-modify-show')
}

document.getElementById('input-sku2').addEventListener('change', updateModifyForm);

function updateModifyForm() {
  const skuToModify = document.getElementById('input-sku2').value;
  const productToModify = products.find(product => product.sku === skuToModify);

  if (productToModify) {
    // Llena los campos del formulario con los datos del producto
    document.getElementById('input-name2').value = productToModify.name;
    document.getElementById('input-img2').value = productToModify.image;
    document.getElementById('input-price2').value = productToModify.price;
    document.getElementById('input-description2').value = productToModify.description;
    document.getElementById('input-stock2').value = productToModify.stock;
    document.getElementById('input-category2').value = productToModify.category;
  } else {
    // Si no se encuentra el producto, puedes mostrar un mensaje de error o realizar alguna acción adicional.
    console.log('Producto no encontrado');
  }
}

// Agrega un evento de clic al botón "Actualizar producto"
btnUpdate.addEventListener('click', updateProduct);

function updateProduct() {
  const skuToUpdate = document.getElementById('input-sku2').value;
  const indexToUpdate = products.findIndex(product => product.sku === skuToUpdate);

  if (indexToUpdate !== -1) {
    // Actualiza los valores del producto con los nuevos valores del formulario
    products[indexToUpdate].name = document.getElementById('input-name2').value;
    products[indexToUpdate].image = document.getElementById('input-img2').value;
    products[indexToUpdate].price = document.getElementById('input-price2').value;
    products[indexToUpdate].description = document.getElementById('input-description2').value;
    products[indexToUpdate].stock = document.getElementById('input-stock2').value;
    products[indexToUpdate].category = document.getElementById('input-category2').value;

    // Limpia el formulario después de la actualización
    document.getElementById('input-sku2').value = '';
    document.getElementById('input-name2').value = '';
    document.getElementById('input-img2').value = '';
    document.getElementById('input-price2').value = '';
    document.getElementById('input-description2').value = '';
    document.getElementById('input-stock2').value = '';
    document.getElementById('input-category2').value = '';

    // Cierra el modal de modificación
    modifyModal.classList.remove('modal-modify-show');

    // Vuelve a renderizar las tarjetas con los productos actualizados
    renderCards();
  } else {
    // Si no se encuentra el producto, puedes mostrar un mensaje de error o realizar alguna acción adicional.
    console.log('Producto no encontrado para actualizar');
  }
}

