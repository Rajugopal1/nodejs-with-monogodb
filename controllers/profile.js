var mongoose= require("mongoose");
var objectID = require('mongodb').ObjectId;
const uniqueValidator = require('mongoose-unique-validator');

//create connection to connect to mongoDb:
var db = mongoose.connect('mongodb://localhost:27017/blog',{});


var db = mongoose.connection;
//test the connection
db.on('error',()=>console.log("error in connecting to database"))
db.once('open',()=>console.log("connected to database"))



exports.profile = (req,res,next)=>{
    
    let id = req.params.id;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const contact =  req.body.contact;
    const address = req.body.address;
    const pan = req.body.pan;
    const dob = req.body.dob;
    const userImage = req.file.path;
    console.log("mm",userImage)
    console.log(req.file)
 db.collection('users').updateOne({_id: objectID(id)},{$set : {firstname,lastname,contact,address,pan,dob,userImage}},(err,collection)=>
{
    if(err)
    {
        throw err
        
    }
    console.log("profile-record updated successfully");
    res.json({message:"success -- updated successfully"});

    
    
});
    };

    // exports.deleteData = (req, res) => {
    //     let id = req.params.id;
     
    //     db.collection('users').deleteOne({_id:new objectID(id)},
    //      (err,collection)=>
    //      {
    //          if(err)
    //          {
    //              throw err;
    //          }
    //          console.log("profile-record deleted sucessfully");
    //          res.json("profile-record deleted sucessfully");
         
     
    //      });
    //  }

    
