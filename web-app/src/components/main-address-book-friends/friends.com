<template>
	<ul class="mab-friends">
		<li class="work-item" 
			v-for="(item,key) in this.listobj" 
			v-if="item.length">
			<p> {{key}} </p>
			<div class="man-item p-row" 
				 v-for="(v,k) in item"
				 @click="this.viewUser.bind(this,v.uid)">
				<div class="col1">
					<div class="ava-wrap">
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
	/*
		porps=>{
			listobj
		}
	*/
	export default{
		components:{

		},

		data(){
			return {

			}
		},
		methods:{
			viewUser( uid ){
				location.hash=`#/userDetail?uid=${uid}`
			},
		}
	}
</script>
<style lang="less">

</style>