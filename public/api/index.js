const socket = io();

socket.on("products", async (products) => {
  const template = await createProductView(products);
  document.getElementById("productsView").innerHTML = template;
  const btn = document.getElementsByClassName("btnAdd");
  for (index = 0; index < btn.length; ++index) {
    btn[index].addEventListener("click", addToCart);
  }
});

const createProductView = async (products) => {
  const template = await (
    await fetch("/views/partials/vistaProductos.handlebars")
  ).text();
  const templateCompiled = Handlebars.compile(template);
  return templateCompiled({ products });
};

socket.on("carrito", async (carrito) => {
  const template = await createCarritoView(carrito);
  document.getElementById("carritoView").innerHTML = template;
  const btnQuitar = document.getElementsByClassName("btnRemove");
  for (index = 0; index < btnQuitar.length; ++index) {
    btnQuitar[index].addEventListener("click", removeFromCart);
  }

  const btnBorrar = document.getElementById("btnBorrar");
  btnBorrar.addEventListener("click", clearCart);

  calcCart();
});

const createCarritoView = async (carrito) => {
  const template = await (
    await fetch("/views/partials/vistaCarrito.handlebars")
  ).text();
  const templateCompiled = Handlebars.compile(template);
  return templateCompiled({ carrito });
};

function addToCart() {
  socket.emit("addToCart", { idProducto: this.id });
}

function removeFromCart() {
  socket.emit("removeFromCart", { idProducto: this.id });
}

function clearCart() {
  socket.emit("clearCart");
}

function calcCart() {
  const totalCarrito = [];
  const productosPrices = document.getElementsByClassName(
    "productoPriceCarrito"
  );
  const arrayProductos = Array.prototype.slice.call(productosPrices);
  for (index = 0; index < arrayProductos.length; ++index) {
    totalCarrito.push(parseInt(arrayProductos[index].innerText));
  }
  const initialValue = 0;
  const sumaCarritoTotal = totalCarrito.reduce(
    (previous, current) => previous + current,
    initialValue
  );

  if (productosPrices) {
    console.log(sumaCarritoTotal);
    const sumaCarrito = document.getElementById("sumaCarrito");
    sumaCarrito.innerHTML = sumaCarritoTotal;
  }
}
