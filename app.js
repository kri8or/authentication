

// BASE SETUP
// ==============================================

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var passport = require('passport');
var passportLocal = require('passport-local');
var passportHttp = require('passport-http');

var app = express();


//a FAKE BD:
// ==============================================

var usersDB = require('./modules/user');





app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(expressSession({ 
	secret: process.env.SESSION_SECRET || 'This is the secret', //secret to digitally sign the cookie
	resave: false,  
	saveUninitialized: false
 })); 


// Passport
// ==============================================

app.use(passport.initialize());
app.use(passport.session());



passport.use(new passportLocal.Strategy(function(username, password, done){ //done is a callback
	
	var userLogin = usersDB.loginUser(username,password); //null = insucesso
	if (usersDB.loginUser(username,password)){
		done(null, userLogin);
	}else{
		done(null,null);  //check http://passportjs.org/guide/configure/
	}


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


//Serialize and Deserialize users 
// ==============================================

passport.serializeUser(function(user, done){
	done(null,user.id);
});

passport.deserializeUser(function(id, done){
	var user = usersDB.findUser(id);
	done(null,{id: user.id, username: user.username});
});


// ROUTES
// ==============================================
//	a inicialização do passport tem que estar antes das rotas que usam passport (senao erro)
//  como estão nas linhas 39 e 40 (acima)

var routes = require('./routes/index');
app.use('/', routes);  

	// rotas definidas a partir de /
	// se fosse /whatever, cada route seria /whatever/route	
	// like this we can create several routes for different kinds of functionalities

// Handle ERROR 404
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