
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
    let id = data.id ;
    $query(`UPDATE reply_read SET readed="1" WHERE reply_id="${id}" AND accept_id="${uid}"`, res=>{
        send(1,'操作成功')
    })
}