<template>
	<div id="main">
		<!-- 路由容器 -->
		<router-view class="2-router main-content"></router-view>
		
		<!-- 底部 -->
		<ul class="main-footer">
			<li v-for="item in this.navList" class="li" 
				:class="{
					active: item.path==this.navActive 
				}"
				@click="()=>{
					this.navActive = item.path ;
					this.$diff ;
					location.hash = item.path ;
				}">
				<div class="part1">
					<span :class="item.icon"></span>
				</div>
				<div class="part2">
					{{item.name}}
				</div>
			</li>
		</ul>
	</div>
</template>
<script type="text/javascript">
	
	export default{
		components:{

		},

		data(){
			return {
				// 样式相关
				navList:[
					{icon:'mui-icon mui-icon-chatbubble',path:'/main/roomList',name:'微信'},
					{icon:'mui-icon mui-icon-personadd',path:'/main/addressBook/friends',name:'通讯录'},
					{icon:'mui-icon mui-icon-navigate',path:'/main/discoverList',name:'发现'},
					{icon:'mui-icon mui-icon-gear',path:'/main/mine',name:'设置'}
				],
				navActive:'',
			}
		},

		mounted(){
			// 得到默认导航
			this.getNavActive();
		},

		methods:{
			// 得到默认导航
			getNavActive(){
				this.navList.map(item=>{
					let str = item.path.match(/main(\/\w+)/)[1];
					if( location.href.indexOf( str )>-1 ){
						this.navActive = item.path ;
						this.$diff ;
					}
				})
			}
		}
	}
</script>
<style lang="less">

	#main{	
		position: absolute;
		left: 0;right: 0;
		top: 0;bottom: 0;
		.main-content{
			position: absolute;
			top: 0;left: 0;right: 0;
			bottom: 55px;
		}
		.main-footer{
			position: absolute;
			bottom: 0;left: 0;right: 0;
			height: 56px;
			border-top: 0.5px solid #ddd;
			.li{
				float: left;
				width: 25%;
				height: 56px;
				text-align: center;
				.part1{
					padding-top: 4px;
					.mui-icon{
						font-size: 26px;
					}
				}
				.part2{
					font-size: 12px;
				}
			}
			.li.active{
				color: #19be6b;
			}
		}
	}

</style>