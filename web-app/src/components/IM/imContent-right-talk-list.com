<template>
	<div class="imc-right-talk-list">
		<div class="scroll" ref="scroll">

			<rightTalkListItem 
				v-for="(item,k) in this.ACTIVE_ROOM_INFO.talkList"
				:data="item"/>

		</div>
	</div>
</template>
<script type="text/javascript">
	
	/*
		props 
			ACTIVE_ROOM_INFO
	*/

	import rightTalkListItem from './imContent-right-talk-list-item' ;
	export default{
		components:{
			rightTalkListItem
		},

		data(){
			return {

			}
		},

		mounted(){
			let dom = this.$refs.scroll ;

			setTimeout(()=>{
				dom.scrollTop = dom.scrollHeight ;
			},150);

			dom.onscroll=()=>{
				this.scrollTopGetMore( dom.scrollTop )
			}
		},

		methods:{
			scrollTopGetMore( sT ){
				if( sT==0 && this.ACTIVE_ROOM_INFO.talkList[0] ){
					let last_id = this.ACTIVE_ROOM_INFO.talkList[0].talk_id ;
					let room_id = this.ACTIVE_ROOM_INFO.roomId ;
					this.$ajax2({
						url:'/ws/getTalkFromRoomId',
						data:{
							last_id,
							room_id
						},
						success(res){
							let talkList = res.data.concat( this.ACTIVE_ROOM_INFO.talkList );
							// 谈话处理文件
							talkList = IM.talkHandleFiles( talkList );
							//  更新会话信息 ;
							IM.MESSAGE_setActiveRoomInfo({
								talkList:talkList
							}, 'top' );
						}
					})
				}
			}
			
		}
	}
</script>
<style lang="less">
	.imc-right-talk-list{
		position: absolute;
		left: 0;right: 0;
		top: 0;bottom: 0;
		background: #f8f8f8;
		&>.scroll{
			height: 100%;
			overflow: auto;
			padding: 0  20px;
			padding-bottom: 20px;
		}
	}
</style>