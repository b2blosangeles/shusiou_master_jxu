var mysql = require(env.site_path + '/api/inc/mysql/node_modules/mysql'),
config = require(env.config_path + '/config.json'),
cfg0 = config.db;
let ips = [];
var str = 'SELECT * from `curriculum_sections` WHERE 1 LIMIT 1 ';
var connection = mysql.createConnection(cfg0);
connection.connect();
connection.query(str, function (error, results, fields) {
  connection.end();
  if (error) {
    return true;
  } else {
    if (results) {
      for (var i = 0; i < results.length; i++) {
      //  ips[ips.length] =  results[i].node_ip;
      }
    } else {
    }

  }
  
  
  res.send(results);
});
