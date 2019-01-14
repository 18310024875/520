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

    // 找找别人加我 && 未同意的好友
    $query(`SELECT 
                user_friends.id as user_friends_id,
                user.* 
            FROM 
                user_friends 
                LEFT JOIN 
                user
                    ON  user_friends.creator_id=user.uid    
            WHERE accept_id="${uid}" AND user_friends.agree="0"`, res=>{
        send(1,res)
    })


}