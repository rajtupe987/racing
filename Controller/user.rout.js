const express=require("express")
const router=express.Router()
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const {userModel}=require("../model/usermode");

const {authenticate}=require("../middleware/auth")
const cookieparser=require("cookie-parser")
router.use(cookieparser())
const {blacklistModel}=require("../model/blacklistmodel")

require("dotenv").config();
// ************ register section************************

router.post("/signup",async(req,res)=>{
    try {
        const {name,email,password,conformpassword}=req.body
        if(!name){
            return res.status(400).send({"ok": false,"msg":"name is required"})
        }
        if(!email){
            return res.status(400).send({"ok": false,"msg":"email is required"})
        }
        if(!password){
            return res.status(400).send({"ok": false,"msg":"password is required"})
        }
        if(!conformpassword){
            return res.status(400).send({"ok": false,"msg":"conformpassword is required"})
        }

       
        const userExist= await userModel.findOne({email})
        if(userExist){
            return res.status(400).send({"ok": false,"msg":"email is already exist please signup"})
        }
       
        bcrypt.hash(password,7,async(error,hash)=>{
            if(error){
                console.log("bcrypt",error)
                return res.status(500).send({"ok": false,"msg":"something went wrong"})  
            }
            const user= new userModel({name,email,password:hash})
             await user.save()
             res.status(200).send({"ok": true,"msg":"register seccessfully"})
        })  
    } catch (error) {
        console.log(error)
       // res.status(500).send({"ok": false,"msg":"something went wrong "})
    }


})

// ********************* login *************************
router.post("/login",async(req,res)=>{
    const {email,password}=req.body
    
    try {
        if(!email){
            return res.status(400).send({"ok": false,"msg":"put email"})
        }
        if(!password){
            return res.status(400).send({"ok": false,"msg":"put password"})
        }
        const user=await userModel.findOne({email})
        //console.log(user)
        if(user){
            bcrypt.compare(password,user.password,(error,result)=>{
               if(result){
                const token=jwt.sign({email},process.env.secrete_key,{expiresIn:"6h"})
                const refreshtoken=jwt.sign({email},process.env.ref_key,{expiresIn:"24h"})
                res.cookie("token",token,{maxAge:7*24*60*60*1000})
                res.cookie("refreshToken",refreshtoken,{maxAge:7*24*60*60*1000})


                const response = {
                    "approved": true,
                    "token": token,
                    "msg": "Login Successfull",
                    "id": user._id,
                    "userName": user.name
                  }
                  res.status(200).json(response)
               }else{
                return res.status(400).send({"ok": false,"msg":"wrong password"})
               } 
            })
        }else{
            return res.status(400).send({"ok": false,"msg":"put correct email id"})
        }
    } catch (error) {
        res.status(400).send({"ok": false,"msg":"something went wrong"})
    }
})


// ************ refreshtoken ************
router.get("/refreshtoken",async(req,res)=>{
    const refreshtoken = req.cookies.refreshToken;
    try {
        const isblacklist= await blacklistModel.findOne({ refreshToken:refreshtoken})
        if(isblacklist) return res.status(400).send({msg:"Please login"})
        if(refreshtoken){
            const isvalid=jwt.verify(refreshtoken,process.env.ref_key)
           
            if(isvalid){
            const newaccesstoken=jwt.sign({email:isvalid.email},process.env.secrete_key,{expiresIn:"6h"})
            res.cookie("accessToken",newaccesstoken,{maxAge:7*24*60*60*1000})
                res.send(newaccesstoken)
            }
        }else{
            res.status(400).send({"ok": false,"msg":"please login"})
        }
    } catch (error) {
        
        return res.send({"ok": false,"msg":error.message})
    }
   
})

// ****************logout***************


router.get("/logout",authenticate,async(req,res)=>{
    const {accessToken,refreshToken}=req.cookies
    const Baccesstoken= new blacklistModel({accessToken})
    await Baccesstoken.save()
    const Brefreshtoken= new blacklistModel({refreshToken})
    await Brefreshtoken.save()
    res.status(200).send({"ok": false,"msg":"logout successfull"})
})



module.exports={router}