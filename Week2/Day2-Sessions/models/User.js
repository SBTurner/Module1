const mongoose = require("mongoose")
const { Schema } = mongoose;

const User = new Schema({
	username: {
		type: String,
		required:true, 
		unique:true 
	},
	password: {
		type: String,
		required:true,
		unique:true 
	},
})

module.exports =
	mongoose.models.User || mongoose.model('User', User);