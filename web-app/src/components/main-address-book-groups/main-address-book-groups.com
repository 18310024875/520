<template>
	<div class="main-address-book-groups">
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
						<span class="mui-icon mui-icon-home ic1"></span>
					</div>
				</div>
				<div class="col2" @click="this.group_create.bind(this)">
					<span class="name">创建群聊</span>
				</div>
			</div>

			<div class="p-row">
				<div class="col1 part2-2">
					<div class="ava-wrap">
						<span class="mui-icon mui-icon-contact ic1"></span>
					</div>
				</div>
				<div class="col2" @click="()=>{ location.hash='/main/addressBook/friends' }">
					<span class="name">我的好友</span>
				</div>
			</div>
		</div>
		<!-- 人员 -->
		<div class="part3">

			<groups :listobj="this.listobj"></groups>

		</div>
	</div>
</template>
<script type="text/javascript">

	import searchInput from 'components/common/search-input';
	import groups from './groups';
	export default{
		components:{
			searchInput ,
			groups
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
					method:'room_getGroups',
					data:{
						kw: this.kw
					},
					success:( res )=>{
						this.listobj = res ;
						this.$diff ;
					}
				})
			},
			group_create(){
				this.$root.openSelectMan( '' , list=>{
					if( list.length>=1 ){
						mui.prompt('请输入房间名称','','',['取消','确定'],(data)=>{
							if( data.index==1 && data.value.trim() ){
								App.imAjax({
									method: 'group_create',
									data:{
										name: data.value.trim() ,
										ids: list.map(v=>v.uid).join()
									},
									success: res=>{
										this.getList();
									}
								})
							}
						})
					}
				})
			}
		}
	}
</script>
<style lang="less">
	.main-address-book-groups{
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
					font-size: 35px;
					position: relative;
					top: 4px;
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
					font-size: 34px;
					position: relative;
					top: 4px;
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