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
    let connect_uid = data.connect_uid ;
    if( !connect_uid ){
        send(0,'error');
        return ;
    };
    
    let connect_friends = [uid,connect_uid].sort().join(',') ;
    // 先检查存不存在房间 ;
    $query(`SELECT * FROM room WHERE connect_friends="${connect_friends}"`, res=>{
        if(res[0]){
            // 存在直接返回
            send(1,res[0].room_id)
        }else{
            // 不存在创建
            $query(`INSERT room (connect_friends,creator_id)
                VALUES ("${connect_friends}","${uid}")`, res=>{
                let insertId = res.info.insertId ;
                $query(`INSERT room_users (room_id,uid) VALUES("${insertId}","${uid}"),("${insertId}","${connect_uid}")`, res=>{
                    send(1,insertId)
                })
            })
        }
    })

}