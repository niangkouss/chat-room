let express = require("express");
let path = require("path");
let app = express();//返回一个http的监听函数
let Message  = require("./model").Message;//导入的只是exports

app.use(express.static(path.resolve("./node_modules")));
app.get("/",(req,res)=> {
	res.sendFile(path.resolve("index.html"));
});

let server = require("http").createServer(app);
let io = require("socket.io")(server);
let sockets = {};
io.on("connection",function (socket) { //connection和客户端的connect不一样
	let username;
	console.log("客户端已连接");
	socket.on("message",(msg)=>{
		if(username){
			let reg = /@([^\s]+) (\S+)/;
			let result = msg.match(reg);
			if(result){ //是私聊
				let toUser = result[1];
				let content = result[2];
				sockets[toUser].send({username,content,createAt:new Date().toLocaleString()});
				return
			}
			Message.create({username,content:msg},function (err,message) {
				if(currentRoom){//如果此客户端在房间内
					io.in(currentRoom).emit("message",message);
				}else{
					//如果此客户端在大厅
					io.emit("message",message); //message有_id username content createAt _version
				}
			});//createAt用数据库自己的
			return;
		}
		username = msg;
		sockets[username] = socket; //用户名和socket要做映射
		io.emit("message",{username:'系统',content:`欢迎${username}来到聊天室`,createAt:new Date().toLocaleString()});//接收到客户端消息之后广播


	});

	socket.on("getAllMessage",function () {
		Message.find().sort({createAt:-1}).limit(20).exec(function (err,message) {//时间倒序排获取20条
			message.reverse();//显示的时候是要倒着显示
			socket.emit("allMessage",message);
		});
	});
	let currentRoom;
	socket.on("join",function (roomname) {
		if(currentRoom){
			socket.leave(currentRoom);
		}
		socket.join(roomname);
		currentRoom = roomname;
	});
});
server.listen(8080); //app.listen()等同于require("http").createServer(app).listen(8080),因为socket.io用到server就分开写