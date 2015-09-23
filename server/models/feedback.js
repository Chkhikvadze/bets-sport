var mongoose = require('mongoose');


// define the schema for our feedback model
var feedbackSchema = mongoose.Schema({
    category: String,
    user : {type:  mongoose.Schema.ObjectId	},
    content: String
});

// create the model for feedback and expose it to our app
module.exports = mongoose.model('Feedback', feedbackSchema);
