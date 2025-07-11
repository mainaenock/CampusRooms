import mongoose from "mongoose";

export default async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('database connected successfully'))
    } catch (error) {
        console.error('Database connection error: ', error)
    }
}