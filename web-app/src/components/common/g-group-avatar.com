<template>
	<div class="g-group-avatar">
		<!-- 2条 -->
		<div class="len2" v-if="this.list.length==2">
			<ul class="ul1 bb">
				<li class="br">
					<avatar 
						:radius="false"
						:width=" (this.size||50)/2+'px' "
						:height=" (this.size||50)+'px' "
						:fontSize=" (this.fontSize||20)*0.8+'px' "
						:avatar=" this.list[0].avatar " 
						:name=" this.list[0].cname "
						:nameLength="1">		
					</avatar>
				</li>
				<li>
					<avatar 
						:radius="false"
						:width=" (this.size||50)/2+'px' "
						:height=" (this.size||50)+'px' "
						:fontSize=" (this.fontSize||20)*0.8+'px' "
						:avatar=" this.list[1].avatar " 
						:name=" this.list[1].cname "
						:nameLength="1">		
					</avatar>
				</li>
			</ul>
		</div>

		<!-- 3条 -->
		<div class="len3" v-if="this.list.length==3">
			<ul class="ul1 bb">
				<li class="br">
					<avatar 
						:radius="false"
						:width=" (this.size||50)/2+'px' "
						:height=" (this.size||50)/2+'px' "
						:fontSize=" (this.fontSize||20)*0.8+'px' "
						:avatar=" this.list[0].avatar " 
						:name=" this.list[0].cname "
						:nameLength="1">		
					</avatar>
				</li>
				<li>
					<avatar 
						:radius="false"
						:width=" (this.size||50)/2+'px' "
						:height=" (this.size||50)/2+'px' "
						:fontSize=" (this.fontSize||20)*0.8+'px' "
						:avatar=" this.list[1].avatar " 
						:name=" this.list[1].cname "
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
						:avatar=" this.list[2].avatar " 
						:name=" this.list[2].cname ">		
					</avatar>
				</li>
			</ul>
		</div>

		<!-- 大于等于4条 -->
		<div class="len4" v-if="this.list.length>=4">
			<ul class="ul1 bb">
				<li class="br">
					<avatar 
						:radius="false"
						:width=" (this.size||50)/2+'px' "
						:height=" (this.size||50)/2+'px' "
						:fontSize=" (this.fontSize||20)*0.8+'px' "
						:avatar=" this.list[0].avatar " 
						:name=" this.list[0].cname "
						:nameLength="1">		
					</avatar>
				</li>
				<li>
					<avatar 
						:radius="false"
						:width=" (this.size||50)/2+'px' "
						:height=" (this.size||50)/2+'px' "
						:fontSize=" (this.fontSize||20)*0.8+'px' "
						:avatar=" this.list[1].avatar " 
						:name=" this.list[1].cname "
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
						:avatar=" this.list[2].avatar " 
						:name=" this.list[2].cname "
						:nameLength="1">		
					</avatar>
				</li>
				<li>
					<avatar 
						:radius="false"
						:width=" (this.size||50)/2+'px' "
						:height=" (this.size||50)/2+'px' "
						:fontSize=" (this.fontSize||20)*0.8+'px' "
						:avatar=" this.list[3].avatar " 
						:name=" this.list[3].cname "
						:nameLength="1">		
					</avatar>
				</li>
			</ul>	
		</div>

	</div>
</template>
<script type="text/javascript">
	/*
		porps:{
			list:[]
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

		}
	}
</script>
<style lang="less">
	.g-group-avatar{
		position: absolute;
		left: 0;right: 0;
		top: 0;bottom: 0;
		.bb{
			border-bottom: 1px solid white;
		}
		.br{
			border-right: 1px solid white;
		}
		.len2{
			position: absolute;
			left: 0;right: 0;top: 0;bottom: 0;
			overflow: hidden;		
			.ul1{
				position: absolute;
				left: 0;right: 0;
				top: 0;bottom: 0;
				li{
					float: left;
					width: 50%;height: 100%;
					overflow: hidden;
					position: relative;
				}
			}	
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
</style>