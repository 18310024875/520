<template>
	<div class="connect-room">
		<!-- 头 -->
		<header class="mui-bar mui-bar-nav">
			<a  class="white mui-icon mui-icon-left-nav mui-pull-left" 
				@click="()=>{ history.go(-1) }"></a>
			<h1 class="white mui-title"> 
				{{this.getRoomName()}}
			</h1>
			<div class="white fr mui-icon" v-if="this.roomDetail.connect_friends">
				<span class="sp1"></span><span class="sp2"></span><span class="sp3"></span>
			</div>
			<div class="white fr mui-icon" v-if="!this.roomDetail.connect_friends" @click="this.toggleMask.bind(this)">
				<span style="font-size:16px;">人员+</span>
			</div>
		</header>

		<!-- 人员浮层 -->
		<ul class="mask-man-list" v-if="!this.roomDetail.connect_friends && this.openMaskManList" 
			@click="this.closeMask.bind(this)">
			<li class="ava-wrap" v-for="(man,k) in this.roomDetail.users">
				<g_avatar 
					style="display:inline-block;"
					:radius="true"
					:width=" 50+'px' "
					:height=" 50+'px' "
					:fontSize=" 20+'px' "
					:avatar=" man.avatar " 
					:name=" man.cname ">		
				</g_avatar>			
			</li>
			<!-- 创建人有权限操作 -->
			<li class="ava-wrap add" 
				v-if="this.$root.userInfo.uid==this.roomDetail.creator_id"
				@click="this.updateMans.bind(this)">
				<span class="mui-icon mui-icon-plus"></span>
			</li>
		</ul>

		<!-- 谈话内容 -->
		<div class="content">
			<div class="content-list" ref="scroll">
				<ul class="sm">

					<!-- 每条会话内容 -->
					<itemOfTalk 
						v-for="(talk,index) in this.talkList" 
						:data="talk">	
					</itemOfTalk>

					<h1 style="height:8px"></h1>
				</ul>
			</div>
			<div class="content-talk">

				<talkBar 
					style="height:100%;" 
					:value="this.value"
					:enter="this.sendText.bind(this)"
					:upload="this.sendFile.bind(this)">
				</talkBar>

			</div>
		</div>

	</div>
</template>
<script type="text/javascript">
	
	import talkBar from './talk-bar.com';
	import itemOfTalk from  './item-of-talk.com';

	export default{
		components:{
			talkBar,
			itemOfTalk
		},

		data(){
			let room_id = this.$router.query.room_id ;
			return {
				// 链接房间
				room_id ,
				// 房间详情
				roomDetail:'',
				// 谈话列表
				talkList:[],
				// 输入值
				value:'',
				// 操作人员浮层
				openMaskManList:false
			}
		},

		mounted(){
			if( this.room_id ){

				// 激活监听
				this.$evtbus.off('messageRoom').on('messageRoom', this.messageRoom.bind(this) );

				// 请求数据
				this.getTalkList();

				// 请求房间信息
				this.getRoomDetail();
			}else{
				mui.alert('缺少参数')
			}
		},

		methods:{
			// 发送文字
			sendText( val ){
				this.value = val ;
				this.$diff ;

				App.imAjax({
					method:'talk_insert',
					data:{
						room_id: this.room_id ,
						talk_fid: '' ,	
						talk_content: val||''				
					},
					success: res=>{
						console.log( this.value )
						this.value='';
						this.$diff ;
					}
				})
			},
			// 发送文件
			sendFile( file ){
				App.imAjax({
					method:'talk_insert',
					data:{
						room_id: this.room_id ,
						talk_fid: file.fid ,	
						talk_content: ''		
					},
					success: res=>{
						console.log( res )
					}
				})
			},
			// 接受im广播来的消息
			messageRoom( talk ){
				try{
					this.talkList.push(talk);
					this.$diff ;

					let dom = this.$refs.scroll ;
					let offsetHeight = dom.offsetHeight ;
					let scrollTop = dom.scrollTop ;
					let scrollHeight = dom.scrollHeight ;

					if( scrollHeight-(offsetHeight+scrollTop)<400 ){
						dom.scrollTop = 9999 ;
					}
				}catch(e){};
			},
			// 获取会话列表
			getTalkList(){
				App.imAjax({
					method:'talk_getList',
					data:{
						room_id: this.room_id ,
						last_id: this.talkList[0]&&this.talkList[0].talk_id
					},
					success: talkList=>{
						// 旧滚动高度
						let dom = this.$refs.scroll ;
						let old_scrollHeight = dom.scrollHeight ;

						this.talkList = talkList.concat( this.talkList );
						this.$diff ;

						// 恢复动高度
						let new_scrollHeight = dom.scrollHeight ;
						dom.scrollTop = new_scrollHeight - old_scrollHeight ;

						// 上拉加载
						if( !this.__scroll ){
							this.__scroll = true ;
							// 上拉加载
							dom.onscroll = (e)=>{
								dom.scrollTop==0 ? this.getTalkList() : null ;
							}
						}
					}
				})
			},
			// 获取房间详情
			getRoomDetail(){
				App.imAjax({
					method:'room_getDetail',
					data:{
						room_id: this.room_id
					},
					success: res=>{
						this.roomDetail = res ;
						this.$diff ;
					}
				})
			},	
			//getRoomName
			getRoomName(){
				let d = this.roomDetail ;
				if( d.connect_friends ){
					let self = this.$root.userInfo.uid ;
					let users = d.users ;
					let thatman = users.filter(v=>v.uid!=self)[0];
					return thatman.cname ;
				}else if( d.room_name ){
					return d.room_name;
				}else{
					return '';
				}
			},
			// 操作人员
			updateMans(e){
				e.stopPropagation();
				let join_ids = this.roomDetail.users.map(user=>user.uid).join(',');
				this.$root.openSelectMan(join_ids, users=>{
					let arr = users.map(user=>+user.uid);
						arr.indexOf(+this.$root.userInfo.uid)==-1 ? arr.push(+this.$root.userInfo.uid): null ;
					let new_join_ids = arr.join(',');
					App.imAjax({
						method:'room_users_update',
						data:{
							room_id: this.room_id,
							join_ids: new_join_ids
						},
						success:()=>{
							this.getRoomDetail()
						}
					})
				})
			},
			closeMask(){
				this.openMaskManList = false ;
				this.$diff ;
			},
			toggleMask(){
				this.openMaskManList = !this.openMaskManList ;
				this.$diff ;
			},
		}
	}
</script>
<style lang="less">
	.connect-room{
		position: absolute;
		left: 0;right: 0;
		top: 0;bottom: 0;
		.mask-man-list{
			position: fixed;
			left: 0;top: 44px;bottom: 0;right: 0;
			background: rgba(235,235,235,0.8);
			z-index: 1;
			overflow: auto;
			padding-bottom: 20px;
			.ava-wrap{
				width: 16.6%;
				float: left;
				text-align: center;
				font-size: 0;line-height: 0;
				padding-top: 15px;
			}
			.ava-wrap.add{
				.mui-icon{
					font-size: 50px;
					color: #999;
				}
			}
		}
		&>header{
			background: #222;
			color: white;
			position: relative;
			&>.white{
				color: white
			}
			.fr{
				position: absolute;
				right: 12px;
				.sp1,.sp2,.sp3{
					vertical-align: middle;
					display: inline-block;
					margin-left: 3px;
					margin-top: 3px;
					width: 3px;height: 3px;background: white;border-radius: 50%;
				}
			}
		}
		&>.content{
			position: absolute;
			left: 0;right: 0;
			top: 44px;bottom: 0;
			.content-list{
				position: absolute;
				left: 0;right: 0;
				top: 0;bottom: 50px;
				overflow: auto;
				&>.sm{
					padding: 0 12px;
				}
			}
			.content-talk{
				position: absolute;
				bottom: 0;left: 0;right: 0;
				height: 50px;
				border-top: 0.5px solid #ddd;
			}
		}
	}
</style>