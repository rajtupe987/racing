const express = require("express");
let { connectDB } = require("./Database/db");

const socketio = require("socket.io")
const {Auth_route}=require("./Controller/oath")
var randomId = require("random-id");
const { User, update_word_function } = require("./user");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
let cors = require("cors");

let { router } = require("./Controller/user.rout");

app.use(cors());
app.use(express.json());
require("dotenv").config();

app.get("/",(req,res)=>{
  // res.send("WELCOME")
  res.redirect('https://lambent-selkie-8d4f00.netlify.app/');
})



// swagger part
/**
* @swagger
* components:
*   schemas:
*       user:
*           type: object
*           required:
*              - name
*              - email
*              - password
*           properties:
*               name:
*                   type: string
*                   description: username of the user
*               email:
*                   type: string
*                   description: The user email
*               password:
*                   type: string
*                   description: The user password
* 
*/
/**
* @swagger
* components:
*   schemas:
*       blacklistedtoken:
*           type: object
*           properties:
*               accessToken:
*                   type: string
*                   description: accessToken of the user
*               refreshToken:
*                   type: string
*                   description: refreshToken of the user
*               
*/
/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               conformpassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *       400:
 *         description: Bad Request - Missing required fields or email already exists
 *       500:
 *         description: Internal Server Error - Something went wrong on the server
 */
/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 approved:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 msg:
 *                   type: string
 *                 id:
 *                   type: string
 *                 userName:
 *                   type: string
 *       400:
 *         description: Bad Request - Missing email, password, or wrong password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *       500:
 *         description: Internal Server Error - Something went wrong on the server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 msg:
 *                   type: string
 */
/**
 * @swagger
 * /user/refreshtoken:
 *   get:
 *     summary: Refresh Access Token
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Success - A new access token is generated and sent in the response body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: Bad Request - Refresh token missing or blacklisted, or user needs to log in again
 *       500:
 *         description: Internal Server Error - Something went wrong on the server
 */
/**
 * @swagger
 * /user/logout:
 *   get:
 *     summary: Logout a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful - Both access token and refresh token are blacklisted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *       401:
 *         description: Unauthorized - User is not authenticated or token is invalid/expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *       500:
 *         description: Internal Server Error - Something went wrong on the server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 msg:
 *                   type: string
 */
/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Send a request to Google for login
 *     tags: [OAuth]
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth for login
 *       500:
 *         description: Internal Server Error - Something went wrong on the server
 */
/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Callback after successful Google login
 *     tags: [OAuth]
 *     responses:
 *       302:
 *         description: Redirect to the frontend with user information and access token
 *       500:
 *         description: Internal Server Error - Something went wrong on the server
 */
/**
/**
 * @swagger
 * /auth/google/failure:
 *   get:
 *     summary: Redirect user to a specific route if OAuth login fails
 *     tags: [OAuth]
 *     responses:
 *       302:
 *         description: Redirect to the specified route for assistance with Google login
 *       500:
 *         description: Internal Server Error - Something went wrong on the server
 */


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js TypeRacer project ',
      version: '1.0.0',
      description:
        "About : - This is an type racer application where you can check your typing speed like playing game.",
      license: {
        name: "TypeRacer"
      },
      contact: {
        name: "TypeRacer",
        url: "TypeRacer.com",
        email: "rajtupe@gmail.com",
      },
    },
    servers: [
      {
        url: 'http://localhost:8080/'
      }
    ]
  },
  apis: ['./app.js']
}

const swaggerData = swaggerJSDoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerData))




app.use("/user", router);
app.use("/auth",Auth_route)

const expressServer = app.listen(process.env.PORT, async () => {
  try {
    await connectDB
    console.log(`connected to db ${process.env.PORT}`);
  } catch (error) {
    console.log(error.message);
  }

});


// length of the id (default is 30)
var len = 10;
// pattern to determin how the id will be generated
// default is aA0 it has a chance for lowercased capitals and numbers
var pattern = "aA0";


const io = socketio(expressServer);

//my global array or clients
// let arr = [];

// here is my ranodom paragraph
let para = [
  "One such sentence is The quick brown fox jumps over the lazy dog.This sentence uses every letter of the alphabet, making it a great way to warm up your fingers before embarking on a long typing session.",
  "The quick brown fox jumps over the lazy dog.",
  "The train leaves every morning at 8AM.",
  "Tomorrow early morning first I go to morning walk.",
  "I and my sister dont see each other anymore.",
];


//on connect
let count = 0;
let totalWords = 0;

io.on("connection", (socket) => {
  count += 1;

  socket.on("username", ({ username }) => {
    var id = randomId(len, pattern);
    console.log(id);
    socket.emit("roomno", id);
  });
  let Room;
  socket.on("joinroom", ({ username, roomvalue }) => {
    const users = User(socket.id, username, roomvalue);
    console.log(roomvalue + "from join room");
    console.log(socket.id + "from line no 68");
    socket.join(roomvalue);
    Room = roomvalue;
    io.emit("usersarray", users);
    socket.emit("message", "WELCOME TO RACE BUDDY 😉");
  });
  console.log(`One user connected, total user : ${count}`);

  socket.on("timeleft", (data) => {
    let { timeleft } = data;
    socket.broadcast.to(Room).emit("Time", { timeleft });
  });
  io.emit("user count", count);

  socket.on("display", (data) => {
    socket.broadcast.to(Room).emit("forall", data);
  });

  //emitting the paragraph
  let random = Math.floor(Math.random() * para.length);
  let myParagraph = para[random];
  socket.emit("thePara", myParagraph);

  //recieving the typed text from client
  socket.on("typedText", ({ typedText }) => {
    //console.log(`person having id ${socket.id} is typing :`, typedText);

    if (
      typedText[typedText.length - 1] == myParagraph[typedText.length - 1] &&
      includeFunction(myParagraph, typedText)
    ) {
      if (typedText.length == myParagraph.length) {
        console.log(typedText);
        // users = []
        return socket.emit("typing-update", {
          typedText: "You have finished the race buddy 👏👏👏",
          flag: "Race Completed",
        });
      }
      if (typedText[typedText.length - 1] == " ") {
        let user = update_word_function(socket.id, typedText);
        //console.log(user);
        //console.log(user[0]);
        io.to(user[0].roomvalue).emit("user_data", user[0]);
      }
      // console.log({ typedText, keyCode });
      socket.emit("typing-update", {
        typedText,

        isTyping: true,
        socketID: socket.id,
        flag: true,
        totalWords,
      });
    } else {
      socket.emit("typing-update", {
        typedText,
        isTyping: false,
        socketID: socket.id,
        flag: false,
        totalWords,
      });
    }
  });
  
  //disconnet
  socket.on("disconnect", () => {
    count -= 1;
    //console.log(`One user left, ${count} remaining!!`);
    io.emit("user count", count);
  });
});

/*Here I am checking includes */
const includeFunction = (myParagraph, typedText) => {
  if (myParagraph.includes(typedText)) {
    return true;
  } else {
    return false;
  }
};

module.exports = { count };
