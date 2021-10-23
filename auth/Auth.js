const jwt = require("jsonwebtoken");
const bycrypt = require("bcryptjs");
var key = 'my_secret_key'

// const isAuth = (req,res,next)=>{

//       ///get the header value
//        const bearerHeader = req.headers['authorization']
//        //check if bearer is undefineed
//        if (typeof bearerHeader!=='undefined'){
          
//             //get token
//            const bearer = bearerHeader.split(' ');
//            const bearerToken = bearer[1];
//             req.token = bearerToken
//             next(); 
//        }else{
//            res.json({
//                message:"forbidden"
//            })
//        }
  
//     }
const isAuth = (req, res, next) => {
  const AuthorizationHeader = req.get("Authorization");
  if(!AuthorizationHeader){
      let error = new Error("Authorization Error!")
      error.statuscode = 401;
      throw error;
  }

  let token = AuthorizationHeader?.split(" ")[1];

  let decodedToken;

  if(token){
      decodedToken = jwt.verify(token, key);
      req.userid = decodedToken.userid;
  }else{
      req.userid= null
      let error = new Error("No Token Found!")
      error.statuscode = 401;
      throw error;
  }
  next()
}


const encryptPassword = (req, res, next) =>{
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


module.exports = {isAuth,encryptPassword};