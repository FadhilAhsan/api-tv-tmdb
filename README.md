# backend-my-tv-tmdb
This create backend for serve list data tv-series form themoviedb.org and caching data in server side with redis


# Setup Manual

1. `git clone https://github.com/FadhilAhsan/backend-my-tv-tmdb.git`
2. Install `npm`
3. `npm install`
4. Edit file name `config/config-example.json` to `config/config.json`
5. Insert your APP_KEY themoviedb.org in `config/config.json`
6. Install redis in your environment with default port
7. run this app, `npm start`
8. Try `<host>:8080/`

# Setup Docker

1. `git clone https://github.com/FadhilAhsan/backend-my-tv-tmdb.git`
2. Install `npm`
3. `npm install`
4. Edit file name `config/config-example.json` to `config/config.json`
5. Insert your APP_KEY themoviedb.org in `config/config.json`
6. Install docker in your environment
7. Run `script_docker.sh`
8. Try `<host>:8080/`


# List API

- For get genre tv-series `<host>:<port>/api/v1/genre/tv`
- For get discover tv-series `<host>:<port>/api/v1/tv/discover?page=<pagenumber>&sort_by=<sort_by_code>&genre=<genre_id>`
- For get tv-series detail by id tv `<host>:<port>/api/v1/tv/:id`
- For get tv-series season by id tv `<host>:<port>/api/v1/tv/:id/season/:seasonnumber`
- For get episode tv-series by season `<host>:<port>/api/v1/tv/:id/season/:seasonnumber/episode/:episodenumber`