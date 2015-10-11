---
author: admin
comments: true
date: 2012-02-21 00:56:40+00:00
slug: reverse-proxy-on-development-machine-to
title: Reverse proxy on development machine to get rid of ports in URLs
wordpress_id: 9
tags:
- apache
---

As a web developer I deal with several HTTP servers: Apache, Tomcat6, Tomcat7, Play!, WEBrick. In order to run all of them on the same machine (possibly at the same time) each needs to be bound on a port different than well known 80, so that you need to specify the port as part of the URL (for example in the browser).<!--more--> This is cumbersome and ugly: my purpose is to reach the servers as if they were on different machines, like this:



	
  * a.host.example.com (Tomcat6, localhost:8080)

	
  * b.host.example.com (WEBrick, localhost:8181)

	
  * c.host.example.com (Nginx, localhost:8282)

	
  * d.host.example.com (CouchDB, localhost:8383)

	
  * ...

<!--more-->

First step is to allow client machines to resolve hostnames (ie translate hostnames to IP addresses). This is accomplished by adding records to /etc/hosts or by adding CNAME records to the DNS server.

Enabling mod_proxy and mod_proxy_http is done this way

    
    $sudo a2enmod proxy
    $sudo a2enmod proxy_http


Now, let's configure Apache to act as a Reverse Proxy. The following ensures that Apache runs virtual hosts

    
    # /etc/apache2/ports.conf
    NameVirtualHost *:80
    Listen 80


Finally, let's create a site for each virtual host. For example, to link play.my.example.com to localhost:9000, put the following in a new /etc/apache2/sites-available/play

    
    <VirtualHost *:80>
       ServerName play.aldebaran.zybnet.com
       <Proxy *>
          Order deny,allow
          Allow from all
       </Proxy>
       ProxyPreserveHost On
       ProxyPass / http://localhost:9000/
       ProxyPassReverse / http://localhost:9000/
    </VirtualHost>


And enable it with

    
    $sudo a2ensite play
