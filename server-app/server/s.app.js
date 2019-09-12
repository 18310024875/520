const path = require('path');
const fs = require('fs');

// 基本模块 ;
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// 公用session
var session = require('./s.session');

// 创建express ;
var app = express();

// 根路径 ;
var src = path.join(__dirname,'..');

// 全局 解决跨域
app.all('*', function(req, res, next) {
	if( !req.headers.origin ){
		res.setHeader("Access-Control-Allow-Origin","*");
	}else{
		res.setHeader("Access-Control-Allow-Origin", req.headers.origin );
	};
    
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers",     "X-Requested-With,Content-Type");
	res.setHeader("Access-Control-Allow-Methods",     "PUT,POST,GET,DELETE,OPTIONS");
	
    next();
});

app.all('/aa', function(req, res, next) {
	setTime(() => {
		res.send('1111')
	},1000)
	
})
app.all('/bb', function(req, res, next) {
	res.status(406)
	res.send('222')
})

// 初始化插件 ;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use( session );

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

// 处理404 ;
app.use(function(req, res, next) {
	var err = new Error('Not Found');
		err.status = 404;
		err.host = req.headers.host ;
		err.url = req.url ;
	next(err);
});

// 报错处理 ;
app.use(function(err, req, res, next) {
	// 默认development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// 错误页面
	res.status(err.status || 500);
	res.render('error',{str:err,host:err.host,url:err.url});
});


// 日志输出和打印 
var logStream = fs.createWriteStream(`${src}/server.log`, {flags: 'a'});
app.use(morgan('short', {stream: logStream})); //-- app.use(morgan('short')); 


module.exports = app ;