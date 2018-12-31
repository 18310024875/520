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

    let cname = data.cname;
    let account = data.account;
    let password = data.password;
    if(cname&&account&&password){
        $query(`SELECT * FROM user WHERE account="${account}"`,res=>{
            if(res.length){
                send(0,'账号已存在')
            }else{
                $query(`INSERT user (cname,account,password) 
                VALUES("${cname}","${account}","${password}")`,res=>{
                    if(res){
                        let info = res.info ;
                        let insertId = info.insertId ;
                        $query(`SELECT * FROM user WHERE uid="${insertId}"`, res=>{
                            let uid = res[0].uid ;
                            // 记录
                            this.socket.uid = uid ;
                            this.socket.handshake.session.uid = uid ;
                            this.socket.handshake.session.save();
                            
                            send(1,res)     
                        })
                    }else{
                        send(0,'注册失败') ;
                    }
                })
            }
        })
    }
}

