<template>
	<div class="main-mine">
		<form class="mui-input-group">

			<div class="edit-mask" v-show="!this.edit"></div>

			<div class="part1 mui-input-row" style="height:auto;">
				<div class="col1">
					<label>
						<g_avatar 
							:radius="false"
							:width=" 50+'px' "
							:height=" 50+'px' "
							:fontSize=" 20+'px' "
							:avatar=" this.data.avatar " 
							:name=" this.data.cname ">		
						</g_avatar>	
						<upload 
							style="display:none;" 
							:action="this.action"
							:name="this.name"
							:success="this.success.bind(this)"
							:error="this.error.bind(this)"
						></upload>					
					</label>
				</div>
				<div class="col2">
					注册时间: 2018年8月22日
				</div>
			</div>
			<div class="mui-input-row">
				<label>昵称</label>
				<input type="text" placeholder="请输入昵称" 
					   v-if=" this.edit? true : this.data.cname "
					   :value="this.data.cname"
					   @input="this.set('cname')"/>
			</div>
			<div class="mui-input-row">
				<label>姓名</label>
				<input type="text" placeholder="请出入姓名" 
					   v-if=" this.edit? true : this.data.name "
					   :value="this.data.name"
					   @input="this.set('name')"/>
				<span class="mui-icon mui-icon-clear mui-hidden"></span>
			</div>
			<div class="mui-input-row">
				<label>性别</label>
				<div class="nn">
					<div class="n nan" @click="this.set('sex','1')">
						<span class="sp1" :class="{active: this.data.sex==1}"></span><span class="sp2">男</span>
					</div>
					<div class="n nv" @click="this.set('sex','2')">
						<span class="sp1" :class="{active: this.data.sex==2}"></span><span class="sp2">女</span>
					</div>
				</div>
			</div>
			<div class="mui-input-row">
				<label>年龄</label>
				<input type="text" placeholder="请输入年龄" 
					   v-if=" this.edit? true : this.data.age "
					   :value="this.data.age"
					   maxlength="2" 
					   @input="this.set('age')"/>
				<span class="mui-icon mui-icon-clear mui-hidden"></span>
			</div>
			<div class="mui-input-row">
				<label>介绍</label>
				<input type="text" placeholder="请输入自我介绍" 
					   v-if=" this.edit? true : this.data.des "
					   :value="this.data.des"
					   @input="this.set('des')"/>
				<span class="mui-icon mui-icon-clear mui-hidden"></span>
			</div>

			<div class="mui-button-row" v-if="!this.edit" style="padding-top:15px">
				<button type="button" class="mui-btn mui-btn-primary" @click="this.editFn(true)">修改</button>
			</div>			
			<div class="mui-button-row" v-if="this.edit"  style="padding-top:15px">
				<button type="button" class="mui-btn mui-btn-primary" @click="this.submit" style="margin-right:7px">确认</button>
				<button type="button" class="mui-btn mui-btn-danger"  @click="this.editFn(false)">取消</button>
			</div>
		</form>
	</div>
</template>
<script type="text/javascript">
	import config from 'src/config';
	import upload from 'components/common/upload';
	export default{
		components:{
			upload
		},

		data(){
			return {
				action:`${config.uploadHost}/file/upload?uid=${this.$root.userInfo.uid}`,
				name:'upload',
				data:'',
				edit:false
			}
		},

		beforeMount(){
			this.data = JSON.parse(JSON.stringify( this.$root.userInfo ));
		},
		mounted(){
			this.getUserInfo()
		},

		methods:{
			getUserInfo(){
				App.imAjax({
					method:'getUserInfoFromSessionUid',
					success: data=>{
						this.$root.userInfo = this.data = data ;
						this.$root.$diff ;
					}
				})
			},
			success(res){
				res = JSON.parse(res);
				if( res.code==0 ){
					this.data.avatar = res.data.serverUrl ;
					this.$diff ;
				}
			},
			set( key,e ){
				this.data[key] = e.target ? e.target.value : e ;
				this.$diff ;
			},
			error(){
				mui.alert('上传失败')
			},
			editFn( bool ){
				this.edit = bool ;
				!this.edit ? this.getUserInfo() : null ;
				this.$diff ;
			},
			submit(){
				App.imAjax({
					method:'setUserInfo',
					data:{
						age: this.data.age ,
						avatar: this.data.avatar ,
						cname: this.data.cname ,
						des: this.data.des ,
						name: this.data.name ,
						sex: this.data.sex
					},
					success: data=>{
						this.getUserInfo();
					}
				})
			}
		}
	}
</script>
<style lang="less">
	.main-mine{
		position: absolute;
		left: 0;right: 0;top: 0;bottom: 0;
		overflow: auto;
		.mui-input-row{
			height: 50px;
			padding-top: 5px;
			.com_vif_wrap{
				display: inline-block;
			}
			label{
				font-size: 15px;
			}
			.nn{
				float: right;
				width: 65%;
				margin-bottom: 0;
				padding-left: 0;
				border: 0;
				padding: 10px 0;
				font-size: 16px;
				.n{
					float: left;
					margin-right: 10px;
					.sp1{
						display: inline-block;
						vertical-align: middle;
						width: 18px;
						height: 18px;
						border:1px solid #ededed;
						border-radius: 50%;
						margin-right: 5px;
					}
					.sp1.active{
						border-color:#ddd;
						background:#ddd;
					}
					.sp2{
						display: inline-block;
						vertical-align: middle;
					}
				}
				.nan{

				}
				.nv{

				}
			}
		}
		.part1{
			position: relative;
			padding-left: 16px;
			padding-top:15px;
			padding-bottom: 15px;
			.col2{
				position: absolute;
				top: 30px;
				left: 35%;
				font-size: 17px;
				color: #444;
			}
		}
		.mui-input-group{
			position: relative;
			.edit-mask{
				position: absolute;
				left: 0;right: 0;
				background: rgba(0,0,0,0);
				top: 0;bottom: 32px;
			}
			&::before{
				display:none;
			}
			&::after{
				display:none;
			}
		}
	}
</style>