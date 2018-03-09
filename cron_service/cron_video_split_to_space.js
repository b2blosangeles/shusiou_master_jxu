/* ---  This cron is to appoint node for video. add record link only */
/* ---  chennel only related with user video, not related with video only */
var path = require('path');
var env = {root_path:path.join(__dirname, '../..')};
env.site_path = env.root_path + '/site';
env.site_path = env.root_path + '/site';
env.config_path = '/var/qalet_config';

var config = require(env.config_path + '/config.json');
let awsS3Video = require(env.site_path + '/api/inc/awsS3Video/awsS3Video.js'),
    cfg = {
      id:'shusiou-d-01',
      endpoint : 'nyc3.digitaloceanspaces.com',
      accessKeyId: config.objectSpaceDigitalOcean.accessKeyId,
      secretAccessKey: config.objectSpaceDigitalOcean.secretAccessKey
    };

let pkg = {
    mysql:require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    crowdProcess:require(env.root_path + '/package/crowdProcess/crowdProcess'),
	fs : require('fs')
};  

var splitVideo = new awsS3Video(cfg, env, pkg);	
	
splitVideo.split('_t', '/var/img/video.mp4', 
      function(data) {
        console.log(data);
      }
  );
