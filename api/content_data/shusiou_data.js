res.writeHead(200,{'Content-Type':'text/plain'})
res.sendFile(env.site_contents_path + '/data/cn/home_page/how_i_studied');
