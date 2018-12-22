<template>
	<ul class="list-group">
		<li class="work-item" v-for="(item,key) in this.$root.groupJoined" v-if="item.length">
			<p> {{key}} </p>
			<div class="man-item p-row" v-for="(v,k) in item" @click="this.talkToGroup(v)">
				<div class="col1">
					<div class="ava-wrap">
						<!-- <img src="assets/images/cpb.png"/> -->
						<g_group_avatar :size="55" :fontSize="20" :list="v.manList"></g_group_avatar>
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
			talkToGroup(room){
				location.hash = `/activeRoom?room_id=${room.room_id}`;
			}
		}
	}
</script>
<style lang="less">
	
	.list-group{

	}

</style>