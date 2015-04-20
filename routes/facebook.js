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

