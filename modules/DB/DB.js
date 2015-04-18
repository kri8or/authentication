var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/users');  // "createConnection" instead of "connect" to connect to already open connection or connect to existing one

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'humm...connection error:'));


var criptoModule = require('../Cripto');


//db.once('open', function (callback) {

		var usersSchema = mongoose.Schema({
			username: String, 
			password: {
				derivedKey: String,
				salt: String
			},
			email: String,
			facebook: {
				fbId: Number,
				fbUsername: String,
				fbEmail: String		
			}
		});

		  // The permitted SchemaTypes are
		  //   String		  //   Number
		  //   Date		  	  //   Buffer
		  //   Boolean		  //   Mixed
		  //   ObjectId		  //   Array


		// assign a function to the "methods" object of our usersSchema
		// edit a property
		usersSchema.methods.editProperty = function (property, value, cb) {
	  		this[property] = value;
	  		return cb(this);
		}


		// assign a function to the "statics" object of our usersSchema
		usersSchema.statics.findByUsername = function (username, cb) {
		  return this.find({ username: new RegExp(username, 'i') }, cb);
		};

		// assign a function to the "statics" object of our usersSchema
		usersSchema.statics.findByFbId = function (fbId, cb) {
		  return this.find({  'facebook.fbId': fbId }, cb);
		};



		var User = mongoose.model('User', usersSchema); //the User will be the constructor

		//var usertest = new User({ username: 'usertest' });
		//console.log(usertest) // 'usertest'


		//save
		// usertest.save(function (err) {
		//   if (err) return console.error(err);
		// });


		//find all
		// User.find(function (err, users) {
		//   if (err) return console.error(err);
		//   console.log(users)
		// });

		exports.checkConnection = function(next){
			// if not connected inform user and log...
			var status = mongoose.connection.readyState;

			if (status === 0){
				mongoose.connect('mongodb://localhost/test', function (error) {
					// Do things once connected here
					//if error inform user...
					if (error){
						console.log('cannot connect, is the DB server on ?!?');

						//DO SOMETHING HERE to index.js
						next(false); //false = not Connected

					}else{
						// go ahead and do whatever you wanted...
						next(true); //true = connected
					}
				});
			}else{
			// go ahead and do whatever you wanted...
				next(true); //true = connected
			}
		}

		// connection.readyState
		//0 = disconnected
		//1 = connected
		//2 = connecting
		//3 = disconnecting



		//list all users
		exports.getAllUsers = function (cb){
			User.find(function (err, users) {
			err ? console.error(err) : cb(users)
		 });
		} 

		//find by username 
		exports.findByUsername = function (username,cb){
			User.findByUsername(username, function (err, users) {
		  	return cb(users); //users is an array
			});
		}

		//save user
		exports.saveUser = function (user,cb){
			user.save(function (err) {
		   	err ? console.error(err) : cb(true)
		 	});			
		}

		//edit user details
		exports.editUser = function  (user,cb){
			user.editProperty('username','another',function(res){
				console.log(res);
			});
		}
		


		//remover user
		exports.removeUser = function (user,cb){
			user.remove(function(err){
				err ? console.error(err) : cb(true)
			});
		}



		//find or create user (when login with FACEBOOK)
		exports.findOrCreateWithFB = function (fbId, fbUsername, fbEmail, cb){
			
			User.findOne({ 'facebook.fbId': fbId }, function (err,user){
				if (user){
					return cb(user);
				}else{
					//create user
					var newUser = new User({
						username: fbUsername,
						email: fbEmail[0].value,
						'facebook.fbId': fbId,
						'facebook.fbUsername': fbUsername,
						'facebook.fbEmail': fbEmail[0].value
						 });

					newUser.save(function (err) {
					   if (err) return console.error(err);
					});
				}
			});
			
		}

		//find or create user (when login Normally)
		exports.findOrCreate = function (username, password, cb){
			var created = false;
			User.findOne({ username: username }, function (err,user){
				if (user){
					return cb(created);  // user ja existe
				}else{
					//create user
					criptoModule.createHashedPassword(password,function(err,res){
						var newUser = new User({
							username: username,
							password: {
								derivedKey: res.derivedKey,
								salt: res.salt
							},
							email: '',
							'facebook.fbId': '',
							'facebook.fbUsername': '',
							'facebook.fbEmail': ''
						});

						newUser.save(function (err) {
							if (err) {
								console.error(err);
								return cb(created); //false neste caso
							}else{
								created = true;
								return cb(created); //true neste caso
							}

						});
					});
				}
			});
		};

		//check user password to login
		exports.loginUser = function (username, password, cb){

			//console.log('connection status '+mongoose.connection.readyState) //check if connection...


			User.findOne({ username: username }, function (err, user) {
				if (err) {
					console.log('error here man...');
				}

				if (user){
					criptoModule.verify(password,user.password.derivedKey,user.password.salt,function(res){ // res true or false
						if (res){
							cb(user);
						}else{
							cb(null);
						}

					});
				}else{
					cb(null);
				}




			});
		}


		//count users
		exports.countUsers = function (cb){
			User.count(function (err, count){
				return cb(count);
			});
		}

		
		//get the creation date checking by id timestamp of the FIRST found
		exports.getUserCreationDate = function (username,cb){
			User.findByUsername(username, function (err, users) {
		  	return cb(users[0]._id.getTimestamp()); //users is an array
			});
		};





		//testssssssssssssssss

		// saveUser(new User({ usernamesss: 'david', password: 'passworde', email:'emaile' }),function(status){
		// 	console.log(status);
		// });

		// getAllUsers(function(res){
		// 	console.log(res);
		// });

		// findByUsername('david',function(arr){
		// 	console.log(arr);
		// })

		// getUserCreationDate('david',function(res){
		// 	console.log(res);
		// });
		

		// find - edid - save
		// findByUsername('david',function(arr){
		// 	arr[0].editProperty('username','another',function(res){
		// 		arr[0].save(function (err) {
		//    		err ? console.error(err) : console.log('success')
		//  		});
		// 		console.log(res);
		// 	});
		// });


		// find - remove
		 // findByUsername('usertest',function(arr){
		 	
		 // 	for (var i = 0; i<arr.length; i++){
		 // 		removeUser(arr[i],function(res){
		 // 			console.log(res);
		 // 		});
		 // 	}
		 	
		 // })
		
		// find - remove - CLEAN
		// User.find().remove({username:'username'},function (err){
		// 	err ? console.log(err) : console.log('done') 
		// });
			 
		




		// countUsers(function(res){
		// 	console.log('ha '+ res +' users');
		// });

		// findOrCreate('tone',function(res){
		// 	console.log(res);
		// })
		

		// console.time("second");
		// User.findOne({ username: 'tone' }, function (err, user) {});
		// console.timeEnd("second");

		// console.time("first");
		// findByUsername('tone',function(res){
		// 	//console.log(res);
		// })
		// console.timeEnd("first");
		


//});