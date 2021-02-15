// -------------------- IMPORTS --------------------
const express = require("express");
const bodyparser = require("body-parser")
const basicAuth = require("express-basic-auth") 
const bcrypt = require('bcrypt') //hashing module
const mongoose = require("mongoose")
const fs = require('fs')
const airports = require("./airports.json");
const User = require("./models/User")

// ----------------- MONGO DB CONNECT ---------------
async function dbConnect() {
  const db = await mongoose.connect("mongodb://127.0.0.1:27017", { useNewUrlParser: true, useUnifiedTopology: true });
}

dbConnect()

// ----------- APP / BASIC AUTH CONFIG  -------------
const app = express();
app.use(bodyparser.json())
// use Basic Auth and custom middleware function
app.use(
  basicAuth({
    authorizer: customAuthoriser,
    authorizeAsync: true,
    challenge: true, //a popup will come up asking for you to signin
    unauthorizedResponse: () => {
      return `You are not authenticated`;
    },
  })
);

// Custom async authorizer middleware, this is called for each request
async function customAuthoriser(username, password, authorize) {
  // find user in database
  const user = await User.findOne({username: username})
  if (user) {
    // compare incoming password to database password, requires a callback function (authorize)
    bcrypt.compare(password, user.password, (err, res)=>{
        return authorize(null,res) //res = true if passwords match, false if they don't
    })
  }
  else {
    return authorize(null,false)
  }
}
// ------------------ END POINTS -------------------
// -------------------- AIRPORTS -------------------
app.get("/airports", (req, res) => {
  let page = Number(req.query.page)
  let limit = Number(req.query.limit)
  const i1 = (limit*page)-limit
  const i2 = i1+limit
  const displayAirports = airports.slice( i1 , i2 )
  if (page && limit){
    res.status(200).send(displayAirports);
  }
  else {
    res.status(200).send(airports);
  }
});

app.post("/airports", (req, res) => {
  const airport = req.body
  if (Object.keys(airport).length > 0){
    airports.push(airport)
    fs.writeFile("airports.json", JSON.stringify(airports), (err) => {
      if (err) throw err;
    })
    res.status(201).send(airport)
  }
  res.status(400).send("Nice try... send in JSON format instead") 
});

// -------------------- AIRPORT -------------------
app.get("/airports/:airportICAO", (req, res) => {
  const airport = airports.filter( airport => airport.icao == req.params.airportICAO )
  if (airport && airport.length>0) {
    res.status(200).send(airport[0])
  }
  else {
    res.status(200).send("Couldn't find airport with icao " + req.params.airportICAO)
  }
});

app.put("/airports/:airportICAO", (req, res) => {
  const airport = req.body
  const index = airports.findIndex(airport => airport.icao === req.params.airportICAO)
  airports.splice(index, 1, airport);
  fs.writeFile("airports.json", JSON.stringify(airports), (err) => {
    if (err) throw err;
  })
  res.status(200).send(airport)
});

app.delete("/airports/:airportICAO", (req, res) => {
  const index = airports.findIndex(airport => airport.icao === req.params.airportICAO)
  const airport = airports.splice(index, 1)
  fs.writeFile("airports.json", JSON.stringify(airports), (err) => {
    if (err) throw err;
  })
  res.status(200).send("The airport has now been deleleted")
});

// -------------------- USERS -------------------
app.post("/users", async (req, res) => {
  //hash the incoming password to send to the db
  const pw = await bcrypt.hash(req.body.password, 10)
  const user = await User.create({username: req.body.username, password: pw})
  res.status(201).send(user)
});

app.get("/users", async (req, res) => {
  const users = await User.find({})
  res.status(200).send(users)
});

// -------------------- USER -------------------
app.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id)
  res.status(200).send(user)
});

app.put("/users/:id", async (req, res) => {
    //hash the incoming password to send to the db
  const pw = await bcrypt.hash(req.body.password, 10)
  const user = await User.findByIdAndUpdate(req.params.id, {username: req.body.username, password: pw})
  res.status(200).send("User has been updated")
});

app.delete("/users/:id", async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id)
  res.status(200).send("The user has been deleleted")
});

// ---------------------------------------------
module.exports = app
