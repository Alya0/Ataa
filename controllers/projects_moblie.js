
const getAll = async(req, res)=>{
	res.send('all');
}

const getOne = async(req, res)=>{
	res.send('one');
}
module.exports = {
	getAll, 
	getOne
}