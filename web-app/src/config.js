
const ConfigObj = {
	'test':{
		token:'',
		host:'localhost:3000'
	},
	'build':{
		token:'',
		host:'http://39.105.201.170:3000'
	}
}

const config = ConfigObj[ ENV ] ;

// 当地址存在token 赋值给config ;
var href  = window.location.href ;
var token = href.match(/[^\w]token=([\w-]*)/) && href.match(/[^\w]token=([\w-]*)/)[1];
    token ? config['token']=token : null ;


export default config ;

