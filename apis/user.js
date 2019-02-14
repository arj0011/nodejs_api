var user = require('../controllers/User.js');
module.exports = function(app,database,constant,custom){
  
  app.post('/User/Signup',function(req,res,next){
    user.Signup(req,res);      
  });

  app.post('/User/Login',function(req,res,next){
    user.Login(req,res);
  });

};
