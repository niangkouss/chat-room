let mongoose = require("mongoose");
mongoose.Promise = Promise;//会报错mpromise...
mongoose.connect("mongodb://localhost/mongodbData",{useMongoClient:true});//新版本要添加第二个参数
let MessageSchema = new mongoose.Schema({
	username:String,
	content:String,
	createAt:{type:Date,default:Date.now}
});
let Message = mongoose.model("Message",MessageSchema);
exports.Message = Message;