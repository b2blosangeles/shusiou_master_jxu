(function () { 
	var obj =  function (config, env, pkg) {
		
		this.split = function(_type, _file, _cbk) {
			let me = this;
			let _p = _file.match(/(.+)\/([^\/]+)$/);
			me.source_path = _p[1] + '/';
			me.source_file = _p[2];
			
			me.space_id = 'shusiou-d-01';
			me.tmp_folder = '/var/shusiou_cache/tmpvideo/' + source_file + '/' + _type + '/';
			me.space_url = 'https://shusiou-d-01.nyc3.digitaloceanspaces.com/';
			me.space_info = 'shusiou/' + source_file + '/_info.txt';
			me.space_dir = 'shusiou/' + source_file + '/' + _type + '/';
			me.trunkSize = 1024 * 1024;			
			
			var CP = new pkg.crowdProcess();
			var _f = {}; 
			
			_cbk('==niu==2=');
		};
		this.init = function() {
			let me = this;
			const AWS = require(env.site_path + '/api/inc/aws-sdk/node_modules/aws-sdk')
			me.s3 = new AWS.S3({
			    endpoint: new AWS.Endpoint('nyc3.digitaloceanspaces.com'),
			    accessKeyId: config.objectSpaceDigitalOcean.accessKeyId,
			    secretAccessKey: config.objectSpaceDigitalOcean.secretAccessKey
			});
			
		}
		this.writeInfo = function(v, cbk) {
			let me = this,
			    params = {
				Body: JSON.stringify(v),
				Bucket: me.space_id,
				Key: me.space_info,
				ContentType: 'text/plain',
				ACL: 'public-read'
			};	

			me.s3.putObject(params, function(err, data) {
				if (err) cbk(false);
				else    cbk(v);
			});		
		}
		me.removeObjects = function(folder, list, callback) {
			var params = {
				Bucket: me.space_id,
				Delete: {Objects:[]}
			};		
			for (var i = 0; i < Math.min(list.length,100); i++) {
				params.Delete.Objects.push({Key: folder + list[i]});
			};
			me.s3.deleteObjects(params, function(err, d) {
				if (err) return callback(err);
				else callback(d);
			});
		}
		
		
		this.init();
	};
	module.exports = obj;
})();
