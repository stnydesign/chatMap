var milkcocoa = new MilkCocoa("xxx.mlkcca.com");
var locationDataStore = milkcocoa.dataStore("location");
var chatDataStore = milkcocoa.dataStore("chat");
var textArea, board, chatMessage;

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
            locationDataStore.send({
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
    },5000);//5秒ごとに位置情報送信

    locationDataStore.on('send', function(data) {
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
        // console.log('recieve',data.value);
    });
};

function clickEvent(){
  var chatMessage = textArea.value;
  textArea.value = "";
  chatDataStore.push(
    { 
      message : chatMessage,
      date    : dateFormatYYYYMMDDHHNNSS(new Date())
    },
    function(err, pushed){
      // console.log("chatMessage pushed");
    },
    function(err) {
      console.log("chatMessage push failed "+err);
    }
  )
};

$(function() {
  chatDataStore.on("push", function(e) {
    console.log(JSON.stringify(e));
    console.log(e.value.message);
    $('#chatMessage').text(e.value.message);
  });

  dateFormatYYYYMMDDHHNNSS = function(date){
    var YYYY = date.getYear();
    if (YYYY < 1900){YYYY += 1900}
    var MM = String(date.getMonth()+1);
    if (MM.length < 2){MM = "0" + MM}
    var DD = String(date.getDate());
    if (DD.length < 2){DD = "0" + DD}
    var HH = String(date.getHours());
    if (HH.length < 2){HH = "0" + HH}
    var NN = String(date.getMinutes());
    if (NN.length < 2){NN = "0" + NN}
    var SS = String(date.getSeconds());
    if (SS.length < 2){SS = "0" + SS}
    return Number(String(YYYY) + MM + DD + HH + NN + SS);
  }
});