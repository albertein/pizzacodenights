;window.webchat = (function() {
    var connected = false;      
    var chat;
    var ctx;
    var color;
    var socket = io.connect('http://localhost:8080');
    socket.on('connect', function() {
        connected = true;
        socket.emit('nick', prompt('nick?'));
    });
    socket.on('color', function(serverColor) {
        color = serverColor;
    });
    socket.on('chat', function(msg) {
        $(document.createElement('div')).
            text(msg.nick + '-' + msg.message).
            appendTo(chat);
    });

    var stroke = function(from, to, color) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
        ctx.closePath();
    };

    socket.on('draw', stroke);

    var setCanvas = function(canvas) {
        var canvas = $(canvas)[0];
        ctx = canvas.getContext('2d');
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 1000, 1000);
        var drawing = false;
        var lastPoint;
        $(canvas).on('mousedown', function(evt) {
            drawing = true;
            lastPoint = {
                x: evt.offsetX,
                y: evt.offsetY
            };
        }).on('mousemove', function(evt) {
            if (!drawing)
                return;
            var point = {
                x: evt.offsetX,
                y: evt.offsetY
            };
            stroke(lastPoint, point, color);
            socket.emit('draw', lastPoint, point);
            lastPoint = point;
        }).on('mouseup', function() {
            drawing = false;
        });


    };

    var bind = function(chatContainer, form, message, canvas) {
        chat = chatContainer;
        $(form).on('submit', function() {
            if (!connected) {
                alert('not connected');
                return false;
            }
            var msg = $(message).val();
            $(message).val('');
            socket.emit('chat', msg);
            return false;
        });
        setCanvas(canvas);  
    };
    return {
        init: bind
    }
})();