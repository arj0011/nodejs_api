"use strict"

  const app = require('express')(),
  express = require('express'),
  server = require('http').Server(app),
  database = require('./config/database.js'),
  bodyParser = require('body-parser'),
  upload     = require('multer')(),
  dateTime = require('date-time'),
  path = require('path'),
  expressValidator = require('express-validator'),
  custom = require('./lib/custom.js'),
  constant = require('./config/constant.js');
  

/* For Validation */
app.use(expressValidator({
  customValidators: {

    /* For In List Validation */
    inList: function(value,allowed_values){
      if (allowed_values.indexOf(value) >= 0) {
          return true;
      } else {
          return false;
      }
    },

    /* To check minimum value */
    minValue: function(value,minValueLimit){
      if (parseInt(value) >= parseInt(minValueLimit)) {
          return true;
      } else {
          return false;
      }
    },

    /* To check file is image or not */
    isImage: function(value, filename) {
        var extension = (path.extname(filename)).toLowerCase();
        switch (extension) {
            case '.jpg':
                return '.jpg';
            case '.jpeg':
                return '.jpeg';
            case  '.png':
                return '.png';
            default:
                return false;
        }
    }

  }
}));

/* To set port */
app.set('port', 3000);

/* To fetch css/js/images from respective server from public directory */
app.use(express.static(path.join(__dirname, 'public')));

/* For parsing urlencoded data */
app.use(bodyParser.urlencoded({ extended: true }));

/* For parsing application/json */
app.use(bodyParser.json());


/* To Listen Port */
server.listen(app.get('port'), function () {
  console.log(`Express server listening on port ${app.get('port')}`);

});

  app.use('*', function(req, res,next) {
    // CORS headers
    var responseSettings = {
      "AccessControlAllowOrigin": req.headers.origin,
      "AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
      "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
      "AccessControlAllowCredentials": true
    };
      // Set custom headers for CORS
    res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
    res.header("Access-Control-Allow-Origin",  responseSettings.AccessControlAllowOrigin);
    res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
    res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);
    if ('OPTIONS' == req.method) {
      res.send(200).end();
    }
    else {
      next();
    }
  });

require('./apis/user.js')(app,database,constant,custom);
require('./apis/category.js')(app,database,constant,custom);
require('./apis/product.js')(app,database,constant,custom);