import {usersModel,productsModel} from './dbModels.js'

class HandlerDBCarts {
  constructor() {
    this.collection = usersModel;
    this.product = productsModel;
  }

    async listarCarrito(id) {
      console.log(' listar carrito id recibido'+ id);
        try {
          const usuario = await this.collection.findOne({_id: id});
          const carrito = usuario.carrito
          return carrito;
        } catch (error) {
          return error;
        }
    };

    async agregarAlCarrito(idProducto,idUsuario) {
    
      const product = await this.product.findOne({id: idProducto}) 

      try {
        const newElement =  await this.collection.findOneAndUpdate( { _id: idUsuario},{ $push: { "carrito": product }} );
        return newElement;
      } catch (error) {
        return error;
      }
    };

    async borrarDelCarrito(idProducto,idUsuario) {
    
      const product = await this.product.findOne({id: idProducto}) 
      try {
        const clearElement =  await this.collection.findOneAndUpdate( {_id: idUsuario},{ $pull: { "carrito": product }} );
        return clearElement;
      } catch (error) {
        return error;
      }
    };

    async borrarCarrito(idUsuario) {
        try {
          const carritoCleared = await this.collection.updateOne({_id: idUsuario},{ $set: { "carrito": [] }});
          return carritoCleared;
        } catch (error) {
          return error;
        }
    };

}; 

export { HandlerDBCarts };