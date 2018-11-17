var express = require('express');
var router = express.Router();

var path = require('path');
var fs = require('fs');

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

// 识别登录 ;
router.all('*', (req, res, next)=>{
	if( req.session['uid'] ){
		next();
	}else{
		res.send( no('尚未登录',2) );
	}
})


// 得到个人名下所有相关房间 ;
router.get('/getRoomsAboutMe', (req, res, next)=>{
	let uid=req.session['uid'];
	// 找到个人rooms字段
	G.QUERY(`SELECT rooms FROM userinfo WHERE uid="${uid}"`, data=>{
		let rooms = (data[0]&&data[0].rooms)||'' ;
			rooms = rooms.split(',').filter( v=>v );

		// 所有关于 我的房间字符 ;
		let str = `room_id="-1"` ;
			rooms.map( v=>{
				str += ` OR room_id="${v}" `
			});

		// 根据字符查找 我的所有房间 ;
		G.QUERY(`SELECT * FROM rooms WHERE ${str}`,data=>{
			res.send( yes(data) );
		},error=>{
			res.send( no() );
		})
	},error=>{
		res.send( no() );
	})
})

// 得到一个房间详情
router.get('/detail', (req, res, next)=>{
	let room_id = req.query.room_id ;
	if( room_id ){
		G.QUERY(`SELECT * FROM rooms WHERE room_id="${room_id}"`, data=>{
			data&&data[0] ? res.send( yes(data[0]) ) : res.send( no('没有该房间') );
		},error=>{
			res.send( no() );
		})
	}else{
		res.send( no() );
	}
})

// 从房间拿聊天信息
router.post('/talkList', (req, res, next)=>{
	let room_id = req.body.room_id ;
	if( room_id ){
		// 多表联查 , 1:查询talk表信息 2:根据userid查询userinfo表的头像名字 ;
		G.QUERY(`SELECT * FROM talk JOIN userinfo ON talk.creator_id=userinfo.uid WHERE room_id="${room_id}"`, data=>{
			data = data.map(v=>({
				room_id:v.room_id,
				talk_content:v.talk_content,
				creator_id: v.uid,
				creator_cname:  v.cname,
				creator_avatar: v.avatar,
				ctime:v.ctime
			}))
			res.send( yes(data) );
		},error=>{
			res.send( no() );
		})
	}else{
		res.send( no() );
	}
})


// 添加房间
router.post('/add', (req, res, next)=>{
	let uid = req.session['uid'] ;
	let ctime = Date.parse( new Date() );
	let room_id = ctime ;
	let b = req.body ;
	let room_name = b.room_name ;
	let join_ids = b.join_ids ;
	let join_cnames = b.join_cnames

	if( room_name&&join_ids&&join_cnames ){
		// 插入房间
		G.QUERY(`INSERT rooms (room_id,room_name,creator_id,ctime,join_ids,join_cnames)
				 	    VALUES("${room_id}","${room_name}","${uid}","${ctime}","${join_ids}","${join_cnames}")`, data=>{
			let allUser = (join_ids.split(',')).concat([uid]) ;
			let index = 0 ;
			allUser.map( eachuid=>{
				// 查找每个用户旧的rooms ;
				G.QUERY(`SELECT rooms FROM userinfo WHERE uid="${eachuid}"`,data=>{
					let str=data[0].rooms ;
					let newRooms = str?(str+','+room_id):room_id ;
					// 向userinfo中记录新的rooms;
					G.QUERY(`UPDATE userinfo SET rooms="${newRooms}" WHERE uid="${eachuid}"`,data=>{
						index++ ;
						index==allUser.length ? res.send( yes() ) : null ;
					})
				})
			})
		},error=>{
			res.send( no() );
		})
	}else{
		res.send( no() );
	}
});


// 房间内 添加一条消息
router.post('/addTalk', (req, res, next)=>{
	let uid = req.session['uid'];
	let ctime = Date.parse( new Date() );
	let b = req.body ;
	let room_id = b.room_id ;
	let talk_content = b.talk_content ;
	// 插入谈话列表
	G.QUERY(`INSERT talk  (room_id,talk_content,creator_id,ctime) VALUES("${room_id}","${talk_content}","${uid}","${ctime}")`,data=>{
		// 根据uid 拿到头像等数据 , 返还给 scoket.io 广播;
		G.QUERY(`SELECT * FROM userinfo WHERE uid="${uid}"`,data=>{
			let self = data[0];
			// 消息
			let message = {
				room_id:room_id,
				talk_content:talk_content,
				creator_id: uid,
				creator_cname:  self.cname,
				creator_avatar: self.avatar,
				ctime:ctime
			};
			// 全局广播
			for(let k in G.IO.sockets.sockets){
				G.IO.sockets.sockets[k].emit('talk',message) ;
			};

			res.send( yes() );
		})
	},error=>{
		res.send( no() );
	})
})




module.exports = router;

