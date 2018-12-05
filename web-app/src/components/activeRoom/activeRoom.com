<template>
	<div class="activeRoom">
		<header class="mui-bar mui-bar-nav">
			<a class="white mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
			<h1 class="white mui-title"> 房间 11 </h1>
			<div class="white fr mui-icon">
				<span class="sp1"></span><span class="sp2"></span><span class="sp3"></span>
			</div>
		</header>
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
					:enter="this.sendMessageToRoom.bind(this)">
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
				// 谈话列表
				talkList:[],
				// 输入值
				value:'1',
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

						console.log( '888888888888----->' , scrollHeight-(offsetHeight+scrollTop) );
						if( scrollHeight-(offsetHeight+scrollTop)<200 ){
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
					// 请求列表 ;
					this.$root.getTalkListFromRoomId( this.room_id , '' , talkList=>{
						this.talkList = talkList ; 
						this.$diff ;

						// 初始滚动最底层
						let dom = this.$refs.scroll ;
						dom.scrollTop = 9999 ;

						this.init_scrollFn();
					})
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
			// 点击发送数据 ;
			sendMessageToRoom(value){
				this.value = value ;
				this.$diff ;
				if( this.value ){
					this.$root.sendMessageToRoom( this.room_id , this.value , '' );
				}
			}
		}
	}
</script>
<style lang="less">
	.activeRoom{
		position: absolute;
		left: 0;right: 0;
		top: 0;bottom: 0;
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