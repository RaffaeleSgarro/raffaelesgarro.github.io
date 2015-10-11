---
author: admin
comments: false
date: 2012-04-12 16:11:40+00:00
slug: apache-mod_authz_host-what-do-order-deny-and-allow-mean
title: 'Apache mod_authz_host: what do Order, Deny and Allow mean?'
wordpress_id: 78
tags:
- apache
- configuration
---

This is really silly - I admit, but I never had to mess with Order, Deny and Allow inside <Directory> contexts in Apache configuration files and .htaccess. But Today I got an error: "403 Forbidden: You are not allowed to access / on this server". This turned out to be a missing +Indexes in my virtual host configuration, neverthless it was an opportunity to revise the Apache documentation.<!--more-->

    
    <VirtualHost *:80>
    	ServerName w.zybnet.com
    	ServerAdmin webmaster@localhost
    	DocumentRoot /data/projects
    
    	<Directory />
    		Options +Indexes -FollowSymLinks
    		AllowOverride None
    		Order Deny,Allow
    	</Directory>
    
    	ErrorLog ${APACHE_LOG_DIR}/error.log
    	LogLevel warn
    	CustomLog ${APACHE_LOG_DIR}/access.log combined
    </VirtualHost>


Options +Indexes means that when a request is made that maps to a directory of the filesystem and there are no index files (index.html, index.php, index.jsp) in there, Apache will list the content of the directory. This is what I wanted for my local server.

Order, Deny and Allow are used to tell if the request must be accepted or rejected. Allow and Deny are followed by ip addresses or hostnames. [Here are the rules](http://httpd.apache.org/docs/2.4/mod/mod_access_compat.html). You can see from the link that now this directives are in mod_access_compat, because [the new mod_authz_host has introduced Require](http://httpd.apache.org/docs/2.4/mod/mod_authz_host.html). However this is for 2.4, while on my Ubuntu 11.10 there is still 2.2
