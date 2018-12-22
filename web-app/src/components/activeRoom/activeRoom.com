<template>
	<div class="activeRoom">
		<!-- 头 -->
		<header class="mui-bar mui-bar-nav">
			<a class="white mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
			<h1 class="white mui-title"> 
				{{this.getRoomName()}}
			</h1>
			<div class="white fr mui-icon" v-if="this.roomDetail.type=='0'">
				<span class="sp1"></span><span class="sp2"></span><span class="sp3"></span>
			</div>
			<div class="white fr mui-icon" v-if="this.roomDetail.type=='1'" @click="this.toggleMask">
				<span style="font-size:16px;">人员+</span>
			</div>
		</header>
		<!-- 人员浮层 -->
		<ul class="mask-man-list" v-if="this.roomDetail.type=='1' && this.openMaskManList" @click="this.closeMask">
			<li class="ava-wrap" v-for="(man,k) in this.roomDetail.manList">
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
				v-if="this.$root.userInfo.uid!=this.roomDetail.creator_id"
				@click="this.updateMans">
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
	
	import talkBar from 'components/common/talk-bar.com';
	import itemOfTalk from  './item-of-talk.com';

	export default{
		components:{
			talkBar,
			itemOfTalk
		},

		data(){
			return {
				// 地址上的房间id
				room_id:'',
				// 房间详情
				roomDetail:'',
				// 谈话列表
				talkList:[],
				// 输入值
				value:'',
				// 打开人员信息浮层
				openMaskManList:false
			}
		},
		
		mounted(){
			this.firstInIt();

			this.$evtbus.off('messageRoom').on('messageRoom',(talk)=>{
				try{
					if( talk ){
						this.talkList.push(talk);
						this.$diff ;

						let dom = this.$refs.scroll ;
						let offsetHeight = dom.offsetHeight ;
						let scrollTop = dom.scrollTop ;
						let scrollHeight = dom.scrollHeight ;
						if( scrollHeight-(offsetHeight+scrollTop)<400 ){
							dom.scrollTop = 9999 ;
						}else{

						}
					}
				}catch(e){};
			})
		},

		methods:{
			// 第一次进入页面 ;
			firstInIt(){
				let room_id = this.$router.query.room_id ;
				if( room_id ){
					this.room_id = room_id ;
					// 请求房间信息
					this.getRoomDetail();
					// 请求列表 ;
					this.getTalkList();
				}
			},
			// 请求房间信息
			getRoomDetail(){
				this.$root.getRoomDetail(this.room_id,roomDetail=>{
					this.roomDetail=roomDetail;
					this.$diff ;
				})
			},
			// 请求列表 ;
			getTalkList(){
				this.$root.getTalkListFromRoomId( this.room_id , '' , talkList=>{
					console.error( talkList )
					this.talkList = talkList ; 
					this.$diff ;

					// 初始滚动最底层
					let dom = this.$refs.scroll ;
					dom.scrollTop = 9999 ;

					this.init_scrollFn();
				})
			},
			// 正确房间名
			getRoomName(){
				let d = this.roomDetail ;
				if( d ){
					if(d.type=='1'){
						return `群聊 : ${d.room_name}(${d.manList.length})` || '暂无房间名'
					}else{
						let manList = d.manList;
						if( manList.length<=2 ){
							let uid = this.$root.userInfo.uid ;
							let sender = manList.filter((a,b)=>(a.uid!=uid));
							if( sender.length==1 ){
								return sender[0].cname
							}else if(sender.length==0){
								return 'Talk with youself'
							}else{
								return '--->房间观察者--->'
							}
						}else{
							return '人员列表超过3人'
						}
					}
				}else{
					return ''
				}
			},
			// 上拉加载 ;
			init_scrollFn(){
				let dom = this.$refs.scroll ;
				dom.onscroll = (e)=>{
					if( dom.scrollTop==0 ){
						let last_id = (this.talkList[0]&&this.talkList[0].talk_id) || '' ;
						// 请求列表 ;
						this.$root.getTalkListFromRoomId(this.room_id , last_id , newTalkList=>{
							if( newTalkList.length ){
								let dom = this.$refs.scroll ;
								let old_scrollHeight = dom.scrollHeight ;

								this.talkList = newTalkList.concat( this.talkList );
								this.$diff ;

								// 上拉加载 更新数据后恢复滚动高度 ;
								let new_scrollHeight = dom.scrollHeight ;
								dom.scrollTop = new_scrollHeight - old_scrollHeight ;
							}
						})
					} 
				}
			},
			// 广播文本 ;
			sendText(value){
				this.value = value ;
				this.$diff ;
				if( this.value ){
					this.$root.sendMessageToRoom( this.room_id , this.value , '' ,res=>{
						this.value='';this.$diff ;
					});
				}
			},
			// 广播文件 ;
			sendFile(file){
				this.$root.sendMessageToRoom( this.room_id , '' , file.fid ,res=>{
					
				});
			},
			// 操作人员
			updateMans(e){
				e.stopPropagation();
				let join_ids = this.roomDetail.manList.map(user=>user.uid).join(',');
				this.$root.openSelectMan(join_ids, users=>{
					let new_join_ids = users.map(user=>user.uid).join(',');
					App.imAjax({
						method:'updateRoomJoinids',
						data:{
							room_id: this.roomDetail.room_id ,
							join_ids: new_join_ids
						},
						success:()=>{
							this.getRoomDetail()
						}
					})
				})
			},
			toggleMask(){
				this.openMaskManList = !this.openMaskManList ;
				this.$diff ;
			},
			closeMask(){
				this.openMaskManList = false ;
				this.$diff ;
			}
		}
	}
</script>
<style lang="less">
	.activeRoom{
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
				padding-top: 3.5px;
				border-top: 0.5px solid #ddd;
			}
		}
	}
</style>
