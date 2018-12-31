const common = require('../common');

module.exports = function( opt ){
    let $query = this.query ;
    let IO = this.IO ;
    let socket = this.socket ;
    let session = socket.handshake.session ;
    let data = opt.data ;

    let send = (flag,res)=>{
        this.snedImAjaxRes(opt, flag,res);
    }
    let uid = session.uid ;
    // 查找我加入的所有房间 关联房间信息和创建人;
    $query(`SELECT 
                room.*,
                user.cname as creator_cname, 
                user.avatar as creator_avatar
            FROM room_users 
                LEFT JOIN room 
                    ON room_users.room_id=room.room_id
                LEFT JOIN user
                    ON room_users.uid=user.uid 
            WHERE room_users.uid="${uid}"`, roomList=>{
        // 便利所有房间 增加人员信息
        mapRoomListAddUsers(roomList,roomList=>{
            // 便利所有房间 添加最后一套动态
            mapRoomListAddLastTalk(roomList,roomList=>{
                send( 1 , roomList )
            })
        })
    })

    function mapRoomListAddUsers( roomList=[], cb ){
        let len = roomList.length ;
        if( len>0 ){
            roomList.map( room=>{
                let room_id = room.room_id ;
                $query(`SELECT 
                            user.*
                        FROM room_users
                            LEFT JOIN user
                                ON room_users.uid=user.uid
                        WHERE room_id="${room_id}"`, users=>{
                   room.users=users ;
                },err=>{},()=>{
                    len-- ;
                    if( len==0 ){
                        cb&&cb( roomList )
                    }
                })
            })
        }else{
            cb&&cb([])
        }
    }

    function mapRoomListAddLastTalk( roomList=[], cb ){
        let len = roomList.length ;
        if( len>0 ){
            roomList.map( room=>{
				let room_id = room.room_id ;
				let sq = `				
						SELECT
							talk.*,
							user.cname as creator_cname,
							user.avatar as creator_avatar,
							room.room_name as room_name,
							room.creator_id as room_creator,
							file.size as file_szie,
							file.indexname as file_indexname,
							file.originname as file_originname,
							file.serverUrl as file_serverUrl,
							file.creator_id as file_creator_id
						FROM talk 
							LEFT JOIN user ON talk.creator_id=user.uid
							LEFT JOIN room ON talk.room_id=room.room_id 
							LEFT JOIN file ON talk.talk_fid=file.fid 
						WHERE room.room_id="${room_id}" ORDER BY talk.talk_id DESC LIMIT 1`;
				
				$query( sq , res=>{
					room.lastTalk = res[0]||null ;
				},err=>{},()=>{
					len -- ;
					if(len==0){
						cb&&cb( roomList )
					}
                })
            })
        }else{
            cb&&cb([])
        }
    }
}



