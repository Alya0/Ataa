const paypal = require('paypal-rest-sdk')
const {Donation, Project} = require("../models")  
const {BadRequestError} = require('../errors')
const {StatusCodes} = require('http-status-codes')

const donate = async(req, res)=>{
	let {
		body:{
			value,
			projectId
		},
		user : {
			id
		}
	} = req

	value = value/4000

	const ProjectId = projectId
	const create_payment_json = {
		"intent": "sale",
		"payer": {
			"payment_method": "paypal"
		},
		"redirect_urls": {
			"return_url": `http://192.168.43.8:8000/api/m/donate/success/${value}/${ProjectId}/${id}`,
			"cancel_url": "http://192.168.43.8:8000/api/m/donate/cancel"
		},
		"transactions": [{
			"item_list": {
				"items": [{
					"name": "Donation for ataa charity",
					"sku": "001",
					"price": value,
					"currency": "EUR",
					"quantity": 1
				}]
		},
		"amount": {
			"currency": "EUR",
			"total": value
		},
		"description": "This is a donation description."
		}]
	};

	paypal.payment.create(create_payment_json, function(error, payment){
		if(error){
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg : 'Something went wrong, please try again later'})
		} else{
			for(let i = 0; i < payment.links.length; i++){
				if(payment.links[i].rel === 'approval_url'){
					res.json({url : payment.links[i].href})
				}
			}
		}
	})
	
}

const donation_success = async(req, res)=>{
	const {PayerID, paymentId} = req.query
	const {value, ProjectId, UserId} = req.params
	const execute_payement_json = {
		"payer_id" : PayerID,
		"transactions" : [{
			"amount" : {
				"currency" : "EUR",
				"total" : value
			}
		}]
	}
	paypal.payment.execute(paymentId, execute_payement_json, async function(error, payment){
		if(error){
			throw error
		} else {
			// payment = JSON.stringify(payment)
			const date = new Date().toISOString().slice(0, 10)
			const donation = {value, ProjectId, UserId, date}
			await Donation.create(donation)

			const raised_money = await Donation.sum('value', {where: {ProjectId}})
			console.log(raised_money);
			const project = await Project.findByPk(ProjectId)
			console.log(project.target_money)
			if(raised_money >= project.target_money){
				const updateVal = {project_status : 'منتهي'};
				await project.update(updateVal);
			}
			res.status(StatusCodes.OK).send('Donation Success')
		}
	})
}

const donation_cancel = (req, res)=>{
	res.status(StatusCodes.OK).send('Payement cancelled')
}

module.exports = {
	donate,
	donation_success,
	donation_cancel
}