
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


// 发布订阅
import eventproxy from 'eventproxy';
var $evtbus = new eventproxy(); $evtbus.off = $evtbus.removeListener ;


// 长按事件和点击事件 ;
let click_mo , click_st , click_et , click_longTimer , click_allowed;
document.body.addEventListener('touchstart',(e)=>{
	if( $(e.target).closest('.tap').length ){
		e.preventDefault();
		// 重置默认值
		click_allowed = true ;
		click_mo = 1;
		click_st = click_et = +(new Date()) ;
		// 600秒后触发长按
		click_longTimer = setTimeout(()=>{
			click_allowed = false ;
			$(e.target).trigger('longTap');
		},600)
	}
},{ passive: false })
document.body.addEventListener('touchmove',(e)=>{
	if( $(e.target).closest('.tap').length ){
		e.preventDefault();
		++click_mo
		if( click_mo%10==0 ){
			clearTimeout(click_longTimer)
			click_allowed = false ;
		}		
	}
},{ passive: false })
document.body.addEventListener('touchend',(e)=>{
	if( $(e.target).closest('.tap').length ){
		e.preventDefault();
		if( click_allowed ){
			clearTimeout(click_longTimer);
			click_et = +(new Date()) ;
			if(click_et-click_st<=600){
				$(e.target).trigger('tap')
			}
		}		
	}
},{ passive: false })

// 防止多次点击
$('body').on('tap','.mui-btn',(e)=>{
	setTimeout(()=>{
		e.target.style.pointerEvents='none';
	},100)
	setTimeout(()=>{
		e.target.style.pointerEvents='unset';
	},1000)
})


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

// 跟组件 ;
window.App = new Com({
	...root,
	router,
}).$mount('#appWrapper');



// http://39.105.201.170:3000/www/dist/index.html




