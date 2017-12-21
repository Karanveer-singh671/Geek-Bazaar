const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const PORT = process.env.PORT || 8081;
const ENV = process.env.ENV || 'development';
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig[ENV]);
const knexLogger = require('knex-logger');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

// Seperated Routes for each Resource
const inventoriesRoutes = require('./routes/inventories');
const usersRoutes = require('./routes/users');

app.use(cors());
app.use(morgan('dev')); // see docs

app.use(knexLogger(knex));
app.use(bodyParser.json());

// Mount all resource routes
app.use('/inventories', inventoriesRoutes(knex));
// app.use('/users');

app.post('/register', (req, res) => {

  // if (!req.body.full_name || !req.body.display_name || ! req.body.email ||
  //   req.body.password) {
  //   res.json({
  //     message: 'All the fields must be filled!'
  //   })
  // } else {
  knex('users')
    .where({email: req.body.email})
    .then((results) => {
      if (results.length) {
        // console.log(results)
        return res.json({
          message: 'Email is already registered!'
        })
      } else {
        const newUser = {
          full_name: req.body.full_name,
          display_name: req.body.display_name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 10),
        }
        knex.insert(newUser)
          .into('users')
          .then(res.json({
            message: `Hello ${req.body.full_name}!
            You've successfully registered with the display name
            ${req.body.display_name}, and email ${req.body.email}.`,
          }))
      }
    })
  })
// require('./routes')(app)

app.listen(PORT, () => {
  console.log('Geek-Bazzar Api listening on port ' + PORT);
});
