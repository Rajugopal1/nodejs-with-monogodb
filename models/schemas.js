var mongoose= require("mongoose");
var userSchema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, index: true,  required: true },
    password: { type: String, required: true }
});

var loginSchema = mongoose.Schema({
    email :{type: String, index: true,  required: true },
    password: { type: String, required: true }
})


module.exports= {userSchema,loginSchema}