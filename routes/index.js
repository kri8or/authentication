

var express = require('express');
var passport = require('passport');
var router = express.Router();


//--------------------

var usersDB = require('../modules/user');

usersDB.createUser({id:123, username:"tone", password:"tone" });
usersDB.createUser({id:456, username:"quim", password:"quim" });
usersDB.createUser({id:789, username:"ze", password:"ze" });
usersDB.createUser({id:234, username:"couves", password:"couves" });
usersDB.createUser({id:458, username:"maria", password:"maria" });


//--------------------

// EXAMPLE OF ADDING MIDDLEWARE TO ROUTER
// We’ll use router.use() to define middleware.
// If I put it after the definition of one route (example / in line 36) it will only log routes from that up... 
router.use(function(req, res, next) {
  console.log('middleware added by David:');
    
    // log each request to the console
    console.log(req.method, req.url+'\n');

    // continue doing what we were doing and go to the route
    next(); 

    // Keep in mind that you can use route middleware for many things. 
    // You can use it to check that a user is logged in in the session before 
    // letting them continue.
});

//--------------------



router.get('/', function (req, res) {
  res.render('index', {
  	isAuthenticated: req.isAuthenticated(), //passport adds this for us (express doesnt have)
  	user: req.user
  });
});



router.get('/login', function (req, res) {
  req.isAuthenticated() ? res.redirect('/') : res.render('login');
});


//DEFAULT STRAGEGY: sent 401 error if login fails - no redirect possible
router.post('/login-default', passport.authenticate('local'), function (req, res) {  // strategy is local, if succedes it'll put a token in the session
																			// subsequent requests will see that token an 
																			// de-serialize it and put it available in req.user
	res.redirect('/');																		
});


//OVERRIDING THE DEFAULT STRATEGY
//ALSO CHECK http://www.hacksparrow.com/express-js-custom-error-pages-404-and-500.html

router.post('/login', function(req, res, next) {
  /* look at the 2nd parameter to the below call */
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.render('login',{'message':'Essas credenciais nao existem pah!'});}
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
});


//---------------another way to define the router (more clean)------------------------

router.route('/tone')

  .get(function (req,res){
  res.send('test');
});

  .post(function (req,res){
  res.send('test');
});
//----------------------------------------



router.get('/logout', function (req,res){
	req.logout();
	res.redirect('/');
});

router.get('/test',function (req,res){
  res.render('test');
});







module.exports = router;


