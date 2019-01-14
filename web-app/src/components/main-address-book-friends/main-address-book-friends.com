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

			<!-- 加我的人 -->
			<ul class="notic">
				<li class="man-item p-row" 
					v-for="(v,k) in this.$root.unread.list2"
					style="border-bottom:1px solid #ddd"
					@click="this.viewUser.bind(this, v.uid)">
					<div class="col1">
						<div class="ava-wrap">
							<g_avatar 
								:radius="false"
								:width="'44px'"
								:height="'44px'"
								:fontSize="'20px'"
								:avatar="v.avatar" 
								:name="v.cname ">		
							</g_avatar>
						</div>
					</div>
					<div class="col2">
						<span class="name">{{v.cname}}</span>
						<div class="agree yes" @click=" this.agree.bind(this, v.user_friends_id, true ) ">
							接受
						</div>
						<div class="agree no" @click=" this.agree.bind(this, v.user_friends_id, false ) ">
							拒绝
						</div>
					</div>
				</li>
			</ul>


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
			agree( user_friends_id , status ,e){
				e.stopPropagation();

				App.imAjax({
					method:'user_friends_agree',
					data:{
						user_friends_id ,
						status
					},
					success: res=>{
						App.getUnreadAll();
						this.getList();
					}
				})
			},
			getList(){
				App.imAjax({
					method:'user_friends_myFriends',
					data:{
						kw: this.kw
					},
					success:( res )=>{
						this.listobj = res ;
						this.$diff ;
					}
				})
			},
			viewUser( uid ){
				location.hash=`#/userDetail?uid=${uid}`
			},
			// 添加好友 ;
			addFriend(){
				let ids = [] ;
				for(let k in this.listobj){
					let arr = this.listobj[k];
					arr.map(v=>{
						ids.push( +v.uid )
					})
				}

				this.$root.openSelectMan( ids.join() , list=>{
					let ids1 = ids ;
					let ids2 = list.map( v=>+v.uid ) ;

					let same = [];
					let len = Math.min( ids1.length , ids2.length );
					for(let i=0 ; i<len ; i++){
						if( ids1.indexOf( ids2[i] )>-1 ){
							same.push( ids2[i] )
						}
					}

					let add_arr=[] ;
					ids2.map( id=>{
						same.indexOf(id)==-1 ? add_arr.push(id) : null ;
					})
					let del_arr=[] ;
					ids1.map( id=>{
						same.indexOf(id)==-1 ? del_arr.push(id) : null ;
					})

					App.imAjax({
						method:'user_friends_handle',
						data:{
							add_ids: add_arr.join() ,
							del_ids: del_arr.join()
						},
						success: res=>{
							App.getUnreadAll();
							this.getList();
						}
					})
				})
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
		.notic{
			.man-item{
				.agree{
					width: 55px;height: 24px;line-height: 24px;
					border-radius: 3px;
					float: right;
					text-align: center;
					font-size: 13px;
				}
				.agree.yes{
					background: #19be6b;
					color: white;
					margin-right: 15px;
					margin-left: 10px;
				}
				.agree.no{
					background: white;
					color: #888;
					border:1px solid #ededed;
				}
			}
		}
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