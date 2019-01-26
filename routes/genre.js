var express = require('express');
var router = express.Router();

const axios = require('axios');
const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT;
const client = redis.createClient(REDIS_PORT);
const config = require('../config/config.json');

client.on('error', (err) => {
	console.log("Redis Error : " + err);
});

/* GET genres listing tv. */
router.get('/tv', async (req, res, next) => {
	// console.log("query string = "+ req.query.temp)
	// if (typeof(jsVar) == 'undefined') {
	//  	...
	// }
	try{
		client.get(`api:genre`,(err, result) => {
			if (result){
				console.log("retrieved data from : Redis");
				genres = JSON.parse(result)

				var result = {
					response_code: 200,
					success: true,
					message: 'retrieved data genres successfully',
					data: genres
				}
				res.status(200).json(result)
			}else{
				var url = config.api_tmdb.api_url+'/genre/tv/list?api_key=' + config.api_tmdb.api_key
				axios.get(url)
				.then(response => {
					console.log("retrieved data from : Axios");
					client.setex(`api:genre`, 20, JSON.stringify(response.data));

					var result = {
						response_code: 200,
						success: 'true',
						message: 'retrieved data genres successfully',
						data: response.data
					}
					res.status(200).json(result)
				})
				.catch(error => {
					console.log("Axios error : " + error);
					var result = {
						response_code: 503,
						success: 'false',
						message: 'retrieved data genres failed',
						data: null
					}
					res.status(503).json(result)
				});
			}
		})
	}catch(e){
		console.log("Error GET genres listing : "+ e)
		var result = {
			response_code: 500,
			success: 'false',
			message: 'retrieved data genres failed.',
			data: null
		}
		res.status(500).json(result)
	}
});

module.exports = router;
