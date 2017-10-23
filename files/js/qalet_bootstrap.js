if (!_QALET_) var _QALET_={_p:0, data:{}, _Q:{}, _newlet:{}, _d:{}};
_QALET_.cfg = {};
$(document).ready(	
	function() {	
		var _p = $("script[src$='/qalet_bootstrap.min.js']");
		if (!_p[0]) _p = $("script[src$='/qalet_bootstrap.js']");
		
	//	_QALET_.cfg.app = _p[0].src.replace(/\/qalet\_bootstrap(|\.min)\.js/, '/wordpress_plugin.jsx');
	//	_QALET_.cfg.css = _p[0].src.replace(/\/qalet\_bootstrap(|\.min)\.js/, '/wordpress_plugin.css');
	//	comment as not necessary setup default app jsx an css
		_QALET_.customStyle = function (o) {
			return function(data){
				try {
					if (o.css.data) {
						jSmart.prototype.left_delimiter = '[';
						jSmart.prototype.right_delimiter = ']';														
						var tpl = new jSmart(data);
						data = tpl.fetch(o.css.data);
					} 	
					var v = UIQALET.css.parse(data.replace(/\}([\;|\s]*)/g, '} '));	
					UIQALET.css.ruleSelect(v.stylesheet,'.'+o.id);
					$('head').append('<style>'+UIQALET.css.stringify(v)+'</style>');	
				} catch (err) {
					console.log(err.message);
				}							
			}
		}; 
		_QALET_.callback = function() {
			if (Object.keys(_QALET_._newlet).length) {	
				for (var v in _QALET_._newlet) {
					var o = _QALET_.data[v];
					if ((o.css) && (o.css.link)) {
						$.get(o.css.link, _QALET_.customStyle(o));
					}
					if (typeof _QALET_._Q[o.module] == 'function') {
						_QALET_._d[_QALET_._newlet[v][2]] = true;	
						delete _QALET_._newlet[v];
						_QALET_._Q[o.module](o);				
					} 
				}	
				for (var v in _QALET_._newlet) {
					if (typeof _QALET_._Q[_QALET_._newlet[v][1]] != 'function') {
						if (_QALET_._d[_QALET_._newlet[v][2]]) {
							delete _QALET_._newlet[v];
						}
					}
				}
			}	
		};
		_QALET_.loadLet = function() {
			var v = $('QALET'), _sobj = {}; 
			for (var o in _QALET_._newlet) {
				if (new Date().getTime() - _QALET_._newlet[o][0] > 6000) {
					console.log(_QALET_._newlet[o][2] + ' timeout or undefined ' + _QALET_._newlet[o][1] + '. It might cause performance issue.');
					delete  _QALET_._newlet[o];
				}
			}
			if (Object.keys(_QALET_._newlet).length) {
				return false;
			}
			for (var i = 0; i < v.length; i++) {
				_QALET_._p++;
				var data = $(v[i]).html();
			//	console.log(data);
				if (!data)  continue;
				try {
					var o = JSON.parse(data.replace(/(“|”)/ig, '"'));	
				} catch (err) {
					$(v[i]).replaceWith('<div style="color:red">Error, check console for details.</div>');
					console.log('Wrong JSON format:'+ data + ' as "' + err.message );
					continue;
				}
				
				if (!o.module) {
					$(v[i]).replaceWith('<div style="color:red">Error, check console for details.</div>');
					console.log('Miss module on '+ data);
					continue;
				}
				
				if (!o.app) {
					if (!_sobj[_QALET_.cfg.app]) _sobj[_QALET_.cfg.app] = {};
				} else {
					if (!_sobj[o.app]) _sobj[o.app] = {};
				}
				_sobj[(!o.app)?_QALET_.cfg.app:o.app][o.module] = o;
				o.id = o.module + '_plugin_' + _QALET_._p;
				
				_QALET_.data[o.id] = o;
				_QALET_._newlet[o.id] = [new Date().getTime(), o.module, (!o.app)?_QALET_.cfg.app:o.app];
				$(v[i]).replaceWith('<div class="class_' + o.module +' '+o.id+'"></div>');
				// $('.'+o.id).hide();
			}
			if (Object.keys(_sobj).length) {
				for(var os in _sobj) {
					var osr = _sobj[os];
					var l = Object.keys(osr).join(',');
					var csslink = os.replace(/\.(js|jsx)$/, '.css') +'?plus='+l;
				//	console.log('---'+os+'---');
					var jslink = os +'?plus='+l;
					$('<link rel="stylesheet" type="text/css" href="'+ csslink +'" />').appendTo("head");
					$.getScript( jslink,
						function( data, textStatus, jqxhr ) {
							_QALET_.callback();
						});
				}
			} else  _QALET_.callback();		
		};
		
		_QALET_.loadLet();
		setInterval(_QALET_.loadLet, 200);			
	}
);
