const express = require('express');
const airports = require('../services/airports');

const router = new express.Router();


/**
 * Use me to view all 28,000 airports!
 * 
 * ![airport](https://blog.aci.aero/wp-content/uploads/2019/03/shutterstock_745544935-952x635.jpg)
 * 
 */
router.get('/', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await airports.getAirports(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 * Use me to add an airport!
 * 
 * ![airport](https://blog.aci.aero/wp-content/uploads/2019/03/shutterstock_745544935-952x635.jpg)
 * 
 */
router.post('/', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await airports.postAirports(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 * Use me to get an airport!
 * 
 * ![airport](https://blog.aci.aero/wp-content/uploads/2019/03/shutterstock_745544935-952x635.jpg)
 * 
 */
router.get('/:airportICAO', async (req, res, next) => {
  const options = {
    airportICAO: req.params['airportICAO']
  };

  try {
    const result = await airports.getAirportsByAirporticao(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 * Use me to update an airport!
 * 
 * ![airport](https://blog.aci.aero/wp-content/uploads/2019/03/shutterstock_745544935-952x635.jpg)
 * 
 */
router.put('/:airportICAO', async (req, res, next) => {
  const options = {
    body: req.body,
    airportICAO: req.params['airportICAO']
  };

  try {
    const result = await airports.putAirportsByAirporticao(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 * Use me to delete an airport!
 * 
 * ![airport](https://blog.aci.aero/wp-content/uploads/2019/03/shutterstock_745544935-952x635.jpg)
 * 
 */
router.delete('/:airportICAO', async (req, res, next) => {
  const options = {
    airportICAO: req.params['airportICAO']
  };

  try {
    const result = await airports.deleteAirportsByAirporticao(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
