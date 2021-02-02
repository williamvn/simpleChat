const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const publicPath = path.join(__dirname, './public');
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.static(publicPath));

const server = http.createServer(app);
const io = socketIO(server);

let clientId = 0;

io.on("connection", (socket) => {
    console.log("New User Connected");
    console.log(clientId);

    socket.emit("init", {
        id: clientId
    });

    clientId += 1;

    socket.on("clientMessage", (ev) => {
        console.log("Message from client: " + ev.from);
        console.log(ev);

        io.emit("newMessage", {
            from: ev.from,
            message: ev.message,
        });
    });

    socket.on("status", (ev)=>{
        io.emit("status", ev);
    });
});

server.listen(PORT, () => { console.log(`Server Running on PORT ${PORT}`) });
