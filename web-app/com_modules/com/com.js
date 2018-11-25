import tool from './com.tool.js';

import template from './com.template.js';

import initComponent from './com.initComponent.js';

import initRouter from './com.initRouter.js';

// 全局Com
window.Com = function( opt , props , parent , root , router ){
	// 处理render函数 ;
	if( !opt.render ){
		if( opt.template&&opt.template.trim() ){
			opt.render=eval('('+Com.template.run( opt.template )+')');
		}else{
			opt.render=function(){};
		}
	}

	// 生成组件
	return new Com.component( 
		opt ,   //配置项
		props , //收到的props
		parent , //父组件
		root , //跟根节
		router //路由节点
	);
};

// 注册全局组件 可递归自己 ;
Com.globalComponents={};
Com.globalComponent = function(name , opt){

	// 记录组件名 
	Com.globalComponents[ name ] = opt ;

	return opt ;
}

// 绑定到 Com 上 ;
Com.template = template ;
Com.tool = tool ;
initComponent( Com );
initRouter( Com );

export default Com ;



