<template>
	<div class="main-discoverList">
		<div class="part1">
			<bg :url=" this.$root.userInfo.discover_bg || 'assets/images/cpb.png' "/>
			<div class="under">
				<div class="fl" style="position:relative;top:-10px;margin-right:6px;">
					<span class="mui-icon mui-icon-camera"></span>
				</div>
				<div class="fl" style="position:relative;top:-10px;font-size:17px;margin-right:10px;">
					{{this.$root.userInfo.cname}}
				</div>
				<div class="fl">
					<g_avatar 
						class="ava"
						:radius="false"
						:width=" 64+'px' "
						:height=" 64+'px' "
						:fontSize=" 23+'px' "
						:avatar=" this.$root.userInfo.avatar " 
						:name=" this.$root.userInfo.cname ">		
					</g_avatar>	
				</div>
			</div>
			<div class="under2">
				<span class="mui-icon mui-icon-reload"></span>
			</div>
		</div>
		<div class="part2"> 

			<item v-for="(v,k) in this.list" :data="v"></item>

		</div>
	</div>
</template>
<script type="text/javascript">
	
	import bg from './bg';
	import item from './item';
	export default{
		components:{
			bg,
			item
		},

		data(){
			return {
				list:[1,2,3]
			}
		},
		methods:{

		}
	}
</script>
<style lang="less">
	.main-discoverList{
		position: absolute;
		left: 0;right: 0;
		top: 0;bottom: 0;
		overflow: auto;
		.part1{
			height: 280px;
			position: relative;
			.under{
				position: absolute;
				right: 11px;
				bottom: -22px;
				color: white;
				.fl{
					display: inline-block;
					vertical-align: middle;
					.mui-icon{
						font-size: 30px;
					}
					.ava{
						border:1px solid #ededed;
					}
				}
			}
			.under2{
				position: absolute;
				right: 11px;top: 10px;
				color: white;
				.mui-icon{
					font-size: 25px;
					font-weight: bold;
				}
			}
		}
		.part2{
			padding-top: 50px;
		}
	}
</style>