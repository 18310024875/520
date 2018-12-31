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

    let pid = data.pid ;
    let accept_id = data.accept_id||'' ;
    let creator_id = uid ;
    let text = data.text||'' ;
    let fids = data.fids||'' ;
    $query(`INSERT reply (pid,accept_id,creator_id,fids,text) 
    VALUES("${pid}","${accept_id}","${creator_id}","${fids}","${text}")`, res=>{
        debugger
        send( 1, '发送成功' );
    })
}