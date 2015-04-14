var crypto = require('crypto');

var SALT_LENGTH = 64;
var KEY_LENGTH = 64;
var ITERATIONS = 1000;

exports.createHashedPassword = function (plainTextPassword, callback) {
    crypto.randomBytes(SALT_LENGTH, function (err, salt) {
        console.time('password-hash');
        //crypto.pbkdf2(password, salt, iterations, keylen[, digest], callback)#
        crypto.pbkdf2(plainTextPassword, salt, ITERATIONS, KEY_LENGTH, function (err, derivedKey) {
            console.timeEnd('password-hash');
            return callback(null, {derivedKey: derivedKey.toString('base64'), salt: salt.toString('base64'), iterations: ITERATIONS});
        });
    });
};

