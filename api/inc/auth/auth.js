(function () { 
	var obj =  function (connection) {
		this.getUid = function(callback) {
			connection.connect();
			connection.end();
			callback();
		}	
	};
	module.exports = obj;
})();
