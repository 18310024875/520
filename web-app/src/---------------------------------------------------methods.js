
/*
	公用数据储存到一起 , 方便切换流畅 !!!!!!!! ;
*/

export default{
	// 数据
	data:{
		// 我的聊天列表 , 含最后一条消息 ;
		roomInfoList:[],
		// 所有用户
		allPeople:{},
		// 所有关于我的群
		groupJoined:{}
	},
	// 方法 ;
	methods:{
		// 向一个房间广播信息
		sendMessageToRoom( room_id , content , fid , yes){
			this.imAjax({
				method:'sendMessageToRoom',
				data:{
					room_id,
					content,
					fid
				},
				success:yes
			})
		},
		// 收到后台消息 --> 向一个房间广播信息 ;
		GET_SOCKET_OK_messageRoom(content){
			this.$evtbus.emit('messageRoom', content );
		},
		// 判断是否已经登录
		isLogin(){
			this.imAjax({
				next:true,
				method:'isLogin',
				success:(data)=>{
					data&&data[0] ? this.loginOk(data[0]) : null ;
				}
			})
		},


		// 获取和我相关的房间 和房间最后一条消息 ;
		getRoomInfoList(){
			App.imAjax({
				method:'getRoomInfoList',
				success:( data=[] )=>{
					let _data = JSON.parse((localStorage.roomInfoList||"[]"));

					data.map(room=>{
						// 单聊&&没人说话 , 默认隐藏 ;
						if(!room.lastTalk && room.type=='0'){
							room.hide = true ;
						}
						// 获取用户之前隐藏的房间 ;
						_data.map(_room=>{
							if(room.room_id==_room.room_id){
								room.hide = _room.hide ;
							}
						})
					})
					this.roomInfoList=data ; this.$diff ;
					// 保存操作 ;
					localStorage.roomInfoList = JSON.stringify( this.$root.roomInfoList||[] );   
				}
			})
		},
		// 所有人员
		getAllPeople( kw ){
			App.imAjax({
				method:'getAllPeople',
				data:{
					kw
				},
				success:( obj )=>{
					this.allPeople=obj ; this.$diff ;
				}
			})
		},
		// 得到所有加入的组群
		getGroupJoined( kw ){
			App.imAjax({
				method:'getGroupJoined',
				data:{
					kw
				},
				success:(obj)=>{
					this.groupJoined=obj ; this.$diff ;
				}
			})
		},

		// 根据room_id请求会话列表 ;
		getTalkListFromRoomId( room_id , last_id , yes ){
			App.imAjax({
				method:'getTalkListFromRoomId',
				data:{
					room_id ,
					last_id
				},
				success:yes
			})		
		},
		// 请求房间详情
		getRoomDetail(room_id,yes){
			App.imAjax({
				method:'getRoomDetail',
				data:{
					room_id
				},
				success: yes
			})
		},
		// 和一个人聊天
		talkToOne(uid,yes){
			App.imAjax({
				method:'talkToOne',
				data:{
					uid
				},
				success:yes
			})
		},
		createGroup(room_name,parts_ids,yes){
			App.imAjax({
				method:'createGroup',
				data:{
					room_name,
					parts_ids
				},
				success:yes
			})
		}

	}
}