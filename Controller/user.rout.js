const express=require("express")
const router=express.Router()
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const {userModel}=require("../model/usermode");

const {authenticate}=require("../Middleware/auth")
const cookieparser=require("cookie-parser")
router.use(cookieparser())
const {blacklistModel}=require("../model/blacklistmodel")


// ************ register section************************

router.post("/signup",async(req,res)=>{
    try {
        const {name,email,username,password,conformpassword}=req.body
        if(!name){
            return res.status(400).send({"message":"name is required"})
        }
        if(!email){
            return res.status(400).send({"message":"email is required"})
        }
        if(!username){
            return res.status(400).send({"message":"username is required"})
        }
        if(!password){
            return res.status(400).send({"message":"password is required"})
        }
        if(!conformpassword){
            return res.status(400).send({"message":"conformpassword is required"})
        }

       
        const userExist= await userModel.findOne({email})
        if(userExist){
            return res.status(400).send({"message":"email is already exist please signup"})
        }
        const existusername=await userModel.findOne({username})
        if(userExist){
            return res.status(400).send({"message":"username is already exist please signup"})
        }
        bcrypt.hash(password,7,async(error,hash)=>{
            if(error){
                console.log("bcrypt",error)
                return res.status(500).send({"message":"something went wrong"})  
            }
            const user= new userModel({name,email,username,password:hash})
             await user.save()
             res.status(200).send({"message":"register seccessfully"})
        })  
    } catch (error) {
        console.log(error)
        res.status(500).send({"message":"something went wrong "})
    }
})

// ********************* login *************************
router.post("/login",async(req,res)=>{
    const {username,password}=req.body
    console.log(username,password)
    try {
        if(!username){
            return res.status(400).send({"message":"put username"})
        }
        if(!password){
            return res.status(400).send({"message":"put password"})
        }
        const user=await userModel.findOne({username})
        console.log(user)
        if(user){
            bcrypt.compare(password,user.password,(error,result)=>{
               if(result){
                const accesstoken=jwt.sign({username},"khirod",{expiresIn:"6h"})
                const refreshtoken=jwt.sign({username},"shreyansh",{expiresIn:"24h"})
                res.cookie("accessToken",accesstoken,{maxAge:7*24*60*60*1000})
                res.cookie("refreshToken",refreshtoken,{maxAge:7*24*60*60*1000})
                res.status(200).send({"message":"login syccessfull","token":accesstoken})
               }else{
                return res.status(400).send({"message":"wrong password"})
               } 
            })
        }else{
            return res.status(400).send({"message":"put correct email id"})
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({"message":"something went wrong"})
    }
})


// ************ refreshtoken ************
router.get("/refreshtoken",async(req,res)=>{
    const refreshtoken = req.cookies.refreshToken;
    try {
        const isblacklist= await blacklistModel.findOne({ refreshToken:refreshtoken})
        if(isblacklist) return res.status(400).send({msg:"Please login"})
        if(refreshtoken){
            const isvalid=jwt.verify(refreshtoken,"shreyansh")
            console.log(isvalid)
            if(isvalid){
            const newaccesstoken=jwt.sign({email:isvalid.email},"khirod",{expiresIn:"6h"})
            res.cookie("accessToken",newaccesstoken,{maxAge:7*24*60*60*1000})
                res.send(newaccesstoken)
            }
        }else{
            res.status(400).send({"message":"please login"})
        }
    } catch (error) {
        console.log(error)
        return res.send({"message":error.message})
    }
   
})

// ****************logout***************


router.get("/logout",authenticate,async(req,res)=>{
    const {accessToken,refreshToken}=req.cookies
    console.log(accessToken,refreshToken)
    const Baccesstoken= new blacklistModel({accessToken})
    await Baccesstoken.save()
    const Brefreshtoken= new blacklistModel({refreshToken})
    await Brefreshtoken.save()
    res.status(200).send({"message":"logout successfull"})
})



module.exports={router}