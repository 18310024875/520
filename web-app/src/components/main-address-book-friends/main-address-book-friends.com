<template>
	<div class="main-address-book-friends">
		<!-- 输入框 -->
		<div class="part1">
			<searchInput 
				:value="this.kw" 
				:onEnter="( kw )=>{
					this.kw=kw ; 
					this.$diff ;
					this.getList();
				}">
			</searchInput>
		</div>
		<!-- 人员相关信息 -->
		<div class="part2">

			<div class="p-row">
				<div class="col1 part2-1">
					<div class="ava-wrap">
						<span class="mui-icon mui-icon-personadd ic1"></span>
					</div>
				</div>
				<div class="col2" @click="this.addFriend.bind(this)">
					<span class="name">添加好友</span>
				</div>
			</div>

			<div class="p-row">
				<div class="col1 part2-2">
					<div class="ava-wrap">
						<span class="mui-icon mui-icon-person ic1"></span>
						<span class="mui-icon mui-icon-person ic2"></span>
					</div>
				</div>
				<div class="col2" @click="()=>{ location.hash='/main/addressBook/groups' }">
					<span class="name">群聊</span>
				</div>
			</div>
		</div>
		<!-- 人员 -->
		<div class="part3">

			<friends :listobj="this.listobj"></friends>

		</div>

	</div>
</template>
<script type="text/javascript">

	import searchInput from 'components/common/search-input';
	import friends from './friends';
	export default{
		components:{
			searchInput ,
			friends
		},

		data(){
			return {
				listobj:{},
				kw:''
			}
		},

		mounted(){
			this.getList();
		},

		methods:{
			getList(){
				App.imAjax({
					method:'user_getFriends',
					data:{
						kw: this.kw
					},
					success:( res )=>{
						this.listobj = res ;
						this.$diff ;
					}
				})
			},
			// 添加好友 ;
			addFriend(){

			}
		}
	}
</script>
<style lang="less">
	.main-address-book-friends{
		position: absolute;
		left: 0;right: 0;
		top: 0;bottom: 0;
		overflow: auto;
		.part1{

		}
		.part2{
			.p-row:nth-last-of-type(1){
				border-bottom: none;
				&::after{
					display:none;
				}
			}
			.part2-1{
				.ava-wrap{
					color: white;
					text-align: center;
					line-height: 45px;
					background: #19be6b;
				}
				.ic1{
					color: white;
					font-size: 36px;
					position: relative;
					top: 3px;
				}
			}	
			.part2-2{
				.ava-wrap{
					text-align: center;
					line-height: 45px;
					background: #ff9900;
				}
				.ic1{
					color: white;
					font-size: 35px;
					position: absolute;
					top: 5px;
					left: 1px;
				}
				.ic2{
					color: white;
					font-size: 33px;
					position: absolute;
					top: 6px;
					left: 12px;
				}
			}
		}
		.part3{
			.work-item{
				&>p{
					margin: 0;padding: 0;
				    height: 24px;
				    line-height: 24px;
				    font-size: 15px;
				    color: #888;
				    background: #f1f1f1;
				    padding-left: 15px;
				}
				.p-row:nth-last-of-type(1){
					border-bottom: none;
					&::after{
						display:none;
					}
				}
			}
		}
		.p-row{
			position: relative;
			padding: 10px 14px;
			border-bottom: 0.5px solid #ddd;
			&::after{
				content:'';
				display: inline-block;
				position: absolute;
				bottom:-1px;
				left: 0;
				width: 13px;
				height: 2px;
				background: white;
			}
			&>.col1{
				.ava-wrap{
					width: 44px;
					height: 44px;
					border-radius: 1px;
					overflow: hidden;
					position: relative;
					img{
						width: 100%;
						height: 100%;
					}
				}
			}
			&>.col2{
				position: absolute;
				top: 0;bottom: 0;right: 0;
				left: 70px;
				padding-top: 20px;
				.name{
					color: #222;
					font-size: 17px;
				}
			}
		}
	}
</style>