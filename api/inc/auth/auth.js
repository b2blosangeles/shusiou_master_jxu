(function () { 
	var obj =  function (connection) {
		this.getUid = function(callback) {
			connection.connect();
			connection.end();
			callback(req.body.auth);
		}	
	};
	module.exports = obj;
})();
