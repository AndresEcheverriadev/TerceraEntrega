import { usersModel, productsModel } from "./dbModels.js";

class HandlerDBCarts {
  constructor() {
    this.collection = usersModel;
    this.product = productsModel;
  }

  async listarCarrito(varUser) {
    try {
      const usuario = await this.collection.findOne({ _id: varUser });
      const carrito = usuario.carrito;
      return carrito;
    } catch (error) {
      return error;
    }
  }

  async agregarAlCarrito(producto, varUser) {
    const product = await this.product.findOne({ id: producto });

    try {
      const newElement = await this.collection.findOneAndUpdate(
        { _id: varUser },
        { $push: { carrito: product } }
      );
      return newElement;
    } catch (error) {
      return error;
    }
  }

  async borrarDelCarrito(producto, varUser) {
    const product = await this.product.findOne({ id: producto });
    try {
      const clearElement = await this.collection.findOneAndUpdate(
        { _id: varUser },
        { $pull: { carrito: product } }
      );
      return clearElement;
    } catch (error) {
      return error;
    }
  }

  async borrarCarrito(varUser) {
    try {
      const carritoCleared = await this.collection.updateOne(
        { _id: varUser },
        { $set: { carrito: [] } }
      );
      return carritoCleared;
    } catch (error) {
      return error;
    }
  }
}

export { HandlerDBCarts };
