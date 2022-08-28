'use strict';

const axios = require('axios');
const cache = require('./cache');

async function getWeather(request, response, next) {
		const lat = request.query.lat;
		const lon = request.query.lon;
		const key = 'Forecast' + lat + lon;
		const weatherUrl = `http://api.weatherbit.io/v2.0/forecast/daily?units=I&lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;
		try {
			if(cache[key] && (Date.now() - cache[key].timeStamp < 50000)){
			console.log('cache hit');
			response.status(200).send(cache[key].data)}
			else {
				console.log('cache miss');
				const weatherResponse = await axios.get(weatherUrl);
				const dataToGroom = weatherResponse.data;
				const dataToSend = dataToGroom.data.map(weatherObj => {
					return new Forecast(weatherObj);
				});
				cache[key] = {
					data:dataToSend,
					timeStamp:Date.now(),
				}
				response.status(200).send(dataToSend);
				}} catch (error) {
					console.log('error message is: ', error);
					next(error);
				
			}
};

class Forecast {
	constructor(weatherObj) {
		this.date = weatherObj.weather.valid_date;
		this.description = weatherObj.weather.description;
	}
}

module.exports = getWeather;