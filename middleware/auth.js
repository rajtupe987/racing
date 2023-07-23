const jwt = require("jsonwebtoken");
const { blacklistModel } = require("../model/blacklistmodel")

require("dotenv").config()
const authenticate = async (req, res, next) => {
    const token = req.headers.authorization
    //console.log("token",token)
    try {
        if (token) {
            const tokenblacklist = await blacklistModel.findOne({ accessToken: token })
            //console.log("token",tokenblacklist)
            if (tokenblacklist) {
                return res.status(401).send({ "msg": "please login" })
            }
            const decoded = jwt.verify(token, process.env.secrete_key)
            if (decoded) {
                //after succesfully toekn varified we are decoding the toekn to extract userId
                const { userId } = decoded;
                //Checking if user exists
                const user = await userModel.findById(userId);
                if (!user) {
                    return res.status(401).json({ message: "User not found", ok: false })
                }
                req.body.user = user._id;
                next()
            } else {
                return res.status(400).send({ "msg": "please login" })
            }

        } else {
            return res.status(400).send({ "msg": "please login" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ "msg": "something weent wrong on authenticate" })
    }
}

module.exports = { authenticate }


// const jwt = require('jsonwebtoken')
// const { userModel } = require("");
// const { blacklistModel } = require("../model/blacklistmodel")
// require("dotenv").config()
// const authMiddleWare = async (req, res, next) => {
//     try {
//         const token = req.headers.authorization;
//         const decodedToken = jwt.verify(token, process.env.secret);
//         const tokenblacklist = await blacklistModel.findOne({ accessToken: token });
//         if (tokenblacklist) {
//             return res.status(401).send({ "msg": "please login" })
//         }
//         //after succesfully toekn varified we are decoding the toekn to extract userId
//         const { userId } = decodedToken;
//         //Checking if user exists
//         const user = await userModel.findById(userId);
//         if (!user) {
//             return res.status(401).json({ message: "User not found", ok: false })
//         }
//         req.body.user = user._id;
//         next()
//     } catch (error) {
//         return res.status(401).json({ message: error.message })
//     }
// }

// module.exports = {authMiddleWare}
