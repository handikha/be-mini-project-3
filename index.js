import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import * as middleware from './src/midlewares/index.js';
// @use router
import AuthRouters from './src/controllers/authentication/routers.js';
import CashierManagement from './src/controllers/cashierManagement/routers.js';
import Product from './src/controllers/products/routers.js';
import Category from './src/controllers/categories/routers.js';
import Order from './src/controllers/orders/routers.js';
import Transaction from './src/controllers/transaction/routers.js';
// @sync database
import db from './src/models/index.js';

// @config dotenv
dotenv.config();

// @create express app
const app = express();

// @use body-parser
app.use(bodyParser.json());
app.use(middleware.requestLogger);
app.use(cors({ exposedHeaders: 'Authorization' }));

//@exposed public folder
app.use('/public', express.static('public'));

// @root route
app.get('/', (req, res) => {
  res.status(200).send('<h1>Wellcome to Mini Project 03 REST-API</h1>');
});

app.use('/api/v1', AuthRouters);
app.use('/api/v1', CashierManagement);
app.use('/api/v1', Product);
app.use('/api/v1', Category);
app.use('/api/v1', Order);
app.use('/api/v1', Transaction);

//@global errorHandler
app.use(middleware.errorHandler);

// @listen to port
const PORT = process.env.PORT;

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Database Synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(error => console.log('Connection error: ', error));
