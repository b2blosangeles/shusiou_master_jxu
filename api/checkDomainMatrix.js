
  let ips = env.matrix;
  
  let mp = {};
  for (o in ips) {
    mp[ips[o]] = parseInt(o) + 2; 
  }
  
  res.send(mp);
});

