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


var os=require('os');
var platform=os.platform();
var hostname=os.hostname()
console.log(platform,hostname)
Client.query(`SELECT * FROM user` , (err,res)=>{
	console.log(err,res)
})

// 添加方法 ;
Client.$query=function( sql , yes , no ){
	// console.log('sql语句--- '+sql);

	TargetMysql.query( sql , function(error , res , f){
		if(error){
			console.log('mysql,error---'+error);
			no ? no(error) : null ;
		}else{
			let _res = res instanceof Array ? res : res.affectedRows ;
			yes ? yes(_res) : null ;
		}
	});
};


// 导出 ;
module.exports = Client ;