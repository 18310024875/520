// // musql 模块 ;
// const mysql = require('mysql');

// // 创建mysql配置 ;
// var TargetMysql = (
// 	mysql.createConnection({
// 		    host     : '127.0.0.1',
// 			user     : 'root',
// 			password : 'qwer',
// 			database : 'chen'
// 	})
// );

// // *** 手动链接mysql *** ;
// TargetMysql.connect();

// // 添加方法 ;
// TargetMysql.$query=function( sql , yes , no ){
// 	// console.log('sql语句--- '+sql);

// 	TargetMysql.query( sql , function(error , res , f){
// 		if(error){
// 			console.log('mysql,error---'+error);
// 			no ? no(error) : null ;
// 		}else{
// 			let _res = res instanceof Array ? res : res.affectedRows ;
// 			yes ? yes(_res) : null ;
// 		}
// 	});
// };

// console.log('9999' , TargetMysql)


// // 导出 ;
// module.exports = TargetMysql ;


// musql 模块 ;
const mariasql = require('mariasql');

// 创建mysql配置 ;
var Client = new mariasql({
	host: '127.0.0.1',
	user: 'root',
	password: '',
	db: 'chen'
})



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

console.log('9999' , Client)


// 导出 ;
module.exports = Client ;