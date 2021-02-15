// Server - uses JSON config
// Server2 - uses @swagger YAML config

const fs = require('fs')
const express = require("express");
const app = express();
const bodyparser = require("body-parser")
app.use(bodyparser.json())

const airports = require("./airports.json");

// Swagger components
const swaggerConfig = require("./swaggerConfig.json"); // this is a JSON I created (YAML->JSON on editor.swagger.io)
const swaggerUi = require("swagger-ui-express");

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

// ------- Swagger -------

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerConfig)
);

module.exports = app
