try {
	var Breakpoints =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {};
		},
		componentDidUpdate:function(prevProps, prevState) {
			var me = this;
			if (!me.props.env) return true;
			if (me.props.env.state.Breakpoint != me.state.Breakpoint) {
				me.props.env.setState({Breakpoint: me.state.Breakpoint});
			}
		},
		getBreakpoint:function () {
			var arr = ['xs', 'sm', 'md', 'lg'];
			for (var i = 0; i < arr.length; i++) {
				if ($('.device-' + arr[i]).is(':visible')) {
					return arr[i];
				}
			} 
			return '';
		},
		render: function() {
			var me = this;
		
			setInterval(function(){	
				var v = me.getBreakpoint();
				if (me.state.Breakpoint !== v) {
					me.setState({Breakpoint: v });
				}
			}, 50);				
			return (			
				<span>
					<div className="device-xs visible-xs"></div>
					<div className="device-sm visible-sm"></div>
					<div className="device-md visible-md"></div>
					<div className="device-lg visible-lg"></div>
				</span>	
			);
		}	
	});	
} catch (err) {
	console.log(err.message);
}
