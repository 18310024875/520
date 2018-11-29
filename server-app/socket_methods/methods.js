
function getTime(){
	return (new Date()).getTime()-500 + parseInt(Math.random(1)*1000) ;
}

var word = require('../lib/word.js');
function parseArrayMakeWordObj( arr=[] , key='name' ){
	var obj = {"A":[],"B":[],"C":[],"D":[],"E":[],"F":[],"G":[],"H":[],"I":[],"J":[],"K":[],"L":[],"M":[],"N":[],"O":[],"P":[],"Q":[],"R":[],"S":[],"T":[],"U":[],"V":[],"W":[],"X":[],"Y":[],"Z":[],"#":[]};
	arr.map( item=>{
		let str = item[key] ;
		let wd = word(str) ;
		let k = (wd[0]).toLocaleUpperCase();
		obj[k] ? obj[k].push(item) : obj['#'].push(item)
	});

	return obj ;
}

function split_s(str=''){
	return str.split(',').filter(v=>v);
}


module.exports = {
	// 登录成功 向session中注入用户信息 ;
	loginOk_session_add_uid( uid ){
		let socket = this.socket ;
		let session = socket.handshake.session ;
		session.uid = uid;
		session.save();
	},
	// 是否登录
	isLogin(opt){
		var $query = G.MYSQL.$query ;
		let socket = this.socket ;
		let session = socket.handshake.session ;

		// 本地环境--->不进行验证 ;;;
		if( opt.ENV=='dev' ){
			let res = [{
				account: "1",
				age: null,
				avatar: null,
				cname: "zahngvchen",
				ctime: "1543296906245",
				des: null,
				join_rooms: null,
				name: null,
				password: "1",
				sex: null,
				uid: "8",
				utime: null
			}];
			res[0] ? this.loginOk_session_add_uid( res[0].uid ) : null ;
			this.snedImAjaxRes(opt, 1,res)
			return ;	
		};

		if( session.uid!=undefined ){
			$query(`SELECT * FROM user WHERE uid="${session.uid}"`,res=>{
				this.snedImAjaxRes(opt,1, res)
			})
		}else{
			this.snedImAjaxRes(opt,1, false )
		}
	},
	// 登录
	login(opt){
		var $query = G.MYSQL.$query ;
		let socket = this.socket ;
		let session = socket.handshake.session ;
		let data = opt.data ;
		let account = data.account ;
		let password = data.password ;

		if(account&&password){
			$query(`SELECT * FROM user WHERE account="${account}" AND password="${password}"`,res=>{
				res[0] ? this.loginOk_session_add_uid( res[0].uid ) : null ;
				this.snedImAjaxRes(opt,1,res)
			})
		}else{
			this.snedImAjaxRes(opt,0,'缺少参数')
		}
	},
	// 注册
	register(opt){
		var $query = G.MYSQL.$query ;
		let socket = this.socket ;
		let session = socket.handshake.session ;
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
								res[0] ? this.loginOk_session_add_uid( res[0].uid ) : null ;
								this.snedImAjaxRes(opt,1, res ) ;
							})
						}else{
							this.snedImAjaxRes(opt,0,'注册失败') ;
						}
					})
				}
			})
		}
	},
	// 获取所有房间
	

	// 获取所有人员
	getAllPeople(opt){
		var $query = G.MYSQL.$query ;
		let socket = this.socket ;
		let session = socket.handshake.session ;
		$query(`SELECT * FROM user`,res=>{
			let wordObj = parseArrayMakeWordObj(res,'cname');
			this.snedImAjaxRes(opt,1, wordObj ) ;
		})
	},
	// 和自己相关的组群
	getAllGroupJoined(opt){
		var $query = G.MYSQL.$query ;
		let socket = this.socket ;
		let session = socket.handshake.session ;

		let uid = session.uid ;
		$query(`SELECT * FROM rooms WHERE type=1`,res=>{
			res = res.filter(v=>{
				let ids = split_s(v.join_ids) ;
				return ids.includes(uid) ;
			})
			let wordObj = parseArrayMakeWordObj(res,'room_name');
			this.snedImAjaxRes(opt,1, wordObj ) ;
		})
	},



}