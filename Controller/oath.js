const express = require("express");
const Google_stratergy = require('passport-google-oauth20').Strategy;
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { userModel } = require("../model/usermode");

require("dotenv").config();

const Auth_route = express.Router();
const { v4: uuidv4 } = require("uuid");


// compairing passport
Auth_route.get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);

// On succefull conenction 
Auth_route.get(
    "/google/callback",
    passport.authenticate('google', {
        failureRedirect: '/auth/google/failure',
        session: false
    }),
    function (req, res) {
        let user = req.user;
        const token = jwt.sign({ userId: user._id }, process.env.secrete_key, { expiresIn: '1hr' })

        res.redirect(`http://localhost:8080/?id=${user._id}&token=${token}&approved=${user.approved}&username=${user.userName}`)
    }
);

// if suppose it OAuth fails 
Auth_route.get("/google/failure", (req, res) => {
    res.redirect("https://lambent-selkie-8d4f00.netlify.app/login.html")
})



// for compairing client id and all
passport.use(
    new Google_stratergy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:8080/auth/google/callback",
            passReqToCallback: true
        },
        async function (request, accessToken, refreshToken, profile, cb) {
            let email = profile._json.email;
            let user_data = await userModel.findOne({ email });
            if (user_data) {
                return cb(null, user_data);
            }
            let name = profile._json.name;
            const user = new userModel({
                name,
                email,
                password: uuidv4(),
            });
            await user.save();
            return cb(null, user);
        }
    )
);


module.exports = {
    Auth_route
}