var CP = new pkg.crowdProcess(), _f = {};
var data_folder = env.site_contents_path + '/script/';

var param_lang = req.body.lang, param_group = req.body.group;

var code = req.param('code');

var getValue = function(result) {
    var keys = {};
    switch(code) {
        case 'getLangs':
             for(o in result) {
                keys[o] = result[o].lang.code;
            }
            res.send(keys);  
            break;
        default:
            res.send('Wrong code');
    }
};


_f['script'] = function(cbk) {
    pkg.fs.readdir(data_folder, (err, files) => {
      if (!param_lang || !param_lang.length) {
          cbk(files);
      } else {
          cbk(intersect(param_lang, files));  
      }
    });
}
_f['contents'] = function(cbk) {
    var files = CP.data.script;
    var CP1 = new pkg.crowdProcess(), _f1 = {};
    for (var i = 0; i < files.length; i++) {
        _f1[files[i]] = (function(i) {
            var file = files[i];
            return function(cbk1) {
                pkg.fs.readFile( data_folder  + file, 'utf-8', (err, contents) => {
                    var v = {};
                    try {
                        v = JSON.parse(contents.replace(/(\n|\r)+$/, ''));
                    } catch (e) {
                        v = {err:e.message};
                    }
                    cbk1(v);
                });
            }
        })(i);        
    }
    CP1.serial(_f1, function(data) {
        var list = {};
        for (var i = 0; i < files.length; i++) {
            list[files[i]] = data.results[files[i]];
        }
        cbk(list);
    },1000);
}

CP.serial(
  _f,
  function(data) {
        getValue(data.results.contents);
  },
  6000
);
function intersect(a, b) {
    var d = {};
    var results = [];
    for (var i = 0; i < b.length; i++) {
        d[b[i]] = true;
    }
    for (var j = 0; j < a.length; j++) {
        if (d[a[j]]) 
            results.push(a[j]);
    }
    return results;
}
