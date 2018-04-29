var http = require('http');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: true});

var { exec } = require('child_process');

var cors = require('cors');
var corsOptions = {
   origin: '*'
}

var os = require('os');

var express = require('express');
var api = express();

var apiName = 'webhook_node_api';
var apiPort = 81;

var host = os.hostname();

var deployConf = {
  host : host,
  port : apiPort,
  localRepositoryPath : '/home/pi/code/raspibar',
  eventPullRoute : '/webhook'
};

api.set( 'port', apiPort );
api.use(urlencodedParser);
api.use(bodyParser.json());
api.use(cors(corsOptions))

//index
api.get('/', function(req, res) {
        console.log(req.body);
        res.json(deployConf);
});

//pull event
api.post(deployConf.eventPullRoute, urlencodedParser, function(req, res) {
  console.log(req.body.pusher.name + ' just pushed to ' + req.body.repository.name);
  console.log('pulling code in '+deployConf.localRepositoryPath);
  exec('git -C ' + deployConf.localRepositoryPath + ' pull -f', execCallback);
  res.sendStatus(200);
});

http.createServer(api).listen(api.get('port'), function(){
  console.log(apiName + ' listen on ' + apiPort);
} );

function execCallback(err, stdout, stderr) {
  if(stdout) console.log(stdout);
  if(stderr) console.log(stderr);
}
