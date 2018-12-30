

// let host = location.protocol+'//'+location.hostname+':3000' ;
// let host = location.protocol+'//'+location.host ;

const ConfigObj = {
	dev:{
		token:'',
		uploadHost:'http://39.105.201.170:3000',
		uploadHost:'http://192.168.43.7:3000',
		host: location.protocol+'//'+location.hostname+':3000'
	},
	build:{
		token:'',
		uploadHost: location.protocol+'//'+location.host,
		host: location.protocol+'//'+location.host
	}
}

const config = ConfigObj[ ENV ] ;

// 当地址存在token 赋值给config ;
var href  = window.location.href ;
var token = href.match(/[^\w]token=([\w-]*)/) && href.match(/[^\w]token=([\w-]*)/)[1];
    token ? config['token']=token : null ;


export default config ;

