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
				let uid = this.$root.userInfo.uid ;
				let manList = item.manList ;
				if( item.type==0 ){
					let s = manList.filter(man=>{
						return man.uid != uid ;
					})
					return s[0].cname ;
				}else{
					return item.room_name ;
				}
			},
			time(t){
				return App.$tool.time(+t)
			},
			goActiveRoom(room_id){
				// 路由跳转 ;
				location.hash = `activeRoom?room_id=${room_id}`;
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