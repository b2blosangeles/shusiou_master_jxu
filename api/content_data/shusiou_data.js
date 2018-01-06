var CP = new pkg.crowdProcess(), _f = {};
var fn = env.site_contents_path + '/data/cn/home_page/how_i_studied';
pkg.fs.readFile(fn, 'utf8', function(err, contents) {
  res.send(contents);
});
