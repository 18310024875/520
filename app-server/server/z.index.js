var path = require('path');
var fs = require('fs');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session')({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
});
var sharedsession = require("express-socket.io-session");


// 创建express ;
const app = express();
// 根路径 ;
const src = path.join(__dirname,'..');

// 全局 解决跨域
app.all('*', function(req, res, next) {
	// res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Origin",      "http://172.24.139.2:5555");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers",     "X-Requested-With,Content-Type");
    res.setHeader("Access-Control-Allow-Methods",     "PUT,POST,GET,DELETE,OPTIONS");
    next();
});

// 初始化插件 ;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session);

// 配置模板引擎ejs
app.set('views',`${src}/www/ejs`);
app.set('view engine', 'ejs');

// 静态资源
app.use('/www',express.static(`${src}/www/`));

// 方法资源
fs.readdirSync(path.join(`${src}/routes`)).map( f=>{
	let dirPath = `${src}/routes/${f}`;
	if( f.split('.').pop()=='js'&&fs.existsSync( dirPath ) ){
		let name = f.split('.')[0];
		app.use(`/${name}`,require( dirPath ));
	}
});

// 日志输出和打印 
var logStream = fs.createWriteStream(`${src}/server.log`, {flags: 'a'});
app.use(morgan('short', {stream: logStream})); //-- app.use(morgan('short')); 

// 处理404 ;
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// 报错处理 ;
app.use(function(err, req, res, next) {
	// 默认development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// 错误页面
	res.status(err.status || 500);
	res.render('error',{str:err});
});










// server 
const SERVER = require('http').createServer(app,{
	 cookie: true
});


// multer ;
const UPLOAD = require('multer')({
	dest: path.join(__dirname , '..' , './tmp_uploads'),
	limits:{fileSize:104857600}
}); 


// SCOKET.IO ;
const IO = require('socket.io')(SERVER);
IO.use(sharedsession(session));
IO.on('connection', function(socket){
		//socket.handshake.session.kkkkkkk = 'kkkkkkk';
        //socket.handshake.session.save();
	console.log('socket一个用户连接 id='+socket.id);


	socket.emit('imMessage','123')

	setTimeout(()=>{
		socket.emit('imMessage','---123-----')
	},5000)

	socket.on('disconnect', function(){
		console.log('socket一个用户断开连接连接 id='+socket.id);
	});
});

// musql
var sq = require('mysql').createConnection({
	    host     : '127.0.0.1',
		user     : 'root',
		password : 'qwer',
		database : 'chen'
	});
	sq.connect();

const QUERY = ( sql ,yes,no)=>{
	console.log(sql)
	sq.query(sql , (error , res , f)=>{
		if(error){
			no ? no(error) : null ;
		}else{
			let _res = res instanceof Array ? res : res.affectedRows ;
			yes ? yes(_res) : null ;
		}
	})
}


// 启动服务 ;
SERVER.listen(3000, function(){
  console.log('listening on *:3000');
});


global.G = {
	IO ,
	UPLOAD ,
	SERVER ,
	QUERY
}