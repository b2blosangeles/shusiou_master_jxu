var CP = new pkg.crowdProcess(), _f = {};
var fn = env.site_contents_path + '/data/cn/home_page/how_i_studied';

_f['S0'] = function(cbk) {
    pkg.fs.readdir(testFolder, (err, files) => {
      files.forEach(file => {
        //console.log(file);
      });
        cbk(files)
    })
}
CP.serial(
  _f,
  function(data) {
   
    pkg.fs.readFile(fn, 'utf8', function(err, contents) {
      res.send(contents);
    });
    
  
    
  },
  3000
);
