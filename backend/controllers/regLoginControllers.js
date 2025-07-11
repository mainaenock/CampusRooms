import User from "../models/registrationModel.js";
import bcrypt from 'bcryptjs'

export async function createUser(req, res) {
    try {
        const {name, role, email, password} = req.body
        const user = await User.findOne({email})

        if(user) {
            return res.status(400).json({message: "User already exists"})
        }

        const hashed = await bcrypt.hash(password, 10)
        const newUser = await User.create({name, role, email, password: hashed})

        res.status(201).json(newUser)
    } catch (error) {
        console.log('User creating function error: ', error)
    }
}

export async function getUsers(req, res) {
    try {
        const users = await User.find().sort({createdAt: -1})
        res.status(200).json(users)
    } catch (error) {
        console.log('getting users error: ', error)
    }
}