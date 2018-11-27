var express = require('express');
var router = express.Router();

// 账号 + _ + 创建时间 --> md5 ;
var md5 = require('md5');

var yes=(data=[])=>{
	return {
		code:0,
		data:data,
		msg:'yes'
	}
}
var no=(msg='no',code=1)=>{
	return {
		code:code,
		data:'',
		msg:msg
	}
}


// 登录
router.post('/login', (req, res, next)=>{
	let b = req.body ;
	let account = b.account ;
	let password = b.password ;
	if( account&&password){
		// 查找login信息 ;
		G.QUERY(`SELECT * FROM user WHERE account="${account}" AND password="${password}"`, data=>{
			if( data[0] ){
				// 记录在session中
				req.session['uid'] = data[0]['uid'];

				res.send( yes(data) );
			}else{
				res.send( no('账号或密码错误') );
			}
		})
	}else{
		res.send( no() )
	}
})



// 注册
router.post('/register', (req, res, next)=>{
	let b = req.body ;
	let account = b.account ;
	let password = b.password ;
	if( account&&password){
		// 检查账号是否存在 ;
		G.QUERY(`SELECT * FROM login WHERE account="${account}"`,data=>{
			if( data.length==0 ){
				let ctime = Date.parse(new Date()) ;
				let cname = '用户_'+account ;
				let uid = md5(`${account}_${ctime}`);
				// 插入login ;
				G.QUERY(`INSERT login (uid,account,password,ctime) VALUES("${uid}","${account}","${password}","${ctime}")`,data=>{
					if( data ){
						// 插入userinfo ;
						G.QUERY(`INSERT userinfo (uid,cname,ctime) VALUES("${uid}","${cname}","${ctime}")`,data=>{
							if(data){
								// 记录在session中
								req.session['uid'] = uid;

								res.send( yes() );
							}else{
								res.send( no() );
							}
						});
					}else{
						res.send( no() );
					}
				});
			}else{
				res.send( no('账号已存在') );
			}
		})
	}else {
		res.send( no() );
	}	
})




module.exports = router;



