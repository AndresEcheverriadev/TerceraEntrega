const socket = io();

const createProductView = async (products) => {
  const template = await (await fetch("/views/partials/vistaProductos.handlebars")).text();
  const templateCompiled = Handlebars.compile(template);
  return templateCompiled({ products });
};


socket.on("products", async (products) => {
  const template = await createProductView(products);
  document.getElementById("productsView").innerHTML = template;
  
  const btn = document.getElementById("btnAdd");

  btn.addEventListener("click", addToCart );

  function addToCart() {
    const title = document.getElementById("productTitle");
    const price = document.getElementById("productPrice");
    const thumbnail = document.getElementById("productThumbnail");
    socket.emit("addToCart",  {
    title: title.value,
    price: price.value,
    thumbnail: thumbnail.value} );
  }

});



