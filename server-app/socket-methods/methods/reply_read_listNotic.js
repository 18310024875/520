const common = require('../common');

module.exports = function( opt , cb ){
    let $query = this.query ;
    let IO = this.IO ;
    let socket = this.socket ;
    let session = socket.handshake.session ;
    let data = opt.data ;

    let send = (flag,res)=>{
        this.snedImAjaxRes(opt, flag,res);
    }

    let uid = session.uid ; 
    let readed = (''+data.readed)||'all' ;
    $query(`SELECT 
                reply_read.readed,
                reply.*,
                creator.cname as creator_cname,
                creator.avatar as creator_avatar,
                accept.cname as accept_cname,
                accept.avatar as accept_avatar
            FROM 
                reply_read
                LEFT JOIN reply
                    ON reply_read.reply_id=reply.id
                LEFT JOIN user as creator
                    ON reply.creator_id = creator.uid
                LEFT JOIN user as accept
                    ON reply.accept_id = accept.uid
            WHERE 
                reply_read.accept_id="${uid}"
                ${readed=='all'?``:` AND readed="${readed}"`}`, 
        list=>{
            addParent(list,list=>{
                send(1, list)
            })
        }) 

    // 添加父级信息
    function addParent( arr=[] , cb ){
        let len = arr.length ;
        if( len>0 ){
            arr.map(v=>{
                let pid = v.pid ;
                $query(`SELECT * FROM reply WHERE id="${pid}"`, res=>{
                    let parent = res[0];
                    // 可能存在父级被删除 ;
                    let fids = parent.fids||'';
                    let str = fids.split(',').filter(v=>v).map(v=>`fid="${v}"`).join(` OR `);
                    if( str ){
                        $query(`SELECT * FROM file WHERE ${str}`,files=>{
                            parent.files=files ;
                        },err=>{},()=>{
                            v.parent = parent ;
                            len-- ; len==0?cb&&cb(arr):null ;
                        })
                    }else{
                        v.parent = parent ;
                        len-- ; len==0?cb&&cb(arr):null ;
                    }
                })
            })
        }else{
            cb&&cb([])
        }
    }
       
}