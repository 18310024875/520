<template>
	
	<router-view class="main-address-book"></router-view>

</template>
<script type="text/javascript">
	

	export default{
		data(){
			return {}
		},

		destroyed(){

		},

		methods:{

		}
	}
</script>