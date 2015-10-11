---
author: Raffaele Sgarro
date: 2015-10-11T18:51:41+02:00
tags:
- linux
- tomcat
- socket
- urandom
title: Where is my Tomcat?
topics:
type: post
---

I just bootstrapped a droplet on DigitalOcean and deployed a Java app developed
with Spring boot. I quickly tested it by logging into and clicking here and there,
and then moved on configuring Nginx.

And suddenly my app disappeared!

    $ curl -I localhost:8080
    Connection refused

<!--more-->