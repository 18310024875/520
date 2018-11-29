export default ( fileList=[] , name='' , action='' , yes , no )=>{

	// FormData对象
	let fd  = new window.FormData;
	// 多文件
	for(let i=0; i<fileList.length ; i++){
		// 文件
		let file = fileList[i] ;
		// 拓展名
		let ext = file.name.split('.').pop();
		// 文件大小(兆)
		let kb  = Number((file.size/1024).toFixed(2));

		// FormData对象---添加文件
		fd.append( name , file );
	}

	// ajax
	let xhr = new window.XMLHttpRequest;
        xhr.upload.onprogress = (e)=>{
        	console.log( (e.loaded/e.total) )
        };
        xhr.onreadystatechange = ()=>{
            if( xhr.readyState == 4 ) {
            	if( xhr.status == 200){
            		yes && yes( xhr.responseText );
            	}else{
					no && no()
            	};
            }
        };
        // 发送
        xhr.open('POST', action , true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.withCredentials = true;
        // 发送FormData对象 ;
        xhr.send( fd );	
}