<template>
	<div class="item-of-talk" :class="{self: this.isSelfTalk() }">
			<div class="time"> {{this.time()}} </div>
			<!-- <div class="time-no"></div> -->
			<div class="item-wrapper">
				<div class="part1">
					<div class="ava-wrap">
						<g_avatar 
							class="gm-avatar" 
							:radius="true"
							:width="'32px'"
							:height="'32px'"
							:fontSize="'14px'"
							:avatar="this.data.creator_avatar" 
							:name="this.data.creator_cname">		
						</g_avatar>
					</div>
				</div>
				<!-- 文本 -->
				<div class="part2" v-if="!this.data.files">
					<div class="t-name">
						{{this.data.creator_cname}}
					</div>
					<div class="t-str">
						{{this.data.talk_content}}
					</div>
				</div>
				<!-- 文件  -->
				<div class="part2" v-if="this.data.files">
					
				</div>

			</div>
	</div>
</template>
<script type="text/javascript">
	/*
		props{
			data
		}
	*/
	export default{
		components:{

		},

		data(){
			return {

			}
		},


		methods:{
			isSelfTalk(){
				let uid = this.$root.userInfo.uid||-1 ;
				return uid==this.data.creator_id ;
			},
			time(){
				return this.$tool.friendlyTime( +this.data.ctime )
			}
		}
	}




				// <div class="part2" v-if="this.data.files">
				// 	<div class="t-name">
				// 		{{ this.data.creator.cname }}
				// 	</div>
				// 	<!-- 文件 -->
				// 	<div 
				// 		v-for="(file,k) in this.data.files"
				// 		class="each-file-wrap"
				// 		:style="{
				// 			marginBottom: k==this.data.files.length-1?'0':'8px' 
				// 		}">

				// 		<!-- 图片 -->
				// 		<div 
				// 			v-if="file.isImg" 
				// 			class="t-img"
				// 			:style="{
				// 				background: 'url('+file.httpUrl+') no-repeat',
				// 				backgroundSize: 'cover'
				// 			}">		
				// 		</div>

				// 		<!-- 文件 -->
				// 		<div 
				// 			v-if="file.isFile" 
				// 			class="t-file">
				// 			<div class="tfl">
				// 				<img src="assets/images/icon_unknow.png"/>
				// 			</div>
				// 			<div class="tnr">
				// 				<div class="tnrn">{{file.fileName}}</div>
				// 				<div class="tnrs">{{file.fileSize}}</div>
				// 			</div>
				// 		</div>

				// 	</div>
				// </div>

</script>
<style lang="less">

	.item-of-talk{
		position: relative;
		&>.time{
			position: relative;
			font-size: 12px;
			text-align: center;
			padding: 23px 0 10px 0;
			color: #ccc;
		}
		&>.time-no{
			height: 20px;
		}
		&>.item-wrapper{
			padding-left: 39px;
			position: relative;
			.part1{
				position: absolute;
				left: 0;top: 0;
				width: 39px;
				bottom: 0;
				.ava-wrap{
					position: absolute;
					left: 0;top: 0;
					width: 33px;
					height: 33px;
					overflow: hidden;
				}
			}
			.part2{
				position: relative;
				.each-file-wrap{
					font-size: 0;
				}
				.t-name{
					color: #9e9e9e;
					font-size: 12px;
					line-height: 21px;
					margin-bottom: 3px;
					position: relative;
					top: -1px;
				}
				.t-str{
					display: inline-block;
					border:1px solid #ededed;
				    padding: 5px 10px;
				    text-align: left;
				    border-radius: 4px;
				    background-color: #fff;
				    line-height: 25px;
				    font-size: 14px;
				    max-width: 400px;
				    word-spacing: normal;
				    white-space: normal;
				    word-break: break-all;
				    word-wrap: break-word;
				    color: #333;
				}
				.t-img{
					display: inline-block;
					border:1px solid #ededed;
					position: relative;
					font-size: 0;
					width: 150px;
					height: 140px;
					overflow: hidden;
					border-radius: 4px;
					border: 1px solid #ededed;
					padding: 4px;
					box-sizing: border-box;
					background-color: #fff;
					background: url('~assets/images/cpb.png') no-repeat;
					background-size: cover;
				}
				.t-file{
					display: inline-block;
					border: 1px solid #ededed;
					padding: 10px;
					border-radius: 4px;
					width: 228px;
					height: 67px;
					background: #fff;
					padding-left: 65px;
					position: relative;
					.tfl{
						position: absolute;
						width: 45px;
						height: 45px;
						left: 10px;
						top: 10px;
						img{
							width: 100%;
							height: 100%;
						}
					}
					.tnr{
						.tnrn{
							color: #262626;
							font-size: 14px;
						}
						.tnrs{
							color: #9e9e9e;
							font-size: 12px;
							margin-top: 3px;
						}
					}
				}
			}
		}
	}
	.item-of-talk.self{
		&>.item-wrapper{
			padding-left: unset;
			padding-right: 39px;
			.part1{
				left: unset;
				right: 0;
				.ava-wrap{
					left: unset;
					right: 0;
				}
			}
			.part2{
				text-align: right;
				.t-name{
					text-align: right;
				}
				.t-str{
					text-align: right;
					background: rgb(135,215,80);
					border-color: rgb(135,215,80);
					color: black;
				}
				.t-img{
					text-align: right;
				}
				.t-file{
					text-align: right;
					.tfl{
						text-align: left;
					}
					.tnr{
						text-align: left;
					}
				}

			}
		}
	}

</style>