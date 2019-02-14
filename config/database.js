"use strict"

var mysql = require('mysql'),
appRoot = require('app-root-path'),
setting = require(appRoot + '/db.json'),
appConst = require(appRoot + '/config/constant.js');

class Database{
  
  constructor(){
    this.MsgDb = null;
    this.pool = mysql.createPool(setting);
  }

  getConn(query,callback){
    this.pool.getConnection(function(err,connection){
      connection.query(query,function(err,rows){
        connection.release();
        return callback(err,rows);
      });
    });
  }
  
}

module.exports = new Database();