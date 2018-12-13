<template>

	<form ref="form" class="upload_form">

		<input 
			ref="input" 
			type="file" 
			enctype="multipart/form-data" 
			@change="this.inputChange"/>

	</form>

</template>
<script type="text/javascript">
	/*	
		props
			action
			name
			success
			error
	*/
	export default{
		data(){
			return {}
		},

		methods:{
			resetForm(){
				try{
					let form = this.$refs.form ;
						form.reset();
				}catch(e){}
			},
			inputChange(){
				// // 拓展名
				// let ext = file.name.split('.').pop();
				// // 文件大小(兆)
				// let kb  = Number((file.size/1024).toFixed(2));
				let action=this.action ;
				let name = this.name ;
				if( action&&name ){
					let input = this.$refs.input ;
					let files = this.$refs.input.files ;
					let fd  = new window.FormData;
						fd.append( name , files[0] );
					// ajax
					let xhr = new window.XMLHttpRequest;
				        xhr.upload.onprogress = (e)=>{
				        	console.log( (e.loaded/e.total) )
				        };
				        xhr.onreadystatechange = ()=>{
				            if( xhr.readyState == 4 ) {
				            	if( xhr.status == 200){
				            		this.success && this.success( xhr.responseText );
				            		this.resetForm();
				            	}else{
									this.error && this.error()
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
			}
		}
	}
</script>
<style lang="less">
	
</style>