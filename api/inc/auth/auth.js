(function () { 
	var obj =  function (connection,req) {
		this.getUid = function(callback) {
			if (req.body.auth && req.body.auth.uid) {
				connection.connect();
				connection.end();				
				callback({isAuth:true, uid:req.body.auth.uid});
			} else {
				callback({isAuth:false});	
			}
		}	
	};
	module.exports = obj;
})();
