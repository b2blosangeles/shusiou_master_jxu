(function () { 
	var obj =  function (config, env, pkg) {
		this.init = function() {
			let me = this;
			const AWS = require(env.site_path + '/api/inc/aws-sdk/node_modules/aws-sdk')
			me.s3 = new AWS.S3({
			    endpoint: new AWS.Endpoint('nyc3.digitaloceanspaces.com'),
			    accessKeyId: config.objectSpaceDigitalOcean.accessKeyId,
			    secretAccessKey: config.objectSpaceDigitalOcean.secretAccessKey
			});		
		}
		this.split = function(_type, _file, _cbk) {
			let _p = _file.match(/(.+)\/([^\/]+)$/);
			let source_path = _p[1] + '/',
			    source_file = _p[2],
			    tmp_folder = '/var/shusiou_cache/tmpvideo/' + source_file + '/' + _type + '/',
			    space_id = 'shusiou-d-01',
			    space_url = 'https://shusiou-d-01.nyc3.digitaloceanspaces.com/', 
			    space_info = 'shusiou/' + source_file + '/_info.txt',
			    space_dir = 'shusiou/' + source_file + '/' + _type + '/',
			    trunkSize = 1024 * 1024;			
			
			var CP = new pkg.crowdProcess();
			var _f = {}; 
			
			_cbk('==niu==2=');
		};
		this.init();
	};
	module.exports = obj;
})();
