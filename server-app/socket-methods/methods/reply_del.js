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
    
    let id = data.reply_id ;
    if( id ){
        // 删除一级评论 ;
        delReplyAndReplyRead( id , ()=>{
            // 获取二级评论
            $query(`SELECT * FROM reply WHERE pid="${id}"`, res=>{
                let len = res.length ;
                if( len>0 ){
                    res.map(v=>{
                        delReplyAndReplyRead(v.id ,()=>{
                            len-- ; len==0?send(1, '删除成功'):null ;
                        })
                    })
                }else{
                    send(1, '删除成功')
                }
            })            
        })





        // 删除自身和未读 ;;;
        function delReplyAndReplyRead( id , cb ){
            // 删除自身
            $query(`DELETE FROM reply WHERE id="${id}"`, res=>{
                // 删除未读
                $query(`DELETE from reply_read WHERE reply_id="${id}"`, res=>{
                    cb&&cb()
                })
            })
        }
    }
}