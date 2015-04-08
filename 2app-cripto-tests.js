var crypto = require('crypto');

var SALT_LENGTH = 64;
var KEY_LENGTH = 64;
var ITERATIONS = 1000;

function createHashedPassword(plainTextPassword, callback) {
    crypto.randomBytes(SALT_LENGTH, function (err, salt) {
        console.time('password-hash');
        //crypto.pbkdf2(password, salt, iterations, keylen[, digest], callback)#
        crypto.pbkdf2(plainTextPassword, 'CScketSC6nYk73X/i0Lp0pVZCcvbbeeO1K1jnYBq1k8SQO6I51aONP2KKzU84h3+6DvZ0qknvGm2KQJoeHPhNA==', ITERATIONS, KEY_LENGTH, function (err, derivedKey) {
            console.timeEnd('password-hash');
            return callback(null, {derivedKey: derivedKey.toString('base64'), salt: salt.toString('base64'), iterations: ITERATIONS});
        });
    });
};



function verify(password, callback){
	createHashedPassword(password,function (err,result){
	return callback(result);
});
};


verify('davidsPass', function(dbRecord){
	var first = dbRecord;
	//console.log(first);
});


//test with synchronows
function createHashedPasswordSynch(password){
	
	var hash = crypto.pbkdf2Sync(password, 'CScketSC6nYk73X/i0Lp0pVZCcvbbeeO1K1jnYBq1k8SQO6I51aONP2KKzU84h3+6DvZ0qknvGm2KQJoeHPhNA==', ITERATIONS, KEY_LENGTH);
	
	return hash.toString('base64');
}


console.log(createHashedPasswordSynch('davidsPass'));