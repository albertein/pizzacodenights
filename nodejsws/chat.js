var net = require('net');
var clients = [];
net.createServer(function(socket) {
    clients.push(socket);
    socket.on('data', function(data) {
        for (var i in clients)
            if (clients[i] !== socket)
                clients[i].write(data);
    });
    socket.on('end', function() {
        clients.splice(clients.indexOf(socket), 1);
    });
}).listen(8000);