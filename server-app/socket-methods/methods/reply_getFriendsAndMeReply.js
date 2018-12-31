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
    let uid = session.uid ;
    let last_id = data.last_id ;

    // 先找到所有的朋友 ;
    getFriends((friends)=>{
        // 获取自己的和朋友的所有id ;
        let arr = friends.map(man=>man.uid);
            arr.push( uid );
        let str = arr.map( uid=>` creator_id="${uid}" ` ).join(' OR ');
        // 查找所有朋友一级发言(pid=0 && 不含回复 && 含有附件)
        $query(`SELECT 
                    reply.*,
                    creator.cname as creator_cname,
                    creator.avatar as creator_avatar,
                    accept.cname as accept_cname,
                    accept.avatar as accept_avatar
                FROM reply 
                    LEFT JOIN user as creator
                        ON reply.creator_id = creator.uid
                    LEFT JOIN user as accept
                        ON reply.accept_id = accept.uid
                WHERE pid="0" AND (${str}) 
                    ${last_id?`AND reply.id<"${last_id}"`:''}
                    ORDER BY reply.id DESC LIMIT 0,20`,
        replyList=>{
            let len = 2 ;
            // 一级评论增加文件信息
            mapReplyListAddFiles(replyList,replyList=>{
                len-- ;
                if( len==0 ){
                    send(1,replyList)
                }
            })  
            // 一级评论下的二级评论( 最多十条 && 不含附件)      
            mapReplyListAddChildren(replyList,replyList=>{
                len-- ;
                if( len==0 ){
                    send(1,replyList)
                }
            })
        })
    })

    // 一级评论下的二级评论
    function mapReplyListAddChildren(replyList,cb){
        let len =replyList.length ;
        if( len>0 ){
            replyList.map( reply=>{
                let reply_id = reply.id ;
                $query(`SELECT 
                            reply.*,
                            creator.cname as creator_cname,
                            creator.avatar as creator_avatar,
                            accept.cname as accept_cname,
                            accept.avatar as accept_avatar
                        FROM reply 
                            LEFT JOIN user as creator
                                ON reply.creator_id = creator.uid
                            LEFT JOIN user as accept
                                ON reply.accept_id = accept.uid
                        WHERE reply.pid="${reply_id}" 
                            LIMIT 11`, 
                res=>{
                    reply.children = res ;
                },err=>{},()=>{
                    len--;
                    if( len==0 ){
                        cb&&cb( replyList )
                    }
                })
            })
        }else{
            cb&&cb([]);
        }
    }

    // 便利会话列表 添加文件信息(一对多)
    function mapReplyListAddFiles(replyList,cb){
        let len =replyList.length ;
        if( len>0 ){
            replyList.map( reply=>{
                let reply_id = reply.id ;
                $query(`SELECT 
                            file.* 
                            FROM reply_files
                                LEFT JOIN file
                                    ON reply_files.fid=file.fid
                        WHERE reply_id="${reply_id}"`, 
                files=>{
                    reply.files = files ;
                },err=>{},()=>{
                    len-- ;
                    if(len==0){
                        cb&&cb(replyList)
                    }
                })      
            })
        }else{
            cb&&cb([]) 
        }
    }

    // 得到我所有好友
    function getFriends(cb){
        var len = 2 ;
        var arr = [] ;
        // 我添加的
        $query(`SELECT user.*
                    FROM user_friends 
                        LEFT JOIN user
                            ON user_friends.accept_id=user.uid
                WHERE creator_id="${uid}"`, res=>{
            arr = arr.concat( res );
        },err=>{},()=>{
            len--;
            if(len==0){
                cb&&cb( arr )
            }   
        })
        // 别人家的我
        $query(`SELECT user.* 
                    FROM user_friends 
                        LEFT JOIN user
                            ON user_friends.creator_id=user.uid
                WHERE accept_id="${uid}"`, res=>{
            arr = arr.concat( res );     
        },err=>{},()=>{
            len--;
            if(len==0){
                cb&&cb( arr )
            }   
        })
    }
}