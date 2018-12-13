// SCOKET.IO 模块;
const socketIo = require('socket.io') ;

// scoket使用session ;
const sharedsession = require("express-socket.io-session");

// 公用session 
var session = require('./s.session');


// socket方法
var SocketMethods = require('../socket-methods') ;
module.exports = function( httpServer ){

	var IO = socketIo( httpServer );
		IO.use( sharedsession( session ) );
		IO.on('connection', function( socket ){

	 		// 每连接一个sockete 创建一个方法实例 ;
			(new SocketMethods( IO , socket )).run() ;

		});

	return IO ;
}