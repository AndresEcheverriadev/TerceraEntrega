import {usersModel} from './dbModels.js'

class HandlerDBCarts {
  constructor() {
    this.collection = usersModel;
  }

    async listarTodo() {
        try {
          const all = await this.collection.find({});
          return all;
        } catch (error) {
          return error;
        }
    };

    async agregarAlCarrito(id,title,price,thumbnail,stock) {
      try {
        const newElement =  await this.collection.updateOne({carrito: []}, {$push: {title,price,thumbnail,stock}});
        return newElement;
      } catch (error) {
        return error;
      }
  };

    async borrarCarrito() {
        try {
          const element = await this.collection.deleteMany({})
          return element;
        } catch (error) {
          return error;
        }
    };
}; 

export { HandlerDBCarts };