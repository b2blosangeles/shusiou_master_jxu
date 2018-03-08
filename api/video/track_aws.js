  let awsS3Video = require(env.site_path + '/api/inc/awsS3Video/awsS3Video.js'),
  cfg = {
    id:'shusiou-d-01',
    endpoint : 'nyc3.digitaloceanspaces.com',
    accessKeyId: 'QYF3ENCI4TEDFDWFBS6N',
    secretAccessKey: '7DJD8b9iAqD5qsLgRZH9OXfgOQMob/edWouwiqYeOwI'	
  };

  var splitVideo = new awsS3Video(cfg);	
  splitVideo.split('_type', '_file', 
      function(data) {
        res.send(data);
      }
  );
