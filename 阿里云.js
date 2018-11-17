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

-------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

页面地址
	http://39.105.201.170:3000/index.html
`





