export default function( Com ){

	function mapRoutesAddKey( routes , parentK ){
		routes.map( function(item){
			// 给组件配置标识指向自身 ;
			item.option.ROUTE = item ;
			// 唯一标识;
			item.key=parentK+'/'+item.path ;
			// 递归;
			!item.children ? item.children=[] : null ;
			mapRoutesAddKey( item.children , item.key )
		})	
	}

	function hash_getQuery( h ){
		if( h.indexOf('?')==-1 ){
			return {
				queryString:'',
				query:{},
			}
		}else{
			var str = h.match(/\?.*/)[0];
			var obj = {};
			var arr = str.match(/[?&]\w+=[^?&]*/g);
			if( arr ){
				arr.map(function(v){
					var m = v.match(/(\w+)=(.*)/);
					obj[m[1]] = m[2]
				})
			};
			return {
				queryString:str,
				query:obj
			};
		}
	}
	function hash_getPath( h ){
		var pathString = h.match(/#([\/\w]*)/)[1];
		var pathArr = pathString.split('/').filter(function(v){return v});
		return {
			pathString:pathString,
			pathArr:pathArr
		}
	}
	function hash_parse( h ){
		var P = hash_getPath( h );
		var Q = hash_getQuery( h );
		return {
			pathString:P.pathString,
			pathArr:P.pathArr,
			queryString:Q.queryString,
			query:Q.query
		}
	}

	// 路由实例 ;
	var r = Com.router = function( routerOpt , $rcomponent ){
		var this_ = this ;
		var routes = routerOpt.routes ;
		var defaultUrl = routerOpt.defaultUrl ;
		this.listener = routerOpt.listener || function(){} ;
		this.routerOpt = routerOpt;

		// 路由根router-view 添加key ;
		$rcomponent ? $rcomponent.$opt.ROUTE={ key:'/',children:routes } : null ;
		// routes添加key ;
		mapRoutesAddKey( routes , '' , $rcomponent );

		// 设置默认地址 ;
		defaultUrl && this.setDefaultUrl( defaultUrl ) ;

		// 路由地址
		this.history=[ location.href ];

		// 映射指令 ;
		Object.defineProperty(this_,'query',{
			get:function(){
				return (hash_getQuery( location.hash )).query ;
			}
		})
		Object.defineProperty(this_,'queryString',{
			get:function(){
				return (hash_getQuery( location.hash )).queryString ;
			}
		})
		Object.defineProperty(this_,'pathString',{
			get:function(){
				return (hash_getPath( location.hash )).pathString ;
			}
		})
		Object.defineProperty(this_,'pathArr',{
			get:function(){
				return (hash_getPath( location.hash )).pathArr ;
			}
		})

		// 监听变化
		this.listen();
	};

	// 设置默认地址 ;
	r.prototype.setDefaultUrl=function( dftUrl ){
		var h = location.hash ;
		if( location.hash ){
			var pathString = h.match(/#([\/\w]*)/)[1];	
			var pathArr = pathString.split('/').filter(function(v){return v});
			if( pathArr.length==0 ){
				location.hash=dftUrl ;
			};
		}else{
			location.hash=dftUrl ;
		}
	}
	// 开始监听变化
	r.prototype.listen=function(){
		var this_ = this ;

		window.onhashchange = function(){
			var old_url = this_.history[ this_.history.length-1 ] ;
			var new_url = location.href ;
			var old_parse = hash_parse( old_url );
			var new_parse = hash_parse( new_url );
			// path改变 
			if( new_parse.pathString != old_parse.pathString ){
				var same = [] ;
				var len = Math.min( new_parse.pathArr.length , old_parse.pathArr.length );
				for(var i=0 ; i<len ; i++ ){
					if( new_parse.pathArr[i]==old_parse.pathArr[i] ){
						same.push( new_parse.pathArr[i] );
					}else{
						break ;
					}
				};
				var beginKey = '/'+same.join('/');
				ROUTER_VIEW_KEY_BOX[ beginKey ] ? ROUTER_VIEW_KEY_BOX[ beginKey ].rednerAgain() : null ;
			}
			
			// // query改变
			// if( new_parse.queryString != old_parse.queryString ){
			// 	var $obj = {};
			// 	var $nq = new_parse.query ;
			// 	var $oq = old_parse.query ;

			// 	var $n_keys = Object.keys( $nq );
			// 	var $o_keys = Object.keys( $oq );
			// 	var $same = [] ;
			// 	$n_keys.map(function( key ){
			// 		$o_keys.indexOf(key)>-1 ? $same.push(key) : null ;
			// 	})
			// 	// 被删掉的
			// 	$o_keys.map(function( key ){
			// 		$same.indexOf(key)>-1 ? null : $obj[key]=null ;
			// 	})
			// 	// 增加的
			// 	$n_keys.map(function( key ){
			// 		$same.indexOf(key)>-1 ? null : $obj[key]=$nq[key] ;
			// 	})
			// 	// 改变的
			// 	$same.map(function( key ){
			// 		$nq[key]!=$oq[key] ? $obj[key]=$nq[key] : null ;
			// 	})
			// };

			// 函数
			this_.routerOpt.onchange ? this_.routerOpt.onchange(new_parse,old_parse) : null ;
			// 记录历史 ;
			this_.history.push( new_url );
		}
	}




// *********************************************************************************************************

// 记录存在routerview元素容器
var ROUTER_VIEW_KEY_BOX=window.rr = {}; 

// router-view组件 ;
Com.globalComponent('router-view',{
	// render
	render:function() {
		var $_THIS = this;
		var $_VFORLOOP = this.vforLoop.bind(this);
		return {
			tagName: "routeChildAppendHere",
			data_static: {},
			data_v: {},
			children: []
		};
	},
	// 挂载实例之前 , 动态替换组件 ;
	beforeMount:function(){
		if( this.$parent.$opt.ROUTE ){

			this.addInKeyContent();

			this.getNextAppend();
		}
	},
	destroyed:function(){
		if( this.$parent.$opt.ROUTE ){

			this.delFromKeyContent();
		}
	},

	methods:{
		addInKeyContent(){
			var PR = this.$parent.$opt.ROUTE ;
			ROUTER_VIEW_KEY_BOX[ PR.key ]=this ;
		},
		delFromKeyContent(){
			var PR = this.$parent.$opt.ROUTE ;
			delete ROUTER_VIEW_KEY_BOX[ PR.key ];
		},
		getNextAppend(){
			delete this.$components['routeChildAppendHere'];
			var PR = this.$parent.$opt.ROUTE ;
			var parse = hash_parse( location.href );
			var p_arr = PR.key.split('/').filter(function(v){return v});
			var nextName = parse.pathArr[ p_arr.length ];
			for(var i=0;i<PR.children.length;i++){
				var child = PR.children[i];
				if( child.path==nextName ){
					this.$components['routeChildAppendHere']=child['option'];
					break;
				}
			}
		},
		// 下级路由改变 重新挂载自己 ;
		rednerAgain(){
			try{
				this.$destroy();

				this.$mount( this.$el );
			}catch(e){};
		}
		
	}
});


}