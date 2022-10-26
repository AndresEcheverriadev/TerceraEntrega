const socket = io();

socket.on("start", (arg) => {
  console.log('recibiendo socket')
  alert(arg);
  const idHeader = document.getElementsByClassName("userDataId")[0].id;
  socket.emit("idUsuario", {idUsuario:idHeader});
});

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
  const btnQuitar = document.getElementsByClassName("btnRemove");
  for (index = 0; index < btnQuitar.length; ++index) {  
    btnQuitar[index].addEventListener("click", removeFromCart );
  }

  const btnBorrar = document.getElementById("btnBorrar");
  btnBorrar.addEventListener('click',clearCart);
});

const createCarritoView = async (carrito) => {
  const template = await (await fetch("/views/partials/vistaCarrito.handlebars")).text();
  const templateCompiled = Handlebars.compile(template);
  return templateCompiled({ carrito });
};

function addToCart() {
  const idHeader = document.getElementsByClassName("userDataId")[0].id;
  socket.emit("addToCart", {idProducto: this.id, idUsuario: idHeader });
}

function removeFromCart() {
  const idHeader = document.getElementsByClassName("userDataId")[0].id;
  socket.emit("removeFromCart", {idProducto: this.id,idUsuario:idHeader});
}

function clearCart() {
  const idHeader = document.getElementsByClassName("userDataId")[0].id;
  socket.emit("clearCart",{idUsuario: idHeader});
}