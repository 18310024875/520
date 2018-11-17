<template>
	<div 
		class="imc-right-talk-list-item" 
	   :class="{self: this.isSelfTalk() }">
			<div class="time">{{ this.time() }}</div>
			<div class="time-no"></div>
			<div class="item-wrapper">
				<div class="part1">
					<div class="ava-wrap">
						<gAvatar 
							class="gm-avatar" 
							:size="'30px'"
							:fontSize="'13px'"
							:avatar="this.data.creator.avatar" 
							:name="this.data.creator.cname">		
						</gAvatar>
					</div>
				</div>
				<div class="part2" v-if="!this.data.files">
					<div class="t-name">
						{{ this.data.creator.cname }}
					</div>
					<div class="t-str" v-if="this.data.talk_content">
						{{ this.data.talk_content }}
					</div>
				</div>
				<div class="part2" v-if="this.data.files">
					<div class="t-name">
						{{ this.data.creator.cname }}
					</div>
					<!-- 文件 -->
					<div 
						v-for="(file,k) in this.data.files"
						class="each-file-wrap"
						:style="{
							marginBottom: k==this.data.files.length-1?'0':'8px' 
						}">

						<!-- 图片 -->
						<div 
							v-if="file.isImg" 
							class="t-img"
							:style="{
								background: 'url('+file.httpUrl+') no-repeat',
								backgroundSize: 'cover'
							}">		
						</div>

						<!-- 文件 -->
						<div 
							v-if="file.isFile" 
							class="t-file">
							<div class="tfl">
								<img src="assets/images/icon_unknow.png"/>
							</div>
							<div class="tnr">
								<div class="tnrn">{{file.fileName}}</div>
								<div class="tnrs">{{file.fileSize}}</div>
							</div>
						</div>

					</div>
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
				let selfUid = IM.userInfo.uid ;
				return this.data.creator_id==selfUid ;
			},
			time(){
				return this.$tool.friendlyTime( Number(this.data.ctime) )
			}
		}
	}
</script>
<style lang="less">

	.imc-right-talk-list-item{
		position: relative;
		&>.time{
			position: relative;
			font-size: 12px;
			text-align: center;
			padding: 23px 0 12px 0;
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
					width: 30px;
					height: 30px;
					overflow: hidden;
				}
			}
			.part2{
				.each-file-wrap{
					font-size: 0;
				}
				.t-name{
					color: #9e9e9e;
					font-size: 12px;
					line-height: 21px;
					padding-top: 2px;
					margin-bottom: 3px;
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
					background: url('assets/images/cpb.png') no-repeat;
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
	.imc-right-talk-list-item.self{
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