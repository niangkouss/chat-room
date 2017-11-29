let express = require("express");
let path = require("path");
let app = express();//返回一个http的监听函数

app.use(express.static(path.resolve("./node_modules")));
app.get("/",(req,res)=> {
	res.sendFile(path.resolve("index.html"));
});

let server = require("http").createServer(app);
let io = require("socket.io")(server);

io.on("connection",function (socket) { //connection和客户端的connect不一样
	let username;
	console.log("客户端已连接");
	socket.on("message",(msg)=>{
		if(username){
			io.emit("message",{username,content:msg,createAt:new Date().toLocaleString()});//接收到客户端消息之后广播
			return;
		}
		username = msg;
		io.emit("message",{username:'系统',content:`欢迎${username}来到聊天室`,createAt:new Date().toLocaleString()});//接收到客户端消息之后广播


	});
});
server.listen(8080); //app.listen()等同于require("http").createServer(app).listen(8080),因为socket.io用到server就分开写