<template>
	<div>
		<div ref="dom" 
			class="acs-mask" 
			:style="{opacity: this.opacity }"
			@click=" this.cancel ">
			<div class="mui-popover mui-popover-action mui-popover-bottom mui-active" style="display: block;">
				<ul class="mui-table-view">
					<li class="mui-table-view-cell"
						@click="(e)=>{e.stopPropagation(); this.reply&&this.reply() }">
						<a >评论</a>
					</li>
					<li class="mui-table-view-cell"
						v-show=" this.$root.userInfo.uid==this.data.creator_id "
						@click="(e)=>{e.stopPropagation(); this.delete&&this.delete() }">
						<a style="color: #FF3B30;">删除</a>
					</li>
				</ul>
				<ul class="mui-table-view">
					<li class="mui-table-view-cell"
						@click="(e)=>{e.stopPropagation(); this.cancel&&this.cancel() }">
						<a><b>取消</b></a>
					</li>
				</ul>
			</div>
		</div>

	</div>
</template>
<script type="text/javascript">
	
	export default{
		data(){
			return {
				opacity:0
			}
		},

		mounted(){
			setTimeout(()=>{
				this.opacity = 1 ;
				this.$diff ;
			},100)
			document.body.appendChild( this.$refs.dom )
		},
		destroyed(){
			document.body.removeChild( this.$refs.dom )
		},

		methods:{

		}
	}
</script>
<style lang="less">
	.acs-mask{
		position: fixed;
		left: 0;right: 0;
		top: 0;bottom: 0;
		z-index: 99999;
		background: rgba(0,0,0,0.3);
		transition: all .4s ease;
	}
</style>