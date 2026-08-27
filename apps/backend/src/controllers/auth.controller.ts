import type { Request, Response } from "express";
import { signup, login} from "../services/auth.service";

export const signupController = async(req:Request , res:Response) =>{
    try{
        const { name,email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                message: "name, email, password are required"
            });


        }

        const user = await signup ({
            name,
            email,
            password,
        });

        return res.status(201).json({
            message: "User created successfully",
            user,
        });

    }catch(error){
        console.error(error);



    }
}

export const loginController = async(req:Request , res:Response)=>{
    try{

        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message:"Invalid credentials",
            });
        }

        const result = await login({
            email,
            password,
        });

        return res.status(200).json(result);

    }catch(error){
        console.log(error);
    }
}