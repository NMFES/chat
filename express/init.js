#!/usr/bin/env node

var app = require('./app');
var debug = require('debug')('myapp:server');
var http = require('http');
var helpers = require('./helpers');
var timestamp = require('unix-timestamp');
var Message = require('./models/message');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

/**
 * SOCKETS
 */

var io = require('socket.io')(server);

let chat = {
    guests: 0,
    authenticated: []
};

io.on('connection', function (socket) {
    helpers.decoded(socket.handshake.query.token, data => {
        if (!data) {
            chat.guests++;
        } else {
            chat.authenticated.push({
                socketID: socket.id,
                login: data.login
            });
        }
    });

    io.sockets.emit('list', {
        users: helpers.users(chat),
        guests: chat.guests
    });

    // send message to all users and save it to database
    socket.on('message', function (input) {
        helpers.decoded(input.token, data => {
            if (!data) {
                return;
            }

            timestamp.round = true;

            var newMessage = new Message({
                login: data.login,
                text: input.message,
                date: timestamp.now()
            });

            newMessage.save(function (err) {
                if (err) {
                    return console.log(err);
                }

                io.sockets.emit('message', {
                    text: input.message,
                    date: helpers.humanDate(newMessage.date),
                    login: data.login
                });
            });
        });
    });

    socket.on('disconnect', function () {
        for (var i in chat.authenticated) {
            if (chat.authenticated[i].socketID === socket.id) {
                chat.authenticated.splice(i, 1);

                io.sockets.emit('list', {
                    users: helpers.users(chat),
                    guests: chat.guests
                });

                return;
            }
        }

        io.sockets.emit('list', {
            users: helpers.users(chat),
            guests: chat.guests--
        });
    });
});