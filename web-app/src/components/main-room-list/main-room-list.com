<template>
	<div class="main-room-list">
		<div class="nodata" 
			v-if="this.roomInfoList.length==0">
			<img src="assets/images/nodata.png"/>
			<p>暂无数据...</p>
		</div>

		<div class="item-room"
			v-if="this.roomInfoList.length>0"
			v-for="(item) in this.roomInfoList" 
			v-show=" !item.hide "
			@click="this.goActiveRoom.bind(this,item)">
			<div class="col1">
				<div class="r-a-wrap">

					<g_room_avatar :data="item" :size="55" :fontSize="20"/>

				</div>
			</div>
			<div class="col2">
				<div class="name elli">{{ this.renderName(item) }}</div>
				<div class="laststr elli">{{ this.renderLastTalk(item) }}</div>
				<div class="time">{{ this.renderLastTalkTime(item) }}</div>
			</div>
			<!-- 长按菜单 -->
			<ul class="long-tap-menu" v-show="item.showMenu">
				<li @click="this.hideOneRoom.bind(this,item)">删除</li>
				<li @click="this.hideMenu.bind(this,item)">取消</li>
			</ul>
		</div>

	</div>
</template>
<script type="text/javascript">
	
	export default{
		data(){
			return {
				roomInfoList:[]
			}
		},

		mounted(){
			this.room_getRoomInfoList();

			this.$evtbus.off('messageRoom').on('messageRoom',(talk)=>{
				// 存在新消息的房间重新请求接口 ;
				this.room_getRoomInfoList();
			})
		},
		destroyed(){

		},

		methods:{
			room_getRoomInfoList(){
				App.imAjax({
					method:'room_getRoomInfoList',
					success:( data=[] )=>{
						this.roomInfoList=data 
						this.$diff ;  
					}
				})
			},
			renderName( item ){
				let d = item ;
				if( d.connect_friends ){
					let users = d.users;
					if( users.length<=2 ){
						let uid = this.$root.userInfo.uid ;
						let sender = users.filter((a,b)=>(a.uid!=uid));
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
				}else{
					return `群聊 : ${d.room_name}(${d.users.length})`;
				}				
			},
			renderLastTalk(item){
				let lastTalk = item.lastTalk ;
				if( lastTalk ){
					if( lastTalk.file_originname ){
						return lastTalk.file_originname;
					}else{
						return lastTalk.talk_content||''
					}
				}else{
					return '';
				}
			},
			renderLastTalkTime(item){
				let t = item.lastTalk && item.lastTalk.ctime;
				return t?App.time(t):''
			},
			goActiveRoom(item){
				// 路由跳转 ;
				location.hash = `/connectRoom?room_id=${item.room_id}`;
			},
			// 长按显示更多操作
			longTap(item,e){
				this.roomInfoList.map( room=>{
					room.showMenu = false ;
				})
				item.showMenu = true ;
				this.$diff ;
			},
			hideOneRoom(item,e){
				e.stopPropagation();
				item.hide = true ;
				this.$diff ;
			},
			hideMenu(item,e){
				e.stopPropagation();
				item.showMenu = false ;
				this.$diff ;
			},
		}
	}
</script>
<style lang="less">
	.main-room-list{
		position: absolute;
		left: 0;right: 0;
		top: 0;bottom: 0;
		overflow: auto;
		.nodata{
			display: inline-block;
			position: absolute;
			left: 50%;top: 50%;
			transform: translate(-50%,-60%);
			p{
				font-size: 15px;
				color: #999;
				text-align: center;
				margin-top: 10px;
			}
		}
		.item-room{
			position: relative;
			padding: 10px 12px;
			border-bottom: 0.5px solid #ddd;
			.long-tap-menu{
				position: absolute;
				top: 14px;
				right: 15px;
				background: white;
				box-shadow: 0 0 10px rgba(0,0,0,0.3) ;
				padding-right: 18px;
				overflow: hidden;
				border-radius: 5px;
				li{
					display: inline-block;
					vertical-align: top;
					color: #999;
					font-size: 15px;
					padding: 8px 0;
					padding-left: 18px;
				}
			}
			&::after{
				content:'';
				display: inline-block;
				position: absolute;
				bottom: -1px;
				left: 0;
				width: 12px;
				height: 2px;
				background: white;
			}
			&:nth-last-of-type(1)::after{
				display: none;
			}
			&>.col1{
				.r-a-wrap{
					width: 55px;
					height: 55px;
					border-radius: 5px;
					overflow: hidden;
					position: relative;
					border:0.5px solid white;
					img{
						width: 100%;
						height: 100%;
					}
				}
			}
			&>.col2{
				position: absolute;
				top: 0;bottom: 0;right: 0;
				left: 78px;
				&>.name{
					color: #111;
					font-size: 18px;
					margin-right: 90px;
					margin-top: 15px;
				}
				&>.laststr{
					font-size: 14px;
					color: #999;
					margin-top: 4px;
				}
				&>.time{
					position: absolute;
					font-size: 14px;
					right: 13px;
					top: 12px;
					color: #999;
				}
			}
		}
	}
</style>