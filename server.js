var express=require("express");
var bodyParser=require("body-parser");
var mongoose= require("mongoose");
var objectID = require('mongodb').ObjectId;
const {body,validationResult} = require('express-validator')
var uniqueValidator = require('mongoose-unique-validator');
var bycrypt = require('bcryptjs')
var JWT = require('jsonwebtoken')
var key = 'my_secret_key'

var userSchema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, index: true,  required: true },
    password: { type: String, required: true }
});

var loginSchema = mongoose.Schema({
    email :{type: String, index: true,  required: true },
    password: { type: String, required: true }
})

userSchema.plugin(uniqueValidator);
loginSchema.plugin(uniqueValidator)
var userModel = mongoose.model("user", userSchema);
var loginModel = mongoose.model("login", loginSchema);




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

///get all data
app.get("/get",(req,res)=>
{
    res.set
    (
        {
            "Allow-access-Allow-Origin":'*'
        }
    )
    return res.redirect('/');
})

app.get('/',verifyToken,(req,res)=>{
   
    JWT.verify(req.token,key,(err,authdata)=>{
        if(err){
            res.sendStatus(403)
        }else{
            res.json({
                message:'this is protected',
                authdata :authdata
            })
        }
    })
})


//add the data into database
app.post("/add",  body('password','password must contain 6 chars').isLength({
    min: 6
}),body('email','email is not valid').isEmail().normalizeEmail(),
body('username','name must be 4 chars').isLength({min:4}),
encryptPassword,

(req,res)=>
{
    

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return console.log({
            success: false,
            errors: errors.array()
        
        });
       
    }

    var user = new userModel ({ 
        username: req.body.username,
         email: req.body.email,
          password: req.body.password 
        });
          
        user.save(function (err) {
            console.log(err);
         });

       
///find existed email ,if not insert the data
userModel.findOne({email:req.body.email},function (err,result){
    if(err) throw err;
    if (result){
        console.log('already registered')
        return console.log({
            success: false,
            message:"email is alredy existed",
            errors: errors.array()
        
        });   
    }
    else {
        db.collection('unique').insertOne(user,(err,collection)=>
    {
        if(err)
        {
            throw err;
        }
        console.log("record inserted successfully");
       
    });

    }
})   
})

//update the data 
app.put("update/:id",(req,res)=>{
    
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
//delete teh data
app.delete('del/:id', (req, res) => {
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


function encryptPassword(req, res, next){
    const { password } = req.body
    
    bycrypt.genSalt(10,(err, salt)=>{
      bycrypt.hash(password, salt, (err, passwordHash)=>{
          if(err){
            res.status(500).send('Error')
          }else{
            req.body.password = passwordHash
            next()
          }
      });
  });
  }

  //verifytoken

 function verifyToken  (req,res,next){

    ///get the header value
     const bearerHeader = req.headers['authorization']
     //check if bearer is undefineed
     if (typeof bearerHeader!=='undefined'){
        
          //get token
         const bearer = bearerHeader.split(' ');
         const bearerToken = bearer[1];
          req.token = bearerToken
          next(); 
     }else{
         res.json({
             message:"forbidden"
         })
     }

  }
  

  ///////////login details

  app.post("/login", async (req, res) => {
    var login = new loginModel ({ 
        email: req.body.email,
         password: req.body.password 
       });
         
       login.save(function (err) {
           console.log(err);
        });
    
    const user = await userModel.findOne({ email: req.body.email });
    if (user) {
      // check user password with hashed password stored in the database
      const validPassword = await bycrypt.compare(req.body.password, user.password);
      if (validPassword) {
        res.json({ message: "Valid email or  password" });
      } else {
        res.json({ error: "Invalid email or password" });
      }
    } else {
      res.json({ error: "User does not exist" });
    }
    // Create token
    const token = await JWT.sign({login},key,{expiresIn:'1h'} );
    if(token){
        console.log({token:token})
    }
     
  
  });
