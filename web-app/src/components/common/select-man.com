<template>
	<div class="select-man" v-show="this.showDom" @click="this.close.bind(this)">
		
		<div class="select-man-content" @click="this.stop.bind(this)">
			<div class="part1">
				<searchInput :value="this.kw" :onEnter="this.onEnter.bind(this)"></searchInput>
			</div>
			<ul class="part2" v-if="this.obj">
				<li class="work-item" v-for="(item,key) in this.obj" v-if="item.length">
					<p> {{key}} </p>
					<div class="man-item p-row" v-for="(user,k) in item" @click="this.toggle.bind(this,user)">
						<div class="col1">
							<div class="ava-wrap" 
								 @click="(e)=>{
								 	e.stopPropagation();
								 	this.close();
								 	location.hash=`#/userDetail?uid=${user.uid}`
								 }">
								<!-- <img src="assets/images/cpb.png"/> -->
								<g_avatar 
									:radius="false"
									:width="'44px'"
									:height="'44px'"
									:fontSize="'20px'"
									:avatar="user.avatar" 
									:name="user.cname ">		
								</g_avatar>
							</div>
						</div>
						<div class="col2">
							<span class="name">{{user.cname}}</span>

							<div class="checkbox" :class="{checked: user.checked}">
								<span class="mui-icon mui-icon-checkmarkempty"></span>
							</div>
						</div>
					</div>
				</li>
			</ul>
			<div class="part3">
				<div class="btn no" @click="this.close.bind(this)">取消</div>
				<div class="btn yes" @click="this.submit.bind(this)">确定</div>
			</div>
		</div>
		<div class="close">
			<span class="mui-icon mui-icon-close"></span>
		</div>

	</div>
</template>
<script type="text/javascript">

	import searchInput from 'components/common/search-input';
	export default{
		components:{
			searchInput
		},

		data(){
			return {
				kw:'',
				obj:'',
				showDom:false,
				join_ids:'',

				callback:'',
			}
		},

		methods:{
			open(join_ids , callback ){
				this.showDom = true ;
				this.join_ids = join_ids||'';
				this.callback = callback||function(){};
				this.$diff ;

				this.getList();
			},
			stop(e){
				e.stopPropagation();
			},
			close(){
				this.showDom = false ;
				this.kw = '';
				this.obj = '';
				this.join_ids = '';
				this.callback = '';
				this.$diff ;
			},
			onEnter( kw ){
				this.kw=kw ; this.$diff ;
				this.getList();
			},
			getList(){
				App.imAjax({
					method:'people_getAll',
					data:{
						kw: this.kw
					},
					success: obj=>{
						let jids = this.join_ids.split(',').filter(v=>v);
						for(let k in obj){
							let users = obj[k]||[];
							for(let i =0 ; i<users.length ; i++ ){
								let user = users[i];
								if( this.$root.userInfo.uid==user.uid ){
									users.splice(i,1);
									i--
									break;
								};
								jids.map(uid=>{
									uid==user.uid ? user.checked=true : null ;
								});
							}
						};
						this.obj = obj ;
						this.$diff ;
					}
				})
			},
			toggle(user){
				user.checked = !user.checked ;
				this.$diff ;
			},
			submit(){
				let choose = [] ;
				let obj = this.obj ;
				for(let k in obj){
					obj[k].map(user=>{
						!!user.checked==true ? choose.push(user) : null ;
					})
				};

				this.callback( JSON.parse(JSON.stringify( choose )) );
				this.close();
			}
		}
	}
</script>
<style lang="less">
	.select-man{
		position: fixed;
		left: 0;right: 0;
		top: 0;bottom: 0;
		z-index: 100;
		background: rgba(0,0,0,0.5);
		&>.close{
			display: none;
			color: white;
			position: absolute;
			left: 0;right: 0;
			bottom:36px;
			text-align: center;
			line-height: 0;
			font-size: 0;
			span{
				font-size: 30px;
			}
		}
		.select-man-content{
			position: absolute;
			left: 30px;right: 30px;
			top: 0px;bottom: 55px;
			overflow: hidden;
			background: white;
			.part1{
				border-bottom: 1px solid #ddd;
				border-bottom: 0.5px solid #ddd;
			}
			.part3{
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
			.part2{
				position: absolute;
				left: 0;top: 60px;
				right: 0;bottom: 40px;
				overflow: auto;
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
						.checkbox{
							width: 22px;
							height: 22px;
							line-height: 22px;
							text-align: center;
							border: 0.5px solid #ededed;
							position: absolute;
							top: 22px;
							right: 20px;
							border-radius: 50%;
							span{
								display: none;
							}
						}
						.checkbox.checked{
							background: rgb(21, 148, 255);
							border-color: rgb(21, 148, 255);
							span{
								display: inline-block;
								width: 22px;
								height: 22px;
								color: white;
								position: relative;
								left: -4px;
								top: -4px;
								font-size: 30px;
								font-weight: bold;
							}
						}
					}
				}
			}
		}
	}
</style>