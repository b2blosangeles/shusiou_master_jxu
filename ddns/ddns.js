(function () { 
	var obj =  function () {
		this..sendRecord = function(req, res) {
			let question = req.question[0];
			//if(question.type == 'A') {
			 //   res.answer.push({name:question.name, type:'A', data:"192.241.135.139", 'ttl':60});
			 // }
			//  res.end();
				res.end("192.241.135.139");
		 	// return '192.241.135.143';
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
