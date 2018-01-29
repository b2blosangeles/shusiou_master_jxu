var CP = new pkg.crowdProcess(), _f = {};
var data_folder = env.site_contents_path + '/script/';

let code = req.body.code || req.param('code'), 
    lang = req.body.lang || req.param('lang') || 'en', 
    group = req.body.group,
    cmd = req.body.cmd || req.param('cmd'),
    // patt = /(\$answer|\$track|\$description)/g; 
    patt = ['track', 'answer','description'],
    patt_result = [];

var getValue = function(result0) {
   let result = {}, err = null, langs = [], list = [];
   for(o in result0) {
       if (!result0[o].err) {
            result[o] = result0[o];
       } else {
            if (!err) {
               err = [];
            }   
            err[err.length] = {id:o, message:result0[o].err};
       }
   }
   for(o in result) {
      langs[langs.length] = result[o].lang.code;
   }  
   langs = langs.filter((v, i, a) => a.indexOf(v) === i);
   
   for(o in result) {
        if (!code || (langs.indexOf(code) !==-1 && code == result[o].lang.code)) {
            list[list.length] = {id:o, lang:result[o].lang.code, description:result[o].description[lang]};
        }
    }    
   switch(cmd) {
        case 'getAll':
            res.send({langs:langs, list:list, scrips:result, err:err}); 
            break; 
        case 'getScriptById':
             for(o in result) {
                 if (o === req.param('id')) {
                      res.send(result[o]);
                      break;
                 }
            }
            res.send('No id ' + id);  
            break;             
        default:
            res.send('Wrong opt');
    }
};


_f['script'] = function(cbk) {
    pkg.fs.readdir(data_folder, (err, files) => {
         cbk(files);
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
                        let c = contents.replace(/(\n|\r)+$/, '');
                        for (var j = 0; j < patt.length; j++) {
                            let dola_patt = '/\$'+patt[j]+'/';
                            var patt_j = new RegExp(dola_patt);
                            if (patt_j.test(c)) {
                                patt_result[patt_result.length] = patt[j];
                            }
                        }
                        v = JSON.parse(c);
                        v.variables = patt_result;
                        // v.variables = c.match(patt);
                        if (v.variables) {
                            v.variables = v.variables.filter((v, i, a) => a.indexOf(v) === i);
                        }    
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
