import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.CONN_STRING);
        console.log("Connected to DB successfully");
    }
    catch (err){
        console.log("Can't connect to db, ", err.message);
        process.exit(1);
    }
};

export default connectDB;
