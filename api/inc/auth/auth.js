(function () { 
	var obj =  function (connection) {
		this.getUid = function(callback) {
			connection.connect();
			connection.end();
			res.send('niu');
		}	
	};
	module.exports = obj;
})();
