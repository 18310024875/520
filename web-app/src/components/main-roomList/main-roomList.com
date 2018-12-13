<template>
	<div class="main-roomList">

		<div class="item-room" v-for="(item,index) in this.$root.roomInfoList" @click="this.goActiveRoom(item.room_id)">
			<div class="col1">
				<div class="r-a-wrap">

					<g_room_avatar :data="item" :size="55" :fontSize="20"/>

				</div>
			</div>
			<div class="col2">
				<div class="name">{{ this.renderName(item) }}</div>
				<div class="laststr">{{ (item.lastTalk && item.lastTalk.talk_content)||''}}</div>
				<div class="time">{{ this.time(item.lastTalk && item.lastTalk.ctime) }}</div>
			</div>
		</div>

	</div>
</template>
<script type="text/javascript">
	
	export default{
		components:{

		},

		data(){
			return {

			}
		},

		mounted(){

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
			time(t){
				return t?App.$tool.time(+t):''
			},
			goActiveRoom(room_id){
				// 路由跳转 ;
				location.hash = `/activeRoom?room_id=${room_id}`;
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
		.item-room{
			position: relative;
			padding: 10px 12px;
			border-bottom: 0.5px solid #ddd;
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
					background: red;
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