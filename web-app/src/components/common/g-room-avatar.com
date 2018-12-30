<template>
	<div class="g-room-avatar" 
		:style="{
			width:  (this.size||50)+'px' ,
			height: (this.size||50)+'px' 
		}">
		<!-- 人 -->
		<div class="type_0" v-if="this.data.type==0">
			<avatar 
				:radius="false"
				:width=" (this.size||50)+'px' "
				:height=" (this.size||50)+'px' "
				:fontSize=" (this.fontSize||20)+'px' "
				:avatar=" this.taht_man().avatar " 
				:name=" this.taht_man().cname ">		
			</avatar>
		</div>
		<!-- 群 -->
		<div class="type_1" v-if="this.data.type==1">
			<groupAvatar :size="this.size" :fontSize="this.fontSize" :list="this.data.users"></groupAvatar>
		</div>
	</div>
</template>
<script type="text/javascript">
	/*
		props=>{
			data:
			size:
			fontSize:
		}
 	*/
	import avatar from './g-avatar';
	import groupAvatar from './g-group-avatar';
	export default{
		components:{
			avatar,
			groupAvatar
		},

		data(){
			return {

			}
		},
		methods:{
			taht_man(){
				let uid = this.$root.userInfo.uid ;
				let users = this.data.users ;

				let sender = users.filter(man=>{
					return man.uid != uid ;
				})
				if( sender.length==1 ){
					return sender[0];
				}else if(sender.length==0){
					return users[0];
				}
			}
		}
	}
</script>
<style lang="less">
	.g-room-avatar{
		position: relative;
		.type_0{
			position: absolute;
			left: 0;right: 0;
			top: 0;bottom: 0;
		}
		.type_1{
			position: absolute;
			left: 0;right: 0;
			top: 0;bottom: 0;
		}
	}
</style>