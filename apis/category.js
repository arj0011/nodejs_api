var category = require('../controllers/Category.js');

module.exports = function(app,database,constant,custom){
  
  app.post('/Category/getAllCategory',function(req,res,next){
    category.getAllCategory(req,res);      
  });

  app.post('/Category/getCategoryById',function(req,res,next){
    category.getCategoryById(req,res);      
  });

  app.post('/Category/addCategory',function(req,res,next){
    category.addCategory(req,res);      
  });

  app.post('/Category/editCategory',function(req,res,next){
    category.editCategory(req,res);      
  });

  app.post('/Category/changeCategoryStatus',function(req,res,next){
    category.changeCategoryStatus(req,res);      
  });

};
