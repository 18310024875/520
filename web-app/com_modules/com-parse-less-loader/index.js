// com 解析less ;;;
module.exports = function( com ){

	// 处理完交给回调函数 ;
	var callback = this.async() ;

	var less = com.match(/<style.*?>((\n|.)*)<\/style>/) ;
	if( less && less[1] ){
		callback( null , less[1] )
	}else{
		callback( null , '')
	}
}