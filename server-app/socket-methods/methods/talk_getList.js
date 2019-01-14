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
    let last_id = data.last_id ;

    if(!room_id){ send(0,'error'); return };
 
    // 验证是否在群中
    $query(`SELECT * FROM room_users WHERE room_id="${room_id}" AND uid="${uid}"`, res=>{
        if( !res[0] ){ send(0,'您不在群中'); return };
        // 查找列表
        $query(`
            SELECT
                talk.*,
                creator.cname as creator_cname,
                creator.avatar as creator_avatar,
                room.room_name as room_name,
                room.creator_id as room_creator,
                file.size as file_szie,
                file.indexname as file_indexname,
                file.originname as file_originname,
                file.serverUrl as file_serverUrl,
                file.creator_id as file_creator_id
            FROM talk 
                LEFT JOIN user as creator ON talk.creator_id=creator.uid
                LEFT JOIN room ON talk.room_id = room.room_id 
                LEFT JOIN file ON talk.talk_fid=file.fid
            WHERE 
                talk.room_id="${room_id}"
                ${last_id?`AND talk.talk_id<"${last_id}"`:``}
                ORDER BY talk.talk_id DESC LIMIT 0,30`, 
        res=>{
            send(1,res.reverse())
        })  
    })



    
}