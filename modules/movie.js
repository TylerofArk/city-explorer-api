'use strict';

const axios = require('axios');
const cache = require('./cache');

async function getMovie (request, response) {
	const city = request.query.city;
	const key = 'Showtimes' + city;
	console.log(city);
	console.log(process.env.MOVIE_API_KEY)
	const movieUrl = `http://api.themoviedb.org/3/search/movie/?api_key=${process.env.MOVIE_API_KEY}&query=${city}`;

try {
	if(cache[key] && (Date.now() - cache[key].timeStamp < 50000)){
		console.log('cache movie hit');
		response.status(200).send(cache[key].data)}
		else {
			console.log('cache movie miss');
	const showMovie = await axios.get(movieUrl);
	console.log(showMovie)
	const dataToSend = showMovie.data.results.map(movieObj => new Showtimes(movieObj));
	cache[key] = {
		data:dataToSend,
		timeStamp:Date.now(),
	}
	response.status(200).send(dataToSend);
}
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

module.exports = getMovie;