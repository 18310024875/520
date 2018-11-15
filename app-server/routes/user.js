var express = require('express');
var router = express.Router();

var path = require('path');
var fs = require('fs');

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

// 识别登录 ;
router.all('*', (req, res, next)=>{
	if( req.session['uid'] ){
		next();
	}else{
		res.send( no('尚未登录',2) );
	}
})


// 得到用户信息
router.get('/getUserInfo', (req, res, next)=>{
	let uid = req.session['uid'] ;

	G.QUERY(`SELECT * FROM userinfo WHERE uid="${uid}"`, data=>{
		res.send( yes(data) );
	},error=>{
		res.send( no() );
	})
});


// 得到所有注册人员;t
router.get('/getFriends', (req, res, next)=>{
	G.QUERY(`SELECT * FROM userinfo`, data=>{
		res.send( yes(data) );
	},error=>{
		res.send( no() );
	})
});


// 上传头像
router.post('/avatar', (req, res, next)=>{
	// 上传模块
	G.UPLOAD.single('file')( req, res, function (err) {
		if(err){
		  	res.send( no(err) );
		}else{
			var host = req.headers['host'];
			var file = req.file ;
			var ext = file.originalname.split('.').pop();
				ext = ext.toLocaleLowerCase() ;
			if( ['png','jpg','jpeg','jepg','gif'].indexOf( ext )==-1 ){
				res.send( no('格式不符') );
			}else{
				// 暂存文件移动到指定文件夹 更名为 xxx.png ;
				let _local = path.resolve(__dirname,'..','www','avatar');
				let _http  = `http://${host}/www/avatar`;

				let uid = req.session['uid'];
				let utime = Date.parse( new Date() );
				let new_png    = `${uid}_avatar_${utime}.png`;
				let new_avatar = `${_http}/${new_png}`;
				// 创建流
				let R = fs.createReadStream( file.path );
				let W = fs.createWriteStream( `${_local}/${new_png}` );
					W.on('finish',()=>{
						// 删除临时文件 ;
						fs.unlink( file.path ,()=>{
							console.log('删除临时文件成功',file.path);
						});
						// 替换头像操作 ;
						G.QUERY(`SELECT avatar FROM userinfo WHERE uid="${uid}"`, data=>{
							// 删除旧头像 ;
							let old_avatar = data[0].avatar ;
							if( old_avatar ){
								old_png = old_avatar.split('/').pop();
								fs.unlink( `${_local}/${old_png}` ,()=>{
									console.log('删除旧头像成功',`${_local}/${old_png}`);
								});
							}else{
								console.log('暂无旧头像')
							}
							// 写入新头像 ;
							G.QUERY(`UPDATE userinfo SET avatar="${new_avatar}" WHERE uid="${uid}"`, data=>{
								console.log('写入新头像成功',`${_local}/${new_png}`);
								data ? res.send( yes() ) : res.send( no('写入失败') );
							})
						})
					})
				// 移动流
				R.pipe(W);
			}
		};

	})
});

// 修改用户信息
router.post('/update', (req, res, next)=>{
	let uid = req.session['uid'];
	let b = req.body ;
	let cname = b.cname ;
	let name = b.name ;
	let des = b.des ;
	let sex = b.sex ;
	let age = b.age ;
	let tel = b.tel ;
    let utime = Date.parse(new Date());
	G.QUERY(`UPDATE userinfo SET cname="${cname}",name="${name}",des="${des}",sex="${sex||-1}",age="${age||0}",tel="${tel}",utime="${utime}" WHERE uid="${uid}"`,data=>{
		data ? res.send( yes() ) : res.send( no() ) ;
	},error=>{
		res.send( no() ) ;
	})
})











module.exports = router;

