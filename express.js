var express=require("express");
var fs=require("fs");

var server = express();
//server.use(express.bodyParser());
server.get('/',function(request,response){
	console.log("Inside Request Handler");//testing
	var file = fs.readFileSync("data.json", "utf-8");
	
	/*This to read file from the fs and put it into a var 
	file so it can be transferred through the response to the app.*/
	console.log(file);
	response.setHeader('Access-Control-Allow-Origin','*');
	/*Allowing the server to acess the file system of the hard disk or to provide nutrelization bw two different file systems.*/
	response.send(file);  
});
console.log("Server started");
server.listen(8888);