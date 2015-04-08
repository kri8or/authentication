var express = require('express');
var passport = require('passport');
var fbRouter = express.Router();


fbRouter.get('/facebook', passport.authenticate('facebook',{ scope: 'email' }));

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

