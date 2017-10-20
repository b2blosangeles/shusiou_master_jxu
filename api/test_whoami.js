pkg.request({
  url: 'http://root.qalet.com/api/whoami.js',
  headers: {
      "content-type": "application/json"
  }
    }, function (error, resp, body) { 
       res.send(body);
   });
