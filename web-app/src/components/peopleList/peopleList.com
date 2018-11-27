<template>
	<div class="peopleList">
		peopleList
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
	.peopleList{

	}
</style>