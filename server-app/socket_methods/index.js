
var methods = require('./methods.js');

// 导出方法 ;
module.exports = function( IO ){

	// 实例方法
	function Methods( socket ){
		this.socket = socket ;
	}
	Methods.prototype = Object.assign({},{
		connected(){
			let s = this.socket ;
			console.log('socket一个用户连接 id='+s.id);
		},
		disconnect(){
			let s = this.socket ;
			console.log('socket一个用户断开连接连接 id='+s.id );
		},	
		// 处理客户端发来的数据
		imAjax( option ){
			let s = this.socket ;
			if( option.next===true ){
				// 不需要验证
			}else{
				// 需要验证
				if( !s.handshake.session.uid ){
					// 需要验证,不存在用户id 不执行方法 ;
					this.snedImAjaxRes(option,0,'user 验证不通过');
					return ;
				}
			}
			// 调用方法 ;
			try{
				this[ option.method ]( option )
			}catch(e){
				console.log('eee--->',e)
			};
		},
		// 向客户端发送数据
		snedImAjaxRes( opt={} , fn=true , data=null ){
			let s = this.socket ;
			s.emit('imMessage',{
				type:'imAjax',
				content:{
					opt: opt,
					fn: fn,
					data: data
				}
			})
		}
	}, methods)



	// 闭包
	return function( socket ){
	 	// 0 创建方法实例 ;
		 var M = new Methods( socket );
		
		// 1 链接成功  ;
		M.connected();

		// 2 接受用户传来的事件 ;
		socket.on('imMessage', function( res={} ){
			console.log('imMessage---------> ' , res )
			switch( res.type ) {
				case 'imAjax':
					M.imAjax( res.content )
					break;

				default: break;
			}
		});

		// 3 断开连接  ;
		socket.on('disconnect', function(){
			M.disconnect();
		});
	}
}