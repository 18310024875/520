<template>
	<div class="user-detail" v-if=" this.detail ">
		<div class="masker" 
			:style="{
				background: `url('${this.detail.discover_bg}') 0% 0%`,
				backgroundSize:'cover'
			}"> 
		</div>
		<div class="scroll">

			<div class="part1">
				<div class="col1">
					<g_avatar 
						style="border-radius:5px;overflow:hidden;"
						:radius="false"
						:width=" 65+'px' "
						:height=" 65+'px' "
						:fontSize=" 25+'px' "
						:avatar=" this.detail.avatar " 
						:name=" this.detail.cname ">		
					</g_avatar>
				</div>
				<div class="col2">
					<div class="d1">
						{{this.detail.cname}}
					</div>
					<div class="d2">
						{{this.detail.des||''}}
					</div>
				</div>
			</div>

			<div class="part2">
				<div class="row1">
					<div class="col1">
						地区
					</div>
					<div class="col2">
						中国
					</div>
				</div>
				<div class="row2">
					<div class="col1">
						<div class="dt">动态</div>
					</div>
					<div class="col2">
						<ul class="ul" v-if="this.detail.discoverList && this.detail.discoverList.length">
							<li v-for="(item) in this.detail.discoverList"
								:style="{
									width: w,
									height: w
								}">
								<div v-if="item.file" class="img"
									:style="{
										background: `url('${item.file.serverUrl}') 0% 0%`,
										backgroundSize:'cover'
									}">		
								</div>
								<div v-if="!item.file" class="text">
									{{item.text}}
								</div>
							</li>
						</ul>
					</div>
					<div class="col3">
						<span class="mui-icon mui-icon-forward"></span>
					</div>
				</div>
			</div>

			<div class="part3" v-if="this.detail.isFriend">
				<div class="btn" @click="this.goActiveRoom.bind(this)">
					发消息
				</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
		
	let w = ((window.innerWidth-145)/4)+'px' ;

	export default{
		props:{},
		components:{

		},

		data(){
			return {
				w:w,
				list:[1,2,3,4],
				detail:''
			}
		},

		mounted(){
			let uid = this.$router.query.uid ;
			if( uid ){
				this.uid = uid ;
				this.getDetail();
			}else{
				mui.alert('uid is null')
			}
		},

		methods:{
			getDetail(){
				App.imAjax({
					method:'user_getDetail',
					data:{
						uid: this.uid
					},
					success: res=>{
						this.detail=res;
						this.$diff ;
					}
				})
			},
			goActiveRoom(){
				// 先链接用户 , 判断是否需要创建房间 ;
				App.imAjax({
					method:'connect_user',
					data:{
						connect_uid: this.detail.uid
					},
					success: room_id=>{
						location.hash=`#/connectRoom?room_id=${room_id}`
					}
				})
			}
		}
	}





</script>
<style lang="less">
	.user-detail{
		position: absolute;
		left: 0;right: 0;
		top: 0;bottom: 0;
		background: #f1f1f1;
		.masker{
			position: absolute;
			left: 0;right: 0;
			top: 0;bottom: 0;
			opacity: 0.1;
			z-index: 1;		
		}
		.scroll{
			position: absolute;
			left: 0;right: 0;
			top: 0;bottom: 0;
			overflow: auto;	
			z-index: 2;		
			border-top: 1px solid transparent;
		}
		.part1{
			height: 90px;
			padding-left: 95px;
			position: relative;
			background: white;
			margin-top: 20px;
			border-top: 1px solid #ddd;
			border-bottom: 1px solid #ddd;
			.col1{
				position: absolute;
				left: 15px;top: 13px;
			}
			.col2{
				height: 100%;
				border-top: 1px solid transparent;
				.d1{
					margin-top: 18px;
					font-size: 18px;
					color: #111;
					line-height: 25px;
				}
				.d2{
					margin-top: 3px;
					font-size: 16px;
					color: #888;
					line-height: 25px;
				}
			}
		}
		.part2{
			margin-top: 20px;
			border-top: 1px solid #ddd;
			border-bottom: 1px solid #ddd;
			position: relative;
			background: white;
			.row1{
				position: relative;
				height: 44px;
				line-height: 44px;
				font-size: 15px;
				padding-left: 80px;
				.col1{
					position: absolute;
					left: 0;top: 0;bottom: 0;
					width: 80px;
					padding-left: 15px;
					color: #555;
				}
				.col2{
					color: #111;
				}
				&::after{
					content: '';
					display: inline-block;
					position: absolute;
					left: 16px;
					right: 0;bottom: 0;
					height: 1px;
					background: #ddd;
				}
			}
			.row2{
				position: relative;
				padding-left: 80px;
				.col1{
					position: absolute;
					left: 0;top: 0;bottom: 0;
					width: 80px;
					font-size: 15px;
					color: #555;
					.dt{
						position: absolute;
						left: 15px;
						top: 50%;
						transform: translateY(-50%);
					}
				}
				.col2{
					padding: 10px 0;
					min-height: 80px;
					position: relative;
					.ul{
						position: relative;
						overflow: hidden;
						li{
							float: left;
							margin-right: 10px;
							position: relative;
							.img{
								position: absolute;
								left: 0;right:0;
								top: 0;bottom: 0;
								z-index: 2;
								overflow: hidden;
							}
							.text{
								position: absolute;
								left: 0;right:0;
								top: 0;bottom: 0;
								z-index: 1;
								background: #f1f1f1;
								font-size: 15px;
								padding: 5px 8px;
								overflow: hidden;
							}
						}
					}
				}
				.col3{
					position: absolute;
					right: 0;top: 0;bottom: 0;
					width: 30px;
					.mui-icon{
						display: inline-block;
						position: absolute;
						top: 50%;left: 3px;
						transform: translateY(-50%);
						color: #888;
					}
				}
			}
		}
		.part3{
			margin-top: 23px;
			&>.btn{
				margin: 0 auto;
				width: 88%;
				height: 44px;
				line-height: 44px;
				font-size: 17px;
				background: rgba(22,158,25,0.9);
				color: white;
				letter-spacing: 1px;
				border-radius: 5px;
				text-align: center;
			}
		}
	}
</style>
