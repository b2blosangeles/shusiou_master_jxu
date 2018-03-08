let mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    config = require(env.config_path + '/config.json'),
    cfg0 = config.db;

let awsS3Video = require(env.site_path + '/api/inc/awsS3Video/awsS3Video.js'),
    cfg = {
      id:'shusiou-d-01',
      endpoint : 'nyc3.digitaloceanspaces.comA',
      accessKeyId: config.objectSpaceDigitalOcean.accessKeyId,
      secretAccessKey: config.objectSpaceDigitalOcean.secretAccessKey
    };

var splitVideo = new awsS3Video(cfg);	
splitVideo.split('_type', '_file', 
      function(data) {
        res.send(data);
      }
  );

