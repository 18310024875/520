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
 
    let status = data.status ;
    let user_friends_id = data.user_friends_id ;
    if( status ){
        // 接受
        $query(`UPDATE user_friends SET agree="1" WHERE id="${user_friends_id}"`, res=>{
            send(1,'操作成功')
        })
    }else{
        // 拒绝
        $query(`DELETE FROM user_friends WHERE id="${user_friends_id}"`, res=>{
            send(1,'操作成功')
        })
    }

}