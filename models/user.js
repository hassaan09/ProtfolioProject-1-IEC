const mongoose  = require('mongoose')
const userSchema = new mongoose.Schema(
    {
        username:{type:String,unique: true,required:true,min:2,max:50},
        password:{type:String,required:true,min:[6,"Weak Password"]},
        hpassword:{type:String},
        age:{type:Number},
        country:{type:String}
    })
const userModel = mongoose.model('Users',userSchema)
module.exports = userModel
