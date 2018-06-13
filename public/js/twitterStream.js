function initialize() {
  //Setup Google Map
  var myLatlng = new google.maps.LatLng(17.7850,-12.4183);
  var light_grey_style = [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}];
  var myOptions = {
    zoom: 2,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.LEFT_BOTTOM
    },
    styles: light_grey_style
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

  //test marker
  // label
  var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">DATE</h1>'+
            '<div id="bodyContent">'+
            "<p> This is where we've got to! </p>"+
            '</div>'+
            '</div>';

  var myLatLng = {lat: -25.363, lng: 131.044};
  var markera = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: "We're here!"
  });

  var infowindow = new google.maps.InfoWindow({
          content: contentString
  });

  markera.addListener('click', function() {
          infowindow.open(map, markera);
  });

  //Setup heat map and link to Twitter array we will append data to
  var heatmap;
  var liveTweets = new google.maps.MVCArray();
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: liveTweets,
    radius: 25
  });
  heatmap.setMap(map);

  if(io !== undefined) {
    // Storage for WebSocket connections
    var socket = io.connect('/');

    // This listens on the "twitter-steam" channel and data is
    // received everytime a new tweet is receieved.
    socket.on('twitter-stream', function (data) {

      //Add tweet to the heat map array.
      var tweetLocation = new google.maps.LatLng(data.lng,data.lat);
      liveTweets.push(tweetLocation);

      // var contentString = "something";//data.txt;
      //
      // var myLatLng = {lat: -20.363, lng: 135.044};
      // var markerb = new google.maps.Marker({
      //   position: myLatLng,
      //   map: map,
      //   title: "We're here!"
      // });
      //
      // var infowindow = new google.maps.InfoWindow({
      //         content: contentString
      // });
      //
      // markerb.addListener('click', function() {
      //         infowindow.open(map, markerb);
      // });
      //Flash a dot onto the map quickly
      var image = "css/small-dot-icon.png";
      var markerc = new google.maps.Marker({
        position: tweetLocation,
        map: map,
        icon: image
      });
      setTimeout(function(){
        markerc.setMap(null);
      },600);

    });

    // Listens for a success response from the server to
    // say the connection was successful.
    socket.on("connected", function(r) {

      //Now that we are connected to the server let's tell
      //the server we are ready to start receiving tweets.
      socket.emit("start tweets");
    });
  }
}
