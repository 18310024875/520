export default AJAX = ( options={} )=>{
    var method      = options.type ? options.type.toUpperCase() : 'GET';
    var params      = options.params || {};   // 拼接地址
    var data        = options.data || {} ;    // formdata 数据
    var contentType = options.contentType ;
    var timeout     = options.timeout || 20000 ;
    var url         = options.url || '';
    
    var beforeSend = options.beforeSend || function(){} ;
    var success    = options.success || function(){} ;
    var error      = options.error   || function(){} ;

    var XHR = new window.XMLHttpRequest() || new window.ActiveXObject( "Microsoft.XMLHTTP" );
        // 设置必备信息
        XHR.withCredentials = true ;
        // 设置函数
        XHR.onreadystatechange = function() {
            if( XHR.readyState == 4 && XHR.status == 200 ) { 
                success( XHR.responseText );
            }
        };
        // **** ajax 失败一律不反错
        XHR.onerror=function(e){
            console.error('XHR.onerror\n',e);
            error();
        };
        XHR.onabort=function(){
            console.error('XHR.onabort');
            error();
        };
        XHR.ontimeout=function(){
            console.error('XHR.ontimeout');
            error();
        };
        
    // 转译
    var U = str=>encodeURIComponent(str) ;


    // params拼接到url上
    var paramsArr=[];
    for( let key in params ){
        paramsArr.push(`${U(key)}=${U(params[key])}`)
    };
    if( paramsArr.length ){
        if( url.indexOf('?')==-1 ){
            url=`${url}?${paramsArr.join('&')}`;
        }else{
            url=`${url}&${paramsArr.join('&')}`;
        }
    };

    // 发送数据 ;
    if( method=='GET' ){
        // open 
        XHR.open( method , url, true);
        XHR.timeout = timeout ;
        // beforeSend
        beforeSend(XHR);
        // send
        XHR.send( null );
    }else{
        if( contentType=='json' ){
            XHR.open( method , url, true);
            XHR.timeout = timeout ;
            // setRequestHeader
            XHR.setRequestHeader("Content-Type", "application/json; charset=UTF-8"); 
            // beforeSend
            beforeSend(XHR);
            // send
            var sendStr = JSON.stringify(data) ;
            XHR.send( sendStr );
        }else{
            // open
            XHR.open( method , url, true);
            XHR.timeout = timeout ;
            // setRequestHeader
            XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"); 
            // beforeSend
            beforeSend(XHR);
            // data格式化
            var dataArr = [];
            for( let key in data ){
                dataArr.push(`${U(key)}=${U(data[key])}`)
            };
            // send ;
            var sendStr = dataArr.join('&') ;
            XHR.send( sendStr );
        }
    };

// XHR.setRequestHeader('X-Requested-With','XMLHttpRequest');
    return XHR ;
};
