<template>
	<div class="discover-item">
		<div class="col1">
			<g_avatar 
				class="ava"
				:radius="false"
				:width=" 45+'px' "
				:height=" 45+'px' "
				:fontSize=" 18+'px' "
				:avatar=" this.$root.userInfo.avatar " 
				:name=" this.$root.userInfo.cname ">		
			</g_avatar>	
		</div>
		<div class="col2">
			<div class="_name">
				{{ this.$root.userInfo.cname }}
			</div>
			<div class="_text">
				阿斯顿发顺丰
			</div>
			<div class="_img">
				<div class="len1">
					<img src="assets/images/cpb.png"/>
				</div>
				<div class="len2_4" :style="{paddingRight:img9_size+'px'}">
					<img src="assets/images/cpb.png" :style="{width:img9_size+4+'px',height:img9_size+4+'px'}" />
					<img src="assets/images/cpb.png" :style="{width:img9_size+4+'px',height:img9_size+4+'px'}" />
					<img src="assets/images/cpb.png" :style="{width:img9_size+4+'px',height:img9_size+4+'px'}" />
					<img src="assets/images/cpb.png" :style="{width:img9_size+4+'px',height:img9_size+4+'px'}" />		
				</div>
				<div class="len5_9">
					<img src="assets/images/cpb.png" :style="{width:img9_size+'px',height:img9_size+'px'}" />
					<img src="assets/images/cpb.png" :style="{width:img9_size+'px',height:img9_size+'px'}" />
					<img src="assets/images/cpb.png" :style="{width:img9_size+'px',height:img9_size+'px'}" />
					<img src="assets/images/cpb.png" :style="{width:img9_size+'px',height:img9_size+'px'}" />
					<img src="assets/images/cpb.png" :style="{width:img9_size+'px',height:img9_size+'px'}" />
					<img src="assets/images/cpb.png" :style="{width:img9_size+'px',height:img9_size+'px'}" />
					<img src="assets/images/cpb.png" :style="{width:img9_size+'px',height:img9_size+'px'}" />
					<img src="assets/images/cpb.png" :style="{width:img9_size+'px',height:img9_size+'px'}" />
					<img src="assets/images/cpb.png" :style="{width:img9_size+'px',height:img9_size+'px'}" />
				</div>
			</div>
<!-- 			<div class="_video">
				<video src="http://39.105.201.170:3000/www/files/CPU%201024g%202018-12-12%2014_8_1545480887063.mp4"
						width="180" height="180" style="background:black;overflow:hidden;border-radius:5px;" 
						controls="controls" preload="preload"/>
			</div> -->
		</div>
	</div>
</template>
<script type="text/javascript">

	let img9_size = (window.innerWidth-154)/3 ;
	export default{
		components:{

		},

		data(){
			return {
				img9_size
			}
		},
		methods:{

		}
	}
</script>
<style lang="less">
	.discover-item{
		padding-top: 10px;
		padding-bottom: 10px;
		position: relative;
		padding-left: 69px;
		border-bottom: 1px solid #ededed;
		.col1{
			position: absolute;
			left: 0;top: 10px;bottom: 10px;
			width: 69px;
			padding-left: 12px;
			.ava{

			}
		}
		.col2{
			position: relative;
			padding-right: 10px;
			._name{
				color: #111;
				font-size: 15px;
			}
			._text{
				color: #666;
				font-size: 15px;
				line-height: 21px;
				margin-top: 2px;
			}
			._img{
				padding-top: 8px;
				padding-bottom: 5px;
				img{
					border-radius: 1px;
				}
				.len1{
					width: 100%;
					img{
						width: 200px;
					}
				}
				.len2_4{
					width: 100%;
					overflow: hidden;
					img{
						float: left;
						width: 33%;height: 33%;
						margin-right: 6px;
						margin-top: 6px;
					}	
				}
				.len5_9{
					width: 100%;
					overflow: hidden;
					img{
						float: left;
						width: 33%;height: 33%;
						margin-right: 6px;
						margin-top: 6px;
					}
				}
			}
			._video{
				padding-top: 8px;
			}
		}
	}
</style>