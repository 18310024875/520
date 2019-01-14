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
    let room_id = data.room_id ;
    let talk_fid = data.talk_fid||'' ;
    let talk_content = data.talk_content||'' ;

    if( !room_id ){ send(0,'error'); return };
    // 插入数据
    $query(`INSERT talk (room_id,creator_id,talk_fid,talk_content)
    VALUES("${room_id}","${uid}",${talk_fid?`"${talk_fid}"`:'NULL'},"${talk_content}")`, res=>{
        send(1,'发送成功');

        let insertId = res.info.insertId ;
        // 查出数据
        $query(`
            SELECT
                talk.*,
                creator.cname as creator_cname,
                creator.avatar as creator_avatar,
                room.room_name as room_name,
                room.creator_id as room_creator,
                file.size as file_szie,
                file.indexname as file_indexname,
                file.originname as file_originname,
                file.serverUrl as file_serverUrl,
                file.creator_id as file_creator_id
            FROM talk 
                LEFT JOIN user as creator ON talk.creator_id=creator.uid
                LEFT JOIN room ON talk.room_id = room.room_id 
                LEFT JOIN file ON talk.talk_fid=file.fid
            WHERE talk.talk_id="${insertId}"`, res=>{
            // 广播人员
            $query(`SELECT * FROM room_users WHERE room_id="${room_id}"`, users=>{
                let idarr = users.map( v=>v.uid );
                messageRoom(idarr , res[0] )
            })
        })
    })

    function messageRoom(idarr, data ){
		let sockets_s = IO.sockets.sockets ;
		for(let k in sockets_s){
			let socket = sockets_s[k];
			let uid = socket.uid || -1 ;
			if( idarr.has(uid) ){
				socket.emit('imMessage',{
					type:'messageRoom',
					content: data
				})
			}
		}
    };

}