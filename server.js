// Setup web server and socket
var twitter = require('twitter'),
    express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

// Load config file
var fs = require('fs'),
    ini = require('ini'),
    config = ini.parse(fs.readFileSync('config.ini', 'utf-8'));

if (config.twitter_mode == "tweets") {
    var endpoint = "statuses/user_timeline";
} else if (config.twitter_mode == "dms") {
    var endpoint = "direct_messages/events/list";
} else {
    console.log("Error: twitter_mode in config.ini must be set to either [tweets/dms]");
}

// Setup twitter stream api
// twitter api keys should be set as environment variables to be loaded here
var twit = new twitter({consumer_key: process.env.TWITTER_CONSUMER_KEY,
                        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
                        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
                        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
                      }),
    tweets = null;

// Use the default port (for beanstalk) or default to 8081 locally
server.listen(process.env.PORT || 8081);

// Setup rotuing for app
app.use(express.static(__dirname + '/public'));

// Create web sockets connection.
io.sockets.on('connection', function (socket) {

  socket.on("start tweets", function() {

    // get tweets, parse and add to tweetArr
    twit.get(endpoint, {user_id: config.twitter_user}, function(error, tweets, response) {

        var tweetArr = [];

        // get number of tweets
        if (config.twitter_mode == "tweets") {
            var num_tweets = tweets.length;
        } else if (config.twitter_mode == "dms") {
            var num_tweets = tweets.events.length;
        } else {
            console.log("Error: twitter_mode in config.ini must be set to either [tweets/dms]");
        }

        // loop through and parse
        for (i = 0; i < num_tweets; i++) {
          if (config.twitter_mode == "tweets") {
              var date = tweets[i].created_at;
              var formatted_date = date.slice(0,16);
              var str = tweets[i].text;
          } else if (config.twitter_mode == "dms") {
              var timestamp = tweets.events[i].created_timestamp;
              // convert epoch timestampt to string
              var date = new Date(timestamp * 1).toString();
              var formatted_date = date.slice(0,11) + date.slice(16,21);
              var str = tweets.events[i].message_create.message_data.text;
          } else {
              console.log("Error: twitter_mode in config.ini must be set to either [tweets/dms]");
          }
          
          var str_split = str.split("*");
          var icon_ref = str_split[0].toLowerCase();
          var parsed = {icon:    config.icons[icon_ref],
                        lat:    str_split[1],
                        lon:    str_split[2],
                        notes:  str_split[3],
                        date:   formatted_date};
          tweetArr.push(parsed);
        }

        socket.broadcast.emit("twitter-rest", tweetArr);
        socket.emit('twitter-rest', tweetArr);

    });

  });

  // Emits signal to the client telling them that the
  // they are connected and can start receiving Tweets
  socket.emit("connected");
});
