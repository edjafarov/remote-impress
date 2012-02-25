     var socket = new io.connect("http://remote.nodester.com/presentation");
     var presentationIdUrl = null;
     var wheel = null;
     var cover = null;
     socket.on('controllerUrl', function (data) {
         if (presentationIdUrl) data = presentationIdUrl;
         showQR(data);
         presentationIdUrl = data;
     });
     socket.on('takeControl', function () {
         document.body.removeChild(wheel);
         document.body.removeChild(cover);
         wheel = null;
         cover = null;
     });
     socket.on('nextSlide', function () {
         impress().next();
     });
     socket.on('previousSlide', function () {
         impress().prev();
     });
     socket.on('wheelDown',function(){
         showQR(presentationIdUrl);
     });
function showQR(data){
         var imgSrc = 'http://chart.apis.google.com/chart?cht=qr&chl=' + data + '&chs=400x400'
         var img = document.createElement('img');
         img.src = imgSrc;
         var mask = document.createElement('div');
         mask.style.position = "absolute";
         mask.style.left = 0;
         mask.style.right = 0;
         mask.style.top = 0;
         mask.style.bottom = 0;
         mask.style.backgroundColor = "#000";
         mask.style.opacity = ".8";
         var div = document.createElement('div');
         div.innerHTML = "Take a wheel cap<br/>";
         div.style.fontSize = "30px";
         div.style.textAlign = "center";
         div.style.position = "absolute";
         div.style.width = "500px";
         div.style.right = "0";
         div.style.bottom = "0";

         div.style.backgroundColor = '#fff';
         div.appendChild(img);
         if (wheel) document.body.removeChild(wheel);
         if (cover) document.body.removeChild(cover);
         wheel = div;
         cover = mask;
         document.body.appendChild(mask);
         document.body.appendChild(div);
}