//[IMPORTING LIBRARIES]
const express = require('express')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const uModel  = require('./models/user')
const cModel = require('./models/CarsCollection')
const bcrypt = require('bcrypt');


//[DATABASE CONNECTION]
// Creating Mongoose Connection at Node.js with MongoDB DataBase
const url = 'mongodb://127.0.0.1:27017/Protfolio-Hassaan'
 //  'Protfolio-Hassaan' is the database name
mongoose.connect(url,{useNewUrlParser: true,useUnifiedTopology: true})
const db = mongoose.connection;
 //mongoose.connection is ref to the already established connection mongoose.connect
 db.on('error',()=>
 {
    console.log("CONNECTION To Database -> UNSUCESSFUL (NOT-CONNECTED) :( ")
 })
 db.on('open',()=>
 {
    console.log("CONNECTION To Database -> SUCESSFUL (CONNECTED) :) ")
 })




//[STARTING EXPRESS APP]
 const app  = express();
 const port = 8000;
 app.listen(port,(error)=>{if(error){console.log(error)}
 else{ console.log(`SERVER IS LIVE AT  PORT ${port}`)}})


 //[JWT-SECRETKEY] & [EXPIRED-TOKENS ARRAY]
 jwtSecret = "12345"
const expiredTokens = []

 //[DEFINING APIS]
 //[START/HOMEPAGE API]
  app.get('/',(req,res)=>
 {
    res.status(200)
    res.send("Welcome to Node-Authentication System \r\n ExistingUsers -> /login \r\n NewUsers -> /register \r\n To Access protected resources Such as information of Cars, Please Login")
 })



 app.use(express.json())//Used for Post requests
 //[REGISTER/SIGN-UP API]
 app.post('/register',async(req,res)=>
 {
    const {username,password,age,country} = req.body;
    const existinguser = await uModel.findOne({username});
    if(existinguser)
    {
        return res.status(400).json({message:"Same Username already exists Try with a different username"})
    }
    else
    {
        if(password.length<6)
        {
            return res.status(406).json({message:"Password lenght is too short..Try Again with atleast 6 characters"})
        }
        //PASSWORD HASHING:
        const hashedPass = await bcrypt.hash(password,12);
        const newRecord = new uModel({username,password,hpassword:hashedPass,age,country})
        await newRecord.save();
        return res.status(200).json({message:"New User Created"})
    }
 })

 //[LOGIN API]
 app.post('/login',async(req,res)=>
 {
    try
    {
    const {username,password} =req.body;
   
    const user =  await uModel.findOne({username}) 
    if(!user)
    {
        return res.status(401).json({message:"User not Found"})
    }
    const validPass = await bcrypt.compare(password,user.hpassword)
    if(!validPass)
    {
        return res.status(401).json({message:"User Found But Incorrect Password"})
    }
    // if(user.password!==password)
    // {
    //     return res.status(401).json({message:"User Found But Incorrect Password"})
    // }
    let token = initToken(user._id,jwtSecret,'10m')
    res.status(200).json({message:token})
    }
    catch(error)
    {
        console.log("Authentication Failed" + error.message);
        return res.status(500).json({ message: "Authentication Failed" });
    }
 })



//[VERIFY-API]
 app.get('/verify',jwtAuthentication,(req,res)=> 
 {
    return res.status(200).json({message: req.user})

 })


//[APIS WITH AUTHENTICATION FOR ACCESS OF PROTECTED RESOURCES TO AUTHENTICATED USERS FROM DATABASE]
//[ACCESS PROTECTED RESOURCES-API]
app.get('/protectedresources',jwtAuthentication,async(req,res)=>
{
    const findAll = await cModel.find()
    res.status(200).json(findAll)
})

app.get(('/carname=:name'),jwtAuthentication,async(req,res)=>
{
    obj = req.params;
    const result = await cModel.findOne(obj);
    if(result===null)
    {
        return res.status(404).json({message:"NotFound"})
    }
    else
    {
        res.status(200).json(result)
    }
   
})

//[ADD CARS API]
app.post('/addCar',jwtAuthentication,(req,res)=>
{
    const {name,company,engine,model} = req.body;
    const newRecord = new cModel({name,company,engine,model})
    newRecord.save();
    res.status(200).json(newRecord)

})

app.delete('/deleteCar',jwtAuthentication,async(req,res)=>
{
try
{
    obj = req.body
    const deleted = await cModel.findOneAndDelete(obj)
    if(!deleted)
    {
        return res.status(404).json({message:"Requested Object Not Found"})
    }
    res.status(202).json({message:"Requested Object From Cars Collection Deleted"})
}
catch(error)
{
    res.status(500).json({message:"Internal Server Error"})
}

})

 //[LOGOUT-APIS]
 app.post('/logout',async(req,res)=>
 {
    const token  = req.headers.authorization;
    if(!token)
    {
        return res.status(401).json({message:"Token Missing"})
    }
    if(expiredTokens.includes(token))
    {
        return res.status(401).json({message:"Token Already Expired"})
    }
    await expiredTokens.push(token);
    return res.status(200).json("Successfully LOGGED Out")
 
 })


//[MIDDLEWARE FUNCTION]
 function jwtAuthentication(req,res,next)
 {
    let token = req.header('Authorization'); //getting the encrypted message fromat from the header
    if(!token)
    {
        return res.status(401).json({message:"Inavlid token/Token Not Found"})
    }
    else
    {
        jwt.verify(token,jwtSecret,(err,user)=>{
            if(err)
            {
                return res.status(401).json({message:"Access denied"})
            }
            else
            { 
                req.user = user;
                next(); //controlled passed to the next item in validateAPI
            }
           
        })
    }

 }

//[FUNCTIONS FOR INITIATING  TOKEN]
function initToken(userID,jwtSecret,expiresIn)
{
    //Generates a Fresh Token
    const genToken= jwt.sign({userID:userID},jwtSecret,{expiresIn:expiresIn});
    return genToken;
}
