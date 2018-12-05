// 引入方法类 ;
var Msds = require('./methods.js');

// 导出方法 ;
module.exports = function( IO ){

	// 闭包
	return function( socket ){
	 	// 0 创建方法实例 ;
		var msds = new Msds( IO , socket );
		
		// 1 链接成功  ;
		console.log('~~~~~用户连接 id='+socket.id );

		// 2 接受用户传来的事件 ;
		socket.on('imMessage', function( res={} ){
			console.log('imMessage---------> ' , res )
			switch( res.type ) {
				case 'imAjax':
					msds.imAjax( res.content )
					break;

				default: break;
			}
		});

		// 3 断开连接  ;
		socket.on('disconnect', function(){
			console.log('~~~~~~断开连接连接 id='+socket.id );
		});
	}
}