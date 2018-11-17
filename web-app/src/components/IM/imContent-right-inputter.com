<template>
	<div class="imc-right-inputter">
		<div class="row1">
			<div>
				<span class="icon2-smile"></span>
			</div>
			<div>
				<label>
					<span class="icon2-upload"></span>
					<gUpload 
						style="display:none;" 
						:success=" this.reset.bind(this) "
						:getUploadInfo=" this.getUploadInfo.bind(this) "/>
				</label>
			</div>
		</div>
		<div class="row2">
			<textarea 
				autofocus="autofocus" 
				:value="this.text" 
				@input="this.input">
			</textarea>
			<div class="btn active" @click="this.sendMessage">发送</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	
	/*
		props:{
			ACTIVE_ROOM_INFO
		}
	*/


	// config
	import config from 'src/config';

	export default{
		props:{},
		components:{

		},

		data(){
			let localHost = config['localHost'];
			return {
				text:''
			}
		},
		methods:{
			reset(){
				this.text='';
				this.$diff ;
			},
			input(e){
				this.text = e.target.value ;
				this.$diff ;
			},
			sendMessage(){
				if( !this.text ){ return };
				this.$ajax2({
					type:'post',
					url:'/ws/sendMessage',
					data:{
						room_id: this.ACTIVE_ROOM_INFO.roomId ,
						text: this.text 
					},
					success( res ){
						res.code==0 ? this.reset() : null ;
					}
				})
			},
			getUploadInfo(){
				let localHost = config['localHost'];
				return {
					name: 'upload',
					action: `${localHost}/ws/upload?room_id=${this.ACTIVE_ROOM_INFO.roomId}`
				}
			}
		}
	}
</script>
<style lang="less">
	.imc-right-inputter{
		position: absolute;
		left: 0;top: 0;right: 0;bottom: 0;
		background: #f8f8f8;
		padding: 10px;
		.row1{
			height: 25px;
			padding-left: 10px;
			&>div{
				display: inline-block;
				vertical-align: middle;
				line-height: 25px;
				font-size: 17px;
				color: #999;
				margin-right: 15px;
			}
		}
		.row2{
			position: absolute;
			top: 35px;bottom: 0;
			left: 10px;right: 10px;
			&>textarea{
				width: 100%;
				height: 75px;
				outline: none;
				border:none;
				resize: none;
				line-height: 20px;
				color: #333;
				font-size: 14px;
				background: transparent;
			}
			&>.btn{
			    background-color: #fa4f52;
			    width: 62px;
			    height: 28px;
			    border-radius: 4px;
			    line-height: 28px;
			    text-align: center;
			    color: #fff;
			    float: right;
			    cursor: pointer;
			    font-size: 12px;
			    position: absolute;
			    right: 0px;
			    bottom: 10px;
			    opacity: 0.5;
			    pointer-events: none;
			}
			&>.btn.active{
				pointer-events:unset;
				opacity: 1;
			}
		}
	}
</style>