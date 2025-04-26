import mongo from 'mongoose';

export const connectDB = async () => {
    try{
         const conect = await mongo.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully");
    }
    catch(error){
      console.log("MongoDB connection failed", error.message);
    }
}