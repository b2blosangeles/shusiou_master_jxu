(function () { 
	var obj =  function (connection,req) {
		this.getUid = function(callback) {
			if (req.auth && req.auth.uid) {
				connection.connect();
				connection.end();				
				callback({isAuth:true, uid:req.auth.uid});
			} else {
				callback({isAuth:false});	
			}
		}	
	};
	module.exports = obj;
})();
