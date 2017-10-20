pkg.request({
  url: 'http://root.qalet.com/api/whoami.js',
  headers: {
    "content-type": "application/json"
  },
  data:{ip:1234}
}, function (error, resp, body) { 
  res.send(body);
});
