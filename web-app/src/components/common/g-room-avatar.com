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
			<!-- 三条 -->
			<div class="len3" v-if="this.data.manList.length==3">
				<ul class="ul1 bb">
					<li class="br">
						<avatar 
							:radius="false"
							:width=" (this.size||50)/2+'px' "
							:height=" (this.size||50)/2+'px' "
							:fontSize=" (this.fontSize||20)*0.8+'px' "
							:avatar=" this.data.manList[0].avatar " 
							:name=" this.data.manList[0].cname "
							:nameLength="1">		
						</avatar>
					</li>
					<li>
						<avatar 
							:radius="false"
							:width=" (this.size||50)/2+'px' "
							:height=" (this.size||50)/2+'px' "
							:fontSize=" (this.fontSize||20)*0.8+'px' "
							:avatar=" this.data.manList[1].avatar " 
							:name=" this.data.manList[1].cname "
							:nameLength="1">		
						</avatar>
					</li>
				</ul>
				<ul class="ul2">
					<li>
						<avatar 
							:radius="false"
							:width=" (this.size||50)+'px' "
							:height=" (this.size||50)/2+'px' "
							:fontSize=" (this.fontSize||20)*0.8+'px' "
							:avatar=" this.data.manList[2].avatar " 
							:name=" this.data.manList[2].cname ">		
						</avatar>
					</li>
				</ul>
			</div>
			<!-- 大于等于四条 -->
			<div class="len4" v-if="this.data.manList.length>=4">
				<ul class="ul1 bb">
					<li class="br">
						<avatar 
							:radius="false"
							:width=" (this.size||50)/2+'px' "
							:height=" (this.size||50)/2+'px' "
							:fontSize=" (this.fontSize||20)*0.8+'px' "
							:avatar=" this.data.manList[0].avatar " 
							:name=" this.data.manList[0].cname "
							:nameLength="1">		
						</avatar>
					</li>
					<li>
						<avatar 
							:radius="false"
							:width=" (this.size||50)/2+'px' "
							:height=" (this.size||50)/2+'px' "
							:fontSize=" (this.fontSize||20)*0.8+'px' "
							:avatar=" this.data.manList[1].avatar " 
							:name=" this.data.manList[1].cname "
							:nameLength="1">		
						</avatar>
					</li>
				</ul>
				<ul class="ul2">
					<li class="br">
						<avatar 
							:radius="false"
							:width=" (this.size||50)/2+'px' "
							:height=" (this.size||50)/2+'px' "
							:fontSize=" (this.fontSize||20)*0.8+'px' "
							:avatar=" this.data.manList[2].avatar " 
							:name=" this.data.manList[2].cname "
							:nameLength="1">		
						</avatar>
					</li>
					<li>
						<avatar 
							:radius="false"
							:width=" (this.size||50)/2+'px' "
							:height=" (this.size||50)/2+'px' "
							:fontSize=" (this.fontSize||20)*0.8+'px' "
							:avatar=" this.data.manList[3].avatar " 
							:name=" this.data.manList[3].cname "
							:nameLength="1">		
						</avatar>
					</li>
				</ul>	
			</div>
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
	export default{
		components:{
			avatar
		},

		data(){
			return {

			}
		},
		methods:{
			taht_man(){
				let uid = this.$root.userInfo.uid ;
				let manList = this.data.manList ;

				let sender = manList.filter(man=>{
					return man.uid != uid ;
				})
				if( sender.length==1 ){
					return sender[0];
				}else if(sender.length==0){
					return manList[0];
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
			.bb{
				border-bottom: 1px solid white;
			}
			.br{
				border-right: 1px solid white;
			}
			.len3{
				position: absolute;
				left: 0;right: 0;top: 0;bottom: 0;
				overflow: hidden;
				.ul1{
					position: absolute;
					left: 0;right: 0;
					top: 0;height: 50%;
					li{
						float: left;
						width: 50%;height: 100%;
						overflow: hidden;
						position: relative;
					}
				}
				.ul2{
					position: absolute;
					left: 0;right: 0;
					bottom: 0;height: 50%;		
				}
			}
			.len4{
				position: absolute;
				left: 0;right: 0;top: 0;bottom: 0;
				overflow: hidden;
				.ul1{
					position: absolute;
					left: 0;right: 0;
					top: 0;height: 50%;
					li{
						float: left;
						width: 50%;height: 100%;
						overflow: hidden;
						position: relative;
					}
				}
				.ul2{
					position: absolute;
					left: 0;right: 0;
					bottom: 0;height: 50%;
					li{
						float: left;
						width: 50%;height: 100%;
						overflow: hidden;
						position: relative;
					}		
				}
			}
		}
	}
</style>