<template>
	<div 
		class="discover-bg"
		ref="imgdiv" 
		:style="{
			background: 'url('+this.url+') no-repeat' ,
			backgroundSize:'cover'
		}">
		
	</div>
</template>
<script type="text/javascript">
	
	// props -> url
	export default{
		components:{

		},

		data(){
			return {

			}
		},

		mounted(){
			this.__url = this.url ;
		},
		updated(){
			// 解决替换图片问题 ;;
			if( this.__url != this.url ){
				this.__url  = this.url ;
				try{
					this.$refs.imgdiv.style.backgroundSize='cover';
				}catch(e){}
			}
		},

		methods:{

		}
	}
</script>
<style lang="less">
	.discover-bg{
		position: absolute;
		left: 0;right: 0;
		top: 0;bottom: 0;
	}
</style>