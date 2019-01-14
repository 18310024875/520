<template>
	<div class="main-discover-list">
		<!-- 滚动区 -->
		<div class="scroll" ref="scroll">
			<div class="part1">

				<!-- 接收到的推送 -->
				<div
					v-if=" this.$root.unread.list3.length>0 "
					class="socket-msg"
					@click="this.goReplyReadList.bind(this,'0')">
					<div class="col1">
						<g_avatar 
							style="border-radius:2px"
							class="ava"
							:radius="false"
							:width=" 28+'px' "
							:height=" 28+'px' "
							:fontSize=" 15+'px' "
							:avatar=" this.$root.userInfo.avatar " 
							:name=" this.$root.userInfo.cname ">		
						</g_avatar>	
					</div>
					<div class="col2">
						{{this.$root.unread.list3.length}}条未读消息
					</div>
				</div>
				<!-- 背景图 -->
				<bg :url=" this.$root.userInfo.discover_bg || 'assets/images/cpb.png' "/>
				<div class="under">
					<!-- 评论列表 -->
					<div class="fl"
						 style="position:relative;top:-10px;margin-right:5px;margin-top:1px"
						@click="this.goReplyReadList.bind(this,'all')">
						<span class="mui-icon mui-icon-chatbubble"></span>
					</div>
					<!-- 发动态 -->
					<div class="fl" 
						 style="position:relative;top:-10px;margin-right:6px;"
						@click="()=>{
							this.showMask=true ; this.$diff ;
						}">
						<span class="mui-icon mui-icon-camera"></span>
					</div>
					<!-- 名字 -->
					<div class="fl" style="position:relative;top:-10px;font-size:17px;margin-right:10px;">
						{{this.$root.userInfo.cname}}
					</div>
					<!-- 头像 -->
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
				<!-- 刷新按钮 -->
				<div class="under2" 
					@click="this.reload.bind(this)">
					<span class="mui-icon mui-icon-reload"></span>
				</div>
			</div>

			<div class="part2"> 
				<!-- 每条动态 -->
				<item 
					v-for="(item) in this.list" 
					:data="item"
					:success="()=>{
						this.reload();
					}">		
				</item>

				<!-- 无数据 -->
				<div class="nodata" v-if="this.list.length==0">
					<img src="assets/images/nodata.png"/>
					<p>暂无数据...</p>
				</div>
			</div>
		</div>

		<!-- 谈话浮层 -->
		<talkMask 
			v-if="this.showMask" 
			:allowUpload="true"
			:pid="''"
			:accept_id="''"
			:close="()=>{
				this.showMask=false ; this.$diff ;
			}"
			:success="()=>{
				this.reload();
			}">		
		</talkMask>

	</div>
</template>
<script type="text/javascript">
	
	import bg from 'components/common/bg';
	import item from './item';
	import talkMask from './talk-mask';
	export default{
		components:{
			bg,
			item,
			talkMask
		},

		data(){
			return {
				showMask:false,
				last_id:0,
				list:[]
			}
		},

		mounted(){
			this.reload();
		},

		methods:{
			reload(){
				this.last_id = 0;
				this.getList();
				this.$root.getUnreadAll();
			},
			loadmore(){

			},
			getList( cb ){
				App.imAjax({
					method: "reply_getAboutMe" ,
					data:{
						last_id: this.last_id
					},
					success:list=>{
						if( this.last_id==0 ){
							this.list = list ;
							this.$diff ;
						}else{
							this.list = this.list.concat( list );
							this.$diff ;
						}

						if(!this.firstInit){
							this.firstInit=true;
							this.initScrollFn();
						}

						setTimeout(()=>{
							cb&&cb();
						},100)
					},
					error:err=>{
						setTimeout(()=>{
							cb&&cb();
						},100)						
					}
				})
			},
			initScrollFn(){
				let dom = this.$refs.scroll ;
				dom.allow = true ;
				dom.onscroll=()=>{
					if(dom.allow){
						if( (dom.offsetHeight+dom.scrollTop+20) >= dom.scrollHeight){
							dom.allow = false ;
							this.last_id = (this.list[this.list.length-1]&&this.list[this.list.length-1].id)||0 ;
							this.getList(()=>{
								dom.allow = true ;
							})
						}
					}
				};
			},
			// 去回复我的列表 ;
			goReplyReadList( readed ){
				location.hash='#/replyReadList?readed='+readed ;
			}
		}
	}
</script>
<style lang="less">
	.main-discover-list{
		position: absolute;
		left: 0;right: 0;
		top: 0;bottom: 0;
		overflow: hidden;
		.nodata{
			text-align: center;
			p{
				font-size: 15px;
				color: #999;
				text-align: center;
				margin-top: 10px;
			}
		}
		.socket-msg{
			position: absolute;
			left: 50%;bottom: -51px;
			transform: translate(-50%,0);
			width: 145px;
			height: 38px;
			line-height: 38px;
			border-radius: 3px;
			background: rgba(0,0,0,0.7);
			padding-left: 49px; 
			z-index: 1;
			.col1{
				position: absolute;
				left: 7px;top: 5px;bottom: 0;
			}
			.col2{
				text-align: left;
				color: white;
				font-size: 14px;
			}
		}
		&>.scroll{
			position: absolute;
			left: 0;right: 0;
			top: 0;bottom: 0;			
			overflow: auto;
		}
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