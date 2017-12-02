(function () { 
	var obj =  function (connection, cbk) {
		connection.connect();
		connection.end();
		cbk();	
	};
	module.exports = obj;
})();
