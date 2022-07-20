require('dotenv').config();
require('express-async-errors');  // we use this package so we dont write our middleware error

const express = require('express');
const app = express();

//payement configuration
const paypal = require('paypal-rest-sdk')
paypal.configure({
	'mode': 'sandbox', //sandbox or live
	'client_id': 'Abn2SuKt_E42GFT1SO4VUSpT4w-HyCz8mNu17MbWjnkdET7_Zp1jsyHHE17qtY7eogAyMyZuKBdRAEEN',
	'client_secret': 'EH_BbrTjPVI6SYjHNL_5Sfa74Wnl1Gavs5KlOpSdGiXQ4Nno5yFVJhONWbkoaqjCbFR8QAyZ7Q9IfVFG'
});

const {sequelize} = require('./models');
const queryInterface = sequelize.getQueryInterface();
const Role = require('./seeders/20220627101056-demo-role');

const webRouter = require('./routes/WebRouter');
const mobileRouter = require('./routes/MobileRouter');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());

//middleware

app.use('/api/w',webRouter);
app.use('/api/m',mobileRouter);
app.use('/Images', express.static('./Images'));

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
	try {
			await sequelize.authenticate();
			// await sequelize.sync({force: true});
			// await Role.up(queryInterface, sequelize);
			app.listen(port,
				console.log(`Server is listening on port ${port}...`)
			);
	} catch (error) {
			console.log(error);
	}
};

start();
