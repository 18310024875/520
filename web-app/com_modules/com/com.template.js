// 需要转译的
// , . * ? $ ^ | \/ ( ) { } [] ;

// [`~!@#$^&*()=|{};:'".,[\]./?~@#&*{}]

// \s空 \S !空 
// \n 换行 \r 回车 \0 空字符 \t 缩进
// \w = [a-zA-Z0-9_]
// \d = [0-9]

// \b 单词边界 \B非单词边界 
// \t 缩进符
// (\r|\n) 换行符
 
// {n,}最少n次
// 禁止贪婪模式 必须有量词 ,例如 .*? .{3,6}?  --- 量词后面加?
// 反向引用    必须有分组 ,例如 2016-11-22  str.replace(/(\d*)-(\d*)-(\d*)/,"$2/$3/$1")
// 忽略选组    必须有组  , (?:\d{3})
// 前瞻断言   'a2*3'.replace(/\w(?=\d)/,'X') --- X2*3  'a2*3'.replace(/\w(?!\d)/,'X') --- aX*3 ;

function isEmptyObject(obj){
	var ind = 0 ;
	for(var i in obj){
		i?ind++:null;
	}
	if( !ind ){
		return true ;
	}else {
		return false ;
	}
}
function isEmptyArray(arr){
	if( arr.length==0 ){
		return true ;
	}else{
		return false ;
	}
}
function HTML_decode( str ){
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    return s;
};
function encode_bd(s){
    if(s.length == 0) return "";
    s = s.replace(/</g,"&lt;");
    s = s.replace(/>/g,"&gt;");
    return s.trim(); 
};
function decode_bd(s){
    if(s.length == 0) return "";
    s = s.replace(/&lt;/g,"<");
    s = s.replace(/&gt;/g,">");
    
    return s; 
};


var EXP_aloneTag = /(<\w[^<>]*\s*)\/\s*>/g; //单标签分组替换
var EXP_startTag = /<\w[^<>]*\s*>/g ;//开始标签
var EXP_endTag   = /<\/\w[\w-]*\s*>/g ;//结束标签
var EXP_tag = /<\w[^<>]*\s*>|<\/\w[\w-]*\s*>/g ;


var t = {};
// 跑起来
	t.run = function( template ){

		var tpl = t.filter_tpl( template );

		var tag_arr = t.make_tag_arr(tpl);

		var tree = t.make_tree(tag_arr);

		var render = t.make_render( tree );

		console.log(render);

		return render ;
	};

	// 过滤模板 ;
	t.filter_tpl = function(tpl){
		// 去换行 ; 	
			tpl = tpl.replace(/\t/g,' ') ;
			tpl = tpl.replace(/\r/g,' ') ;
			tpl = tpl.replace(/\n/g,' ') ;
			tpl = tpl.replace(/\s{1,}/g,' ');

		// 去注释
			tpl = tpl.replace(/<\!\-\-(.*?)\-\->/g,'');

		// 转译="..."内容     
				// !!!!!!!! 内容中不能存在",会导致匹配出问题 ;
			tpl=tpl.replace(/(\w+)="(.+?)"/g,function(E,a,b){ return a+'=\"'+encode_bd(b)+'\"'});

		// 转译{{...}}内容 替换为标签
				// !!!!!!!! 内容中存在的" 替换成' ;
			tpl = tpl.replace(/\{\{(.+?)\}\}/g,function(E,a){ return '<TEXT v-bind:vbind_double=\"'+encode_bd(a).replace(/"/g,'\'')+'\"></TEXT>'});

		// 把单标签变双标签
			tpl = tpl.replace( EXP_aloneTag ,function(E,a){ return a+'></over>' });

		// 替换文本为标签
			tpl = tpl.replace(/>\s*</g,'><');
			tpl = tpl.replace(/>([^<>]+?)</g,function(E,a){
				a = a.replace(/\s{1,}/g,' ').trim();
				return '><TEXT static_text=\"'+a+'\"></TEXT><';
			});

		//  替换: @ 符号 ;
			tpl = tpl.replace( EXP_tag ,function(E){
				// 替换:为v-bind
				E=E.replace(/\s+:([\w\.-]+)=/g,function(E,a){ return ' v-bind:'+a+'='});
				// 替换@为v-on
				E=E.replace(/\s+@([\w\.-]+)=/g,function(E,a){ return ' v-on:'+a+'='});
				// v-on:click="cliclFun" 替换成 v-on:click="cliclFun()"
				E=E.replace(/(v-on:[\w\.-]+=\"(.+?))\"/g,function(E,a,b){ 
					var str = b.indexOf('(')>-1?str=E:str=(a+'()\"') ;
					return str.replace(/\s*/g,'');
				});
				// v-on:click="cliclFun()" 替换成 v-on:click="cliclFun(e)"
				E=E.replace(/(v-on:[\w\.-]+=)\"(.+?)\"/g,function(E,a,b){ 
					var match = b.match(/(.+)\((.*)\)/);
					var k = match[1];
					var v = match[2];
						v ? v+=',evt' : v+='evt';
					return a+'\"'+k+'('+v+')'+'\"';
				});
				return E ;
			});
		// 返回
		return tpl ;
	};
	// 生成标签数组(分类v-fortemplate)
	t.make_tag_arr = function(tpl){
		var tag_arr = [] ;
		// 所有标签 ;
		var tags = tpl.match( EXP_tag ) ;
		// =""内的标记解析回去 ;
			tags = tags.map(function(each){ return HTML_decode(each) });
		if( tags.length==0 ){console.error('template内 没有标签');return};

		// ********************************** 查找v-for模块 ***************************************** ;
		var inVF = false ; // 是否在解析vfor ;
		var vlen_arr  = []  ; // 如果在解析vfor--> 记录层级数组
		var vpush_arr = []  ; // 如果在解析vfor--> 真正放元素的容器 ;


		// 层级计数器
		var dir = true ;
		var len = 0;
		for(var i=0 ; i<tags.length ; i++){
			// 层级下标
			var each = tags[i];
			if( each[1]!='/' ){
				// 开始标签 ;
				dir==false ? null : len++ ;
				dir=true ;
			}else{
				// 结束标签 ;
				dir==true  ? null : len-- ;
				dir=false;
			};

			// 第一个含有v-for的标签 表示进入一个v-for作用域 , 开始计数器 !!! ;
			if( each.indexOf('v-for')>-1&&inVF==false ){
				inVF=true;
				// vpush_arr 添加默认值
				vpush_arr = [{tag:'$ROOT',vfor_tag_arr:[]}]
			};
			
			// vfor模板内
			if( inVF==true ){
				// 开始标签
				if( each[1]!='/' ){
					if( each.indexOf('v-for')>-1 ){
						// 记录位置
						vlen_arr.push(len);
						// 节点
						var obj = {
							tag:'<VFOR_BEGIN>',
							vfor_tag_arr:[]
						};
						// 父亲的 vfor_tag_arr 加入当前节点为开始标签
						vpush_arr[vpush_arr.length-1]['vfor_tag_arr'].push(obj);
						// vpush 加入节点 , push方向向下 ;
						vpush_arr.push(obj);
					}
					// push开始标签
					vpush_arr[vpush_arr.length-1]['vfor_tag_arr'].push(each)
				}
				// 结束标签 ;
				else{
					// push结束标签
					vpush_arr[vpush_arr.length-1]['vfor_tag_arr'].push(each)
					// 删除节点
					if( len==vlen_arr[vlen_arr.length-1] ){
						// 移除位置
						vlen_arr.pop();
						// vpush 移除节点 , push方向向上 ;
			  			vpush_arr.pop();

			  			// 父级节点加入结束标签
			  			vpush_arr[vpush_arr.length-1]['vfor_tag_arr'].push('</VFOR_END>')

						// 最后退出节点时
						if(vlen_arr.length==0){
							// 还原默认设置
							var pop = vpush_arr.pop();
							tag_arr = tag_arr.concat(pop['vfor_tag_arr'])
							inVF = false ;
						}
					}
				};
			}else{
				tag_arr.push(each)
			}
		}
		// 返回
		return tag_arr ;
	};
	// 生成标签树
	t.make_tree = function (tag_arr) {
		var push_arr = [{tag:'$ROOT',children:[]}];

		for(var i=0 ; i<tag_arr.length ; i++){
			var each = tag_arr[i];
			// 开始标签
			if( each[1]!='/' ){
				var T = null ;
				// v-for递归此函数 ;
				if( each.tag=='<VFOR_BEGIN>' ){
					var tag = each.tag;
					var tagName = tag.match(/<([\w-]+).*>/)[1];
					var data = t.getTreeData(tag);
					T={
						tag:tag,
						tagName:tagName,
						data_static: data.data_static ,
						data_v: data.data_v
					};

					var vfor_tree = t.make_tree( each.vfor_tag_arr );
					var match = vfor_tree.tag.match(/v-for="\s*\(\s*([\w-]+)\s*,\s*([\w-]+)\s*\)\s+in\s+([^"]+)\s*"/) ;

					T['vfor_tree'] = vfor_tree ;
					T['vfor_val']  = match[1] ;
					T['vfor_key']  = match[2] ;
					T['vfor_list'] = match[3] ;
				}else{
					var tag = each ;
					var tagName = tag.match(/<([\w-]+).*>/)[1];
					var data = t.getTreeData(tag);
					T={
						tag:tag,
						tagName:tagName,
						data: data ,
						data_static: data.data_static ,
						data_v: data.data_v ,

						children:[]
					};
				};

				push_arr[push_arr.length-1]['children'].push( T );
				push_arr.push( T );
			}else{
			// 结束标签
				push_arr.pop();
			}	
		}
		// 返回
		return push_arr[0].children[0];
	};
	// 制作一个虚拟dom ;
	t.getTreeData = function( tag  ){
		var S = {
			text:'',
			classList:'',
			cssText:'',
			attr:{},
		};
		var D = {
		  	vbind_double:{},
		  	vbind_class:{},
		  	vbind_class_render:'',
		  	vbind_style:{},
		  	vbind_attr:{},

		  	vif:{},
		  	vshow:{},
		  	von:{},
		};

		// 便利所有的属性 ;
		var attributs = null ;
		if( tag.indexOf('static_text')>-1){
			// 静态字符内可能存在 " 影响匹配 ;
			attributs = tag.match(/[^\s]+="(.*)"+/g)||[] ; 
		}else{
			attributs = tag.match(/[^\s]+="(.*?)"+/g)||[] ; 
		};

		// 便利一个标签的所有属性 ;
		attributs.map(function( each ){
			// 处理v-on
			if( each.indexOf('v-on:')>-1 ){
				var match = each.match(/v-on:(.+)=["](.*)["]/);
			    var key   = match[1];
			    var value = match[2].trim();
			    D['von']['on'+key]='function(evt){'+value+'}';
			}
			// 处理v-if 
			else if( each.indexOf('v-if=')>-1 ){
				var match = each.match(/v-if=["](.*)["]/);
			    var value = match[1].trim();
			    D['vif']={value:value} ;
			}
			// 处理v-show
			else if( each.indexOf('v-show=')>-1 ){
				var match = each.match(/v-show=["](.*)["]/);
			    var value = match[1].trim();
			    D['vshow']={value:value}  ;
			}
			// 不赋值v-for 
			else if( each.indexOf('v-for=')>-1 ){

			}
			// 处理v-bind 
			else if( each.indexOf('v-bind:')>-1 ){
				var match = each.match(/v-bind:(.*)=["](.*)["]/);
			    var key   = match[1];
			    var value = match[2].trim();
				if( key=='vbind_double' ){
					D['vbind_double']={value:value} ;
				}else if( key=='class' ){
					// 对象语法 切割
					var c_match = value.match(/\{(.*)\}/);
					if( c_match&&c_match[1] ){
						var c_arr = c_match[1].split(',');
							c_arr.map(function(_class){
								var v_k = _class.match(/(\w+)\s*:(.+)/);
								if( v_k && v_k[1] && v_k[2] ){
									D['vbind_class'][ v_k[1] ] = v_k[2] ;
								}
							})
					}else{
						D['vbind_classList']=value.trim();
					}
				}else if( key=='style' ){
					// 对象语法 切割
					var s_match = value.match(/\{(.*)\}/);
					if( s_match&&s_match[1] ){
						var s_arr = s_match[1].split(',');
							s_arr.map(function(_style){
								var v_k = _style.match(/(\w+)\s*:(.+)/);
								if( v_k && v_k[1] && v_k[2] ){
									D['vbind_style'][ v_k[1] ] = v_k[2] ;
								}
							})
					}
				}else{
					D['vbind_attr'][key] = value ;
				}
			}
			// 处理static
			else{
				var match = each.match(/(.*)=["](.*)["]/);
			    var key   = match[1];
			    var value = match[2].trim();
			    if( key=='static_text' ){
			    	S['text'] = value ;
			    }else if( key=='class' ){
			    	S['classList'] = value ;
			    }else if( key=="style" ){
			    	S['cssText'] = value ;
			    }else{
			    	S['attr'][key] = value ;
			    }
			}
		});


		// 处理空数据
		!S.text ? (delete S.text) : null ;
		!S.classList ? (delete S.classList) : null ;
		!S.cssText ? (delete S.cssText) : null ;
		isEmptyObject(S.attr) ? (delete S.attr) : null ;

		isEmptyObject(D.vbind_double) ? (delete D.vbind_double) : null ;
		isEmptyObject(D.vbind_class) ? (delete D.vbind_class) : null ;
		!D.vbind_classList ? (delete D.vbind_classList) : null ;
		isEmptyObject(D.vbind_style) ? (delete D.vbind_style) : null ;
		isEmptyObject(D.vbind_attr) ? (delete D.vbind_attr) : null ;

		isEmptyObject(D.vif) ? (delete D.vif) : null ;
		isEmptyObject(D.vshow) ? (delete D.vshow) : null ;
		isEmptyObject(D.von) ? (delete D.von) : null ;


		return {
			data_static:S,
			data_v:D
		}
	};

// ****** 生成render ****** ;
	t.make_render = function(tree){
		var str = t.getStr(tree) ;
		// 替换render中的this为 $_THIS ;
		   	str = str.replace(/([^\w])this([^\w])/g,function(E,a,b){
		    	return a+'$_THIS'+b
		    });
		// 返回 ;
		return 'function(){'+
					'var $_THIS=this ;'+ 
					'var $_VFORLOOP=this.vforLoop.bind(this) ;'+ 
					'return '+str+';'+
				'}';
	};
	t.STR_V = function( dv ){
		var str = JSON.stringify( dv );
		str = str.replace( /("[\w\.-]+":)("[^"]+")/g ,function(E,a,b){
			return a+b.slice(1,-1)
		});
		return str ;
	};
	t.STR_STATIC = function(sv){
		return JSON.stringify(sv)
	};
	t.getStr= function(tree){
		if(tree.vfor_tree){// v-for元素
			var vfor_tree = tree.vfor_tree ;
			var v = tree['vfor_val'];
			var k = tree['vfor_key'];
			var list = tree['vfor_list'];
			return '{'+
						'tagName: "'+tree.tagName+'",'+
						'data_static: '+t.STR_STATIC( tree.data_static )+','+
						'data_v: '+t.STR_V( tree.data_v ) +','+
						'children: $_VFORLOOP('+list+',function('+v+','+k+'){'+
							' return {'+
								'tagName: "'+vfor_tree.tagName+'",'+
								'data_static: '+t.STR_STATIC( vfor_tree.data_static )+','+
								'data_v: '+ t.STR_V( vfor_tree.data_v )+','+
								'children: '+t.getChildrenStr(vfor_tree)+
							'}'+
						'})'+//_VFORLOOP over ;
					'}';
		}else{ //正常元素
			return '{'+
						'tagName: "'+tree.tagName+'",'+
						'data_static: '+t.STR_STATIC( tree.data_static )+','+
						'data_v: '+t.STR_V( tree.data_v )+','+
						'children: '+t.getChildrenStr(tree)+
					'}';
		}
	};
	t.getChildrenStr = function( tree ){
		var children = tree.children ;
		var arr=[] ;
		for(var i=0,len=children.length ; i<len ; i++){
			arr.push(t.getStr(children[i])) ;
		}
		return '['+arr.join()+']';
	};


module.exports = t ;






