import {usersModel,productsModel} from './dbModels.js'

class HandlerDBCarts {
  constructor() {
    this.collection = usersModel;
    this.product = productsModel;
  }

    async listarCarrito(id) {
      console.log('data recibida desde server'+ id);
      // const user = await this.collection.findOne({id: id});
        try {
          const usuario = await this.collection.findOne({id: 1});
          const carrito = usuario.carrito
          // console.log('all recibido desde mongo:'+ carrito)
          return carrito;
        } catch (error) {
          return error;
        }
    };

    async agregarAlCarrito(id,usuario) {
    
      const product = await this.product.findOne({id: id}) 
      console.log(product)
      try {
        const newElement =  await this.collection.findOneAndUpdate( { id: 1},{ $push: { "carrito": product }} );
        return newElement;
      } catch (error) {
        return error;
      }
    };

    async borrarCarrito(id) {
      console.log('function borrarCarrito');
        try {
          const carritoCleared = await this.collection.updateOne({id: 1},{ $set: { "carrito": [] }});
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