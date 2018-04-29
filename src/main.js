var http = require('http');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: true});

var { exec } = require('child_process');

var cors = require('cors');
var corsOptions = {
   origin: '*'
}

var express = require('express');
var api = express();

var apiName = 'webhook_node_api';
var apiPort = 81;
var localRepositoryPath = '/home/pi/code/raspibar';
var eventPullRoute = '/payload';

api.set( 'port', apiPort );
api.use(urlencodedParser);
api.use(bodyParser.json());
api.use(cors(corsOptions))

//index
api.get('/', function(req, res) {
        console.log(req.body);
        res.json({apiName:apiName, apiPort:apiPort, localRepository:localRepositoryPath, eventPullRoute:eventPullRoute});
});

//pull event
api.post(eventPullRoute, urlencodedParser, function(req, res) {
  console.log(req.body.pusher.name + ' just pushed to ' + req.body.repository.name);
  console.log('pulling code in '+localRepositoryPath);
  exec('git -C ' + localRepositoryPath + ' pull -f', execCallback);
  res.sendStatus(200);
});

http.createServer(api).listen(api.get('port'), function(){
  console.log(apiName + ' listen on ' + apiPort);
} );

function execCallback(err, stdout, stderr) {
  if(stdout) console.log(stdout);
  if(stderr) console.log(stderr);
}
