(function () { 
	var obj =  function (connection, post) {
		this.getUid = function(callback) {
			if (post.auth && post.auth.uid) {
				connection.connect();
				connection.end();				
				callback({isAuth:true, uid:post.auth.uid});
			} else {
				callback({isAuth:false});	
			}
		}	
	};
	module.exports = obj;
})();
