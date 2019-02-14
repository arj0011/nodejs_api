var product = require('../controllers/Product.js');

module.exports = function(app,database,constant,custom,router){
  
  app.post('/Product/getAllProduct',function(req,res,next){
    product.getAllProduct(req,res);      
  });

  // app.post('/Category/getCategoryById',function(req,res,next){
  //   category.getCategoryById(req,res);      
  // });

  app.post('/Product/addProduct',function(req,res,next){
    product.addProduct(req,res);      
  });

  app.post('/Product/editProduct',function(req,res,next){
    product.editProduct(req,res);      
  });

  // app.post('/Category/changeCategoryStatus',function(req,res,next){
  //   category.changeCategoryStatus(req,res);      
  // });

};
