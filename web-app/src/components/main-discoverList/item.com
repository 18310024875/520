<template>
	<div class="discover-item">
		<div class="col1">
			<g_avatar 
				class="ava"
				:radius="false"
				:width=" 45+'px' "
				:height=" 45+'px' "
				:fontSize=" 18+'px' "
				:avatar=" this.$root.userInfo.avatar " 
				:name=" this.$root.userInfo.cname ">		
			</g_avatar>	
		</div>
		<div class="col2">
			2
		</div>
	</div>
</template>
<script type="text/javascript">
	
	export default{
		components:{

		},

		data(){
			return {

			}
		},
		methods:{

		}
	}
</script>
<style lang="less">
	.discover-item{
		padding-top: 10px;
		padding-bottom: 10px;
		position: relative;
		padding-left: 68px;
		border-bottom: 1px solid #ededed;
		.col1{
			position: absolute;
			left: 0;top: 0;bottom: 0;
			width: 68px;
			background: red;
			padding-left: 11px;
			.ava{

			}
		}
		.clo2{
			position: relative;
		}
	}
</style>