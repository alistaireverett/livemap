function initialize() {
  //Setup Google Map
  var centreLatLng = new google.maps.LatLng(54,0);
  var light_grey_style = [
    {
      "featureType": "landscape",
      "stylers": [
        {"saturation":-100},
        {"lightness":65},
        {"visibility":"on"}
      ]
    },
    {
      "featureType": "poi",
      "stylers": [
        {"saturation":-100},
        {"lightness":51},
        {"visibility":"hidden"}
      ]
    },
    {
      "featureType": "road",
      "stylers": [
        {"saturation":-100},

        {"visibility":"on"}
      ]
    },
    {
      "featureType":"transit",
      "stylers": [
        {"saturation":-100},
        {"visibility":"simplified"}
      ]
    },
    {
      "featureType":"administrative.province",
      "stylers": [ {"visibility":"off"} ]
    },
    {
      "featureType":"water",
      "elementType":"labels",
      "stylers": [
        {"visibility":"on"},
        {"lightness":-25},
        {"saturation":-100}
      ]
    },
    {
      "featureType":"water",
      "elementType":"geometry",
      "stylers": [
        {"hue":"#ffff00"},
        {"lightness":-25},
        {"saturation":-97}
      ]
    }
  ];
  var myOptions = {
    zoom: 2,
    center: centreLatLng,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.LEFT_BOTTOM
    },
    styles: light_grey_style
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  var prev_infowindow = false;

  if(io !== undefined) {
    // Storage for WebSocket connections
    var socket = io.connect('/');

    socket.on('twitter-rest', function (data) {
      var markers = [];
      var infowindows = [];

      // loop through tweets
      for (i = 0; i < data.length; i++) {
        // template for marker text
        var contentString = '<div id="content">'+
                  '<div id="siteNotice">'+
                  '</div>'+
                  '<h3 id="firstHeading" class="firstHeading">' + data[i].date + '</h3>'+
                  '<div id="bodyContent">'+
                  '<p>'+ data[i].notes +'</p>'+
                  '</div>'+
                  '</div>';

        // marker location
        var markerLatLng = {
          lat: Number(data[i].lat),
          lng: Number(data[i].lon)
        };

        markers[i] = new google.maps.Marker({
          position: markerLatLng,
          map: map,
          title: data[i].date,
          icon: {
            url: data[i].icon,
            size: new google.maps.Size(40, 40),
            origin: new google.maps.Point(5, 5),
            anchor: new google.maps.Point(10, 10),
            scaledSize: new google.maps.Size(35, 35)
          },
        });
        markers[i].index = i;
        infowindows[i] = new google.maps.InfoWindow({
                content: contentString,
                maxWidth: 210
        });

        // closes previous infowindow when next infowindow is opened
        markers[i].addListener('click', function() {
          if( prev_infowindow ) {
            prev_infowindow.close();
          }
          infowindows[this.index].open(map, markers[this.index]);
          prev_infowindow = infowindows[this.index];
        });

      }

      // add marker clustering to tidy things up
      var markerCluster = new MarkerClusterer(map, markers,
              {imagePath: 'images/m'});
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
