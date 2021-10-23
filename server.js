var express=require("express");
var bodyParser=require("body-parser");
const JWT = require("jsonwebtoken");
var mongoose= require("mongoose");
const app= express();



app.use(bodyParser.json())
app.use(express())
app.use(bodyParser.urlencoded(
    {
        extended:true
    }
))

const user = require("./routes/user")
const profile = require("./routes/profile")
//apis
app.use(user);
app.use(profile)

app.listen((5000), () => {
    console.log("Listening on port 5000")
})

// //create connection to connect to mongoDb:
// var db = mongoose.connect('mongodb://localhost:27017/blog',{});


// var db = mongoose.connection;
// //test the connection
// db.on('error',()=>console.log("error in connecting to database"))
// db.once('open',()=>console.log("connected to database"))