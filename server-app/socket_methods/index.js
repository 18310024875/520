




module.exports = function( IO ){

	// 实例方法
	function Methods( socket ){
		this.socket = socket ;
	}
	Methods.prototype = {
		connected(){
			let s = this.socket ;
			console.log('socket一个用户连接 id='+s.id );
			console.log('----->' ,s.handshake.session)	
		},
		disconnect(){
			let s = this.socket ;
			console.log('socket一个用户断开连接连接 id='+s.id );
		},

	}







	return function( socket ){


		// socket.handshake.session.kkkkkkk = 'kkkkkkk';
	 	// socket.handshake.session.save();
		

	 	console.log(' ')
	 	console.log(' ')
	 	console.log(' ')
	 	console.log(' ')

	 	// 0 创建方法实例 ;
	 	var M = new Methods( socket );

		// 1 链接成功  ;
		M.connected()

		// 2 接受用户传来的事件 ;
		socket.on('imMessage', function( res ){
			console.log('----->' ,socket.handshake.session)
			if(res.type=='1'){
					socket.handshake.session.kkk='kkkk' ;
					socket.handshake.session.save();
			}else if(res.type=='11'){
				console.log( IO.sockets.sockets )
			}
		})

		// 3 断开连接  ;
		socket.on('disconnect', function(){
			M.disconnect();
		});
	}
}