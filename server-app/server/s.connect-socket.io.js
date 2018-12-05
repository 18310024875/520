// SCOKET.IO 模块;
const socketIo = require('socket.io') ;

// scoket使用session ;
const sharedsession = require("express-socket.io-session");

// 公用session 
var session = require('./s.session');



// // 向全局IO对象上添加方法 ;
// function IoAddMethods( IO ){

// 	// 所有sockets集合 ---> IO.sockets.sockets ;

// 	IO.$userList={} ;
// 	// uid对应的socket映射集合 ;

// 	var methods={
// 		$map( callback ){
// 			var obj = IO.sockets.sockets ;
// 			for(var k in obj ){
// 				callback&&callback( obj[k] , k );
// 			}
// 		},
// 		$getSocket( socketId ){
// 			var socket = null ;
// 			this.$map(function(v,k){
// 				k==socketId ? socket=v : null ;
// 			});
// 			return socket ;
// 		},

// 		$message( ids='' , content={} ){
// 			let idsarr = (ids.split(',').filter(v=>v));
// 			let sendEd = [];
// 			idsarr.map( uid=>{
// 				// 过滤重复 ;
// 				if( sendEd.indexOf( uid )==-1 ){
// 					sendEd.push( uid );
// 					let socket = IO.$userList[ uid ] ;
// 					socket && socket.emit( 'imMessage' , content );
// 				}
// 			})
// 			idsarr = sendEd = null ;
// 		}
// 	}

// 	for(var k in methods){
// 		IO[ k ] = methods[ k ];
// 	}	

// 	return IO ;
// }

// socket方法
var socketMethods = require('../socket-methods') ;
module.exports = function( httpServer ){

	var IO = socketIo( httpServer );
		IO.use( sharedsession( session ) );
		IO.on('connection', socketMethods(IO) );

	return IO ;
}