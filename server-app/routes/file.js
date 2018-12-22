var express = require('express');
var router = express.Router();

var path = require('path');
var fs = require('fs');

function getTime(){
    return (new Date()).getTime()-500 + parseInt(Math.random(1)*1000) ;
};

// var fs = require('fs')
// var ffmpeg = require('fluent-ffmpeg')
// function isVideoNeedChange( pathname , callback ){
//     let ext = file.originalname.split('.').pop();
//     ffmpeg('xiaodu_1_6_8.mov')
//     .format('mp4')
//     .on('error', function(err) {
//         console.log('An error occurred: ' + err.message);
//     })
//     .on('end', function() {
//         console.log('Processing finished !');
//     })
//     .save('output.mp4');
// }


// 上传头像
router.post('/upload', (req, res, next)=>{
	// 上传模块
	G.UPLOAD.single('upload')( req, res, function (err) {
        let uid = req.query.uid ;
        let file = req.file ;
        if( file && uid ){
            let host = 'http://39.105.201.170:3000';
            // 如果ext为mov则转换成mp3
            if( file.originalname.split('.').pop().toLocaleLowerCase()=='mov' ){
                let arr = file.originalname.split('.');
                    arr.pop();
                file.originname = arr.join('.')+'.pm4';
            };
            // 暂存地址
            let tmp_path = file.path ;
            // 文件原名
            let originname = file.originalname ;
            // 拓展名
            let ext = file.originalname.split('.').pop();

            // 文件大小 
            let size = file.size ;
            // 创建时间
            let ctime = getTime();
            // 赋值唯一名字
            let indexname = `${originname.split('.').shift()}_${uid}_${ctime}.${ext}`;
            // server地址 , 域名自己适配 ;
            let Url = `/www/files/${indexname}`;
            // 服务器地址 
            let serverUrl = host+Url ;
            // 存在服务器物理地址
            let dirUrl = path.resolve(__dirname,'..')+Url ;
            // 创建流
            let R = fs.createReadStream( tmp_path );
            let W = fs.createWriteStream( dirUrl );
            W.on('finish',()=>{
                G.MYSQL.$query(
                    `INSERT files (originname,size,indexname,serverUrl,creator_id,ctime) 
                    VALUES("${originname}","${size}","${indexname}","${serverUrl}","${uid}","${ctime}")`,data=>{
                    G.MYSQL.$query(`SELECT * FROM files WHERE ctime="${ctime}"`,files=>{
                        res.send(JSON.stringify({
                            msg:'上传成功',
                            data:files[0],
                            code:0
                        }))  
                    })
                })
                // 删除暂存文件
                fs.unlink( tmp_path , ()=>{});
            })
            // 移动流
            R.pipe(W);
        }else{
            res.status(444);
            res.send(JSON.stringify({
                msg:'上传失败',
                code:1
            }))
        }
    })
});




module.exports = router;      
                
                
               