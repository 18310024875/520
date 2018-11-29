
// com ;
import Com from 'com';

// less
import 'src/assets/css/public.less';
// 根节点
import root from './root';
// 路由
import router from './router';


// 发布订阅
import eventproxy from 'eventproxy';
var $evtbus = new eventproxy(); $evtbus.off = $evtbus.removeListener ;

// 工具
import $tool from 'src/tool';
Com.component.prototype.$evtbus = $evtbus ;
Com.component.prototype.$tool = $tool ;
Com.component.prototype.$ajax = $tool.ajax ;

// jq
window.$ = require('jquery');

// 防止多次点击
$('body').on('click','.mui-btn',(e)=>{
	e.target.style.pointerEvents='none';
	setTimeout(()=>{
		e.target.style.pointerEvents='unset';
	},1000)
})

// 全局组件 ;
import g_avatar from 'components/common/g-avatar';
Com.globalComponent('g_avatar',g_avatar);

// 跟组件 ;
window.App = new Com({
	...root,
	router,
}).$mount('#appWrapper')



// http://39.105.201.170:3000/www/dist/index.html/




