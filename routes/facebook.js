var express = require('express');
var passport = require('passport');
var fbRouter = express.Router();

// routes defined after fb/



var usersDB = require('../modules/DB');


//middleware to checkConnection do DB...
function ensureConnection(req,res,next){
  usersDB.checkConnection(function(connected){
    if (connected) {
      return next();
    }else{
      res.send('sorry dude, no connection do DB')
    }
  });
}


fbRouter.get('/facebook',ensureConnection,passport.authenticate('facebook',{ scope: 'email' }));

fbRouter.get('/auth',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });



fbRouter.get('/', function (req, res) {
  res.render('index', {
  	isAuthenticated: req.isAuthenticated(), //passport adds this for us (express doesnt have)
  	user: userTest
  });
});



module.exports = fbRouter;

