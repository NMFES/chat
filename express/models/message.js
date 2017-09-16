var mongoose = require('mongoose');
var config = require('../config');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb, {useMongoClient: true});

var Message = mongoose.model('Message', new Schema({
    date: {
        required: true,
        type: Number
    },
    text: {
        required: true,
        type: String,
        minlength: [1, 'Сообщение не может быть пустым'],
        maxlength: [1000, 'Сообщение должно быть не более 1000 символов']
    },
    login: {
        required: true,
        type: String
    }
}));

module.exports = Message;