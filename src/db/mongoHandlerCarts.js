import {usersModel,productsModel} from './dbModels.js'

class HandlerDBCarts {
  constructor() {
    this.collection = usersModel;
    this.product = productsModel;
  }

    async listarCarrito(id) {
      // const user = await this.collection.findOne({id: id});
        try {
          const all = await this.collection.find({id: id},{'carrito': {}});
          return all;
        } catch (error) {
          return error;
        }
    };

    async agregarAlCarrito(id) {
      console.log('data recibida'+ id);
      const product = await this.product.findOne({id: id}) 
      console.log(product)
      try {
        const newElement =  await this.collection.findOneAndUpdate( { id: 1},{ $push: { "carrito": product }} );
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