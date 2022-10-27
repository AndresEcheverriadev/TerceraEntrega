import mongoose from "mongoose";

const collectionUsers = "users";
const collectionProducts = "products";

const productsSchema = mongoose.Schema({
  title: String,
  price: Number,
  thumbnail: String,
  stock: Number,
  id: Number,
});

const usersSchema = mongoose.Schema({
  name: String,
  email: String,
  direccion: String,
  edad: Number,
  password: String,
  telefono: Number,
  prefijo: String,
  avatar: String,
  carrito: Array,
});

const productsModel = mongoose.model(collectionProducts, productsSchema);
const usersModel = mongoose.model(collectionUsers, usersSchema);

export { productsModel, usersModel };
