console.log("on Main");
var socket = io();

let id;
let board = document.getElementById("board");



socket.on("connect", () => {
    // sendMessage();
});

socket.on("init", (ev) => {
    console.log("Initializating");
    id = ev.id;
});

socket.on("disconnect", () => { console.log("User disconnected") });

socket.on("newMessage", (ev) => {
    var chatList = document.getElementById("chatList");
    var li = document.createElement("li");
    var span = document.createElement("span");
    span.classList = ["white-msg"];
    li.classList = ["d-flex justify-content-start m-4"];
    var from = `<div class="small"> Client: ${ev.from} </div> \n`;
    if (ev.from == id) {
        li.classList = ["d-flex justify-content-end m-4"];
        span.classList = ["green-msg"];
        from = "";
    }
    span.innerHTML = ` ${from} ${ev.message}`;
    
    li.appendChild(span);
    chatList.appendChild(li);
    chatList.scrollTop = chatList.scrollHeight;
});

socket.on("status", (ev) => {
    console.log(ev);
    if (ev.from != id && ev.status != "reading") {
        var status = document.getElementById("status");
        console.log(ev);
        status.innerHTML = `<i>Client ${ev.from} ${ev.status}...</i>`;
    }
    else {
        var status = document.getElementById("status");
        console.log(ev);
        status.innerHTML = ``;
    }
});

function sendMessage() {
    var msg = board.value;
    board.value = "";
    socket.emit("clientMessage", {
        from: id,
        message: msg
    });
    socket.emit("status", {
        from: id,
        status: "reading"
    });
}



board.addEventListener("keyup", function (event) {
    if (event.code == "Enter" || board.value == "") {
        socket.emit("status", {
            from: id,
            status: "reading"
        });
        if (event.code == "Enter") {
            sendMessage();
        }
    }
    else {
        console.log(event.code);
        socket.emit("status", {
            from: id,
            status: "writing"
        });
    }
});