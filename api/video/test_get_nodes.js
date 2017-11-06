var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    cfg0 = require(env.site_path + '/api/cfg/db.json');

var opt = req.query['opt'];

switch(opt) {
	case 'getVideoNode':
		delete require.cache[env.site_path + '/api/inc/videoNode/videoNode.js'];
		var videoNode = require(env.site_path + '/api/inc/videoNode/videoNode.js');
		
		var vid = req.query['vid'];
		
		var vn = new  videoNode(env, pkg);
		vn.getIP(vid, function(data){
			res.send(data);
		});
		return true;
		break;
	case 'getVideoNodeStatus':
		delete require.cache[env.site_path + '/api/inc/videoNode/videoNode.js'];
		var videoNode = require(env.site_path + '/api/inc/videoNode/videoNode.js');

		var vid = req.query['vid'];
		
		var mnt_folder = '/mnt/shusiou-video/';
		var fn = mnt_folder + 'videos/' + vid + '/video/video.mp4';
		
		pkg.fs.stat(fn, function(err, stat) {
			res.send(stat);
		});
		
		
	//	var vn = new  videoNode(env, pkg);
	//	vn.getIP(vid, function(data){
	//		res.send(data);
	//	});
		return true;
		break;		
	default:
		res.send({status:'error', message:'Wrong opt value!'});
}
