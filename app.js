

// BASE SETUP
// ==============================================

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var passport = require('passport');
var passportLocal = require('passport-local');
var passportHttp = require('passport-http');
var passportFB = require('passport-facebook').Strategy;

var app = express();



//a FAKE BD:
// ==============================================

//var usersDB = require('./modules/user');

//a REAL BD:
// ==============================================

var usersDB = require('./modules/DB');


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
	secret: process.env.SESSION_SECRET || 'This is the secret', //secret to digitally sign the cookie
	resave: false,  
	saveUninitialized: false
})); 


// Passport local
// ==============================================

app.use(passport.initialize());
app.use(passport.session());



passport.use(new passportLocal.Strategy(function(username, password, done){ //done is a callback
	
	var userLogin = usersDB.loginUser(username,password,function(resUser){
		done(null, resUser);
	}); //null = insucesso
	
	//	done(null,null);  //check http://passportjs.org/guide/configure/
	


	// //pretending this is a real DB - user will enter with user = pass
	// if (username === password){
	// 	done(null,{ id: username, name: username });  	//no error and a user object is returned (success)
	// 													//the user object can look however we WANT!!
	// }else{												//were just using this id and name as EXAMPLE
	// 													//normally we'd get some kind of ID from DB or sth...		
 //    done(null,null); // no error and no user (password is bad)
 //    }

	// done(null,user); 
	
	// //done(new Error('ouch!!!')); //some error like, no conecction to DB...

	// //IMPORTANT!!!
	// //normaly we'd have a DB and we'd salt and hash the passwords
	// //check /nodejs.org/api/crypto.html
	// //pbkdf2 (standard to securely salt password...)

}));


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
app.use(function(req, res, next) {
	res.status(404).render('404');
});

//Start Server
// ==============================================

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Davids App listening at http://%s:%s', host, port)
});
