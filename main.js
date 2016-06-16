var milkcocoa = new MilkCocoa("yourOwnAppName.mlkcca.com");
var chatDataStore = milkcocoa.dataStore("chat");
var textArea, board;
var chatMessage = "";

window.onload = function(){
    textArea = document.getElementById("msg");

    var lat = 35.170694;//緯度
    var lng = 136.88163699999995;//経度
    var map = new GMaps({
        div: "#map",//id名
        lat: lat,
        lng: lng,
        zoom: 18,//縮尺
        panControl : false,
        streetViewControl : false,
        overviewMapControl: false
    });

    setInterval(function(){
        GMaps.geolocate({
          success: function(position) {
            chatDataStore.send({
                lat : position.coords.latitude,
                lng : position.coords.longitude,
            });
          },
          error: function(error) {
            console.log('geolocate error '+error.message);
          },
          not_supported: function() {
            console.log("geolocate not support");
          },
        });
    },10000);//10秒ごとに位置情報送信

    chatDataStore.on('send', function(data) {
        var lat = data.value.lat, lng = data.value.lng;
        map.setCenter(lat, lng);
        map.drawOverlay({
          lat: lat,
          lng: lng,
          layer: 'overlayLayer',
          content: '<div id="chatMessage" class="overlay"></div>',
          verticalAlign: 'top',
          horizontalAlign: 'center',
        });
        console.log('recieve',data.value);
    });
};

function clickEvent(){
  var chatMessage = textArea.value;
  $('#chatMessage').text(chatMessage);
  textArea.value = "";
}
