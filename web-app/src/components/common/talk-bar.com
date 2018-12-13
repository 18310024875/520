<template>
	<div class="talk-bar">
		<div class="lp">
			<div class="input-wrap">
				<input 
					class="input" type="" name="" 
					:placeholder="this.placeholder||''" 
					:value="this.value||''" 
					@keydown="this.keydown"/>
			</div>
		</div>
		<div class="rp">
			<img src="assets/images/kaixin.png"/>
			<label>
				<img src="assets/images/tianjia.png"/>
				<g_upload 
					style="display:none;" 
					:action="this.action"
					:name="this.name"
					:success="this.success.bind(this)"
					:error="this.error.bind(this)"
				></g_upload>
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
	import config from 'src/config';
	export default{
		data(){
			return {
				action:`${config.uploadHost}/file/upload?uid=${this.$root.userInfo.uid}`,
				name:'upload'
			}
		},
		methods:{
			success(res){
				res = JSON.parse(res);
				if( res.code==0 ){
					// 上传成功后 , 广播文件
					this.upload && this.upload( res.data );
				}
			},
			error(){
				mui.alert('上传失败')
			},
			keydown(e){
				if( e.keyCode==13 ){
					this.enter && this.enter( e.target.value );
				}
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
			left: 0;top: 0;bottom: 0;right: 75px;
			padding-top: 5px;
			padding-left: 12px;
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
			width: 75px;
			padding-top: 8px;
			padding-left: 4px;
			img{
				width: 25px;
				vertical-align: middle;
				margin-left: 6px;
			}
		}
	}

</style>