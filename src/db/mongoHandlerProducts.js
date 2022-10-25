import {productsModel} from './dbModels.js'

class HandlerDBProductos {
  constructor() {
    this.collection = productsModel;
  }

    async listarTodo() {
        try {
          const all = await this.collection.find({});
          return all;
        } catch (error) {
          return error;
        }
    };

    async listarPorId(id) {
        try {
          const element = await this.collection.find({_id:id});
          return element;
        } catch (error) {
          return error;
        }
    };

    async crearElemento(title,price,thumbnail,stock) {
        try {
          const element = await this.collection.save({title: title,price: price,thumbnail: thumbnail,stock: stock});
          return element;
        } catch (error) {
          return error;
        }
    };

    async actualizarElemento(id,title,price,thumbnail,stock) {
        try {
          const newElement =  await this.collection.updateOne({_id:id},{$set:{title: title,price: price,thumbnail: thumbnail,stock: stock}});
          return newElement;
        } catch (error) {
          return error;
        }
    };

    async borrarPorId(id) {
        try {
          const element = await this.collection.deleteOne({_id:id})
          return element;
        } catch (error) {
          return error;
        }
    };

    async borrarTodo() {
        try {
          const element = await this.collection.deleteMany({})
          return element;
        } catch (error) {
          return error;
        }
    };
}; 

export { HandlerDBProductos };