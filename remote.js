var express = require('express');
var app = express.createServer();
var io = require('socket.io').listen(app);
var events = require('events').EventEmitter;
var ejs = require('ejs');
var fs = require('fs');
var observer = new events();
var host = 'http://remote.nodester.com';
var remotes = {};


function getUniqueId(){
    var millis = new Date().getTime() - 1262304000000;
    millis = millis * Math.pow(2, 12);
    return millis;
}


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


        observer.on('disconnect' + id, function(){
            
            socket.emit('wheelDown');
        })

        socket.on('disconnect', function(){

            observer.removeAllListeners('takeControl' + id);
            observer.removeAllListeners('next' + id);
            observer.removeAllListeners('previous' + id);
            observer.removeAllListeners('disconnect' + id);
            if(remotes[id]){
            remotes[id].emit('presentationDied');
            remotes[id].disconnect();
            remotes[id]= null;
        }
        });
        
});

io.of('/controller').on('connection',
        function(socket){
            var id = null;
            socket.on('takeControl', function(data){
                observer.emit('takeControl' + data);
                id = data;
                remotes[id] = socket;
            });
            socket.on('nextSlide', function(){
                observer.emit('next' + id);
            });

            socket.on('previousSlide', function(){
                observer.emit('previous' + id);
            });

            socket.on('disconnect', function(){
                observer.emit('disconnect' + id);   
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

app.get('/', function(req, res){
    res.render('public/homepage.ejs',{
        host:host
    });
});

app.get('/mobile', function(req, res){
    res.render('public/mobile.ejs',{
        host:host
    });
});

/*
fs.readFile('./public/remotejs.ejs', 'utf8', function (err, data) {
  if (err) throw err;
fs.writeFile("./public/remote.js", ejs.render(data, {host: host}), function(err) {
    if(err) {
        console.log(err);
    } else {
        app.listen(14770);
        //app.listen(80);
    }
}); 
  
});
*/


        app.listen(14770);
