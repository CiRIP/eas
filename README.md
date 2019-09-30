# eas
Easy Appeal System is a simple, Postgraphile-powered web app for easy and efficient appeals at the Romanian National Computer Science olympiad.

## Getting started
```bash
# start up backend
docker-compose up

# build frontend
cd frontend/

cp src/config.sample.js src/config.js # make sure to edit the file before building

npm install
npm run build
```
