<template>
	<div class="main-roomList">
		<div class="nodata" v-if="this.$root.roomInfoList.length==0">
			<img src="assets/images/nodata.png"/>
			<p>暂无数据...</p>
		</div>

		<div class="item-room tap"
			v-if="this.$root.roomInfoList.length>0"
			v-for="(item,index) in this.$root.roomInfoList" 
			v-show=" !item.hide "
			@longTap="this.longTap(item)" 
			@tap="this.goActiveRoom(item)">
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
				<li @tap="this.hideOneRoom(item)">删除</li>
				<li @tap="this.hideMenu(item)">取消</li>
			</ul>
		</div>

	</div>
</template>
<script type="text/javascript">
	
	export default{
		data(){
			return {}
		},

		mounted(){
			this.$root.getRoomInfoList();

			this.$evtbus.off('messageRoom').on('messageRoom',(talk)=>{
				try{
					// 存在新消息的房间 , 取消用户之前的隐藏 ;
					let _data = JSON.parse(localStorage.roomInfoList||"[]") ;
					_data.map(_room=>{
						if( talk.room_id == _room.room_id ){
							delete _room.hide ;
						}
					});
					// 保存操作 ;
					localStorage.roomInfoList = JSON.stringify(_data);
					// 请求接口 ;
					this.$root.getRoomInfoList();
				}catch(e){}
			})	
		},
		destroyed(){
			this.$root.roomInfoList.map( room=>{
				room.showMenu = false ;
			});
		},

		methods:{
			renderName( item ){
				let d = item ;
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
				return t?App.$tool.time(+t):''
			},
			goActiveRoom(item){
				console.log('goActiveRoom')
				// 路由跳转 ;
				location.hash = `/activeRoom?room_id=${item.room_id}`;
			},
			// 长按显示更多操作
			longTap(item,e){
				this.$root.roomInfoList.map( room=>{
					room.showMenu = false ;
				})
				item.showMenu = true ;
				this.$diff ;
			},
			hideMenu(item,e){
				e.stopPropagation();
				item.showMenu = false ;
				this.$diff ;
			},
			hideOneRoom(item,e){
				e.stopPropagation();
				item.hide = true ;
				this.$diff ;
				// 保存操作 ;
				localStorage.roomInfoList = JSON.stringify( this.$root.roomInfoList||[] );
			}
		}
	}
</script>
<style lang="less">
	.main-roomList{
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