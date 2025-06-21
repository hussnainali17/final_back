const {validationResult}=require('express-validator');
const userServices=require('../services/user.services');
const userModel=require('../models/user.model');
const bcrypt=require('bcrypt');


module.exports.signup=async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    
    const {name,email,password}=req.body;
        const existingUser=await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        
        const hashedPassword=await userModel.hashPassword(password);
        
        const newUser= await userServices.createUser({
            name,
            email,
            password:hashedPassword
        });
        const token=newUser.generateAuthToken();
        res.status(201).json({token,newUser})
    
}

module.exports.login=async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    
    const {email,password}=req.body;
    
    try {
        const user=await userModel.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid email or password"});
        }

        const isMatch=await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid email or password"});
        }

    
        const token=user.generateAuthToken();
        res.cookie('token', token, {
          httpOnly: true, // Prevents client-side JavaScript access
          secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
          sameSite: 'Strict', // Or 'Lax' depending on your needs
          path: '/', // Cookie valid for the entire domain
          //expires: new Date(Date.now() + 3600000) // Optional: set expiration time (1 hour)
        });
        
        res.status(200).json({token,user});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Internal server error"});
    }
}

module.exports.getUserProfile=async (req,res)=>{
    res.status(200).json(req.user);
}


module.exports.logout=async (req,res)=>{
    res.clearCookie('token');
   // const token=req.cookies.token || req.headers.authorization.split(' ')[1];
    // await blacklistTokenModel.create({token});

    res.status(200).json({message:'Logout successful'});
}