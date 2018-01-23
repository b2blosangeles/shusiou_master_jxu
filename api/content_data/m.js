let v = 'ws{$script}$section';
let u = v.match(/(\$script|\$section)/g);
res.send(u);
