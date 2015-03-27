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


router.get('/', function (req, res) {
  res.render('index', {
  	isAuthenticated: req.isAuthenticated(), //passport adds this for us (express doesnt have)
  	user: req.user
  });
});


router.get('/login2', function (req, res) {
  req.isAuthenticated() ? res.redirect('/') : res.render('login');
});

//DEFAULT STRAGEGY: sent 401 error if login fails - no redirect possible
router.post('/login', passport.authenticate('local'), function (req, res) {  // strategy is local, if succedes it'll put a token in the session
																			// subsequent requests will see that token an 
																			// de-serialize it and put it available in req.user	(line 22)
																			// to override the default behaviour check 'Custom Callback' in http://passportjs.org/guide/authenticate/
	
	res.redirect('/');																		
});





//OVERRIDING THE DEFAULT STRATEGY
//ALSO CHECK http://www.hacksparrow.com/express-js-custom-error-pages-404-and-500.html

router.post('/login2', function(req, res, next) {
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
//----------------------------------------


router.get('/logout', function (req,res){
	req.logout();
	res.redirect('/');
});




module.exports = router;


