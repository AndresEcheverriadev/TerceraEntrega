import mongoose from 'mongoose';

const collectionUsers = "users";
const collectionProducts= "products";

const usersSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String
})

const productsSchema = mongoose.Schema({
    title:String,
    price:Number,
    thumbnail:String,
    stock:Number
})

const usersModel = mongoose.model(collectionUsers,usersSchema);
const productsModel = mongoose.model(collectionProducts,productsSchema);
export  {usersModel ,productsModel};