import io from './socket.io.js';
import config from 'src/config';
import Com from 'com';

var MessageMap=window.MessageMap={

};
// 写钩子 ;
var _mount = Com.component.prototype.$mount ;
Com.component.prototype.$mount = function(){
	// 添加监听 ;
	if( this.$opt.imMessage ){
		MessageMap[ this.id ] = this.$opt.imMessage.bind(this) ;
	}
	// 返回
	let args = [...arguments] ;
	return _mount.apply( this , args );
};
var _destroy = Com.component.prototype.$destroy ;
Com.component.prototype.$destroy = function(){
	// 移除监听 ;
	if( this.$opt.imMessage ){
		delete MessageMap[ this.id ] ;
	}
	// 返回
	let args = [...arguments] ;
	return _destroy.apply( this , args );
};


// 链接
var socket = io( config['localHost'] );
socket.on('imMessage', function (data) {
	// console.log('imMessage' , data);
	for(var k in MessageMap){
		MessageMap[k] && MessageMap[k]( data ) ;
	}
});


export default socket ;