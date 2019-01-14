<template>
	<div class="discover-detail">
		<div class="nodata" v-if="!this.detail">
			<img src="assets/images/nodata.png"/>
			<p>暂无数据...</p>
		</div>

		<item 
			v-if="this.detail"
			:data="this.detail"
			:success="()=>{
				this.getDetail();
			}">		
		</item>
	</div>
</template>
<script type="text/javascript">
	import item from './item';
	export default{
		components:{
			item
		},

		data(){
			return {
				detail:''
			}
		},

		mounted(){
			let pid = this.$router.query.pid ;
			let id = this.$router.query.id ;
			if( pid&&id ){
				this.pid = pid ;
				this.id = id ;
				// 获取详情
				this.getDetail(()=>{
					// 消息设置已读
					this.readed()
				});
			}else{
				mui.alert('pid或者id不存在')
			}
		},

		methods:{
			getDetail( cb ){
				App.imAjax({
					method:"reply_getAboutMe",
					data:{
						id: this.pid
					},
					success: res=>{
						this.detail = res[0];
						this.$diff ;
						cb && cb();
					}
				})
			},
			readed(){
				App.imAjax({
					method:"reply_read_readed",
					data:{
						id: this.id
					},
					success: res=>{
						
					}
				})
			}
		}
	}
</script>
<style lang="less">
	.discover-detail{
		position: absolute;
		left: 0;right: 0;
		top: 0;bottom: 0;
		overflow: auto;
		.discover-item{
			border-bottom-color: white;
		}
		.nodata{
			padding-top: 150px;
			text-align: center;
			p{
				font-size: 15px;
				color: #999;
				text-align: center;
				margin-top: 10px;
			}
		}
	}
</style>