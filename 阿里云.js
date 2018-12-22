`
163邮箱
18310024875 qwerqwer


github 
18310024875@163.com 
a13070198152


阿里云账号-->
	张琛1992 a13070198152   ; 18310024875 qwerqwer


服务器信息-->
	公网IP: 39.105.201.170 ;
	内网IP: 172.17.148.162 ;
	登录名 root ;
	登录密码 Qq123456 ;


阿里云控制台远程连接-->
	密码: 140190 ;


ssh连接-->远程连接
	( rm -rf ~/.ssh/known_hosts )
	sudo -i,
	ssh 39.105.201.170 
		
		Qq123456



-------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

数据库MariaDB --->
	( yum -y install mariadb mariadb-server ---> SET PASSWORD FOR 'root'@'localhost' = PASSWORD('newpass');  )
	账号 root 
	密码 qwer 
	systemctl start mariadb
	systemctl restart mariadb
	systemctl stop mariadb
	SHOW VARIABLES LIKE 'character%'

	(:access denied for user ''@'localhost' to database 'mysql' 解决方法;;;https://www.cnblogs.com/enjie/articles/7898564.html)
远程连接数据库 --->
mysql -h 39.105.201.170 -P 3306 -uroot -pqwer


教程 --->
	node https://blog.csdn.net/xerysherryx/article/details/78920978

	yum https://www.cnblogs.com/liaocheng/p/4243589.html

	VSFTPD //https://www.linuxidc.com/Linux/2017-11/148518.htm


处理进程 --->
	https://www.cnblogs.com/aipiaoborensheng/p/7676364.html

	netstat -lntp  #查看监听(Listen)的端口
	netstat -tulpn #查看所有运行中的服务的详细信息
	ps -aux        #显示使用内存的进程

    ps命令查找与进程相关的PID号：
    ps a 显示现行终端机下的所有程序，包括其他用户的程序。
    ps -A 显示所有程序。
    ps e 列出程序时，显示每个程序所使用的环境变量。
    kill －9 324


node forever 模块
https://blog.csdn.net/superjunjin/article/details/73252194


-------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

页面地址
	http://39.105.201.170:3000/index.html
`




<!-- 	<div class="mui-scroll-wrapper">
		<div class="mui-scroll">
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1><h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1><h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1><h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
		</div>
	</div> -->






<!--下拉刷新容器-->
<!-- <div id="refreshContainer" class="mui-content mui-scroll-wrapper">
  <div class="mui-scroll">
    <ul class="mui-table-view mui-table-view-chevron">


			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1><h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1><h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1><h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>
			<h1>1231231</h1>


    </ul>
  </div>
</div> -->



			// var ok = mui.init({
			// 	pullRefresh : {
			// 		container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
			// 		down : {
			// 			height:50,//可选,默认50.触发下拉刷新拖动距离,
			// 			auto: true,//可选,默认false.首次加载自动下拉刷新一次
			// 			contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
			// 			contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
			// 			contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
			// 		    callback :function(){
			// 		    	setTimeout(()=>{
			// 		    		mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
			// 		    	},2000)
			// 		    }
			// 		},
			// 		up : {
			// 				height:500,//可选.默认50.触发上拉加载拖动距离
			// 				auto:false,//可选,默认false.自动上拉加载一次
			// 				contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
			// 				contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
			// 				callback :function(){
			// 						mui('#refreshContainer').pullRefresh().refresh()
			// 						mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
			// 					},20000)
			// 				}
			// 		}
			// 	}
			// });		

				// this.picker = new mui.DtPicker({"value":"2015-10-10 10:10","beginYear":2010,"endYear":2020});
				// this.picker.show((rs)=>{


				// 	console.log(rs)
				// 	/*
				// 	 * rs.value 拼合后的 value
				// 	 * rs.text 拼合后的 text
				// 	 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
				// 	 * rs.m 月，用法同年
				// 	 * rs.d 日，用法同年
				// 	 * rs.h 时，用法同年
				// 	 * rs.i 分（minutes 的第二个字母），用法同年
				// 	 */
				// 	console.log( '选择结果: ' + rs.text )
				// 	/* 
				// 	 * 返回 false 可以阻止选择框的关闭
				// 	 * return false;
				// 	 */
				// 	/*
				// 	 * 释放组件资源，释放后将将不能再操作组件
				// 	 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
				// 	 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
				// 	 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
				// 	 */
				// 	this.picker.dispose();
				// 	this.picker = null;
				// });


				// mui.confirm('MUI是个好框架，确认？', 'Hello MUI', ['a','b'], function(e) {
				// 	console.log( e )
				// })


				// mui('.mui-scroll-wrapper').scroll({
				//  scrollY: true, //是否竖向滚动
				//  scrollX: false, //是否横向滚动
				//  startX: 0, //初始化时滚动至x
				//  startY: 0, //初始化时滚动至y
				//  indicators: true, //是否显示滚动条
				//  deceleration:0.0006, //阻尼系数,系数越小滑动越灵敏
				//  bounce: true //是否启用回弹
				// });




