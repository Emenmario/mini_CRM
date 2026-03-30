import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import db from "./db.js"
const router=express.Router()
const JWT_SECRET=process.env.JWT_SECRET
router.post('/signup',async(req,res)=>{
    const {name,email,password,username}=req.body;
    try{
        const [exists]=await db.execute("select * from users where email=? or username=?",[email,username])
        if(exists.length>0){
           return res.status(409).json({message:"user already exists"})
        }
        const hashedPassword=await bcrypt.hash(password,10)
        const [results]= await db.execute("insert into users (full_name,email,password,username) values(?,?,?,?)",[name,email,hashedPassword,username])
        res.status(201).json({message:"user created"})
    }
    catch(error){
        console.error(error)
        res.status(500).json({message:error.message})
    }

})
router.post("/signin",async(req,res)=>{
    const {username,password}=req.body
   try{ const [exists]=await db.execute("select * from users where username=?",[username])
    const user=exists[0]
    if(!user||!(await bcrypt.compare(password,user.password))){
        return(res.status(401).json({message:"invalid credentials"}))
    }
    const token=jwt.sign({id:user.id,email:user.email},JWT_SECRET,{expiresIn:"1d"});
    res.json({token,user:{id:user.id,full_name:user.full_name}})
}
    catch(error){
        console.error(error)
        res.status(500).json({message:error.message})
    }
})
export default router;