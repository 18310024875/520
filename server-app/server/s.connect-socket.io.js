// SCOKET.IO 模块;
const socketIo = require('socket.io') ;

// scoket使用session ;
const sharedsession = require("express-socket.io-session");

// 公用session 
var session = require('./s.session');




// 向全局IO对象上添加方法 ;
function IoAddMethods( IO ){

	// 所有sockets集合 ---> IO.sockets.sockets ;

	IO.$userList={} ;
	// uid对应的socket映射集合 ;

	var methods={
		$map( callback ){
			var obj = IO.sockets.sockets ;
			for(var k in obj ){
				callback&&callback( obj[k] , k );
			}
		},
		$getSocket( socketId ){
			var socket = null ;
			this.$map(function(v,k){
				k==socketId ? socket=v : null ;
			});
			return socket ;
		},

		$message( ids='' , content={} ){
			let idsarr = (ids.split(',').filter(v=>v));
			let sendEd = [];
			idsarr.map( uid=>{
				// 过滤重复 ;
				if( sendEd.indexOf( uid )==-1 ){
					sendEd.push( uid );
					let socket = IO.$userList[ uid ] ;
					socket && socket.emit( 'imMessage' , content );
				}
			})
			idsarr = sendEd = null ;
		}
	}

	for(var k in methods){
		IO[ k ] = methods[ k ];
	}	

	return IO ;
}

// 已经链接 ;
function ConnectionEd( IO ){

	return function( socket ){

		// socket.handshake.session.kkkkkkk = 'kkkkkkk';
	 	// socket.handshake.session.save();
		console.log('socket一个用户连接 id='+socket.id);


		// 链接成功---向用户发送信息 ;
		socket.emit('imMessage',{type:'connected',content: socket.id });


		// 自定义接受事件 ;
		socket.on('imMessage', function( data ){
			console.log(socket.handshake.session);
			console.log('socket一个用户'+socket.id+'发送信息'+data );
		})


		// 断开连接事件 ;
		socket.on('disconnect', function(){
			if( socket.uid ){
				delete IO.$userList[ socket.uid ] ;
			};

			console.log('socket一个用户断开连接连接 id='+socket.id );
		});

	}
}


module.exports = function( httpServer ){

	var IO = socketIo( httpServer );

	IO = IoAddMethods( IO );
	
	IO.use( sharedsession( session ) );
	IO.on('connection', ConnectionEd(IO) );

	return IO ;
}