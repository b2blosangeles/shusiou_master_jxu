var CP = new pkg.crowdProcess(), _f = {};

_f[] = function(cbk) {
    pkg.fs.readFile('/var/.qalet_whoami.data', 'utf8', function(err,data) {
      var ips = CP.data.IPS;
      if ((data) && ips.indexOf(data) != -1)  cbk(data);
      else { cbk(false); CP.exit = 1; }
    });	  
}
CP.serial(
  _f,
  function(data) {
    var fn = env.site_contents_path + '/data/cn/home_page/how_i_studied';
    pkg.fs.readFile(fn, 'utf8', function(err, contents) {
      res.send(contents);
    });
    
  
    
  },
  3000
);
