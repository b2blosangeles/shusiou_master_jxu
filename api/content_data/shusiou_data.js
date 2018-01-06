var CP = new pkg.crowdProcess(), _f = {};
var data_folder = env.site_contents_path + '/data/';
var fn = env.site_contents_path + '/data/cn/home_page/how_i_studied';

_f['S0'] = function(cbk) {
    pkg.fs.readdir(data_folder, (err, files) => {
        /*      
        files.forEach(file => {
        //console.log(file);
        });
        */
      cbk(files)
    });
}
CP.serial(
  _f,
  function(data) {
    res.send(data);
      return true;
    pkg.fs.readFile(fn, 'utf8', function(err, contents) {
      res.send(contents);
    });
    
  
    
  },
  3000
);
