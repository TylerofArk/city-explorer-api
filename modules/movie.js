'use strict';

const axios = require('axios');

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

module.exports = getMovie;