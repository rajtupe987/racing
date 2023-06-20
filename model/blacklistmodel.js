
const mongoose=require("mongoose")
const blacklistedTokenSchema=mongoose.Schema({
    accessToken:{type:String,require:true},
    refreshToken:{type:String,require:true},
})
const blacklistModel=mongoose.model("blacklistedtoken",blacklistedTokenSchema)
module.exports={blacklistModel}