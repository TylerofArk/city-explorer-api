'use strict';

console.log('My first server');

//REQUIRES
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');
const { response } = require('express');
const getMovie = require('./modules/movie.js')
const getWeather = require('./modules/weather.js')

// Express Instance:
const app = express();
const PORT = process.env.PORT || 3002;
app.use(cors());

// ROUTES

// Base Route - proof of life
app.get('/', (request, response) => {
	response.status(200).send('Welcome to our server.')
});

// Weather Route
app.get('/weather', getWeather);

// Movie Route

app.get('/movies', getMovie);

// Catch all - needs to be at the bottom
app.get('*', (request, response) => {
	response.status(404).send('The page you are looking for does not exist.')
})

app.use((error, request, response, next) => {
	response.status(500).send(error);
});

app.listen(PORT, () => console.log(`We are up on PORT: ${PORT}`));