(function () { 
	var obj =  function () {
		this.getIP = function(callback) {
			callback('getIP');
		};	
	};
	module.exports = obj;
})();
