var express=require("express");
var bodyParser=require("body-parser");
var mongoose= require("mongoose");
var mongo = require('mongodb').MongoClient;
var objectID = require('mongodb').ObjectId;

const {body,validationResult} = require('express-validator')


//create variable for express js
const app= express();
//load the modules for usage in application

app.use(bodyParser.json())
app.use(express())
app.use(bodyParser.urlencoded(
    {
        extended:true
    }
))
var server = app.listen(5000, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
 })

//create connection to connect to mongoDb:
var db = mongoose.connect('mongodb://localhost:27017/blog',{});


var db = mongoose.connection;
//test the connection
db.on('error',()=>console.log("error in connecting to database"))
db.once('open',()=>console.log("connected to database"))

app.get("/",(req,res)=>
{
    res.set
    (
        {
            "Allow-access-Allow-Origin":'*'
        }
    )
    return res.redirect('/');
})


app.post("/",  body('password','password must contain 6 chars').isLength({
    min: 6
}),body('email','email is not valid').isEmail().normalizeEmail(),body('name','name must be 4 chars').isLength({min:4}),

(req,res)=>
{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        
        });
       
    }
    var name=req.body.name;
    var email=req.body.email;
    var password=req.body.password;

    var data =
    {
        "name":name,
        "email":email,
        "password":password
    }
      
    db.collection('users').insertOne(data,(err,collection)=>
    {
        if(err)
        {
            throw err;
        }
        console.log("record inserted successfully");
        res.json("post sucessfully");
    });
})


app.put("/:id",(req,res)=>{
    
    let id = req.params.id;
db.collection('users').updateOne({_id: objectID(id)},{$set : req.body},(err,collection)=>
{
    if(err)
    {
        throw err;
    }
    console.log("record inserted successfully");
    res.json("updated successfully");
});
    });

app.delete('/:id', (req, res) => {
   let id = req.params.id;

   db.collection('users').deleteOne({_id:new objectID(id)},
    (err,collection)=>
    {
        if(err)
        {
            throw err;
        }
        console.log("record deleted sucessfully");
        res.json("deleted sucessfully");
    

    });
})
