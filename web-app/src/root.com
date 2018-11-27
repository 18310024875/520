<template>
	
	<div id="app">
		
		<router-view v-if="this.userInfo"></router-view>

		<!-- 登录页面 -->
		<login v-if="!this.userInfo" :loginOk="this.loginOk.bind(this)"></login>

		<!-- 链接io浮层 -->
		<div v-if="!this.socket_connect" class="connect-mask">
			<div class="rot_animate mui-sppin mui-icon mui-icon-spinner mui-spin"></div>
			<p>正在链接网络...</p>
		</div>
	</div>




</template>
<script type="text/javascript">

	const w = window ;

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
				userInfo:''
			}
		},

		mounted(){
			// 链接socket
			this.initSocket();
		},

		methods:{
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
					console.log('imMessage----->',res)
					switch( res.type ){
						// imAjax
						case 'imAjax':
							this.getImAjaxRes( res.content )
							break ;

						default : break ;
					}
				})
			},
			// 通过socket调用后台接口
			imAjax( option ){
				if( this.socket ){
					!w.fn_index ? w.fn_index=1 : ++w.fn_index ;
					var fn_success = 'fn_success_'+w.fn_index ;
					var fn_error   = 'fn_error_'+w.fn_index ;
					w[ fn_success ] = option.success || function(){};
					w[ fn_error ]   = option.error  || function(){};
					option['fn_success'] = fn_success ;
					option['fn_error'] = fn_error ;
					// 发送给服务端 ;
					this.socket.emit('imMessage', {
						type:'imAjax',
						content: option
					});
				}
			},
			// 调用接口成功 , 后台返回数据 
			getImAjaxRes( res={} ){
				try{
					res.fn ? 
						w[res.opt.fn_success]( res.data ) : 
						mui.alert( res.data )
						//w[res.opt.fn_error]( res.data ) 
				}catch(e){ console.log('eee->',e)}
			},
			// 登录成功
			loginOk( userInfo ){
				this.userInfo = userInfo ; this.$diff ;
			},
			// 判断是否已经登录
			isLogin(){
				this.imAjax({
					next:true,
					method:'isLogin',
					success:(userInfo)=>{
						console.log('isLogin', userInfo )
						if( userInfo ){ this.userInfo=this.userInfo ; this.$diff }
					}
				})
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