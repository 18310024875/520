// 方法类 ;
function SocketMethods ( IO , socket ) {
	this.IO = IO ;
	this.socket = socket ;
	this.query = G.MYSQL.$query ;
};
SocketMethods.prototype={
	run(){
		let socket = this.socket ;
		// 1 链接成功  ;
		console.log('~~~~~用户连接 id='+socket.id );
		// 2 接受用户传来的事件 ;
		socket.on('imMessage', (res={})=>{
			switch( res.type ) {
				case 'imAjax':
					this.imAjax( res.content );
					break;

				default: break;
			}
		});
		// 3 断开连接  ;
		socket.on('disconnect', ()=>{
			console.log('~~~~~~断开连接连接 id='+socket.id );
		});
	},
	// 接受数据 ;
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
	// 发送数据 ;
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
};


// 加载methods下的方法 ;
var fs = require('fs');
var mpath = `${__dirname}/methods` ;
fs.readdirSync( mpath ).map( f=>{
	let dirPath = `${mpath}/${f}`;
	if( f.split('.').pop()=='js'&&fs.existsSync( dirPath ) ){
		let name = f.split('.')[0];
		SocketMethods.prototype[ name ] = require(dirPath) ;
	}
});

// 导出 ;
module.exports = SocketMethods;



// Array.prototype.has = function( k ){
// 	for(let i=0 ; i<this.length ; i++){
// 		if( this[i]==k ){
// 			return true
// 		}
// 	}
// 	return false
// }

// SocketMethods.prototype={

// 	// 处理客户端发来的数据
// 	imAjax( option ){
// 		let socket = this.socket ;
// 		let session = socket.handshake.session ;
// 		if( option.next===true ){
// 			// 不需要验证
// 		}else{
// 			// 需要验证
// 			if( !session.uid ){
// 				// 需要验证,不存在用户id 不执行方法 ;
// 				this.snedImAjaxRes(option,0,'user 验证不通过');
// 				return ;
// 			}
// 		}
// 		// 调用方法 ;
// 		this[ option.method ]&&this[ option.method ]( option );
// 	},




// 	// 通过sessionid获取用户
// 	getUserInfoFromSessionUid(opt){
// 		var $query = G.MYSQL.$query;
// 		let socket = this.socket;
// 		let session = socket.handshake.session;	

// 		let uid = session.uid ;
// 		$query(`SELECT * FROM user WHERE uid="${uid}"`, res=>{
// 			this.snedImAjaxRes(opt,1,res[0]) ;
// 		})
// 	},
// 	// 更新用户信息
// 	setUserInfo(opt){
// 		var $query = G.MYSQL.$query;
// 		let socket = this.socket;
// 		let session = socket.handshake.session;	
// 		let data = opt.data ;

// 		let uid = session.uid ;
// 		let age = data.age||'' ;
// 		let avatar = data.avatar||'';
// 		let cname = data.cname||'';
// 		let name = data.name||'';
// 		let des = data.des||'';
// 		let sex = data.sex||'';
// 		$query(`UPDATE user SET age="${age}",avatar="${avatar}",cname="${cname}",name="${name}",des="${des}",sex="${sex}" WHERE uid="${uid}"`, res=>{
// 				res ? this.snedImAjaxRes(opt, 1 ,'yes') : this.snedImAjaxRes(opt, 1 ,'no') ;
// 		})
// 	},



// 	// 根据房间id获取会话列表
// 	getTalkListFromRoomId(opt){
// 		var $query = G.MYSQL.$query;
// 		let socket = this.socket;
// 		let session = socket.handshake.session;
// 		let data = opt.data ;

// 		let room_id = data.room_id ;
// 		let last_id = data.last_id ;
// 		if( room_id ){
// 			let dft = `
// 				SELECT
// 					talk.*,
// 					user.cname as creator_cname,
// 					user.name as creator_name,
// 					user.avatar as creator_avatar,
// 					rooms.room_name as room_name,
// 					rooms.join_ids as room_join_ids,
// 					rooms.creator_id as room_creator,
// 					files.size as file_szie,
// 					files.indexname as file_indexname,
// 					files.originname as file_originname,
// 					files.serverUrl as file_serverUrl,
// 					files.creator_id as file_creator_id
// 				FROM talk 
// 					LEFT JOIN user  ON talk.creator_id=user.uid
// 					LEFT JOIN rooms ON talk.room_id = rooms.room_id 
// 					LEFT JOIN files ON talk.talk_fid=files.fid`;

// 			// 联查文件信息 , 创建人 ;
// 			let where = null ;
// 			if( !last_id ){
// 				where = ` WHERE talk.room_id="${room_id}" ORDER BY talk.talk_id DESC LIMIT 0,30`
// 			}else{
// 				where = ` WHERE talk.room_id="${room_id}" AND talk.talk_id<"${last_id}" ORDER BY talk.talk_id DESC LIMIT 0,30`;
// 			};

// 			let sq = `${dft}${where}`
// 			$query( sq , res=>{
// 				this.snedImAjaxRes(opt, 1, res.reverse());
// 			})	
// 		}
// 	},

// 	// 收到请求-->向一个房间发送信息
// 	sendMessageToRoom( opt ){
// 		var $query = G.MYSQL.$query;
// 		let socket = this.socket;
// 		let session = socket.handshake.session;
// 		let data = opt.data ;

// 		let creator_id = session.uid ;
// 		let room_id = data.room_id ;
// 		let talk_content = data.content || "" ;
// 		let talk_fid = data.fid || "" ;
// 		let ctime = $common.getTime();

// 		if(creator_id&&room_id){
// 			let sq = `
// 				INSERT talk (creator_id,room_id,talk_content,talk_fid,ctime) 
// 					VALUES("${creator_id}","${room_id}","${talk_content}","${talk_fid}","${ctime}")`;
// 			$query( sq , res=>{
// 				if( res ){
// 					this.snedImAjaxRes(opt, 1,'发送成功');
				
// 					// 查出消息 , 广播出去
// 					let sq = `				
// 						SELECT
// 							talk.*,
// 							user.cname as creator_cname,
// 							user.name as creator_name,
// 							user.avatar as creator_avatar,
// 							rooms.room_name as room_name,
// 							rooms.join_ids as room_join_ids,
// 							rooms.creator_id as room_creator,
// 							files.size as file_szie,
// 							files.indexname as file_indexname,
// 							files.originname as file_originname,
// 							files.serverUrl as file_serverUrl,
// 							files.creator_id as file_creator_id
// 						FROM talk 
// 							LEFT JOIN user  ON talk.creator_id=user.uid 
// 							LEFT JOIN rooms ON talk.room_id = rooms.room_id
// 							LEFT JOIN files ON talk.talk_fid=files.fid
// 						WHERE talk.ctime="${ctime}"`
// 					$query(sq, taliList=>{
// 						this.messageRoom( taliList[0] );
// 					})
// 				}else{
// 					this.snedImAjaxRes(opt, 0,'发送失败');
// 				}
// 			})
// 		}
// 	},
// 	// 向一个房间广播消息 
// 	messageRoom( talk ){ 
// 		let IO = this.IO ;
// 		let join_ids = talk.room_join_ids||'';
// 		let idsarr = $common.split_s(join_ids);
// 		let sockets_s = IO.sockets.sockets ;
// 		for(let k in sockets_s){
// 			let socket = sockets_s[k];
// 			let uid = socket.uid || -1 ;
// 			if( idsarr.has(uid) ){
// 				socket.emit('imMessage',{
// 					type:'messageRoom',
// 					content: talk
// 				})
// 			}
// 		}
// 	},


// 	// 请求房间信息
// 	getRoomDetail(opt){
// 		var $query = G.MYSQL.$query ;
// 		let socket = this.socket ;
// 		let session = socket.handshake.session ;
// 		let data = opt.data ;

// 		let room_id = data.room_id ;
// 		if( room_id ){
// 			$query(`SELECT 
// 						rooms.*,
// 						user.cname as creator_cname, 
// 						user.name as creator_name, 
// 						user.avatar as creator_avatar
// 					FROM rooms 
// 						JOIN user ON rooms.creator_id=user.uid WHERE room_id="${room_id}"`, 
// 			res=>{
// 				let myrooms = res ;
// 				// 房间添加人员列表 ;
// 				this.mapRoomsAddmanList(myrooms, myrooms2=>{
// 					// 房间添加最后消息 ;
// 					this.snedImAjaxRes(opt,1, myrooms2[0] ) ;
// 				})
// 			})
// 		}
// 	},

// 	// 和某人谈话
// 	talkToOne(opt){
// 		var $query = G.MYSQL.$query ;
// 		let socket = this.socket ;
// 		let session = socket.handshake.session ;
// 		let data = opt.data ;

// 		let uid = session.uid ;
// 		let sid = data.uid ;
// 		// 单聊情况 , 房间join_ids是惟一的
// 		let join_ids = [uid,sid].sort((a,b)=>(a-b)).join()
// 		$query(`SELECT * FROM rooms WHERE type="0" AND join_ids="${join_ids}"`, res=>{
// 			if(res.length){
// 				// 存在房间 , 返回房间信息 ;
// 				this.snedImAjaxRes(opt, 1, res[0] );
// 			}else{
// 				// 不存在房间 , 创建房间 , 再返回
// 				let ctime = $common.getTime();
// 				$query(`INSERT rooms (type,creator_id,join_ids,ctime) VALUES("0","${uid}","${join_ids}","${ctime}")`, res=>{
// 					$query(`SELECT * FROM rooms WHERE ctime="${ctime}"`, res=>{
// 						this.snedImAjaxRes(opt, 1, res[0] );
// 					})
// 				})
// 			}
// 		})
// 	},
// 	// 创建组群
// 	createGroup(opt){
// 		var $query = G.MYSQL.$query ;
// 		let socket = this.socket ;
// 		let session = socket.handshake.session ;
// 		let data = opt.data ;

// 		let uid = session.uid ;
// 		let room_name = data.room_name ;
// 		let parts_ids = data.parts_ids||'';
// 		let ctime = $common.getTime();
// 		let join_ids = uid+','+parts_ids ;
// 		if(room_name&&parts_ids){
// 			$query(`INSERT rooms (type,room_name,creator_id,join_ids,ctime) 
// 					VALUES ("1","${room_name}","${uid}","${join_ids}","${ctime}")`, res=>{
// 				this.snedImAjaxRes(opt, 1, res );
// 	 		})
// 		}
// 	},
// 	// 更新群组人员
// 	updateRoomJoinids(opt){
// 		var $query = G.MYSQL.$query ;
// 		let socket = this.socket ;
// 		let session = socket.handshake.session ;
// 		let data = opt.data ;

// 		let room_id = data.room_id ;
// 		let join_ids = data.join_ids ;
// 		if( room_id&&join_ids ){
// 			$query(`UPDATE rooms SET join_ids="${join_ids}" WHERE room_id="${room_id}" AND type="1"`, res=>{
// 				this.snedImAjaxRes(opt, 1, res );
// 			})
// 		}
// 	},


// }

