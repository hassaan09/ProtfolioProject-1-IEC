const mongoose  = require('mongoose')
const carsSchema = new mongoose.Schema(
    {
        name:{type:String,unique: true,required:true},
        company:{type:String},
        engine:{type:Number},
        model:{type:String}
    })
const carsModel = mongoose.model('Cars',carsSchema)
module.exports = carsModel
