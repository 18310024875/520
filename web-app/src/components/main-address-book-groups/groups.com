<template>
	<ul class="mab-groups">
		<li class="work-item" v-for="(item,key) in this.listobj" v-if="item.length">
			<p> {{key}} </p>
			<div class="man-item p-row" v-for="(v,k) in item">
				<div class="col1">
					<div class="ava-wrap">
						<!-- <img src="assets/images/cpb.png"/> -->
						<g_group_avatar :size="55" :fontSize="20" :list="v.users"></g_group_avatar>
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
	/*
		props=>{
			listobj
		}
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

		}
	}
</script>
<style lang="less">
	
</style>