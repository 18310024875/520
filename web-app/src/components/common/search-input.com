<template>

	<div class="search-input">
		<div class="init">
			<div class="input-wrap">
				<input 
					class="input" 
					:value="this.value||''" 
					@keydown="this.keydown" 
					@input="this.input"
					@change="this.change"
					@focus="this.focus" 
					@blur="this.blur"/>
				<div class="placeholder" v-show="this.showPlaceholder && !this.value">
					<span class="mui-icon mui-icon-search sp1"></span><span class="sp2">{{this.placeholder||'搜索'}}</span>
				</div>
			</div>
		</div>
	</div>

</template>
<script type="text/javascript">
	
	/*
		props==>{
			placeholder
			value
			enter
			input
			change
			focus
			blur
		}
	*/

	export default{
		data(){
			return {
				showPlaceholder:true ,
			}
		},
		methods:{
			keydown(e){
				if( e.keyCode==13 ){
					this.onEnter && this.onEnter(e.target.value)
				}
			},
			input(e){
				this.onInput && this.onInput(e.target.value)
			},
			change(e){
				this.onChange && this.onChange(e.target.value)
			},
			focus(e){
				this.showPlaceholder=false; this.$diff ;
				this.onFocus && this.onFocus(e.target.value) ;
			},
			blur(e){
				this.showPlaceholder=true; this.$diff ;
				this.onBlur && this.onBlur(e.target.value) ;
			},
		}
	}
</script>
<style lang="less">

	.search-input{
		position: relative;
		padding: 11px 13px;
		background: #f1f1f1;
		&>.init{
			position: relative;
			padding: 7px 8px ;
			padding-left: 10px;
			overflow: hidden;
			border-radius: 5px;
			background: white;
			border:0.5px solid #ededed;
			.input-wrap{
				position: relative;
				.input{
					width: 100%;
					background: white;
					height: 20px;
					line-height: 20px;
					font-size: 17px;
				}
				.placeholder{
					pointer-events: none;
					position: absolute;
					left: 50%;top: 0;
					transform: translateX(-50%);
					height: 20px;
					line-height: 19px;
					color: #888;
					span{
						vertical-align: middle;
					}
					.sp1{
						position: relative;
						top: -1px;
					}
					.sp2{
						padding-left: 2px;
						font-size: 17px;
					}
				}
			}
		}
	}
</style>