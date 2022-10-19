import mongoose from "mongoose";

const  initMongoDB = async () => {
  try {
    mongoose.connect(process.env.MONGOURL, {
      dbName: 'MongoSessions',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongo Db Conected");
  } catch (error) {
    console.error(error);
  }
};

const MongoDBService = {
  initMongoDB,
};

export { MongoDBService };
