<template>
	<div class="reply-read-list">
		<div
			v-if="!this.list.length" 
			class="nodata">
			<img src="assets/images/nodata.png"/>
			<p>暂无数据...</p>
		</div>

		<ul 
			v-if="this.list.length">
			<li class="li" 
				v-for="(item) in this.list"
				@click="this.goDiscoverDetail.bind(this , item )">
				<div class="init">
					<div class="col1">
						<g_avatar 
							style="border-radius:2px"
							class="ava"
							:radius="false"
							:width=" 45+'px' "
							:height=" 45+'px' "
							:fontSize=" 20+'px' "
							:avatar=" item.creator_avatar " 
							:name=" item.creator_cname ">		
						</g_avatar>	
					</div>
					<div class="col2">
						<div class="d1">
							{{item.creator_cname}}
						</div>
						<div class="d2">
							{{item.text}}
						</div>
						<div class="d3">
							{{this.$tool.friendlyTime( item.ctime )}}
						</div>
						<div class="unread" v-show="item.readed=='0'"></div>
					</div>
					<div class="col3" v-if="item.parent">
						<div class="img" v-if="item.parent.files && item.parent.files.length">
							<bg :url="item.parent.files[0].serverUrl"></bg>
						</div>
						<div class="text">
							{{item.parent.text}}
						</div>

					</div>
					<div class="col3" v-if="!item.parent">
						<div class="nodata">
							<img src="assets/images/nodata.png"/>
							<div class="p">已删除</div>
						</div>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>
<script type="text/javascript">

	import bg from 'components/common/bg';
	export default{
		components:{
			bg
		},

		data(){
			return {
				list:[]
			}
		},

		mounted(){
			this.getList();
		},

		methods:{
			getList(){
				let readed = this.$router.query.readed||'all' ;
				App.imAjax({
					method:'reply_read_listNotic',
					data:{
						readed
					},
					success: res=>{
						this.list = res ;
						this.$diff ;
					}
				})
			},
			goDiscoverDetail( item ){
				location.hash=`#/discoverDetail?pid=${item.pid}&id=${item.id}`;
				// if( item.pid&&item.parent ){}	
			}
		}
	}
</script>
<style lang="less">
	.reply-read-list{
		position: absolute;
		left: 0;right: 0;
		top: 0;bottom: 0;
		overflow: auto;
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
		ul{
			.li{
				position: relative;
				padding: 11px 14px 11px 14px;
				border-bottom: 1px solid #ededed;
				.init{
					position: relative;
					padding-left: 58px;
					padding-right: 65px;
					.col1{
						position: absolute;
						left: 0;
						padding-top: 1px;
					}
					.col2{
						position: relative;
						line-height: 20px;
						.d1{
							color: #284696;
							font-size: 15px;
						}
						.d2{
							color: #111;
							font-size: 16px;
						}
						.d3{
							color: #999;
							font-size: 13px;
							margin-top: 2px;
						}
						.unread{
							position: absolute;
						    right: 8px;
						    top: 18px;
						    width: 7px;
						    height: 7px;
							border-radius: 50%;
							background: #ed4014;
							opacity: 0.9;
						}
					}
					.col3{
						position: absolute;
						top: -1px;right: 0;
						width: 60px;
						height: 60px;
						background: #f5f5f5;
						overflow: hidden;
						.img{

						}
						.text{
							padding:3px;
							height: 100%;
						}
						.nodata{
							position: relative;
							height: 100%;
							img{
								width: 60px;height: 60px;
							}
							.p{
								color: #ed4014;
								font-size: 14px;
								position: absolute;
								left: 0;right: 0;
								top: 0;bottom: 0;
								text-align: center;
								line-height: 60px;
								transform: rotate(-45deg);
							}
						}
					}
				}
			}
		}
	}
</style>