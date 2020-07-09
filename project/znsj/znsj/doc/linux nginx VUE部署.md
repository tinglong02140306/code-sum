#Linux nginx VUE部署

----------

##1.安装nginx

###下载niginx依赖
	yum install gcc
	yum install pcre-devel
	yum install zlib zlib-devel
	yum install openssl openssl-devel

###下载nginx的tar包

	//创建文件夹
	cd /iflytek/sgy/service
	mkdir nginx
	cd nginx

###下载tar包

	Wget http://nginx.org/download/nginx-1.13.7.tar.gz
	//解压
	tar -xvf nginx-1.13.7.tar.gz

###安装nginx

	//进入nginx目录
	cd nginx
	//执行命令
	./configure	
	//执行make命令
	make
	//执行make install命令
	make install

###添加防火墙

	//添加80防火墙
	iptables -A INPUT -p tcp --dport 80 -j ACCEPT 
	//保存
	service iptables save 
	//重启
	systemctl restart iptables.service 
	//查看防火墙配置
	iptables -L -n

###nginx启动
	//启动命令
	/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
	
浏览器输入ip地址就能看到nginx成功启动页面
![](https://i.imgur.com/IEWQVDT.png)

----------

##2.上传VUE的disk文件

###创建文件夹

	cd /iflytek/sgy/server/
	//创建文件夹
	mkdir zwtjfx-web
	cd zwtjfx-web 
	//上传disk.zip文件到zwtjfx-web 解压
	unzip disk.zip
	//删除 disk.zip
	rm -rf disk.zip
	//目录授权
	chmod u+x *

web目录结构 /iflytek/sgy/server/zwtjfx-web

----------

##3.配置nginx
	//进入nginx目录
	cd /iflytek/sgy/server/nigin/conf
	//编辑nginx.conf
	vim nginx.conf

在nginx.conf server中添加一下配置
	
	//监听端口为80
	listen 80;
	//监听服务器
	server_name 10.54.19.71;
		//前端路径
        root   /iflytek/sgy/server/zwtjfx-web;
        index index.html;
        charset koi8-r;

        access_log  logs/host.access.log  main
		//请求 /zwsjfx的接口
        location /zwsjfx {
           proxy_redirect off;
           proxy_set_header        Host $host;
           proxy_set_header        X-Real-IP $remote_addr;
           proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
			//请求 /zwsjfx这个后缀的 都会转发到后端tomcat
           proxy_pass http://127.0.0.1:8085;}
		//请求前端
        location /#/hzdsj/ {
                root /iflytek/sgy/server/zwtjfx-web/zwtjfx-web;
                try_files $uri $uri/ /index.html last;
                index index.html;
		     }	
        location / {
          root /iflytek/sgy/server/zwtjfx-web;
          proxy_pass http://127.0.0.1:8085;
          try_files $uri $uri/ /index.html last;
          index index.html;
        }
###重启nginx服务
	/usr/local/nginx/sbin/nginx -t -c /usr/local/nginx/conf/nginx.conf
	cd /iflytek/sgy/server/nginx/sbin/
	./nginx -s reload


----------

#结束

####如文档有理解出错的地方，请指出，yfzhang18@iflytek 谢谢。 ####