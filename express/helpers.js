var jwt = require('jsonwebtoken');
var config = require('./config');
var moment = require('moment');

/**
 * Returns JWT from header or false
 * @param {Object} req
 * @returns {Boolean | String}
 */
exports.token = function (req) {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        return req.headers.authorization.split(' ')[1];
    }

    return false;
}

/**
 * Verify JWT and return object of false
 * @param {String | Null} token
 * @param {Function} cb
 * @returns {void}
 */
exports.decoded = function (token, cb) {
    if (!token) {
        return cb(false);
    }

    jwt.verify(token, config.jwt, function (err, decoded) {
        if (err) {
            return cb(false);
        }

        return cb(decoded);
    });
}

/**
 * Returns users list
 * @param {Object} chat
 * @returns {Array}
 */
exports.users = function (chat) {
    let array = [];

    for (var i in chat.authenticated) {
        if (array.indexOf(chat.authenticated[i].login) === -1) {
            array.push(chat.authenticated[i].login);
        }
    }

    return array;
}

/**
 * Returns human date like 19:20:33
 * @param {Number} timestamp
 * @returns {String}
 */
exports.humanDate = function (timestamp) {
    return moment(new Date(timestamp * 1000)).format("HH:mm:ss");
}