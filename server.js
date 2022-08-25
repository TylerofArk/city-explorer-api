'use strict';

console.log('My first server');

// All info per Express documentation
// servers we require not import

//REQUIRES
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const data = require('./data/weather.json')
const axios = require('axios');
const { response } = require('express');

// Express Instance:
const app = express();
const PORT = process.env.PORT || 3002;
app.use(cors());

// Endpoints

// ROUTES

// Base Route - proof of life
app.get('/', (request, response) => {
	response.status(200).send('Welcome to our server.')
})

// Weather Route
app.get('/weather', getWeather);

async function getWeather(request, response) {
		const searchQuery = request.query.searchQuery;
		const weatherUrl = `http://api.weatherbit.io/v2.0/forecast/daily?units=I&lat=${this.state.cityLat}&lon=${this.state.cityLon}&key=${process.env.WEATHER_API_KEY}`;
		try {
			const weatherResponse = await axios.get(weatherUrl);
			console.log(weatherResponse);
			let cityName = request.query.city;
			let dataToGroom = data.find(city => city.city_name === cityName);
			let dataToSend = dataToGroom.data.map(object => {
				return new Forecast(object);
				
			});
			response.status(200).send(dataToSend);
			} catch (error) {
				console.log('error message is: ', err);
				response.status(500).send('server error')
				next(error);
			}
};

class Forecast {
	constructor(weatherObj) {
		this.date = weatherObj.valid_date;
		this.description = weatherObj.weather.description;
	}
}

// Movie Route

// Catch all - needs to be at the bottom
app.get('*', (request, response) => {
	response.status(404).send('The page you are looking for does not exist.')
})

app.use((error, request, response, next) => {
	response.status(500).send('"error": "Something went wrong"');
});

app.listen(PORT, () => console.log(`We are up on PORT: ${PORT}`));