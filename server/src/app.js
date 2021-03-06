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
const inventoriesRoutes = require('./routes/inventories');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const salesRoutes = require('./routes/sales');
const searchRoutes = require('./routes/search');
const messagesRoutes = require('./routes/messages');
// const usersRoutes = require('./routes/users');

app.use(cors());
app.use(morgan('dev'));
app.use(knexLogger(knex));
app.use(bodyParser.json());
app.use('/inventories', inventoriesRoutes(knex));
app.use('/cart', cartRoutes(knex));
app.use('/orders', ordersRoutes(knex));
app.use('/sales', salesRoutes(knex));
app.use('/search', searchRoutes(knex));
app.use('/messages', messagesRoutes(knex));
app.use(express.static('public'));

app.post('/login', (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.send({
      message: 'Email and password fields must be filled in!',
    });
  } else {
    knex('users')
      .where({
        email: req.body.email,
      })
      .then((results) => {
        // 'results' pulls out the user from the database based on the above
        // query.
        if (!results.length) {
          res.send({
            message: 'Don\'t have an account?  Have you registered?',
          });
        } else if (!bcrypt.compareSync(req.body.password, results[0].password)) {
          res.send({
            message: 'Incorrect email and/or password!',
          });
        } else {
          res.send({
            userId: results[0].id,
            cookies: true,
          });
        }
      }).catch((error) => {
        res.send({
          message: error.message,
        });
      });
  }
});

app.post('/register', (req, res) => {
  if (!req.body.full_name || !req.body.display_name || !req.body.email ||
    !req.body.password) {
    res.send({
      message: 'All the fields must be filled!',
    });
  } else {
    knex('users')
      .where({
        email: req.body.email,
      })
      .then((results) => {
        if (results.length) {
          res.send({
            message: 'Email is already registered! Register with another one!',
          });
        } else {
          const newUser = {
            full_name: req.body.full_name,
            display_name: req.body.display_name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
          };
          knex.insert(newUser)
            .into('users')
            .returning('id')
            .then((userId) => {
              res.send({
                userId: userId[0],
                message: 'You\'ve successfully registered!',
                cookies: true,
              });
            })
            .catch((error) => {
              console.error(error);
            });
        }
      });
  }
})
// request bgg api
const bgg = require('bgg-axios');

app.get('/bgg/search', (req, res) => {
  console.log('req query: ', req.query.NAME);
  bgg.search(`${req.query.NAME}`, 5)
    .then((searchResults) => {
      return Promise.all(searchResults.items.map((item) => {
        return bgg.apiRequest('thing items', { id: `${item.objectid}` });
      }));
    })
    .then((allResults) => {
      res.send({
        message: 'success',
        allResults,
      });
    });
});

// TODO: /logout endpoint route
// - cookies for that user is deleted
app.post('/logout', (req, res) => {
  res.send({
    logout: true,
  });
});

app.listen(PORT, () => {
  console.log(`Geek-Bazzar Api listening on port ${PORT}`);
});
