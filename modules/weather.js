'use strict';

const axios = require('axios');

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

module.exports = getWeather;