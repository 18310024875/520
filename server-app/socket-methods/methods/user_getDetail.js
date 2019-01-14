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
    let him = data.uid ;

    // 先检查是不是我的好友
    let friends = [uid,him].sort().join();
    $query(`SELECT * FROM user_friends WHERE id="${friends}" AND agree="1"`, res=>{
        let isFriend = !!res[0] ;
        // 查找用户信息;
        $query(`SELECT * FROM user WHERE uid="${him}"`, res=>{
            let man = res[0]
            if( man ){
                man.isFriend = isFriend ;
                addDiscover( man , man=>{
                    send(1, man )
                })  
            }else{
                send(1, null )
            }    
        })
    })

    // 用户信息添加后四条动态
    function addDiscover( man , cb ){
        // 用户信息添加后四条动态
        $query(`SELECT * FROM reply WHERE creator_id="${him}" AND pid IS NULL 
             ORDER BY id DESC LIMIT 4`, arr=>{
            // 添加文件
             addFile( arr , arr=>{
                man.discoverList = arr ;

                cb&&cb( man )
            })
        }) 
    };
    // 添加文件信息
    function addFile( array , cb ){
        let list = array.filter(v=>v.fids);
        let len = list.length ;
        if( len>0 ){
            list.map(v=>{
                let fid =v.fids.split(',').shift(); 
                $query(`SELECT * FROM file WHERE fid="${fid}"`, res=>{
                    v.file = res[0]
                },err=>{},()=>{
                    len-- ; len==0?cb&&cb( array ):null ;
                })
            })
        }else{
            cb&&cb( array );
        }
    };

}