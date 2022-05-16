require('dotenv').config();
require('express-async-errors');  // we use this package so we dont write our middleware error

const express = require('express');
const app = express();

const {sequelize} = require('./models')

const webRouter = require('./routes/WebRouter')
const mobileRouter = require('./routes/MobileRouter')

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());

//middleware

app.use('/api/w',webRouter)
app.use('/api/m',mobileRouter)


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
	try {
			await sequelize.authenticate();
			// await sequelize.sync({force: true})
			app.listen(port, console.log(`Server is listening on port ${port}...`)
			);
	} catch (error) {
			console.log(error);
	}
};

start();
