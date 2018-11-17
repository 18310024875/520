<template>

	<div class="im-bar" @click="this.openIm">
		{{this.imBarStr||''}}
	</div>

</template>
<script type="text/javascript">
	
	export default{
		props:{},
		components:{

		},

		data(){
			return {

			}
		},
		methods:{
			openIm(){
				
			}
		}
	}
</script>
<style lang="less">
	.im-bar{
		width: 192px;
		height: 40px;
		background: #fa4f52;
		box-shadow: 0 0 8px rgba(0,0,0,.2);
	    line-height: 40px;
	    position: fixed;
	    bottom: 0;
	    right: 10px;
	    cursor: pointer;
	    border-radius: 3px;
	    color: white;
	    text-align: center;
	}
</style>