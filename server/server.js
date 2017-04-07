var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
// var http = require('http');
var app = express();
// var server = http.createServer(app);

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../')));

var podcastParser = require('podcast-parser');

app.post('/api/podcastParse', (req, res) => {
  var feedUrl = req.body.feedUrl;
  console.log('Feed URL: ', feedUrl);
  podcastParser.execute(feedUrl, {},
    function (err, res) {
          if (err) {
              console.log(err);
              return res.send(err);
          }
          console.log('Channel/Items/0 ', JSON.stringify(res.channel.items[0]));
          res.send(res.channel.items[0]);
      });
});

// podcastParser.execute( 'http://blackastronautspodcast.libsyn.com/rss', {},
//   function (err, res) {
//         if (err) {
//             console.log(err);
//             return;
//         }
//         console.log('Channel/Items/0 ', JSON.stringify(res.channel.items[1]));
//     });

// Listen
const server = app.listen(3000, () => {
  const { address, port } = server.address();
  console.log(`Listening at http://${address}:${port}`);
});