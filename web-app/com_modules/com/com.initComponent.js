
import $ from './com.tool.js';

export default function( Com ){

	// 用于v-show的class ;
	try{
		var style = document.createElement('style');
			style.innerHTML = '* .com_displayNone{ display:none!important }';
		document.head.appendChild( style );
	}catch(e){};


	// component ;
	var c = Com.component = function(  
			opt , 		// ---> 配置信息
			$props , 	// ---> props
			$parent ,   // ---> 父级节点
			$root   ,   // ---> 根节点
			$router ,   // ---> 跟路由实例 
		){

		var this_ = this ;


		// 配置 ;
		this.$opt = opt ;
		// props;
		this.$props = $props || {};
		// parent;
		this.$parent = $parent || null;
		// root
		this.$root = $root || this ;
		// router
		opt.router ? $router=new Com.router(opt.router, this) : null ; // ( 根路由挂载的router在options内 )
		this.$router = $router || null ;

			// 唯一id ;
			this.$id = $.onlyId();
			// 装refs树的盒子
			this.$refs = {} ;
			// data 绑定this ;
			this.$data = ($.type( opt.data )=='function'? opt.data.call(this) : JSON.parse(JSON.stringify( opt.data || {} ))) ;
			// 事件 绑定this ;
			this.$methods = opt.methods||{} ;
			// 组件 绑定this;
			this.$components = opt.components || {};
			// 全局组件添加到$components ;
			for(var name in Com.globalComponents ){
				this.$components[name] = Com.globalComponents[name];
			}
			// 生命周期 ;
			this.init = opt.init || function(){}; //(可修改组件内部属性) 
			
			this.beforeMount = opt.beforeMount||function(){}; //(可修改组件内部属性)
			this.mounted = opt.mounted || function(){};

			this.shouldUpdate = opt.shouldUpdate || function(){}; //---是否需要被动更新组件 ;
			
			this.beforeUpdate = opt.beforeUpdate || function(){}; 
			this.updated = opt.updated || function(){};
			
			this.destroyed = opt.destroyed || function(){};

			// render 函数绑定 this ;
			this.render = opt.render ;

		// 访问diff 直接调用$update() ;
		Object.defineProperty( this , '$diff' , {
			get:function(){
				this.$update();
			}
		})

		// $props 映射this ;
		for(var pName in this.$props){
			(function(each){
				Object.defineProperty( this_ , each , {
					get:function(){
						return this_.$props[each]
					},
					set:function(val){
						this_.$props[each]=val ;
					}
				})
			}(pName));
		}

		// $data 映射this ;
		for(var dName in this.$data){
			(function(each){
				Object.defineProperty( this_ , each , {
					get:function(){
						return this_.$data[each]
					},
					set:function(val){
						this_.$data[each]=val ;
					}
				})
			}(dName));
		}

	 	// 事件 映射this .
 		for(var mName in this.$methods){
 			(function(each){
 				Object.defineProperty( this_ , each , {
 					get:function(){
 						return this_.$methods[each]
 					}
 				})
 			}(mName))
 		};

 		// init生命周期 ;
		this.init();
	};

	// render解析成树 --- 解析vfor循环 ;
	c.prototype.vforLoop=function( list , CALLBACK ){
		// 返回值 ;
		var $_children = [];

		var listType = $.type(list) ;
		if( listType=='array' ){
		  // 数组
			for(var i=0,len=list.length ; i<len ; i++){
				if(!list[i]){ continue };
				// 回调
				var $_child = CALLBACK( list[i] , i );
				$_children.push($_child);
			};
		}else if( listType=='object' ){
		  // 对象 
			for(var key in list){
				if(!key){ continue };
				// 回调
				var $_child = CALLBACK( list[key] , key );
				$_children.push($_child);
			};
		}else{
			// alert('不支持的便利格式-->'+listType);
		};

		return $_children ;
	};

	// ********************************* 读出树结构 , 映射真实DOM节点 ********************************* ;;;
	c.prototype.readTree=function( $T , $parentTree , diffOrigin ){
		// 循环引用 ; 处理特殊节点 ;
		$T['parentTree']=$parentTree ;

		// 常量 ;
		var this_ = this ,
			tagName = $T.tagName ,
			S = $T.data_static ,
			D = $T.data_v ;

		// 真实元素 ( 必须存在 );
		var $_father = $T.parentTree.DOM ,
			$_dom = null 

		// 文字节点
		if( tagName=='TEXT' ){  
			// 静态
			if( S['text'] ){
				$_dom = $T.DOM = document.createTextNode( S['text'] );
			}
			// 动态 
			if( D['vbind_double'] ){
				var text = D['vbind_double']['value'];
				$_dom = $T.DOM = document.createTextNode( text );
			}
		}
		// dom节点
		else{ 
			/* v-for v-if 组件 , 都会在外包一层( 组件特殊, 需要手动挂载 ) */

			// 可能存在的子组件 ;
			var COMPONENT_OPTIONS=this.$components[ tagName ] , COMPONENT_PROPS=null ;
			// 组件包裹节点
			if( COMPONENT_OPTIONS ){ 
				$_dom = $T.DOM = document.createElement('figure'); 
				S['classList']?S['classList']+=' com_figure':S['classList']='com_figure';
			}
			// v-for包裹节点 
			else 
			if( tagName=='VFOR_BEGIN' ){
				$_dom = $T.DOM = document.createElement('article'); 
				S['classList']?S['classList']+=' com_vforwrap':S['classList']='com_vfor_wrap';
			}
			// v-if包裹节点
			else 
			if( tagName=='VIF_BEGIN' ){
				$_dom = $T.DOM = document.createElement('dd'); 
				S['classList']?S['classList']+=' com_vifwrap':S['classList']='com_vif_wrap';
			}
			// 常规dom节点
			else{ 
				$_dom = $T.DOM = document.createElement( tagName );
			}

			// 静态属性
			S['classList'] ? $_dom.className=S['classList'] : null ;
			S['cssText'] ? $_dom.style.cssText=S['cssText'] : null ;
			S['attr'] ? $.setAttr( $_dom , S['attr'] ) : null ;

			// 动态属性
			D['vbind_class'] ? $.setClass($_dom , D['vbind_class']) : null ;
			D['vbind_classList'] ? $_dom.className=D['vbind_classList'] : null ;
			D['vbind_style'] ? $.setStyle($_dom , D['vbind_style']) : null ;
			if(['vbind_attr']){
				COMPONENT_OPTIONS ? COMPONENT_PROPS=D['vbind_attr'] : $.setAttr($_dom , D['vbind_attr']) ;
			}

			// 事件绑定 ;
			if( D['von'] ){
				for(var m in D['von']){
					(function(method){
						// 绑定的事件收集一下 ;
						$_dom[ method ]=D['von'][method] ;
					}(m))
				}
			}

			// 判断v-show ;
			if( D['vshow'] ){
				D['vshow']['value'] ? $_dom.classList.remove('com_displayNone') : $_dom.classList.add('com_displayNone') ;
			}

			// 存在子组件挂载 ;
			if( COMPONENT_OPTIONS ){
				// 创建子组件 
				$T['CHILD_COMPONENT'] = new Com( COMPONENT_OPTIONS , COMPONENT_PROPS , this , this.$root , this.$router );
				// 挂载
				$T['CHILD_COMPONENT'].$mount( $_dom );
				// 判断ref
				var $ref = D['vbind_attr']&&D['vbind_attr']['ref'] || S['attr']&&S['attr']['ref'];
					$ref ? this.$refs[ $ref ]={el:$_dom ,component: $T['CHILD_COMPONENT'] } : null ;
			}else{
				// 判断ref ;
				var $ref = D['vbind_attr']&&D['vbind_attr']['ref'] || S['attr']&&S['attr']['ref'];
					$ref ? this.$refs[ $ref ]=$_dom : null ;
			}
		}

		// 添加元素到父级 ;
		if( diffOrigin ){

		}else{
			$_father.appendChild( $_dom )
		}

		// 递归子节点 ;
		for(var i=0,len=$T.children.length ; i<len ; i++){
			this.readTree( $T.children[i] , $T );
		};

		// 返回树 ;
		return $T;
	},

	// 取消树节点上dom引用及事件 ;
	c.prototype.unsetTree=function( $T , needRemoveDOM ){
		// 递归
		for(var i=0,len=$T.children.length ; i<len ; i++){
			this.unsetTree( $T.children[i] , false );
		};

		// 存在组件卸载
		$T['CHILD_COMPONENT'] ? $T['CHILD_COMPONENT'].$destroy() : null ;

		if( $T.DOM ){
			// 清除dom绑定事件 ;
			if( $T.data_v['von'] ){
				for(var m in $T.data_v['von']){
					$T.DOM[ m ]=null ;
				}
			};

			// 清楚DOM实例
			needRemoveDOM ? $T.parentTree.DOM.removeChild( $T.DOM ) : null ;

			// 清除dom引用 ;
			$T.DOM = null ;
		} 
	};

	//********************************* 对比树 ********************************* ;;;
	c.prototype.diffTree=function( $new_T , $new_parentTree , $old_T ){
		// 循环引用 ; 处理特殊节点 ;
		$new_T['parentTree'] = $new_parentTree ;

		// 常量 ;
		var this_ = this ,
			tagName = $new_T.tagName ,
			new_D = $new_T.data_v ,
			old_D = $old_T.data_v ;

		// 真实元素 ( 必须存在 );
		var $_father = $new_T.parentTree.DOM ,
			$_dom = $new_T.DOM = $old_T.DOM ; 

		// 判断
		if( tagName=='TEXT' ){
			// 动态
			if(new_D['vbind_double'] ){
				if( new_D['vbind_double']['value'] !== old_D['vbind_double']['value'] ){
					var text = new_D['vbind_double']['value'];
					$_dom.textContent = text ;
				}
			}
		}else{
			// 是否存在子组件 ;
			var CHILD_COMPONENT = $old_T['CHILD_COMPONENT'] ;
			// 动态
			new_D['vbind_class'] ? $.diffClass( $_dom , new_D['vbind_class'] , old_D['vbind_class'] ) : null ;
			new_D['vbind_classList']!=old_D['vbind_classList'] ? $_dom.className=new_D['vbind_classList'] : null ;
			new_D['vbind_style'] ? $.diffStyle( $_dom , new_D['vbind_style'] , old_D['vbind_style'] ) : null ;
			if(new_D['vbind_attr']){
				// 子组件attr就是props ;
				CHILD_COMPONENT ? null : $.diffAttr(  $_dom , new_D['vbind_attr']  , old_D['vbind_attr'] ) ;
			};
			// 事件绑定 ( 兼容v-for循环调换位置 );
			if( new_D['von'] ){
				for(var m in new_D['von']){
					(function(method){
						// 绑定的事件收集一下 ;
						$_dom[ method ]=new_D['von'][method] ;
					}(m))
				}
			};
			// 判断v-show ;
			if( new_D['vshow'] ){
				if( !!new_D['vshow']['value'] != !!old_D['vshow']['value'] ){
					if(new_D['vshow']['value']){
						$_dom.classList.remove('com_displayNone');
					}
					if(!new_D['vshow']['value']){
						$_dom.classList.add('com_displayNone');
					}
				}
			};

			// 组件包裹节点
			if( CHILD_COMPONENT ){ 
				// 赋值CHILD_COMPONENT ;
				$new_T['CHILD_COMPONENT'] = CHILD_COMPONENT ;
				// 更新子组件的props ;
				var vbind_attr = new_D['vbind_attr']||{} ;
				for(var k in vbind_attr){
					CHILD_COMPONENT[ k ]=vbind_attr[k] ;
				}
				// 只要存在子组件 , 就继续渲染 ;
				CHILD_COMPONENT.$update() ;
			}
			// v-for包裹节点 || v-if包裹节点 ;
			else 
			if( tagName=='VFOR_BEGIN' || tagName=='VIF_BEGIN' ){ 
				/*
					这么做其实是为了 优化v-for 添加大数据 ;
				*/
				//对比数组变化
				var new_children = $new_T.children ;
				var old_children = $old_T.children ;
				var $_cha = new_children.length - old_children.length ;
				// 数组长度不变
				if( $_cha==0 ){
					// 递归子节点;
					for(var i=0,len=(new_children.length) ; i<len ; i++){
						var $new_child = $new_T.children[i] ;
						var $old_child = $old_T.children[i] ;
						this.diffTree( $new_child , $new_T , $old_child );
					};
				}
				// 数组变长
				else if( $_cha>0 ){ // *** new_children大 old_children小 ;
					// 创建文档节点 ;
					var $wrap=document.createDocumentFragment();
					// 读取新的
					for(var i=old_children.length , len=new_children.length ; i<len ; i++){
						var $readed=this.readTree(new_children[i] , $new_T , true);
						// 添加文档节点中 ;
						$wrap.appendChild($readed.DOM);
					}
					// 文档节点添加到父级
					$_dom.appendChild($wrap);

					// 便利少的一方 , 防止undefined ;
					for(var i=0,len=(old_children.length) ; i<len ; i++){
						var $new_child = $new_T.children[i] ;
						var $old_child = $old_T.children[i] ;
						this.diffTree( $new_child , $new_T , $old_child );
					};
				}
				// 数组变短
				else if( $_cha<0 ){ // *** old_children大 new_children小 ;
					// 删除旧的
					for(var i=new_children.length , len=old_children.length ; i<len ; i++){
						this.unsetTree( old_children[i] , true );
					}

					// 便利少的一方 , 防止undefined ;
					for(var i=0,len=(new_children.length) ; i<len ; i++){
						var $new_child = $new_T.children[i] ;
						var $old_child = $old_T.children[i] ;
						this.diffTree( $new_child , $new_T , $old_child );
					};
				}
			}
			// 常规dom节点
			else{ 
				// 递归子节点 ;
				for(var i=0,len=$new_T.children.length ; i<len ; i++){
					var $new_child = $new_T.children[i] ;
					var $old_child = $old_T.children[i] ;
					this.diffTree( $new_child , $new_T , $old_child );
				}
			}

		};
	};

		// 挂载
	c.prototype.$mount=function( el ){
		var this_ = this ;
		
		// 获取el实例
		this.$el = $.type(el)=='string' ? $.q(el) : el ;
		// 查看是否挂载 
		if(!this.$el){ alert('找不到挂载节点'); return };

		// beforeMount生命周期
		this.beforeMount();

		// 生成一课树 ;
		this.$tree = this.render() ;

		// 读树自动添加元素
		this.readTree( this.$tree , {isComponentEl:true,DOM:this.$el} );

		// mounted 生命周期
		setTimeout(function(){
			this_.mounted();
		},0);

		return this ;
	};
	// 手动更新( 手动调用会引起父组件$diff出错,属于被动调用 );
	c.prototype.$update=function(){
		var this_ = this ;

		if( this.shouldUpdate && this.shouldUpdate()==false ){
			// 性能优化 ;
			return ;
		} else{
			// 查看是否挂载
			if(!this.$el){ alert('组件尚未挂载'); return };

			// beforeUpdate生命周期
			this.beforeUpdate();

			// 新树和旧树 ;
			var new_tree = this.render();
			var old_tree = this.$tree ; 
	
			// 对比树
			this.diffTree( new_tree , {isComponentEl:true,DOM:this.$el} , old_tree );
	
			// 对比完替成新的树 ;
			this.$tree = new_tree ;
	
			// updated 生命周期
			setTimeout(function(){
				this_.updated();
			},0);
		}
	};
	// 销毁
	c.prototype.$destroy=function(){
		if(!this.$el){ alert('组件尚未挂载'); return };

		// 注销树
		this.unsetTree( this.$tree , true );

		// destroyed 生命周期
		this.destroyed();
	};	


}







	