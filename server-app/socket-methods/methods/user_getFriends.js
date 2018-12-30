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

    let uid = session.uid ;
    let kw = data.kw ;
    getCreatorAndAccept( list=>{
        let listobj = common.parseArrayMakeWordObj(list,'cname');
        send(1,listobj)
    })
    function getCreatorAndAccept(cb){
        let len = 2 ;
        let arr = [];
        // 我添加别人为好友 
        $query(`SELECT 
                    user.*
                        FROM user_friends
                            LEFT JOIN user 
                                ON user_friends.accept_id=user.uid
                WHERE user_friends.creator_id="${uid}" 
                ${kw?`AND user.cname LIKE "%${kw}%"`:''}`, res=>{
            arr = arr.concat( res )
        },err=>{},()=>{
            len--;
            len==0 ? cb&&cb( arr ) : null ;
        }) 
        // 别人添加我为好友
        $query(`SELECT 
                    user.*
                        FROM user_friends
                            LEFT JOIN user 
                                ON user_friends.creator_id=user.uid
                WHERE user_friends.accept_id="${uid}"
                ${kw?`AND user.cname LIKE "%${kw}%"`:''}`, res=>{
            arr = arr.concat( res )
        },err=>{},()=>{
            len--;
            len==0 ? cb&&cb( arr ) : null ;
        })   
    }

}