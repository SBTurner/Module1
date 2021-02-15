// -------------------- IMPORTS --------------------
const express = require("express");
const bodyparser = require("body-parser")
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const cors = require('cors'); 
const mongoose = require("mongoose")
const fs = require('fs')
const airports = require("./airports.json");
const fetch = require("node-fetch");

// ----------------- MONGO DB CONNECT ---------------
async function dbConnect() {
  const db = await mongoose.connect("mongodb://127.0.0.1:27017", { useNewUrlParser: true, useUnifiedTopology: true });
}

dbConnect()

// ----------- APP / AUTH0 CONFIG  -------------
const app = express();
app.use(bodyparser.json())
app.use(cors())
require('dotenv').config('.env'); // Note: env vars should not be used in production

// Create middleware for checking the JWT. This is called at the endpoints.
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}`,
  algorithms: ['RS256']
});

// ------------------ END POINTS -------------------

// The airports endpoints can be reached in POSTMAN by:
// 1. Send a POST request to https://dev-wcrughxf.eu.auth0.com/oauth/token
// 2. Copy the access_token you recieve and any consequent requests should be granted by 
//    setting the Auth Header to be Bearer Token and copying your access_token.

// -------------------- AIRPORTS -------------------
app.get("/airports", checkJwt, (req, res) => {
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

app.post("/airports", checkJwt, (req, res) => {
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
app.get("/airports/:airportICAO", checkJwt, (req, res) => {
  const airport = airports.filter( airport => airport.icao == req.params.airportICAO )
  if (airport && airport.length>0) {
    res.status(200).send(airport[0])
  }
  else {
    res.status(200).send("Couldn't find airport with icao " + req.params.airportICAO)
  }
});

app.put("/airports/:airportICAO", checkJwt, (req, res) => {
  const airport = req.body
  const index = airports.findIndex(airport => airport.icao === req.params.airportICAO)
  airports.splice(index, 1, airport);
  fs.writeFile("airports.json", JSON.stringify(airports), (err) => {
    if (err) throw err;
  })
  res.status(200).send(airport)
});

app.delete("/airports/:airportICAO", checkJwt, (req, res) => {
  const index = airports.findIndex(airport => airport.icao === req.params.airportICAO)
  const airport = airports.splice(index, 1)
  fs.writeFile("airports.json", JSON.stringify(airports), (err) => {
    if (err) throw err;
  })
  res.status(200).send("The airport has now been deleted")
});


// ------------ BROWSER FETCH -- LOG IN ----------------
// Alternatively, in the browser you can use fetch below to
// 1. Log in using /login. This gains your JWT token
// 2. Access the Airports by /getAirports. You can only see this if you have a token

async function getToken(){
  const auth0Config = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    audience: process.env.AUTH0_AUDIENCE,
    grant_type:"client_credentials"
  }
  const {access_token} = await fetch(`https://${process.env.AUTH0_DOMAIN}oauth/token`, {
      method: 'POST',
      headers: {
          'content-type': 'application/json'
      },
      body: JSON.stringify(auth0Config)
  }).then(res => res.json())
  return access_token
}

accessToken = null

app.get("/login", async (req, res) => {
  getToken().then(token => {
    accessToken = token
    res.status(200).send(token)
  })
});

app.get("/getAirports", async (req, res) => {
  if (accessToken){
    await fetch("http://localhost:3000/airports", {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            "Authorization": `Bearer ${accessToken}`
        },
      }).then(res => res.json())
      res.status(200).send(airports)
  }
  else {
    res.send("You need to log in first. Head to /login to gain your access token")
  }
});

// ---------------------------------------------
module.exports = app
