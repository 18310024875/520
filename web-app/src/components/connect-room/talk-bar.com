<template>
	<div class="talk-bar">
		<div class="lp">
			<div class="input-wrap">
				<input 
					class="input" type="" name="" 
					:placeholder="this.placeholder||''" 
					:value="this.value||''" 
					@keydown="this.keydown.bind(this)"/>
			</div>
		</div>
		<div class="rp">
			<label>
				<img src="assets/images/tianjia.png"/>
				<form ref="form">
					<input 
						style="display:none;" 
						type="file" 
						@change="this.addFile.bind(this)">
					</input>
				</form>
			</label>
		</div>
	</div>
</template>
<script type="text/javascript">
	/*
		placeholder
		value
		enter
		upload
	*/
	import uploadFun from 'components/common/upload-fun';
	export default{
		data(){
			return {

			}
		},
		methods:{
			keydown(e){
				if( e.keyCode==13 ){
					this.enter && this.enter( e.target.value );
				}
			},
			addFile(e){
				// 上传文件
				uploadFun( [...e.target.files] , res=>{
					if( res.code==0 ){
						this.upload && this.upload( res.data[0] )
					}else{
						mui.alert('上传失败')
					}

					this.resetForm();
				},err=>{
					this.resetForm();
				})
			},
			resetForm(){
				try{
					this.$refs.form.reset();
				}catch(e){};
			}
		}
	}
</script>
<style lang="less">
	
	.talk-bar{
		height: 40px;
		position: relative;
		.lp{
			position: absolute;
			left: 0;top: 0;bottom: 0;right: 50px;
			padding-left: 12px;
			padding-top: 8px;
			.input-wrap{
				padding:4px 0 ;
				position: relative;
				border:0.5px solid #ddd;
				border-radius: 4px;
				overflow: hidden;
				.input{
					width: 100%;
					background: white;
					height: 20px;
					line-height: 20px;
					font-size: 15px;
					text-indent: 10px;
					color: #111;
				}
			}
		}
		.rp{
			position: absolute;
			top: 0;bottom: 0;right: 0;
			width: 50px;
			text-align: center;
			padding-top: 10px;
			img{
				width: 25px;
				vertical-align: middle;
			}
		}
	}

</style>