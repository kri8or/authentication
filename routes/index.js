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
  	isAuthenticated: req.isAuthenticated(), //passport adds this for us (express doens not have)
  	user: req.user
  });
});

router.get('/login', function (req, res) {
  req.isAuthenticated() ? res.redirect('/') : res.render('login');
});

router.post('/login', passport.authenticate('local'), function (req, res) {  // strategy is local, if succedes it'll put a token in the session
																			// subsequent requests will see that token an 
																			// de-serialize it and put it available in req.user	(line 9)
	
	res.redirect('/');																		
});

router.get('/logout', function (req,res){
	req.logout();
	res.redirect('/');
});

module.exports = router;


