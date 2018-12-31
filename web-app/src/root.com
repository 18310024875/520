<template>
	
	<div id="app">
		<!-- 链接io浮层 -->
		<div v-if=" !this.socket.connected " class="connect-mask">
			<div class="rot_animate mui-sppin mui-icon mui-icon-spinner mui-spin"></div>
			<p>正在链接网络...</p>
		</div>

		<!-- 登录页面 -->
		<login class="1-login" v-if="!this.userInfo" :login_ok="this.login_ok.bind(this)"></login>

		<!-- 路由容器 -->
		<router-view class="1-router-view" v-if="this.userInfo"></router-view>

		<!-- 选人组件 -->
		<selectMan ref="selectMan" v-if="this.userInfo"></selectMan>

	</div>


</template>
<script type="text/javascript">

	// window ;
	const w = window ;

	// 引入socket ;
	import CONNECT_SOCKET from 'src/socket';

	// 登录页面
	import login from 'components/login/login';

	// 选人
	import selectMan from 'components/common/select-man';

	export default{
		components:{
			login,
			selectMan
		},

		data(){
			return {
				// 初始化相关
				socket:'',
				userInfo:'',
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
					this.socket.connected=true  ; this.$diff ;
					// 链接后 判断是否已经登录 ;
					this.login_islogin();
				})
				this.socket.on('disconnect',()=>{
					this.socket.connected=true  ; this.$diff ;
				})
				this.socket.on('error',()=>{
					this.socket.connected=false ; this.$diff ;
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
					!option.data ? option.data={} : null ;
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
						w[res.opt.fn_error]( res.data );
						w[res.opt.fn_error]=null ;
					}
				}catch(e){ console.error('eee->',e)}
			},
			// 收到后台消息 --> 向一个房间广播信息 ;
			GET_SOCKET_OK_messageRoom(content){
				this.$evtbus.emit('messageRoom', content );
			},
			// 是否登录
			login_islogin(){
				this.imAjax({
					next:true,
					method:'login_islogin',
					success:(data)=>{
						data&&data[0] ? this.login_ok(data[0]) : null ;
					}
				})
			},
			// 登录成功 
			login_ok(userInfo){
				this.userInfo = userInfo ;
				this.$diff ;
			},

			// 开启选人 
			openSelectMan( ...val ){
				let selectMan = this.$refs.selectMan.component ;
				selectMan.open( ...val );
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
