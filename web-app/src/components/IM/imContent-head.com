<template>
	<div class="imc-head">
		<div class="lp">
			<div>
				<img src="assets/images/search.png"/>
				<input :value="this.value" 
					   @keydown="this.keydown"/>
			</div>
			<h1 @click="this.addMan"></h1>
		</div>
		<div class="rp">
			<h2 @click="this.fullScreen"></h2>
			<h1 @click="this.closeIm"></h1>
		</div>
	</div>
</template>
<script type="text/javascript">
	
	export default{
		props:{},
		components:{

		},

		data(){
			return {
				value:''
			}
		},
		methods:{
			keydown(e){
				this.value = e.target.value ;
				if(e.keyCode==13){
					console.log('keydown')
				}	
			},
			addMan(){
				imSelectMan.open([],false, 
					// 选择成员
					mans=>{
						mans = mans.map(v=>({
							uid: v.memberId ,
							userName: v.userName
						}));

						if( mans.length==1 ){

							this.IM_connectMan( mans[0] );
						}else{

							this.IM_createNewGroup( mans );
						}
					},
					// 选团队
					teamRoom=>{
						console.log(3 , teamRoom )
						IM.MESSAGE_findAddRoom( teamRoom );
						IM.MESSAGE_changeActiveRoom( teamRoom );
					}
				);
			},
			closeIm(){
				console.log('closeIm')
			},
			fullScreen(){
				console.log('fullScreen')
			},

			// 和某人建立连接 返回房间号( 后台判断需不需要创建房间 ) ;
			IM_connectMan( man ){
				let selfUid = IM.userInfo.uid ;

				this.$ajax2({
					type:'post',
					url: '/ws/connectMan',
					data:{
						ids: selfUid+','+man.uid
					},
					success( res ){
						let room = res.data ;
						IM.MESSAGE_findAddRoom( room );
						IM.MESSAGE_changeActiveRoom( room );
					}
				})
			},
			// 创建新讨论组;
			IM_createNewGroup( list ){
				let groupName = prompt();
				let selfUid = IM.userInfo.uid ;
				let ids = selfUid + ',' + list.map( v=>v.uid ).join(',');

				if( groupName.trim() ){
					this.$ajax2({
						type:'post',
						url:'/ws/createNewGroup',
						data:{
							ids:ids ,
							groupName: groupName
						},
						success( res ){
							let room = res.data ;
							IM.MESSAGE_findAddRoom( room );
							IM.MESSAGE_changeActiveRoom( room );
						}
					})
				}else{
					this.$ui.say('请输入组群名称');
				}
			},
		}
	}
</script>
<style lang="less">
	.imc-head{
	    background-color: #ececee;
	    padding-left: 209px;
		.lp{
			width: 209px;
			padding-top: 12px;
			padding-left: 11px;
			position: absolute;
			left: 0;top: 0;
			height: 50px;
			&>div{
				width: 161px;
				height: 26px;
				border-radius: 13px;
				background: white;
				padding-left: 10px;
				img{
					width: 18px;
					display: inline-block;
					vertical-align: middle;
					margin-right: 3px;
					opacity: 0.7;
				}
				input{
					font: 13px;
					display: inline-block;
					vertical-align: middle;
					width: 120px;
					border: none;
					height: 26px;
					line-height: 26px;
					color: #999;
				}
			}
			h1{
				width: 20px;
				height: 20px;
				position: absolute;
				right: 8px;top: 16px;
				cursor: pointer;
				&::before{
					content:'';display: inline-block;
					width:1px;
					position: absolute;
					left: 10px;
					top: 5px;
					bottom: 4px;
					background: #999
				};
				&::after{
					content:'';display: inline-block;
					height: 1px;
					position: absolute;
					left: 5px;
					right: 4px;
					top: 10px;
					background: #999
				};
				&:hover{
					&::before{
						background:rgb(228, 97, 92);
					};
					&::after{
						background:rgb(228, 97, 92);
					};
				};
			}
		}
		.rp{
			height: 50px;
			h2{
				width: 20px;
				height: 20px;
				position: absolute;
				right: 35px;top: 16px;
				&::before{
					content:'';display: inline-block;
					position: absolute;
					left: 4px;right: 4px;
					top: 6px;bottom: 5px;
					border: 1px solid #999;
				};
				&:hover{
					&::before{
						border-color:rgb(228, 97, 92);
					};
				};
			}
			h1{
				width: 20px;
				height: 20px;
				position: absolute;
				right: 8px;top: 16px;
				transform: rotate(45deg);
				cursor: pointer;
				&::before{
					content:'';display: inline-block;
					width:1px;
					position: absolute;
					left: 10px;
					top: 5px;
					bottom: 4px;
					background: #999
				};
				&::after{
					content:'';display: inline-block;
					height: 1px;
					position: absolute;
					left: 5px;
					right: 4px;
					top: 10px;
					background: #999
				};
				&:hover{
					&::before{
						background:rgb(228, 97, 92);
					};
					&::after{
						background:rgb(228, 97, 92);
					};
				};
			}
		}
	}
</style>