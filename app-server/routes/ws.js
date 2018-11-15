var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();




var yes=(data=[])=>{
	return {
		code:0,
		data:data,
		msg:'yes'
	}
}
var no=(msg='no',code=1)=>{
	return {
		code:code,
		data:'',
		msg:msg
	}
}
var now_ = '' ;
var now=()=>{
	let d = Date.parse( new Date() ) ;
	if( now_>=d ){
		now_=now_+1 ;
	}else{
		now_=d ;
	}
	return now_ ;
}


// ******* socketId实时变化 ******** ; 



var SQ={
	SELECT_FROM_USER( str='' , cb ){
		G.MYSQL.$query( `SELECT * FROM user ${str}` , data=>{
			cb&&cb( data )
		})
	},
	INSERT_USER(account='',password='' , cb){
		let ctime = now();
		G.MYSQL.$query(`INSERT user (account,password,cname,ctime) VALUES("${account}","${password}","${'用户_'+account}","${ctime}")` , data=>{
			if( data ){
				G.MYSQL.$query(`SELECT * FROM user WHERE ctime="${ctime}"`,users=>{
					cb&&cb( users )
				})
			}else{
				cb&&cb(false)
			}
		},error=>{
			cb&&cb(false)
		})
	},

	SELECT_FROM_ROOMS( str='' , cb ){
		G.MYSQL.$query(`SELECT * FROM rooms ${str}` , roomList=>{
			cb&&cb( roomList )
		})
	},
	INSERT_ROOMS(creator_id , room_name , join_ids , cb ){
		let ctime = now() ;
		G.MYSQL.$query(`INSERT rooms (creator_id,room_name,join_ids,ctime) VALUES("${creator_id}","${room_name}","${join_ids}","${ctime}")`, data=>{
			if( data ){
				G.MYSQL.$query(`SELECT * FROM rooms WHERE ctime="${ctime}"`, roomList=>{
					cb( roomList )
				})
			}else{
				cb&&cb(false)
			}
		},error=>{
			cb&&cb(false)
		})
	},

	SELECT_FROM_TALK( str='' , cb ){
		G.MYSQL.$query(`SELECT * FROM talk ${str}` , talkList=>{
			cb&&cb( talkList )
		})
	},
	INSERT_TALK(creator_id,room_id,talk_content,talk_fids , cb ){
		// 向talk表插入一条数据 , 返回插入后的数据 ;
		let ctime = now();
		G.MYSQL.$query(`INSERT talk (creator_id,ctime,room_id,talk_content,talk_fids) VALUES ("${creator_id}","${ctime}","${room_id}","${talk_content}","${talk_fids}")` ,data=>{
			if(data){
				G.MYSQL.$query(`SELECT * FROM talk WHERE ctime="${ctime}"`, talkList=>{
					cb&&cb(talkList)
				})
			}else {
				cb&&cb(false)
			}
		})
	},

	SELECT_FROM_FILES( str , cb ){
		G.MYSQL.$query(`SELECT * FROM files ${str}` , files=>{
			cb&&cb( files )
		})
	},
	INSERT_FILES(creator_id,indexname,originname,size,serverUrl,dirUrl , cb){
		let ctime = now() ;
		G.MYSQL.$query(`INSERT files (creator_id,ctime,indexname,originname,size,serverUrl,dirUrl) VALUES("${creator_id}","${ctime}","${indexname}","${originname}","${size}","${serverUrl}","${dirUrl}")` , data=>{
			if(data){
				G.MYSQL.$query(`SELECT * FROM files WHERE ctime="${ctime}"`,files=>{
					cb&&cb( files )
				})
			}else{
				cb&&cb(false)
			}
		})
	}
}

var FUN={
	// 根据ids请求用户信息
	getUsersFromIds(ids='' , cb){
		ids+='';
		let idarr = (ids.split(',').filter(v=>v));
		let userStr = idarr.map(uid=>`uid="${uid}"`).join('||');
		// mysql查询用户 ;
		SQ.SELECT_FROM_USER(`WHERE ${userStr}`, users=>{
			cb&&cb( users )
		})
	},
	// 便利fids得到文件列表
	getFilesFromIds( fids='' , cb ){
		fids+='';
		let fidarr = fids.split(',').filter(v=>v);
		let fidStr = fidarr.map(fid=>`fid="${fid}"`).join('||');
		// 查询
		SQ.SELECT_FROM_FILES(`WHERE ${fidStr}`, files=>{
			cb&&cb( files );
		})
	},
	// 房间增加用户信息
	roomAddUser(room , cb){
		// 添加创建人
		let creator_id = room.creator_id ;
		FUN.getUsersFromIds( creator_id ,list1=>{
			room.creator=list1[0] ;
			// 根据join_ids 添加房间总人数
			let join_ids = room.join_ids ;
			FUN.getUsersFromIds( join_ids , list2=>{
				room.users = list2;
				// 回调
				cb&&cb( room );
			})
		})
	},
	// 房间列表----添加信息
	mapRoomListAddInfo(roomList=[] , cb){
		let length=roomList.length ;
		if( length ){
			roomList.map( room=>{
				// 房间添加用户
				FUN.roomAddUser( room , newRoom=>{
					length-- ;
					if( length==0 ){
						cb&&cb( roomList )
					}
				})
			})
		}else{
			cb&&cb( roomList )
		}
	},

	// 谈话列表----添加信息 ;
	mapTalkListAddInfo(talkList=[] , cb){
		let len = talkList.length ;
		if( len ){
			talkList.map( talk=>{
				// 1 谈话增加创建人字段 ;
				let creator_id = talk.creator_id ;
				FUN.getUsersFromIds( creator_id , users=>{
					// 赋值创建人 ;
					talk.creator = users[0] ;
					// 2 谈话增加房间信息
					let room_id = talk.room_id ;
					SQ.SELECT_FROM_ROOMS(`WHERE room_id="${room_id}"`,roomList=>{
						// 添加房间人员信息
						FUN.mapRoomListAddInfo( roomList , newRoomList=>{
							// 赋值房间
							talk.room = newRoomList[0] ;
							// 3 谈话文件处理
							let talk_fids = talk.talk_fids ;
							if( talk_fids ){
								// 添加文件信息
								FUN.getFilesFromIds( talk_fids , files=>{
									// 赋值文件
									talk.files = files ;
									// 计数
									len-- ;
									if(len==0){
										cb && cb( talkList );
									}
								})
							}else{
								// 计数
								len-- ;
								if(len==0){
									cb && cb( talkList );
								}
							}
						})
					})
				})
			})
		}else{
			cb && cb( [] );
		}
	},

	// 文件列表----添加信息
	mapFileListAddInfo(fileList=[] , cb){

	},

	// 创建新房间 ;
	addNewRoom(creator_id , room_name , ids , cb){
		if( !creator_id || !ids ){ return };

		// room表创建新房间 ;
		SQ.INSERT_ROOMS(creator_id,room_name,ids, roomList=>{
			let room = roomList[0] ;
			if( room ){
				cb&&cb( room );
				// 房间id ;
				let room_id = room.room_id ;
				// 便利人员 --->人员join_rooms字段, 加入本房间id ;
				(ids.split(',').filter(v=>v)).map( uid=>{
					// 拿到用户信息 ;
					SQ.SELECT_FROM_USER(`WHERE uid="${uid}"`,users=>{

						let join_rooms = users[0].join_rooms ;
						!join_rooms ? (join_rooms=room_id) : (join_rooms=join_rooms+','+room_id) ; 

						// 更新user表
						G.MYSQL.$query(`UPDATE user SET join_rooms="${join_rooms}" WHERE uid="${uid}"`,data=>{})
					})
				})
			}
		})
	},
	// 向数据库添加谈话 , 并返回处理后的信息 ;
	addNewTalk( creator_id,room_id,talk_content,talk_fids , cb ){
		// talk表插入一段话 ;
		SQ.INSERT_TALK( creator_id,room_id,talk_content,talk_fids , talkList=>{
			if( talkList ){
				// 谈话增加信息
				FUN.mapTalkListAddInfo( talkList , newTalkList=>{
					cb&&cb( newTalkList[0] )
				})
			}else{
				cb&&cb( false )
			}
		})
	},

	// 通过roomId查找谈话内容 ;
	getTalkFromRoomId( room_id , lastId , cb ){
		let sq = `WHERE room_id="${room_id}" ${lastId?`AND talk_id<"${lastId}"`:''} ORDER BY talk_id DESC LIMIT 0,30`;
		// user表拿数据 ;
		SQ.SELECT_FROM_TALK( sq , talkList=>{
			if( talkList ){
				// 谈话增加信息
				FUN.mapTalkListAddInfo( talkList , newTalkList=>{
					cb&&cb( newTalkList.reverse() )
				})
			}else{
				cb&&cb( false )
			}
		})
	},


	// 广播一条消息 ;
	messageTalk( creator_id , room_id , talk_content , talk_fids , cb ){
		// 创建新谈话
		FUN.addNewTalk( creator_id , room_id , talk_content , talk_fids , talk=>{
			if( talk ){
				// 回调
				cb&&cb( talk );
				// 全部信息添加完成广播消息 ;
				let join_ids = talk.room.join_ids ;

				// SOCKET.IO发送通知 ;
				G.IO.$message( join_ids , {
					type: 'talk' ,
					content: talk
				});
			}else{
				cb&&cb( false );
			}
		})
	}
}




// 判断是否登录 ;
router.post('/isLogin', (req, res , next)=>{
	let b = req.body ;
	let socketId = b.socketId ;

	// 登录成功session中存在 uid ;
	let uid = req.session['uid'];
	if( uid && socketId ){
		// 根据socketId 向SOCKET对象中注入uid ;
		G.IO.sockets.sockets[ socketId ]['uid'] = uid ;
		G.IO.$userList[ uid ] = G.IO.sockets.sockets[ socketId ] ;
		
		res.send( yes() );
	}else{
		// 没登录返回 ;
		res.send( no() );
	}
})

// 登录
router.post('/login', (req, res, next)=>{
	let b = req.body ;
	let socketId = b.socketId ;
	let account  = b.account ;
	let password = b.password ;
	if( account&&password&&socketId ){
		// 查找login信息 ;
		SQ.SELECT_FROM_USER(`WHERE account="${account}" AND password="${password}"` , users=>{
			if( users[0] ){
				let uid = users[0].uid ;
				// uid 存入session中 ;
				req.session['uid']=uid ;
				// 根据socketId 向SOCKET对象中注入uid ;
				G.IO.sockets.sockets[ socketId ]['uid'] = uid ;
				G.IO.$userList[ uid ] = G.IO.sockets.sockets[ socketId ] ;

				res.send( yes() );
			}else{
				res.send( no('账号或密码错误') );
			}
		})
	}else{
		res.send( no() )
	}
});

// 注册
router.post('/register', (req, res, next)=>{
	let b = req.body ;
	let account = b.account ;
	let password = b.password ;
	if( account&&password ){
		// 先查找是否存在账号
		SQ.SELECT_FROM_USER(`WHERE account="${account}"`, users=>{
			if( users.length ){
				res.send( no('账号已存在') );
			}else{
				// 插入用户表 给默认名字;
				SQ.INSERT_USER(account , password , users=>{
					users ? res.send( yes(users) ) : res.send( no('注册失败') );
				})
			}
		})
	}else{
		res.send( no('注册失败') )
	}
});

// 获取用户信息
router.get('/getUserInfo', (req,res,next)=>{
	let uid = req.session['uid'] ;

	SQ.SELECT_FROM_USER(`WHERE uid="${uid}"`, users=>{
		users ? res.send( yes(users)) : res.send( no('获取用户信息失败') ) ;
	})
})

// 得到所有参与的房间 ;
router.post('/getAllJoinRooms' , (req,res,next)=>{
	let s = req.session ;
	let uid = s.uid ;
	// 从user表拿到 join_rooms , 查找所有加入房间 ;
	SQ.SELECT_FROM_USER(`WHERE uid="${uid}"`, users=>{
		if( users[0] ){
			let join_rooms = users[0].join_rooms||'' ;
			var roomIds = join_rooms.split(',').filter( v=>v );
			if( roomIds.length ){
				// str ;
				var str = roomIds.map( id=>`room_id="${id}"` ).join(' || ');
				// 从房间表拿到自己参加的所有房间 ;
				SQ.SELECT_FROM_ROOMS( `WHERE ${str}` , roomList=>{

					// 为房间添加成员信息 
					FUN.mapRoomListAddInfo( roomList , newRoomList=>{
						res.send( yes(newRoomList) )
					})
				})
			}else{
				res.send( yes([]) );
			}	
		}else{
			res.send( no() );
		}
	})
})

// 和某人建立连接 ---> 返回房间 , 判定是否需要自动创建新房间 ;;;	
router.post('/connectMan', (req,res,next)=>{
	let b = req.body ;
	let ids = b.ids||'' ;
	let uid = req.session['uid'] ;

	let you_me = (ids.split(',').filter(v=>v));
	// 查找的对话为一对一 ;
	if( you_me.length==2 ){
		// 查找字段 (我和你对话 || 你和我对话)
		let ids1 = you_me.join(',');
		let ids2 = you_me.reverse().join(',');
		// 根据两种形式 查找房间 ;
		SQ.SELECT_FROM_ROOMS(`WHERE join_ids="${ids1}"||join_ids="${ids2}"`, list=>{
			// 找到了房间 , 拿数据
			if( list[0] ){
				// 房间增加信息 ;
				FUN.mapRoomListAddInfo( list , roomList=>{
					res.send( yes(roomList[0]) )
				})
			}
			// 没找到房间 , 创建新房间;
			else{
				// 创建房间
				FUN.addNewRoom( uid , '' , ids , newRoom=>{
					// 房间增加信息 ;
					FUN.mapRoomListAddInfo( [newRoom] , roomList=>{
						res.send( yes(roomList[0]) )
					})
				})
			}
		})
	}else{
		res.send( no() );
	}	
})

// 创建新房间 ---> 返回房间 ;
router.post('/createNewGroup', (req,res,next)=>{
	let b = req.body ;
	let ids = b.ids||'' ;
	let groupName = b.groupName||'' ;
	let uid = req.session['uid'] ;

	if(groupName&&ids){
		// 创建新房间 ;
		FUN.addNewRoom( uid , groupName , ids , newRoom=>{
			// 房间增加信息 ;
			FUN.mapRoomListAddInfo( [newRoom] , roomList=>{
				res.send( yes(roomList[0]) )
			})
		})
	}
})

// 得到加入的所有团队
router.get('/getJoinTeams', (req,res,next)=>{
	let q = req.query ;
	let keyWord = q.keyWord||'' ;
	let pageNumber = q.pageNumber||'1' ;
	let pageSize = q.pageSize||'10' ;
	let uid = req.session['uid'];

	let startL = ((pageNumber-1)*pageSize) ;

	// 查找房间表 ;
	SQ.SELECT_FROM_ROOMS(`WHERE creator_id="${uid}" AND room_name LIKE "%${keyWord}%" LIMIT ${startL},${pageSize}`, roomList=>{
		roomList=roomList.filter( v=>v.room_name );

		// 为房间添加用户字段 ''
		FUN.mapRoomListAddInfo( roomList , newRoomList=>{
			res.send( yes(newRoomList) )
		})
	})
})

// 得到所有注册用户 
router.get('/getMans', (req,res,next)=>{
	let q = req.query ;
	let keyWord = q.keyWord||'' ;
	let pageNumber = q.pageNumber||'1' ;
	let pageSize = q.pageSize||'10' ;

	let startL = ((pageNumber-1)*pageSize) ;

	// 查找用户 ;
	SQ.SELECT_FROM_USER(`WHERE cname LIKE "%${keyWord}%" LIMIT ${startL},${pageSize}`, users=>{
		res.send( yes(users) );
	})
})

// 通过getTalkFromRoomId得到谈话内容
router.get('/getTalkFromRoomId', (req,res,next)=>{
	let room_id = req.query.room_id ;
	let last_id = req.query.last_id||'' ;
	if( room_id ){
		// 通过room_id得到谈话信息 ;
		FUN.getTalkFromRoomId( room_id, last_id , talkList=>{
			res.send( yes(talkList) )
		})
	}else{
		res.send( no() )
	}
})


// 发送信息 ;
router.post('/sendMessage', (req,res,next)=>{
	let b = req.body ;
	let uid = req.session['uid'];
	let room_id = b.room_id ;
	let fileIds = b.fileIds||'' ;
	let text = b.text ;
	if( room_id ){
		// talk表插入数据 ;
		FUN.messageTalk( uid , room_id , text , fileIds , talk=>{
			talk ? res.send( yes(talk) ) : res.send( no() ) ;
		})
	}
})


// 上传文件
router.post('/upload' , (req,res,next)=>{
	let uid = req.session['uid'];
	let room_id = req.query.room_id ;
	if( !uid||!room_id ){ res.send( no('缺少参数') ) ; return };

	// 上传模块
	// 上传单文件
	// G.UPLOAD.single('upload') 
	// 上传多文件
	G.UPLOAD.array('upload',10)( req, res, function (err) {
		if( err ){
		  	res.send( no(err) );
		}else{
			let fileList = req.files||[] ;
			let len = fileList.length ;
			let fidArr = [] ;
			// 便利文件 ;
			fileList.map( file=>{

				// 文件原名
				let originname = file.originalname ;
				// 拓展名
				let ext = file.originalname.split('.').pop();
				// 暂存地址
				let tmp_path = file.path ;
				// 文件大小 
				let size = file.size ;

				// 赋值唯一名字
				let indexname = `${uid}_${now()}.${ext}`;
				// server地址 , 域名自己适配 ;
				let serverUrl = `/www/files/${indexname}`;
				// 存在服务器物理地址
				let dirUrl = path.resolve(__dirname,'..')+'/'+serverUrl ;
				// 创建流
				let R = fs.createReadStream( file.path );
				let W = fs.createWriteStream( dirUrl );
				W.on('finish',()=>{
					// files表插入文件 ;
					SQ.INSERT_FILES(uid,indexname,originname,size,serverUrl,dirUrl , files=>{
						len-- ;
						fidArr.push( files[0].fid );

						if( len==0 ){
							// 说一句话
							FUN.messageTalk( uid,room_id,'', fidArr.join(',') , (talk)=>{
								talk ? res.send( yes(talk) ) : res.send( no() ) ;
							})
						}
					})
				})
				// 移动流
				R.pipe(W);

			})

		}
	})
})







module.exports = router;




