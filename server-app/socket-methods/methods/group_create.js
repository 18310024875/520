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
    let ids = data.ids ;
    let name = data.name ;
    // 先检查是不是好友 ;
    if( ids&&name ){
        $query(`INSERT room (creator_id,room_name) VALUE ("${uid}","${name}")`, res=>{
            let insertId = res.info.insertId ;
            let arr=ids.split(',').filter(id=>id);
                arr.push( uid );
            let values = arr.map(id=>`("${insertId}","${id}")`).join(',');
            
            $query(`INSERT room_users (room_id,uid) VALUES${values} `, res=>{
                send(1, '操作成功')
            })
        })
    }else{
        send(0,'error')
    }
    

}