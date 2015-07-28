var mongoose = require('mongoose');

// define model ============================
module.exports = mongoose.model('Movie', {
    title : {type: String, default: ' '},
    owner : {type: String, default: ' '}
});