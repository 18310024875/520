<template>
	<div style="width: 100%;height: 100%;position: relative;">

		<!-- 登录页面 -->
		<div id="login" v-if="this.status==0">
			<header class="mui-bar mui-bar-nav">
				<h1 class="mui-title">登录</h1>
			</header>
			<div class="mui-content">
				<form id='login-form' class="mui-input-group">
					<div class="mui-input-row">
						<label>账号</label>
						<input id='account' type="text" class="mui-input-clear mui-input" placeholder="请输入账号" 
							:value="this.login_account" @input="this.input('login_account')" />
					</div>
					<div class="mui-input-row">
						<label>密码</label>
						<input id='password' type="password" class="mui-input-clear mui-input" placeholder="请输入密码" 
							:value="this.login_password" @input="this.input('login_password')"/>
					</div>
				</form>
				<div class="mui-content-padded">
					<button class="mui-btn mui-btn-block mui-btn-primary" @click="this.login_submit">登录</button>
					<div class="link-area" @click="this.goReg">
						<a>注册账号</a>
					</div>
				</div>
				<div class="mui-content-padded oauth-area"></div>
			</div>
		</div>

		<!-- 注册页面 -->
		<div id="register" v-if="this.status==1">
			<header class="mui-bar mui-bar-nav">
				<h1 class="mui-title">注册</h1>
			</header>
			<div class="mui-content">
				<form id='login-form' class="mui-input-group">
					<div class="mui-input-row">
						<label>账号</label>
						<input type="text" class="mui-input-clear mui-input" placeholder="请输入账号" 
							:value="this.reg_account" @input="this.input('reg_account')"/>
					</div>
					<div class="mui-input-row">
						<label>密码</label>
						<input type="password" class="mui-input-clear mui-input" placeholder="请输入密码" 
							:value="this.reg_password" @input="this.input('reg_password')"/>
					</div>
					<div class="mui-input-row">
						<label>昵称</label>
						<input type="text" class="mui-input-clear mui-input" placeholder="请输入昵称" 
							:value="this.reg_cname" @input="this.input('reg_cname')"/>
					</div>
				</form>
				<div class="mui-content-padded">
					<button class="mui-btn mui-btn-block mui-btn-primary" @click="this.reg_submit">注册</button>
					<div class="link-area" @click="this.goReg">
						<a @click="this.goLogin">返回登录</a>
					</div>
				</div>
				<div class="mui-content-padded oauth-area"></div>
			</div>
		</div>

	</div>
</template>
<script type="text/javascript">
	
	export default{
		components:{

		},

		data(){
			return {
				status:0,
				login_account:'',
				login_password:'',
				reg_cname:'',
				reg_account:'',
				reg_password:''
			}
		},
		methods:{
			goReg(){
				this.login_account='';
				this.login_password='';
				this.reg_cname='';
				this.reg_account='';
				this.reg_password='';
				this.status=1 ; 
				this.$diff ;
			},
			goLogin(){
				this.login_account='';
				this.login_password='';
				this.reg_cname='';
				this.reg_account='';
				this.reg_password='';
				this.status=0 ; 
				this.$diff ;
			},
			input(type,e){
				this[type]=e.target.value ; this.$diff ;
			},
			login_submit(){
				if(this.login_account&&this.login_password){
					App.imAjax({
						next:true,
						method:'login',
						data:{
							account: this.login_account ,
							password: this.login_password
						},
						success:(data)=>{
							if( data && data[0] ){
								mui.toast('登录成功');

								this.loginOk( data[0] );
							}else{
								mui.toast('账号或密码错误')
							}
						},
						error:(e)=>{
							mui.alert('获取用户信息失败')
						}
					})
				}
			},
			reg_submit(){
				if(this.reg_cname&&this.reg_account&&this.reg_password){
					App.imAjax({
						next:true,
						method:'register',
						data:{
							cname: this.reg_cname ,	
							account: this.reg_account ,
							password: this.reg_password
						},
						success:(data)=>{
							mui.toast('注册成功');

							this.loginOk( data[0] );
						}	
					})
				}
			}
		}
	}
</script>
<style lang="less">
	#login,#register{
		height: 100%;
		position: relative;

			.area {
				margin: 20px auto 0px auto;
			}
			
			.mui-input-group {
				margin-top: 10px;
			}
			
			.mui-input-group:first-child {
				margin-top: 20px;
			}
			
			.mui-input-group label {
				width: 22%;
			}
			
			.mui-input-row label~input,
			.mui-input-row label~select,
			.mui-input-row label~textarea {
				width: 78%;
			}
			
			.mui-checkbox input[type=checkbox],
			.mui-radio input[type=radio] {
				top: 6px;
			}
			
			.mui-content-padded {
				margin-top: 25px;
			}
			
			.mui-btn {
				padding: 10px;
			}
			
			.link-area {
				display: block;
				margin-top: 25px;
				text-align: center;
			}
			
			.spliter {
				color: #bbb;
				padding: 0px 8px;
			}
			
			.oauth-area {
				position: absolute;
				bottom: 20px;
				left: 0px;
				text-align: center;
				width: 100%;
				padding: 0px;
				margin: 0px;
			}
			
			.oauth-area .oauth-btn {
				display: inline-block;
				width: 50px;
				height: 50px;
				background-size: 30px 30px;
				background-position: center center;
				background-repeat: no-repeat;
				margin: 0px 20px;
				/*-webkit-filter: grayscale(100%); */
				border: solid 1px #ddd;
				border-radius: 25px;
			}
			
			.oauth-area .oauth-btn:active {
				border: solid 1px #aaa;
			}
			
			.oauth-area .oauth-btn.disabled {
				background-color: #ddd;
			}
	}
</style>