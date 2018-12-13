<template>
	<ul class="list-group">
		<li class="work-item" v-for="(item,key) in (this.list||[])" v-if="item.length">
			<p> {{key}} </p>
			<div class="man-item p-row" v-for="(v,k) in item">
				<div class="col1">
					<div class="ava-wrap">
						<img src="assets/images/cpb.png"/>
					</div>
				</div>
				<div class="col2">
					<span class="name">{{v.room_name}}</span>
				</div>
			</div>
		</li>
	</ul>
</template>
<script type="text/javascript">
	
	export default{
		data(){
			return {}
		},

		mounted(){
			this.$root.getGroupJoined();
		},	

		methods:{

		}
	}
</script>
<style lang="less">
	
	.list-group{

	}

</style>