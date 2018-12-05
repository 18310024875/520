// // 需要转译的
// // , . * ? $ ^ | \/ ( ) { } [] ;

// // [`~!@#$^&*()=|{};:'".,[\]./?~@#&*{}]

// // \s空 \S !空 
// // \n 换行 \r 回车 \0 空字符 \t 缩进
// // \w = [a-zA-Z0-9_]
// // \d = [0-9]

// // \b 单词边界 \B非单词边界 
// // \t 缩进符
// // (\r|\n) 换行符
 
// // {n,}最少n次
// // 禁止贪婪模式 必须有量词 ,例如 .*? .{3,6}?  --- 量词后面加?
// // 反向引用    必须有分组 ,例如 2016-11-22  str.replace(/(\d*)-(\d*)-(\d*)/,"$2/$3/$1")
// // 忽略选组    必须有组  , (?:\d{3})
// // 前瞻断言   'a2*3'.replace(/\w(?=\d)/,'X') --- X2*3  'a2*3'.replace(/\w(?!\d)/,'X') --- aX*3 ;

// function isEmptyObject(obj){
// 	var ind = 0 ;
// 	for(var i in obj){
// 		i?ind++:null;
// 	}
// 	if( !ind ){
// 		return true ;
// 	}else {
// 		return false ;
// 	}
// }
// function isEmptyArray(arr){
// 	if( arr.length==0 ){
// 		return true ;
// 	}else{
// 		return false ;
// 	}
// }
// function HTML_decode( str ){
//     var s = "";
//     if (str.length == 0) return "";
//     s = str.replace(/&amp;/g, "&");
//     s = s.replace(/&lt;/g, "<");
//     s = s.replace(/&gt;/g, ">");
//     s = s.replace(/&nbsp;/g, " ");
//     s = s.replace(/&#39;/g, "\'");
//     s = s.replace(/&quot;/g, "\"");
//     return s;
// };
// function encode_bd(s){
//     if(s.length == 0) return "";
//     s = s.replace(/</g,"&lt;");
//     s = s.replace(/>/g,"&gt;");
//     return s.trim(); 
// };
// function decode_bd(s){
//     if(s.length == 0) return "";
//     s = s.replace(/&lt;/g,"<");
//     s = s.replace(/&gt;/g,">");
    
//     return s; 
// };


// var EXP_aloneTag = /(<\w[^<>]*\s*)\/\s*>/g; //单标签分组替换
// var EXP_startTag = /<\w[^<>]*\s*>/g ;//开始标签
// var EXP_endTag   = /<\/\w[\w-]*\s*>/g ;//结束标签
// var EXP_tag = /<\w[^<>]*\s*>|<\/\w[\w-]*\s*>/g ;


// var t = {};
// // 跑起来
// 	t.run = function( template ){

// 		var tpl = t.filter_tpl( template );

// 		var tag_arr = t.make_tag_arr(tpl);

// 		var tree = t.make_tree(tag_arr);

// debugger
// console.log( tree )

// 		var render = t.make_render( tree );

// 		console.log(render);

// 		return render ;
// 	};

// 	// 过滤模板 ;
// 	t.filter_tpl = function(tpl){
// 		// 去换行 ; 	
// 			tpl = tpl.replace(/\t/g,' ') ;
// 			tpl = tpl.replace(/\r/g,' ') ;
// 			tpl = tpl.replace(/\n/g,' ') ;
// 			tpl = tpl.replace(/\s{1,}/g,' ');

// 		// 去注释
// 			tpl = tpl.replace(/<\!\-\-(.*?)\-\->/g,'');

// 		// 转译="..."内容     
// 				// !!!!!!!! 内容中不能存在",会导致匹配出问题 ;
// 			tpl=tpl.replace(/(\w+)="(.+?)"/g,function(E,a,b){ return a+'=\"'+encode_bd(b)+'\"'});

// 		// 转译{{...}}内容 替换为标签
// 				// !!!!!!!! 内容中存在的" 替换成' ;
// 			tpl = tpl.replace(/\{\{(.+?)\}\}/g,function(E,a){ return '<TEXT v-bind:vbind_double=\"'+encode_bd(a).replace(/"/g,'\'')+'\"></TEXT>'});

// 		// 把单标签变双标签
// 			tpl = tpl.replace( EXP_aloneTag ,function(E,a){ return a+'></over>' });

// 		// 替换文本为标签
// 			tpl = tpl.replace(/>\s*</g,'><');
// 			tpl = tpl.replace(/>([^<>]+?)</g,function(E,a){
// 				a = a.replace(/\s{1,}/g,' ').trim();
// 				return '><TEXT static_text=\"'+a+'\"></TEXT><';
// 			});

// 		//  替换: @ 符号 ;
// 			tpl = tpl.replace( EXP_tag ,function(E){
// 				// 替换:为v-bind
// 				E=E.replace(/\s+:([\w\.-]+)=/g,function(E,a){ return ' v-bind:'+a+'='});
// 				// 替换@为v-on
// 				E=E.replace(/\s+@([\w\.-]+)=/g,function(E,a){ return ' v-on:'+a+'='});
// 				// v-on:click="cliclFun" 替换成 v-on:click="cliclFun()"
// 				E=E.replace(/(v-on:[\w\.-]+=\"(.+?))\"/g,function(E,a,b){ 
// 					var str = b.indexOf('(')>-1?str=E:str=(a+'()\"') ;
// 					return str.replace(/\s*/g,'');
// 				});
// 				// v-on:click="cliclFun()" 替换成 v-on:click="cliclFun(e)"
// 				E=E.replace(/(v-on:[\w\.-]+=)\"(.+?)\"/g,function(E,a,b){ 
// 					var match = b.match(/(.+)\((.*)\)/);
// 					var k = match[1];
// 					var v = match[2];
// 						v ? v+=',evt' : v+='evt';
// 					return a+'\"'+k+'('+v+')'+'\"';
// 				});
// 				return E ;
// 			});
// 		// 返回
// 		return tpl ;
// 	};
// 	// 生成标签数组(分类v-fortemplate)
// 	t.make_tag_arr = function(tpl){
// 		var tag_arr = [] ;
// 		// 所有标签 ;
// 		var tags = tpl.match( EXP_tag ) ;
// 		// =""内的标记解析回去 ;
// 			tags = tags.map(function(each){ return HTML_decode(each) });
// 		if( tags.length==0 ){console.error('template内 没有标签');return};

// 		// ********************************** 查找v-for模块 ***************************************** ;
// 		var inVF = false ; // 是否在解析vfor ;
// 		var vlen_arr  = []  ; // 如果在解析vfor--> 记录层级数组
// 		var vpush_arr = []  ; // 如果在解析vfor--> 真正放元素的容器 ;


// 		// 层级计数器
// 		var dir = true ;
// 		var len = 0;
// 		for(var i=0 ; i<tags.length ; i++){
// 			// 层级下标
// 			var each = tags[i];
// 			if( each[1]!='/' ){
// 				// 开始标签 ;
// 				dir==false ? null : len++ ;
// 				dir=true ;
// 			}else{
// 				// 结束标签 ;
// 				dir==true  ? null : len-- ;
// 				dir=false;
// 			};

// 			// 第一个含有v-for的标签 表示进入一个v-for作用域 , 开始计数器 !!! ;
// 			if( each.indexOf('v-for')>-1&&inVF==false ){
// 				inVF=true;
// 				// vpush_arr 添加默认值
// 				vpush_arr = [{tag:'$ROOT',vfor_tag_arr:[]}]
// 			};
			
// 			// vfor模板内
// 			if( inVF==true ){
// 				// 开始标签
// 				if( each[1]!='/' ){
// 					if( each.indexOf('v-for')>-1 ){
// 						// 记录位置
// 						vlen_arr.push(len);
// 						// 节点
// 						var obj = {
// 							tag:'<VFOR_BEGIN>',
// 							vfor_tag_arr:[]
// 						};
// 						// 父亲的 vfor_tag_arr 加入当前节点为开始标签
// 						vpush_arr[vpush_arr.length-1]['vfor_tag_arr'].push(obj);
// 						// vpush 加入节点 , push方向向下 ;
// 						vpush_arr.push(obj);
// 					}
// 					// push开始标签
// 					vpush_arr[vpush_arr.length-1]['vfor_tag_arr'].push(each)
// 				}
// 				// 结束标签 ;
// 				else{
// 					// push结束标签
// 					vpush_arr[vpush_arr.length-1]['vfor_tag_arr'].push(each)
// 					// 删除节点
// 					if( len==vlen_arr[vlen_arr.length-1] ){
// 						// 移除位置
// 						vlen_arr.pop();
// 						// vpush 移除节点 , push方向向上 ;
// 			  			vpush_arr.pop();

// 			  			// 父级节点加入结束标签
// 			  			vpush_arr[vpush_arr.length-1]['vfor_tag_arr'].push('</VFOR_END>')

// 						// 最后退出节点时
// 						if(vlen_arr.length==0){
// 							// 还原默认设置
// 							var pop = vpush_arr.pop();
// 							tag_arr = tag_arr.concat(pop['vfor_tag_arr'])
// 							inVF = false ;
// 						}
// 					}
// 				};
// 			}else{
// 				tag_arr.push(each)
// 			}
// 		}
// 		// 返回
// 		return tag_arr ;
// 	};
// 	// 生成标签树
// 	t.make_tree = function (tag_arr) {
// 		var push_arr = [{tag:'$ROOT',children:[]}];

// 		for(var i=0 ; i<tag_arr.length ; i++){
// 			var each = tag_arr[i];
// 			// 开始标签
// 			if( each[1]!='/' ){
// 				var T = null ;
// 				// v-for递归此函数 ;
// 				if( each.tag=='<VFOR_BEGIN>' ){
// 					var tag = each.tag;
// 					var tagName = tag.match(/<([\w-]+).*>/)[1];
// 					var data = t.getTreeData(tag);
// 					T={
// 						tag:tag,
// 						tagName:tagName,
// 						data_static: data.data_static ,
// 						data_v: data.data_v
// 					};

// 					var vfor_tree = t.make_tree( each.vfor_tag_arr );
// 					var match = vfor_tree.tag.match(/v-for="\s*\(\s*([\w-]+)\s*,\s*([\w-]+)\s*\)\s+in\s+([^"]+)\s*"/) ;

// 					T['vfor_tree'] = vfor_tree ;
// 					T['vfor_val']  = match[1] ;
// 					T['vfor_key']  = match[2] ;
// 					T['vfor_list'] = match[3] ;
// 				}else{
// 					var tag = each ;
// 					var tagName = tag.match(/<([\w-]+).*>/)[1];
// 					var data = t.getTreeData(tag);
// 					T={
// 						tag:tag,
// 						tagName:tagName,
// 						data_static: data.data_static ,
// 						data_v: data.data_v ,

// 						children:[]
// 					};
// 				};

// 				push_arr[push_arr.length-1]['children'].push( T );
// 				push_arr.push( T );
// 			}else{
// 			// 结束标签
// 				push_arr.pop();
// 			}	
// 		}
// 		// 返回
// 		return push_arr[0].children[0];
// 	};
// 	// 制作一个虚拟dom ;
// 	t.getTreeData = function( tag  ){
// 		var S = {
// 			text:'',
// 			classList:'',
// 			cssText:'',
// 			attr:{},
// 		};
// 		var D = {
// 		  	vbind_double:{},
// 		  	vbind_class:{},
// 		  	vbind_class_render:'',
// 		  	vbind_style:{},
// 		  	vbind_attr:{},

// 		  	vif:{},
// 		  	vshow:{},
// 		  	von:{},
// 		};

// 		// 便利所有的属性 ;
// 		var attributs = null ;
// 		if( tag.indexOf('static_text')>-1){
// 			// 静态字符内可能存在 " 影响匹配 ;
// 			attributs = tag.match(/[^\s]+="(.*)"+/g)||[] ; 
// 		}else{
// 			attributs = tag.match(/[^\s]+="(.*?)"+/g)||[] ; 
// 		};

// 		// 便利一个标签的所有属性 ;
// 		attributs.map(function( each ){
// 			// 处理v-on
// 			if( each.indexOf('v-on:')>-1 ){
// 				var match = each.match(/v-on:(.+)=["](.*)["]/);
// 			    var key   = match[1];
// 			    var value = match[2].trim();
// 			    D['von']['on'+key]='function(evt){'+value+'}';
// 			}
// 			// 处理v-if 
// 			else if( each.indexOf('v-if=')>-1 ){
// 				var match = each.match(/v-if=["](.*)["]/);
// 			    var value = match[1].trim();
// 			    D['vif']={value:value} ;
// 			}
// 			// 处理v-show
// 			else if( each.indexOf('v-show=')>-1 ){
// 				var match = each.match(/v-show=["](.*)["]/);
// 			    var value = match[1].trim();
// 			    D['vshow']={value:value}  ;
// 			}
// 			// 不赋值v-for 
// 			else if( each.indexOf('v-for=')>-1 ){

// 			}
// 			// 处理v-bind 
// 			else if( each.indexOf('v-bind:')>-1 ){
// 				var match = each.match(/v-bind:(.*)=["](.*)["]/);
// 			    var key   = match[1];
// 			    var value = match[2].trim();
// 				if( key=='vbind_double' ){
// 					D['vbind_double']={value:value} ;
// 				}else if( key=='class' ){
// 					// 对象语法 切割
// 					var c_match = value.match(/\{(.*)\}/);
// 					if( c_match&&c_match[1] ){
// 						var c_arr = c_match[1].split(',');
// 							c_arr.map(function(_class){
// 								var v_k = _class.match(/(\w+)\s*:(.+)/);
// 								if( v_k && v_k[1] && v_k[2] ){
// 									D['vbind_class'][ v_k[1] ] = v_k[2] ;
// 								}
// 							})
// 					}else{
// 						D['vbind_classList']=value.trim();
// 					}
// 				}else if( key=='style' ){
// 					// 对象语法 切割
// 					var s_match = value.match(/\{(.*)\}/);
// 					if( s_match&&s_match[1] ){
// 						var s_arr = s_match[1].split(',');
// 							s_arr.map(function(_style){
// 								var v_k = _style.match(/(\w+)\s*:(.+)/);
// 								if( v_k && v_k[1] && v_k[2] ){
// 									D['vbind_style'][ v_k[1] ] = v_k[2] ;
// 								}
// 							})
// 					}
// 				}else{
// 					D['vbind_attr'][key] = value ;
// 				}
// 			}
// 			// 处理static
// 			else{
// 				var match = each.match(/(.*)=["](.*)["]/);
// 			    var key   = match[1];
// 			    var value = match[2].trim();
// 			    if( key=='static_text' ){
// 			    	S['text'] = value ;
// 			    }else if( key=='class' ){
// 			    	S['classList'] = value ;
// 			    }else if( key=="style" ){
// 			    	S['cssText'] = value ;
// 			    }else{
// 			    	S['attr'][key] = value ;
// 			    }
// 			}
// 		});


// 		// 处理空数据
// 		!S.text ? (delete S.text) : null ;
// 		!S.classList ? (delete S.classList) : null ;
// 		!S.cssText ? (delete S.cssText) : null ;
// 		isEmptyObject(S.attr) ? (delete S.attr) : null ;

// 		isEmptyObject(D.vbind_double) ? (delete D.vbind_double) : null ;
// 		isEmptyObject(D.vbind_class) ? (delete D.vbind_class) : null ;
// 		!D.vbind_class_render ? (delete D.vbind_class_render) : null ;
// 		isEmptyObject(D.vbind_style) ? (delete D.vbind_style) : null ;
// 		isEmptyObject(D.vbind_attr) ? (delete D.vbind_attr) : null ;

// 		isEmptyObject(D.vif) ? (delete D.vif) : null ;
// 		isEmptyObject(D.vshow) ? (delete D.vshow) : null ;
// 		isEmptyObject(D.von) ? (delete D.von) : null ;


// 		return {
// 			data_static:S,
// 			data_v:D
// 		}
// 	};

// // ****** 生成render ****** ;
// 	t.make_render = function(tree){
// 		var str = t.getStr(tree) ;
// 		// 替换render中的this为 $_THIS ;
// 		   	str = str.replace(/([^\w])this([^\w])/g,function(E,a,b){
// 		    	return a+'$_THIS'+b
// 		    });
// 		// 返回 ;
// 		return 'function(){'+
// 					'var $_THIS=this ;'+ 
// 					'var $_VFORLOOP=this.vforLoop.bind(this) ;'+ 
// 					'return '+str+';'+
// 				'}';
// 	};
// 	t.STR_V = function( dv ){
// 		var str = JSON.stringify( dv );
// 		str = str.replace( /("[\w\.-]+":)("[^"]+")/g ,function(E,a,b){
// 			return a+b.slice(1,-1)
// 		});
// 		return str ;
// 	};
// 	t.STR_STATIC = function(sv){
// 		return JSON.stringify(sv)
// 	};
// 	t.getStr= function(tree){
// 		if(tree.vfor_tree){// v-for元素
// 			var vfor_tree = tree.vfor_tree ;
// 			var v = tree['vfor_val'];
// 			var k = tree['vfor_key'];
// 			var list = tree['vfor_list'];
// 			return '{'+
// 						'tagName: "'+tree.tagName+'",'+
// 						'data_static: '+t.STR_STATIC( tree.data_static )+','+
// 						'data_v: '+t.STR_V( tree.data_v ) +','+
// 						'children: $_VFORLOOP('+list+',function('+v+','+k+'){'+
// 							' return {'+
// 								'tagName: "'+vfor_tree.tagName+'",'+
// 								'data_static: '+t.STR_STATIC( vfor_tree.data_static )+','+
// 								'data_v: '+ t.STR_V( vfor_tree.data_v )+','+
// 								'children: '+t.getChildrenStr(vfor_tree)+
// 							'}'+
// 						'})'+//_VFORLOOP over ;
// 					'}';
// 		}else{ //正常元素
// 			return '{'+
// 						'tagName: "'+tree.tagName+'",'+
// 						'data_static: '+t.STR_STATIC( tree.data_static )+','+
// 						'data_v: '+t.STR_V( tree.data_v )+','+
// 						'children: '+t.getChildrenStr(tree)+
// 					'}';
// 		}
// 	};
// 	t.getChildrenStr = function( tree ){
// 		var children = tree.children ;
// 		var arr=[] ;
// 		for(var i=0,len=children.length ; i<len ; i++){
// 			arr.push(t.getStr(children[i])) ;
// 		}
// 		return '['+arr.join()+']';
// 	};


// module.exports = t ;














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
			this.$data = ($.type( opt.data )=='function'? opt.data() : JSON.parse(JSON.stringify( opt.data || {} ))) ;
			// 事件 绑定this ;
			this.$methods = opt.methods||{} ;
			// 组件 绑定this;
			this.$components = opt.components || {};
			// 全局组件添加到$components ;
			for(var name in Com.globalComponents ){
				this.$components[name] = Com.globalComponents[name];
			}
			// 生命周期 ;
			this.created = opt.created || function(){}; //---可修改组件内部属性 ;
			this.mounted = opt.mounted || function(){};
			this.shouldUpdate = opt.shouldUpdate || function(){}; //---是否需要被动更新组件 ;
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
		}

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

		// 存在v-if判断
		if( D['vif'] ){
			// 存在vif且没有注释节点 , 说明第一次读树 , 创建一个 ;
			!$T['DOM_VIF_COMMENT'] ? $T['DOM_VIF_COMMENT']=document.createComment('') : null ;

			// vif为false
			if( !D['vif']['value'] ){
				// 赋值$T.DOM ;
				$_dom = $T.DOM = $T['DOM_VIF_COMMENT'] ;

				// 读树源头不自动添加 ;
				if( diffOrigin ){
 
				}else{
					// 注释节点站位 ;
					$_father.appendChild( $_dom )
				}
				// 终止下文 ;
				return $T;
			}
		};
		// ****** 下文不存在v-if判断 或 v-if判断为true ***** ;

		// 判断 
		if( tagName=='TEXT' ){  //文字节点
			// 静态
			if( S['text'] ){
				$_dom = $T.DOM = document.createTextNode( S['text'] );
			}
			// 动态 
			if( D['vbind_double'] ){
				var text = D['vbind_double']['value'];
				$_dom = $T.DOM = document.createTextNode( text );
			}
		}else{ //dom节点
			// 可能存在的子组件 ;
			var COMPONENT_OPTIONS=this.$components[ tagName ] , COMPONENT_PROPS=null ;
			if( COMPONENT_OPTIONS ){ //components替换节点
				$_dom = $T.DOM = document.createElement('figure'); S['classList']?S['classList']+=' com_figure':S['classList']='com_figure';
			}else if( tagName=='VFOR_BEGIN' ){ //v-for包裹节点 
				$_dom = $T.DOM = document.createElement('article'); S['classList']?S['classList']+=' com_vforwrap':S['classList']='com_vforwrap';
			}else{ // 常规dom节点
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
		}

		if( $T['CHILD_COMPONENT'] ){
			$T['CHILD_COMPONENT'].$destroy();
		}else if( $T.DOM ){
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
			$_dom = null 

		// 存在v-if判断;
		if( new_D['vif'] ){
			// 记录v-if注释节点 ;
			$new_T['DOM_VIF_COMMENT'] = $old_T['DOM_VIF_COMMENT'] ;

			// v-if改变了
			if( !!new_D['vif']['value'] != !!old_D['vif']['value'] ){
				//  v-if从false变成true ; 创建树 ; dom节点插入到注释节点前 ;
				if(new_D['vif']['value']){
					// 读树
					this.readTree( $new_T , $new_T.parentTree , true);// 此时 返回值==$new_T ;
					// 此时v-if肯定为true 所以 $new_T肯定含有DOM ;
					$_father.insertBefore( $new_T.DOM/*真实dom*/ , $old_T.DOM/*---注释站位---*/ );
					$_father.removeChild( $old_T.DOM/*---注释站位---*/ );						
				}
				//  v-if从true变成false ; 移除树 ; 注释节点插入到dom节点前 ;
				else{
					// 赋值$T.DOM ;
					$new_T.DOM = $new_T['DOM_VIF_COMMENT'] ;
					// 此时v-if肯定为false
					$_father.insertBefore( $new_T.DOM/*---注释站位---*/ , $old_T.DOM/*真实节点*/ );
					// 移除dom引用 ;
					this.unsetTree( $old_T /*真实dom*/ , true );
				}
				// v-if只要改变就阻止下文 ;
				return ;
			}
			// v-if没变
			else{
				// v-if没变 && 仍然为false 阻止下文 ;
				if(!new_D['vif']['value']){ 
					// 赋值$T.DOM ;
					$new_T.DOM = $new_T['DOM_VIF_COMMENT'] ;
					// 阻止下文 ;
					return ;
				};
			}
		};
		// **************** 下文不存在v-if判断 或 v-if判断没改变&&v-if为true *************** ;

		// 赋值DOM ;
		var $_dom = $new_T.DOM = $old_T.DOM ; 

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

			// 不同类型节点 ;
			if( CHILD_COMPONENT ){ //components替换节点
				// 赋值CHILD_COMPONENT ;
				$new_T['CHILD_COMPONENT'] = CHILD_COMPONENT ;
				// 更新子组件的props ;
				var vbind_attr = new_D['vbind_attr']||{} ;
				for(var k in vbind_attr){
					CHILD_COMPONENT[ k ]=vbind_attr[k] ;
				}
				// 只要存在子组件 , 就继续渲染 ;
				CHILD_COMPONENT.$update() ;
			}else if( tagName=='VFOR_BEGIN' ){ //v-for包裹节点 
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
			}else{ // 常规dom节点
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

		// created 生命周期 ;
		this.created();
		
		// 获取el实例
		this.$el = $.type(el)=='string' ? $.q(el) : el ;
		// 查看是否挂载 
		if(!this.$el){ alert('找不到挂载节点'); return };

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







	