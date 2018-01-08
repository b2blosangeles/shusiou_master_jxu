var CP = new pkg.crowdProcess(), _f = {};
var data_folder = env.site_contents_path + '/data/';
var fn = env.site_contents_path + '/data/cn/home_page/how_i_studied';

_f['langs'] = function(cbk) {
    pkg.fs.readdir(data_folder, (err, files) => {
      cbk(files)
    });
}
_f['files'] = function(cbk) {
    var langs = CP.data.langs;
    var CP1 = new pkg.crowdProcess(), _f1 = {};
    for (var i = 0; i < langs.length; i++) {
        _f1[langs[i]] = function(cbk1) {
            var lang_folder = data_folder + langs[i] + '/';
            pkg.fs.readdir(lang_folder, (err, files) => {
              cbk1(lang_folder);
            });
        }
    }    
    CP1.serial(_f1, function(data) {
         cbk(data);
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
