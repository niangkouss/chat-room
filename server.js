let express = require("express");
let path = require("path");
let app = express();//返回一个http的监听函数

app.get("/",(req,res)=> {
	res.sendFile(path.resolve("index.html"));
});

let server = require("http").createServer(app);
let io = require("socket.io")(server);

io.on("connection",function (socket) { //connection和客户端的connect不一样
	console.log("客户端已连接");
	socket.on("message",(msg)=>{
		socket.send("server:"+msg);
	});
});
server.listen(8080); //app.listen()等同于require("http").createServer(app).listen(8080),因为socket.io用到server就分开写