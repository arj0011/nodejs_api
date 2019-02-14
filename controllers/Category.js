'use strict';

var Category = exports;
var async    = require('async');
var path     = require('path');
var fs       = require('fs'); 
var appRoot  = require('app-root-path');
var constant = require(appRoot + '/config/constant.js');
var custom   = require(appRoot + '/lib/custom.js');
var database = require(appRoot + '/config/database.js');
var model    = require(appRoot + '/lib/model.js');
var base64ToImage = require('base64-to-image');

Category.addCategory = function(req,res){
  
  //Request input
  // res.status(200).send(req.body);
  req.sanitize("category").trim();
  req.sanitize("parent").trim();

  req.check('category','Enter category').notEmpty();
  req.check('parent','Parent must be a number').isNumeric();

    var errors = req.validationErrors();
    if (errors) {
        custom.sendResponse(res,null,null,null,custom.manageValidationMessages(errors));
    } else{
      
      let category = req.sanitize('category').escape().trim();
      let parent = req.sanitize('parent').escape().trim();
        parent = (parent !== '') ? parent : 0;
      let query = "SELECT id FROM category WHERE category = '"+category+"'";
      
      model.customQuery(function(err,result){
        if(err){
          custom.sendResponse(res);
        }else{
          
          if(!Object.keys(result).length){
            var dataObj = {'category':category,'parent':parent};
            model.insertData(function(err,results){
              if(err){
               custom.sendResponse(res);
              }else{
                res.send({
                  "code":200,
                  "response":{},
                  "status":1,
                  "message":"Category insert successfully"
                });
              }
            },constant.category,dataObj);      
          }else{
            res.send({
              "code":200,
              "response":{},
              "status":0,
              "message":"Category already exist"
            });
          }
        }
      },query);
    }
}

Category.editCategory = function(req,res){
  
  //Request input
  // res.status(200).send(req.body);
  req.sanitize("category_id").trim();
  req.sanitize("category").trim();
  req.sanitize("parent").trim();

  req.check('category_id','Enter category id').notEmpty();
  req.check('category_id','category id must be a number').isNumeric();
  req.check('category','Enter category').notEmpty();
  req.check('parent','Parent must be a number').isNumeric();
    var errors = req.validationErrors();
    if (errors) {
       custom.sendResponse(res,null,null,null,custom.manageValidationMessages(errors));
    } else{
      
      let category_id = req.sanitize('category_id').escape().trim();
      let category = req.sanitize('category').escape().trim();
      let parent = req.sanitize('parent').escape().trim();
        parent = (parent !== '') ? parent : 0;
      var dataObj = {'category':category,'parent':parent};
      var whereObj = {'id':category_id};
      let query = "SELECT id FROM category WHERE id = '"+category_id+"'";
      model.customQuery(function(err,resu){
        if(err){
          custom.sendResponse(res);
        }else{
          
          if(Object.keys(resu).length){
            let query = "SELECT id FROM category WHERE id <> '"+category_id+"' AND category = '"+category+"'";
            model.customQuery(function(err,resul){
              if(err){
                custom.sendResponse(res);
              }else{
                if(!Object.keys(resul).length){
                  model.updateData(function(err,results){
                    if(err){
                      custom.sendResponse(res);
                    }else{
                      res.send({
                        "code":200,
                        "response":{},
                        "status":1,
                        "message":"Category updated successfully"
                      });
                    }  
                  },constant.category,dataObj,whereObj);
                }else{
                  custom.sendResponse(res,200,1,{},"Category already exist");
                }
              }
            },query);     
          }else{
            custom.sendResponse(res,200,0,{},"Category not found");
          }
        }
      },query);
    }
}



Category.getAllCategory = function(req,res){
  
  //Request input
  
  req.sanitize("offset").trim(); 
  req.check('offset','Enter offset').notEmpty();
  req.check('offset','Enter number').isNumeric();
    
    var errors = req.validationErrors();
    if (errors) {
        custom.sendResponse(res,null,null,null,custom.manageValidationMessages(errors));
    } else{

      var offset = req.sanitize('offset').escape().trim();
      var whereObj = {'status':1};
      let fieldsArr = ['id','category','parent','CONCAT("'+constant.image_url+'",image) AS image','status','created_at'];
      model.getAllWhere(function(err,results){
        if(err){
          custom.sendResponse(res);
        }else{
          if(Object.keys(results).length){
            custom.sendResponse(res,200,1,results,"Category data");
          }else{
            custom.sendResponse(res,200,1,{},"Category not found");
          }
          
        }
      },constant.category,whereObj,'created_at','DESC',fieldsArr,null,offset,null);
    }
}

Category.getCategoryById = function(req,res){
  
  //Request input
  
  req.sanitize("category_id").trim(); 
  req.check('category_id','Enter category').notEmpty();
  req.check('category_id','Category must be a number').isNumeric();
    
    var errors = req.validationErrors();
    if (errors) {
      custom.sendResponse(res,null,null,null,custom.manageValidationMessages(errors));
    } else{

      var category_id = req.sanitize('category_id').escape().trim();
      var whereObj = {'id':category_id};
      let fieldsArr = ['id','category','parent','CONCAT("'+constant.image_url+'",image) AS image','status','created_at'];
      model.getAllWhere(function(err,results){
        if(err){
          custom.sendResponse(res);
        }else{
          if(Object.keys(results).length){
            custom.sendResponse(res,200,1,results,"Category data"); 
          }else{
            custom.sendResponse(res,200,1,{},"Category not found");
          } 
        }
      },constant.category,whereObj,'created_at','DESC',fieldsArr,null,null,null);
    }
}

Category.changeCategoryStatus = function(req,res){
  
  //Request input
  // res.status(200).send(req.body);
  req.sanitize("category_id").trim();
  req.sanitize("status").trim();

  req.check('category_id','Enter category id').notEmpty();
  req.check('category_id','category id must be a number').isNumeric();
  req.check('status','Enter status').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        custom.sendResponse(res,null,null,null,custom.manageValidationMessages(errors));
    } else{
      
      let category_id = req.sanitize('category_id').escape().trim();
      let status = req.sanitize('status').escape().trim();
      var dataObj = {'status':status};
      var whereObj = {'id':category_id};
      let query = "SELECT id FROM category WHERE id = '"+category_id+"'";
      model.customQuery(function(err,result){
        if(err){
          custom.sendResponse(res);
        }else{
          
          if(Object.keys(result).length){
            model.updateData(function(err,results){
              if(err){
                custom.sendResponse(res);  
              }else{
                custom.sendResponse(res,200,1,{},"Status updated successfully"); 
              }  
            },constant.category,dataObj,whereObj);     
          }else{
            custom.sendResponse(res,200,0,{},"Category not found"); 
          }
        }
      },query);
    }
}

