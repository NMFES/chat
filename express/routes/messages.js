var express = require('express');
var router = express.Router();
var Message = require('../models/message');
var helpers = require('../helpers');

// Register
router.post('/all', function (req, res, next) {
    var query = Message.find({}, null, {limit: 10, sort: {'date': -1}});

    query.exec(function (err, messages) {
        if (err) {
            console.log(err);
        }

        let objects = [];

        if (messages.length) {
            for (var i in messages) {
                objects.unshift({
                    login: messages[i].login,
                    text: messages[i].text,
                    date: helpers.humanDate(messages[i].date)
                });
            }
        }

        res.json({
            messages: objects
        });
    });
});

module.exports = router;