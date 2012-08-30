var io = require('socket.io').listen(8080);
var colors = ['white', 'blue', 'yellow', 'green',
    'orange'];
var clients = [];
io.sockets.on('connection', function(socket) {
    clients.push(socket);
    var color = colors.pop();
    if (!color) {
        socket.disconnect();
        return;
    }
    socket.emit('color', color);
    socket.on('draw', function(from, to) {
        for (var i in clients)
            if (clients[i] !== socket)
                clients[i].emit('draw', from, to, color);
    });
    socket.on('nick', function(nick) {
        socket.on('chat', function(msg) {
            io.sockets.emit('chat', {
                nick: nick,
                message: msg
            });
        });            
    });
    socket.on('disconnect', function() {

        clients.splice(clients.indexOf(socket), 1);
    });

});