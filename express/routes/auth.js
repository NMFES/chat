var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');
var config = require('../config');

// Register
router.post('/register', function (req, res, next) {
    if (req.body.password.length < 6 || req.body.password.length > 30) {
        return res.json({
            error: 'Пароль должен быть от 6 до 30 символов'
        });
    }

    if (req.body.password !== req.body.password2) {
        return res.json({
            error: 'Пароли не совпадают'
        });
    }

    var newUser = new User({
        login: req.body.login,
        password: req.body.password
    });

    newUser.validate(function (err) {
        if (err) {
            res.json({
                error: err.errors[Object.keys(err.errors)[0]].properties.message
            });
        } else {
            newUser.password = passwordHash.generate(newUser.password);

            newUser.save(function (err) {
                if (err) {
                    res.json({
                        error: 'Не удалось добавить пользователя. Возможно такой уже есть'
                    });
                } else {
                    res.json({
                        error: '',
                        token: jwt.sign({login: newUser.login}, config.jwt),
                        login: newUser.login
                    });
                }
            });
        }
    });
});

// Login
router.post('/login', function (req, res, next) {
    User.findOne({
        login: req.body.login
    }, function (err, user) {
        if (err) {
            return console.log(err);
        }

        if (!user || !passwordHash.verify(req.body.password, user.password)) {
            return res.json({
                error: 'Логин и/или пароль введены неверно'
            });
        }

        res.json({
            error: '',
            token: jwt.sign({login: user.login}, config.jwt),
            login: user.login
        });
    });
});

// Verify current token
router.post('/verify', function (req, res, next) {
    if (!req.body.token) {
        return res.json({});
    }

    jwt.verify(req.body.token, config.jwt, function (err, decoded) {
        if (err) {
            console.log(err);

            res.json({});
        } else {
            res.json({
                login: decoded.login,
                token: req.body.token
            });
        }
    });
});

module.exports = router;
