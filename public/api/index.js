const socket = io();

socket.on("products", async (products) => {
  const template = await createProductView(products);
  document.getElementById("productsView").innerHTML = template;
  const btn = document.getElementsByClassName("btnAdd");
  for (index = 0; index < btn.length; ++index) {  
    btn[index].addEventListener("click", addToCart );
  }
});

const createProductView = async (products) => {
  const template = await (await fetch("/views/partials/vistaProductos.handlebars")).text();
  const templateCompiled = Handlebars.compile(template);
  return templateCompiled({ products });
};

socket.on("carrito", async (carrito) => {
  const template = await createCarritoView(carrito);
  document.getElementById("carritoView").innerHTML = template;
  // btn = document.getElementsByClassName("btnAdd");
  // for (index = 0; index < btn.length; ++index) {  
  //   btn[index].addEventListener("click", addToCart );
  // }
  const btnBorrar = document.getElementById("btnBorrar");
  btnBorrar.addEventListener('click',clearCart);
});

const createCarritoView = async (carrito) => {
  const template = await (await fetch("/views/partials/vistaCarrito.handlebars")).text();
  const templateCompiled = Handlebars.compile(template);
  return templateCompiled({ carrito });
};

function addToCart() {
  socket.emit("addToCart", {id: this.id});
}

function clearCart() {
  console.log('btn clear');
  socket.emit("clearCart", {id: this.id});
}