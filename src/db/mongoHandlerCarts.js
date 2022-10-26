import {usersModel,productsModel} from './dbModels.js'

class HandlerDBCarts {
  constructor() {
    this.collection = usersModel;
    this.product = productsModel;
  }

    async listarCarrito(id) {
      console.log(' listar carrito id recibido'+ id);
      // const user = await this.collection.findOne({id: id});
        try {
          const usuario = await this.collection.findOne({id: id});
          const carrito = usuario.carrito
          // console.log('all recibido desde mongo:'+ carrito)
          return carrito;
        } catch (error) {
          return error;
        }
    };

    async agregarAlCarrito(idProducto,idUsuario) {
    
      const product = await this.product.findOne({id: idProducto}) 

      try {
        const newElement =  await this.collection.findOneAndUpdate( { id: idUsuario},{ $push: { "carrito": product }} );
        return newElement;
      } catch (error) {
        return error;
      }
    };

    async borrarDelCarrito(idProducto,idUsuario) {
    
      const product = await this.product.findOne({id: idProducto}) 
      console.log(product)
      try {
        const clearElement =  await this.collection.findOneAndUpdate( { id: idUsuario},{ $pull: { "carrito": product }} );
        return clearElement;
      } catch (error) {
        return error;
      }
    };

    async borrarCarrito(idUsuario) {
      console.log('function borrarCarrito');
        try {
          const carritoCleared = await this.collection.updateOne({id: idUsuario},{ $set: { "carrito": [] }});
          return carritoCleared;
        } catch (error) {
          return error;
        }
    };

    // async borrarCarrito() {
    //     try {
    //       const element = await this.collection.updateOne({})
    //       return element;
    //     } catch (error) {
    //       return error;
    //     }
    // };
}; 

export { HandlerDBCarts };