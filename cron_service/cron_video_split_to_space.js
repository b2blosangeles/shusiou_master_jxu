/* ---  This cron is to appoint node for video. add record link only */
/* ---  chennel only related with user video, not related with video only */
var path = require('path');
var env = {root_path:path.join(__dirname, '../..')};
env.site_path = env.root_path + '/site';
env.site_path = env.root_path + '/site';
env.config_path = '/var/qalet_config';

var config = require(env.config_path + '/config.json');

var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
    crowdProcess =  require(env.root_path + '/package/crowdProcess/crowdProcess'),
    cfg0 = config.db,
    fs = require('fs');

console.log(config);
