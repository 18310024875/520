<template>
	<div class="im-content">

		<section class="im-content-main">
			<div class="c-h">

				<head/>

			</div>
			<div class="c-c">

				<div class="c-c-l">

					<leftRooms 
						:ROOM_LIST="this.ROOM_LIST"
						:ACTIVE_ROOM_INFO="this.ACTIVE_ROOM_INFO"/>

				</div>

				<!-- 拖拽层 -->
				<div class="c-c-r"
					@dragenter="this.ondragenter" 
				 	@dragover="this.ondragover"
				 	@dragleave="this.ondragleave" 
				 	@drop="this.ondrop">

				 	<!-- 上传文件浮层 -->
				 	<div class="drop-mask" v-show="this.showDropMask"></div>

				 	<!-- 会话列表 -->
					<div class="c-c-l-t">
						
						<rightTalkList 
							:ROOM_LIST="this.ROOM_LIST"
							:ACTIVE_ROOM_INFO="this.ACTIVE_ROOM_INFO"/>

					</div>
					<!-- 输入框 -->
					<div class="c-c-l-b">
						
						<rightInputter
							:ACTIVE_ROOM_INFO="this.ACTIVE_ROOM_INFO"/>

					</div>

				</div>
			</div>
		</section>

	</div>
</template>
<script type="text/javascript">
	/*
		props:{
			ACTIVE_ROOM_INFO
		}
	*/
	import head from './imContent-head';
	import leftRooms from './imContent-left-rooms';
	import rightTalkList from './imContent-right-talk-list';
	import rightInputter from './imContent-right-inputter';

	import config from 'src/config';
	import upload from '../common/g-upload-FormData.js';
//e.dataTransfer.dropEffect ;
    // none ：不能把拖动的元素放在这里。这是除了文本框之外所有元素默认的值。
    // move ：应该把拖动的元素移动到放置目标。
    // copy ：应该把拖动的元素复制到放置目标。
    // link ：放置目标会打开拖动的元素(但拖动的元素必须是个链接，有URL地址)。


	export default{
		components:{
			head ,
			leftRooms ,
			rightTalkList ,
			rightInputter ,
		},

		data(){
			return {
				showDropMask:false
			}
		},
		methods:{
			// 拖拽进入
			ondragenter(e){
                e.stopPropagation();
                e.preventDefault();

                this.showDropMask=true ;
                this.$diff ;
			},
			// 拖拽中
			ondragover(e){
                e.stopPropagation();
                e.preventDefault();
				// e.dataTransfer.dropEffect = 'copy';

                this.showDropMask=true ;
                this.$diff ;
			},
			// 拖拽离开
			ondragleave(e){
                e.stopPropagation();
                e.preventDefault();

                this.showDropMask=false ;
                this.$diff ;
			},
			// 拖住过程中 释放鼠标 ;
			ondrop(e){
                e.stopPropagation();
                e.preventDefault();

                this.showDropMask=false ;
                this.$diff ;

                let fileList = e.dataTransfer.files||[] ;
				if( fileList.length ){
					let action = `${config['localHost']}/ws/upload?room_id=${this.ACTIVE_ROOM_INFO.roomId}`;
					upload( fileList , 'upload' , action , res=>{
						this.$ui.say( '发送成功' )
					},err=>{
						this.$ui.say( '发送失败' )
					});
				}	
			}
		}
	}
</script>
<style lang="less">
	.im-content{
		position: fixed;
		left: 0;right: 0;
		top: 0;bottom: 0;
		z-index: 1;
		background: rgba(0,0,0,0.6);
	}
	.im-content-main{
		background: white;
		width: 814px;
		height: 592px;
		position: absolute;
		left: 50%;top: 50%;
		transform: translate(-50%,-50%);
		border-radius: 4px;
		overflow: hidden;
		.c-h{
			height: 51px;
			border-bottom: 1px solid #e4e4e4;
			position: relative;
		}
		.c-c{
			height: calc(100% - 51px);
			position: relative;
			padding-left: 210px;
			.c-c-l{
				position: absolute;
				left: 0;
				top: 0;bottom: 0;
				width: 210px;
				border-right: 1px solid #e4e4e4;
			}
			.c-c-r{
				position: relative;
				height: 100%;
				.drop-mask{
					position: absolute;
					left: 0;top: 0;
					bottom: 0;right: 0;
					background-color: rgba(255,255,255,0.6);
					z-index: 10;
					pointer-events: none;
				}
				.c-c-l-t{
					position: relative;
					height: calc(100% - 150px);
				}
				.c-c-l-b{
					height: 150px;
					border-top:1px solid #e4e4e4;
					position: absolute;
					left: 0;right: 0;
					bottom: 0;
				}
			}
		}
	}
	
</style>