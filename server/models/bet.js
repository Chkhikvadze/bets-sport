/**
 * Created by Giga.
 */

var mongoose = require('mongoose');

// define the schema for our user model
var betSchema = mongoose.Schema({
    betType: String,
    player1: String,
    player1Tag: [],
    player2: String,
    player2Tag: [],
    date : String,
    betSuppliers : [{
        supplierName : String,
        bet1 : String,
        betX : String,
        bet2 : String,
        webSite: String,
    }],
    docInfo: {
        createDate: {type: Date, default: Date.now},
        user: {type: mongoose.Schema.ObjectId, ref: 'User'}
    }
});


betSchema.virtual('player1Lower').get(function() {
    return this.player1.toLowerCase();
});
betSchema.virtual('player2Lower').get(function() {
    return this.player1.toLowerCase();
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Bet', betSchema);
