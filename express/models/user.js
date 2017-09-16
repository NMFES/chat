var mongoose = require('mongoose');
var config = require('../config');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb, {useMongoClient: true});

var User = mongoose.model('User', new Schema({
    login: {
        required: true,
        type: String,
        minlength: [3, 'Логин должен быть минимум 3 символа'],
        maxlength: [30, 'Логин должен быть максимум 30 символов'],
        unique: 'Такой пользователь уже зарегистрирован'
    },
    password: {
        required: true,
        type: String
    }
}));

module.exports = User;