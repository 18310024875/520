const common = require('../common');

module.exports = function( opt ){
    let $query = this.query ;
    let IO = this.IO ;
    let socket = this.socket ;
    let session = socket.handshake.session ;
    let data = opt.data ;

    let ctime = common.getTime();
    let send = (flag,res)=>{
        this.snedImAjaxRes(opt, flag,res);
    }

    // 本地环境 ---> 从地址上取uid , 请求接口 , 存入session; 避免验证 !!!! ; 
    if( opt.ENV=='dev' ){
        let r = socket.handshake.headers.referer ;
        let match = r.match(/uid=(\w+)/);
        let uid = match&&match[1] ;
        if( uid ){
            $query(`SELECT * FROM user WHERE uid="${uid}"`,res=>{
                if( res&&res[0] ){

                    // 记录
                    this.socket.uid = uid ;
                    this.socket.handshake.session.uid = uid ;
                    this.socket.handshake.session.save();

                    send( 1 , res )
                };
            })
        }
    }
    // 正式环境 ---> 需要进行验证
    else{
        let uid = session.uid ;
        if( uid!=undefined ){
            $query(`SELECT * FROM user WHERE uid="${uid}"`,res=>{
                if( res&&res[0] ){

                    // 记录
                    this.socket.uid = uid ;
                    this.socket.handshake.session.uid = uid ;
                    this.socket.handshake.session.save();

                    send( 1 , res )
                };
            })
        }else{
            send( 1 , false ) 
        }
    };
}