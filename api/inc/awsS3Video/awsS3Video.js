(function () { 
	var obj =  function (config, env, pkg) {
		this.run = function(_cbk) {
			let me = this;
			var CP = new pkg.crowdProcess();
			var _f = {};	
			
			_f['ip']  = function(cbk) {
			    pkg.fs.readFile('/var/.qalet_whoami.data', 'utf8', function(err,data) {
				if ((err) || !data) {
					cbk(false); CP.exit = 1;		
				} else {
					cbk(data.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' '));
				}
			    });
			};
			_f['db_video']  = function(cbk) { /* get database catched local videos */
				var connection = pkg.mysql.createConnection(config.db);
				connection.connect();
				var str = "SELECT A.*, B.`status` FROM `video` A LEFT JOIN `video_space` B ON A.`vid` = B.`vid`" +
					" WHERE A.`server_ip` = '" + CP.data.ip + "' AND B.`status` < 1 OR B.`status` IS NULL " +
					" ORDER BY `status` DESC LIMIT 3";
				
				connection.query(str, function (error, results, fields) {
					connection.end();
					if (error || !results.length) {
						cbk(false); CP.exit = 1;
					}
					cbk(results[0]);
				});
			};
			_f['get_vid']  = function(cbk) { 
				let vid = CP.data.db_video.vid, status = CP.data.db_video.status;
				if (status === null) {
					var connection = pkg.mysql.createConnection(config.db);
					connection.connect();
					var str = "INSERT INTO `video_space` (`vid`, `status`, `added`) VALUES " +
						" ('" + vid + "', 0, NOW()) ON DUPLICATE KEY UPDATE `status` = `status` ";

					connection.query(str, function (error, results, fields) {
						connection.end();
						cbk(vid);
					});
				} else {
					cbk(vid);
				}
			};
			_f['get_video_name']  = function(cbk) { 
				let vid = CP.data.get_vid, 
				    mnt_folder = '/mnt/shusiou-video/',
				    video_folder = mnt_folder + 'videos/',
				    _file = video_folder + vid + '/video/' + vid;
				
				me.vid = vid;
				
				pkg.fs.stat(_file, function(err, stat) {
					if (err) {
						pkg.exec('cp -f ' + video_folder + vid + '/video/video.mp4 ' +  _file, 					 
							function(err, stdout, stderr) {
								cbk(_file);
							});
					} else {
						cbk(_file);
					}
				});	
				
				
			};
			_f['split_video']  = function(cbk) { 
				let _file = CP.data.get_video_name;
				let _p = CP.data.get_video_name.match(/(.+)\/([^\/]+)$/);
				
				me.source_path = _p[1] + '/';
				me.source_file = _p[2];
				
				me.space_id = 'shusiou-d-01';
				me.space_url = 'https://shusiou-d-01.nyc3.digitaloceanspaces.com/';
				me.space_info = 'shusiou/' + me.source_file + '/_info.txt';

				pkg.request(me.space_url +  me.space_info, 
				function (err, res, body) {
					let v = (err) ? false : {};
					if (v !== false) { 
						try {  v = JSON.parse(body); } catch (e) { v = false; }
					}
					/*
					if (!v || !v.status || !v.status._t) {
						me.split('_t', _file, cbk);
					} else if (!v.status._s) {
						me.split('_s', _file, cbk);
					*/
	
					if (!v || !v.status || !v.status._s || !v.status._t) {
						let CP_A = new pkg.crowdProcess(), _fA = {};
						_fA['_s'] = function (cbks) {
							me.split('_s', _file, cbks);
						}
						_fA['_t'] = function (cbks) {
							me.split('_t', _file, cbks);
						}						
						
						CP_A.parallel(
							_fA,
							function(results) {
								cbk(results);
							},
							58000
						);											
				
					} else {
						me.doneDBVideoStatus(v, function() {
							cbk('This video has been processed.' + me.vid) 
						});
						
					}
				});
			};			
			CP.serial(
				_f,
				function(result) {
					_cbk(result);
				},
				59000
			);	
			return true;
			

		}
		this.doneDBVideoStatus = function(v, cbk) {
			let me = this;
			if ((v) && (v.status) && (v.status._t) && (v.status._s)) {
				var connection = pkg.mysql.createConnection(config.db);
				connection.connect();
				var str = "INSERT INTO `video_space` (`vid`, `status`, `added`) VALUES " +
					" ('" + me.vid + "', 1, NOW()) ON DUPLICATE KEY UPDATE `status` = 1 ";

				connection.query(str, function (error, results, fields) {
					connection.end();
					cbk(v);
				});
			} else {
				cbk(v);
			}
		}		
		this.split = function(_type, _file, _cbk) {
			let me = this;
			let _p = _file.match(/(.+)\/([^\/]+)$/);
			me.source_path = _p[1] + '/';
			me.source_file = _p[2];
			
			me.space_id = 'shusiou-d-01';
			
			me.space_url = 'https://shusiou-d-01.nyc3.digitaloceanspaces.com/';
			me.space_info = 'shusiou/' + me.source_file + '/_info.txt';
			
			me.trunkSize = 1024 * 1024;			
			
			let tmp_folder = '/var/shusiou_cache/tmpvideo/' + me.source_file + '/' + _type + '/';
			let space_dir = 'shusiou/' + me.source_file + '/' + _type + '/';
			let tm = new Date().getTime();
			
			var CP = new pkg.crowdProcess();
			var _f = {}; 

			_f['videoinfo'] = function(cbk) { 
				pkg.request(me.space_url +  me.space_info, 
				function (err, res, body) {
					let v = (err) ? false : {};
					if (v !== false) { 
						try {  v = JSON.parse(body); } catch (e) { v = false; }
					}
					if (v === false) { 
						let buff = new Buffer(100);
						pkg.fs.stat(me.source_path + me.source_file, function(err, stat) {
							if (err) {
								CP.exit = 1;
								cbk(err.message);
								return true;
							}
							pkg.fs.open(me.source_path + me.source_file, 'r', function(err, fd) {
								pkg.fs.read(fd, buff, 0, 100, 0, function(err, bytesRead, buffer) {
									if (err) {
										CP.exit = 1;
										cbk(err.message);
										return true;
									}									
									var start = buffer.indexOf(new Buffer('mvhd')) + 17;
									var timeScale = buffer.readUInt32BE(start, 4);
									var duration = buffer.readUInt32BE(start + 4, 4);
									var movieLength = Math.floor(duration/timeScale);
									var v = {filesize:stat.size,time_scale:timeScale, trunksize: me.trunkSize,
										duration: duration, length:movieLength};
									me.writeInfo(v, function() {
										cbk(v);
									});
								});
							});
						});		
					} else {
						cbk(v);
					}
				});		
			};
			
			_f['tracks'] = function(cbk) {
				if (CP.data.videoinfo === false) {
					cbk('no videoinfo');
				} else {
					var folderP = require(env.site_path + '/api/inc/folderP/folderP');
					var fp = new folderP();		
					fp.build(tmp_folder, () => {
						pkg.fs.readdir( tmp_folder, (err, files) => {
							if (_type === '_t')
								var condition = (files.length != Math.ceil(CP.data.videoinfo.filesize / me.trunkSize));
							else if (_type === '_s')
								var condition = (files.length != Math.ceil(CP.data.videoinfo.length / 5));
							else var condition = false;

							if (err || condition) {
								me.splitVideo(_type, tmp_folder, function(data) { cbk(data); });
							} else {
								cbk(files);					
							}
						});			

					});
				}
			};
			
			_f['space'] = function(cbk) { 
				var params = { 
				  Bucket: me.space_id,
				  Delimiter: '',
				  Prefix: space_dir
				}, v = {};

				me.s3.listObjects(params, function (err, data) {
					if(err)cbk(err.message);
					else {
						for (var o in data.Contents) {
							let key = data.Contents[o].Key.replace(space_dir, '');
							v[key] = data.Contents[o].Size;
						}
						cbk(v);
					}
				});
			}
			
			_f['clean_space'] = function(cbk) { 
				let tracks = CP.data.tracks, objs = Object.keys(CP.data.space);
				let diff = objs.filter(x => !tracks.includes(x));
				if (diff.length) {
					CP.exit = 1;
					me.removeObjects(space_dir, diff, cbk);
				} else {
					cbk(true);
				}
			}
			
			_f['upload'] = function(cbk) { 
				let tracks = CP.data.tracks;
				if (typeof tracks === 'string') {
					cbk(tracks);
					CP.exit = 1;
					return true;
				} 
				let objs = CP.data.space;
				let CP1 = new pkg.crowdProcess(), _f1 = {};
				

				let uploaded = 0;

				for (var t in tracks) {
					_f1['P_' + t] = (function(t) { 
						return function(cbk1) {
							if (new Date().getTime() - tm > 40000) {
								CP1.exit = 1;
								cbk1(true); return true;
							}
							pkg.fs.stat( tmp_folder + tracks[t], function (err, stat) {
								if (stat.size !== objs[tracks[t]] || !objs[tracks[t]]) {
									pkg.fs.readFile( tmp_folder + tracks[t], function (err, data0) {
									  if (err) { throw err; }
									     var base64data = new Buffer(data0, 'binary');
									     var params = {
										 Body: base64data,
										 Bucket: me.space_id,
										 Key: space_dir + tracks[t],
										 ContentType: 'video/mp4',
										 ACL: 'public-read'
									     };	
									     me.s3.putObject(params, function(err, data) {
										 if (err) cbk1(err.message);
										 else {
											 uploaded++;
											 cbk1(tracks[t])
										 }	 
									     });
									});					
								} else {
									cbk1('Skip ' + tracks[t]);
								}
							});
						}
					})(t);			
				}
				CP1.serial(
					_f1,
					function(results) {
						if (!uploaded) {
							if (Object.keys(CP.data.space).length == CP.data.tracks.length && (CP.data.tracks.length)) {
								let v = CP.data.videoinfo;
								v[_type] = tracks; 
								if (!v['status']) v['status'] = {}; 
								v['status'][_type] = 1;						
								me.writeInfo(v, function() {
									cbk(true);
								});
							} else {
								cbk(false);
							}

						}
					},
					45000
				);
			}	
			CP.serial(
				_f,
				function(results) {
					_cbk(results);
				},
				58000
			);			
			
		};
		this.init = function() {
			let me = this;
			const AWS = require(env.site_path + '/api/inc/aws-sdk/node_modules/aws-sdk')
			me.s3 = new AWS.S3({
			    endpoint: new AWS.Endpoint('nyc3.digitaloceanspaces.com'),
			    accessKeyId: config.objectSpaceDigitalOcean.accessKeyId,
			    secretAccessKey: config.objectSpaceDigitalOcean.secretAccessKey
			});
			
		}
		
		this.writeInfo = function(v, cbk) {
			let me = this,
			    params = {
				Body: JSON.stringify(v),
				Bucket: me.space_id,
				Key: me.space_info,
				ContentType: 'text/plain',
				ACL: 'public-read'
			};	

			me.s3.putObject(params, function(err, data) {
				if (err) cbk(false);
				else  me.doneDBVideoStatus(v, cbk);
			});		
		}
		this.removeObjects = function(folder, list, callback) {
			let me = this;
			var params = {
				Bucket: me.space_id,
				Delete: {Objects:[]}
			};		
			for (var i = 0; i < Math.min(list.length,100); i++) {
				params.Delete.Objects.push({Key: folder + list[i]});
			};
			me.s3.deleteObjects(params, function(err, d) {
				if (err) return callback(err);
				else callback(d);
			});
		}
		this.splitVideo = function(_type, tmp_folder, cbk) {
			let me = this;
			switch(_type) {
				case '_t':
					pkg.exec('rm -f ' + tmp_folder + '* ' + ' && rm -f ' + tmp_folder + '*.* ' +
						 '&& split -b ' + me.trunkSize + ' ' + me.source_path +  me.source_file +  ' ' + tmp_folder + '', 					 
						function(err, stdout, stderr) {
							if (err) {
								cbk(err.message);
							} else {
								pkg.fs.readdir( tmp_folder, (err1, files) => {
									cbk((err1) ? err1.message : files);
								});			
							}
						});
					break;
				case '_s':
					pkg.exec('ffmpeg -i ' + me.source_path +  me.source_file + 
						 ' -c copy -map 0 -segment_time 5 -reset_timestamps 1 -f segment ' + tmp_folder + 's_%d.mp4', 					 
						function(err, stdout, stderr) {
							if (err) {
								cbk(err.message);
							} else {
								pkg.fs.readdir( tmp_folder, (err1, files) => {
									cbk((err1) ? err1.message : files);
								});			
							}
						});
					break;	
				default:
					cbk('Missing _type');
			}		
		}		
		
		this.init();
	};
	module.exports = obj;
})();
