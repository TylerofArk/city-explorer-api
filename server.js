'use strict';

console.log('My first server');

// All info per Express documentation
// servers we require not import

//REQUIRES
const express = require('express');
require('dotenv').config();
const cors = require('cors');
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
});

// Weather Route
app.get('/weather', getWeather);

async function getWeather(request, response, next) {
		const lat = request.query.lat;
		const lon = request.query.lon;
		const weatherUrl = `http://api.weatherbit.io/v2.0/forecast/daily?units=I&lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;
		try {
			const weatherResponse = await axios.get(weatherUrl);
			console.log(weatherResponse);
			const dataToGroom = weatherResponse.data;
			const dataToSend = dataToGroom.data.map(weatherObj => {
				return new Forecast(weatherObj);
				
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
		this.date = weatherObj.weather.valid_date;
		this.description = weatherObj.weather.description;
	}
}

// Movie Route

app.get('/movies', getMovie);

async function getMovie (request, response) {
	const city = request.query.city;
	console.log(city);
	console.log(process.env.MOVIE_API_KEY)
	const movieUrl = `http://api.themoviedb.org/3/search/movie/?api_key=${process.env.MOVIE_API_KEY}&query=${city}`;

try {
	const showMovie = await axios.get(movieUrl);
console.log(showMovie)
	const dataToSend = showMovie.data.results.map(movieObj => new Showtimes(movieObj));
	response.status(200).send(dataToSend);
} catch (error){
	response.status(500).send(error.message);
}
};

class Showtimes {
	constructor(movieObj) {
		this.name = movieObj.title;
		this.overview = movieObj.overview;
	}
}


// Catch all - needs to be at the bottom
app.get('*', (request, response) => {
	response.status(404).send('The page you are looking for does not exist.')
})

app.use((error, request, response, next) => {
	response.status(500).send(error);
});

app.listen(PORT, () => console.log(`We are up on PORT: ${PORT}`));