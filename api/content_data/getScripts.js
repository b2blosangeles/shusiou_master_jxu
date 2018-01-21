var CP = new pkg.crowdProcess(), _f = {};
var data_folder = env.site_contents_path + '/script/';

var param_lang = req.body.lang, param_group = req.body.group;

var cmd = req.body['cmd'] || req.param('cmd');

var unique = function(xs) {
  return xs.filter(function(x, i) {
    return xs.indexOf(x) === i
  })
}
var getValue = function(result0) {
   var result = {}, err = {}, langs = [];
   for(o in result0) {
       if (!result0[o].err) {
            result[o] = result0[o];
       } else [
            err[o] = result0[o].err.message;
       }
   }
   for(o in result) {
      langs[langs.length] = result[o].lang.code;
   }  
   langs = unique(langs);
   switch(cmd) {
        case 'getAll':
            res.send(langs); 
            break; 
            /*
             var l = {};
             for(o in result) {
                l[result[o].lang.code] = true;
            }
             var j = {};
             for(o in result) {
                var lang = result[o].lang.code;
                if (!j[lang]) j[lang] = [{id:o, desc:result[o].desc}];
                else j[lang][j[lang].length] = {id:o, desc:result[o].desc}; 
            }            
            res.send({langs:Object.keys(l), langScripts: j , result:result});  
            break; 
            */
        case 'getLangs':
             var j = {};
             for(o in result) {
                j[result[o].lang.code] = true;
            }
            res.send(Object.keys(j));  
            break;
        case 'getLangScripts':
             var j = {};
             for(o in result) {
                var lang = result[o].lang.code;
                if (!j[lang]) j[lang] = [{code:o, desc:result[o].desc}];
                else j[lang][j[lang].length] = {code:o, desc:result[o].desc}; 
            }
            res.send(j);  
            break;
        case 'getScriptByCode':
             for(o in result) {
                 if (o === req.param('code')) {
                      res.send(result[o]);
                      break;
                 }
            }
            res.send('No id ' + code);  
            break;             
        default:
            res.send('Wrong opt');
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
