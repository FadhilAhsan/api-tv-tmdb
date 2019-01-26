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
/* GET discover tv listing. */
router.get('/discover', async (req, res, next) => {
	try{
		var pageNumber = req.query.page
		if (typeof(await pageNumber) == 'undefined' || await pageNumber == '') {
		 	pageNumber = '1'
		}

		var sortBy = req.query.sort_by
		if (typeof(await sortBy) == 'undefined' || await sortBy == '') {
		 	sortBy = "popularity.desc"
		}

		var genre = req.query.genre
		if (typeof(await genre) == 'undefined') {
		 	genre = ""
		}

		const keyCahceRedis = pageNumber +"-"+sortBy+"-"+genre
		client.get(`api:tv-discover-${keyCahceRedis}`,(err, result) => {
			if (result){
				console.log("retrieved data from : Redis");
				var tvDiscover = JSON.parse(result)

				var result = {
					response_code: 200,
					success: true,
					message: 'retrieved data discover tv successfully',
					data: tvDiscover
				}
				res.status(200).json(result)
			}else{
				var url = config.api_tmdb.api_url+"/discover/tv"
				axios.get(url,{
					params:{
						api_key:config.api_tmdb.api_key,
						language:config.api_tmdb.language_default,
						timezone:config.api_tmdb.timezone_default,
						sort_by:sortBy,
						with_genres:genre,
						page:pageNumber,
						include_null_first_air_dates:false
					}
				})
				.then(response => {
					console.log("retrieved data from : Axios");
					var objectMapper = ["page","total_results","total_pages","poster_base_url","results","original_name","first_air_date","id","vote_average","overview","poster_path"]
					response.data.poster_base_url = config.api_tmdb.image_base_url+config.api_tmdb.poster_size
					var dataResult = JSON.stringify(response.data,objectMapper)
					dataResult = JSON.parse(dataResult)
					client.setex(`api:tv-discover-${keyCahceRedis}`, 20, JSON.stringify(dataResult));

					var result = {
						response_code: 200,
						success: true,
						message: 'retrieved data discover tv successfully',
						data: dataResult
					}
					res.status(200).json(result)
				})
				.catch(error => {
					console.log("Axios error : " + error);
					var result = {
						response_code: 503,
						success: false,
						message: 'retrieved data discover tv failed',
						data: null
					}
					res.status(503).json(result)
				});
			}
		})
	}catch(e){
		console.log("Error GET discover tv listing. : "+ e)
		var result = {
			response_code: 500,
			success: false,
			message: 'retrieved data discover tv failed.',
			data: null
		}
		res.status(500).json(result)
	}
});

/* GET detail tv by id. */
router.get('/:id', async (req, res, next) => {
	try{
		var tvId = req.params.id
		const keyCahceRedis = tvId +"-"+config.api_tmdb.language_default
		client.get(`api:tv-detail-${keyCahceRedis}`,(err, result) => {
			if (result){
				console.log("retrieved data from : Redis");
				var tvDetail = JSON.parse(result)
				var result = {
					response_code: 200,
					success: true,
					message: 'retrieved detail tv successfully',
					data: tvDetail
				}

				res.status(200).json(result)
			}else{
				var url = config.api_tmdb.api_url+"/tv/"+tvId
				axios.get(url,{
					params:{
						api_key:config.api_tmdb.api_key,
						language:config.api_tmdb.language_default
					}
				})
				.then(response => {
					console.log("retrieved data from : Axios");
					var objectMapper = ["poster_base_url","episode_run_time","first_air_date","id","last_air_date","name","number_of_episodes","number_of_seasons","original_name","overview","poster_path","vote_average","poster_path"]
					response.data.poster_base_url = config.api_tmdb.image_base_url+config.api_tmdb.poster_size
					var dataResult = JSON.stringify(response.data,objectMapper)
					dataResult = JSON.parse(dataResult)
					client.setex(`api:tv-detail-${keyCahceRedis}`, 20, JSON.stringify(dataResult));
					
					var result = {
						response_code: 200,
						success: true,
						message: 'retrieved detail tv successfully',
						data: dataResult
					}
					res.status(200).json(result)
				})
				.catch(error => {
					console.log("Axios error : " + error);
					var result = {
						response_code: 503,
						success: false,
						message: 'retrieved detail tv failed',
						data: null
					}
					res.status(503).json(result)
				});
			}
		})
	}catch(e){
		console.log(" Error GET detail tv. : "+ e)
		var result = {
			response_code: 500,
			success: false,
			message: 'retrieved detail tv failed.',
			data: null
		}
		res.status(500).json(result)
	}
});


/* GET detail TV seasons. */
router.get('/:id/season/:seasonnumber', async (req, res, next) => {
	try{
		var tvId = req.params.id
		var seasonnumber = req.params.seasonnumber
		const keyCahceRedis = tvId +"-"+seasonnumber+"-"+config.api_tmdb.language_default
		client.get(`api:tv-detail-season-${keyCahceRedis}`,(err, result) => {
			if (result){
				console.log("retrieved data from : Redis");
				tvDetail = JSON.parse(result)
				var result = {
					response_code: 200,
					success: true,
					message: 'retrieved detail tv season successfully',
					data: tvDetail
				}
				res.status(200).json(result)
			}else{
				var url = config.api_tmdb.api_url+"/tv/"+tvId+"/season/"+seasonnumber
				axios.get(url,{
					params:{
						api_key:config.api_tmdb.api_key,
						language:config.api_tmdb.language_default
					}
				})
				.then(response => {
					console.log("retrieved data from : Axios");
					var objectMapper = ["_id","poster_base_url","air_date","name","overview","id","poster_path","season_number","episodes","air_date","episode_number","name"]
					response.data.poster_base_url = config.api_tmdb.image_base_url+config.api_tmdb.poster_size
					response.data.episode_number = Object.keys(response.data.episodes).length
					var dataResult = JSON.stringify(response.data,objectMapper)
					dataResult = JSON.parse(dataResult)
					client.setex(`api:tv-detail-season-${keyCahceRedis}`, 20, JSON.stringify(dataResult));
					
					var result = {
						response_code: 200,
						success: true,
						message: 'retrieved detail tv season successfully',
						data: dataResult
					}
					res.status(200).json(result)
				})
				.catch(error => {
					console.log("Axios error : " + error);
					var result = {
						response_code: 503,
						success: false,
						message: 'retrieved detail tv season failed',
						data: null
					}
					res.status(503).json(result)
				});
			}
		})
	}catch(e){
		console.log(" Error GET detail tv season. : "+ e)
		var result = {
			response_code: 500,
			success: false,
			message: 'retrieved detail tv season failed.',
			data: null
		}
		res.status(500).json(result)
	}
});


/* GET detail episode TV seasons. */
router.get('/:id/season/:seasonnumber/episode/:episodenumber', async (req, res, next) => {
	try{
		var tvId = req.params.id
		var seasonnumber = req.params.seasonnumber
		var episodenumber = req.params.episodenumber
		const keyCahceRedis = tvId +"-"+seasonnumber+"-"+episodenumber+"-"+config.api_tmdb.language_default
		client.get(`api:tv-detail-season-episode-${keyCahceRedis}`,(err, result) => {
			if (result){
				console.log("retrieved data from : Redis");
				tvDetail = JSON.parse(result)
				var result = {
					response_code: 200,
					success: true,
					message: 'retrieved detail episode tv season successfully',
					data: tvDetail
				}
				res.status(200).json(result)
			}else{
				var url = config.api_tmdb.api_url+"/tv/"+tvId+"/season/"+seasonnumber+"/episode/"+episodenumber
				axios.get(url,{
					params:{
						api_key:config.api_tmdb.api_key,
						language:config.api_tmdb.language_default
					}
				})
				.then(response => {
					console.log("retrieved data from : Axios");
					var objectMapper = ["poster_base_url","air_date","episode_number",,"overview","id","season_number","still_path","vote_average","guest_stars","name","character"]
					response.data.poster_base_url = config.api_tmdb.image_base_url+config.api_tmdb.poster_size
					var dataResult = JSON.stringify(response.data,objectMapper)
					dataResult = JSON.parse(dataResult)
					client.setex(`api:tv-detail-season-episode-${keyCahceRedis}`, 20, JSON.stringify(dataResult));
					
					var result = {
						response_code: 200,
						success: true,
						message: 'retrieved detail episode tv season successfully',
						data: dataResult
					}
					res.status(200).json(result)
				})
				.catch(error => {
					console.log("Axios error : " + error);
					var result = {
						response_code: 503,
						success: false,
						message: 'retrieved detail episode tv season failed',
						data: null
					}
					res.status(503).json(result)
				});
			}
		})
	}catch(e){
		console.log(" Error GET detail episode tv season. : "+ e)
		var result = {
			response_code: 500,
			success: false,
			message: 'retrieved detail episode tv season failed.',
			data: null
		}
		res.status(500).json(result)
	}
});

module.exports = router;
