
echo create image redis in docker
docker run --name some-redis -d redis redis-server --appendonly yes

echo create image this app in docker
docker build -t fadhilahsan/api-my-tv-tmdb .


echo running this app images docker
docker run -p 8080:8080 -d fadhilahsan/api-my-tv-tmdb
