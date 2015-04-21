var express = require('express');
var passport = require('passport');
var router = express.Router();

var usersDB = require('../modules/DB');



// EXAMPLE OF ADDING MIDDLEWARE TO ROUTER
// We’ll use router.use() to define middleware.
// If I put it after the definition of one route it will only log routes from that up... 
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

//-------------------- Middleware

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


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}


// Middleware to certify that the SUBSEQUENT requests are authenticated
//router.use(function (req,res,next){
// if (req.isAuthenticated()) { return next(); }
//res.redirect('/login')
//});


//-------------------



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

router.post('/login',ensureConnection, function(req, res, next) {

  passport.authenticate('local', function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user){
      return res.render('login',{'message':'Essas credenciais nao existem pah!','type':'danger'});
    }
    req.logIn(user, function(err) {
      if (err) {
        console.log('erro aqui (router post login): '+err);
        return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);

});



// REGISTER

router.post('/register',ensureConnection, function(req, res) {

  usersDB.findOrCreate(req.body.username, req.body.password, function(result){
    //res true - success; false - already exists
    var message = "",type = "";

    if (result){
      message ='user creado com sucesso';
      type='success';}
    else{
      message= 'user ja existe';
      type='danger';
    }

    return res.render('login',{'message': message, 'type':type});
  });
});

//Account details
router.get('/account',ensureConnection,ensureAuthenticated, function (req,res){
  res.render('account',{
    user: req.user
  });
});

//Logout
router.get('/logout', function (req,res){
  req.logout();
  res.redirect('/');
});

//test
//router.use(cookieParser);
router.get('/cookie',function (req,res){
  res.cookie('test', 'aa');
  res.render('test');

});

//test

router.get('/cres',function (req,res){
  console.log("Cookies: ", req.cookies);
  res.render('index', {title: 'test lol'});

});



// Handle ERROR 404 - ATENCAO neste momento não esta a funcar...meter dentro dos routes...
// se meter dentro de / of /fb da erro 404
router.use(function(req, res, next) {
  res.status(404).render('404');
});


// Handle ERROR 500
router.use(function(err, req, res, next){
  // we may use properties of the error object
  // here and next(err) appropriately, or if
  // we possibly recovered from the error, simply next().
  res.render('500', {
    status: err.status || 500
    , error: err
  });
});




//subsequent request
router.get('/david',function (req,res){
  res.send('...the greatest');
});

//subsequent request
router.get('/martins',ensureAuthenticated, function (req,res){
  res.send('...yes the greatest'); //will appear in case user is logged in
});


//---------------another way to define the router (more clean)------------------------

router.route('/tone')

    .get(function (req,res){
      res.send('test');
    })

    .post(function (req,res){
      res.send('test');
    });


/// This is just a test route create connection

router.get('/connect',function (req,res){
  usersDB.checkConnection(function(connected){
    if (connected){
      res.send('congrats');
    }else{
      res.send('error - not connected ... try again later');
    }
  });
});

//----------------------------------------




module.exports = router;


