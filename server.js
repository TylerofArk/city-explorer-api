'use strict';

console.log('My first server');

// All info per Express documentation
// servers we require not import

//bring in express
const express = require('express');
const cors = require('cors');
const data = require('./data/weather.json')

require('dotenv').config();
// once express is in we need to use it

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

// ROUTES

// Base Route - proof of life
app.get('/', (request, response) => {
	response.status(200).send('Welcome to our server.')
})

// Weather Route
app.get('/weather', (request, response) => {
	try {
		console.log(request.query);
		let cityName = request.query.city;
		let dataToGroom = data.find(city => city.city_name === cityName);
		let dataToSend = dataToGroom.data.map(object => {
			return new Forecast(object);
			
		});
		
		response.status(200).send(dataToSend);
		} catch (error) {
			next(error);
		}
		
});

class Forecast {
	constructor(weatherObj) {
		this.date = weatherObj.valid_date;
		this.description = weatherObj.weather.description;
	}
}

// Catch all - needs to be at the bottom
app.get('*', (request, response) => {
	response.status(404).send('This route does not exist.')
})

app.use((error, request, response, next) => {
	response.status(500).send('"error": "Something went wrong"');
});

app.listen(PORT, () => console.log(`We are up on PORT: ${PORT}`));