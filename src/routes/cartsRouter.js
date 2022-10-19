import { Router } from "express";
import { ProductDao } from "../daos/index.js";
import { CartDao } from "../daos/index.js";

const cartsRouter = Router();

const ProductApi = ProductDao
const CartApi = CartDao ;

const isAdmin = true;

const errorHandles = {
  noAdmin : 'Usuario no autorizado',
  noCart : 'Carrito no encontrado',
  noProduct : 'Producto no encontrado'
};

const adminState = (req, res, next) => {
    if (!isAdmin) res.send({ error: errorHandles.noAdmin });
    next();
};

const newCart = {
    products: [],
};

cartsRouter.post("/", async (req, res) => {
  try {
    const { nombre } = req.body;
      const cart = await CartApi.crearElemento({...newCart,nombre: nombre?? 'carritoPrueba'});
      const cartId = cart.id;
      res.send({ id: cartId });
  } catch (error) {
      res.send(error);
  }
});

cartsRouter.post("/:id/productos", async (req, res) => {
    try {
        const { id } = req.params;
        const { productId } = req.body;
    
        const cart = await CartApi.listarPorId(id);
    
        if (!cart) res.send({ error: errorHandles.noCart });
    
        const product = await ProductApi.listarPorId(productId);
    
        if (!product) res.send({ error: errorHandles.noProduct });
    
        cart.products.push(product);
    
        const updatedCart = await CartApi.actualizarElemento(id, cart);
    
        res.send(updatedCart);
    } catch (error) {
        res.send(error);
    }
});

cartsRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await CartApi.listarPorId(id);
    
        if (!cart) res.send({ error: errorHandles.noCart });
    
        res.send(cart);
    } catch (error) {
        res.send(error);
    }
});

cartsRouter.put("/:id/productos", async (req, res) => {
    try {
      const { id } = req.params;
      const { productId } = req.body;
  
      const cart = await CartApi.listarPorId(id);
  
      if (!cart) res.send({ error: errorHandles.noCart });
  
      cart.products = cart.products.filter((product) => product.id != productId);
  
      const updatedCart = await CartApi.listarPorId(id, cart);
  
      res.send(updatedCart);
    } catch (error) {
      res.send(error);
    }
});

cartsRouter.delete("/:id", async (req, res) => {
  try {
      const { id } = req.params;
      const deletedCart = await CartApi.borrarPorId(id);

      if (!deletedCart) res.send({ error: errorHandles.noCart });

      res.send(deletedCart);
  } catch (error) {
      res.send(error);
  }
});

cartsRouter.delete("/:id/productos/:id_prod", async (req, res) => {
  try {
    const { id,id_prod } = req.params;

    const cart = await CartApi.getById(id);
      if (!cart) res.send({ error: errorHandles.noCart });

    const product = await ProductApi.getById(id_prod);
      if (!product) res.send({ error: errorHandles.noProduct });
    
    const deletedProduct = await cart.product.deleteById(id_prod);

    res.send(deletedProduct);
  } catch (error) {
      res.send(error);
  }
});

export { cartsRouter };