const common = require('../common');

module.exports = function( opt ){
    let $query = this.query ;
    let IO = this.IO ;
    let socket = this.socket ;
    let session = socket.handshake.session ;
    let data = opt.data ;

    let ctime = common.getTime();
    let send = (flag,res)=>{
        this.snedImAjaxRes(opt, flag,res);
    }

    let uid = session.uid ;
    let kw = data.kw ;
    // 查找roomtype为1的所有房间
    $query(`SELECT 
                room.*,
                user.cname as creator_cname, 
                user.avatar as creator_avatar
            FROM room
                LEFT JOIN user
                    ON room.creator_id=user.uid 
            WHERE room.type=1 AND room.creator_id="${uid}"
            ${kw?`AND room.room_name LIKE "%${kw}%"`:''}`, roomList=>{
        
        mapRoomListAddUsers(roomList,roomList=>{
            let listobj = common.parseArrayMakeWordObj(roomList,'room_name');
            send( 1 , listobj )
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

}