<template>
	<div class="main-manList">
		<!-- 输入框 -->
		<div class="part1">
			<searchInput :value="this.kw" :onEnter="this.onEnter.bind(this)"></searchInput>
		</div>


		<!-- 人员相关信息 -->
		<div class="part2" v-if="this.type=='people'">
			<div class="p-row" @click="this.checkNav('group')">
				<div class="col1 part2-2">
					<div class="ava-wrap">
						<span class="mui-icon mui-icon-person ic1"></span>
						<span class="mui-icon mui-icon-person ic2"></span>
					</div>
				</div>
				<div class="col2">
					<span class="name">我的群聊</span>
				</div>
			</div>
		</div>
		<!-- 群相关信息 -->
		<div class="part2" v-if="this.type=='group'">
			<div class="p-row part2-1">
				<div class="col1">
					<div class="ava-wrap">
						<span class="mui-icon mui-icon-personadd ic"></span>
					</div>
				</div>
				<div class="col2">
					<span class="name">创建群</span>
				</div>
			</div>
			<div class="p-row"  @click="this.checkNav('people')">
				<div class="col1 part2-2">
					<div class="ava-wrap">
						<span class="mui-icon mui-icon-person ic1"></span>
						<span class="mui-icon mui-icon-person ic2"></span>
					</div>
				</div>
				<div class="col2">
					<span class="name">所有人员</span>
				</div>
			</div>
		</div>

		<!-- 人员列表 -->
		<div class="part3" v-if="this.type=='people'">

			<listPeople :list="this.$root.allPeople"></listPeople>		
		</div>
		<!-- 群组列表 -->
		<div class="part3" v-if="this.type=='group'">

			<listGroup  :list="this.$root.groupJoined"></listGroup>	
		</div>
		
	</div>
</template>
<script type="text/javascript">
	
	import searchInput from 'components/common/search-input';
	import listPeople from './list-people';
	import listGroup from './list-group';

	export default{
		components:{
			searchInput,
			listPeople,
			listGroup
		},

		data(){
			return {
				type: 'people' , //people , group
				kw:'11',
				listPeople:[],
				listGroup:[]
			}
		},

		mounted(){
			this.getList();
		},

		methods:{
			onEnter( kw ){
				this.kw=kw ; this.$diff ;
			},
			checkNav( type ){
				this.kw='' ; this.type=type ; this.$diff ;
				this.getList();
			},

			getList(){
				if( this.type=='people' ){
					this.$root.getAllPeople();
				}else{
					this.$root.getGroupJoined();
				}
			},

		}
	}
</script>
<style lang="less">
	.main-manList{
		position: absolute;
		left: 0;right: 0;
		top: 0;bottom: 0;
		overflow: auto;
		.part1{

		}
		.part2{
			.p-row:nth-last-of-type(1){
				border-bottom: none;
				&::after{
					display:none;
				}
			}
			.part2-1{
				.ava-wrap{
					text-align: center;
					line-height: 45px;
					background: #19be6b;
				}
				.ic{
					color: white;
					font-size: 35px;
					position: relative;
					top: 3px;
				}
			}	
			.part2-2{
				.ava-wrap{
					text-align: center;
					line-height: 45px;
					background: #ff9900;
				}
				.ic1{
					color: white;
					font-size: 35px;
					position: absolute;
					top: 5px;
					left: 1px;
				}
				.ic2{
					color: white;
					font-size: 33px;
					position: absolute;
					top: 6px;
					left: 12px;
				}
			}
		}
		.part3{
			.work-item{
				&>p{
					margin: 0;padding: 0;
				    height: 24px;
				    line-height: 24px;
				    font-size: 15px;
				    color: #888;
				    background: #f1f1f1;
				    padding-left: 15px;
				}
				.p-row:nth-last-of-type(1){
					border-bottom: none;
					&::after{
						display:none;
					}
				}
			}
		}
		.p-row{
			position: relative;
			padding: 10px 14px;
			border-bottom: 0.5px solid #ddd;
			&::after{
				content:'';
				display: inline-block;
				position: absolute;
				bottom:-1px;
				left: 0;
				width: 13px;
				height: 2px;
				background: white;
			}
			&>.col1{
				.ava-wrap{
					width: 44px;
					height: 44px;
					border-radius: 1px;
					overflow: hidden;
					position: relative;
					img{
						width: 100%;
						height: 100%;
					}
				}
			}
			&>.col2{
				position: absolute;
				top: 0;bottom: 0;right: 0;
				left: 70px;
				padding-top: 20px;
				.name{
					color: #222;
					font-size: 17px;
				}
			}
		}
	}
</style>