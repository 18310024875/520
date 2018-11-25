/*
	必须存在 !!!!!
	<script> 
		export default {} 
	</script>
*/




// 解析路径
var path = require('path');

// webpack 自带 , 得到引入文件信息 ;
var loaderUtils = require("loader-utils");

// 解析模板 ;
var template = require('../com/com.template.js');


// 导出 ;
module.exports = function( com ){

	// 处理完交给回调函数 ;
	var callback = this.async() ;

	// 1 获取 js ( 必有 )
	var js = com.match(/<script.*?>((\n|.)*)<\/script>/) ;
		js&&js[1] ? js=js[1] : null ;
	if( js ){

		// 文件路径信息	
		// var url = loaderUtils.getCurrentRequest(this); 
		// 引入文件绝路径 ;
		var __path = loaderUtils.getRemainingRequest(this); 
		// 引入文件相对路径 ;
		var $path  = loaderUtils.stringifyRequest(this, __path );

		// 2 判断是否存在less
		var less = com.match(/<style.*?>((\n|.)*)<\/style>/) ;
		if( less && less[1] ){
			js = `require("!style-loader!css-loader!postcss-loader!less-loader!com-parse-less-loader!${JSON.parse($path)}")\n`+js ;
		}

		// 3 获取 template ;
		var tpl = com.match(/<template.*?>((\n|.)*)<\/template>/) ; 
			tpl && tpl[1] && tpl[1].trim() ? tpl=tpl[1] : tpl='<i />' ;
		if( tpl ){

			var render = template.run( tpl ) ;

			js = js.replace(/export\s+default\s*(\\n)*\s*{/,`export default { \n render:${render} ,\n`)
		}

		callback(null, js );
	}else{
		callback(null, com );
	}

};
