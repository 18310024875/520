
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



// // 添加长按事件
// var w = window ;
// document.body.addEventListener('touchstart',(e)=>{
// 	console.log( e )
// 	console.error(1);
// 	// e.preventDefault();
//     w.longTmer = setTimeout(function(){
//     	console.log('longTaplongTaplongTaplongTap')
//      	$(e.currentTarget).trigger('longTap')
//     },700);
// },{ passive: false })
// document.body.addEventListener('touchmove',(e)=>{
// 	console.error(2)
// 	e.preventDefault();
//     clearTimeout(w.longTmer);
// },{ passive: false })
// document.body.addEventListener('touchend',(e)=>{
// 	console.error(3)
// 	clearTimeout(w.longTmer);
// },{ passive: false })



// 工具
import $tool from 'src/tool';
Com.component.prototype.$evtbus = $evtbus ;
Com.component.prototype.$tool = $tool ;
Com.component.prototype.$ajax = $tool.ajax ;


// 防止多次点击
// $('body').on('click','.mui-btn',(e)=>{
// 	e.target.style.pointerEvents='none';
// 	setTimeout(()=>{
// 		e.target.style.pointerEvents='unset';
// 	},1000)
// })

// 全局组件 ;
import g_avatar from 'components/common/g-avatar';
import g_room_avatar from 'components/common/g-room-avatar';
import g_upload from 'components/common/g-upload';

Com.globalComponent('g_avatar',g_avatar);
Com.globalComponent('g_room_avatar',g_room_avatar);
Com.globalComponent('g_upload',g_upload);

// 跟组件 ;
window.App = new Com({
	...root,
	router,
}).$mount('#appWrapper')



// http://39.105.201.170:3000/www/dist/index.html




