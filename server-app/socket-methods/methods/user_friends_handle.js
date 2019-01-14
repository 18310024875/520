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
    let add_ids = data.add_ids||'' ;
    let del_ids = data.del_ids||'' ;

    let arr1 = add_ids.split(',').filter(v=>v);
    let arr2 = del_ids.split(',').filter(v=>v);

    doAdd( arr1,()=>{

        doDel( arr2,()=>{
            
            send(1,'操作成功')
        })
    })


    function doAdd(ids , cb){
        let len = ids.length;
        if( len>0 ){
            ids.map( id=>{
                let insertId = [uid,id].sort().join();
                $query(`INSERT user_friends (id,creator_id,accept_id,agree) 
                    VALUES("${insertId}","${uid}","${id}","0")`, res=>{},err=>{},()=>{
                    len-- ; len==0?cb&&cb():null ;
                })
            })
        }else{
            cb && cb()
        }
    };
    function doDel(ids , cb){
        let len = ids.length;
        if( len>0 ){
            ids.map( id=>{
                let insertId = [uid,id].sort().join();
                $query(`DELETE FROM user_friends WHERE id="${insertId}"`, res=>{
                    // 删除和好友聊天的房间
                    $query(`SELECT * FROM room WHERE connect_friends="${insertId}"`, res=>{
                        let room = res[0];
                        if( room ){
                            $query(`DELETE FROM room WHERE room_id="${room.room_id}"`, res=>{
                                $query(`DELETE FROM room_users WHERE room_id="${room.room_id}"`, res=>{
                                    len-- ; len==0?cb&&cb():null ;
                                })
                            })
                        }else{
                            len-- ; len==0?cb&&cb():null ;
                        }
                    })
                })
            })
        }else{
            cb && cb()
        }       
    };

}