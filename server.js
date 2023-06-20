const express = require("express");
const http = require("http");

const app = express();

const server = http.createServer(app);
const port = process.env.PORT || 8000;

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/chat.html");
});

// setup
const io = require("socket.io")(server);
var users = {};
io.on("connection", (socket) => {
  // console.log("id=",socket.id);
  socket.on("new-user-joined", (username) => {
    users[socket.id] = username;
    // console.log(users)
    socket.broadcast.emit("user-connected", username);
    io.emit("user-list", users);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", (user = users[socket.id]));
    delete users[socket.id];
    io.emit("user-list", users);
  });

  socket.on("message", (data) => {
    socket.broadcast.emit("message", {
      user: data.user,
      msg: data.msg,
      time: data.time,
    });
  });
});
server.listen(port, () => {
  console.log(`Server Running at ${port}`);
});
