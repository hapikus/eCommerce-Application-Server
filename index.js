// MongoDB:
// hulahap
// sfhX9wc3T3fWZ2XV

require('dotenv').config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const router = require('./router/index');
const errorMiddleware = require('./middlewares/error-middleware');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const options = require('./swagger');

const specs = swaggerJSDoc(options);

const PORT = process.env.PORT || 5000;
const app = express();

// middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors({
  origin: ['https://hapikus.github.io', 'http://127.0.0.1:5173', 'http://127.0.0.1:4173', 'http://localhost:5000'],
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true, // enable the new URL parser provided by the MongoDB driver.
      useUnifiedTopology: true, // enable the new unified topology engine introduced in MongoDB
    })

    app.listen(5000, () => console.log(`Server started on PORT = ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
