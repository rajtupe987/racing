
const socket = io();

var username; 
var chats = document.querySelector(".chats");
let users_list = document.querySelector(".user-list");
let user_count = document.querySelector(".user-count")
let msg_send = document.querySelector("#msg-send");
let user_msg = document.querySelector("#user-msg");

do {
    username=prompt("Enter your Username: ")
} while (!username)

socket.emit("new-user-joined",username.charAt(0).toUpperCase() + username.slice(1))

// user join notify
socket.on("user-connected", (socket_name) => {
    userJoinLeft(socket_name, 'joined');
});

//join/left status
function userJoinLeft(name, status) {
    let div = document.createElement("div");
    div.classList.add("user-join");
    let content = `<p id="new-user"><b>${name}</b> ${status} the chat</p>`;
    div.innerHTML = content;
    chats.appendChild(div);
}

socket.on("user-disconnected", (user) => {
    userJoinLeft(user.charAt(0).toUpperCase(), 'left');
})

// update userlist
socket.on("user-list", (users) => {
    users_list.innerHTML = "";
    users_arr = Object.values(users);
    for (let i = 0; i < users_arr.length; i++){
        let p = document.createElement("p");
        p.id="new-user"
        p.innerText = users_arr[i];
        users_list.appendChild(p)
    }
    user_count.innerHTML = users_arr.length;
})

msg_send.addEventListener("click", () => {
    var now = new Date();
    var time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    let data = {
        user: username.charAt(0).toUpperCase() + username.slice(1),
        msg: user_msg.value,
        time:time
    };
    // console.log("dt=",data);
    if (user_msg.value != '') {
        appendMessage(data, "out");
        socket.emit("message", data);
        user_msg.value = '';
    }
});

function appendMessage(data, status) {
    let div = document.createElement("div");
    div.classList.add("message", status);
    let content = `
    <h5>${data.user} <span>${data.time}</span></h5>
    <p>${data.msg}</p>
    `;
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}

socket.on("message", (data) => {
    appendMessage(data,"in")
})