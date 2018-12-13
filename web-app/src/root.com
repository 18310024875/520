<template>
	
	<div id="app">
		<!-- 登录页面 -->
		<login class="1-login" v-if="!this.userInfo" :loginOk="this.loginOk.bind(this)"></login>

		<!-- 链接io浮层 -->
		<div v-if="!this.socket_connect" class="connect-mask">
			<div class="rot_animate mui-sppin mui-icon mui-icon-spinner mui-spin"></div>
			<p>正在链接网络...</p>
		</div>

		<!-- 路由容器 -->
		<router-view class="1-router-view" v-if="this.userInfo"></router-view>

	</div>


</template>
<script type="text/javascript">

	// window ;
	const w = window ;

	// 公用数据和方法 ;
	import DATA_METHODS from './root-common-data-methods';

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
				// 公用im数据 ;
				...DATA_METHODS.data ,
				// 初始化相关
				socket:'',
				socket_connect:'',
				userInfo:'',
			}
		},

		mounted(){
			// 链接socket
			this.initSocket();
		},

		methods:{
			// 公用im方法 ;
			... DATA_METHODS.methods ,
			// 链接socket
			initSocket(){
				this.socket = CONNECT_SOCKET();
				this.socket.on('connect',()=>{
					this.socket_connect=true ; this.$diff ;
					// 链接后 判断是否已经登录 ;
					this.isLogin();
				})
				this.socket.on('disconnect',()=>{
					this.socket_connect=false ; this.$diff ;
				})
				this.socket.on('error',()=>{
					this.socket_connect=false ; this.$diff ;
				})
				this.socket.on('imMessage',(res)=>{
					switch( res.type ){
						// imAjax
						case 'imAjax':
							console.log('imAjax----->',res.content.opt.method,res.content.data);
							this.GET_SOCKET_OK_imAjax( res.content )
							break ;
						// 向一个房间发送消息 ;
						case 'messageRoom':
							console.log('messageRoom----->',res.content);
							this.GET_SOCKET_OK_messageRoom( res.content )
							break ;
						default : break ;
					}
				})
			},
			// 通过socket , 向后台发送请求数据 ;
			imAjax( option ){
				if( this.socket ){
					!w.fn_index ? w.fn_index=1 : ++w.fn_index ;
					var fn_success = 'fn_success_'+w.fn_index ;
					var fn_error   = 'fn_error_'+w.fn_index ;
					w[ fn_success ] = option.success || function(){};
					w[ fn_error ]   = option.error  || function(){};
					option['fn_success'] = fn_success ;
					option['fn_error'] = fn_error ;
					// 向服务器发送本地运行状态--->后台判断验证 ;
					option['ENV']=ENV ;
					// 发送给服务端 ;
					this.socket.emit('imMessage', {
						type:'imAjax',
						content: option
					});
				}
			},
			// 收到后台消息 --> imajax返回数据 ;
			GET_SOCKET_OK_imAjax( res={} ){
				try{
					if( res.fn ){
						w[res.opt.fn_success]( res.data );
						w[res.opt.fn_success]=null ;
					}else{
						mui.alert( res.data );
						//w[res.opt.fn_error]( res.data );
						w[res.opt.fn_error]=null ;
					}
				}catch(e){ console.log('eee->',e)}
			},
		}
	}
</script>
<style>
	#app{
		position: absolute;
		left: 0;right: 0;
		top: 0;bottom: 0;
		overflow: hidden;
		background: white;
		.connect-mask{
			position: absolute;
			left: 0;top: 0;
			right: 0;bottom: 0;
			z-index: 100;
			background: rgba(0,0,0,0.5);
			&>.mui-sppin{
				position: absolute;
				left: 46.5%;top: 45%;
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
