require('dotenv').config();
require('express-async-errors');  // we use this package so we dont write our middleware error

const express = require('express');
const app = express();

const database = require('./models')

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());

//middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;

const start = async () => {
	try {
			await database.authenticate();
			await database.sync({force: true})
			app.listen(port, console.log(`Server is listening on port ${port}...`)
			);
	} catch (error) {
			console.log(error);
	}
};

start();
