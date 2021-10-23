const express = require("express");
const {body} = require("express-validator");

const profileCont = require("../controllers/profile");

const {isAuth,encryptPassword} = require("../auth/Auth");

const router = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/')

    },
    filename : function(req,file,cb){
        cb(null,file.originalname);

    }
});
const fileFilter = (req,file,cb) =>{
///rejextc a fiel
     if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'|| file.mimetype == 'image/jpg'){
        cb(null,true)

     }
     else {
        cb(null,false);

     }
   
    
} 
const upload = multer({storage:storage, limits:{
    fileSize : 1024 * 1024 * 5
},
 fileFilter:fileFilter

});



// router.post('/profile',
// [ 
//     body("firstname").isLength({min: 5}).withMessage("Username should be minimum of length 5.").not().isEmpty().withMessage("Please fill the firstname field!"),
//     body("lastname").isLength({min: 5}).withMessage("Username should be minimum of length 5.").not().isEmpty().withMessage("Please fill the lastname field!"),
//     body("email").isEmail().withMessage("Please Enter a valid email!").not().isEmpty().withMessage("Please fill the email field!").normalizeEmail(),
//     body("contact").isLength({min: 10}).withMessage("Username should be minimum of length 10.").not().isEmpty().withMessage("Please fill the contact field!"),
//     body("address").isLength({min: 10}).withMessage("Username should be minimum of length 10.").not().isEmpty().withMessage("Please fill the contact field!"),
// ], profileCont.profile)

router.put('/update-profile/:id',isAuth,upload.single('userImage'),profileCont.profile)

// router.delete('/del-profile/:id',isAuth,profileCont.deleteData)

module.exports = router 