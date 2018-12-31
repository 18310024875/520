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
Client.$query=function( sql , yes , no , after){

	Client.query( sql , function(error , result , f){
		if(error){
			console.error('mysql,error---'+error);

			no&&no(error);
			after&&after();
		}else{
			yes&&yes(result);
			after&&after();
		}
	});
};


// 导出 ;
module.exports = Client ;