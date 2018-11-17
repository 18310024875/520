<template>
	<div class="gm-team-item">
		<gAvatar 
			class="gm-avatar" 
			:size="'30px'"
			:fontSize="'13px'"
			:avatar="this.item.avatar" 
			:name="this.item.room_name">		
		</gAvatar>

		<p class="p1 elli">
			<span class="s1">团队 : {{ this.item.room_name }}</span>
		</p>
		<p class="p2 elli">{{ this.getJoinNames( this.item.users||[] ) }}</p>
	</div>
</template>
<script type="text/javascript">

	/*
		props -->
			item
	*/

	export default{
		components:{

		},

		data(){
			return {

			}
		},
		methods:{
			getJoinNames( users ){
				return users.map(v=>v.cname).join(', ') ;
			}
		}
	}
</script>
<style lang="less">
	.gm-team-item{
		height:47px;
		width:100%;
		position:relative;
		cursor: pointer;
		padding-left: 61px;
		padding-right: 6px;
		padding-top: 8px;
		&:hover{
			background:rgba(242, 243, 244, 0.5);
		}
		.checkbox{
			width: 14px;
			height: 14px;
			text-align: center;
			line-height: 10px;
			border: 1px solid #dddee1;
			border-radius: 2px;
			position: absolute;
			right: 20px;
			top: 16px;
			transition: all 0.2s;
			background: white;
			.icon-checkmark{
				font-size: 12px;
				color: white;
			}
		}
		&>.p1{
			font-size: 13px;
			line-height: 16px;
		}
		&>.p2{
			font-size: 12px;
			line-height: 16px;
			color: #999;
		}
		.checkbox.checked{
			background: #5ca1ff;
			display: inline;
			border-color: #5ca1ff;
		}

		.gm-avatar{
			position: absolute;
			left: 20px;top: 8px;
		}
	}
</style>