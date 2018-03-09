/* ---  This cron is to appoint node for video. add record link only */
/* ---  chennel only related with user video, not related with video only */
var path = require('path');
var env = {root_path:path.join(__dirname, '../..')};
env.site_path = env.root_path + '/site';
env.site_path = env.root_path + '/site';
env.config_path = '/var/qalet_config';

var config = require(env.config_path + '/config.json');
let cfg = {
      id:'shusiou-d-01',
      endpoint : 'nyc3.digitaloceanspaces.com',
      accessKeyId: config.objectSpaceDigitalOcean.accessKeyId,
      secretAccessKey: config.objectSpaceDigitalOcean.secretAccessKey
    };
var splitVideo = new awsS3Video(cfg, env);	
splitVideo.split('_t', '/var/img/video.mp4', 
      function(data) {
        console.log(data);
      }
  );
