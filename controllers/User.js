'use strict';

var User     = exports;
var async    = require('async');
var appRoot  = require('app-root-path');
var constant = require(appRoot + '/config/constant.js');
var custom   = require(appRoot + '/lib/custom.js');
var database = require(appRoot + '/config/database.js');
// var model    = require(appRoot + '/lib/model.js');

User.Signup = function(req,res){
    
    //Request input
    // res.status(200).send(req.body);

    req.sanitize("firstname").trim();
    req.sanitize('lastname').trim(); 
    req.sanitize('email').trim(); 
    req.sanitize('username').trim(); 
    req.sanitize('password').trim(); 

    req.check('firstname','Enter your first name').notEmpty(); 
    req.check('lastname','Enter your last name').notEmpty(); 
    req.check('email','Enter your email').notEmpty(); 
    req.check('email', 'Enter a valid email').isEmail();
    req.check('username','Enter user name').notEmpty(); 
    req.check('password','Enter password').notEmpty(); 

    var errors = req.validationErrors();
    if (errors) {
      
        res.send({
            "code": 200,
            "response": {},
            "status": 0,
            "message": custom.manageValidationMessages(errors)
        });
    } else{
      var email = req.sanitize('email').escape().trim();

      database.getConn('SELECT * FROM '+constant.users+' WHERE email = "'+ email+'"',function(err,rows){
        if(err){
          res.send({
            "code":200,
            "response":{},
            "status":0,
            "message":err.sqlMessage
          });
          return false;
        }else{
          if(rows != ''){
            res.send({
              "code":200,
              "response":{},
              "status":0,
              "message":"Email already exist"
            });
            return false;
          }else{
            let user_data = {};
            user_data.email = email;
            user_data.firstname = req.sanitize('firstname').escape().trim();
            user_data.lastname = req.sanitize('lastname').escape().trim();
            user_data.username = req.sanitize('username').escape().trim();
            user_data.password = custom.getMd5Value(req.sanitize('password').escape().trim());

            database.pool.getConnection(function(err, connection) {
              connection.beginTransaction(function(err) {
                if(err){
                  res.send({
                    "code":200,
                    "response":{},
                    "status":0,
                    "message":"Database error"
                  });
                  return false;
                }

                var userLoginSessionKey = custom.getGuid();

                var user_query = 'INSERT INTO '+constant.users+'(firstname,lastname,email,password,username,userLoginSessionKey)VALUES("'+user_data.firstname+'","'+user_data.lastname+'","'+user_data.email+'","'+user_data.password+'","'+user_data.username+'","'+userLoginSessionKey+'")';
                database.getConn(user_query,function(err,result){
                  if(err){
                    res.send({
                    "code":200,
                    "response":{},
                    "status":0,
                    "message":err.sqlMessage
                  });
                  return false;
                  }else{
                    res.send({
                    "code":200,
                    "response":{},
                    "status":1,
                    "message":"success"
                  });
                  return false;
                  }
                });

              });
            });

          }
        }
      });
    }
}


User.Login = function(req,res){
  //Request input
  req.sanitize('email').trim();
  req.sanitize('password').trim();

  req.check('email','Enter your email').notEmpty();
  req.check('email','Enter a valid email').isEmail();
  req.check('password','Enter your password').notEmpty();
  var errors = req.validationErrors();

  if(errors){
    res.send({
      "code": 200,
      "response": {},
      "status": 0,
      "message": custom.manageValidationMessages(errors)
    });
  }

  var email = req.sanitize('email').trim();
  var password = custom.getMd5Value(req.sanitize('password').trim());

  async.waterfall([
    function(callback){
      
      var user_query = 'SELECT * FROM '+constant.users+' WHERE email = "'+ email+'" AND password = "'+ password+'"';
      // res.status(200).send(user_query);
      database.getConn(user_query,function(err,results){
        if(err){
          res.send({
            "code": 200,
            "response": {},
            "status": 0,
            "message": err.sqlMessage
          });
        }else{
          if(results != ''){
            callback(null,results);
          }else{
            res.send({
            "code": 200,
            "response": {},
            "status": 0,
            "message": "Login credenntials are not correct"
          });
          }
        }
      });
    },
    function(results,callback){
      var user_details_query = 'SELECT id FROM '+constant.users+' WHERE email = "'+ email+'"';
      database.getConn(user_details_query,function(err,detail_results){
        if(err){
          res.send({
            "code": 200,
            "response": {},
            "status": 0,
            "message": err.sqlMessage
          });
        }else{
          if(detail_results != ''){
            callback(null,results,detail_results);
          }else{
            res.send({
              "code": 200,
              "response": {},
              "status": 0,
              "message": err.sqlMessage
            });
          }
        }
      });
    },
    function(results,detail_results,callback){
      if(parseInt(results[0].userEmailVerified) === 0){
        res.send({
                  "code": 200,
                  "response": {"userLoginSessionKey":detail_results[0].userLoginSessionKey},
                  "status": 5,
                  "message": constant.email_verify
              });
          return false;
      }else if(parseInt(results[0].isUserBlocked) === 1){
        res.send({
                  "code": 405,
                  "response": {},
                  "status": 0,
                  "message": constant.user_blocked
              });
          return false;  
      }else if(parseInt(results[0].isUserDeactivated) === 1){
        res.send({
                "code": 405,
                "response": {},
                "status": 0,
                "message": constant.user_deactivated
            });
        return false;
      }else{
        callback(null, results,detail_results);
      }
    }

    ],function (err, results,detail_results){
      let update_user_detail_query = "UPDATE " + constant.users + " SET userLastLogin = '"+custom.getCurrentTime()+"' WHERE id ="+detail_results[0].id;
      database.getConn(update_user_detail_query,function(err,detail_results){
        if(err){
          res.send({
              "code": 200,
              "response": {},
              "status": 0,
              "message": err.sqlMessage
          });
        }else{
          let user_response = custom.getUserProfileResponse(results);
          res.send({
                "code": 200,
                "response": user_response,
                "status": 1,
                "message": "You have successfully logged in"
            });
        }
      });
    });

}