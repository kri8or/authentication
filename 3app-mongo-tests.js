var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/users');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//db.once('open', function (callback) {
  // yay!
		var usersSchema = mongoose.Schema({
			username: String,
			password: String,
			email: String,
			facebook: {
				facebookId: Number,
				facebookProfile: String,
				name: String,
				email: String		
			}
		});

		  // The permitted SchemaTypes are

		  //   String
		  //   Number
		  //   Date
		  //   Buffer
		  //   Boolean
		  //   Mixed
		  //   ObjectId
		  //   Array


		// assign a function to the "methods" object of our animalSchema
		usersSchema.methods.editProperty = function (property, value, cb) {
	  		this[property] = value;
	  		return cb(this);
		}


		// assign a function to the "statics" object of our animalSchema
		usersSchema.statics.findByUsername = function (username, cb) {
		  return this.find({ username: new RegExp(username, 'i') }, cb);
		};



		var User = mongoose.model('User', usersSchema); //the User will be the constructor

		var usertest = new User({ username: 'usertest' });
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

		//list all users
		function getAllUsers(cb){
			User.find(function (err, users) {
			err ? console.error(err) : cb(users)
		 });
		} 

		//find by username 
		function findByUsername(username,cb){
			User.findByUsername(username, function (err, users) {
		  	return cb(users); //users is an array
			});
		}

		//save user
		function saveUser(user,cb){
			user.save(function (err) {
		   	err ? console.error(err) : cb(true)
		 	});			
		}

		//edit user details
		function editUser(user,cb){
			user.editProperty('username','another',function(res){
				console.log(res);
			});
		}
		


		//remover user
		function removeUser(user,cb){
			user.remove(function(err){
				err ? console.error(err) : cb(true)
			});
		}



		//find or create user
		function findOrCreate(username, cb){
			findByUsername(username,function(res){
				if (res.length > 0){
					return cb(res[0]);
				}else{
					//create user
					saveUser(new User({ username: username }),function(newUser){
					return cb(newUser);
					})
				}

			});
		}
		


		//count users
		function countUsers(cb){
			User.count(function (err, count){
				return cb(count);
			});
		}

		
		//get the creation date checking by id timestamp of the FIRST found
		function getUserCreationDate(username,cb){
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
		User.find().remove({username:'username'},function (err){
			err ? console.log(err) : console.log('done') 
		});
			
		




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