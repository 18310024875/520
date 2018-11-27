
function getTime(){
	return (new Date()).getTime()-500 + parseInt(Math.random(1)*1000) ;
}



module.exports = {
	// 登录成功 向session中注入用户信息 ;
	loginOk_session_add_userInfo( userInfo ){
		let s = this.socket ;
		let session = s.handshake.session ;
		session['userInfo'] = userInfo ;

		console.log( this.socket.handshake.session )
	},
	// 是否登录
	isLogin(opt){
		let s = this.socket ;
		let session = s.handshake.session ;

		console.log( 'isLogin-----' , session );
		if( session['userInfo'] ){
			this.snedImAjaxRes(opt,1, session['userInfo'] )
		}else{
			this.snedImAjaxRes(opt,1, false )
		}
	},
	// 登录
	login(opt){
		var $query = G.MYSQL.$query ;
		let s = this.socket ;
		let session = s.handshake.session ;
		let data = opt.data ;
		let account = data.account ;
		let password = data.password ;

		if(account&&password){
			$query(`SELECT * FROM user WHERE account="${account}" AND password="${password}"`,res=>{
				res[0] ? this.loginOk_session_add_userInfo(res[0]) : null ;
				this.snedImAjaxRes(opt,1,res)
			})
		}else{
			this.snedImAjaxRes(opt,0,'缺少参数')
		}
	},
	// 注册
	register(opt){
		var $query = G.MYSQL.$query ;
		let s = this.socket ;
		let session = s.handshake.session ;
		let data = opt.data ;

		let cname = data.cname ;
		let ctime = getTime() ;
		let account = data.account ;
		let password = data.password ;

		if(cname&&account&&password){
			$query(`SELECT * FROM user WHERE account="${account}"`,res=>{
				if(res.length){
					this.snedImAjaxRes(opt,0,'账号已存在')
				}else{
					$query(`INSERT user (cname,ctime,account,password) 
					VALUES("${cname}","${ctime}","${account}","${password}")`,res=>{
						if(res){
							$query(`SELECT * FROM user WHERE cname="${cname}"`,res=>{
								res[0] ? this.loginOk_session_add_userInfo(res[0]) : null ;
								this.snedImAjaxRes(opt,1, res ) ;
							})
						}else{
							this.snedImAjaxRes(opt,0,'注册失败') ;
						}
					})
				}
			})
		}
	}





}