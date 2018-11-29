<template>
	<div class="main-roomList">

		<div class="item-room">
			<div class="col1">
				<div class="ava-wrap">

					<img src="assets/images/cpb.png"/>

				</div>
			</div>
			<div class="col2">
				<div class="name">CPU 1024g</div>
				<div class="laststr">你撤回了一条消息</div>
				<div class="time">星期四</div>
			</div>
		</div><div class="item-room">
			<div class="col1">
				<div class="ava-wrap">

					<img src="assets/images/cpb.png"/>

				</div>
			</div>
			<div class="col2">
				<div class="name">CPU 1024g</div>
				<div class="laststr">你撤回了一条消息</div>
				<div class="time">星期四</div>
			</div>
		</div><div class="item-room">
			<div class="col1">
				<div class="ava-wrap">

					<img src="assets/images/cpb.png"/>

				</div>
			</div>
			<div class="col2">
				<div class="name">CPU 1024g</div>
				<div class="laststr">你撤回了一条消息</div>
				<div class="time">星期四</div>
			</div>
		</div><div class="item-room">
			<div class="col1">
				<div class="ava-wrap">

					<img src="assets/images/cpb.png"/>

				</div>
			</div>
			<div class="col2">
				<div class="name">CPU 1024g</div>
				<div class="laststr">你撤回了一条消息</div>
				<div class="time">星期四</div>
			</div>
		</div><div class="item-room">
			<div class="col1">
				<div class="ava-wrap">

					<img src="assets/images/cpb.png"/>

				</div>
			</div>
			<div class="col2">
				<div class="name">CPU 1024g</div>
				<div class="laststr">你撤回了一条消息</div>
				<div class="time">星期四</div>
			</div>
		</div>

	</div>
</template>
<script type="text/javascript">
	
	export default{
		components:{

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
	.main-roomList{
		position: absolute;
		left: 0;right: 0;
		top: 0;bottom: 0;
		overflow: auto;
		.item-room{
			position: relative;
			padding: 10px 12px;
			border-bottom: 0.5px solid #ddd;
			&::after{
				content:'';
				display: inline-block;
				position: absolute;
				bottom: -1px;
				left: 0;
				width: 12px;
				height: 2px;
				background: white;
			}
			&:nth-last-of-type(1)::after{
				display: none;
			}
			&>.col1{
				.ava-wrap{
					width: 55px;
					height: 55px;
					border-radius: 5px;
					overflow: hidden;
					position: relative;
					border:0.5px solid white;
					img{
						width: 100%;
						height: 100%;
					}
				}
			}
			&>.col2{
				position: absolute;
				top: 0;bottom: 0;right: 0;
				left: 78px;
				&>.name{
					color: #111;
					font-size: 18px;
					margin-right: 90px;
					margin-top: 15px;
				}
				&>.laststr{
					font-size: 14px;
					color: #999;
					margin-top: 4px;
				}
				&>.time{
					position: absolute;
					font-size: 14px;
					right: 13px;
					top: 12px;
					color: #999;
				}
			}
		}
	}
</style>