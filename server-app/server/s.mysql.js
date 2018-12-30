// musql 模块 ;
const mariasql = require('mariasql');

// 创建mysql配置 ;
var Client = new mariasql({
	host: '39.105.201.170',
	port: '3306',
	user: 'root',
	password: 'qwer',
	db: 'chen'
})

// 添加方法 ;
Client.$query=function( sql , yes , no , afterall){
	console.log('sql语句-------- '+sql);

	Client.query( sql , function(error , result , f){
		if(error){
			console.log('mysql,error---'+error);
			no ? no(error) : null ;
			afterall ? afterall() : null ;
		}else{
			let res = result instanceof Array ? result : !!result.info.affectedRows ;
			yes ? yes(res) : null ;
			afterall ? afterall() : null ;
		}
	});
};


// 导出 ;
module.exports = Client ;