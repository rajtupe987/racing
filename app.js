const express = require("express");
const app = express();

const socketio = require("socket.io");
let { connection } = require("./Database/db");

const {Auth_route}=require("./Controller/oath")
var randomId = require("random-id");
const { User, update_word_function } = require("./user");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
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

// length of the id (default is 30)
var len = 10;
// pattern to determin how the id will be generated
// default is aA0 it has a chance for lowercased capitals and numbers
var pattern = "aA0";

const expressServer = app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log(`connected to db ${process.env.PORT}`);
  } catch (error) {
    console.log(error.message);
  }

});

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
