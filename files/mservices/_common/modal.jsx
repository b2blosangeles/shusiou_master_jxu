
try {
	var ModalWin =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {ModalPlus: ''};	
		},	
		componentDidUpdate:function(prevProps, prevState) {
			var me = this;
			if ((me.props.parent) && (me.props.parent.state.ModalPlus)) {	
				if (me.props.parent.state.ModalPlus == 'cancel') {
					viewpoint.find('.ModalPlus').modal('hide');
					me.props.parent.state.ModalPlus = null;
					return true
				}	
				if (!me.props.parent.state.ModalPlus._id) {
					me.props.parent.state.ModalPlus._id = true;
				//	return true;
				}	
				
				if (me.props.parent.state.ModalPlus !== me.state.ModalPlus) {
					me.setState({ModalPlus: me.props.parent.state.ModalPlus });
					return true;
				}
				if (me.props.parent.state.ModalPlus.hold) {
					if (!me._ModalPlus_startTime) {
						me._ModalPlus_startTime = new Date().getTime();
						me.setState({ModalPlus_TM: new Date().getTime() });
						return true;
					}
					if  (new Date().getTime() <= (me.props.parent.state.ModalPlus.hold + me._ModalPlus_startTime)) {
						setTimeout(
							function() {
								me.setState({ModalPlus_TM: new Date().getTime() });
							}, 50
						);
						return true;
					} else {
						delete me._ModalPlus_startTime;
					}
				}				
				// if (prevState.ModalPlus.TM !== me.state.ModalPlus.TM) {
				me.render();
				viewpoint.find('.ModalPlus_'+ mapping_data.id).modal({backdrop:'static'});
				me.props.parent.setState({ModalPlus: ''});
			//	} 
			}
			return true;
		},
		modalClass:function () {
			return 'modal fade ModalPlus ModalPlus_'+ mapping_data.id;
		},
		header:function() {
			var me = this;
			if (me.state.ModalPlus.header) {
				return me.state.ModalPlus.header;
			} else {		
				return(
					<div className="modal-header">
						<button type="button" className="close" data-dismiss="modal">
							&times;
						</button>
						<h5 className="modal-title">{me.state.ModalPlus.title}</h5>
					</div>		
				);
			}
		},		
		footer:function() {
			var me = this;
			if (me.state.ModalPlus.footer) {
				return me.state.ModalPlus.footer;
			} else {		
				return(
					<div className="modal-footer">
						<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
						<button type="button" className="btn btn-primary">Save changes</button>
					</div>			
				);
			}
		},
		render: function() {
			var me = this, err_msg = '';
			if (_modal_backdrop_) {
				if (me.state.ModalPlus.backdrop)  _modal_backdrop_.set(me.state.ModalPlus.backdrop);	
				else  _modal_backdrop_.resetDefault();
			}
			switch(me.state.ModalPlus.type) {
				case "alert":
					var box_class = '', box_style = '', message = '', close_icon = true;

					box_class = (me.state.ModalPlus.box_class)?me.state.ModalPlus.box_class:'info';
					message = (me.state.ModalPlus.message)?('<strong>!</strong> ' + me.state.ModalPlus.message):'<strong>!</strong>';
					close_icon = (me.state.ModalPlus.close_icon === false)?'none':'';
					box_style = (me.state.ModalPlus.box_style)?me.state.ModalPlus.box_style:{};

					if (!err_msg) {
						return (			
							<div className={me.modalClass()} tabindex="-1" role="dialog" aria-hidden="true">
							  <div className="modal-dialog modal-lg" role="document">
								<div className={'alert alert-' + box_class} style={box_style} role="alert">
									<span dangerouslySetInnerHTML={{__html: message}}></span>
									<button type="button" className="close" data-dismiss="modal" style={{display:close_icon}}>
										&times;
									</button>
								</div>
							  </div>
							</div>	
						);
					}
					break;	
				case "popup":

					var box_class = '', box_style = '', message = '', close_icon = true;

					box_class = (me.state.ModalPlus.box_class)?me.state.ModalPlus.box_class:'info';
					message = (me.state.ModalPlus.message)?('<strong>!</strong> ' + me.state.ModalPlus.message):'<strong>!</strong>';
					close_icon = (me.state.ModalPlus.close_icon === false)?'none':'';
					box_style = (me.state.ModalPlus.box_style)?me.state.ModalPlus.box_style:{};

					if (!err_msg) {
						if (me.state.ModalPlus.body) {
							return (			
								<div className={me.modalClass()} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
								  <div className="modal-dialog modal-lg" role="document">
									<div className={'modal-content ' + box_class} style={box_style} >
										<span dangerouslySetInnerHTML={{__html: me.state.ModalPlus.body}}></span>
									</div>
								  </div>
								</div>		
							)
						} else {
							return (
								<div className={me.modalClass()} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
								  <div className="modal-dialog modal-lg" role="document">
									<div className={'modal-content ' + box_class} style={box_style} >	
										<span>
											{me.header()}
											<div className="modal-body">
												{me.state.ModalPlus.message}
											</div>
											{me.footer()}
										</span>	
									</div>
								  </div>
								</div>										
							)
						}
					}
					break;				
				default:
					err_msg = 'wrong or missong ModelPlus Type';
			} 
			if (err_msg) {
				return (
					<div className={me.modalClass()} tabindex="-1" role="dialog" aria-hidden="true">
					  <div className="modal-dialog" role="document">
						<div className="alert alert-danger" role="alert">
							<strong>!</strong> {err_msg}
							<button type="button" className="close" data-dismiss="modal">
								&times;
							</button>
						</div>
					  </div>
					</div>	
				);
			} else {
				return(<span></span>);
			}
		}	
	});	
} catch (err) {
	console.log(err.message);
}


try {
	var ModalLoading =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {ModalLoading: ''};
		},	
		componentDidUpdate: function (prevProps, prevState) {
			var me = this;
			if ((me.props.parent) && (me.props.parent.state.ModalLoading)) {	
				if (me.props.parent.state.ModalLoading == 'cancel') {
					viewpoint.find('.ModalLoading').modal('hide');
					me.props.parent.state.ModalLoading = null;
					return true
				}				
				if (!me.props.parent.state.ModalLoading._id) {
					me.props.parent.state.ModalLoading._id = true;
				//	return true;
				}

				
				if (me.props.parent.state.ModalLoading !== me.state.ModalLoading) {
					me.setState({ModalLoading: me.props.parent.state.ModalLoading });
					return true;
				}
				if (me.props.parent.state.ModalLoading.hold) {
					if (!me._ModalLoading_startTime) {
						me._ModalLoading_startTime = new Date().getTime();
						me.setState({ModalLoading_TM: new Date().getTime() });
						return true;
					}
					if  (new Date().getTime() <= (me.props.parent.state.ModalLoading.hold + me._ModalLoading_startTime)) {
						setTimeout(
							function() {
								me.setState({ModalLoading_TM: new Date().getTime() });
							}, 50
						);
						return true;
					} else {
						delete me._ModalLoading_startTime;
					}
				}				
				
				//if (prevState.ModalLoading !== me.state.ModalLoading || (me.props.parent.state.ModalLoading.hold)) {
				//	 me.render();
					viewpoint.find('.ModalLoading_'+ mapping_data.id).modal({backdrop:'static'});
				me.props.parent.setState({ModalLoading: ''});
				//} 				
			}

		},
		ModalLoadingClass: function() {
			return 'modal fade ModalLoading ModalLoading_'+ mapping_data.id;
		},		
		render: function() {
			var me = this, err_msg = '';
			if (_modal_backdrop_) {
				if (me.state.ModalLoading.backdrop)  _modal_backdrop_.set(me.state.ModalLoading.backdrop);	
				else  _modal_backdrop_.resetDefault();
			}
			var message = '', box_style={};
			var message = (me.state.ModalLoading.message)?(me.state.ModalLoading.message):'Loading ...';
			box_style = (me.state.ModalLoading.box_style)?me.state.ModalLoading.box_style:{color:'#ff0000'};

			return (			
				<div className={me.ModalLoadingClass()} tabindex="-1" role="dialog" aria-hidden="true">
				  <div className="modal-dialog" role="document">
					<div style={box_style}>
						<span dangerouslySetInnerHTML={{__html: message}}></span>
					</div>
				  </div>
				</div>	
			);
		}	
	});	
} catch (err) {
	console.log(err.message);
}


try {
	var ModalPlus =  React.createClass({
		getInitialState: function() {
			var me = this;
			return {};
		},	
		render: function() {
			var me = this;
			return (			
				<span>
					<ModalWin parent={(!me.props.parent)?me:me.props.parent} />
					<ModalLoading parent={(!me.props.parent)?me:me.props.parent} />
				</span>	
			);
		}	
	});	
} catch (err) {
	console.log('err.message===>');
	console.log(err.message);
}
