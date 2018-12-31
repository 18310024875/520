
// com ;
import Com from 'com';

// less
import 'src/assets/css/public.less';
// 根节点
import root from './root';
// 路由
import router from './router';

// jq
window.$ = require('jquery');
// 防止多次点击
$('body').on('click','.mui-btn,.lazy',(e)=>{
	setTimeout(()=>{
		e.target.style.pointerEvents='none';
	},100)
	setTimeout(()=>{
		e.target.style.pointerEvents='unset';
	},1000)
})

// 发布订阅
import eventproxy from 'eventproxy';
var $evtbus = new eventproxy(); $evtbus.off = $evtbus.removeListener ;

// 工具
import $tool from 'src/tool';
Com.component.prototype.$evtbus = $evtbus ;
Com.component.prototype.$tool = $tool ;
Com.component.prototype.$ajax = $tool.ajax ;


// 全局组件 ;
import g_avatar from 'components/common/g-avatar';
import g_group_avatar from 'components/common/g-group-avatar';
import g_room_avatar from 'components/common/g-room-avatar';

Com.globalComponent('g_avatar',g_avatar);
Com.globalComponent('g_group_avatar',g_group_avatar);
Com.globalComponent('g_room_avatar',g_room_avatar);

// 根组件 ;
window.App = new Com({
	...root,
	router,
}).$mount('#appWrapper');




// http://39.105.201.170:3000/www/dist/index.html


