var express = require('express');
var passport = require('passport');
var fbRouter = express.Router();


fbRouter.get('/facebook', passport.authenticate('facebook'));

fbRouter.get('/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });



fbRouter.get('/', function (req, res) {
  res.render('index', {
  	isAuthenticated: req.isAuthenticated(), //passport adds this for us (express doesnt have)
  	user: req.user
  });
});



fbRouter.get('/login', function (req, res) {
  req.isAuthenticated() ? res.redirect('/') : res.render('login');
});


fbRouter.get('/logout', function (req,res){
	req.logout();
	res.redirect('/');
});


module.exports = fbRouter;

