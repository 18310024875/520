<template>
	<ul class="list-people">
		<li class="work-item" v-for="(item,key) in this.$root.allPeople" v-if="item.length">
			<p> {{key}} </p>
			<div class="man-item p-row" v-for="(v,k) in item" @click="this.talkToOne(v)">
				<div class="col1">
					<div class="ava-wrap">
						<!-- <img src="assets/images/cpb.png"/> -->
						<g_avatar 
							:radius="false"
							:width="'44px'"
							:height="'44px'"
							:fontSize="'20px'"
							:avatar="v.avatar" 
							:name="v.cname ">		
						</g_avatar>
					</div>
				</div>
				<div class="col2">
					<span class="name">{{v.cname}}</span>
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
			this.$root.getAllPeople();
		},

		methods:{
			talkToOne(man){
				this.$root.talkToOne(man.uid,room=>{
					location.hash = `/activeRoom?room_id=${room.room_id}`;
				});
			}	
		}
	}
</script>
<style lang="less">

	.list-people{
	
	}

</style>