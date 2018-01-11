try {
	var DocviewPage =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {};
		},
		dictionary:function(v) {
			if (!this.props.route || !this.props.route.env ||!this.props.route.env.dictionary) return v;
			return this.props.route.env.dictionary(v);
		},
		componentDidMount:function() {
			var me = this;	
			me.setState({});
		},	
		componentDidUpdate:function(prevProps, prevState) {
			var me = this;
			if (prevProps.route.env.state.c_lang == me.state.lang && me.props.params.code == me.state.docid) return true;
			me.loadDocument(me.props.params.code, prevProps.route.env.state.c_lang)	

		},
		loadDocument:function(code, lang) {
			var me = this;
			var url = '/api/doc/viewdoc.api';
			$.ajax({url: url, data:{code:code, lang:lang},
				dataType:'json', 
				method:'POST',
				success: function(data,status,xhr){
					me.setState({
						lang:lang,
						docid:code, title:data.title, body: data.body}, function() {
					});
				},
				error: function(xhr,status,error){
					me.setState({
						lang:lang,
						docid:code, title:data.title, body: 'Error to access '+url}, function() {
					});
				}
			});				
			var url0 = 'http://shusiou.com/api/doc/viewdoc.api';
			$.ajax({url0: url, data:{code:code, lang:lang},
				dataType:'json', 
				method:'POST',
				success: function(data,status,xhr){
					me.setState({
						lang:lang,
						docid:code, title:data.title, body: data.body}, function() {
					});
				},
				error: function(xhr,status,error){
					me.setState({
						lang:lang,
						docid:code, title:data.title, body: 'Error to access '+url}, function() {
					});
				}
			});	
		},		
		render: function() {
			var me = this;		
			return (
				<div className="content_section">
					<div className="container">
						<div class="row">
							<div className="col-sm-12 col-lg-12 col-md-12"> 
								<div className="overlayer_box editor_box">
								  <h3 className="display-3">{me.dictionary(me.state.title)}</h3>
								  <p className="lead"></p>
								  <hr className="my-4"/>
								{/*
								  <p>=={me.props.route.doc}==>{me.props.params.code}-{me.state.title}</p>
								*/}  
								<p dangerouslySetInnerHTML={{__html: me.state.body}} />									</div>	
							</div>								
						</div>
					</div>	
					<div className="content_bg opacity_bg"></div>
				</div>					
				
			  );
		}	
	});	
} catch (err) {
	console.log(err.message);
}
