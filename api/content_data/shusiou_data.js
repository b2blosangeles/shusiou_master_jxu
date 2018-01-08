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
    },1000); 
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
    },1000);
}
_f['contents'] = function(cbk) {
    var files = CP.data.fds;
    var CP1 = new pkg.crowdProcess(), _f1 = {};
    for (var i = 0; i < files.length; i++) {
        _f1[files[i]] = (function(i) {
            var file = files[i];
            return function(cbk1) {
                pkg.fs.readFile(file, 'utf-8', (err, contents) => {
                    cbk1(contents);
                });
            }
        })(i);        
    }
    CP1.serial(_f1, function(data) {
        var list = {};
        for (var i = 0; i < files.length; i++) {
            list[files[i].replace(env.site_contents_path + 'data/' + '')] = data.results[files[i]];
        }
        cbk(list);
    },1000);
}
CP.serial(
  _f,
  function(data) {
    res.send(data.results.contents);
  },
  6000
);
