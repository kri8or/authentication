var express = require('express');
var passport = require('passport');
var passportFB = require('passport-facebook').Strategy;
var fbRouter = express.Router();

// routes defined after fb/
var usersDB = require('../modules/DB');

// Passport FACEBOOK
// ==============================================
// In order to use Facebook authentication, you must first create an app at https://developers.facebook.com/.
// When created, an app is assigned an App ID and App Secret. Your application must also implement a redirect URL,
// to which Facebook will redirect users after they have approved access for your application.

var FACEBOOK_APP_ID = 343195729218869;
var FACEBOOK_APP_SECRET = 'd6e3830c44a08bc8b57032048d94dd65';



passport.use(new passportFB({
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "https://quemsou.eu/fb/auth/"
    },
    function(accessToken, refreshToken, profile, done) {

      //check (accessToken, refreshToken)

      usersDB.findOrCreateWithFB(
          profile.id,
          profile.displayName,
          profile.emails,
          function(resUser){
            done(null,resUser);
          });
      // profile properties http://passportjs.org/guide/profile/
    }));



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




// Handle ERROR 404 - ATENCAO neste momento n?o esta a funcar...meter dentro dos routes...
// se meter dentro de / of /fb da erro 404
fbRouter.use(function(req, res, next) {
  res.status(404).render('404');
});


// Handle ERROR 500
fbRouter.use(function(err, req, res, next){
  // we may use properties of the error object
  // here and next(err) appropriately, or if
  // we possibly recovered from the error, simply next().
  res.render('500', {
    status: err.status || 500
    , error: err
  });
});


module.exports = fbRouter;

