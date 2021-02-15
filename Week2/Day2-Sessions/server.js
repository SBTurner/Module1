// -------------------- IMPORTS -------------------
const express = require("express");
const bodyparser = require("body-parser")
const session = require('express-session')
const basicAuth = require("express-basic-auth") 
const mongoose = require("mongoose")
const User = require("./models/User")
const bcrypt = require('bcrypt') //hashing module

// ----------------- MONGO DB CONNECT ---------------
async function dbConnect() {
  const db = await mongoose.connect("mongodb://127.0.0.1:27017", { useNewUrlParser: true, useUnifiedTopology: true });
}

dbConnect()

// ----------- APP / BASIC AUTH CONFIG  -------------
const app = express();
app.use(bodyparser.json())

const basicAuthOptions = {
    authorizer: customAuthoriser,
    authorizeAsync: true,
    challenge: true,
    unauthorizedResponse: () => {
      return `You are not authenticated`;
    },
}

async function customAuthoriser(username, password, authorize) {
  const user = await User.findOne({username: username})
  if (user) {
    bcrypt.compare(password, user.password, (err, res)=>{
        //NOT IDEAL: set global variable which can be accessed in the /login endpoint
        userID = user._id
        return authorize(null,res)
    })
  }
  else {
    userID = null
    return authorize(null,false)
  }
}

// ------------------ SESSIONS -------------------
const sessionSettings = {
    secret: "SarahsSecret",
    resave: false,
    saveUninitialized: true
}
app.use(session(sessionSettings))

// ---------------- END POINTS --------------------
// ------------------- LOG IN ---------------------
app.get('/login', basicAuth(basicAuthOptions), async (req, res) => {
    //set the session
    if(!req.session.userID){
        req.session.userID = userID
        res.send(`You are logged in, to see your info ==> <a href='http://localhost:3000/users/${req.session.userID}'>http://localhost:3000/users/${req.session.userID}<a> `)
    } else {
       res.send(`You are already logged in, head to <a href='http://localhost:3000/users/${req.session.userID}'>http://localhost:3000/users/${req.session.userID}<a> `)
    } 
})

// ------------------- LOG OUT ---------------------
app.get('/logout', async (req, res) => {
    //destroy the session  
    if(req.session.userID){
      req.session.destroy(()=>{
        res.send(`You are logged out, to log in ==> <a href='http://localhost:3000/login'>http://localhost:3000/login<a>`)
      })
    } else {
       res.send("You are not logged in, to log in ==> <a href='http://localhost:3000/login'>http://localhost:3000/login<a>")
    } 
})

// -------------------- USER -------------------
app.get("/users/:id", async (req, res) => {
  if(req.session.userID){
    const user = await User.findById(req.params.id)
    res.status(200).send(`${user} <br/> <br/> TO LOG OUT ==> <a href='http://localhost:3000/logout'>http://localhost:3000/logout<a>` )
  } else {
    res.send(`YOU MUST BE LOGGED IN TO SEE THIS INFO ==> <a href='http://localhost:3000/login'>http://localhost:3000/login<a>`)
  }
});

// ------------------------------------------------
app.listen(3000, () =>
  console.log("Running on localhost:3000")
);

