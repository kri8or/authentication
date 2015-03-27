var usersDB=[];



function User(){

	this.dados = {
	 id:null,
	 username:null,
	 password:null
	 };

	this.defineUser = function(userData){
		for (var prop in this.dados){
	 		if (this.dados[prop] !== 'undefined'){ 
	        	this.dados[prop] = userData[prop];
	 		}
		}
	}

}



exports.createUser = function(userData){
	var user = new User();	
	user.defineUser(userData);	
	usersDB.push(user);
	return user;
}

exports.loginUser = function(username,password){
	var usr=null;
	for (i=0;i<usersDB.length;i++){
		if (usersDB[i].dados.username==username){
			if(usersDB[i].dados.password==password){
				usr=usersDB[i].dados;
				return usr;
			}
		}
	}
	return usr;	
}

exports.findUser = function(id){
	var usr=null;
	for (i=0;i<usersDB.length;i++){
		if (usersDB[i].dados.id==id){
			usr=usersDB[i].dados;
			return usr;
		}
	}
	return usr;	
}

