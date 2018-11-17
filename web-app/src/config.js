
const ConfigObj = {
	'test':{
		token:'',
		javaHost : 'http://123.103.9.204:6058',
		localHost: 'http://172.24.139.2:3000',
		// localHost:'http://172.20.10.2:3000'
	},
	'build':{
		token:'',
		javaHost : 'https://ezone.yonyoucloud.com',
		localHost: 'http://172.24.139.2:3000',
	}
}

const config = ConfigObj[ ENV ] ;

// 当地址存在token 赋值给config ;
var href  = window.location.href ;
var token = href.match(/[^\w]token=([\w-]*)/) && href.match(/[^\w]token=([\w-]*)/)[1];
    token ? config['token']=token : null ;


export default config ;

