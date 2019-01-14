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
    let join_ids = data.join_ids ;
    if( room_id!=undefined && join_ids!=undefined ){
        $query(`DELETE FROM room_users WHERE room_id="${room_id}"`, res=>{
            let arr = join_ids.split(',').filter(id=>+id);
            let values = arr.map(id=>`("${room_id}","${id}")`).join(',');
            $query(`INSERT room_users (room_id,uid) VALUES ${values}`, res=>{
                send(1,'操作成功');
            })
        })
    }else{
        send(0, 'error')
    }
}