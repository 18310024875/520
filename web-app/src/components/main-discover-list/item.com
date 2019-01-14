<template>
	<div class="discover-item">
		<div class="col1">
			<g_avatar 
				class="ava"
				:radius="false"
				:width=" 45+'px' "
				:height=" 45+'px' "
				:fontSize=" 18+'px' "
				:avatar=" this.data.creator_avatar " 
				:name=" this.data.creator_cname ">		
			</g_avatar>	
		</div>
		<div class="col2">
			<div class="_name">
				{{ this.data.creator_cname }}
			</div>
			<div class="_text">
				{{ this.data.text }}
			</div>
			<div class="_img" v-if="this.data.files && this.data.files.length">
				<div class="len1"
					 v-if=" this.data.files.length==1 ">
					<img 
						v-for="(f) in this.data.files" 
						:src="f.serverUrl"
						@click="this.openwin.bind(this , f.serverUrl)"/>
				</div>
				<div class="len2_4" 
					 v-if=" this.data.files.length>1 && this.data.files.length<=4 "
					:style="{paddingRight:img9_size+'px'}">
					<div class="imgwrap"
						v-for="(f) in this.data.files"
						:style="{width:img9_size+4+'px',height:img9_size+4+'px'}">
						<bg :url="f.serverUrl"></bg>
					</div>	
				</div>
				<div class="len5_9"
					 v-if=" this.data.files.length>4 ">
					<div class="imgwrap"
						v-for="(f) in this.data.files"
						:style="{width:img9_size+'px',height:img9_size+'px'}">
						<bg :url="f.serverUrl"></bg>
					</div>	
				</div>
			</div>
			<!-- <div class="_video">
				<video src="http://39.105.201.170:3000/www/files/CPU%201024g%202018-12-12%2014_8_1545480887063.mp4"
						width="180" height="180" style="background:black;overflow:hidden;border-radius:5px;" 
						controls="controls" preload="preload"/>
			</div> -->
		</div>
		<div class="col3">
			<div class="l">
				<span class="sp1">
					{{this.friendlyTime(this.data.ctime)}}
				</span>
				<span class="sp2"
					  v-show="this.$root.userInfo.uid==this.data.creator_id"
					  @click="this.deleteReply.bind(this, this.data.id)">
					删除
				</span>
			</div>
			<div  class="r" 
				  v-show="this.$root.userInfo.uid!=this.data.creator_id"
				  @click="(e)=>{
				  		this.showTalkMask=true ;
				  		this.$diff ;
				  }">
				<span style="font-size:23px" class="mui-icon mui-icon-compose"></span>
			</div>
		</div>
		<!-- 二级 -->
		<div class="col4" v-if="this.data.children &&this.data.children.length">
			<ul>
				<h1></h1>
				<li v-for="(child) in (this.data.children||[])"
					@click="this.replyChild.bind(this, child)">
					<span style="color:#284696">{{child.creator_cname}}</span>
					<span>回复</span>
					<span style="color:#284696">{{child.accept_cname}}</span>
					<span>：{{child.text}}</span>
					<!-- 谈话浮层 -->
					<talkMask 
						v-if="child.showTalkMask" 
						:allowUpload="false"
						:pid="this.data.id"
						:accept_id="child.creator_id"
						:close="()=>{
							child.showTalkMask=false ; this.$diff ;
						}"
						:success="()=>{
							this.success&&this.success();
						}">		
					</talkMask>
				</li>
			</ul>
		</div>

		<!-- 谈话浮层 -->
		<talkMask 
			v-if="this.showTalkMask" 
			:allowUpload="false"
			:pid="this.data.id"
			:accept_id="this.data.creator_id"
			:close="()=>{
				this.showTalkMask=false ; this.$diff ;
			}"
			:success="()=>{
				this.success&&this.success();
			}">		
		</talkMask>
	</div>
</template>
<script type="text/javascript">

	/*
		props=>{
			data
		}
	*/
	let img9_size = (window.innerWidth-154)/3 ;
	import talkMask from './talk-mask';
	import bg from 'components/common/bg';
	export default{
		components:{
			talkMask,
			bg
		},

		data(){
			return {
				img9_size,
				showTalkMask:false
			}
		},
		methods:{
			openwin(url,e){
				e.stopPropagation();
				window.open( url ,'_blank')
			},
			friendlyTime(str){
				return this.$tool.friendlyTime( str )
			},
			actionSheetReply(){
				this.showTalkMask = true ;
				this.showActionSheet=false;
				this.$diff ;
			},
			actionSheetDelete(){
				this.showActionSheet=false;
				this.$diff ;
				this.deleteReply( this.data.id )
			},
			actionSheetCancel(){
				this.showActionSheet=false;
				this.$diff ;
			},
			deleteReply(reply_id){
				mui.confirm('确定要删除评论吗','提示',['取消','确定'],(data)=>{
					if( data.index==1 ){
						App.imAjax({
							method:'reply_del',
							data:{
								reply_id: reply_id
							},
							success: res=>{
								this.success&&this.success();
							}
						})
					}
				})
			},
			replyChild( child ){
				if( this.$root.userInfo.uid==child.creator_id ){
					this.deleteReply( child.id )
				}else{
					child.showTalkMask = true ;
					this.$diff ;
				}
			}
		}	
	}
</script>
<style lang="less">
	.discover-item{
		padding-top: 12px;
		padding-bottom: 8px;
		position: relative;
		padding-left: 69px;
		border-bottom: 1px solid #ededed;
		.col1{
			position: absolute;
			left: 0;top: 12px;bottom: 10px;
			width: 69px;
			padding-left: 12px;
			.ava{

			}
		}
		.col2{
			position: relative;
			padding-right: 10px;
			._name{
				color: #284696;
				font-size: 16px;
			}
			._text{
				color: #555;
				line-height: 21px;
				margin-top: 2px;
				font-size: 16px;
			}
			._img{
				padding-top: 8px;
				padding-bottom: 5px;
				font-size: 0;line-height: 0;
				.imgwrap,img{
					position: relative;
					border-radius: 1px;
					overflow: hidden;
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
					.imgwrap{
						float: left;
						width: 33%;height: 33%;
						margin-right: 8px;
						margin-top: 8px;
					}	
				}
				.len5_9{
					width: 100%;
					overflow: hidden;
					.imgwrap{
						float: left;
						width: 33%;height: 33%;
						margin-right: 8px;
						margin-top: 8px;
					}
				}
			}
			._video{
				padding-top: 8px;
			}
		}
		.col3{
			margin-top: 3px;
			overflow: hidden;
			height: 25px;
			line-height: 25px;
			.l{
				font-size: 14px;
				display: inline-block;
				&>span{
					display: inline-block;
				}
				.sp1{
					color: #999;
				}
				.sp2{
					color: #284696;
					margin-left: 10px;
				}
			}
			.r{
				float: right;
				margin-right: 15px;
			}
		}
		.col4{
			padding-right: 16px;
			padding-top: 15px;
			padding-bottom: 7px;
			ul{
				background: #f1f1f1;
				position: relative;
				h1{
					width: 0;
					height: 0;
					font-size: 0;
					line-height: 0;
					padding:0;margin: 0;
				    border: 7px solid #f1f1f1;
				    position: absolute;
				    left: 12px;
				    top : -6px;
				    border-bottom-color: transparent;
				    border-right-color: transparent;
					transform: rotate(45deg);
				}
				li{
					color: #444;
					font-size: 15px;
					height: 30px;
					line-height: 30px;
					border-bottom: 1px solid #ededed;
					padding-left: 8px;
				}
			}
		}
	}
</style>
