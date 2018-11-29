<template>
	<div class="activeRoom">
		<header class="mui-bar mui-bar-nav">
			<a class="white mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
			<h1 class="white mui-title"> 房间 11 </h1>
			<div class="white fr mui-icon">
				<span class="sp1"></span><span class="sp2"></span><span class="sp3"></span>
			</div>
		</header>
		<div class="content">
			<div class="content-list">
				<ul class="sm">
					
					<itemOfTalk :data="{}"></itemOfTalk>
					<itemOfTalk :data="{}" :s="1"></itemOfTalk>
					<itemOfTalk :data="{}"></itemOfTalk>

				</ul>
			</div>
			<div class="content-talk">
				<talkBar style="height:100%;"></talkBar>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	
	import talkBar from 'components/common/talk-bar.com';
	import itemOfTalk from  './item-of-talk.com';

	export default{
		components:{
			talkBar,
			itemOfTalk
		},

		data(){
			return {

			}
		},
		methods:{

		}
	}
</script>
<style lang="less">
	.activeRoom{
		position: absolute;
		left: 0;right: 0;
		top: 0;bottom: 0;
		&>header{
			background: #222;
			color: white;
			position: relative;
			&>.white{
				color: white
			}
			.fr{
				position: absolute;
				right: 12px;
				.sp1,.sp2,.sp3{
					vertical-align: middle;
					display: inline-block;
					margin-left: 3px;
					margin-top: 3px;
					width: 3px;height: 3px;background: white;border-radius: 50%;
				}
			}
		}
		&>.content{
			position: absolute;
			left: 0;right: 0;
			top: 44px;bottom: 0;
			.content-list{
				position: absolute;
				left: 0;right: 0;
				top: 0;bottom: 50px;
				overflow: auto;
				&>.sm{
					padding: 0 12px;
				}
			}
			.content-talk{
				position: absolute;
				bottom: 0;left: 0;right: 0;
				height: 50px;
				padding-top: 3.5px;
				border-top: 0.5px solid #ddd;
			}
		}
	}
</style>