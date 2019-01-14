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

    let room_id = data.room_id ;
    if( room_id ){
        $query(`
            SELECT 
                room.*,
                user.cname as creator_cname,
                user.avatar as creator_avatar
            FROM 
                room
                LEFT JOIN user
                    ON room.creator_id=user.uid
                WHERE room_id="${room_id}"`, roomList=>{
            mapRoomListAddUsers( roomList , roomList=>{
                send(1,roomList[0])
            })
        })
    }else{
        send(0,'error')
    }

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

