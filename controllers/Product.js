'use strict';

var Product = exports;
var async    = require('async');
var path     = require('path');
var fs       = require('fs'); 
var appRoot  = require('app-root-path');
var constant = require(appRoot + '/config/constant.js');
var custom   = require(appRoot + '/lib/custom.js');
var database = require(appRoot + '/config/database.js');
var model    = require(appRoot + '/lib/model.js');
var base64ToImage = require('base64-to-image');

Product.addProduct = function(req,res){
  
  //Request input
  // res.status(200).send(req.body);
  req.sanitize("product").trim();
  req.sanitize("descr").trim();
  req.sanitize("price").trim();
  req.sanitize("discount").trim();
  req.sanitize("category").trim();

  req.check('product','Enter product').notEmpty();
  req.check('descr','Enter description').notEmpty();
  req.check('price','Enter price').notEmpty();
  req.check('price','Price must be a number').isNumeric();
  req.check('discount','Discount must be a number').isNumeric();
  req.check('category','Enter category').notEmpty();
  req.check('category','Category must be a number').isNumeric();

    var errors = req.validationErrors();
    if (errors) {
        custom.sendResponse(res,null,null,null,custom.manageValidationMessages(errors));
    } else{
      
      let product = req.sanitize('product').escape().trim();
      let descr = req.sanitize('descr').escape().trim();
      let price = req.sanitize('price').escape().trim();
      let discount = req.sanitize('discount').escape().trim();
      let category = req.sanitize('category').escape().trim();
        discount = (discount !== '') ? discount : 0;
            
      async.waterfall(
        [
          function(callback){
            let query = "SELECT id FROM product WHERE product = '"+product+"'";
            model.customQuery(function(err,result){
              if(err){
                custom.sendResponse(res);
              }else{
                if(!Object.keys(result).length){
                  callback(true,result);
                }else{
                  custom.sendResponse(res,null,null,null,"Product already exist");                  
                }
              }
            },query);
          }        
        ],
        function(err,results){
          var dataObj = {'product':product,'descr':descr,'price':price,'discount':discount,'category_id':category};
            model.insertData(function(err,results){
              if(err){
                custom.sendResponse(res);
              }else{
                custom.sendResponse(res,null,1,null,"Product insert successfully");
              }
            },constant.product,dataObj);
        });
    }
}


Product.editProduct = function(req,res){
  
  //Request input
  // res.status(200).send(req.body);
  req.sanitize("product").trim();
  req.sanitize("descr").trim();
  req.sanitize("price").trim();
  req.sanitize("discount").trim();
  req.sanitize("category").trim();

  req.check('product_id','Enter product').notEmpty();
  req.check('product_id','Product id must be number').isNumeric();
  req.check('product','Enter product').notEmpty();
  req.check('descr','Enter description').notEmpty();
  req.check('price','Enter price').notEmpty();
  req.check('price','Price must be a number').isNumeric();
  req.check('discount','Discount must be a number').isNumeric();
  req.check('category','Enter category').notEmpty();
  req.check('category','Category must be a number').isNumeric();
    var errors = req.validationErrors();
    if (errors) {
       custom.sendResponse(res,null,null,null,custom.manageValidationMessages(errors));
    } else{
      
      let product_id = req.sanitize('product_id').escape().trim();
      let product = req.sanitize('product').escape().trim();
      let descr = req.sanitize('descr').escape().trim();
      let price = req.sanitize('price').escape().trim();
      let discount = req.sanitize('discount').escape().trim();
      let category = req.sanitize('category').escape().trim();
      
      async.waterfall([
        function(callback){
          let query = "SELECT id FROM product WHERE id = '"+product_id+"'";
          model.customQuery(function(err,resu){
            if(err){
              custom.sendResponse(res);
            }else{
              if(Object.keys(resu).length){
                callback(null,resu);
              }else{
                custom.sendResponse(res,null,null,null,"Product not found");
              }
            }
          },query);
        },
        function(resu,callback){
          let query = "SELECT id FROM product WHERE id <> '"+product_id+"' AND product = '"+product+"'"; 
          model.customQuery(function(err,resul){
            if(err){
              custom.sendResponse(res);
            }else{
              if(!Object.keys(resul).length){
                callback(null,resul);
              }else{
                custom.sendResponse(res,null,null,null,"Product already exist");
              }
            }
          },query);
        }
      ],function(err,results){
          var dataObj = {'product':product,'descr':descr,'price':price,'discount':discount,'category_id':category};
          var whereObj = {'id':product_id};
          model.updateData(function(err,result){
            if(err){
              custom.sendResponse(res);
            }else{
              custom.sendResponse(res,null,1,null,"Product update successfully");
            }
          },constant.product,dataObj,whereObj);
        
      });
    }
}



Product.getAllProduct = function(req,res){
  
  //Request input
  
  req.sanitize("offset").trim(); 
  req.check('offset','Enter offset').notEmpty();
  req.check('offset','Enter number').isNumeric();
    
    var errors = req.validationErrors();
    if (errors) {
        custom.sendResponse(res,null,null,null,custom.manageValidationMessages(errors));
    } else{

      var offset = req.sanitize('offset').escape().trim();
      offset = (offset === 0) ? 1 : offset;
      var whereObj = {'product.status':1};
      let fieldsArr = ['product.id','product','descr','price','discount','category_id','IF(product.image IS NOT NULL,CONCAT("'+constant.image_url+'",product.image),"") AS image','product.status','product.created_at'];
      model.getSingleJoinData(function(err,results){
        if(err){
          custom.sendResponse(res);
        }else{
          if(Object.keys(results).length){
            custom.sendResponse(res,200,1,results,"Product data");
          }else{
            custom.sendResponse(res,null,null,null,"Product not found");
          } 
        }
      },constant.product,constant.category,'category_id','id','inner',whereObj,'product.created_at','DESC',fieldsArr,null,offset,null);
    }
}
/*
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
*/
