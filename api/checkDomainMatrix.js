
  let ips = env.dns_matrix;
  
  let mp = {};
  for (o in ips) {
    mp[ips[o]] = parseInt(o) + 1; 
  }
  
  res.send(env);
