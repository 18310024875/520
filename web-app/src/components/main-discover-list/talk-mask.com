<template>
	<div class="discover-talk-mask">

		<div class="content">
			<div class="scroll">
				<div class="textarea-wrap">
					<textarea 
						class="textarea textcss" 
						placeholder="请发表文字"
						:value="this.text"
						@input="this.textAreaSetValue.bind(this)"
						ref="textarea">
					</textarea>
					<div 
						class="div-textarea textcss"
						ref="divTextarea">
						{{this.text}}.
					</div>
				</div>

				<ul v-if="this.allowUpload || 1" class="ul">
					<li class="li" 
						v-for="(file,index) in this.fileList">
						<bg :url="file.base64"/>
						<div class="del" @click="this.delFile.bind(this)">
							<h1><span class="sp">-</span></h1>
						</div>
					</li>
					<li class="li">
						<label>
							<div class="addbtn">
								<span class="mui-icon mui-icon-plusempty"></span>
							</div>
							<form ref="form">
								<input 
									style="display:none;" 
									type="file" 
									multiple="multiple"
									accept="image/*" 
									@change="this.addFile.bind(this)">
								</input>
							</form>
						</label>
					</li>
				</ul>
			</div>
			<div class="under">
				<div class="btn no lazy" @click="this.no.bind(this)">取消</div>
				<div class="btn yes lazy" @click="this.yes.bind(this)">确定</div>
			</div>		
		</div>




	</div>
</template>
<script type="text/javascript">

	import talkBar from 'components/common/talk-bar.com';
	import bg from './bg';
	import uploadFun from 'components/common/upload-fun';
	/*
		allowUpload
	*/
	export default{
		components:{
			talkBar,
			bg
		},

		data(){
			return {
				text:'',
				fileList:[],
			}
		},


		methods:{
			// 监听textarea的输入 ;
			textAreaSetValue(){
				let textarea = this.$refs.textarea ;
				let divTextarea = this.$refs.divTextarea ;
				this.text = textarea.value ;
				this.$diff ; 

				setTimeout(()=>{
					console.log( divTextarea.offsetHeight )
					console.log( divTextarea.innerHTML )
					textarea.style.height = divTextarea.offsetHeight+'px';
				})
			},
			// input change事件
			addFile(e){
				let files = [...e.target.files] ;
				let arr = [] ;
				files.map(file=>{
					// 读取选中图片
					this.fileRender(file, base64=>{
						file.base64 = base64 ;
						this.fileList.push( file ) ;
						this.$diff ;
					})
				});
				setTimeout(()=>{
					try{
						this.$refs.form.reset();
					}catch(e){};
				},500)
			},
			// 读取input选取的图片 ;
			fileRender( file , callback){
				let read 
				read = new FileReader();
				read.onload = function(e){
					callback&&callback( e.target.result )
				}
				read.readAsDataURL( file )
			},
			delFile(i){
				this.fileList.splice(i,1);
				this.$diff ;
			},
			no(){
				this.close&&this.close();
			},
			yes(){
				if( this.text ){
					// 先上传文件
					uploadFun( this.fileList , res=>{
						// ajax
						App.imAjax({
							method:"reply_add",
							data:{
								pid:0,
								accept_id:'',
								fids: (res.data||[]).map(file=>file.fid).join(),
								text: this.text
							},
							success:res=>{

							}
						})
					},err=>{},()=>{
						this.close&&this.close();
					})
				}else{
					mui.alert('请输入文字')
				}
			},
		}
	}
</script>
<style lang="less">
	.discover-talk-mask{
		position: fixed;
		left: 0;top: 0;right: 0;bottom: 0;
		background: rgba(0,0,0,0.5);
		&>.content{
			position: absolute;
			left: 30px;right: 30px;
			top: 50px;bottom: 80px;
			overflow: hidden;
			background: white;
			&>.scroll{
				position: absolute;
				left: 0;right: 0;
				top: 0;
				bottom: 45px;
				overflow: auto;
				.textarea-wrap{
					padding-top: 3px;
					padding-bottom: 4px;
					position: relative;
					font-size: 0;line-height: 0;
					.textarea{
						height: 40px;
					}
					.div-textarea{
						position: absolute;
						left: 0;right: 0;top: 0;
						pointer-events: none;
						visibility: hidden;
					}
					.textcss{
						width: 100%;
						margin:0;
						padding: 0;
						font-size: 15px;
						line-height: 20px;
						color: #333;
						border: 0;
						outline: 0;
						box-sizing: border-box;
						background-color: #fff;
						-webkit-appearance: none;
						border-radius: 0;
						padding: 10px;
						letter-spacing: 0;
						white-space: pre-wrap;
						word-break: break-all;
						min-height: 40px;
					}
				}
				.ul{
					padding-right: 10px;
					.li{
						float: left;
						position: relative;
						width: 100px;
						height: 100px;
						font-size: 0;
						line-height: 0;
						margin-left: 10px;
						margin-bottom: 10px;
						.del{
							position: absolute;
							right: -10px;top: -10px;
							text-align: center;
							h1{
								display: inline-block;
								width: 15px;
								height: 15px;
								color: white;
								background: #ed4014;
								border-radius: 50%;
								padding: 0;margin:0;
								margin: 4px;
								line-height: 0;font-size: 0;
								.sp{
									line-height: 1;
									font-size: 12px;
								}
							}
						}
						.addbtn{
							width: 100px;
							height: 100px;
							text-align: center;
							padding-top: 25px;
							background: #f5f5f5;
							span{
								font-size: 50px;
								color: #888;
							}
						}
					}
				}
			}
			&>.under{
				position: absolute;
				bottom: 0;
				left: 0;right: 0;
				height: 45px;
				border-top: 1px solid #ddd;
				border-top: 0.5px solid #ddd;
				&>.btn{
					background: white;
					float: left;
					position: relative;
					line-height: 45px;
					text-align: center;
					width: 50%;
					font-size: 16px;
				}
				&>.btn.yes{
					color: rgb(21, 148, 255);
				}
				&>.btn.no{
					&::after{
						content:'';display: inline-block;
						position: absolute;
						width:1px;
						width: 0.5px;
						top: 12px;
						bottom: 12px;
						right: 0;
						background: #ddd;
					};
				}
			}
		}

	}
</style>