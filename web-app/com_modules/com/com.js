import tool from './com.tool.js';

import template from './com.template.js';

import initComponent from './com.initComponent.js';

import initRouter from './com.initRouter.js';


// 如果没解析template为render自动解析 ;
function evalRender( opt ){
	if( !opt.render ){
		opt.render=Com.template.run( opt.template )
	}
	if( typeof opt.render=='string' ){
		opt.render=eval('('+opt.render+')')
	}
}

// 判断是否解析了less
function renderLess( opt ){
	if( opt.templateOfLess && !opt.templateOfLessAppend ){
		opt.templateOfLessAppend = true ;

		var css = opt.templateOfLess ;
			css = '\n'+css ;
			css = css.replace(/\}/g,'}\n');

		var style = document.createElement('style');
			style.innerHTML = css ;

		document.head.appendChild( style );
	};
}

// 全局Com
window.Com = function( opt , props , parentComponent){
	// less
	renderLess( opt );

	// render
	evalRender( opt );

	// 每次引入组件 data刷新 ;
	!opt.data ? opt.data=function(){ return {} } : null ;

	// 生成组件
	return new Com.component( 
		opt ,   //配置项
		props , //收到的props
		parentComponent //父组件
	);
};

// 注册全局组件 可递归自己 ;
Com.globalComponents={};
Com.globalComponent = function(name , opt){
	// render
	evalRender( opt );

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



