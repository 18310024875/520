
// server 
const http = require('http');

// 服务基本配置 ;
var app = require('./s.app');
// 服务链接scoket的方法 ;
var connectIo = require('./s.connect-socket.io');
// mysql配置 ;
var mysql = require('./s.mysql');
// upload配置 ;
var upload = require('./s.upload');


// 创建服务
var server = http.createServer( app , { cookie: true} );
// 链接socket.io 返回io服务实例 ;
var io = connectIo( server );

// 启动服务 ;
server.listen(3000, function(){
  console.log('listening on *:3000');
  console.log('1');
  console.log('2');
  console.log('3');
  console.log('4');
  console.log('5');
  console.log('6');
  console.log('7');
  console.log('8');
  console.log('9');
  console.log('10');
});

// 定义全局变量 ;
global.G = {
	IO:io ,
	UPLOAD:upload ,
	SERVER:server ,
	MYSQL:mysql
};
