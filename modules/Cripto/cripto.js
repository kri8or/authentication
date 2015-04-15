var crypto = require('crypto');

var SALT_LENGTH = 64;
var KEY_LENGTH = 64;
var ITERATIONS = 1000;

exports.createHashedPassword = function (plainTextPassword, callback) {
    crypto.randomBytes(SALT_LENGTH, function (err, salt) {
        //console.time('password-hash');
        //crypto.pbkdf2(password, salt, iterations, keylen[, digest], callback)#
        crypto.pbkdf2(plainTextPassword, salt.toString('base64'), ITERATIONS, KEY_LENGTH, function (err, derivedKey) {
        //console.timeEnd('password-hash');
            return callback(null, {derivedKey: derivedKey.toString('base64'), salt: salt, iterations: ITERATIONS});
        });
    });
};



//verify if login password is valid
exports.verify = function (passwordEntered,storedPassword,storedSalt,callback){
    crypto.pbkdf2(passwordEntered, storedSalt, ITERATIONS, KEY_LENGTH, function (err, derivedKey) {
        //If no error....to be done...
        var dKey =derivedKey.toString('base64');
        if (dKey===storedPassword){
            return callback(true) //sucess
        }else{
            return callback(false)
        }
    });
};

