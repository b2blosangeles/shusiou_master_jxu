var CP = new pkg.crowdProcess(), _f = {};
var data_folder = env.site_contents_path + '/data/';
var fn = env.site_contents_path + '/data/cn/home_page/how_i_studied';

_f['langs'] = function(cbk) {
    pkg.fs.readdir(data_folder, (err, files) => {
      cbk(files)
    });
}
_f['files'] = function(cbk) {
    pkg.fs.readdir(data_folder, (err, files) => {
        var CP1 = new pkg.crowdProcess(), _f1 = {};
        for (var i = 0; i < files.length; i++) {
            _f1 = function(cbk1) {
                cbk1(files[i])
            }
        }
        CP1.serial(_f1, function(data) {
             cbk(data)
        });
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
