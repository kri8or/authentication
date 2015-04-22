// BASE SETUP
// ==============================================

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var passport = require('passport');
//var passportHttp = require('passport-http');


var app = express();

//Serialize and Deserialize users
// ==============================================

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Facebook profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});



// View Engine and Express Session and Cookie configuration
// ==============================================
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(expressSession({
	//cookie: {maxAge: 20000}, //20 seconds
	cookie: {secure: false, httpOnly: true}, //true to secure
	secret: process.env.SESSION_SECRET || 'This is the secret', //secret to digitally sign the cookie
	resave: false,  
	saveUninitialized: false
})); 



// Passport local
// ==============================================

app.use(passport.initialize());
app.use(passport.session());


// ROUTES
// ==============================================
//	a inicialização do passport tem que estar antes das rotas que usam passport (senao erro)
//  como estão nas linhas 39 e 40 (acima)

var fbRoutes = require('./routes/facebook');
app.use('/fb', fbRoutes);  

var routes = require('./routes/index');
app.use('/', routes);  

	// rotas definidas a partir de /
	// se fosse /whatever, cada route seria /whatever/route	
	// like this we can create several routes for different kinds of functionalities

// Handle ERROR 404 - ATENCAO neste momento não esta a funcar...meter dentro dos routes...
// se meter dentro de / of /fb da erro 404
//app.use(function(req, res, next) {
//	res.status(404).render('404');
//});



//Start Server
// ==============================================

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Davids App listening at http://%s:%s', host, port)
});
