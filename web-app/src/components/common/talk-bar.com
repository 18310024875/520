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
			<img src="assets/images/tianjia.png"/>
		</div>
	</div>
</template>
<script type="text/javascript">
	/*
		placeholder
		value
		enter
	*/
	export default{
		props:{},
		components:{

		},

		data(){
			return {

			}
		},
		methods:{
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