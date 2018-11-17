// config
import config from 'src/config';
// 公共样式
import 'src/assets/css/public.less';
// jq
import $ from 'jquery';
window.$ = $ ;
// 工具
import tool from 'src/tool';
// socket 
import socket from 'src/socket';
// Com
import Com from 'com';
Com.component.prototype = {
	...Com.component.prototype,
	$io: socket ,
	$tool: tool ,
	$ui: tool.ui ,
	$ajax( obj ){
		obj.url = config['javaHost']+obj.url+ (obj.url.indexOf('?')==-1?'?':'&')+'token='+config['token'] ;
	   !obj.type||obj.type.toLocaleLowerCase()=='get' ? obj.params=obj.data : null ;
		this.ajax( obj );
	},
	$ajax2( obj ){
		obj.url = config['localHost']+obj.url ;
	   !obj.type||obj.type.toLocaleLowerCase()=='get' ? obj.params=obj.data : null ;
		this.ajax( obj );
	},
	ajax( obj ){
		return tool.ajax({ 
			...obj,
			success:(res)=>{
				res=JSON.parse(res);
				obj.success&&obj.success.call(this,res);
			},
			error:(e)=>{
				obj.error&&obj.error.call(this,e)
			}
		});
	},
}

// 全局组件
import depTree from 'components/select-man/dep-tree'; Com.globalComponent('depTree',depTree);
import gButton from 'components/common/g-button'; Com.globalComponent('gButton',gButton);
import gAvatar from 'components/common/g-avatar'; Com.globalComponent('gAvatar',gAvatar);
import gUpload from 'components/common/g-upload'; Com.globalComponent('gUpload',gUpload);

// 全局选人组件 
import selectMan from 'components/select-man/index.com';
window.selectMan = new Com({ ...selectMan }).$mount('#app');


// 全局选人组件 
import imSelectMan from 'components/im-select-man/index.com';
window.imSelectMan = new Com({ ...imSelectMan }).$mount('#app');



import project from 'components/project/project'; 
import routes  from './routes';
window.APP = new Com({
	...project ,
	routes ,
	defaultUrl:'/projectType?projectFlagKey=masterJoin',
}).$mount('#app');




