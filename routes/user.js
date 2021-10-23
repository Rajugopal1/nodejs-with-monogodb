const express = require("express");
const {body} = require("express-validator");

const authCont = require("../controllers/user");

const {isAuth,encryptPassword} = require("../auth/Auth");

const router = express.Router();

router.post('/login',[ 
    body("email").isEmail().withMessage("Please Enter a valid email!").not().isEmpty().withMessage("Please fill the email field!").normalizeEmail(),
    body("password").isLength({min: 8}).withMessage("Password should be minimum of length 5 and maximum of 16.").not().isEmpty().withMessage("Please fill the password field!")
], authCont.postLogin)

router.post('/signup',encryptPassword,[ 
    body("username").isLength({min: 5}).withMessage("Username should be minimum of length 5.").not().isEmpty().withMessage("Please fill the username field!"),
    body("email").isEmail().withMessage("Please Enter a valid email!").not().isEmpty().withMessage("Please fill the email field!").normalizeEmail(),
    body("password").isLength({min: 8}).withMessage("Password should be minimum of length 5 and maximum of 16.").not().isEmpty().withMessage("Please fill the password field!")
], authCont.postSignup)

 router.get('/auth',isAuth,authCont.authGet)

router.put('/update/:id', encryptPassword,authCont.putUpdate)

router.delete('/delete/:id',authCont.deleteData)
 router.get('/getall',  authCont.fetchData )
module.exports = router;