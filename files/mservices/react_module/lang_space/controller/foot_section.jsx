
try {
	var Footsection =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {};
		},
		roleMenu: function()  {
			var me = this;
			var m = [ 
				{code:'menu_aboutus', role:[], router:'#/Doc/Aboutus'},
				{code:'menu_contact', role:[], router:'#/Doc/Contact'},
				{code:'menu_qna', role:[], router:'#/Doc/QNA'},
				{code:'menu_help', role:[], router:'#/Doc/Help'}
				//,
				//{code:'menu_testimony', role:[], router:'#/Doc/Testimony'}
			];		
			
			return m.map(function (item, key) {
				 if  (item.role.indexOf(me.props.env.state.c_role) !== -1 || !item.role.length)
					return <span>
						<a href={item.router}>{me.dictionary(item.code)}</a>
						<span dangerouslySetInnerHTML={{__html:(key<(m.length-1))?'&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;': ''}}></span>
					</span>
						
			});		
		},		
		dictionary: function(v) {
			return this.props.env.dictionary(v);	
		},
		componentDidMount:function() {
			var me = this;
			setInterval(
				function() {
					me.monitorBody();
				}, 100
			);
			me.adjustFootSize($('.content_bg'));
			
			window.addEventListener("hashchange", function() {
				me.monitorBody('hashchange');
				console.log('changed');
				me.setState({hash:window.location.hash});
			}, false);
			window.addEventListener("resize", function() {
				me.monitorBody("resize");
				console.log('resized');
				me.setState({size:new Date().getTime()});
			}, false);
			
		},
		componentDidUpdate:function(prevProps, prevState) {
			var me = this;	
			me.adjustFootSize($('.content_bg'));
		},
		
		monitorBody:function() {
			var me = this;	
			return false;
			var w = 0, h = 0;
			if( typeof( window.innerWidth ) == 'number' ) {
				//Non-IE
				w = window.innerWidth;
				h = window.innerHeight;
			} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
				//IE 6+ in 'standards compliant mode'
				w = document.documentElement.clientWidth;
				h = document.documentElement.clientHeight;
			} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
				//IE 4 compatible
				w = document.body.clientWidth;
				h = document.body.clientHeight;
			}
			if (me.state.w != w || me.state.h != h ) {
				me.setState({w: w, h:h});
			}
		},
		
		adjustFootSize:function(o) {
			return false;
			// console.log('adjustFootSize===');
			var me = this;
			var w = me.state.w, h = me.state.h, h2 = Math.round(me.state.h * 0.5);
			var header_h = $('.header_section').height();
			var footer_h = $('.foot_nav').height();
			var vh =0;
			if (!isNaN(h)) {
				if ($('.content_bg').find('video')) {
					vh = Math.floor(w * 9 / 16);
				}
				if (vh) {
					if (vh > h) {
						$('.content_section').css("min-height", h-footer_h-header_h - 40);
					//	$('.site_foot').height(h2);
					} else {
						$('.content_section').css("min-height", vh - header_h - 80);
						//$('.site_foot').height(footer_h + h - vh -60);
					//	$('.site_foot').height(h2);
					}					
				}  else {
					/*
					var min_h =  h - header_h - footer_h - 40;
					$('.content_section').css("min-height", min_h);	
					var rel_h = Math.max(min_h, vh);
					var d = rel_h + header_h + footer_h - h;
					if (d > 0) {
						$('.site_foot').height( footer_h + d + header_h + 80);
					}
					*/
				}
			}
		},		
		render: function() {
			var me = this;
			return (
			<div className="site_foot navbar-fixed-bottom">
				<div className="container foot_nav">
					<div className="row">
						{me.roleMenu()}
						
						<span className="pull-right">
							<span>&copy;  {me.dictionary('virtual_language_lab')} {new Date().getFullYear()}</span>
							<span>&nbsp;&nbsp;&nbsp;<a href="#/Doc/Privacy">{me.dictionary('menu_privacy')}</a></span>
							<span>&nbsp;&nbsp;<a href="#/Doc/Terms">{me.dictionary('menu_terms')}</a></span>
						</span>
					</div>
					<div className="row"></div>					
				</div>			
			</div>
			)
		}	
	});	
} catch (err) {
	console.log(err.message);
}
