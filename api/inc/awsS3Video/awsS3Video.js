(function () { 
	var obj =  function (cfg) {
		this.split = function(_type, _file, _cbk) {
			_cbk(cfg);
		};	
	};
	module.exports = obj;
})();
