
import config from 'src/config';

export default ( files=[] , yes , no )=>{
	if( files.length==0 ){
		yes&&yes([])
	};

	let uid = App.userInfo.uid ;
	if( uid ){
		let action = `${config.uploadHost}/file/upload?uid=${uid}`;
				
		let formData  = new window.FormData;
		files.map(file=>{
			formData.append( 'upload' , file);
		})
		// ajax
		let xhr = new window.XMLHttpRequest;
	        xhr.upload.onprogress = (e)=>{
	        	console.log( (e.loaded/e.total) )
	        };
	        xhr.onreadystatechange = ()=>{
	            if( xhr.readyState == 4 ) {
	            	if( xhr.status == 200){
	            		yes && yes( JSON.parse(xhr.responseText) );
	            	}else{
						no && no();
	            	};
	            }
	        };
	        xhr.onerror=(e)=>{
	        	no && no(e);
	        }
	        // 发送
	        xhr.open('POST', action , true);
	        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	        xhr.withCredentials = true;
	        // 发送FormData对象 ;
	        xhr.send( formData );	

	}else{
		no&&no('没有用户id')
	}
}