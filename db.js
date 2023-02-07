var env = require('dotenv');
var pgp = require('pg-promise')();

var { DB_HOST, DB_DATABASE, DB_USER, DB_PSW, DB_ENDPOINT_ID } = process.env;

const URL = `postgres://${DB_USER}:${DB_PSW}@${DB_HOST}/${DB_DATABASE}?options=project%3D${DB_ENDPOINT_ID}&ssl=true`;

const db = pgp(URL);

module.exports = { db };