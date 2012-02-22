var express = require('express');
var app = express.createServer();
var io = require('socket.io').listen(app);
var events = require('events').EventEmitter;
var observer = new events();
var host = 'http://remote.nodester.com';



function getUniqueId(){
    var millis = new Date().getTime() - 1262304000000;
    millis = millis * Math.pow(2, 12);
    return millis;
}
var presentations = {};

io.of('/presentation').on('connection', 
    function (socket) {
        var id = getUniqueId();
        socket.emit('controllerUrl', host + '/c/' + id);
        
        
        observer.on('takeControl' + id, function(){
           socket.emit('takeControl');
        });

        observer.on('next' + id, function(){
           socket.emit('nextSlide');
        });
        observer.on('previous' + id, function(){
            socket.emit('previousSlide');
        })
        
});

io.of('/controller').on('connection',
        function(socket){
            socket.on('takeControl', function(data){
                observer.emit('takeControl' + data);
            });
            socket.on('nextSlide', function(data){
                observer.emit('next' + data);
            });

            socket.on('previousSlide', function(data){
                observer.emit('previous' + data);
            });
});


app.configure(function(){
    app.use(express.static(__dirname + "/public"));
    app.set('views', __dirname + "/");
    app.set('view engine', 'ejs');
});

app.get('/c/:id', function(req, res){
    res.render('public/remote.ejs', {
        id:req.params.id,
        host:host
        });

});

app.listen(14770);
