<template>

	<!-- 链接成功socketId不为空 ; -->
	<div class="_IM" v-if="this.socketId">

		<imBar 
			v-show="!this.openImMask"
			:imBarStr="this.imBarStr"
			@click="this.openImMaskFn"/>

		<imLogin 
			v-if="!this.isLogin && this.openImMask"
			:SOCKET_ID="this.socketId"
			:LOGIN_SUCCESS="this.loginSuccess.bind(this)"/>

		<imContent 
			:ROOM_LIST="this.roomList"
			:ACTIVE_ROOM_INFO="this.activeRoomInfo"
			v-if=" this.userInfo && this.isLogin && this.openImMask"/>

	</div>

</template>
<script type="text/javascript">
	
	import imBar from './im-bar';
	import imContent from './im-content';
	import imLogin from './im-login';
	import config from 'src/config';

	export default{
		components:{
			imBar ,
			imContent ,
			imLogin
		},

		imMessage( data ){
			console.log(data)
			
			let type = data.type ;
			let content = data.content ;
			switch( type ){
				case 'connected':
					this.IM_connected( content );
					break ;
				case 'talk':
					this.MESSAGE_addTalkToRoom( content );
					break ;
			}
		},

		data(){
			return {
				//判断是否socket链接成功
				socketId:'',
				//传递底部按钮字段
				imBarStr:'尚未登录',
				// 用户是否已经登录  
				isLogin:false,

				//判断是否打开im浮层 
				openImMask:false,

				// userInfo;
				userInfo:'',

				// 所有房间;
				roomList:[],
				// 当前活动的房间 ;
				activeRoomInfo:{
					roomId:'',
					talkList:[]
				}
			}
		},

		created(){
			window.IM = this ;
		},

		methods:{
			// 链接IM成后返回socketId , 存入本地 ; 
			IM_connected( socketId ){
				this.socketId = socketId ;
				this.$diff ;

				// 判断im是否登录
				this.IM_isLogin( socketId );
			},
			// 判断im是否登录 
			IM_isLogin(){
				this.$ajax2({
					type:'post',
					url:'/ws/isLogin',
					data:{
						socketId: this.socketId
					},
					success( res ){
						if( res.code==0 ){

							this.loginSuccess();
						}else{
							this.imBarStr='尚未登录';
							this.isLogin=false;
							this.$diff ;
						}
					}
				})
			},

			// login组件登录回调 ;
			loginSuccess(){
				this.imBarStr='登录成功';
				this.isLogin=true;
				this.$diff ;

				// 获取用户信息
				this.getUserInfo();

				// 登录状态会自动请求数据
				this.defaultGetData();
			},

			// 获取用户信息
			getUserInfo(){
				this.$ajax2({
					url:'/ws/getUserInfo',
					success( res ){
						if( res.code==0 ){
							this.userInfo = res.data[0] ;
							this.$diff ;
						}else{
							this.$ui.say( res.msg )
						}
					}
				})
			},

// 设置房间列表 ;       
			MESSAGE_setRoomList( roomList ){
				this.roomList = roomList ;
				this.$diff ;
			},
// 设置当前活动房间信息 ;
			MESSAGE_setActiveRoomInfo( info , scrollTop ){
				this.activeRoomInfo={
					...this.activeRoomInfo ,
					...info
				};
				this.$diff ;

				try{
					if( scrollTop ){
						let dom = document.querySelector('.imc-right-talk-list>.scroll');
						scrollTop=='top' ? dom.scrollTop=0 : null ;
						scrollTop=='bottom' ? dom.scrollTop=dom.scrollHeight : null ;
					}
				}catch(e){};
			},
// 活动房间被改变 ;
			MESSAGE_changeActiveRoom( room ){
				let room_id = room.room_id ;

				// 通过房间id得到谈话信息 ;
				this.getTalkFromRoomId( room_id , '' , talkList=>{
					// 谈话处理文件
					talkList = this.talkHandleFiles( talkList );

					// 更新活动信息 ;
					this.MESSAGE_setActiveRoomInfo({
						roomId: room_id ,
						talkList: talkList
					},'bottom');
				},);
			},
// 收到消息新创建的房间 ;
			MESSAGE_findAddRoom(room){
				let room_id = room.room_id ;

				var index=-1 ;
				this.roomList.map( (v,k)=>{
					room.room_id==v.room_id ? index=k : null ;
				})
				if( index==-1 ){
					this.roomList=[room].concat(this.roomList);
				}

				// 如果当亲无活动房间( 此种情况为roomList为空 ) ---> 设置活动房间为此房间 ;
				if( !this.activeRoomInfo.roomId ){
					this.MESSAGE_changeActiveRoom( room );
				}	

				this.$diff ;
			},
// IM向房间增加一条消息
			MESSAGE_addTalkToRoom( talk ){
				// 检查是否被新创建的房间广播
				this.MESSAGE_findAddRoom( talk.room );

				// 便利所有房间 设置房间推送消息 ;
				this.roomList = this.roomList.map( (v,i)=>{
					if( v.room_id==talk.room_id ){
						v.lastTalk = talk.talk_content
					}
					return v ;
				});
				this.$diff ;

				// 查找收到消息的房间是否是活动房间 ;
				if( this.activeRoomInfo.roomId==talk.room_id ){
					let talkList = this.activeRoomInfo.talkList.concat( [talk] ) ;
					// 谈话处理文件
					talkList = this.talkHandleFiles( talkList );
					// 更新活动信息 ;
					this.MESSAGE_setActiveRoomInfo({
						talkList: talkList
					},'bottom');
				};
			},
			// talk增加文件信息 ;
			talkHandleFiles( talkList ){
				talkList.map( talk=>{
					if( talk.files ){
						talk.files.map(file=>{
							let ext = file.originname.split('.').pop() ;
							let httpUrl = config['localHost']+file.serverUrl ;
							if( ['png','jpg','jpeg','jepg','gif'].indexOf(ext)>-1 ){
								file.isImg = true ;
								file.httpUrl = httpUrl ;
							}else{
								file.isFile = true ;
								file.httpUrl = httpUrl ;
								file.fileName = file.originname ;
								file.fileSize = (file.size/1024).toFixed(1)+'KB' ;
							}
						})
					}
				})
				return talkList ;
			},

			// 根据房间请求房间信息 ;
			defaultGetData(){
				// 得到所有房间 ;
				this.getAllJoinRooms( (roomIdList)=>{
					// 设置房间列表
					this.MESSAGE_setRoomList(roomIdList); 

					let room = roomIdList[0];
						room ? this.MESSAGE_changeActiveRoom( room ) : null ;
				})
			},
			// 得到所有房间
			getAllJoinRooms( callback ){
				this.$ajax2({
					type:'post',
					url:'/ws/getAllJoinRooms',
					success(res){
						callback&&callback( res.data );
					}
				})
			},
			// 根据room_id请求谈话详情
			getTalkFromRoomId( room_id , last_id , callback ){
				this.$ajax2({
					url:'/ws/getTalkFromRoomId',
					data:{
						room_id: room_id ,
						last_id: last_id
					},
					success(res){
						callback&&callback( res.data );
					}
				})
			},

			// 是否打开im浮层函数 ;
			openImMaskFn(){
				this.openImMask=true ;
				this.$diff ;
			},
		}
	}
</script>
<style lang="less">
	._IM{
		position: absolute;
	}
</style>