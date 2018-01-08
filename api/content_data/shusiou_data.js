var CP = new pkg.crowdProcess(), _f = {};
var data_folder = env.site_contents_path + '/data/';
var fn = env.site_contents_path + '/data/cn/home_page/how_i_studied';

_f['langs'] = function(cbk) {
    pkg.fs.readdir(data_folder, (err, files) => {
      cbk(files)
    });
}
_f['fd'] = function(cbk) {
    var langs = CP.data.langs;
    var CP1 = new pkg.crowdProcess(), _f1 = {};
    for (var i = 0; i < langs.length; i++) {
        _f1[langs[i]] = (function(i) {
            var lang_folder = data_folder + langs[i] + '/';
            return function(cbk1) {
                pkg.fs.readdir(lang_folder, (err, files) => {
                    var list = [];
                   for (var j = 0; j < files.length; j++) {
                        list[list.length] = lang_folder + files[j];
                   }
                    cbk1(list);
                });
            }
        })(i);
    }    
    CP1.serial(_f1, function(data) {
        var list = [];
        for (var i = 0; i < langs.length; i++) {
            list = list.concat(data.results[langs[i]])
        }
         cbk(list);
    },3000); 
}
_f['fds'] = function(cbk) {
    var fds = CP.data.fd;
    var CP1 = new pkg.crowdProcess(), _f1 = {};
    for (var i = 0; i < fds.length; i++) {
        _f1[fds[i]] = (function(i) {
            var folder = fds[i];
            return function(cbk1) {
                pkg.fs.readdir(folder, (err, files) => {
                    var list = [];
                   for (var j = 0; j < files.length; j++) {
                        list[list.length] = folder + '/' + files[j];
                   }
                    cbk1(list);
                });
            }
        })(i);        
    }
    CP1.serial(_f1, function(data) {
        var list = [];
        for (var i = 0; i < fds.length; i++) {
            list = list.concat(data.results[fds[i]])
        }
        cbk(list);
    },3000);
}

CP.serial(
  _f,
  function(data) {
    res.send(data.results.fds);
      return true;
    pkg.fs.readFile(fn, 'utf8', function(err, contents) {
      res.send(contents);
    });
    
  
    
  },
  6000
);
