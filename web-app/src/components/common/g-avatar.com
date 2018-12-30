<template>
	<div 
		class="g-avatar img-wrap" 
		:class="{
			radius : this.radius 
		}"
		:style="{
			width: this.width ||'30px', 
			height: this.height ||'30px'
		}">
		<!-- 图片头像 -->
		<div 
			class="g-avatar-img-div" 
			v-if="!this.isError" 
			ref="imgdiv"
			:style="{
				background: 'url('+this.avatar+') no-repeat' ,
				backgroundSize: 'cover'
			}"></div>
		<img v-if="!this.isError" class="g-avatar-img" :src="this.avatar" @error="this.imgError.bind(this)"/>

		<!-- 文字头像 -->
		<div 
			class="g-avatar-name"
			v-if="this.isError" 
			:style="{
				background: this.getBgColor()
			}">
			<div 
				class="tran"
				:style="{
					fontSize: this.fontSize||'13px'
				}">
				{{ this.getName() }}
			</div>		
		</div>
	</div>
</template>
<script type="text/javascript">
	
	const COLOR_LIST = ['#00B8D9', '#1594ff', '#ffa92f', '#b587fa', '#06cf86', '#fa6771', '#73d51c', '#8991ff'];

	/*
		props -->
			radius ,
			width
			height ,
			fontSize ,
			avatar ,
			name
			nameLength
	*/

	export default{
		components:{

		},

		data(){
			return {
				isError:false 
			}
		},

		beforeMount(){
			// 如果没传图片 或者 传递的图片为默认图片 , 直接显示文字头像 ;
			if( this.isDefaultImg() ){
				this.isError=true
			}
		},
		mounted(){
			this.__avatar = this.avatar ;
		},
		beforeUpdate(){
			// 解决替换图片问题 ;;
			if( this.__avatar != this.avatar ){
				this.isError = false ;
			}
		},
		updated(){
			// 解决替换图片问题 ;;
			if( this.__avatar != this.avatar ){
				this.__avatar  = this.avatar ;
				try{
					this.$refs.imgdiv.style.backgroundSize='cover';
				}catch(e){}
			}
		},

		methods:{
			imgError(){
				this.isError=true;
				this.$diff ;
			},
			isDefaultImg(){
				let avatar=this.avatar||'';
				if( !avatar || avatar.indexOf('default_avatar')>-1 ){
					return true ;
				}else{
					return false;
				}
			},
			getName(){
				let str = this.name || '' ;
				let nl = this.nameLength || 2 ;
				return /[\u4e00-\u9fa5]/.test(str) ? str.substr(-nl) : str.substr(0, nl);
			},
			getBgColor(){
				let str = this.name || '' ;
				let c = this.$tool.md5(str).charAt(0).toLowerCase();
				let bg = COLOR_LIST['abcdefghijklmnopqrstuvwxyz0123456789'.indexOf(c) % COLOR_LIST.length];
				return bg;
			},
		}
	}


</script>
<style>
	.g-avatar{
		position: relative;
		.g-avatar-img-div{
			position: absolute;
			left: 0;top: 0;
			right: 0;bottom: 0;
			overflow: hidden;
		}
		.g-avatar-img{
			position: absolute;
			left: 0;top: 0;
			right: 0;bottom: 0;
			overflow: hidden;
			display: none;	
		}
		.g-avatar-name{
			position: absolute;
			left: 0;top: 0;
			right: 0;bottom: 0;
			overflow: hidden;
			.tran{
				line-height: 1;
				text-align: center;
				color: white;
				width: 100%;
				position: absolute;
				top: 50%;
				transform: translateY(-60%);
			}
		}
	}
	.g-avatar.radius{
		.g-avatar-img-div{
			border-radius: 50%;
		}
		.g-avatar-name{
			border-radius: 50%;
		}
	}
</style>