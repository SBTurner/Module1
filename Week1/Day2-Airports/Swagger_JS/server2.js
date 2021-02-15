// Server - uses JSON config
// Server2 - uses @swagger YAML config

const fs = require('fs')
const express = require("express");
const app = express();
const bodyparser = require("body-parser")
app.use(bodyparser.json())

const airports = require("./airports.json");

// Swagger components from the Swagger library
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger config that we set up using OpenAPI 
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Swagger Airports API",
      version: "1.0.0",
      description: "A test project to generate API docs for airports",
      license: {
        name: "MIT",
        url: "https://choosealicense.com/licenses/mit/",
      },
      contact: {
        name: "Sarah",
        email: "sarah.turner@sky.uk",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api-docs",
      },
    ],
  },
  apis: ["./server.js", "./Airport.js"]
}

// -------------------- AIRPORTS -------------------
/**
 * @swagger
 * /airports:
 *   get:
 *     tags:
 *       - Airports 
 *     responses:
 *       200:
 *         description: an array of JSON objects that represent each airport
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Airport'
 *       301:
 *        description: Moved Permanently
 *       400: 
 *         description: Bad Request
 *       401: 
 *         description: Unauthorised
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error        
 */
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

/**
 * @swagger
 * /airports:
 *   post:
 *     tags:
 *       - Airports 
 *     responses:
 *       201:
 *         description: the airport has successfully been created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Airport'
 *       301:
 *        description: Moved Permanently
 *       400: 
 *         description: Bad Request
 *       401: 
 *         description: Unauthorised
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error 
 */
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
/**
 * @swagger
 * /airports/{airportICAO}:
 *   get:
 *     tags:
 *       - Airport
 *     parameters:
 *       - in: path
 *         name: airportICAO
 *         schema:
 *           type: string
 *         required: true
 *         description: The ICAO of the airport
 *     responses:
 *       200:
 *         description: All Good - returned the airport object
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Airport'
 *       301:
 *        description: Moved Permanently
 *       400: 
 *         description: Bad Request
 *       401: 
 *         description: Unauthorised
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error  
 */
app.get("/airports/:airportICAO", (req, res) => {
  const airport = airports.filter( airport => airport.icao == req.params.airportICAO )
  if (airport && airport.length>0) {
    res.status(200).send(airport[0])
  }
  else {
    res.status(200).send("Couldn't find airport with icao " + req.params.airportICAO)
  }
});

// -------------------- AIRPORT -------------------
/**
 * @swagger
 * /airports/{airportICAO}:
 *   put:
 *     tags:
 *       - Airport
 *     parameters:
 *       - in: path
 *         name: airportICAO
 *         schema:
 *           type: string
 *         required: true
 *         description: The ICAO of the airport
 *     responses:
 *       200:
 *         description: All Good - updated the airport object
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Airport'
 *       301:
 *        description: Moved Permanently
 *       400: 
 *         description: Bad Request
 *       401: 
 *         description: Unauthorised
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error            
 */
app.put("/airports/:airportICAO", (req, res) => {
  const airport = req.body
  const index = airports.findIndex(airport => airport.icao === req.params.airportICAO)
  airports.splice(index, 1, airport);
  fs.writeFile("airports.json", JSON.stringify(airports), (err) => {
    if (err) throw err;
  })
  res.status(200).send(airport)
});


// -------------------- AIRPORT -------------------
/**
 * @swagger
 * /airports/{airportICAO}:
 *   delete:
 *     tags:
 *       - Airport
 *     parameters:
 *       - in: path
 *         name: airportICAO
 *         schema:
 *           type: string
 *         required: true
 *         description: The ICAO of the airport
 *     responses:
 *       200:
 *         description: All Good - deleted the airport object
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Airport' 
 *       301:
 *        description: Moved Permanently
 *       400: 
 *         description: Bad Request
 *       401: 
 *         description: Unauthorised
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error           
 */
app.delete("/airports/:airportICAO", (req, res) => {
  const index = airports.findIndex(airport => airport.icao === req.params.airportICAO)
  const airport = airports.splice(index, 1)
  fs.writeFile("airports.json", JSON.stringify(airports), (err) => {
    if (err) throw err;
  })
  res.status(200).send("The airport has now been deleleted")
});

// -------- Swagger ---------

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerJsdoc(swaggerOptions), { explorer: true })
);

module.exports = app