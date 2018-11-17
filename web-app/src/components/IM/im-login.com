<template>
	<div class="im-login">

		{{ this.SOCKET_ID }}

		<div class="im-login-main">
			<img class="img" src="https://cdn.yonyoucloud.com/pro/yht/cas/images/lg_change01.png"/>
			<ul class="imr-head">

				<li class="cp" v-for="(v,k) in this.tabList" :class="{active: this.tabActive==k }" @click="this.tabChange(k)">{{v}}</li>

			</ul>
			<div class="imr-content">

				<div class="imr-sign" v-if="this.tabActive==0">
					<p class="p1">账号</p>
					<div class="inp1">
						<input type="text" :value="this.signVal1" autofocus="autofocus" @input="this.input('signVal1')"/>
					</div>
					<p class="p2">密码</p>
					<div class="inp2">
						<input type="password" :value="this.signVal2" @input="this.input('signVal2')"/>
					</div>
					<div class="btn cp" @click="this.doSign">登录</div>
				</div>

				<div class="imr-reg" v-if="this.tabActive==1">
					<p class="p1">账号</p>
					<div class="inp1">
						<input type="text" :value="this.regVal1"  autofocus="autofocus" @input="this.input('regVal1')"/>
					</div>
					<p class="p2">密码</p>
					<div class="inp2">
						<input type="password" :value="this.regVal2" @input="this.input('regVal2')"/>
					</div>
					<div class="btn cp" @click="this.doReg">注册</div>
				</div>
			</div>			
		</div>

	</div>
</template>
<script type="text/javascript">
	
	export default{
		props:{},
		components:{

		},

		data(){
			return {
				tabActive:0,
				tabList:['登录','注册'],
				signVal1:'',
				signVal2:'',
				regVal1:'',
				regVal2:'',
			}
		},

		methods:{
			input( k , e ){
				this[k] = e.target.value ;
			},
			tabChange( k ){
				this.tabActive=k ;
				this.$diff ;
			},
			doSign(){
				let socketId = this.SOCKET_ID ;

				this.$ajax2({
					url:'/ws/login',
					type:'post',
					data:{
						socketId: socketId ,
						account: this.signVal1 ,
						password: this.signVal2
					},
					success(data){
						if(data.code==0){
							this.$ui.say('登录成功');

							// 父级登录成功回调 ;
							this.LOGIN_SUCCESS() ;
						}else {
							this.$ui.say(data.msg);
						}
					}
				})
			},
			doReg(){
				this.$ajax2({
					url:'/ws/register',
					type:'post',
					data:{
						account: this.regVal1 ,
						password: this.regVal2
					},
					success(data){
						if(data.code==0){
							this.$ui.say('注册成功');
						}else {
							this.$ui.say(data.msg);
						}
					}
				})
			}
		}
	}
</script>
<style lang="less">
	.im-login{
		position: fixed;
		left: 0;right: 0;
		top: 0;bottom: 0;
		z-index: 1;
		background: rgba(0,0,0,0.6);
	}
	.im-login-main{
		background: white;
		position: absolute;
		width: 450px;
		height: 350px;
		border-radius: 4px;
		overflow: hidden;
		position: absolute;
		left: 50%;top: 50%;
		transform: translate(-40%,-50%);
		padding: 15px;
		&>.img{
			width: 50px;
			position: absolute;
			right: 15px;
			top: 15px;
			z-index: 1;
			pointer-events: none;
		}
		.imr-head{
			height: 50px;
			line-height: 50px;
			li{
				width: 50%;
				float: left;
				text-align: center;
				color: #444;
				background: white;
				border-bottom: 1px solid #ededed;
				position: relative;
			}
			li.active{
				color: #E14C46;
			}
			li:nth-of-type(1){
				&::after{
					content:'';
					display: inline-block;
					position: absolute;
					top: 15px;
					bottom: 15px;
					right: 0px;
					width: 1px;
					background: #ededed;
				}
			}
		}
		.imr-content{
			padding-top: 13px;
			.p1,.p2{
				padding: 10px 0;
				font-size: 15px;
				color: #888;
				line-height: 20px;
				text-indent: 40px;
			}
			.p2{
				margin-top: 2px;
			}
			.inp1,.inp2{
				margin-left: 32px;
				height: 38px;
				border-radius: 3px;
				border: 1px solid #e0e0e0;
				width: 340px;
				overflow: hidden;
				input{
					width: 100%;
					border:none;
					height: 38px;
					text-indent: 10px;
				}
			}
			.btn{
			    outline: none;
			    height: 40px;
			    line-height: 40px;
			    color: white;
			    text-align: center;
			    border-radius: 4px;
			    width: 340px;
			    background-color: #E14C46;
			    color: white;
			    font-size: 16px;
			    font-weight: 300;
			    margin-top: 40px;
			    display: inline-block;
			    position: relative;
			    left: 32px;
			}
		}
	}
</style>