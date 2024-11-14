const express = require("express"); 
const path = require("path");
const app = express();
const http = require("http");
const socketio = require("socket.io");
const { disconnect } = require("process");
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
    console.log("connected", socket.id);

    socket.on("send-location", function (data) {
        io.emit("receive-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", function () {
        io.emit("user-disconnected", socket.id);
    });
});



app.get("/",function(req,res){
    res.render("index");
});
server.listen(1000);