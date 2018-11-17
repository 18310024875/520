<template>
	<div class="imc-left-rooms">
		
		<!-- 所有房间 ( 单聊 , 群聊 ) -->
		<div 
			v-for="(item,k) in this.ROOM_LIST"
			class="room-item cp" 
			:class="{ active: item.room_id==this.ACTIVE_ROOM_INFO.roomId }"
			@click="this.changeActiveRoom( item )">	
			<div class="part1" :type="item.room_name?'团队':'单聊'">
				<h1></h1>
				<div class="avawrap">
					<gAvatar 
						:size="'39px'"
						:fontSize="'14px'"
						:avatar="item.avatar" 
						:name=" this.getName( item ) ">		
					</gAvatar>
				</div>
			</div>
			<div class="part2">
				<div class="name">{{ this.getName( item ) }}</div>
				<div class="tic">
					<!-- 接受数据 -->
					<!-- 房间收到新消息自动放入 -->
					{{ item.lastTalk||'' }}
				</div>
				<div class="pr" style="display:none;">
					<!-- 未读条数 -->
				</div>
			</div>
		</div>

	</div>
</template>
<script type="text/javascript">
	
	/*
		props:{
			ROOMS ,
			ACTIVE_ROOM_INFO
		}
	*/

	export default{
		components:{

		},

		data(){
			return {
				list:[

				]
			}
		},
		methods:{
			getName( room ){
				// 单聊
				if( !room.room_name ){
					let users = room.users ;
					let selfUid = IM.userInfo.uid ;
					// 和自己聊天
					if(users.length==1 && selfUid==users[0].uid){
						return 'Self：'+users[0].cname
					}else{
						// 和别人聊天 
						for(var i=0 ; i<users.length ; i++){
							if( users[i].uid != selfUid ){
								return users[i].cname ;
							}
						}
					}
				}
				// 团队
				else{
					return '团队：'+room.room_name ;
				}
			},
			changeActiveRoom( room ){
				// 改变活动信息 ;
				IM.MESSAGE_changeActiveRoom( room );
			}
		}
	}
</script>
<style lang="less">
	.imc-left-rooms{
		position: absolute;
		left: 0;right: 0;
		top: 0;bottom: 0;
		background: #fcfcfc;
		.room-item{
			height: 60px;
			padding-left: 60px;
			position: relative;
			.part1{
				position: absolute;
				left: 0;top: 0;bottom: 0;
				width: 60px;
				padding-top: 10px;
				padding-left: 17px;
				h1{
					display: none;
					width: 20px;
					height: 20px;
					position: absolute;
					left: -1px;top: 18px;
					cursor: pointer;
					transform: rotate(45deg) scale(0.8);
					&::before{
						content:'';display: inline-block;
						width:1px;
						position: absolute;
						left: 10px;
						top: 5px;
						bottom: 4px;
						background: #999
					};
					&::after{
						content:'';display: inline-block;
						height: 1px;
						position: absolute;
						left: 5px;
						right: 4px;
						top: 10px;
						background: #999
					};
					&:hover{
						&::before{
							background:rgb(228, 97, 92);
						};
						&::after{
							background:rgb(228, 97, 92);
						};
					};
				}
				.avawrap{
					width: 39px;
					height: 39px;
					overflow: hidden;
				}
			}
			.part2{
				padding-top: 9px;
				padding-left: 6px;
				.name{
					color: #333;
					font-size: 14px;
					line-height: 25px;
					position: relative;
				}
				.tic{
					color: #999;
					font-size: 12px;
				}
				.pr{
				    position: absolute;
				    right: 0;
				    top: 0;
				    background-color: #ff4e5b;
				    color: #fff;
				    border-radius: 50%;
				    font-style: normal;
				    font-size: 20px;
				    box-sizing: border-box;
				    -webkit-transform: scale(.5);
				    transform: scale(.5);
				    line-height: 13px;
				    width: 28px;
				    height: 28px;
				    text-align: center;
				    line-height: 27px;
				}
			}
		}	
		.room-item:hover{
			.part1{
				h1{
					display: inline-block;
				}
			}
		}
		.room-item.active{
			background: #ededed;
		}
	}
</style>