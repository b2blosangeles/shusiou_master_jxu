(function () { 
	var obj =  function () {
		this.getIpByName = function(dns_question) {
		  return '192.241.135.143';
		};	
	};
	module.exports = obj;
})();
/*
let ip = ddns.getIpByName(req.question[0].name);
console.log(ip+'----------------------------------' + req.question[0].name);
console.log(req.connection.remoteAddress + '-' + req.connection.type);
res.end(ip);
*/
