<template>
	<div class="gm-team-content">
		<div class="gm-team-content-search">
			<input type="text" placeholder="请输入人员姓名进行搜索" @keydown="this.keydown"/>
		</div>
		<div class="gm-team-content-scroll" ref="scroll">

			<teamItem 
				class="teamItem"
				v-for="(item,k) in this.list"
				:item="item"
				@click="this.chooseTeam(item)">
			</teamItem>

			<div class="gm-load-status" v-if="this.loadStatus!='over'">
				<div v-show="this.loadStatus=='loading'" class="loading rot_animate icon-spinner2"></div>
				<div v-show="this.loadStatus=='success'" class="success" @click="this.loadMore">加载更多</div>
				<div v-show="this.loadStatus=='nodata'"  class="nodata">已加全部</div>
				<div v-show="this.loadStatus=='error'"   class="error"   @click="this.getList">加载失败 <span> 重新加载</span></div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	
	import teamItem from './team-item';

	export default{
		components:{
			teamItem
		},

		data(){
			return {
				list:[],
				kw:'',
				pageNo:1,
				loadStatus:'error'
			}
		},

		mounted(){
			this.getList()
		},

		methods:{
			keydown(e){
				if(e.keyCode==13){
					let kw = e.target.value ;
					this.kw=kw ;
					this.pageNo=1 ;
					this.list=[] ;
					// 加入根节点
					window.imSelectMan.tabManMans=this.list ;

					this.getList() ;
				}
			},
			getList(){
				this.loadStatus='loading';
				this.$diff ;

				this.$ajax2({
					url:'/ws/getJoinTeams',
					data:{
						keyWord: this.kw ,
						pageNumber: this.pageNo ,
						pageSize: 10
					},
					success(res){
					   let data = res.data || [];

					   this.list = data ;

						// 加载状态
						if( data.length==0 ){
							this.pageNo==1 ? this.loadStatus='nodata' : this.loadStatus='over' ;
						}else if( data.length<10){
							this.loadStatus='over' ;
						}else{
							this.loadStatus='success'
						}

						this.$diff ;
					},
					error(){
						this.loadStatus='error';
						this.$diff ;
					}
				})
			},
			chooseTeam(item){
				window.imSelectMan.callback2 && window.imSelectMan.callback2( JSON.parse(JSON.stringify(item)) ) ;
				window.imSelectMan.close();
			},
			loadMore(){
				this.pageNo++ ;
				this.getList() ;
			}
		}
	}

</script>
<style lang="less">
	.gm-load-status{
		width: 100%;
		height: 40px;
		overflow:hidden;
		&:hover{
			background:rgba(242, 243, 244, 0.2);
		}
		&>div{
			text-align: center;
			height: 40px;
			line-height: 40px;
		}
		&>.loading{
			color: #5ca1ff ;
			font-size: 16px;
		}
		&>.success{
			cursor: pointer;
			font-size: 12px;
			color: #666;
		}
		&>.nodata{
			font-size: 12px;
			color: #666;
		}
		&>.error{
			color: #666;
			font-size: 12px;
			cursor: pointer;
			&>span{
				color: #5ca1ff
			}
		}
	}

	.gm-team-content{
		width: 100%;height: 100%;
		position: relative;
		padding-top: 44px;
		.gm-team-content-search{
			position: absolute;
			width: 100%;
			top: 0;left: 0;
			height: 44px;
		/*	background: red;*/
			&>input{
				width: 320px;height: 32px;
				border: 1px solid #dddee1;
				border-radius: 4px;
				line-height: 32px;
				font-size: 12px;
				text-indent: 7px;
				position: absolute;
				left: 20px;
				bottom: 0px;
				&::-webkit-input-placeholder{
					color:#888;
				}
			}
		}
		.gm-team-content-scroll{
			width: 100%;height: 100%;
			position: relative;
			overflow-x: hidden;
			overflow-y: auto;	
			.teamItem:nth-child(1){
				margin-top: 6px;
			}	
		}
	}
</style>