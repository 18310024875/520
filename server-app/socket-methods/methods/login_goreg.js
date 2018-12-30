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

    let cname = data.cname;
    let account = data.account;
    let password = data.password;
    if(cname&&account&&password){
        $query(`SELECT * FROM user WHERE account="${account}"`,res=>{
            if(res.length){
                send(0,'账号已存在')
            }else{
                $query(`INSERT user (cname,ctime,account,password) 
                VALUES("${cname}","${ctime}","${account}","${password}")`,res=>{
                    if(res){
                        $query(`SELECT * FROM user WHERE cname="${cname}"`,res=>{
                            if( res&&res[0] ){
                                let uid = res[0].uid ;

                                // 记录
                                this.socket.uid = uid ;
                                this.socket.handshake.session.uid = uid ;
                                this.socket.handshake.session.save();
                                
                                send(1,res)
                            };
                        })
                    }else{
                        send(0,'注册失败') ;
                    }
                })
            }
        })
    }
}

// 	// 注册
// 	register(opt) {
// 		var $query = G.MYSQL.$query;
// 		let socket = this.socket;
// 		let session = socket.handshake.session;
// 		let data = opt.data;

// 		let cname = data.cname;
// 		let ctime = $common.getTime();
// 		let account = data.account;
// 		let password = data.password;

// 		if(cname&&account&&password){
// 			$query(`SELECT * FROM user WHERE account="${account}"`,res=>{
// 				if(res.length){
// 					this.snedImAjaxRes(opt,0,'账号已存在')
// 				}else{
// 					$query(`INSERT user (cname,ctime,account,password) 
// 					VALUES("${cname}","${ctime}","${account}","${password}")`,res=>{
// 						if(res){
// 							$query(`SELECT * FROM user WHERE cname="${cname}"`,res=>{
// 								if( res&&res[0] ){
// 									this.loginOk_uidAppendToSession_uidAppendToSocket( res[0].uid );
// 									this.snedImAjaxRes(opt, 1,res)
// 								};
// 							})
// 						}else{
// 							this.snedImAjaxRes(opt,0,'注册失败') ;
// 						}
// 					})
// 				}
// 			})
// 		}
// 	},