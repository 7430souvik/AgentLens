import bcrypt from "bcrypt";
import prisma from "../config/db";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;



interface SignupData {
    name:  string;
    email: string;
    password: string;
}


export const signup = async({
    name,
    email,
    password,
}:SignupData)=>{

    const existingUser = await prisma.user.findUnique({
        where:{
            email,
        },
    });

    if(existingUser){
        throw new Error("user already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data:{
            name,
            email,
            passwordHash
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        },
    });
    return user;

}


interface LoginData {
    email: string;
    password: string;
}

export const login = async({
    email,
    password,
}:LoginData) => {
    const user = await prisma.user.findUnique({
        where:{
            email,
        },
    });

    if(!user){
        throw new Error("Invalid email or password");
    }
    const passwordMatch = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if(!passwordMatch){
        throw new Error("Invalid email or password");
    }

    const generateToken = (userId: string) =>{

        return jwt.sign({
            userId,
        },JWT_SECRET,{
            expiresIn:"7d",

        })

    }

    const token = generateToken(user.id);

    return{
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    };
};