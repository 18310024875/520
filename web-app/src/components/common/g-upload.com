<template>

	<form ref="form">

		<input 
			ref="input" 
			type="file" 
			enctype="multipart/form-data" 
			multiple="multiple" 
			@change="this.inputChange"/>

	</form>

</template>
<script type="text/javascript">
	

	/*	
		props
			getUploadInfo
			success
	*/

	import upload from './g-upload-FormData.js';

	export default{
		props:{},
		components:{

		},

		data(){
			return {

			}
		},
		methods:{
			resetForm(){
				try{
					var form = this.$refs.form ;
						form.reset();
				}catch(e){}
			},
			inputChange(){
				var input = this.$refs.input ;
				var fileList = this.$refs.input.files || [] ;

				var uploadInfo = this.getUploadInfo&&this.getUploadInfo() ;

				if( uploadInfo && fileList.length ){
					upload( fileList , uploadInfo.name , uploadInfo.action , res=>{

						this.success && this.success( res );

						this.resetForm();
					},err=>{
						this.resetForm() ;
					});
				}	

			}
		}
	}
</script>
<style lang="less">
	
</style>