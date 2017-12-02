(function () { 
	var obj =  function (connection, auth) {
		this.getUid = function(callback) {
			if (auth && auth.uid) {
				connection.connect();
				connection.end();				
				callback({isAuth:true, uid:auth.uid});
			} else {
				callback({isAuth:false});	
			}
		}	
	};
	module.exports = obj;
})();
