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
    let creator_id = uid ;
    let accept_id = data.accept_id ;
    let text = data.text||'' ;
    let fids = data.fids||'' ;
    $query(`INSERT reply (pid,accept_id,creator_id,fids,text) 
    VALUES(
        ${pid?`"${pid}"`:`NULL`},
        ${accept_id?`"${accept_id}"`:`NULL`},
        "${creator_id}",
        "${fids}",
        "${text}"
    )`, res=>{
        let info = res.info ;
        let insertId = info.insertId ;
        // 当产生回复时 , 向未读表插入信息 ;
        if( accept_id ){
            insertUnread(insertId , accept_id , ()=>{
                send( 1, '发送成功' );
            })
        }else{
            send( 1, '发送成功' );
        }
    },err=>{
        send( 0 , err );
    })

    // 插入未读
    function insertUnread(insertId , accept_id , cb){
        $query(`INSERT reply_read (reply_id,accept_id,readed) VALUES ("${insertId}","${accept_id}","0")`,
        res=>{},
        err=>{},
        ()=>{
            cb && cb();
        })
    }
}