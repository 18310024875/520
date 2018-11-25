<template>
	
	<div id="app">
		
		<!-- <router-view v-if="this.userInfo"></router-view> -->


		<!-- 登录页面 -->

		<!-- 链接io浮层 -->
		<div v-if="!this.socket_connect" class="connect-mask">
			<div class="rot_animate mui-sppin mui-icon mui-icon-spinner mui-spin"></div>
			<p>正在链接网络...</p>
		</div>
	</div>


<!-- 	<div class="mui-scroll-wrapper">
		<div class="mui-scroll">
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1><h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1><h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1><h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
		</div>
	</div> -->






<!--下拉刷新容器-->
<!-- <div id="refreshContainer" class="mui-content mui-scroll-wrapper">
  <div class="mui-scroll">
    <ul class="mui-table-view mui-table-view-chevron">


			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1><h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1><h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1><h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>


    </ul>
  </div>
</div> -->


</template>
<script type="text/javascript">
	
	// 引入socket ;
	import CONNECT_SOCKET from 'src/socket';
	// 登录页面
	import login from 'components/login/login';

	export default{
		components:{
			login
		},

		data(){
			return {
				socket:'',
				socket_connect:'',
				userInfo:{}
			}
		},

		mounted(){
			// 链接socket
			this.initSocket();

			// var ok = mui.init({
			// 	pullRefresh : {
			// 		container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
			// 		down : {
			// 			height:50,//可选,默认50.触发下拉刷新拖动距离,
			// 			auto: true,//可选,默认false.首次加载自动下拉刷新一次
			// 			contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
			// 			contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
			// 			contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
			// 		    callback :function(){
			// 		    	setTimeout(()=>{
			// 		    		mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
			// 		    	},2000)
			// 		    }
			// 		},
			// 		up : {
			// 				height:500,//可选.默认50.触发上拉加载拖动距离
			// 				auto:false,//可选,默认false.自动上拉加载一次
			// 				contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
			// 				contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
			// 				callback :function(){
			// 						mui('#refreshContainer').pullRefresh().refresh()
			// 						mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
			// 					},20000)
			// 				}
			// 		}
			// 	}
			// });		

				// this.picker = new mui.DtPicker({"value":"2015-10-10 10:10","beginYear":2010,"endYear":2020});
				// this.picker.show((rs)=>{


				// 	console.log(rs)
				// 	/*
				// 	 * rs.value 拼合后的 value
				// 	 * rs.text 拼合后的 text
				// 	 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
				// 	 * rs.m 月，用法同年
				// 	 * rs.d 日，用法同年
				// 	 * rs.h 时，用法同年
				// 	 * rs.i 分（minutes 的第二个字母），用法同年
				// 	 */
				// 	console.log( '选择结果: ' + rs.text )
				// 	/* 
				// 	 * 返回 false 可以阻止选择框的关闭
				// 	 * return false;
				// 	 */
				// 	/*
				// 	 * 释放组件资源，释放后将将不能再操作组件
				// 	 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
				// 	 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
				// 	 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
				// 	 */
				// 	this.picker.dispose();
				// 	this.picker = null;
				// });


				// mui.confirm('MUI是个好框架，确认？', 'Hello MUI', ['a','b'], function(e) {
				// 	console.log( e )
				// })


				// mui('.mui-scroll-wrapper').scroll({
				//  scrollY: true, //是否竖向滚动
				//  scrollX: false, //是否横向滚动
				//  startX: 0, //初始化时滚动至x
				//  startY: 0, //初始化时滚动至y
				//  indicators: true, //是否显示滚动条
				//  deceleration:0.0006, //阻尼系数,系数越小滑动越灵敏
				//  bounce: true //是否启用回弹
				// });

		},

		methods:{
			// 链接socket
			initSocket(){
				this.socket = CONNECT_SOCKET();
				this.socket.on('connect',()=>{
					alert(1)
					this.socket_connect=true ; this.$diff ;
				})
				this.socket.on('disconnect',()=>{
					alert(2)
					this.socket_connect=false ; this.$diff ;
				})
				this.socket.on('error',()=>{
					alert(3)
					this.socket_connect=false ; this.$diff ;
				})
				this.socket.on('imMessage',({type,data})=>{
					switch( type ){
						// 链接成功
						case 'connected':
							break ;
						default :
							break ;
					}
				})
			},
			getUserInfo(){

			}
		}
	}
</script>
<style>
	#app{
		height: 100%;
		position: relative;
		&>.connect-mask{
			position: absolute;
			left: 0;top: 0;
			right: 0;bottom: 0;
			z-index: 100;
			background: rgba(0,0,0,0.5);
			&>.mui-sppin{
				position: absolute;
				left: 50%;top: 45%;
				transform: translate(-50%,-50%);
				color: white;
			}
			&>p{
				text-align: center;
				font-size: 13px;
				color: white;
				position: absolute;
				left: 50%;top: 40%;
				transform: translate(-50%,-50%);
			}
		}
	}
</style>
