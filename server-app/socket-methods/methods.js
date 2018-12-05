
// 方法 ;
var $common = require('./methods-common.js');
var $user = require('./methods-user.js');
var $talk = require('./methods-talk.js');
var $rooms = require('./methods-rooms.js');
var $files = require('./methods-files.js');

Array.prototype.has = function( k ){
	for(let i=0 ; i<this.length ; i++){
		if( this[i]==k ){
			return true
		}
	}
	return false
}


function m ( IO , socket ) {
	this.IO = IO ;
	this.socket = socket ;
};
m.prototype={
	// 处理客户端发来的数据
	imAjax( option ){
		let socket = this.socket ;
		let session = socket.handshake.session ;
		if( option.next===true ){
			// 不需要验证
		}else{
			// 需要验证
			if( !session.uid ){
				// 需要验证,不存在用户id 不执行方法 ;
				this.snedImAjaxRes(option,0,'user 验证不通过');
				return ;
			}
		}
		// 调用方法 ;
		this[ option.method ]&&this[ option.method ]( option );
	},
	// 向客户端发送数据
	snedImAjaxRes( opt={} , fn=true , data=null ){
		let socket = this.socket ;
		socket.emit('imMessage',{
				type:'imAjax',
				content:{
					opt: opt,
					fn: fn,
					data: data
				}
			})
	},

	// 登录成功 , 向session中注入用户信息 , 向socket对象注入uid ;
	loginOk_uidAppendToSession_uidAppendToSocket(uid){
		let socket = this.socket ;
			socket.uid = uid ;
		let session = socket.handshake.session ;
			session.uid = uid;
			session.save();
	},
	/*
		是否已经登录
			-----------> 1 每次断网重新连接 会生成一个新的socketid 
						 2 前端在此调用 isLogin
						 3 后台收到请求 , 如果登陆过 , 向socket实例中加入uid进行标识 ;
	*/	
	isLogin(opt){
		var $query = G.MYSQL.$query ;
		let socket = this.socket ;
		let session = socket.handshake.session ;

		// 本地环境 ---> 从地址上取uid , 请求接口 , 存入session; 避免验证 !!!! ; 
		if( opt.ENV=='dev' ){
			let r = socket.handshake.headers.referer ;
			let match = r.match(/uid=(\w+)/);
			let uid = match&&match[1] ;
			if( uid ){
				$query(`SELECT * FROM user WHERE uid="${uid}"`,res=>{
					if( res&&res[0] ){
						this.loginOk_uidAppendToSession_uidAppendToSocket( res[0].uid );
						this.snedImAjaxRes(opt, 1,res)
					};
				})
			}
		}
		// 正式环境 ---> 需要进行验证
		else{
			if( session.uid!=undefined ){
				$query(`SELECT * FROM user WHERE uid="${session.uid}"`,res=>{
					if( res&&res[0] ){
						this.loginOk_uidAppendToSession_uidAppendToSocket( res[0].uid );
						this.snedImAjaxRes(opt, 1,res)
					};
				})
			}else{
				this.snedImAjaxRes(opt,1, false )
			}
		}
	},
	// 登录
	login(opt){
		var $query = G.MYSQL.$query ;
		let socket = this.socket ;
		let session = socket.handshake.session ;
		let data = opt.data ;
		let account = data.account ;
		let password = data.password ;

		if(account&&password){
			$query(`SELECT * FROM user WHERE account="${account}" AND password="${password}"`,res=>{
				if( res&&res[0] ){
					this.loginOk_uidAppendToSession_uidAppendToSocket( res[0].uid );
					this.snedImAjaxRes(opt, 1,res)
				};
			})
		}else{
			this.snedImAjaxRes(opt,0,'缺少参数')
		}
	},
	// 注册
	register(opt) {
		var $query = G.MYSQL.$query;
		let socket = this.socket;
		let session = socket.handshake.session;
		let data = opt.data;

		let cname = data.cname;
		let ctime = $common.getTime();
		let account = data.account;
		let password = data.password;

		if(cname&&account&&password){
			$query(`SELECT * FROM user WHERE account="${account}"`,res=>{
				if(res.length){
					this.snedImAjaxRes(opt,0,'账号已存在')
				}else{
					$query(`INSERT user (cname,ctime,account,password) 
					VALUES("${cname}","${ctime}","${account}","${password}")`,res=>{
						if(res){
							$query(`SELECT * FROM user WHERE cname="${cname}"`,res=>{
								if( res&&res[0] ){
									this.loginOk_uidAppendToSession_uidAppendToSocket( res[0].uid );
									this.snedImAjaxRes(opt, 1,res)
								};
							})
						}else{
							this.snedImAjaxRes(opt,0,'注册失败') ;
						}
					})
				}
			})
		}
	},

	// 获取所有人员
	getAllPeople(opt){
		var $query = G.MYSQL.$query ;
		let socket = this.socket ;
		let session = socket.handshake.session ;
		$query(`SELECT * FROM user`,res=>{
			let wordObj = $common.parseArrayMakeWordObj(res,'cname');
			this.snedImAjaxRes(opt,1, wordObj ) ;
		})
	},
	// 和自己相关的组群
	getGroupJoined(opt) {
		var $query = G.MYSQL.$query;
		let socket = this.socket;
		let session = socket.handshake.session;

		let uid = session.uid;
		$query(`SELECT * FROM rooms WHERE type=1`, res => {
			res = res.filter(v => {
				let ids = $common.split_s(v.join_ids);
				return ids.has(uid);
			})
			let wordObj = $common.parseArrayMakeWordObj(res, 'room_name');
			this.snedImAjaxRes(opt, 1, wordObj);
		})
	},

	// 根据房间id获取会话列表
	getTalkListFromRoomId(opt){
		var $query = G.MYSQL.$query;
		let socket = this.socket;
		let session = socket.handshake.session;
		let data = opt.data ;

		let room_id = data.room_id ;
		let last_id = data.last_id ;
		if( room_id ){
			let dft = `
				SELECT
					talk.*,
					user.cname as creator_cname,
					user.name as creator_name,
					user.avatar as creator_avatar,
					rooms.room_name as room_name,
					rooms.join_ids as room_join_ids,
					rooms.creator_id as room_creator,
					files.size as file_szie,
					files.indexname as file_indexname,
					files.originname as file_originname,
					files.serverUrl as file_serverUrl,
					files.dirUrl as file_dirurl,
					files.creator_id as file_creator_id
				FROM talk 
					LEFT JOIN user  ON talk.creator_id=user.uid
					LEFT JOIN rooms ON talk.room_id = rooms.room_id 
					LEFT JOIN files ON talk.talk_fid=files.fid`;

			// 联查文件信息 , 创建人 ;
			let where = null ;
			if( !last_id ){
				where = ` WHERE talk.room_id="${room_id}" ORDER BY talk.talk_id DESC LIMIT 0,30`
			}else{
				where = ` WHERE talk.room_id="${room_id}" AND talk.talk_id<"${last_id}" ORDER BY talk.talk_id DESC LIMIT 0,30`;
			};

			let sq = `${dft}${where}`
			$query( sq , res=>{
				this.snedImAjaxRes(opt, 1, res.reverse());
			})	
		}
	},

	// 收到请求-->向一个房间发送信息
	sendMessageToRoom( opt ){
		var $query = G.MYSQL.$query;
		let socket = this.socket;
		let session = socket.handshake.session;
		let data = opt.data ;

		let creator_id = session.uid ;
		let room_id = data.room_id ;
		let talk_content = data.content || "" ;
		let talk_fid = data.fid || "" ;
		let ctime = $common.getTime();

		if(creator_id&&room_id){
			let sq = `
				INSERT talk (creator_id,room_id,talk_content,talk_fid,ctime) 
					VALUES("${creator_id}","${room_id}","${talk_content}","${talk_fid}","${ctime}")`;
			$query( sq , res=>{
				if( res ){
					this.snedImAjaxRes(opt, 1,'发送成功');
				
					// 查出消息 , 广播出去
					let sq = `				
						SELECT
							talk.*,
							user.cname as creator_cname,
							user.name as creator_name,
							user.avatar as creator_avatar,
							rooms.room_name as room_name,
							rooms.join_ids as room_join_ids,
							rooms.creator_id as room_creator,
							files.size as file_szie,
							files.indexname as file_indexname,
							files.originname as file_originname,
							files.serverUrl as file_serverUrl,
							files.dirUrl as file_dirurl,
							files.creator_id as file_creator_id
						FROM talk 
							LEFT JOIN user  ON talk.creator_id=user.uid 
							LEFT JOIN rooms ON talk.room_id = rooms.room_id
							LEFT JOIN files ON talk.talk_fid=files.fid
						WHERE talk.ctime="${ctime}"`
					$query(sq, taliList=>{
						this.messageRoom( taliList[0] );
					})
				}else{
					this.snedImAjaxRes(opt, 0,'发送失败');
				}
			})
		}
	},
	// 向一个房间广播消息 
	messageRoom( talk ){ 
		let IO = this.IO ;
		let join_ids = talk.room_join_ids||'';
		let idsarr = $common.split_s(join_ids);
		let sockets_s = IO.sockets.sockets ;
		for(let k in sockets_s){
			let socket = sockets_s[k];
			let uid = socket.uid || -1 ;
			if( idsarr.has(uid) ){
				socket.emit('imMessage',{
					type:'messageRoom',
					content: talk
				})
			}
		}
	},

	// 获取和我相关的房间 和房间最后一条消息 ;
	getRoomInfoList(opt){
		var $query = G.MYSQL.$query ;
		let socket = this.socket ;
		let session = socket.handshake.session ;

		let uid = session.uid ;
		$query(`SELECT 
					rooms.*,
					user.cname as creator_cname, 
					user.name as creator_name, 
				user.avatar as creator_avatar
				FROM rooms 
					JOIN user ON rooms.creator_id=user.uid `, res=>{
				let myrooms = res.filter(room=>{
				let join_ids = room.join_ids;
				let ids_arr = $common.split_s(join_ids);
				return ids_arr.has( uid );
			})
			// 房间添加人员列表 ;
			this.mapRoomsAddmanList(myrooms, myrooms2=>{
				// 房间添加最后消息 ;
				this.mapRoomsAddLastTalk(myrooms2, myrooms3=>{
					this.snedImAjaxRes(opt,1, myrooms3 ) ;
				})
			})
		})
	},

	// 便利房间列表 , 添加人员列表 ;
	mapRoomsAddmanList( roomList , callback ){
		var $query = G.MYSQL.$query ;
		let socket = this.socket ;
		let session = socket.handshake.session ;
		let len = roomList.length ;
		if( len>0 ){
			roomList.map( room=>{
				let join_ids = room.join_ids ;
				let ids_arr = $common.split_s(join_ids);
				let str = ids_arr.map(uid=>`uid="${uid}"`).join(` OR `);
				$query(`SELECT * FROM user WHERE ${str}`, res=>{
					room.manList = res ;
					len -- ;
					if(len==0){
						callback( roomList )
					}
				})
			})
		}else{
			callback( roomList )
		}
	},
	// 便利房间列表 , 添加最后发言 ;
	mapRoomsAddLastTalk(roomList , callback){
		var $query = G.MYSQL.$query ;
		let socket = this.socket ;
		let session = socket.handshake.session ;
		let len = roomList.length ;
		if( len>0 ){
			roomList.map( room=>{
				let room_id = room.room_id ;
				$query(`SELECT * FROM talk WHERE room_id="${room_id}" ORDER BY talk_id DESC `, res=>{
					room.lastTalk = res[0] ;
					len -- ;
					if(len==0){
						callback( roomList )
					}
				})
			})
		}else{
			callback( roomList )
		}
	}





}



module.exports = m;