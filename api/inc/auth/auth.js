(function () { 
	var obj =  function (connection, post) {
		this.getUid = function(callback) {
			connection.connect();
			connection.end();
			callback(post);
		}	
	};
	module.exports = obj;
})();
