import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const router = express.Router();

router.post("/signup",async(req,res)=>{
   try{ const{username,email,password}=req.body;
    const hashed = await bcrypt.hash(password,10);
    const user=new User({username,email,password:hashed});
    await user.save();
    res.json({message:"User created successfully"});
   }catch(err){
       console.error(err);
       res.status(500).json({message:"Internal server error"});
   }
});

router.post("/login",async(req,res)=>{
    try{
        const{email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch)
        {
          return res.status(400).json({message:"Invalid Password"});
        } 
        const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
        res.json({token,user:{username:user.username,id:user._id}});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message:"Internal server error"});
    }
});

export default router;
