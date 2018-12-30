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
    
    let account = data.account ;
    let password = data.password ;
    if(account&&password){
        $query(`SELECT * FROM user WHERE account="${account}" AND password="${password}"`,res=>{
            if( res&&res[0] ){
                let uid = res[0].uid ;

                // 记录
                this.socket.uid = uid ;
                this.socket.handshake.session.uid = uid ;
                this.socket.handshake.session.save();

                send(1, res )
            };
        })
    }else{
        send(0,'缺少参数')
    }
}


// 	// 登录
// 	login(opt){
// 		var $query = G.MYSQL.$query ;
// 		let socket = this.socket ;
// 		let session = socket.handshake.session ;
// 		let data = opt.data ;
// 		let account = data.account ;
// 		let password = data.password ;

// 		if(account&&password){
// 			$query(`SELECT * FROM user WHERE account="${account}" AND password="${password}"`,res=>{
// 				if( res&&res[0] ){
// 					this.loginOk_uidAppendToSession_uidAppendToSocket( res[0].uid );
// 					this.snedImAjaxRes(opt, 1,res)
// 				};
// 			})
// 		}else{
// 			this.snedImAjaxRes(opt,0,'缺少参数')
// 		}
// 	},