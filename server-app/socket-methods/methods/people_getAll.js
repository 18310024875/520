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
    let kw = data.kw;
    
    $query(`SELECT * FROM user ${kw?`WHERE user.cname LIKE "%${kw}%"`:''}`, res=>{
        send(1, common.parseArrayMakeWordObj(res ,'cname'))
    })
}