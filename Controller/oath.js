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

        res.redirect(`https://rural-snails-2863.up.railway.app/app.html?id=${user._id}&token=${token}&approved=${user.approved}&username=${user.name}`); 
    }
);


// if suppose it OAuth fails 
Auth_route.get("/google/failure", (req, res) => {
    res.redirect("https://rural-snails-2863.up.railway.app/login.html")
})


// for compairing client id and all
passport.use(
    new Google_stratergy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "https://rural-snails-2863.up.railway.app",
            passReqToCallback: true
        },
        async function (request,profile,cb) {
            let email = profile._json.email;
            let user_data = await userModel.findOne({ email });
            if (user_data) {
                return cb(null, user_data);
            }
            const user = new userModel({
                email,
                pass: uuidv4(),
            });
            await user.save();
            return cb(null, user);
        }
    )
);

module.exports = {
    Auth_route
}