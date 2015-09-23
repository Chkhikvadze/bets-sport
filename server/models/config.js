/**
*Created by Beka on 06/17/2015
*/

// see documetation 
// https://onedrive.live.com/view.aspx?cid=893F1C4EB277B877&resid=893f1c4eb277b877!504&app=Word

var mongoose = require('mongoose');

var configShema = mongoose.Schema({
	afterActivationTaskCount : {type : Number, unique : true, requred : true}, // გრძელვადიანი დავალებები. აქტივაციის შემდგომ
	afterProfileSetTaskCount : Number,  // გრძელვადიანი (პირადი ინფორმაციის შევსების შემთხვევაში)
	afterCourseShareTaskCount : Number, // გრძევლადიანი (კურსის Share დროს)
	dailyTaskCount : Number, // მოკლე ვადიანი (კურსზე ყოვედღიური ( Free tasks ))
	type : String, //  ტიპი კონფიგურაციის რომელიც ტიპია
	isStop : {type : Boolean, default : false},
	docInfo:{
		createDate : {type : Date, default : Date.now},
		user : {type:  mongoose.Schema.ObjectId, ref: 'User'}
	}
})


module.exports = mongoose.model('Config', configShema);