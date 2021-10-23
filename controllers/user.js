const jwt = require("jsonwebtoken");
var mongoose= require("mongoose");
var objectID = require('mongodb').ObjectId;
const {userSchema,loginSchema} = require("../models/schemas");
const bycrypt = require("bcryptjs");
const uniqueValidator = require('mongoose-unique-validator');


var key = 'my_secret_key'

userSchema.plugin(uniqueValidator);
loginSchema.plugin(uniqueValidator)
var userModel = mongoose.model("user", userSchema);
// var loginModel = mongoose.model("login", loginSchema);


//create connection to connect to mongoDb:
var db = mongoose.connect('mongodb://localhost:27017/blog',{});


var db = mongoose.connection;
//test the connection
db.on('error',()=>console.log("error in connecting to database"))
db.once('open',()=>console.log("connected to database"))

exports.postLogin =  async (req, res) => {

    const    email = req.body.email;
      const    password= req.body.password ;
       
         
       
    const user = await userModel.findOne({ email: req.body.email });
    if (user) {
      // check user password with hashed password stored in the database
      const validPassword = await bycrypt.compare(password, user.password);
       // Create token
    const token = await jwt.sign({email:email},key,{expiresIn:'1h'} );
      if (validPassword && token) {
        res.json({ message: "Valid credentials",
    token:token });
      } else {
        res.json({ error: "Invalid email or password" });
      }
    } else {
      res.json({ error: "User does not exist" });
    }
   
     
  
  };



  exports.postSignup = async (req,res)=>
{
    
    userModel.findOne({email:req.body.email},function (err,result){
        if(err) throw err;
        if (result){
            return res.json({
                success: false,
                message:"email is alredy existed",
                
            
            });   
        }

  else{var user = new userModel ({ 
        username: req.body.username,
         email: req.body.email,
          password: req.body.password 
        });
          
        user.save(function (err) {
            console.log(err);
         });
         res.json("record inserted successfully");
        }
///find existed email ,if not insert the data

//     else {
//         db.collection('user').insertOne(user,(err,collection)=>
//     {
//         if(err)
//         {
//             throw err;
//         }
//         res.json("record inserted successfully");
       
//     });

//     }

 })   



}

//update the data 
 exports.putUpdate =(req,res)=>{
    
    let id = req.params.id;
db.collection('users').updateOne({_id: objectID(id)},{$set : req.body},(err,collection)=>
{
    if(err)
    {
        throw err
        
    }
    console.log("record inserted successfully");
    res.json("updated successfully");
});
    };

    // exports.putUpdate = async (req, res) => {
    //     try {
    //       var person = await userModel.findById(req.param.id).exec();
    //       person.set(req.body);
    //     //   var result = await person.save();
    //       person.save(function (err) {
    //         console.log(err);
    //      });
    //     } catch (err) {
    //       res.status(500)
    //     }
    //   };
      

//delete teh data
exports.deleteData = (req, res) => {
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
 }

  
exports.authGet = (req,res)=>{
   
    jwt.verify(req.token,key,(err,authdata)=>{
        if(err){
            res.sendStatus(403)
        }else{
            res.json({
                message:'this is protected',
                authdata :authdata
            })
        }
    })
}

exports.fetchData = (req,res,next)=>{
        userModel.find().then(users => {
           return res.status(200).json({
            message: "success", 
            users: users
            })
        }).catch(err => next(err))
    }
