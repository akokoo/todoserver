var express = require('express');
var router = express.Router();
var cors = require('cors');
var { auth } = require('express-oauth2-jwt-bearer');
var env = require('dotenv').config();

console.log(process.env.CLIENT_ORIGIN_URL)

const corsOptions = {
  'methods': ['OPTIONS', 'GET', 'POST', 'DELETE', 'PUT'],
  'origin': [process.env.CLIENT_ORIGIN_URL],
  'allowedHeaders': ['Origin', 'Authorization', 'Content-Type'],
  'maxAge': 60000,
  "optionsSuccessStatus": 200
};

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE || 'http://localhost:5000',
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: 'RS256'
});

const { db: dbConnection } = require('./../db');

router.use(cors(corsOptions));

let createParamString = (params) => {
  let paramString = '';
  Object.keys(params).forEach((param, i) => {
    paramString += `${param}='${params[param]}'`;
    if (Object.keys(params).length - 1 != i) {
      paramString += ', ';
    }
  })
  return paramString;
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
 
router.post('/gettasks', (req, res) => {
  var { email } = req.body;

  res.set({
        'Content-Type': 'application/json; charset=utf-8'
  });
  dbConnection.any(`SELECT * from taskslist WHERE email='${email}'`)
    .then(data => res.json(data))
    .catch(err => console.log('err', err));
});

router.put('/addtask', (req, res) => {
  const { email, task_name, description, id} = req.body;
  
  dbConnection.tx(t => t.none(
    `INSERT INTO taskslist (email, task_name, description, id, status)
    VALUES ('${email}', '${task_name}', '${description}', '${id}', false)`          
  ));
  res.send('OK');
});

router.put('/edittask', (req, res) => {
  let { id, data } = req.body;
      
  dbConnection.any(`UPDATE taskslist SET ${createParamString(data)}
    WHERE id='${id}'`);
    res.send('OK');
});

router.delete('/deletetask', (req, res) => {
    let { id } = req.body;
    dbConnection.none(`DELETE from taskslist WHERE id='${id}'`);
    res.send('OK');
});

module.exports = router;
