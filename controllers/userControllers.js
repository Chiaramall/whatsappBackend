const jwt=require('jsonwebtoken')
const mongoose=require('mongoose')
const User=require('../models/UserModel')
const FriendRequest=require('../models/FriendRequest')
const Token=require('../config/Token')
module.exports={
    register: async(req,res)=> {
        try {
            const {name, email, password, pic} = req.body;
            if (!name || !email || !password) {
                res.status(400).json("Enter all the fields")

            }
            const userExists = await User.findOne({email});
            if (userExists) {
                res.status(400).json("User already exists")
            }
            const createdUser = await User.create({
                name,
                email,
                password,
                pic
            });
            res.status(201).json({
                _id:createdUser._id,
                name:createdUser.name,
                email:createdUser.email,
                password:createdUser.password,
                pic:createdUser.pic,
                token:Token(createdUser._id)
            })

        } catch (e) {
            res.status(500).json(e)
        }
    },




    login:async(req,res)=>{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token:Token(user._id)
            });


        }else{
            res.status(401).json("invalid email or password")
        }


    },
    allUsers:async(req,res)=>{
        const keyword=req.query.search?{
            $or:[{name:{$regex:req.query.search,$options:"i"}},
                {email:{$regex:req.query.search,$options:"i"}}]
        }: {};
        const users=await User.find(keyword).find({_id:{$ne:req.user._id}})
         res.send(users)
    }

}